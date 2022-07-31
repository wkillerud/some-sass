import type {
	Position,
	TextDocument,
} from "vscode-languageserver-textdocument";
import { Range } from "vscode-languageserver-types";
import { URI } from "vscode-uri";
import { getLanguageService } from "./language-service";
import type { INode } from "./nodes";
import type {
	IScssDocument,
	IScssSymbols,
	ScssForward,
	ScssFunction,
	ScssImport,
	ScssLink,
	ScssMixin,
	ScssSymbol,
	ScssUse,
	ScssVariable,
} from "./symbols";
import { getNodeAtOffset } from "./utils/ast";
import { getLinesFromText } from "./utils/document";
import { realPath } from "./utils/fs";

const ls = getLanguageService();

export class ScssDocument implements IScssDocument {
	public textDocument: TextDocument;
	public ast: INode;
	public fileName: string;

	public imports: Map<string, ScssImport> = new Map();
	public uses: Map<string, ScssUse> = new Map();
	public forwards: Map<string, ScssForward> = new Map();
	public variables: Map<string, ScssVariable> = new Map();
	public mixins: Map<string, ScssMixin> = new Map();
	public functions: Map<string, ScssFunction> = new Map();

	private _realPath: string | null = null;

	constructor(document: TextDocument, symbols: IScssSymbols, ast?: INode) {
		this.textDocument = document;
		this.ast = ast ?? (ls.parseStylesheet(document) as INode);
		this.imports = symbols.imports;
		this.uses = symbols.uses;
		this.forwards = symbols.forwards;
		this.variables = symbols.variables;
		this.mixins = symbols.mixins;
		this.functions = symbols.functions;
		this.fileName = this.getFileName();
	}

	public get uri(): string {
		return this.textDocument.uri;
	}

	public get filePath(): string {
		return URI.parse(this.textDocument.uri).fsPath;
	}

	public async getRealPath(): Promise<string | null> {
		if (this._realPath) {
			return this._realPath;
		}

		try {
			const path = await realPath(this.filePath);
			this._realPath = path;
		} catch {
			// Do nothing
		}

		return this._realPath;
	}

	private getFileName(): string {
		const uri = this.textDocument.uri;
		const lastSlash = uri.lastIndexOf("/");
		return lastSlash === -1 ? uri : uri.slice(Math.max(0, lastSlash + 1));
	}

	public get languageId(): string {
		return this.textDocument.languageId;
	}

	public get version(): number {
		return this.textDocument.version;
	}

	public getText(range?: Range): string {
		return this.textDocument.getText(range);
	}

	public getNodeAt(offset: number): INode | null {
		return getNodeAtOffset(this.ast, offset);
	}

	public getNodeRange(node: INode): Range {
		return Range.create(
			this.textDocument.positionAt(node.offset),
			this.textDocument.positionAt(node.end),
		);
	}

	public positionAt(offset: number): Position {
		return this.textDocument.positionAt(offset);
	}

	public offsetAt(position: Position): number {
		return this.textDocument.offsetAt(position);
	}

	public get lineCount(): number {
		return this.textDocument.lineCount;
	}

	public getLines(): string[] {
		return getLinesFromText(this.textDocument.getText());
	}

	public getSymbols(): ScssSymbol[] {
		const symbols: ScssSymbol[] = [];

		for (const variable of this.variables.values()) {
			symbols.push(variable);
		}

		for (const mixin of this.mixins.values()) {
			symbols.push(mixin);
		}

		for (const func of this.functions.values()) {
			symbols.push(func);
		}

		return symbols;
	}

	public getLinks(options = { forwards: true }): ScssLink[] {
		const links: ScssLink[] = [];

		for (const imp of this.imports.values()) {
			links.push(imp);
		}

		for (const use of this.uses.values()) {
			links.push(use);
		}

		if (options.forwards) {
			for (const forward of this.forwards.values()) {
				links.push(forward);
			}
		}

		return links;
	}
}
