import {
	CompletionItemKind,
	MarkupKind,
	InsertTextFormat,
	CompletionItemTag,
} from "vscode-languageserver";
import type {
	CompletionItem,
	CompletionItemLabelDetails,
} from "vscode-languageserver";
import type { TextDocument } from "vscode-languageserver-textdocument";
import type { IScssDocument, ScssFunction } from "../../parser";
import { applySassDoc } from "../../utils/sassdoc";
import type { CompletionContext } from "./completion-context";
import {
	makeMixinDocumentation,
	mapParameterSignature,
	mapParameterSnippet,
	rePrivate,
} from "./completion-utils";

export function createFunctionCompletionItems(
	scssDocument: IScssDocument,
	currentDocument: TextDocument,
	context: CompletionContext,
	hiddenSymbols: string[] = [],
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

		let documentation = makeMixinDocumentation(func);
		const sassdoc = applySassDoc(func);
		if (sassdoc) {
			documentation += `\n____\n${sassdoc}`;
		}

		const detail = `Function declared in ${scssDocument.fileName}`;

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
				detail,
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
					detail,
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
	detail: string,
	insertText: string,
	func: ScssFunction,
	documentation: string,
): CompletionItem {
	return {
		label,
		labelDetails,
		filterText,
		sortText,
		kind: CompletionItemKind.Function,
		detail,
		insertTextFormat: InsertTextFormat.Snippet,
		insertText,
		tags: func.sassdoc?.deprecated ? [CompletionItemTag.Deprecated] : [],
		documentation: {
			kind: MarkupKind.Markdown,
			value: documentation,
		},
	};
}
