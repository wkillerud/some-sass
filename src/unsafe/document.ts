import { getLanguageService } from './language-service';
import { getNodeAtOffset } from './utils/ast';
import { getLinesFromText } from './utils/document';

import type { IScssDocument, IScssSymbols, ScssForward, ScssFunction, ScssImport, ScssLink, ScssMixin, ScssSymbol, ScssUse, ScssVariable } from './types/symbols';
import type { Position, Range, TextDocument } from 'vscode-languageserver-textdocument';
import type { INode } from './types/nodes';

const ls = getLanguageService();

export class ScssDocument implements IScssDocument {
	protected _document: TextDocument;
	protected _ast: INode;

	public imports: Map<string, ScssImport> = new Map();
	public uses: Map<string, ScssUse> = new Map();
	public forwards: Map<string, ScssForward> = new Map();
	public variables: Map<string, ScssVariable> = new Map();
	public mixins: Map<string, ScssMixin> = new Map();
	public functions: Map<string, ScssFunction> = new Map();

	constructor(document: TextDocument, symbols: IScssSymbols) {
		this._document = document;
		this._ast = ls.parseStylesheet(document) as INode;
		this.imports = symbols.imports;
		this.uses = symbols.uses;
		this.forwards = symbols.forwards;
		this.variables = symbols.variables;
		this.mixins = symbols.mixins;
		this.functions = symbols.functions;
	}

	public get uri(): string {
		return this._document.uri;
	}

	public get fileName(): string {
		const uri = this._document.uri;
		const lastIndex = uri.lastIndexOf('/');
		return lastIndex === -1 ? uri : uri.substring(lastIndex + 1);
	}

	public get languageId(): string {
		return this._document.languageId;
	}

	public get version(): number {
		return this._document.version;
	}

	public getText(range?: Range): string {
		return this._document.getText(range);
	}

	public getNodeAt(offset: number): INode | null {
		return getNodeAtOffset(this._ast, offset);
	}

	public positionAt(offset: number): Position {
		return this._document.positionAt(offset);
	}

	public offsetAt(position: Position): number {
		return this._document.offsetAt(position);
	}

	public get lineCount(): number {
		return this._document.lineCount;
	}

	public getLines(): string[] {
		return getLinesFromText(this._document.getText());
	}

	public getSymbols(): ScssSymbol[] {
		const symbols: ScssSymbol[] = [];

		for (const [, variable] of this.variables) {
			symbols.push(variable);
		}

		for (const [, mixin] of this.mixins) {
			symbols.push(mixin);
		}

		for (const [, function_] of this.functions) {
			symbols.push(function_);
		}

		return symbols;
	}

	public getLinks(): ScssLink[] {
		const links: ScssLink[] = [];

		for (const [, import_] of this.imports) {
			links.push(import_);
		}

		for (const [, use] of this.uses) {
			links.push(use);
		}

		for (const [, forward] of this.forwards) {
			links.push(forward);
		}

		return links;
	}
}
