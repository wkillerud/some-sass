import { resolve } from "url";
import {
	LanguageService as ILanguageService,
	LanguageServiceConfiguration,
	LanguageServiceOptions,
	SassDocumentSymbol,
	TextDocument,
	SymbolKind,
} from "@somesass/language-server-types";
import { ParseResult, parse } from "scss-sassdoc-parser";
import {
	getSCSSLanguageService,
	LanguageService as VSCodeLanguageService,
} from "vscode-css-languageservice";
import { LanguageModelCache } from "./language-model-cache";
import { mapFsProviders } from "./utils/fs-provider";
import { joinPath } from "./utils/resources";

let singleton: LanguageService | null = null;

export function getLanguageService(
	options: LanguageServiceOptions,
): LanguageService {
	if (!singleton) {
		singleton = new LanguageService(options);
	}
	return singleton;
}

class LanguageService implements ILanguageService {
	#ls: VSCodeLanguageService;
	#cache: LanguageModelCache;
	#configuration: LanguageServiceConfiguration = {};

	constructor(options: LanguageServiceOptions) {
		this.#ls = getSCSSLanguageService({
			clientCapabilities: options.clientCapabilities,
			fileSystemProvider: mapFsProviders(options.fileSystemProvider),
		});
		this.#cache = new LanguageModelCache(this.#ls, options);
	}

	configure(configuration: LanguageServiceConfiguration) {
		return this.#cache.configure(configuration);
	}

	parseStylesheet(document: TextDocument) {
		return this.#cache.get(document);
	}

	findDocumentLinks(document: TextDocument) {
		return this.#ls.findDocumentLinks2(
			document,
			this.parseStylesheet(document),
			{
				/**
				 * @param ref Resolve this path from the context of the document
				 * @returns The resolved path
				 */
				resolveReference: (
					ref: string,
					base: string = document.uri,
				): string | undefined => {
					if (ref.startsWith("/") && this.#configuration.workspaceRoot) {
						return joinPath(this.#configuration.workspaceRoot.toString(), ref);
					}
					try {
						return resolve(base, ref);
					} catch (e) {
						return undefined;
					}
				},
			},
		);
	}

	async findDocumentSymbols(
		document: TextDocument,
	): Promise<SassDocumentSymbol[]> {
		const symbols = this.#ls.findDocumentSymbols2(
			document,
			this.#cache.get(document),
		) as SassDocumentSymbol[];

		if (symbols.length === 0) {
			return symbols;
		}

		let sassdoc: ParseResult[] = [];
		try {
			const text = document.getText();
			sassdoc = await parse(text);
		} catch {
			// do nothing
		}
		for (const symbol of symbols) {
			switch (symbol.kind) {
				case SymbolKind.Variable: {
					const dollarlessName = symbol.name.replace("$", "");
					const docs = sassdoc.find(
						(v) =>
							v.context.name === dollarlessName &&
							v.context.type === "variable",
					);
					symbol.sassdoc = docs;
					break;
				}

				case SymbolKind.Method: {
					const docs = sassdoc.find(
						(v) => v.context.name === symbol.name && v.context.type === "mixin",
					);
					symbol.sassdoc = docs;
					break;
				}

				case SymbolKind.Function: {
					const docs = sassdoc.find(
						(v) =>
							v.context.name === symbol.name && v.context.type === "function",
					);
					symbol.sassdoc = docs;
					break;
				}

				case SymbolKind.Class: {
					if (symbol.name.startsWith("%")) {
						const sansPercent = symbol.name.substring(1);
						const docs = sassdoc.find(
							(v) =>
								v.context.name === sansPercent &&
								v.context.type === "placeholder",
						);
						symbol.sassdoc = docs;
					}
					break;
				}
			}
		}

		return symbols;
	}

	onDocumentChanged(document: TextDocument) {
		return this.#cache.onDocumentChanged(document);
	}

	onDocumentRemoved(document: TextDocument) {
		this.#cache.onDocumentRemoved(document);
	}

	clearCache() {
		this.#cache.clearCache();
	}
}
