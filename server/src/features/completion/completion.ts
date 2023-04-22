import {
	CompletionList,
	MarkupKind,
	InsertTextFormat,
} from "vscode-languageserver";
import type { CompletionItem } from "vscode-languageserver";
import type { TextDocument } from "vscode-languageserver-textdocument";
import { useContext } from "../../context-provider";
import type {
	IScssDocument,
	ScssForward,
	ScssImport,
	ScssUse,
} from "../../parser";
import { asDollarlessVariable } from "../../utils/string";
import { sassBuiltInModules } from "../sass-built-in-modules";
import type { SassBuiltInModule } from "../sass-built-in-modules";
import { createCompletionContext } from "./completion-context";
import type { CompletionContext } from "./completion-context";
import { createFunctionCompletionItems } from "./function-completion";
import { doImportCompletion } from "./import-completion";
import { createMixinCompletionItems } from "./mixin-completion";
import { createPlaceholderCompletionItems } from "./placeholder-completion";
import { doSassDocCompletion } from "./sassdoc-completion";
import { createVariableCompletionItems } from "./variable-completion";

export async function doCompletion(
	document: TextDocument,
	offset: number,
): Promise<CompletionList> {
	let completions = CompletionList.create([], false);

	const text = document.getText();
	const { storage, settings } = useContext();
	const context = createCompletionContext(document, text, offset, settings);

	if (context.sassDoc) {
		return doSassDocCompletion(text, offset, context);
	}

	// Drop suggestions inside `//` and `/* */` comments
	if (context.comment) {
		return completions;
	}

	if (context.import) {
		return await doImportCompletion(document, context);
	}

	if (context.namespace) {
		completions = doNamespacedCompletion(document, context);
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

	if (wildcardNamespaces.length > 0) {
		const accumulator: Map<string, CompletionItem[]> = new Map();

		for (const use of wildcardNamespaces) {
			if (!use.link.target) {
				continue;
			}

			const namespaceRootDocument = storage.get(use.link.target);
			if (!namespaceRootDocument) {
				continue;
			}

			const wildcardContext = {
				...context,
				namespace: "*",
			};
			traverseTree(
				document,
				wildcardContext,
				accumulator,
				namespaceRootDocument,
			);
		}

		completions.items = completions.items.concat(
			[...accumulator.values()].flat(),
		);
	}

	// If at this point we're not in a namespace context,
	// but the user only wants suggestions from namespaces
	// (we consider `*` a namespace), we should return an empty list.
	// An exception is if the user is typing a placeholder.
	// These are not prefixed with their namespace, even with @use.
	if (settings.suggestFromUseOnly && !context.placeholder) {
		return completions;
	}

	for (const scssDocument of storage.values()) {
		if (
			!settings.suggestAllFromOpenDocument &&
			scssDocument.uri === document.uri
		) {
			continue;
		}

		if (context.placeholder) {
			const variables = createPlaceholderCompletionItems(scssDocument);
			completions.items = completions.items.concat(variables);
		}

		if (context.variable) {
			const variables = createVariableCompletionItems(
				scssDocument,
				document,
				context,
			);
			completions.items = completions.items.concat(variables);
		}

		if (context.mixin) {
			const mixins = createMixinCompletionItems(
				scssDocument,
				document,
				context,
			);
			completions.items = completions.items.concat(mixins);
		}

		if (context.function) {
			const functions = createFunctionCompletionItems(
				scssDocument,
				document,
				context,
			);
			completions.items = completions.items.concat(functions);
		}
	}

	return completions;
}

function doNamespacedCompletion(
	document: TextDocument,
	context: CompletionContext,
): CompletionList {
	const completions = CompletionList.create([], false);
	const { storage } = useContext();
	const scssDocument = storage.get(document.uri);
	if (!scssDocument) {
		return completions;
	}

	const namespace = context.namespace as string;

	let use: ScssUse | null = null;
	for (const candidate of scssDocument.uses.values()) {
		if (
			candidate.namespace === namespace ||
			candidate.namespace === `_${namespace}`
		) {
			use = candidate;
			break;
		}
	}

	if (!use || !use.link.target) {
		// No match in either custom or built-in namespace, return an empty list
		return completions;
	}

	const namespaceRootDocument = storage.get(use.link.target);
	if (!namespaceRootDocument) {
		// Look for matches in built-in namespaces, which do not appear in storage
		for (const [builtIn, module] of Object.entries(sassBuiltInModules)) {
			if (builtIn === use.link.target) {
				return doBuiltInCompletion(context, module);
			}
		}

		// No matches, return an empty list
		return completions;
	}

	const accumulator: Map<string, CompletionItem[]> = new Map();
	traverseTree(document, context, accumulator, namespaceRootDocument);

	completions.items = [...accumulator.values()].flat();

	return completions;
}

function doBuiltInCompletion(
	context: CompletionContext,
	module: SassBuiltInModule,
): CompletionList {
	const completions = CompletionList.create([], false);
	completions.items = Object.entries(module.exports).map(
		([name, { description, signature, returns }]) => {
			const parametersSnippet = signature
				? signature
						.replace(/:.+[$)]/g, "") // Remove default values
						.replace(/[().]/g, "") // Remove parentheses and ... list indicator
						.split(",")
						.map(
							(p, index) =>
								`\${${index + 1}:${asDollarlessVariable(p.trim())}}`,
						)
						.join(", ")
				: "";

			return {
				label: name,
				filterText: `${context.namespace}.${name}`,
				insertText: context.word.endsWith(".")
					? `.${name}${signature ? `(${parametersSnippet})` : ""}`
					: name,
				insertTextFormat: parametersSnippet
					? InsertTextFormat.Snippet
					: InsertTextFormat.PlainText,
				labelDetails: {
					detail:
						signature && returns ? `${signature} => ${returns}` : signature,
				},
				documentation: {
					kind: MarkupKind.Markdown,
					value: [
						description,
						"",
						`[Sass reference](${module.reference}#${name})`,
					].join("\n"),
				},
			};
		},
	);

	return completions;
}

