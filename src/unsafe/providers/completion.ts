'use strict';

import { CompletionList, CompletionItemKind, CompletionItem, MarkupKind, InsertTextFormat, CompletionItemTag, CompletionItemLabelDetails } from 'vscode-languageserver';
import type { TextDocument } from 'vscode-languageserver-textdocument';

import type { ISettings } from '../types/settings';
import type StorageService from '../services/storage';
import type { IScssDocument, ScssImport, ScssMixin, ScssUse } from '../types/symbols';

import { getCurrentWord, getLimitedString, getTextBeforePosition, asDollarlessVariable } from '../utils/string';
import { getVariableColor } from '../utils/color';
import { applySassDoc } from '../utils/sassdoc';

type CompletionContext = { word: string; comment: boolean; namespace: string | null; variable: boolean; function: boolean; mixin: boolean; };

// RegExp's
const rePropertyValue = /.*:\s*/;
const reEmptyPropertyValue = /.*:\s*$/;
const reQuotedValueInString = /['"](?:[^'"\\]|\\.)*['"]/g;
const reMixinReference = /.*@include\s+(.*)/;
const reComment = /^(\/(\/|\*)|\*)/;
const reQuotes = /['"]/;
const rePrivate = /^\$[_-].*$/;

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

function isInterpolationContext(text: string): boolean {
	return text.includes('#{');
}

function checkNamespaceContext(currentWord: string): string | null {
	if (currentWord.length === 0 || !currentWord.includes(".")) {
		return null;
	}
	return currentWord.substring(0, currentWord.indexOf("."));
}

function createCompletionContext(document: TextDocument, offset: number, settings: ISettings): CompletionContext {
	const text = document.getText();
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
		comment: isCommentContext(textBeforeWord),
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
	context: CompletionContext
): CompletionItem[] {
	const completions: CompletionItem[] = [];

	for (let variable of scssDocument.variables.values()) {
		const color = variable.value ? getVariableColor(variable.value) : null;
		const completionKind = color ? CompletionItemKind.Color : CompletionItemKind.Variable;

		let documentation = getLimitedString(color ? color.toString() : variable.value || '');
		let detail = `Variable declared in ${scssDocument.fileName}`;
		if (variable.mixin) {
			// Add 'argument from MIXIN_NAME' suffix if Variable is Mixin argument
			detail = `Argument from ${variable.mixin}, ${detail.toLowerCase()}`;
		} else {
			const isPrivate = variable.name.match(rePrivate);
			const isFromCurrentDocument = scssDocument.uri === currentDocument.uri;

			if (isPrivate && !isFromCurrentDocument) {
				continue;
			}

			const sassdoc = applySassDoc(
				variable,
				{ displayOptions: { description: true, deprecated: true, type: true }}
			);
			if (sassdoc) {
				documentation += `\n\n${sassdoc}`;
			}
		}

		let filterText = variable.name;
		let insertText = variable.name;

		if (context.namespace) {
			filterText = `${context.namespace}.${variable.name}`;
			insertText = `.${variable.name}`;
		}

		completions.push({
			label: variable.name,
			filterText,
			insertText,
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
	context: CompletionContext
): CompletionItem[] {
	const completions: CompletionItem[] = [];

	for (let mixin of scssDocument.mixins.values()) {
		const isPrivate = mixin.name.match(rePrivate);
		const isFromCurrentDocument = scssDocument.uri === currentDocument.uri;
		if (isPrivate && !isFromCurrentDocument) {
			// Don't suggest private mixins from other files
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
		const filterText = context.namespace ? `${context.namespace}.${mixin.name}` : mixin.name;
		let insertText = context.namespace ? `.${mixin.name}` : mixin.name;

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
		if (sassdoc && sassdoc.includes("@content")) {
			insertText += " {\n\t$0\n}"
		}

		const detail = `Mixin declared in ${scssDocument.fileName}`;

		completions.push({
			label: mixin.name,
			labelDetails,
			filterText,
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
	context: CompletionContext
): CompletionItem[] {
	const completions: CompletionItem[] = [];

	for (let func of scssDocument.functions.values()) {
		const isPrivate = func.name.match(rePrivate);
		const isFromCurrentDocument = scssDocument.uri === currentDocument.uri;
		if (isPrivate && !isFromCurrentDocument) {
			// Don't suggest private functions from other files
			continue;
		}

		// Client needs the namespace as part of the text that is matched,
		// and inserted text needs to include the `.` which will otherwise
		// be replaced.
		const filterText = context.namespace ? `${context.namespace}.${func.name}` : func.name;
		let insertText = context.namespace ? `.${func.name}` : func.name;

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
			label: func.name,
			labelDetails,
			filterText,
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
	const completions = CompletionList.create([], false);
	const context = createCompletionContext(document, offset, settings);

	// Drop suggestions inside `//` and `/* */` comments
	if (context.comment) {
		return completions;
	}

	let iterator: IterableIterator<IScssDocument> = storage.values();
	if (context.namespace) {
		const scssDocument = storage.get(document.uri);
		if (scssDocument) {
			const namespacedIterator = buildNamespacedIterator(scssDocument, context, storage);
			if (namespacedIterator) {
				iterator = namespacedIterator;
			}
		}
	}

	for (const scssDocument of iterator) {
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

function buildNamespacedIterator(document: IScssDocument, context: CompletionContext, storage: StorageService): IterableIterator<IScssDocument> | null {
	const namespace = context.namespace;

	let use: ScssUse | null = null;
	for (const candidate of document.uses.values()) {
		if (candidate.namespace === namespace || candidate.namespace === `_${namespace}`) {
			use = candidate;
			break;
		}
	}

	if (!use || !use.link.target) {
		return null;
	}

	const namespaceRootDocument = storage.get(use.link.target);
	if (!namespaceRootDocument) {
		return null;
	}

	const accumulator: Map<string, IScssDocument> = new Map();
	traverseTree(accumulator, namespaceRootDocument, storage);

	return accumulator.values();
}

function traverseTree(accumulator: Map<string, IScssDocument>, leaf: IScssDocument, storage: StorageService) {
	if (!accumulator.has(leaf.uri)) {
		accumulator.set(leaf.uri, leaf);
	}

	for (const child of leaf.getLinks()) {
		if (!child.link.target || (child as ScssImport).dynamic || (child as ScssImport).css) {
			continue;
		}

		const childDocument = storage.get(child.link.target);
		if (!childDocument) {
			continue;
		}

		traverseTree(accumulator, childDocument, storage);
	}
}
