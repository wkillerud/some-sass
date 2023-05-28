import {
	CompletionItemKind,
	CompletionItemTag,
	InsertTextFormat,
	MarkupKind,
} from "vscode-languageserver";
import type {
	CompletionItem,
	CompletionItemLabelDetails,
} from "vscode-languageserver";
import type { TextDocument } from "vscode-languageserver-textdocument";
import { useContext } from "../../context-provider";
import type { IScssDocument, ScssMixin } from "../../parser";
import { applySassDoc } from "../../utils/sassdoc";
import type { CompletionContext } from "./completion-context";
import {
	makeMixinDocumentation,
	mapParameterSignature,
	mapParameterSnippet,
	rePrivate,
} from "./completion-utils";

export function createMixinCompletionItems(
	scssDocument: IScssDocument,
	currentDocument: TextDocument,
	context: CompletionContext,
	hiddenSymbols: string[] = [],
	prefix = "",
): CompletionItem[] {
	const completions: CompletionItem[] = [];

	for (const mixin of scssDocument.mixins.values()) {
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
		const sassdoc = applySassDoc(mixin, {
			displayOptions: {
				content: true,
				description: true,
				deprecated: true,
				output: true,
			},
		});
		if (sassdoc) {
			documentation += `\n____\n${sassdoc}`;
		}

		// Client needs the namespace as part of the text that is matched,
		// and inserted text needs to include the `.` which will otherwise
		// be replaced (except when we're embedded in Vue, Svelte or Astro).
		const label = context.namespace ? `${prefix}${mixin.name}` : mixin.name;
		const filterText = context.namespace
			? context.namespace !== "*"
				? `${context.namespace}.${prefix}${mixin.name}`
				: `${prefix}${mixin.name}`
			: mixin.name;

		const isEmbedded = context.originalExtension !== "scss";
		const insertText = context.namespace
			? context.namespace !== "*" && !isEmbedded
				? `.${prefix}${mixin.name}`
				: `${prefix}${mixin.name}`
			: mixin.name;
		const sortText = isPrivate ? label.replace(/^$[_-]/, "") : undefined;
		const detail = `Mixin declared in ${scssDocument.fileName}`;

		// Use the SnippetString syntax to provide smart completions of parameter names
		const labelDetails: CompletionItemLabelDetails | undefined = undefined;

		const requiredParameters = mixin.parameters.filter((p) => !p.value);
		if (requiredParameters.length === 0) {
			makeMixinCompletion(
				completions,
				label,
				labelDetails,
				filterText,
				sortText,
				detail,
				insertText,
				mixin,
				documentation,
			);
		}

		if (requiredParameters.length > 0) {
			const parametersSnippet = requiredParameters
				.map(mapParameterSnippet)
				.join(", ");
			const functionSignature = requiredParameters
				.map(mapParameterSignature)
				.join(", ");
			makeMixinCompletion(
				completions,
				label,
				{
					detail: `(${functionSignature})`,
				},
				filterText,
				sortText,
				detail,
				`${insertText}(${parametersSnippet})`,
				mixin,
				documentation,
			);
		}

		if (mixin.parameters.length !== requiredParameters.length) {
			const parametersSnippet = mixin.parameters
				.map(mapParameterSnippet)
				.join(", ");
			const functionSignature = mixin.parameters
				.map(mapParameterSignature)
				.join(", ");
			makeMixinCompletion(
				completions,
				label,
				{
					detail: `(${functionSignature})`,
				},
				filterText,
				sortText,
				detail,
				`${insertText}(${parametersSnippet})`,
				mixin,
				documentation,
			);
		}
	}

	return completions;
}

function makeMixinCompletion(
	completions: CompletionItem[],
	label: string,
	labelDetails: CompletionItemLabelDetails | undefined,
	filterText: string,
	sortText: string | undefined,
	detail: string,
	insertText: string,
	mixin: ScssMixin,
	documentation: string,
): void {
	const context = useContext();

	if (context?.settings?.suggestionStyle !== "bracket") {
		completions.push({
			label,
			labelDetails,
			filterText,
			sortText,
			kind: CompletionItemKind.Snippet,
			detail,
			insertTextFormat: InsertTextFormat.Snippet,
			insertText,
			tags: mixin.sassdoc?.deprecated ? [CompletionItemTag.Deprecated] : [],
			documentation: {
				kind: MarkupKind.Markdown,
				value: documentation,
			},
		});
	}

	// Not all mixins have @content, but when they do, be smart about adding brackets
	// and move the cursor to be ready to add said contents.
	// Include as separate suggestion since content may not always be needed or wanted.
	if (
		mixin.sassdoc?.content &&
		context?.settings?.suggestionStyle !== "nobracket"
	) {
		const details = { ...labelDetails };
		details.detail = details.detail ? `${details.detail} { }` : " { }";
		completions.push({
			label,
			labelDetails: details,
			filterText,
			sortText,
			kind: CompletionItemKind.Snippet,
			detail,
			insertTextFormat: InsertTextFormat.Snippet,
			insertText: (insertText += " {\n\t$0\n}"),
			tags: mixin.sassdoc.deprecated ? [CompletionItemTag.Deprecated] : [],
			documentation: {
				kind: MarkupKind.Markdown,
				value: documentation,
			},
		});
	}
}
