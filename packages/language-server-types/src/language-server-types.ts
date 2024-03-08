/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Tree, SyntaxNode } from "@lezer/common";
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
	SelectionRange,
	Diagnostic,
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

export {
	SyntaxNode,
	URI,
	Utils,
	TextDocument,
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
	SelectionRange,
	Diagnostic,
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
};

export interface SassDocumentLink extends DocumentLink {
	/**
	 * use: the namespace of the module
	 * forward: the prefix value
	 *
	 * | Link               | Namespace  |
	 * | ------------------ | ---------- |
	 * | `"./colors"`       | `"colors"` |
	 * | `"./colors" as c`  | `"c"`      |
	 * | `"./colors" as *`  | `"*"`      |
	 * | `"./_colors"`      | `"colors"` |
	 * | `"./_colors.scss"` | `"colors"` |
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
	type?:
		| SyntaxNodeTypes.ImportStatement
		| SyntaxNodeTypes.UseStatement
		| SyntaxNodeTypes.ForwardStatement;
}

/**
 * The root of the abstract syntax {@link Tree}.
 */
export type Stylesheet = Tree;

export * from "@lezer/common";

export interface LanguageService {
	configure(settings?: LanguageSettings): void;
	parseStylesheet(document: TextDocument): Stylesheet;
	findDocumentLinks(
		document: TextDocument,
		stylesheet: Stylesheet,
		documentContext: DocumentContext,
	): Promise<SassDocumentLink[]>;
}

export type Rename =
	| { range: Range; placeholder: string }
	| { defaultBehavior: boolean };

export interface DocumentContext {
	resolveReference(ref: string, baseUrl: string): string | undefined;
}

export interface LanguageSettings {
	importAliases?: AliasSettings;
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
	clientCapabilities?: ClientCapabilities;
	/**
	 * Abstract file system access away from the service to support
	 * both direct file system access and browser file system access
	 * via the LSP client.
	 *
	 * Used for dynamic link resolving, path completion, etc.
	 */
	fileSystemProvider?: FileSystemProvider;
}

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
	readDirectory(uri: string): Promise<[string, FileType][]>;
	stat(uri: URI): Promise<FileStat>;
	/**
	 * For monorepos, resolve the actual location on disk rather than the URL to the symlink.
	 * @param uri The path to resolve
	 */
	realPath(uri: URI): Promise<URI>;
}

/**
 * Enum of the different at keyword types defined in the grammar.
 * @see https://github.com/lezer-parser/sass/blob/main/src/sass.grammar
 */
export enum AtKeyword {
	Import = "@import",
	Include = "@include",
	Mixin = "@mixin",
	Function = "@function",
	Use = "@use",
	Extend = "@extend",
	AtRoot = "@at-root",
	Forward = "@forward",
	Media = "@media",
	Charset = "@charset",
	Namespace = "@namespace",
	Keyframes = "@keyframes",
	Supports = "@supports",
	If = "@if",
	Else = "@else",
	For = "@for",
	Each = "@each",
	While = "@while",
	Debug = "@debug",
	Warn = "@warn",
	Error = "@error",
	Return = "@return",
}

/**
 * Enum of the different node types defined in the grammar.
 * @see https://github.com/lezer-parser/sass/blob/main/src/sass.grammar
 */
export enum SyntaxNodeTypes {
	Whitespace = "whitespace",
	Comment = "Comment",
	LineComment = "LineComment",
	BlankLine = "blankLine",

	StyleSheet = "StyleSheet",
	Styles = "Styles",

