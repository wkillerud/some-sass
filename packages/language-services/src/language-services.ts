import {
	getCSSLanguageService,
	getSassLanguageService,
	ICSSDataProvider,
	LanguageService as UpstreamLanguageService,
} from "@somesass/vscode-css-languageservice";
import { merge } from "es-toolkit/object";
import { defaultConfiguration } from "./configuration";
import { CodeActions } from "./features/code-actions";
import { DoComplete } from "./features/do-complete";
import { DoDiagnostics } from "./features/do-diagnostics";
import { DoHover } from "./features/do-hover";
import { DoRename } from "./features/do-rename";
import { DoSignatureHelp } from "./features/do-signature-help";
import { FindColors } from "./features/find-colors";
import { FindDefinition } from "./features/find-definition";
import { FindDocumentHighlights } from "./features/find-document-highlights";
import { FindDocumentLinks } from "./features/find-document-links";
import { FindReferences } from "./features/find-references";
import { FindSymbols } from "./features/find-symbols";
import { FoldingRangeContext, FoldingRanges } from "./features/folding-ranges";
import { SelectionRanges } from "./features/selection-ranges";
import { LanguageModelCache } from "./language-model-cache";
import {
	ClientCapabilities,
	CodeActionContext,
	Color,
	EditorConfiguration,
	FileStat,
	FileSystemProvider,
	FileType,
	LanguageConfiguration,
	LanguageServerConfiguration,
	LanguageService,
	LanguageServiceOptions,
	Position,
	Range,
	RecursivePartial,
	ReferenceContext,
	SetDataProvidersOptions,
	TextDocument,
	URI,
} from "./language-services-types";
import { mapFsProviders } from "./utils/fs-provider";

export {
	defaultConfiguration,
	EditorConfiguration,
	FileStat,
	FileSystemProvider,
	FileType,
	LanguageConfiguration,
	LanguageServerConfiguration,
	LanguageService,
};

export function getLanguageService(
	options: LanguageServiceOptions,
): LanguageService {
	return new LanguageServiceImpl(options);
}

class LanguageServiceImpl implements LanguageService {
	#codeActions: CodeActions;
	#doComplete: DoComplete;
	#doDiagnostics: DoDiagnostics;
	#doHover: DoHover;
	#doRename: DoRename;
	#doSignatureHelp: DoSignatureHelp;
	#findColors: FindColors;
	#findDefinition: FindDefinition;
	#findDocumentHighlights: FindDocumentHighlights;
	#findDocumentLinks: FindDocumentLinks;
	#findReferences: FindReferences;
	#findSymbols: FindSymbols;
	#foldingRanges: FoldingRanges;
	#selectionRanges: SelectionRanges;

	#configuration = defaultConfiguration;
	get configuration(): LanguageServerConfiguration {
		return this.#configuration;
	}

	#cache: LanguageModelCache;
	get cache(): LanguageModelCache {
		return this.#cache;
	}

	#clientCapabilities: ClientCapabilities;
	get clientCapabilities(): ClientCapabilities {
		return this.#clientCapabilities;
	}

	#fs: FileSystemProvider;
	get fs(): FileSystemProvider {
		return this.#fs;
	}

	#cssLs: UpstreamLanguageService;
	#sassLs: UpstreamLanguageService;
	#scssLs: UpstreamLanguageService;

