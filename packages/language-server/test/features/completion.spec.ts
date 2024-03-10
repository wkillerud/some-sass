import { TextDocument } from "@somesass/language-server-types";
import { getLanguageService } from "@somesass/language-services";
import { assert, beforeEach, describe, test } from "vitest";
import {
	CompletionItem,
	CompletionItemKind,
	SymbolKind,
} from "vscode-languageserver";
import type { CompletionList } from "vscode-languageserver";
import { changeConfiguration, useContext } from "../../src/context-provider";
import { doCompletion } from "../../src/features/completion";
import { parseStringLiteralChoices } from "../../src/features/completion/completion-utils";
import { rePartialUse } from "../../src/features/completion/import-completion";
import { sassBuiltInModules } from "../../src/features/sass-built-in-modules";
import { sassDocAnnotations } from "../../src/features/sassdoc-annotations";
import { ScssDocument } from "../../src/parser";
import { ISettings } from "../../src/settings";
import * as helpers from "../helpers";

async function getCompletionList(
	lines: string[],
	options?: Partial<ISettings>,
): Promise<CompletionList> {
	const text = lines.join("\n");

	const settings = helpers.makeSettings(options);
	changeConfiguration(settings);

	const document = await helpers.makeDocument(text);
	const offset = text.indexOf("|");

	return doCompletion(document, offset);
}

