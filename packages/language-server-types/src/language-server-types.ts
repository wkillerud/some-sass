/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {
	Tree,
	TreeCursor,
	TreeFragment,
	SyntaxNode,
	SyntaxNodeType,
} from "@somesass/parser";
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
	type?:
		| SyntaxNodeType.ImportStatement
		| SyntaxNodeType.UseStatement
		| SyntaxNodeType.ForwardStatement;
}

/**
 * The root of the abstract syntax {@link Tree}.
 */
export type Stylesheet = Tree;

export interface SassDocumentSymbol extends DocumentSymbol {
	type: SyntaxNodeType;
	children?: SassDocumentSymbol[];
	sassdoc?: ParseResult;
}

export interface LanguageService {
	configure(settings?: LanguageSettings): void;
	parseStylesheet(document: TextDocument): Stylesheet;
	findDocumentLinks(
		document: TextDocument,
		stylesheet: Stylesheet,
		documentContext: DocumentContext,
	): Promise<SassDocumentLink[]>;
	findDocumentSymbols(
		document: TextDocument,
		stylesheet: Stylesheet,
	): SassDocumentSymbol[];
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

export interface SassTextDocument extends TextDocument {
	ast: Stylesheet;
	/**
	 * The last part of the URI, including extension.
	 * For instance, given the URI `file:///home/test.scss`,
	 * the fileName is `test.scss`.
	 */
	fileName: string;
	/** Find and cache the real path (as opposed to symlinked) */
	getRealPath: () => Promise<string | null>;
	getLinks: (options?: {
		forwards?: boolean;
		uses?: boolean;
		imports?: boolean;
	}) => SassDocumentLink[];
	getSymbolAt: (offset: number) => SassDocumentSymbol;
	getSymbols: () => SassDocumentSymbol[];
}

export {
	Tree,
	TreeCursor,
	TreeFragment,
	SyntaxNode,
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
