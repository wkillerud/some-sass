import {
	CompletionItemKind,
	InsertTextFormat,
	CompletionItemTag,
	MarkupContent,
} from "vscode-languageserver";
import type {
	CompletionItem,
	CompletionItemLabelDetails,
} from "vscode-languageserver";
import type { TextDocument } from "vscode-languageserver-textdocument";
import type { IScssDocument, ScssFunction } from "../../parser";
import type { CompletionContext } from "./completion-context";
import {
	makeFunctionDocumentation,
	mapParameterSignature,
	mapParameterSnippet,
	rePrivate,
} from "./completion-utils";

export function createFunctionCompletionItems(
	scssDocument: IScssDocument,
	currentDocument: TextDocument,
	context: CompletionContext,
	hiddenSymbols: string[] = [],
	shownSymbols: string[] = [],
	prefix = "",
): CompletionItem[] {
	const completions: CompletionItem[] = [];

	for (const func of scssDocument.functions.values()) {
		const isPrivate = func.name.match(rePrivate);
		const isFromCurrentDocument = scssDocument.uri === currentDocument.uri;
		if (isPrivate && !isFromCurrentDocument) {
			// Don't suggest private functions from other files
			continue;
		}

		if (hiddenSymbols.includes(func.name)) {
			continue;
		}

		if (shownSymbols.length > 0 && !shownSymbols.includes(func.name)) {
			continue;
		}

		// Client needs the namespace as part of the text that is matched,
		// and inserted text needs to include the `.` which will otherwise
		// be replaced (except when we're embedded in Vue, Svelte or Astro).
		const label = context.namespace ? `${prefix}${func.name}` : func.name;
		const filterText = context.namespace
			? `${context.namespace !== "*" ? context.namespace : ""}.${prefix}${
					func.name
				}`
			: func.name;
		const isEmbedded = context.originalExtension !== "scss";
		const insertText = context.namespace
			? context.namespace !== "*" && !isEmbedded
				? `.${prefix}${func.name}`
				: `${prefix}${func.name}`
			: func.name;
		const sortText = isPrivate ? label.replace(/^$[_-]/, "") : undefined;

		const documentation = makeFunctionDocumentation(func, scssDocument);

		const requiredParameters = func.parameters.filter((p) => !p.value);
		const parametersSnippet = requiredParameters
			.map(mapParameterSnippet)
			.join(", ");
		const functionSignature = requiredParameters
			.map(mapParameterSignature)
			.join(", ");
		completions.push(
			makeFunctionCompletion(
				label,
				{
					detail: `(${functionSignature})`,
				},
				filterText,
				sortText,
				`${insertText}(${parametersSnippet})`,
				func,
				documentation,
			),
		);

		if (requiredParameters.length !== func.parameters.length) {
			const parametersSnippet = func.parameters
				.map(mapParameterSnippet)
				.join(", ");
			const functionSignature = func.parameters
				.map(mapParameterSignature)
				.join(", ");
			completions.push(
				makeFunctionCompletion(
					label,
					{
						detail: `(${functionSignature})`,
					},
					filterText,
					sortText,
					`${insertText}(${parametersSnippet})`,
					func,
					documentation,
				),
			);
		}
	}

	return completions;
}

function makeFunctionCompletion(
	label: string,
	labelDetails: CompletionItemLabelDetails | undefined,
	filterText: string,
	sortText: string | undefined,
	insertText: string,
	func: ScssFunction,
	documentation: MarkupContent,
): CompletionItem {
	return {
		label,
		labelDetails,
		filterText,
		sortText,
		kind: CompletionItemKind.Function,
		insertTextFormat: InsertTextFormat.Snippet,
		insertText,
		tags: func.sassdoc?.deprecated ? [CompletionItemTag.Deprecated] : [],
		documentation,
	};
}