	constructor(options: LanguageServiceOptions) {
		this.#clientCapabilities = options.clientCapabilities;
		this.#fs = options.fileSystemProvider;

		const vscodeLsOptions = {
			clientCapabilities: this.clientCapabilities,
			fileSystemProvider: mapFsProviders(options.fileSystemProvider),
		};

		this.#cssLs = getCSSLanguageService(vscodeLsOptions);
		this.#sassLs = getSassLanguageService(vscodeLsOptions);
		// The server code is the same as sassLs, but separate on syntax in case the user has different settings
		this.#scssLs = getSassLanguageService(vscodeLsOptions);

		this.#cache = new LanguageModelCache({
			sassLs: this.#sassLs,
			...options.languageModelCache,
		});

		const internal = {
			cssLs: this.#cssLs,
			sassLs: this.#sassLs,
			scssLs: this.#scssLs,
		};

		this.#codeActions = new CodeActions(this, options, internal);
		this.#doComplete = new DoComplete(this, options, internal);
		this.#doDiagnostics = new DoDiagnostics(this, options, internal);
		this.#doHover = new DoHover(this, options, internal);
		this.#doRename = new DoRename(this, options, internal);
		this.#doSignatureHelp = new DoSignatureHelp(this, options, internal);
		this.#findColors = new FindColors(this, options, internal);
		this.#findDefinition = new FindDefinition(this, options, internal);
		this.#findDocumentHighlights = new FindDocumentHighlights(
			this,
			options,
			internal,
		);
		this.#findDocumentLinks = new FindDocumentLinks(this, options, internal);
		this.#findReferences = new FindReferences(this, options, internal);
		this.#findSymbols = new FindSymbols(this, options, internal);
		this.#foldingRanges = new FoldingRanges(this, options, internal);
		this.#selectionRanges = new SelectionRanges(this, options, internal);
	}

	configure(
		configuration: RecursivePartial<LanguageServerConfiguration>,
	): void {
		this.#configuration = merge(defaultConfiguration, configuration);

		this.#sassLs.configure({
			validate: this.configuration.sass.diagnostics.enabled,
			lint: this.configuration.sass.diagnostics.lint,
			completion: this.configuration.sass.completion,
			hover: this.configuration.sass.hover,
			importAliases: this.configuration.workspace.importAliases,
			loadPaths: this.configuration.workspace.loadPaths,
		});

		this.#scssLs.configure({
			validate: this.configuration.scss.diagnostics.enabled,
			lint: this.configuration.scss.diagnostics.lint,
			completion: this.configuration.scss.completion,
			hover: this.configuration.scss.hover,
			importAliases: this.configuration.workspace.importAliases,
			loadPaths: this.configuration.workspace.loadPaths,
		});

		this.#cssLs.configure({
			validate: this.configuration.css.diagnostics.enabled,
			lint: this.configuration.css.diagnostics.lint,
			completion: this.configuration.css.completion,
			hover: this.configuration.css.hover,
			importAliases: this.configuration.workspace.importAliases,
			loadPaths: this.configuration.workspace.loadPaths,
		});
	}

	setDataProviders(
		providers: ICSSDataProvider[],
		options: SetDataProvidersOptions = { useDefaultProviders: true },
	): void {
		this.#cssLs.setDataProviders(options.useDefaultProviders, providers);
		this.#sassLs.setDataProviders(options.useDefaultProviders, providers);
		this.#scssLs.setDataProviders(options.useDefaultProviders, providers);
	}

	parseStylesheet(document: TextDocument) {
		return this.#cache.get(document);
	}

	doComplete(document: TextDocument, position: Position) {
		return this.#doComplete.doComplete(document, position);
	}

	doDiagnostics(document: TextDocument) {
		return this.#doDiagnostics.doDiagnostics(document);
	}

	doHover(document: TextDocument, position: Position) {
		return this.#doHover.doHover(document, position);
	}

	doRename(document: TextDocument, position: Position, newName: string) {
		return this.#doRename.doRename(document, position, newName);
	}

	doSignatureHelp(document: TextDocument, position: Position) {
		return this.#doSignatureHelp.doSignatureHelp(document, position);
	}

	findColors(document: TextDocument) {
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

	findWorkspaceSymbols(query?: string) {
		return this.#findSymbols.findWorkspaceSymbols(query);
	}

	getCachedTextDocument(uri: URI): TextDocument | undefined {
		return this.#cache.getDocument(uri.toString());
	}

	getColorPresentations(document: TextDocument, color: Color, range: Range) {
		return this.#findColors.getColorPresentations(document, color, range);
	}

	getCodeActions(
		document: TextDocument,
		range: Range,
		context?: CodeActionContext,
	) {
		return this.#codeActions.getCodeActions(document, range, context);
	}

	getFoldingRanges(document: TextDocument, context?: FoldingRangeContext) {
		return this.#foldingRanges.getFoldingRanges(document, context);
	}

	getSelectionRanges(document: TextDocument, positions: Position[]) {
		return this.#selectionRanges.getSelectionRanges(document, positions);
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
