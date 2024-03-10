import { getLanguageService } from "@somesass/language-services";
import { assert, beforeEach, describe, test } from "vitest";
import { SymbolKind } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { useContext } from "../../src/context-provider";
import { goDefinition } from "../../src/features/go-definition/go-definition";
import { ScssDocument } from "../../src/parser";
import * as helpers from "../helpers";

describe("Providers/GoDefinition", () => {
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
				TextDocument.create("./one.scss", "scss", 1, ""),
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
					placeholderUsages: new Map(),
				},
				ast,
			),
		);
	});

	test("doGoDefinition - Variables", async () => {
		const document = await helpers.makeDocument(".a { content: $a; }");

		const actual = goDefinition(document, 15);

		assert.ok(actual);
		assert.strictEqual(actual?.uri, "./one.scss");
		assert.deepStrictEqual(actual?.range, {
			start: { line: 1, character: 1 },
			end: { line: 1, character: 3 },
		});
	});

	test("doGoDefinition - Variable definition", async () => {
		const document = await helpers.makeDocument("$a: 1;");

		const actual = goDefinition(document, 2);

		assert.strictEqual(actual, null);
	});

	test("doGoDefinition - Mixins", async () => {
		const document = await helpers.makeDocument(".a { @include mixin(); }");

		const actual = goDefinition(document, 16);

		assert.ok(actual);
		assert.strictEqual(actual?.uri, "./one.scss");
		assert.deepStrictEqual(actual?.range, {
			start: { line: 1, character: 1 },
			end: { line: 1, character: 6 },
		});
	});

	test("doGoDefinition - Mixin definition", async () => {
		const document = await helpers.makeDocument("@mixin mixin($a) {}");

		const actual = goDefinition(document, 8);

		assert.strictEqual(actual, null);
	});

	test("doGoDefinition - Mixin Arguments", async () => {
		const document = await helpers.makeDocument("@mixin mixin($a) {}");

		const actual = goDefinition(document, 10);

		assert.strictEqual(actual, null);
	});

	test("doGoDefinition - Functions", async () => {
		const document = await helpers.makeDocument(".a { content: make(1); }");

		const actual = goDefinition(document, 16);

		assert.ok(actual);
		assert.strictEqual(actual?.uri, "./one.scss");
		assert.deepStrictEqual(actual?.range, {
			start: { line: 1, character: 1 },
			end: { line: 1, character: 5 },
		});
	});

	test("doGoDefinition - Function definition", async () => {
		const document = await helpers.makeDocument("@function make($a) {}");

		const actual = goDefinition(document, 8);

		assert.strictEqual(actual, null);
	});

	test("doGoDefinition - Function Arguments", async () => {
		const document = await helpers.makeDocument("@function make($a) {}");

		const actual = goDefinition(document, 13);

		assert.strictEqual(actual, null);
	});
});
