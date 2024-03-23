/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

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
	HoverSetting,
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

export enum NodeType {
	Undefined,
	Identifier,
	Stylesheet,
	Ruleset,
	Selector,
	SimpleSelector,
	SelectorInterpolation,
	SelectorCombinator,
	SelectorCombinatorParent,
	SelectorCombinatorSibling,
	SelectorCombinatorAllSiblings,
	SelectorCombinatorShadowPiercingDescendant,
	Page,
	PageBoxMarginBox,
	ClassSelector,
	IdentifierSelector,
	ElementNameSelector,
	PseudoSelector,
	AttributeSelector,
	Declaration,
	Declarations,
	Property,
	Expression,
	BinaryExpression,
	Term,
	Operator,
	Value,
	StringLiteral,
	URILiteral,
	EscapedValue,
	Function,
	NumericValue,
	HexColorValue,
	RatioValue,
	MixinDeclaration,
	MixinReference,
	VariableName,
	VariableDeclaration,
	Prio,
	Interpolation,
	NestedProperties,
	ExtendsReference,
	SelectorPlaceholder,
	Debug,
	If,
	Else,
	For,
	Each,
	While,
	MixinContentReference,
	MixinContentDeclaration,
	Media,
	Keyframe,
	FontFace,
	Import,
	Namespace,
	Invocation,
	FunctionDeclaration,
	ReturnStatement,
	MediaQuery,
	MediaCondition,
	MediaFeature,
	FunctionParameter,
	FunctionArgument,
	KeyframeSelector,
	ViewPort,
	Document,
	AtApplyRule,
	CustomPropertyDeclaration,
	CustomPropertySet,
	ListEntry,
	Supports,
	SupportsCondition,
	NamespacePrefix,
	GridLine,
	Plugin,
	UnknownAtRule,
	Use,
	ModuleConfiguration,
	Forward,
	ForwardVisibility,
	Module,
	UnicodeRange,
	Layer,
	LayerNameList,
	LayerName,
	PropertyAtRule,
	Container,
}

export interface INode {
	parent: INode | null;
	type: NodeType;
	offset: number;
	length: number;
	end: number;
	options: { [name: string]: any } | undefined;
	accept: (node: (node: INode) => boolean) => void;
	acceptVisitor: (visitor: { visitNode: (node: INode) => boolean }) => void;
	getName: () => string;
	getValue: () => INode;
	getDefaultValue: () => INode;
	getText: () => string;
	getParameters: () => INode;
	getIdentifier: () => INode;
	getSelectors: () => INode;
	matches(str: string): boolean;
	startsWith(str: string): boolean;
	endsWith(str: string): boolean;
	adoptChild(INode: INode, index?: number): INode;
	attachTo(parent: INode, index?: number): INode;
	collectIssues(results: any[]): void;
	addIssue(issue: IMarker): void;
	hasIssue(rule: IRule): boolean;
	/**
	 * @param [recursive] - default false
	 */
	isErroneous(recursive?: boolean): boolean;
	setNode(field: keyof this, INode: INode | null, index?: number): boolean;
	addChild(INode: INode | null): INode is INode;
	hasChildren(): boolean;
	getChildren(): INode[];
	getChild(index: number): INode | null;
	addChildren(nodes: INode[]): void;
	findFirstChildBeforeOffset(offset: number): INode | null;
	findChildAtOffset(offset: number, goDeep: boolean): INode | null;
	encloses(candidate: INode): boolean;
	getParent(): INode | null;
	findParent(type: NodeType): INode | null;
	findAParent(...types: NodeType[]): INode | null;
	setData(key: string, value: any): void;
	getData(key: string): any;
}

export interface IMarker {
	getNode(): INode;
	getMessage(): string;
	getOffset(): number;
	getLength(): number;
	getRule(): IRule;
	getLevel(): Level;
}

export interface IRule {
	id: string;
	message: string;
}

export enum Level {
	Ignore = 1,
	Warning = 2,
	Error = 4,
}

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
export type Stylesheet = INode;

export interface SassDocumentSymbol extends DocumentSymbol {
	sassdoc?: ParseResult;
}

export interface LanguageService {
	findDocumentLinks(document: TextDocument): Promise<SassDocumentLink[]>;
	findDocumentSymbols(document: TextDocument): Promise<SassDocumentSymbol[]>;
	/**
	 * Utility function to reparse an updated document.
	 * Like {@link LanguageService.parseStylesheet}, but returns nothing.
	 */
	onDocumentChanged(document: TextDocument): void;
	/**
	 * Cleans up the document from the internal cache.
	 */
	onDocumentRemoved(document: TextDocument): void;
	/**
	 * Clears all cached documents, forcing everything to be reparsed the next time a feature is used.
	 */
	clearCache(): void;
	/**
	 * Called internally by the other functions to get a cached AST of the document, or parse it if none exists.
	 * You typically won't use this directly, but you can if you need access to the raw AST for the document.
	 */
	parseStylesheet(document: TextDocument): Promise<Stylesheet>;
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
	HoverSetting,
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
};
