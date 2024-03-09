import {
	URI,
	type TextDocument,
	Stylesheet,
	SyntaxNode,
} from "@somesass/language-server-types";
import { Position, Range } from "vscode-languageserver-types";
import type { FileSystemProvider } from "../file-system";
import { getLinesFromText } from "../utils/string";
import type {
	IScssDocument,
	IScssSymbols,
	ScssForward,
	ScssFunction,
	ScssImport,
	ScssLink,
	ScssMixin,
	ScssPlaceholder,
	ScssPlaceholderUsage,
	ScssSymbol,
	ScssUse,
	ScssVariable,
} from "./scss-symbol";

export class ScssDocument implements IScssDocument {
	public textDocument: TextDocument;
	public ast: Stylesheet;
	public fileName: string;
	public uri: string;

	public imports: Map<string, ScssImport> = new Map();
	public uses: Map<string, ScssUse> = new Map();
	public forwards: Map<string, ScssForward> = new Map();
	public variables: Map<string, ScssVariable> = new Map();
	public mixins: Map<string, ScssMixin> = new Map();
	public functions: Map<string, ScssFunction> = new Map();
	public placeholders: Map<string, ScssPlaceholder> = new Map();
	public placeholderUsages: Map<string, ScssPlaceholderUsage> = new Map();

	private fs: FileSystemProvider;
	private realPath: string | null = null;

	constructor(
		fs: FileSystemProvider,
		document: TextDocument,
		symbols: IScssSymbols,
		ast: Stylesheet,
	) {
		this.ast = ast;
		this.fs = fs;
		this.textDocument = document;
		this.uri = document.uri;
		this.imports = symbols.imports;
		this.uses = symbols.uses;
		this.forwards = symbols.forwards;
		this.variables = symbols.variables;
		this.mixins = symbols.mixins;
		this.functions = symbols.functions;
		this.placeholders = symbols.placeholders;
		this.placeholderUsages = symbols.placeholderUsages;
		this.fileName = this.getFileName();
	}

	public async getRealPath(): Promise<string | null> {
		if (this.realPath) {
			return this.realPath;
		}

		try {
			const path = await this.fs.realPath(URI.parse(this.uri));
			this.realPath = path.fsPath;
		} catch {
			// Do nothing
		}

		return this.realPath;
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

	public getNodeAt(offset: number): SyntaxNode {
		return this.ast.resolve(offset);
	}

	public getNodeRange(node: SyntaxNode): Range {
		return Range.create(
			this.textDocument.positionAt(node.from),
			this.textDocument.positionAt(node.to),
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

		for (const placeholder of this.placeholders.values()) {
			symbols.push(placeholder);
		}

		return symbols;
	}

	public getLinks(opts = {}): ScssLink[] {
		const options = { forwards: true, uses: true, imports: true, ...opts };
		const links: ScssLink[] = [];

		if (options.imports) {
			for (const imp of this.imports.values()) {
				links.push(imp);
			}
		}

		if (options.uses) {
			for (const use of this.uses.values()) {
				links.push(use);
			}
		}

		if (options.forwards) {
			for (const forward of this.forwards.values()) {
				links.push(forward);
			}
		}

		return links;
	}
}
