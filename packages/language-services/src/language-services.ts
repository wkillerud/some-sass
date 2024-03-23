import {
	LanguageService as ILanguageService,
	LanguageServiceConfiguration,
	LanguageServiceOptions,
	SassDocumentSymbol,
	TextDocument,
} from "@somesass/language-server-types";
import { getSCSSLanguageService } from "vscode-css-languageservice";
import { FindLinks } from "./features/find-document-links";
import { FindSymbols } from "./features/find-document-symbols";
import { LanguageModelCache } from "./language-model-cache";
import { mapFsProviders } from "./utils/fs-provider";

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
	#cache: LanguageModelCache;
	#findLinks: FindLinks;
	#findSymbols: FindSymbols;

	constructor(options: LanguageServiceOptions) {
		const scssLs = getSCSSLanguageService({
			clientCapabilities: options.clientCapabilities,
			fileSystemProvider: mapFsProviders(options.fileSystemProvider),
		});
		this.#cache = new LanguageModelCache(this, options, { scssLs });
		this.#findLinks = new FindLinks(this, options, { scssLs });
		this.#findSymbols = new FindSymbols(this, options, { scssLs });
	}

	configure(configuration: LanguageServiceConfiguration): void {
		this.#cache.configure(configuration);
		this.#findLinks.configure(configuration);
	}

	parseStylesheet(document: TextDocument) {
		return this.#cache.get(document);
	}

	findDocumentLinks(document: TextDocument) {
		return this.#findLinks.findDocumentLinks(document);
	}

	async findDocumentSymbols(
		document: TextDocument,
	): Promise<SassDocumentSymbol[]> {
		return this.#findSymbols.findDocumentSymbols(document);
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