function traverseTree(
	document: TextDocument,
	context: CompletionContext,
	accumulator: Map<string, CompletionItem[]>,
	leaf: IScssDocument,
	hiddenSymbols: string[] = [],
	accumulatedPrefix = "",
) {
	if (accumulator.has(leaf.uri)) {
		return;
	}
	const { storage, settings } = useContext();
	const scssDocument = storage.get(leaf.uri);
	if (!scssDocument) {
		return;
	}

	let completionItems: CompletionItem[] = [];

	if (
		settings.suggestAllFromOpenDocument ||
		scssDocument.uri !== document.uri
	) {
		if (context.variable) {
			const variables = createVariableCompletionItems(
				scssDocument,
				document,
				context,
				hiddenSymbols,
				accumulatedPrefix,
			);
			completionItems = completionItems.concat(variables);
		}

		if (context.mixin) {
			const mixins = createMixinCompletionItems(
				scssDocument,
				document,
				context,
				hiddenSymbols,
				accumulatedPrefix,
			);
			completionItems = completionItems.concat(mixins);
		}

		if (context.function) {
			const functions = createFunctionCompletionItems(
				scssDocument,
				document,
				context,
				hiddenSymbols,
				accumulatedPrefix,
			);
			completionItems = completionItems.concat(functions);
		}

		if (context.placeholder) {
			const placeholders = createPlaceholderCompletionItems(
				scssDocument,
				hiddenSymbols,
			);
			completionItems = completionItems.concat(placeholders);
		}

		accumulator.set(leaf.uri, completionItems);

		// Check to see if we have to go deeper
		for (const child of leaf.getLinks()) {
			if (
				!child.link.target ||
				(child as ScssImport).dynamic ||
				(child as ScssImport).css ||
				child.link.target === scssDocument.uri
			) {
				continue;
			}

			const childDocument = storage.get(child.link.target);
			if (!childDocument) {
				continue;
			}

			let hidden = hiddenSymbols;
			if (
				(child as ScssForward).hide &&
				(child as ScssForward).hide.length > 0
			) {
				hidden = hiddenSymbols.concat((child as ScssForward).hide);
			}

			let prefix = accumulatedPrefix;
			if ((child as ScssForward).prefix) {
				prefix += (child as ScssForward).prefix;
			}

			traverseTree(
				document,
				context,
				accumulator,
				childDocument,
				hidden,
				prefix,
			);
		}
	}
}
