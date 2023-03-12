import {
	CompletionItem,
	CompletionList,
	MarkupKind,
} from "vscode-languageserver";
import { sassBuiltInModules } from "../sass-built-in-modules";
import type { CompletionContext } from "./completion-context";

const rePartialUse = /^@use ["']/;

export function doImportCompletion(context: CompletionContext): CompletionList {
	const completions = CompletionList.create([], false);

	if (rePartialUse.test(context.textBeforeWord)) {
		createSassBuiltInCompletionItems(completions.items);
	}

	return completions;
}

function createSassBuiltInCompletionItems(completions: CompletionItem[]): void {
	for (const [moduleName, { summary, reference }] of Object.entries(
		sassBuiltInModules,
	)) {
		completions.push({
			label: moduleName,
			documentation: {
				kind: MarkupKind.Markdown,
				value: [summary, "", `[Sass reference](${reference})`].join("\n"),
			},
		});
	}
}
