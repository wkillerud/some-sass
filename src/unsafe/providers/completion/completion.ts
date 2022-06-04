'use strict';

import { CompletionList, CompletionItemKind, CompletionItem, MarkupKind, InsertTextFormat, CompletionItemTag, CompletionItemLabelDetails } from 'vscode-languageserver';
import type { TextDocument } from 'vscode-languageserver-textdocument';

import type { ISettings } from '../../types/settings';
import type StorageService from '../../services/storage';
import type { IScssDocument, ScssForward, ScssImport, ScssMixin, ScssUse } from '../../types/symbols';

import { createCompletionContext, CompletionContext } from './completion-context';
import { getLimitedString, asDollarlessVariable } from '../../utils/string';
import { getVariableColor } from '../../utils/color';
import { applySassDoc } from '../../utils/sassdoc';
import { doSassDocCompletion } from './sassdoc-completion';
import { doImportCompletion } from './import-completion';

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
		return doSassDocCompletion(text, offset, context);
	}

	// Drop suggestions inside `//` and `/* */` comments
	if (context.comment) {
		return completions;
	}

	if (context.import) {
		return doImportCompletion(document, settings, context, storage);
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

const rePrivate = /^\$?[_-].*$/;

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

/**
 * Return Mixin as string.
 */
 function makeMixinDocumentation(symbol: ScssMixin): string {
	const args = symbol.parameters.map(item => `${item.name}: ${item.value}`).join(', ');
	return `${symbol.name}(${args})`;
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
