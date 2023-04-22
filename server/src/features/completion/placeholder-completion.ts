import {
	type CompletionItem,
	CompletionItemKind,
	CompletionItemTag,
	InsertTextFormat,
} from "vscode-languageserver";
import { type IScssDocument } from "../../parser";
import { applySassDoc } from "../../utils/sassdoc";

export function createPlaceholderCompletionItems(
	scssDocument: IScssDocument,
	hiddenSymbols: string[] = [],
): CompletionItem[] {
	const completions: CompletionItem[] = [];

	for (const placeholder of scssDocument.placeholders.values()) {
		if (hiddenSymbols.includes(placeholder.name)) {
			continue;
		}

		const label = placeholder.name;
		const filterText = placeholder.name.substring(1);
		const insertText = filterText;

		let documentation = placeholder.name;
		const sassdoc = applySassDoc(placeholder, {
			displayOptions: { description: true, deprecated: true },
		});
		if (sassdoc) {
			documentation += `\n____\n${sassdoc}`;
		}

		const detail = `Placeholder declared in ${scssDocument.fileName}`;

		completions.push({
			label,
			kind: CompletionItemKind.Class,
			detail,
			filterText,
			insertText: filterText,
			insertTextFormat: InsertTextFormat.Snippet,
			tags: placeholder.sassdoc?.deprecated
				? [CompletionItemTag.Deprecated]
				: undefined,
			documentation: {
				kind: "markdown",
				value: documentation,
			},
		});
	}

	return completions;
}
