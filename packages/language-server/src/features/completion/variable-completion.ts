import type { TextDocument } from "vscode-languageserver-textdocument";
import {
	CompletionItemKind,
	CompletionItemTag,
	MarkupKind,
} from "vscode-languageserver-types";
import type { CompletionItem } from "vscode-languageserver-types";
import { IScssDocument } from "../../parser";
import { applySassDoc } from "../../utils/sassdoc";
import { getBaseValueFrom, isReferencingVariable } from "../../utils/scss";
import { asDollarlessVariable } from "../../utils/string";
import { isColor } from "./color-completion";
import type { CompletionContext } from "./completion-context";
import { rePrivate } from "./completion-utils";

export function createVariableCompletionItems(
	scssDocument: IScssDocument,
	currentDocument: TextDocument,
	context: CompletionContext,
	hiddenSymbols: string[] = [],
	shownSymbols: string[] = [],
	prefix = "",
): CompletionItem[] {
	const completions: CompletionItem[] = [];

	for (const variable of scssDocument.variables.values()) {
		let value = variable.value;
		if (isReferencingVariable(variable)) {
			value = getBaseValueFrom(variable, scssDocument).value;
		}

		const color = value ? isColor(value) : null;
		const completionKind = color
			? CompletionItemKind.Color
			: CompletionItemKind.Variable;

		let documentation =
			color ||
			[
				"```scss",
				`${variable.name}: ${value};${
					value !== variable.value ? ` // via ${variable.value}` : ""
				}`,
				"```",
			].join("\n") ||
			"";

		let label = variable.name;
		let sortText;
		let filterText;
		let insertText;

		const isPrivate = variable.name.match(rePrivate);
		const isFromCurrentDocument = scssDocument.uri === currentDocument.uri;

		if (isPrivate && !isFromCurrentDocument) {
			continue;
		}

		if (hiddenSymbols.includes(variable.name)) {
			continue;
		}

		if (shownSymbols.length > 0 && !shownSymbols.includes(variable.name)) {
			continue;
		}

		if (isPrivate) {
			sortText = label.replace(/^$[_-]/, "");
		}

		const sassdoc = applySassDoc(variable);
		if (sassdoc) {
			documentation += `\n____\n${sassdoc}`;
		}

		documentation += `\n____\nVariable declared in ${scssDocument.fileName}`;

		const isEmbedded = context.originalExtension !== "scss";
		if (context.namespace) {
			// Avoid ending up with namespace.prefix-$variable
			label = `$${prefix}${asDollarlessVariable(variable.name)}`;
			// The `.` in the namespace gets replaced unless we have a $ character after it.
			// Except when we're embedded in Vue, Svelte or Astro, where the . is not replaced.
			// Also, in embedded scenarios where we don't use a namespace, the existing $ sign is not replaced.
			insertText = context.word.endsWith(".")
				? `${isEmbedded ? "" : "."}${label}`
				: isEmbedded
					? asDollarlessVariable(label)
					: label;
			filterText = context.word.endsWith(".")
				? `${context.namespace}.${label}`
				: label;
		} else if (
			context.originalExtension === "vue" ||
			context.originalExtension === "astro"
		) {
			// In Vue and Astro files, the $ does not get replaced by the suggestion,
			// so exclude it from the insertText.
			insertText = asDollarlessVariable(label);
		}

		completions.push({
			label,
			filterText,
			insertText,
			sortText,
			commitCharacters: [";", ","],
			kind: completionKind,
			tags: variable.sassdoc?.deprecated ? [CompletionItemTag.Deprecated] : [],
			documentation:
				completionKind === CompletionItemKind.Color
					? documentation
					: {
							kind: MarkupKind.Markdown,
							value: documentation,
						},
		});
	}

	return completions;
}
