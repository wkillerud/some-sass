import {
	Node,
	NodeType,
	FunctionDeclaration,
	Function,
	FunctionParameter,
	MixinReference,
	MixinDeclaration,
	Variable,
	VariableDeclaration,
	Identifier,
	Declaration,
	ForStatement,
	EachStatement,
	Import,
	Use,
	Forward,
	ForwardVisibility,
	ExtendsReference,
	Module,
	IToken,
	TokenType,
	Marker,
	StylesheetDocumentLink,
	FoldingRange,
	FoldingRangeKind,
	SelectionRange,
	ICSSDataProvider,
} from "@somesass/vscode-css-languageservice";
import type { ParseResult } from "sassdoc-parser";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
	Range,
	Position,
	MarkupKind,
	Color,
	ColorInformation,
	ColorPresentation,
	SignatureHelp,
	SignatureInformation,
	ReferenceContext,
	Diagnostic,
	DiagnosticTag,
	DiagnosticSeverity,
	CompletionItem,
	CompletionItemKind,
	CompletionList,
	CompletionItemTag,
	InsertTextFormat,
	SymbolInformation,
	SymbolKind,
	DocumentSymbol,
	Location,
	Hover,
	CodeActionContext,
	CodeAction,
	DocumentHighlight,
	DocumentLink,
	WorkspaceEdit,
	TextEdit,
	CodeActionKind,
	TextDocumentEdit,
	VersionedTextDocumentIdentifier,
} from "vscode-languageserver-types";
import { URI, Utils } from "vscode-uri";
import { FoldingRangeContext } from "./features/folding-ranges";
import { LanguageModelCache } from "./language-model-cache";

/**
 * The root of the abstract syntax tree.
 */
export type Stylesheet = Node;

export interface SassDocumentSymbol extends DocumentSymbol {
	sassdoc?: ParseResult;
	children?: SassDocumentSymbol[];
}

export type RecursivePartial<T> = {
	[P in keyof T]?: T[P] extends (infer U)[]
		? RecursivePartial<U>[]
		: T[P] extends object | undefined
			? RecursivePartial<T[P]>
			: T[P];
};

export interface LanguageService {
	readonly cache: LanguageModelCache;
	readonly clientCapabilities: ClientCapabilities;
	readonly configuration: LanguageServerConfiguration;
	readonly fs: FileSystemProvider;

	/**
	 * Clears all cached documents, forcing everything to be reparsed the next time a feature is used.
	 */
	clearCache(): void;
	/**
	 * You may want to use this to set the workspace root.
	 * @param settings {@link LanguageServerConfiguration}
	 *
	 * @example
	 * ```js
	 * languageService.configure({
	 *   workspace: {
	 * 	  workspaceRoot: URI.parse(this.workspace),
	 *   },
	 * });
	 * ```
	 */
	configure(settings: RecursivePartial<LanguageServerConfiguration>): void;
	doComplete(
		document: TextDocument,
		position: Position,
	): Promise<CompletionList>;
	doDiagnostics(document: TextDocument): Promise<Diagnostic[]>;
	doHover(document: TextDocument, position: Position): Promise<Hover | null>;
	/**
	 * Called after a {@link prepareRename} to perform the actual renaming.
	 */
	doRename(
		document: TextDocument,
		position: Position,
		newName: string,
	): Promise<WorkspaceEdit | null>;
	doSignatureHelp(
		document: TextDocument,
		position: Position,
	): Promise<SignatureHelp | null>;
	findColors(document: TextDocument): Promise<ColorInformation[]>;
	findDefinition(
		document: TextDocument,
		position: Position,
	): Promise<Location | null>;
	findDocumentHighlights(
		document: TextDocument,
		position: Position,
	): DocumentHighlight[];
	findDocumentLinks(document: TextDocument): Promise<StylesheetDocumentLink[]>;
	findDocumentSymbols(document: TextDocument): SassDocumentSymbol[];
	findReferences(
		document: TextDocument,
		position: Position,
		context?: ReferenceContext,
	): Promise<Location[]>;
	findWorkspaceSymbols(query?: string): SymbolInformation[];
	getColorPresentations(
		document: TextDocument,
		color: Color,
		range: Range,
	): ColorPresentation[];
	getCodeActions(
		document: TextDocument,
		range: Range,
		context?: CodeActionContext,
	): Promise<CodeAction[]>;
	getFoldingRanges(
		document: TextDocument,
		context?: FoldingRangeContext,
	): Promise<FoldingRange[]>;
	getSelectionRanges(
		document: TextDocument,
		positions: Position[],
	): Promise<SelectionRange[]>;
	getCachedTextDocument(uri: URI): TextDocument | undefined;
	/**
	 * Utility function to reparse an updated document.
	 * Like {@link LanguageService.parseStylesheet}, but returns nothing.
	 */
	onDocumentChanged(document: TextDocument): void;
	/**
	 * Cleans up the document from the internal cache.
	 * @param {TextDocument | string} document Either the document itself or {@link TextDocument.uri}
	 */
	onDocumentRemoved(document: TextDocument | string): void;
	/**
	 * Called internally by the other functions to get a cached AST of the document, or parse it if none exists.
	 * You typically won't use this directly, but you can if you need access to the raw AST for the document.
	 */
	parseStylesheet(document: TextDocument): Stylesheet;
	/**
	 * Step one of a rename process, followed by {@link doRename}.
	 */
	prepareRename(
		document: TextDocument,
		position: Position,
	): Promise<
		null | { defaultBehavior: boolean } | { range: Range; placeholder: string }
	>;
	/**
	 * Load custom data sets, for example custom at-rules, for use in completions and diagnostics.
	 *
	 * @see https://github.com/microsoft/vscode-css-languageservice/blob/main/docs/customData.md
	 */
	setDataProviders(
		customDataProviders: ICSSDataProvider[],
		options?: SetDataProvidersOptions,
	): void;
}

