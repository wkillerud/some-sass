import { strictEqual } from "assert";
import { SymbolKind } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { useContext } from "../../context-provider";
import { searchWorkspaceSymbol } from "../../features/workspace-symbols/workspace-symbol";
import { INode, ScssDocument } from "../../parser";
import { getLanguageService } from "../../parser/language-service";
import * as helpers from "../helpers";

describe("Providers/WorkspaceSymbol", () => {
	beforeEach(() => {
		helpers.createTestContext();

		const document = TextDocument.create("./one.scss", "scss", 1, "");
		const ls = getLanguageService();
		const ast = ls.parseStylesheet(document) as INode;

		const { fs, storage } = useContext();

		storage.set(
			"one.scss",
			new ScssDocument(
				fs,
				document,
				{
					variables: new Map([
						[
							"$a",
							{
								name: "$a",
								kind: SymbolKind.Variable,
								value: "1",
								offset: 0,
								position: { line: 1, character: 1 },
							},
						],
					]),
					mixins: new Map([
						[
							"mixin",
							{
								name: "mixin",
								kind: SymbolKind.Method,
								parameters: [],
								offset: 0,
								position: { line: 1, character: 1 },
							},
						],
					]),
					functions: new Map([
						[
							"make",
							{
								name: "make",
								kind: SymbolKind.Function,
								parameters: [],
								offset: 0,
								position: { line: 1, character: 1 },
							},
						],
					]),
					imports: new Map(),
					uses: new Map(),
					forwards: new Map(),
					placeholders: new Map([
						[
							"%alert",
							{
								name: "%alert",
								kind: SymbolKind.Class,
								parameters: [],
								offset: 0,
								position: { line: 1, character: 1 },
							},
						],
					]),
				},
				ast,
			),
		);
	});

	it("searchWorkspaceSymbol - Empty query", async () => {
		const actual = await searchWorkspaceSymbol("", "");

		strictEqual(actual.length, 4);
	});

	it("searchWorkspaceSymbol - query for variable", async () => {
		const actual = await searchWorkspaceSymbol("$", "");

		strictEqual(actual.length, 1);
	});

	it("searchWorkspaceSymbol - query for function", async () => {
		const actual = await searchWorkspaceSymbol("ma", "");

		strictEqual(actual.length, 1);
	});

	it("searchWorkspaceSymbol - query for mixin", async () => {
		const actual = await searchWorkspaceSymbol("mi", "");

		strictEqual(actual.length, 1);
	});

	it("searchWorkspaceSymbol - query for placeholder", async () => {
		const actual = await searchWorkspaceSymbol("%", "");

		strictEqual(actual.length, 1);
	});
});