	RuleSet = "RuleSet",
	ImportStatement = "ImportStatement",
	IncludeStatement = "IncludeStatement",
	MixinStatement = "MixinStatement",
	UseStatement = "UseStatement",
	ExtendStatement = "ExtendStatement",
	RootStatement = "RootStatement",
	ForwardStatement = "ForwardStatement",
	MediaStatement = "MediaStatement",
	CharsetStatement = "CharsetStatement",
	NamespaceStatement = "NamespaceStatement",
	KeyframesStatement = "KeyframesStatement",
	SupportsStatement = "SupportsStatement",
	IfStatement = "IfStatement",
	ForStatement = "ForStatement",
	EachStatement = "EachStatement",
	WhileStatement = "WhileStatement",
	OutputStatement = "OutputStatement",
	AtRule = "AtRule",

	Block = "Block",

	Declaration = "Declaration",

	Error = "⚠",
	InterpolationEnd = "InterpolationEnd",
	InterpolationContinue = "InterpolationContinue",
	Unit = "Unit",
	VariableName = "VariableName",
	InterpolationStart = "InterpolationStart",

	IndentedMixin = "IndentedMixin",
	IndentedInclude = "IndentedInclude",
	UniversalSelector = "UniversalSelector",
	TagSelector = "TagSelector",
	TagName = "TagName",
	NestingSelector = "NestingSelector",
	SuffixedSelector = "SuffixedSelector",
	Suffix = "Suffix",
	Interpolation = "Interpolation",
	SassVariableName = "SassVariableName",
	ValueName = "ValueName",
	RightParentheses = ")",
	LeftParentheses = "(",
	ParenthesizedValue = "ParenthesizedValue",
	ColorLiteral = "ColorLiteral",
	NumberLiteral = "NumberLiteral",
	StringLiteral = "StringLiteral",
	BinaryExpression = "BinaryExpression",
	BinOp = "BinOp",
	LogicOp = "LogicOp",
	UnaryExpression = "UnaryExpression",
	NamespacedValue = "NamespacedValue",
	CallExpression = "CallExpression",
	Callee = "Callee",
	ArgList = "ArgList",
	ArgListSuffix = "...",
	Colon = ":",
	Comma = ",",
	CallLiteral = "CallLiteral",
	CallTag = "CallTag",
	ParenthesizedContent = "ParenthesizedContent",
	ClassSelector = "ClassSelector",
	ClassName = "ClassName",
	PseudoClassPrefix = "::",
	PseudoClassSelector = "PseudoClassSelector",
	PseudoClassName = "PseudoClassName",
	IdSelector = "IdSelector",
	IdPrefix = "#",
	IdName = "IdName",
	RightSquareBracket = "]",
	LeftSquareBracket = "[",
	AttributeSelector = "AttributeSelector",
	AttributeName = "AttributeName",
	MatchOp = "MatchOp",
	ChildSelector = "ChildSelector",
	ChildOp = "ChildOp",
	DescendantSelector = "DescendantSelector",
	SiblingSelector = "SiblingSelector",
	SiblingOp = "SiblingOp",
	RightCurlyBracket = "}",
	LeftCurlyBracket = "{",
	PropertyName = "PropertyName",
	Important = "Important",
	Global = "Global",
	Default = "Default",
	Semicolon = ";",
	AtKeyword = "AtKeyword",
	import = "import",
	KeywordQuery = "KeywordQuery",
	FeatureQuery = "FeatureQuery",
	FeatureName = "FeatureName",
	BinaryQuery = "BinaryQuery",
	UnaryQuery = "UnaryQuery",
	ParenthesizedQuery = "ParenthesizedQuery",
	SelectorQuery = "SelectorQuery",
	selector = "selector",
	include = "include",
	mixin = "mixin",
	use = "use",
	Keyword = "Keyword",
	extend = "extend",
	AtRoot = "at-root",
	forward = "forward",
	media = "media",
	charset = "charset",
	namespace = "namespace",
	NamespaceName = "NamespaceName",
	keyframes = "keyframes",
	KeyframeName = "KeyframeName",
	KeyframeList = "KeyframeList",
	supports = "supports",
	ControlKeyword = "ControlKeyword",
	ForwardPrefix = "ForwardPrefix",
	UseAs = "UseAs",

	Newline = "newline",
	EOF = "eof",
}
