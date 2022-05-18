'use strict';

import type { ParseResult } from 'scss-sassdoc-parser';
import type { Position, TextDocument } from 'vscode-languageserver-textdocument';
import type { DocumentLink, SymbolKind } from 'vscode-languageserver-types';
import type { INode } from './nodes';

export interface ScssSymbol {
	kind: SymbolKind;
	name: string;
	sassdoc?: ParseResult;
	position: Position;
	offset: number;
}

export interface ScssVariable extends ScssSymbol {
	mixin?: string;
	value: string | null;
}

export interface ScssMixin extends ScssSymbol {
	parameters: Omit<ScssVariable, 'position' | 'kind'>[];
}

export interface ScssFunction extends ScssMixin {}

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
}

export interface IScssDocument extends TextDocument, IScssSymbols {
	/**
	 * The last part of the URI, including extension.
	 * For instance, given the URI `file:///home/test.scss`,
	 * the fileName is `test.scss`.
	 */
	fileName: string;
	getLinks: () => ScssLink[];
	getSymbols: () => ScssSymbol[];
	getNodeAt: (offset: number) => INode | null;
}
