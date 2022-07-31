import type { TextDocument } from "vscode-languageserver-textdocument";
import {
	CompletionItemKind,
	CompletionItemTag,
	MarkupKind,
} from "vscode-languageserver-types";
import type { CompletionItem } from "vscode-languageserver-types";
import type { IScssDocument } from "../../symbols";
import { getVariableColor } from "../../utils/color";
import { applySassDoc } from "../../utils/sassdoc";
import { asDollarlessVariable, getLimitedString } from "../../utils/string";
import type { CompletionContext } from "./completion-context";
import { rePrivate } from "./completion-utils";

export function createVariableCompletionItems(
	scssDocument: IScssDocument,
	currentDocument: TextDocument,
	context: CompletionContext,
	hiddenSymbols: string[] = [],
	prefix = "",
): CompletionItem[] {
	const completions: CompletionItem[] = [];

	for (const variable of scssDocument.variables.values()) {
		const color = variable.value ? getVariableColor(variable.value) : null;
		const completionKind = color
			? CompletionItemKind.Color
			: CompletionItemKind.Variable;

		let documentation = getLimitedString(
			color ? color.toString() : variable.value || "",
		);
		let detail = `Variable declared in ${scssDocument.fileName}`;

		let label = variable.name;
		let sortText;
		let filterText;
		let insertText;

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
				sortText = label.replace(/^$[_-]/, "");
			}

			const sassdoc = applySassDoc(variable, {
				displayOptions: { description: true, deprecated: true, type: true },
			});
			if (sassdoc) {
				documentation += `\n\n${sassdoc}`;
			}
		}

		const isEmbedded = context.originalExtension !== "scss";
		if (context.namespace) {
			// Avoid ending up with namespace.prefix-$variable
			label = `$${prefix}${asDollarlessVariable(variable.name)}`;
			// The `.` in the namespace gets replaced unless we have a $ character after it.
			// Except when we're embedded in Vue, Svelte or Astro, where the . is not replace.
			// Also, in embedded scenarios where we don't use a namespace, the existing $ sign is not replaced.
			insertText = context.word.endsWith(".")
				? `${isEmbedded ? "" : "."}${label}`
				: isEmbedded
				? asDollarlessVariable(label)
				: label;
			filterText = context.word.endsWith(".")
				? `${context.namespace}.${label}`
				: label;
		} else if (isEmbedded) {
			insertText = asDollarlessVariable(label);
		}

		completions.push({
			label,
			filterText,
			insertText,
			sortText,
			commitCharacters: [";", ","],
			kind: completionKind,
			detail,
			tags: variable.sassdoc?.deprecated ? [CompletionItemTag.Deprecated] : [],
			documentation: {
				kind: MarkupKind.Markdown,
				value: documentation,
			},
		});
	}

	return completions;
}
