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
					placeholders: new Map(),
				},
				ast,
			),
		);
	});

	it("searchWorkspaceSymbol - Empty query", async () => {
		const actual = await searchWorkspaceSymbol("", "");

		strictEqual(actual.length, 3);
	});

	it("searchWorkspaceSymbol - Non-empty query", async () => {
		const actual = await searchWorkspaceSymbol("$", "");

		strictEqual(actual.length, 1);
	});
});