export type SetDataProvidersOptions = {
	useDefaultProviders: boolean;
};

export type Rename =
	| { range: Range; placeholder: string }
	| { defaultBehavior: boolean };

export type LintLevel = "ignore" | "warning" | "error";

export interface LanguageConfiguration {
	/**
	 * A list of relative file paths pointing to JSON files following the custom data format.
	 * Some Sass loads custom data on startup to enhance its CSS support for CSS custom properties (variables), at-rules, pseudo-classes, and pseudo-elements you specify in the JSON files.
	 * The file paths are relative to workspace and only workspace folder settings are considered.
	 */
	customData?: string[];
	codeAction: {
		enabled: boolean;
	};
	colors: {
		enabled: boolean;
		/**
		 * Compatibility setting for VS Code.
		 *
		 * By default the built-in SCSS server shows color decorators for colors declared in the current document.
		 * To avoid duplicates, by default Some Sass (only in VS Code) will only show color decorators where a variable is being used.
		 */
		includeFromCurrentDocument: boolean;
	};
	completion: {
		enabled: boolean;
		/**
		 * Include CSS completions.
		 */
		css?: boolean;
		/**
		 * 	Mixins with `@content` SassDoc annotations and `%placeholders` get two suggestions by default:
		 *   - One without `{ }`.
		 *   - One _with_ `{ }`. This one creates a new block, and moves the cursor inside the block.
		 *
		 * If you find this noisy, you can control which suggestions you would like to see:
		 *   - All suggestions (default).
		 *   - No brackets.
		 *   - Only brackets. This still includes other suggestions, where there are no brackets to begin with.
		 */
		mixinStyle?: "all" | "nobracket" | "bracket";
		/**
		 * Recommended if you don't rely on `@import` in Sass. With this setting turned on,
		 * Some Sass will only suggest variables, mixins and functions from the
		 * namespaces that are in use in the open document.
		 */
		suggestFromUseOnly?: boolean;
		/**
		 * By default, Some Sass triggers property value completion after selecting a CSS property.
		 * Use this setting to disable this behavior.
		 */
		triggerPropertyValueCompletion: boolean;
		completePropertyWithSemicolon?: boolean;
		/**
		 * Compatibility setting for VS Code.
		 *
		 * By default the built-in SCSS server shows suggestions for variables, mixins and functions declared in the current document.
		 * To avoid duplicates, by default Some Sass (only in VS Code) will not suggest them.
		 */
		includeFromCurrentDocument: boolean;
	};
	definition: {
		enabled: boolean;
	};
	diagnostics: {
		enabled: boolean;
		deprecation: {
			enabled: boolean;
		};
		lint: {
			enabled: boolean;
			compatibleVendorPrefixes: LintLevel;
			vendorPrefix: LintLevel;
			duplicateProperties: LintLevel;
			emptyRules: LintLevel;
			importStatement: LintLevel;
			boxModel: LintLevel;
			universalSelector: LintLevel;
			zeroUnits: LintLevel;
			fontFaceProperties: LintLevel;
			hexColorLength: LintLevel;
			argumentsInColorFunction: LintLevel;
			unknownProperties: LintLevel;
			validProperties: string[];
			ieHack: LintLevel;
			unknownVendorSpecificProperties: LintLevel;
			propertyIgnoredDueToDisplay: LintLevel;
			important: LintLevel;
			float: LintLevel;
			idSelector: LintLevel;
			unknownAtRules: LintLevel;
			[key: string]: any;
		};
	};
	documentSymbols: {
		enabled: boolean;
	};
	foldingRanges: {
		enabled: boolean;
	};
	highlights: {
		enabled: boolean;
	};
	hover: {
		enabled: boolean;
		documentation: boolean;
		references: boolean;
	};
	links: {
		enabled: boolean;
	};
	references: {
		enabled: boolean;
	};
	rename: {
		enabled: boolean;
	};
	selectionRanges: {
		enabled: boolean;
	};
	semanticTokens: {
		enabled: boolean;
	};
	signatureHelp: {
		enabled: boolean;
	};
	workspaceSymbol: {
		enabled: boolean;
	};
}

