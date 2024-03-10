import { SymbolKind, TextDocument } from "@somesass/language-server-types";
import { getLanguageService } from "@somesass/language-services";
import { assert, beforeEach, describe, test } from "vitest";
import { useContext } from "../../src/context-provider";
import { searchWorkspaceSymbol } from "../../src/features/workspace-symbols/workspace-symbol";
import { ScssDocument } from "../../src/parser";
import * as helpers from "../helpers";

describe("workspace/symbol", () => {
	beforeEach(() => {
		helpers.createTestContext();

		const document = TextDocument.create("./one.scss", "scss", 1, "");
		const ls = getLanguageService();
		const ast = ls.parseStylesheet(document);

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
					placeholderUsages: new Map(),
				},
				ast,
			),
		);
	});

	test("searchWorkspaceSymbol - Empty query", async () => {
		const actual = await searchWorkspaceSymbol("", "");
		assert.strictEqual(actual.length, 4);
	});

	test("searchWorkspaceSymbol - query for variable", async () => {
		const actual = await searchWorkspaceSymbol("$", "");
		assert.strictEqual(actual.length, 1);
	});

	test("searchWorkspaceSymbol - query for function", async () => {
		const actual = await searchWorkspaceSymbol("ma", "");
		assert.strictEqual(actual.length, 1);
	});

	test("searchWorkspaceSymbol - query for mixin", async () => {
		const actual = await searchWorkspaceSymbol("mi", "");
		assert.strictEqual(actual.length, 1);
	});

	test("searchWorkspaceSymbol - query for placeholder", async () => {
		const actual = await searchWorkspaceSymbol("%", "");
		assert.strictEqual(actual.length, 1);
	});
});
