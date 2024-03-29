import {
	Position,
	getSCSSLanguageService,
} from "@somesass/vscode-css-languageservice";
import { FindDefinition } from "./features/find-definition";
import { FindLinks } from "./features/find-document-links";
import { FindSymbols } from "./features/find-symbols";
import { LanguageModelCache as LanguageServerCache } from "./language-model-cache";
import {
	LanguageService as ILanguageService,
	LanguageServiceConfiguration,
	LanguageServiceOptions,
	TextDocument,
} from "./language-services-types";
import { mapFsProviders } from "./utils/fs-provider";

export * from "./language-services-types";

export function getLanguageService(
	options: LanguageServiceOptions,
): LanguageService {
	return new LanguageService(options);
}

class LanguageService implements ILanguageService {
	#cache: LanguageServerCache;
	#findLinks: FindLinks;
	#findSymbols: FindSymbols;
	#findDefinition: FindDefinition;

	constructor(options: LanguageServiceOptions) {
		const scssLs = getSCSSLanguageService({
			clientCapabilities: options.clientCapabilities,
			fileSystemProvider: mapFsProviders(options.fileSystemProvider),
		});
		const cache = new LanguageServerCache({
			scssLs,
			...options.languageModelCache,
		});
		this.#cache = cache;
		this.#findLinks = new FindLinks(this, options, { scssLs, cache });
		this.#findSymbols = new FindSymbols(this, options, { scssLs, cache });
		this.#findDefinition = new FindDefinition(this, options, { scssLs, cache });
	}

	configure(configuration: LanguageServiceConfiguration): void {
		this.#findLinks.configure(configuration);
		this.#findSymbols.configure(configuration);
		this.#findDefinition.configure(configuration);
	}

	parseStylesheet(document: TextDocument) {
		return this.#cache.get(document);
	}

	async findDocumentLinks(document: TextDocument) {
		return this.#findLinks.findDocumentLinks(document);
	}

	findDocumentSymbols(document: TextDocument) {
		return this.#findSymbols.findDocumentSymbols(document);
	}

	findDefinition(document: TextDocument, position: Position) {
		return this.#findDefinition.findDefinition(document, position);
	}

	findWorkspaceSymbols(query?: string) {
		return this.#findSymbols.findWorkspaceSymbols(query);
	}

	onDocumentChanged(document: TextDocument) {
		return this.#cache.onDocumentChanged(document);
	}

	onDocumentRemoved(document: TextDocument | string) {
		this.#cache.onDocumentRemoved(document);
	}

	clearCache() {
		this.#cache.clearCache();
	}
}
