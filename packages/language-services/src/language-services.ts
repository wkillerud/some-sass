import { getSCSSLanguageService } from "@somesass/vscode-css-languageservice";
import { DoComplete } from "./features/do-complete";
import { DoHover } from "./features/do-hover";
import { DoRename } from "./features/do-rename";
import { FindColors } from "./features/find-colors";
import { FindDefinition } from "./features/find-definition";
import { FindDocumentHighlights } from "./features/find-document-highlights";
import { FindDocumentLinks } from "./features/find-document-links";
import { FindReferences } from "./features/find-references";
import { FindSymbols } from "./features/find-symbols";
import { FindValue } from "./features/find-value";
import { LanguageModelCache as LanguageServerCache } from "./language-model-cache";
import {
	LanguageService as ILanguageService,
	LanguageServiceConfiguration,
	LanguageServiceOptions,
	Position,
	TextDocument,
	Color,
	ColorInformation,
	ColorPresentation,
	Range,
	ReferenceContext,
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
	#doComplete: DoComplete;
	#doHover: DoHover;
	#doRename: DoRename;
	#findColors: FindColors;
	#findDefinition: FindDefinition;
	#findDocumentHighlights: FindDocumentHighlights;
	#findDocumentLinks: FindDocumentLinks;
	#findReferences: FindReferences;
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
		this.#doComplete = new DoComplete(this, options, { scssLs, cache });
		this.#doHover = new DoHover(this, options, { scssLs, cache });
		this.#doRename = new DoRename(this, options, { scssLs, cache });
		this.#findColors = new FindColors(this, options, { scssLs, cache });
		this.#findDefinition = new FindDefinition(this, options, { scssLs, cache });
		this.#findDocumentHighlights = new FindDocumentHighlights(this, options, {
			scssLs,
			cache,
		});
		this.#findDocumentLinks = new FindDocumentLinks(this, options, {
			scssLs,
			cache,
		});
		this.#findReferences = new FindReferences(this, options, { scssLs, cache });
		this.#findSymbols = new FindSymbols(this, options, { scssLs, cache });
		this.#findValue = new FindValue(this, options, { scssLs, cache });
	}

	configure(configuration: LanguageServiceConfiguration): void {
		this.#doComplete.configure(configuration);
		this.#doHover.configure(configuration);
		this.#doRename.configure(configuration);
		this.#findColors.configure(configuration);
		this.#findDefinition.configure(configuration);
		this.#findDocumentHighlights.configure(configuration);
		this.#findDocumentLinks.configure(configuration);
		this.#findReferences.configure(configuration);
		this.#findSymbols.configure(configuration);
	}

	parseStylesheet(document: TextDocument) {
		return this.#cache.get(document);
	}

	doComplete(document: TextDocument, position: Position) {
		return this.#doComplete.doComplete(document, position);
	}

	doHover(document: TextDocument, position: Position) {
		return this.#doHover.doHover(document, position);
	}

	doRename(document: TextDocument, position: Position, newName: string) {
		return this.#doRename.doRename(document, position, newName);
	}

	findColors(document: TextDocument): Promise<ColorInformation[]> {
		return this.#findColors.findColors(document);
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

	async findReferences(
		document: TextDocument,
		position: Position,
		context?: ReferenceContext,
	) {
		return this.#findReferences.findReferences(document, position, context);
	}

	findValue(document: TextDocument, position: Position) {
		return this.#findValue.findValue(document, position);
	}

	findWorkspaceSymbols(query?: string) {
		return this.#findSymbols.findWorkspaceSymbols(query);
	}

	getColorPresentations(
		document: TextDocument,
		color: Color,
		range: Range,
	): ColorPresentation[] {
		return this.#findColors.getColorPresentations(document, color, range);
	}

	onDocumentChanged(document: TextDocument) {
		return this.#cache.onDocumentChanged(document);
	}

	onDocumentRemoved(document: TextDocument | string) {
		this.#cache.onDocumentRemoved(document);
	}

	prepareRename(document: TextDocument, position: Position) {
		return this.#doRename.prepareRename(document, position);
	}

	clearCache() {
		this.#cache.clearCache();
	}
}
