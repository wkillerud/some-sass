import {
	Node,
	NodeType,
	FunctionDeclaration,
	Function,
	FunctionArgument,
	FunctionParameter,
	MixinReference,
	MixinContentDeclaration,
	MixinContentReference,
	MixinDeclaration,
	Variable,
	SimpleSelector,
	VariableDeclaration,
	Nodelist,
	UnicodeRange,
	Identifier,
	Declarations,
	BodyDeclaration,
	RuleSet,
	Selector,
	AtApplyRule,
	CustomPropertySet,
	Declaration,
	CustomPropertyDeclaration,
	Property,
	Invocation,
	IfStatement,
	ForStatement,
	EachStatement,
	WhileStatement,
	ElseStatement,
	ViewPort,
	FontFace,
	NestedProperties,
	Keyframe,
	KeyframeSelector,
	Import,
	Use,
	ModuleConfiguration,
	Forward,
	ForwardVisibility,
	Namespace,
	Media,
	Supports,
	Layer,
	PropertyAtRule,
	Document,
	Container,
	Medialist,
	MediaQuery,
	MediaCondition,
	MediaFeature,
	SupportsCondition,
	Page,
	PageBoxMarginBox,
	Expression,
	BinaryExpression,
	Term,
	AttributeSelector,
	Operator,
	HexColorValue,
	RatioValue,
	NumericValue,
	Interpolation,
	ExtendsReference,
	UnknownAtRule,
	ListEntry,
	LessGuard,
	GuardCondition,
	Module,
	Marker,
	getNodeAtOffset,
} from "@somesass/vscode-css-languageservice";
import type { ParseResult } from "scss-sassdoc-parser";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
	Range,
	Position,
	DocumentUri,
	MarkupContent,
	MarkupKind,
	Color,
	ColorInformation,
	ColorPresentation,
	FoldingRange,
	FoldingRangeKind,
	SignatureHelp,
	SelectionRange,
	ReferenceContext,
	SymbolTag,
	Diagnostic,
	DiagnosticTag,
	DiagnosticSeverity,
	CompletionItem,
	CompletionItemKind,
	CompletionList,
	CompletionItemTag,
	InsertTextFormat,
	DefinitionLink,
	SymbolInformation,
	SymbolKind,
	DocumentSymbol,
	Location,
	Hover,
	MarkedString,
	CodeActionContext,
	Command,
	CodeAction,
	DocumentHighlight,
	DocumentLink,
	WorkspaceEdit,
	TextEdit,
	CodeActionKind,
	TextDocumentEdit,
	VersionedTextDocumentIdentifier,
	DocumentHighlightKind,
} from "vscode-languageserver-types";
import { URI, Utils } from "vscode-uri";

export interface SassDocumentLink extends DocumentLink {
	/**
	 * The namespace of the module. Either equal to {@link as} or derived from {@link target}.
	 *
	 * | Link               | Value      |
	 * | ------------------ | ---------- |
	 * | `"./colors"`       | `"colors"` |
	 * | `"./colors" as c`  | `"c"`      |
	 * | `"./colors" as *`  | `"*"`      |
	 * | `"./_colors"`      | `"colors"` |
	 * | `"./_colors.scss"` | `"colors"` |
	 *
	 * @see https://sass-lang.com/documentation/at-rules/use/#choosing-a-namespace
	 */
	namespace?: string;
	/**
	 * | Link                         | Value       |
	 * | ---------------------------- | ----------- |
	 * | `@use "./colors"`            | `undefined` |
	 * | `@use "./colors" as c`       | `"c"`       |
	 * | `@use "./colors" as *`       | `"*"`       |
	 * | `@forward "./colors"`        | `undefined` |
	 * | `@forward "./colors" as c-*` | `"c"`       |
	 *
	 * @see https://sass-lang.com/documentation/at-rules/use/#choosing-a-namespace
	 * @see https://sass-lang.com/documentation/at-rules/forward/#adding-a-prefix
	 */
	as?: string;
	/**
	 * @see https://sass-lang.com/documentation/at-rules/forward/#controlling-visibility
	 */
	hide?: string[];
	/**
	 * @see https://sass-lang.com/documentation/at-rules/forward/#controlling-visibility
	 */
	show?: string[];
	type?: NodeType;
}

/**
 * The root of the abstract syntax tree.
 */
export type Stylesheet = Node;

export interface SassDocumentSymbol extends DocumentSymbol {
	sassdoc?: ParseResult;
	children?: SassDocumentSymbol[];
}