describe("Providers/Completion", () => {
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
							"$one",
							{
								name: "$one",
								kind: SymbolKind.Variable,
								value: "1",
								offset: 0,
								position: { line: 1, character: 1 },
							},
						],
						[
							"$two",
							{
								name: "$two",
								kind: SymbolKind.Variable,
								value: null,
								offset: 0,
								position: { line: 1, character: 1 },
							},
						],
						[
							"$hex",
							{
								name: "$hex",
								kind: SymbolKind.Variable,
								value: "#fff",
								offset: 0,
								position: { line: 1, character: 1 },
							},
						],
						[
							"$rgb",
							{
								name: "$rgb",
								kind: SymbolKind.Variable,
								value: "rgb(0,0,0)",
								offset: 0,
								position: { line: 1, character: 1 },
							},
						],
						[
							"$word",
							{
								name: "$word",
								kind: SymbolKind.Variable,
								value: "red",
								offset: 0,
								position: { line: 1, character: 1 },
							},
						],
					]),
					mixins: new Map([
						[
							"test",
							{
								name: "test",
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

	describe("Basic", () => {
		test("Variables", async () => {
			const actual = await getCompletionList(["$|"]);

			assert.strictEqual(actual.items.length, 5);
		});

		test("Mixins", async () => {
			const actual = await getCompletionList(["@include |"]);

			assert.strictEqual(actual.items.length, 1);
		});
	});

	describe("Context", () => {
		test("Empty property value", async () => {
			const actual = await getCompletionList([".a { content: | }"]);

			assert.strictEqual(actual.items.length, 5);
		});

		test("Non-empty property value without suggestions", async () => {
			const actual = await getCompletionList([
				".a { background: url(../images/one|.png); }",
			]);

			assert.strictEqual(actual.items.length, 0);
		});

		test("Non-empty property value with Variables", async () => {
			const actual = await getCompletionList([
				".a { background: url(../images/#{$one|}/one.png); }",
			]);

			assert.strictEqual(actual.items.length, 5);
		});

		test("Discard suggestions inside quotes", async () => {
			const actual = await getCompletionList([
				".a {",
				'    background: url("../images/#{$one}/$one|.png");',
				"}",
			]);

			assert.strictEqual(actual.items.length, 0);
		});

		test("Custom value for `suggestFunctionsInStringContextAfterSymbols` option", async () => {
			const actual = await getCompletionList(
				[".a { background: url(../images/m|"],
				{
					suggestFunctionsInStringContextAfterSymbols: "/",
				},
			);

			assert.strictEqual(actual.items.length, 1);
		});

		test("Discard suggestions inside single-line comments", async () => {
			const actual = await getCompletionList(["// $|"]);

			assert.strictEqual(actual.items.length, 0);
		});

		test("Discard suggestions inside block comments", async () => {
			const actual = await getCompletionList(["/* $| */"]);

			assert.strictEqual(actual.items.length, 0);
		});

		test("Identify color variables", async () => {
			const actual = await getCompletionList(["$|"]);

			assert.strictEqual(actual.items[0]?.kind, CompletionItemKind.Variable);
			assert.strictEqual(actual.items[1]?.kind, CompletionItemKind.Variable);
			assert.strictEqual(actual.items[2]?.kind, CompletionItemKind.Color);
			assert.strictEqual(actual.items[3]?.kind, CompletionItemKind.Color);
			assert.strictEqual(actual.items[4]?.kind, CompletionItemKind.Color);
		});
	});

	describe("Import", () => {
		test("Suggests built-in Sass modules", async () => {
			const expectedCompletionLabels = Object.keys(sassBuiltInModules);

			const actual = await getCompletionList(['@use "|']);

			assert.ok(
				expectedCompletionLabels.every((expectedLabel) => {
					return actual.items.some((item) => item.label === expectedLabel);
				}),
				"Expected to find all Sass built-in modules, but some or all are missing",
			);
		});

		test("rePartialUse matches expected things", () => {
			assert.ok(
				!rePartialUse.test("@use "),
				"should not match unless there's an opening quote",
			);
			assert.ok(
				rePartialUse.test('@use "'),
				"should match an empty opening @use with double quote",
			);
			assert.ok(
				rePartialUse.test("@use '"),
				"should match an empty opening @use with single quote",
			);
			assert.ok(rePartialUse.test("@use '~foo"), "should match with tilde");
			assert.ok(
				rePartialUse.test("@use './foo"),
				"should match with relative import in same directory",
			);
			assert.ok(
				rePartialUse.test("@use '../foo"),
				"should match with relative import in parent",
			);
			assert.ok(
				rePartialUse.test("@use '../../foo"),
				"should match with relative import in grandparent",
			);
			assert.ok(
				rePartialUse.test("@use 'foo"),
				"should match without special character prefix",
			);
			assert.ok(
				rePartialUse.test("@use 'foo'"),
				"should match with closing quote",
			);
			assert.ok(
				rePartialUse.test("@use 'foo';"),
				"should match with closing semicolon",
			);

			const actual = rePartialUse.exec("@use '../../foo");
			assert.ok(actual, "expected match to return a result");
			assert.strictEqual(
				actual?.[1],
				"../../foo",
				"expected match to include the url",
			);
		});
	});

	describe("Built-in", () => {
		test("Suggests items from built-in Sass modules", async () => {
			const actual = await getCompletionList([
				'@use "sass:color" as magic;',
				".a { color: magic.ch|; }",
			]);

			assert.ok(
				actual.items.some((item) => item.label === "change"),
				"Expected to find a change-function in the Sass built-in color module, but it's missing",
			);
		});
	});

	describe("Utils", () => {
		test("parseStringLiteralChoices returns an array of string literals from a docstring", () => {
			let result = parseStringLiteralChoices('"foo"');
			assert.strictEqual(result.join(", "), '"foo"');

			result = parseStringLiteralChoices('"foo" | "bar"');
			assert.strictEqual(result.join(", "), '"foo", "bar"');

			result = parseStringLiteralChoices("String | Number");
			assert.strictEqual(result.join(", "), "");

			result = parseStringLiteralChoices('"String" | "Number"');
			assert.strictEqual(result.join(", "), '"String", "Number"');
		});
	});

	describe("SassDoc", () => {
		test("Offers completions for SassDoc annotations on variable", async () => {
			const expectedCompletions = sassDocAnnotations.map((a) => a.annotation);

			const actual = await getCompletionList(["///|", "$doc-variable: 1px;"]);

			assert.ok(
				expectedCompletions.every((annotation) =>
					actual.items.find(
						(item: CompletionItem) => item.label === annotation,
					),
				),
				"One or more expected SassDoc annotations were not present.",
			);
		});
	});
});
