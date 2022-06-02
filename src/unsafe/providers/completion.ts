'use strict';

import { CompletionList, CompletionItemKind, CompletionItem, MarkupKind, InsertTextFormat, CompletionItemTag, CompletionItemLabelDetails } from 'vscode-languageserver';
import type { TextDocument } from 'vscode-languageserver-textdocument';

import type { ISettings } from '../types/settings';
import type StorageService from '../services/storage';
import type { IScssDocument, ScssForward, ScssImport, ScssMixin, ScssUse } from '../types/symbols';

import { getCurrentWord, getLimitedString, getTextBeforePosition, asDollarlessVariable } from '../utils/string';
import { getVariableColor } from '../utils/color';
import { applySassDoc } from '../utils/sassdoc';
import { sassDocAnnotations } from '../sassdocAnnotations';
import { getLinesFromText } from '../utils/document';
import { tokenizer } from 'scss-symbols-parser';

type CompletionContext = {
	word: string;
	textBeforeWord: string;
	comment: boolean;
	sassDoc: boolean;
	namespace: string | null;
	variable: boolean;
	function: boolean;
	mixin: boolean;
};

// RegExp's
const rePropertyValue = /.*:\s*/;
const reEmptyPropertyValue = /.*:\s*$/;
const reQuotedValueInString = /['"](?:[^'"\\]|\\.)*['"]/g;
const reMixinReference = /.*@include\s+(.*)/;
const reComment = /^.*(\/(\/|\*)|\*)/;
const reSassDoc = /^[\\s]*\/\/\/.*$/;
const reQuotes = /['"]/;
const rePrivate = /^\$?[_-].*$/;

/**
 * Return Mixin as string.
 */
function makeMixinDocumentation(symbol: ScssMixin): string {
	const args = symbol.parameters.map(item => `${item.name}: ${item.value}`).join(', ');
	return `${symbol.name}(${args})`;
}

/**
 * Check context for Variables suggestions.
 */
function checkVariableContext(
	word: string,
	isInterpolation: boolean,
	isPropertyValue: boolean,
	isEmptyValue: boolean,
	isQuotes: boolean,
	isNamespace: boolean
): boolean {
	if (isPropertyValue && !isEmptyValue && !isQuotes) {
		if (isNamespace && word.endsWith(".")) {
			return true;
		}
		return word.includes('$');
	} else if (isQuotes) {
		return isInterpolation;
	}

	return word[0] === '$' || isInterpolation || isEmptyValue;
}

/**
 * Check context for Mixins suggestions.
 */
function checkMixinContext(textBeforeWord: string, isPropertyValue: boolean): boolean {
	return !isPropertyValue && reMixinReference.test(textBeforeWord);
}

/**
 * Check context for Function suggestions.
 */
function checkFunctionContext(
	textBeforeWord: string,
	isInterpolation: boolean,
	isPropertyValue: boolean,
	isEmptyValue: boolean,
	isQuotes: boolean,
	isNamespace: boolean,
	settings: ISettings
): boolean {
	if (isPropertyValue && !isEmptyValue && !isQuotes) {
		if (isNamespace) {
			return true;
		}
		const lastChar = textBeforeWord.substr(-2, 1);
		return settings.suggestFunctionsInStringContextAfterSymbols.indexOf(lastChar) !== -1;
	} else if (isQuotes) {
		return isInterpolation;
	}

	return false;
}

function isCommentContext(text: string): boolean {
	return reComment.test(text.trim());
}

function isSassDocContext(text: string): boolean {
	return reSassDoc.test(text);
}

function isInterpolationContext(text: string): boolean {
	return text.includes('#{');
}

function checkNamespaceContext(currentWord: string): string | null {
	if (currentWord.length === 0 || !currentWord.includes(".")) {
		return null;
	}
	return currentWord.substring(0, currentWord.indexOf("."));
}

function createCompletionContext(text: string, offset: number, settings: ISettings): CompletionContext {
	const currentWord = getCurrentWord(text, offset);
	const textBeforeWord = getTextBeforePosition(text, offset);

	// Is "#{INTERPOLATION}"
	const isInterpolation = isInterpolationContext(currentWord);

	// Information about current position
	const isPropertyValue = rePropertyValue.test(textBeforeWord);
	const isEmptyValue = reEmptyPropertyValue.test(textBeforeWord);
	const isQuotes = reQuotes.test(textBeforeWord.replace(reQuotedValueInString, ''));

	// Is namespace, e.g. `namespace.$var` or `@include namespace.mixin` or `namespace.func()`
	const namespace = checkNamespaceContext(currentWord)

	return {
		word: currentWord,
		textBeforeWord,
		comment: isCommentContext(textBeforeWord),
		sassDoc: isSassDocContext(textBeforeWord),
		namespace,
		variable: checkVariableContext(currentWord, isInterpolation, isPropertyValue, isEmptyValue, isQuotes, Boolean(namespace)),
		function: checkFunctionContext(
			textBeforeWord,
			isInterpolation,
			isPropertyValue,
			isEmptyValue,
			isQuotes,
			Boolean(namespace),
			settings
		),
		mixin: checkMixinContext(textBeforeWord, isPropertyValue)
	};
}

function createVariableCompletionItems(
	scssDocument: IScssDocument,
	currentDocument: TextDocument,
	context: CompletionContext,
	hiddenSymbols: string[] = [],
	prefix = ''
): CompletionItem[] {
	const completions: CompletionItem[] = [];

	for (let variable of scssDocument.variables.values()) {
		const color = variable.value ? getVariableColor(variable.value) : null;
		const completionKind = color ? CompletionItemKind.Color : CompletionItemKind.Variable;

		let documentation = getLimitedString(color ? color.toString() : variable.value || '');
		let detail = `Variable declared in ${scssDocument.fileName}`;

		let label = variable.name;
		let sortText = undefined;
		let filterText = undefined;
		let insertText = undefined;

		if (variable.mixin) {
			// Add 'argument from MIXIN_NAME' suffix if Variable is Mixin argument
			detail = `Argument from ${variable.mixin}, ${detail.toLowerCase()}`;
		} else {
			const isPrivate = variable.name.match(rePrivate);
			const isFromCurrentDocument = scssDocument.uri === currentDocument.uri;

			if (isPrivate && !isFromCurrentDocument) {
				continue;
			}

			if (hiddenSymbols.includes(variable.name)) {
				continue;
			}

			if (isPrivate) {
				sortText = label.replace(/^$[_-]/, '');
			}

			const sassdoc = applySassDoc(
				variable,
				{ displayOptions: { description: true, deprecated: true, type: true }}
			);
			if (sassdoc) {
				documentation += `\n\n${sassdoc}`;
			}
		}

		if (context.namespace) {
			// Avoid ending up with namespace.prefix-$variable
			label = `$${prefix}${asDollarlessVariable(variable.name)}`;
			// The `.` in the namespace gets replaced unless we have a $ charachter after it
			insertText = context.word.endsWith(".") ? `.${label}` : label;
			filterText = `${context.namespace !== "*" ? context.namespace : ""}${insertText}`;
		}

		completions.push({
			label,
			filterText,
			insertText,
			sortText,
			commitCharacters: [';', ','],
			kind: completionKind,
			detail,
			tags: Boolean(variable.sassdoc?.deprecated) ? [CompletionItemTag.Deprecated] : [],
			documentation: {
				kind: MarkupKind.Markdown,
				value: documentation,
			},
		});
	}

	return completions;
}

function createMixinCompletionItems(
	scssDocument: IScssDocument,
	currentDocument: TextDocument,
	context: CompletionContext,
	hiddenSymbols: string[] = [],
	prefix = ''
): CompletionItem[] {
	const completions: CompletionItem[] = [];

	for (let mixin of scssDocument.mixins.values()) {
		const isPrivate = mixin.name.match(rePrivate);
		const isFromCurrentDocument = scssDocument.uri === currentDocument.uri;
		if (isPrivate && !isFromCurrentDocument) {
			// Don't suggest private mixins from other files
			continue;
		}

		if (hiddenSymbols.includes(mixin.name)) {
			continue;
		}

		let documentation = makeMixinDocumentation(mixin);
		const sassdoc = applySassDoc(
			mixin,
			{ displayOptions: { content: true, description: true,  deprecated: true, output: true }}
		);
		if (sassdoc) {
			documentation += `\n____\n${sassdoc}`;
		}

		// Client needs the namespace as part of the text that is matched,
		// and inserted text needs to include the `.` which will otherwise
		// be replaced.
		const label = context.namespace ? `${prefix}${mixin.name}` : mixin.name;
		const filterText = context.namespace
			? context.namespace !== "*"
				? `${context.namespace}.${prefix}${mixin.name}`
				: `${prefix}${mixin.name}`
			: mixin.name;
		let insertText = context.namespace && context.namespace !== "*" ? `.${prefix}${mixin.name}` : mixin.name;
		const sortText = isPrivate ? label.replace(/^$[_-]/, '') : undefined;

		// Use the SnippetString syntax to provide smart completions of parameter names
		let labelDetails: CompletionItemLabelDetails | undefined = undefined;
		if (mixin.parameters.length > 0) {
			// The snippet syntax does not like `-` in placeholder names, so make them camel case.
			// These are not suggestions for keyword arguments, it's fine.
			const parametersSnippet = mixin.parameters.map((p, index) => "${" + (index + 1) + ":" + asDollarlessVariable(p.name) + "}").join(", ")
			const parameterSignature = mixin.parameters.map(p => p.name).join(", ");
			insertText += `(${parametersSnippet})`;
			labelDetails = {
				detail: `(${parameterSignature})`,
			};
		}

		// Not all mixins have @content, but when they do, be smart about adding brackets
		// and move the cursor to be ready to add said contents.
		if (mixin.sassdoc?.content) {
			insertText += " {\n\t$0\n}"
		}

		const detail = `Mixin declared in ${scssDocument.fileName}`;

		completions.push({
			label,
			labelDetails,
			filterText,
			sortText,
			kind: CompletionItemKind.Snippet,
			detail,
			insertTextFormat: InsertTextFormat.Snippet,
			insertText,
			tags: Boolean(mixin.sassdoc?.deprecated) ? [CompletionItemTag.Deprecated] : [],
			documentation: {
				kind: MarkupKind.Markdown,
				value: documentation,
			}
		});
	}

	return completions;
}

function createFunctionCompletionItems(
	scssDocument: IScssDocument,
	currentDocument: TextDocument,
	context: CompletionContext,
	hiddenSymbols: string[] = [],
	prefix = ''
): CompletionItem[] {
	const completions: CompletionItem[] = [];

	for (let func of scssDocument.functions.values()) {
		const isPrivate = func.name.match(rePrivate);
		const isFromCurrentDocument = scssDocument.uri === currentDocument.uri;
		if (isPrivate && !isFromCurrentDocument) {
			// Don't suggest private functions from other files
			continue;
		}

		if (hiddenSymbols.includes(func.name)) {
			continue;
		}

		// Client needs the namespace as part of the text that is matched,
		// and inserted text needs to include the `.` which will otherwise
		// be replaced.
		const label = context.namespace ? `${prefix}${func.name}` : func.name;
		const filterText = context.namespace
			? `${context.namespace !== "*"
				? context.namespace
				: ""}.${prefix}${func.name}`
			: func.name;
		let insertText = context.namespace
			? context.namespace !== "*"
				? `.${prefix}${func.name}`
				: `${prefix}${func.name}`
			: func.name;
		const sortText = isPrivate ? label.replace(/^$[_-]/, '') : undefined;

		// Use the SnippetString syntax to provide smart completions of parameter names
		let labelDetails: CompletionItemLabelDetails | undefined = undefined;
		if (func.parameters.length > 0) {
			// The snippet syntax does not like `-` in placeholder names, so make them camel case.
			// These are not suggestions for keyword arguments, it's fine.
			const parametersSnippet = func.parameters.map((p, index) => "${" + (index + 1) + ":" + asDollarlessVariable(p.name) + "}").join(", ")
			const functionSignature = func.parameters.map(p => p.name).join(", ");
			insertText += `(${parametersSnippet})`;
			labelDetails = {
				detail: `(${functionSignature})`,
			};
		}


		let documentation = makeMixinDocumentation(func);
		const sassdoc = applySassDoc(
			func,
			{ displayOptions: { description: true, deprecated: true, return: true }}
		);
		if (sassdoc) {
			documentation += `\n____\n${sassdoc}`;
		}

		const detail = `Function declared in ${scssDocument.fileName}`;

		completions.push({
			label,
			labelDetails,
			filterText,
			sortText,
			kind: CompletionItemKind.Function,
			detail,
			insertTextFormat: InsertTextFormat.Snippet,
			insertText,
			tags: Boolean(func.sassdoc?.deprecated) ? [CompletionItemTag.Deprecated] : [],
			documentation: {
				kind: MarkupKind.Markdown,
				value: documentation,
			}
		});
	};

	return completions;
}

export function doCompletion(
	document: TextDocument,
	offset: number,
	settings: ISettings,
	storage: StorageService
): CompletionList {
	let completions = CompletionList.create([], false);

	const text = document.getText();
	const context = createCompletionContext(text, offset, settings);

	if (context.sassDoc) {
		if (!context.word) {
			const textAfterCursor = text.substring(offset);
			const isCursorAboveFunction = textAfterCursor.match(/^(?:\r\n|\r|\n)\s*@function/);
			const isCursorAboveMixin = textAfterCursor.match(/^(?:\r\n|\r|\n)\s*@mixin/);

			if (isCursorAboveFunction || isCursorAboveMixin) {
				const textBeforeCursor = text.substring(0, offset);
				const linesBeforeCursor = getLinesFromText(textBeforeCursor);

				let isCursorBelowSassDocLine = linesBeforeCursor[linesBeforeCursor.length - 2]?.startsWith("///");
				if (!isCursorBelowSassDocLine) {
					return doSassDocParameterCompletion(textAfterCursor, isCursorAboveFunction ? 'function' : 'mixin');
				}
			}
		}

		return doSassDocAnnotationCompletion(context);
	}

	// Drop suggestions inside `//` and `/* */` comments
	if (context.comment) {
		return completions;
	}

	if (context.namespace) {
		completions = doNamespacedCompletion(document, settings, context, storage);
	}

	const scssDocument = storage.get(document.uri);
	if (!scssDocument) {
		// Don't know how this would happen, but ¯\_(ツ)_/¯
		return completions;
	}

	const wildcardNamespaces: ScssUse[] = [];
	for (const use of scssDocument.uses.values()) {
		if (use.namespace === "*" && use.link.target) {
			wildcardNamespaces.push(use);
		}
	}

	if (wildcardNamespaces.length) {
		const accumulator: Map<string, CompletionItem[]> = new Map();

		for (const use of wildcardNamespaces) {
			const namespaceRootDocument = storage.get(use.link.target!);
			if (!namespaceRootDocument) {
				continue;
			}
			const wildcardContext = {
				...context,
				namespace: "*",
			};
			traverseTree(document, settings, wildcardContext, storage, accumulator, namespaceRootDocument);
		}

		completions.items = completions.items.concat([...accumulator.values()].flat());
	}

	// If at this point we're not in a namespace context,
	// but the user only wants suggestions from namespaces
	// (we consider `*` a namespace), we should return an empty list.
	if (settings.suggestFromUseOnly) {
		return completions;
	}

	for (const scssDocument of storage.values()) {
		if (!settings.suggestAllFromOpenDocument && scssDocument.uri === document.uri) {
			continue;
		}

		if (settings.suggestVariables && context.variable) {
			const variables = createVariableCompletionItems(scssDocument, document, context);
			completions.items = completions.items.concat(variables);
		}
		if (settings.suggestMixins && context.mixin) {
			const mixins = createMixinCompletionItems(scssDocument, document, context);
			completions.items = completions.items.concat(mixins);
		}
		if (settings.suggestFunctions && context.function) {
			const functions = createFunctionCompletionItems(scssDocument, document, context);
			completions.items = completions.items.concat(functions);
		}
	}

	return completions;
}


function doNamespacedCompletion(document: TextDocument, settings: ISettings, context: CompletionContext, storage: StorageService): CompletionList {
	const completions = CompletionList.create([], false);
	const scssDocument = storage.get(document.uri);
	if (!scssDocument) {
		return completions;
	}
	const namespace = context.namespace;

	let use: ScssUse | null = null;
	for (const candidate of scssDocument.uses.values()) {
		if (candidate.namespace === namespace || candidate.namespace === `_${namespace}`) {
			use = candidate;
			break;
		}
	}

	if (!use || !use.link.target) {
		return completions;
	}

	const namespaceRootDocument = storage.get(use.link.target);
	if (!namespaceRootDocument) {
		return completions;
	}

	const accumulator: Map<string, CompletionItem[]> = new Map();
	traverseTree(document, settings, context, storage, accumulator, namespaceRootDocument);

	completions.items = [...accumulator.values()].flat();

	return completions;
}

function traverseTree(document: TextDocument, settings: ISettings, context: CompletionContext, storage: StorageService, accumulator: Map<string, CompletionItem[]>, leaf: IScssDocument, hiddenSymbols: string[] = [], accumulatedPrefix = "") {
	if (accumulator.has(leaf.uri)) {
		return;
	}

	const scssDocument = storage.get(leaf.uri);
	if (!scssDocument) {
		return;
	}


	let completionItems: CompletionItem[] = [];

	if (settings.suggestAllFromOpenDocument || scssDocument.uri !== document.uri) {
		if (settings.suggestVariables && context.variable) {
			const variables = createVariableCompletionItems(scssDocument, document, context, hiddenSymbols, accumulatedPrefix);
			completionItems = completionItems.concat(variables);
		}
		if (settings.suggestMixins && context.mixin) {
			const mixins = createMixinCompletionItems(scssDocument, document, context, hiddenSymbols, accumulatedPrefix);
			completionItems = completionItems.concat(mixins);
		}
		if (settings.suggestFunctions && context.function) {
			const functions = createFunctionCompletionItems(scssDocument, document, context, hiddenSymbols, accumulatedPrefix);
			completionItems = completionItems.concat(functions);
		}
	}

	accumulator.set(leaf.uri, completionItems);

	// Check to see if we have to go deeper
	for (const child of leaf.getLinks()) {
		if (!child.link.target || (child as ScssImport).dynamic || (child as ScssImport).css) {
			continue;
		}

		const childDocument = storage.get(child.link.target);
		if (!childDocument) {
			continue;
		}

		let hidden = hiddenSymbols;
		if ((child as ScssForward).hide && (child as ScssForward).hide.length) {
			hidden = hiddenSymbols.concat((child as ScssForward).hide);
		}


		let prefix = accumulatedPrefix;
		if ((child as ScssForward).prefix) {
			prefix += (child as ScssForward).prefix;
		}

		traverseTree(document, settings, context, storage, accumulator, childDocument, hidden, prefix);
	}
}

function doSassDocAnnotationCompletion({ textBeforeWord }: CompletionContext): CompletionList {
	const completions = CompletionList.create([], true);

	if (textBeforeWord.includes("@example ")) {
		completions.items.push({
			label: 'scss',
			sortText: '-',
			kind: CompletionItemKind.Value,
		});
		completions.items.push({
			label: 'css',
			kind: CompletionItemKind.Value,
		});
		completions.items.push({
			label: 'markup',
			kind: CompletionItemKind.Value,
		});
		completions.items.push({
			label: 'javascript',
			sortText: 'y',
			kind: CompletionItemKind.Value,
		});
		return completions;
	}

	for (const { annotation, aliases, insertText, insertTextFormat } of sassDocAnnotations) {
		const item = {
			label: annotation,
			kind: CompletionItemKind.Keyword,
			insertText,
			insertTextFormat,
			sortText: '-', // Push ourselves to the head of the list
		};

		completions.items.push(item);

		if (aliases) {
			for (const alias of aliases) {
				completions.items.push({
					...item,
					label: alias,
					insertText: insertText ? insertText.replace(annotation, alias) : insertText,
				});
			}
		}
	}

	return completions;
}

function doSassDocParameterCompletion(textAfterCursor: string, context: 'function' | 'mixin'): CompletionList{
	const completions = CompletionList.create([], true);
	const tokens = tokenizer(textAfterCursor);

	const isCursorAboveMixinWithParameters = textAfterCursor.match(/^(?:\r\n|\r|\n)\s*@mixin .+\(.+\)/);
	if (context === 'mixin' && !isCursorAboveMixinWithParameters) {
		// If this is a mixin without parameters we don't have many options for clever suggestions.
		// Look for a @content, but otherwise just suggest an @output and a description.

		let hasContentDirective = false;
		let bracketCount = 0;
		const openBracket = tokens.findIndex(t => t[0] === '{');
		for (let i = openBracket; i < tokens.length; i++) {
			const token = tokens[i];
			if (token[0] === '{') {
				bracketCount++;
			} else if (token[0] === '}') {
				bracketCount--;
				if (bracketCount === 0) {
					break;
				}
			}

			if (token[1] === '@content') {
				hasContentDirective = true;
				break;
			}
		}

		const contentSnippet = hasContentDirective ? '\n/// @content ${1}' : '';
		const snippet = ` \${0}${contentSnippet}\n/// @output \${2}`;

		completions.items.push({
			label: 'SassDoc block',
			insertText: snippet,
			insertTextFormat: InsertTextFormat.Snippet,
			sortText: '-'
		});

		return completions;
	}

	const [_, text] = tokens.find(t => t[0] === 'brackets') as ['brackets', string, number];

	const ppl = 2; // Number of placeholders in the /// @param snippet below

	const parameters = text.replace(/[()]/g, "").split(",");
	const parameterSnippet: string = parameters.map((p, i) => {
		let [parameterName, defaultValue] = p.split(":").map(nd => nd.trim()) as [string, string | undefined];

		let typeSnippet = 'type';
		let defaultValueSnippet = '';
		if (defaultValue) {
			defaultValueSnippet =  ` [${defaultValue}]`;

			// Try to give a sensible default type if we can
			try {
				if (defaultValue === 'true' || defaultValue === 'false') {
					typeSnippet = 'Boolean';
				} else if (defaultValue.match(/^["']/)) {
					typeSnippet = 'String'
				} else if (defaultValue.startsWith('#') || defaultValue.startsWith('rgb')  || defaultValue.startsWith('hsl')) {
					typeSnippet = 'Color';
				} else {
					const maybeNumber = Number.parseFloat(defaultValue);
					if (!Number.isNaN(maybeNumber)) {
						typeSnippet = 'Number';
					}
				}
			} catch (e) {
				// Oops! Carry on with a generic suggestion.
			}
		}

		return `/// @param {\${${(i * ppl) + 1}:${typeSnippet}}} \\${parameterName}${defaultValueSnippet} \${${(i * ppl) + 2}:-}`;
	}).join('\n');

	const isFunc = context === 'function';
	const returnSnippet = `\n/// @${isFunc ? `return {\${${(ppl * parameters.length) + 1}:type}}` : 'output'} \${${(ppl * parameters.length) + 2}:-}`;
	const snippet = ` \${0}\n${parameterSnippet}${returnSnippet}`;

	completions.items.push({
		label: 'SassDoc block',
		insertText: snippet,
		insertTextFormat: InsertTextFormat.Snippet,
		sortText: '-'
	});

	return completions;
}