export interface LanguageService {
	findDocumentLinks(document: TextDocument): Promise<SassDocumentLink[]>;
	findDocumentSymbols(document: TextDocument): SassDocumentSymbol[];
	findWorkspaceSymbols(query?: string): SymbolInformation[];
	findDefinition(
		document: TextDocument,
		position: Position,
	): Promise<Location | null>;
	findDocumentHighlights(
		document: TextDocument,
		position: Position,
	): DocumentHighlight[];
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
	 * Clears all cached documents, forcing everything to be reparsed the next time a feature is used.
	 */
	clearCache(): void;
	/**
	 * Called internally by the other functions to get a cached AST of the document, or parse it if none exists.
	 * You typically won't use this directly, but you can if you need access to the raw AST for the document.
	 */
	parseStylesheet(document: TextDocument): Stylesheet;
	/**
	 * You may want to use this to set the workspace root.
	 * @param settings {@link LanguageServiceConfiguration}
	 *
	 * @example
	 * ```js
	 * languageService.configure({
	 *   workspaceRoot: URI.parse(this.workspace),
	 * });
	 * ```
	 */
	configure(settings: LanguageServiceConfiguration): void;
}

export type Rename =
	| { range: Range; placeholder: string }
	| { defaultBehavior: boolean };

export interface LanguageServiceConfiguration {
	/**
	 * Configure custom aliases that the link resolution should resolve.
	 *
	 * @example
	 * ```js
	 * importAliases: {
	 *   // \@import "@SassStylesheet" would resolve to /src/assets/style.sass
	 *   "@SassStylesheet": "/src/assets/styles.sass",
	 * }
	 * ```
	 */
	importAliases?: AliasSettings;
	workspaceRoot?: URI;
}

export interface AliasSettings {
	[key: string]: string;
}

export interface ClientCapabilities {
	textDocument?: {
		completion?: {
			completionItem?: {
				documentationFormat?: MarkupKind[];
			};
		};
		hover?: {
			contentFormat?: MarkupKind[];
		};
	};
}

export namespace ClientCapabilities {
	export const LATEST: ClientCapabilities = {
		textDocument: {
			completion: {
				completionItem: {
					documentationFormat: [MarkupKind.Markdown, MarkupKind.PlainText],
				},
			},
			hover: {
				contentFormat: [MarkupKind.Markdown, MarkupKind.PlainText],
			},
		},
	};
}

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
}

export type LanguageModelCacheOptions = {
	/**
	 * @default 0 – disabled
	 */
	cleanupIntervalTimeInSeconds?: number;
	/**
	 * @default Number.MAX_SAFE_INTEGER
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
	readDirectory(uri: URI): Promise<[URI, FileType][]>;
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
	getNodeAtOffset,
	Range,
	Position,
	DocumentUri,
	MarkupContent,
	ReferenceContext,
	MarkupKind,
	Color,
	ColorInformation,
	ColorPresentation,
	FoldingRange,
	FoldingRangeKind,
	SelectionRange,
	Diagnostic,
	DiagnosticTag,
	DiagnosticSeverity,
	CompletionItem,
	CompletionItemKind,
	CompletionList,
	CompletionItemTag,
	InsertTextFormat,
	DefinitionLink,
	SymbolInformation,
	SymbolKind,
	SymbolTag,
	DocumentSymbol,
	Location,
	Hover,
	MarkedString,
	SignatureHelp,
	CodeActionContext,
	Command,
	CodeAction,
	DocumentHighlight,
	DocumentLink,
	WorkspaceEdit,
	TextEdit,
	CodeActionKind,
	TextDocumentEdit,
	VersionedTextDocumentIdentifier,
	DocumentHighlightKind,
	Node,
	NodeType,
	VariableDeclaration,
	FunctionDeclaration,
	FunctionParameter,
	FunctionArgument,
	Function,
	MixinReference,
	MixinDeclaration,
	MixinContentDeclaration,
	MixinContentReference,
	Variable,
	SimpleSelector,
	Nodelist,
	UnicodeRange,
	Identifier,
	Declarations,
	BodyDeclaration,
	RuleSet,
	Selector,
	AtApplyRule,
	CustomPropertySet,
	Declaration,
	CustomPropertyDeclaration,
	Property,
	Invocation,
	IfStatement,
	ForStatement,
	EachStatement,
	WhileStatement,
	ElseStatement,
	ViewPort,
	FontFace,
	NestedProperties,
	Keyframe,
	KeyframeSelector,
	Import,
	Use,
	ModuleConfiguration,
	Forward,
	ForwardVisibility,
	Namespace,
	Media,
	Supports,
	Layer,
	PropertyAtRule,
	Document,
	Container,
	Medialist,
	MediaQuery,
	MediaCondition,
	MediaFeature,
	SupportsCondition,
	Page,
	PageBoxMarginBox,
	Expression,
	BinaryExpression,
	Term,
	AttributeSelector,
	Operator,
	HexColorValue,
	RatioValue,
	NumericValue,
	Interpolation,
	ExtendsReference,
	UnknownAtRule,
	ListEntry,
	LessGuard,
	GuardCondition,
	Module,
	Marker,
};
