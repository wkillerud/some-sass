import { getSCSSLanguageService } from "@somesass/vscode-css-languageservice";
import { DoHover } from "./features/do-hover";
import { FindDefinition } from "./features/find-definition";
import { FindDocumentHighlights } from "./features/find-document-highlights";
import { FindDocumentLinks } from "./features/find-document-links";
import { FindSymbols } from "./features/find-symbols";
import { FindValue } from "./features/find-value";
import { LanguageModelCache as LanguageServerCache } from "./language-model-cache";
import {
	LanguageService as ILanguageService,
	LanguageServiceConfiguration,
	LanguageServiceOptions,
	Position,
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
	#doHover: DoHover;
	#findDefinition: FindDefinition;
	#findDocumentHighlights: FindDocumentHighlights;
	#findDocumentLinks: FindDocumentLinks;
	#findSymbols: FindSymbols;
	#findValue: FindValue;

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
		this.#doHover = new DoHover(this, options, { scssLs, cache });
		this.#findDefinition = new FindDefinition(this, options, { scssLs, cache });
		this.#findDocumentHighlights = new FindDocumentHighlights(this, options, {
			scssLs,
			cache,
		});
		this.#findDocumentLinks = new FindDocumentLinks(this, options, {
			scssLs,
			cache,
		});
		this.#findSymbols = new FindSymbols(this, options, { scssLs, cache });
		this.#findValue = new FindValue(this, options, { scssLs, cache });
	}

	configure(configuration: LanguageServiceConfiguration): void {
		this.#findDocumentHighlights.configure(configuration);
		this.#findDocumentLinks.configure(configuration);
		this.#findSymbols.configure(configuration);
		this.#findDefinition.configure(configuration);
	}

	parseStylesheet(document: TextDocument) {
		return this.#cache.get(document);
	}

	doHover(document: TextDocument, position: Position) {
		return this.#doHover.doHover(document, position);
	}

	findDefinition(document: TextDocument, position: Position) {
		return this.#findDefinition.findDefinition(document, position);
	}

	findDocumentHighlights(document: TextDocument, position: Position) {
		return this.#findDocumentHighlights.findDocumentHighlights(
			document,
			position,
		);
	}

	async findDocumentLinks(document: TextDocument) {
		return this.#findDocumentLinks.findDocumentLinks(document);
	}

	findDocumentSymbols(document: TextDocument) {
		return this.#findSymbols.findDocumentSymbols(document);
	}

	findValue(document: TextDocument, position: Position) {
		return this.#findValue.findValue(document, position);
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
