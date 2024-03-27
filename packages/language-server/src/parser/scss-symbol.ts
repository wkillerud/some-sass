import {
	Node,
	DocumentLink,
	Position,
	TextDocument,
	SymbolKind,
	Range,
} from "@somesass/language-services";
import type { ParseResult } from "scss-sassdoc-parser";

export interface ScssSymbol {
	kind: SymbolKind;
	name: string;
	detail?: string;
	sassdoc?: ParseResult;
	position: Position;
	offset: number;
}

export interface ScssVariable extends ScssSymbol {
	mixin?: string;
	value: string | null;
}

export type ScssMixin = ScssSymbol;
export type ScssFunction = ScssSymbol;
export type ScssPlaceholder = ScssSymbol;
export type ScssPlaceholderUsage = ScssSymbol;

export interface ScssLink {
	link: DocumentLink;
}

export interface ScssUse extends ScssLink {
	namespace?: string;
	/** Indicates whether the namespace is different from the file name. */
	isAliased: boolean;
}

export interface ScssForward extends ScssLink {
	hide: string[];
	show: string[];
	prefix?: string;
}

export interface ScssImport extends ScssLink {
	css: boolean;
	dynamic: boolean;
}

export interface IScssSymbols {
	imports: Map<string, ScssImport>;
	uses: Map<string, ScssUse>;
	forwards: Map<string, ScssForward>;
	variables: Map<string, ScssVariable>;
	mixins: Map<string, ScssMixin>;
	functions: Map<string, ScssFunction>;
	placeholders: Map<string, ScssPlaceholder>;
	placeholderUsages: Map<string, ScssPlaceholderUsage>;
}

export interface IScssDocument extends TextDocument, IScssSymbols {
	textDocument: TextDocument;
	ast: Node;
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
	}) => ScssLink[];
	getSymbols: () => ScssSymbol[];
	getNodeAt: (offset: number) => Node | null;
	getNodeRange: (node: Node) => Range;
}
