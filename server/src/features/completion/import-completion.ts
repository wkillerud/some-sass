import {
	type CompletionItem,
	CompletionList,
	MarkupKind,
} from "vscode-languageserver";
import type { TextDocument } from "vscode-languageserver-textdocument";
import StorageService from "../../storage";
import { sassBuiltInModules } from "../sass-built-in-modules";
import type { CompletionContext } from "./completion-context";

export const rePartialUse = /@use ["'|](?<url>.*)["'|]?/;

export function doImportCompletion(
	document: TextDocument,
	context: CompletionContext,
	storage: StorageService,
): CompletionList {
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