export interface WorkspaceConfiguration {
	exclude: string[];
	importAliases: {
		[key: string]: any;
	};
	/**
	 * Pass in [load paths](https://sass-lang.com/documentation/cli/dart-sass/#load-path) that will be used in addition to `node_modules`.
	 */
	loadPaths: string[];
	workspaceRoot?: URI;
	logLevel: "trace" | "debug" | "info" | "warn" | "error" | "fatal" | "silent";
}

export interface LanguageServerConfiguration {
	css: LanguageConfiguration;
	sass: LanguageConfiguration;
	scss: LanguageConfiguration;
	editor: EditorConfiguration;
	workspace: WorkspaceConfiguration;
}

export interface EditorConfiguration {
	/**
	 * Insert spaces rather than tabs.
	 */
	insertSpaces: boolean;
	/**
	 * If {@link insertSpaces} is true this option determines the number of space characters is inserted per indent level.
	 */
	indentSize: number;
	/**
	 * An older editor setting in VS Code. If both this and {@link indentSize} is set, only `indentSize` will be used.
	 */
	tabSize: number;
	/**
	 * Controls the max number of color decorators that can be rendered in an editor at once.
	 */
	colorDecoratorsLimit: number;
}

export interface AliasSettings {
	[key: string]: string;
}

export interface ClientCapabilities {
	textDocument?: {
		completion?: {
			completionItem?: {
				documentationFormat?: MarkupKind[];
				insertReplaceSupport?: boolean;
				snippetSupport?: boolean;
			};
		};
		hover?: {
			contentFormat?: MarkupKind[];
		};
	};
}

export type Logger = {
	fatal(message: string): void;
	error(message: string): void;
	warn(message: string): void;
	info(message: string): void;
	debug(message: string): void;
	trace(message: string): void;
};

export interface LanguageServiceOptions {
	clientCapabilities: ClientCapabilities;
	/**
	 * Abstract file system access away from the service to support
	 * both direct file system access and browser file system access
	 * via the LSP client.
	 *
	 * Used for dynamic link resolving, path completion, etc.
	 */
	fileSystemProvider: FileSystemProvider;
	languageModelCache?: LanguageModelCacheOptions;
	logger?: Logger;
}

export type LanguageModelCacheOptions = {
	/**
	 * @default 0 - off
	 */
	cleanupIntervalTimeInSeconds?: number;
	/**
	 * @default 10_000
	 */
	maxEntries?: number;
};

export enum FileType {
	Unknown = 0,
	File = 1,
	Directory = 2,
	SymbolicLink = 64,
}

export interface FileStat {
	type: FileType;
	/**
	 * The creation timestamp in milliseconds elapsed since January 1, 1970 00:00:00 UTC.
	 */
	ctime: number;
	/**
	 * The modification timestamp in milliseconds elapsed since January 1, 1970 00:00:00 UTC.
	 */
	mtime: number;
	/**
	 * The size in bytes.
	 */
	size: number;
}

/**
 * Abstract file system access away from the service to support
 * both direct file system access and browser file system access
 * via the LSP client.
 *
 * Used for dynamic link resolving, path completion, etc.
 */
export interface FileSystemProvider {
	exists(uri: URI): Promise<boolean>;
	/**
	 * Finds files in the workspace.
	 * @param include Glob pattern to search for
	 * @param exclude Glob pattern or patterns to exclude
	 */
	findFiles(
		include: string,
		exclude?: string | string[] | null,
	): Promise<URI[]>;
	readFile(uri: URI, encoding?: BufferEncoding): Promise<string>;
	readDirectory(uri: URI): Promise<[string, FileType][]>;
	stat(uri: URI): Promise<FileStat>;
	/**
	 * For monorepos, resolve the actual location on disk rather than the URL to the symlink.
	 * @param uri The path to resolve
	 */
	realPath(uri: URI): Promise<URI>;
}

export {
	URI,
	Utils,
	TextDocument,
	Range,
	Position,
	ReferenceContext,
	MarkupKind,
	Color,
	ColorInformation,
	ColorPresentation,
	Diagnostic,
	DiagnosticTag,
	DiagnosticSeverity,
	CompletionItem,
	CompletionItemKind,
	CompletionList,
	CompletionItemTag,
	InsertTextFormat,
	SymbolInformation,
	SymbolKind,
	DocumentSymbol,
	Location,
	Hover,
	SignatureHelp,
	CodeActionContext,
	CodeAction,
	DocumentHighlight,
	DocumentLink,
	WorkspaceEdit,
	TextEdit,
	CodeActionKind,
	TextDocumentEdit,
	VersionedTextDocumentIdentifier,
	Node,
	NodeType,
	VariableDeclaration,
	FunctionDeclaration,
	FunctionParameter,
	Function,
	MixinReference,
	MixinDeclaration,
	Variable,
	Identifier,
	Declaration,
	ForStatement,
	EachStatement,
	Import,
	Use,
	Forward,
	ForwardVisibility,
	StylesheetDocumentLink,
	SignatureInformation,
	ExtendsReference,
	TokenType,
	IToken,
	Module,
	Marker,
	FoldingRange,
	FoldingRangeKind,
	SelectionRange,
};
