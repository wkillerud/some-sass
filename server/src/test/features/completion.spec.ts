import { strictEqual, ok } from "assert";
import {
	CompletionItem,
	CompletionItemKind,
	SymbolKind,
} from "vscode-languageserver";
import type { CompletionList } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { changeConfiguration, useContext } from "../../context-provider";
import { doCompletion } from "../../features/completion";
import { parseStringLiteralChoices } from "../../features/completion/completion-utils";
import { rePartialUse } from "../../features/completion/import-completion";
import { sassBuiltInModules } from "../../features/sass-built-in-modules";
import { sassDocAnnotations } from "../../features/sassdoc-annotations";
import { INode, ScssDocument } from "../../parser";
import { getLanguageService } from "../../parser/language-service";
import { ISettings } from "../../settings";
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
				},
				ast,
			),
		);
	});

	describe("Basic", () => {
		it("Variables", async () => {
			const actual = await getCompletionList(["$|"]);

			strictEqual(actual.items.length, 5);
		});

		it("Mixins", async () => {
			const actual = await getCompletionList(["@include |"]);

			strictEqual(actual.items.length, 1);
		});
	});

	describe("Context", () => {
		it("Empty property value", async () => {
			const actual = await getCompletionList([".a { content: | }"]);

			strictEqual(actual.items.length, 5);
		});

		it("Non-empty property value without suggestions", async () => {
			const actual = await getCompletionList([
				".a { background: url(../images/one|.png); }",
			]);

			strictEqual(actual.items.length, 0);
		});

		it("Non-empty property value with Variables", async () => {
			const actual = await getCompletionList([
				".a { background: url(../images/#{$one|}/one.png); }",
			]);

			strictEqual(actual.items.length, 5);
		});

		it("Discard suggestions inside quotes", async () => {
			const actual = await getCompletionList([
				".a {",
				'    background: url("../images/#{$one}/$one|.png");',
				"}",
			]);

			strictEqual(actual.items.length, 0);
		});

		it("Custom value for `suggestFunctionsInStringContextAfterSymbols` option", async () => {
			const actual = await getCompletionList(
				[".a { background: url(../images/m|"],
				{
					suggestFunctionsInStringContextAfterSymbols: "/",
				},
			);

			strictEqual(actual.items.length, 1);
		});

		it("Discard suggestions inside single-line comments", async () => {
			const actual = await getCompletionList(["// $|"]);

			strictEqual(actual.items.length, 0);
		});

		it("Discard suggestions inside block comments", async () => {
			const actual = await getCompletionList(["/* $| */"]);

			strictEqual(actual.items.length, 0);
		});

		it("Identify color variables", async () => {
			const actual = await getCompletionList(["$|"]);

			strictEqual(actual.items[0]?.kind, CompletionItemKind.Variable);
			strictEqual(actual.items[1]?.kind, CompletionItemKind.Variable);
			strictEqual(actual.items[2]?.kind, CompletionItemKind.Color);
			strictEqual(actual.items[3]?.kind, CompletionItemKind.Color);
			strictEqual(actual.items[4]?.kind, CompletionItemKind.Color);
		});
	});

	describe("Import", () => {
		it("Suggests built-in Sass modules", async () => {
			const expectedCompletionLabels = Object.keys(sassBuiltInModules);

			const actual = await getCompletionList(['@use "|']);

			ok(
				expectedCompletionLabels.every((expectedLabel) => {
					return actual.items.some((item) => item.label === expectedLabel);
				}),
				"Expected to find all Sass built-in modules, but some or all are missing",
			);
		});

		it("rePartialUse matches expected things", () => {
			ok(
				!rePartialUse.test("@use "),
				"should not match unless there's an opening quote",
			);
			ok(
				rePartialUse.test('@use "'),
				"should match an empty opening @use with double quote",
			);
			ok(
				rePartialUse.test("@use '"),
				"should match an empty opening @use with single quote",
			);
			ok(rePartialUse.test("@use '~foo"), "should match with tilde");
			ok(
				rePartialUse.test("@use './foo"),
				"should match with relative import in same directory",
			);
			ok(
				rePartialUse.test("@use '../foo"),
				"should match with relative import in parent",
			);
			ok(
				rePartialUse.test("@use '../../foo"),
				"should match with relative import in grandparent",
			);
			ok(
				rePartialUse.test("@use 'foo"),
				"should match without special character prefix",
			);
			ok(rePartialUse.test("@use 'foo'"), "should match with closing quote");
			ok(
				rePartialUse.test("@use 'foo';"),
				"should match with closing semicolon",
			);

			const actual = rePartialUse.exec("@use '../../foo");
			ok(actual, "expected match to return a result");
			strictEqual(
				actual?.[1],
				"../../foo",
				"expected match to include the url",
			);
		});
	});

	describe("Built-in", () => {
		it("Suggests items from built-in Sass modules", async () => {
			const actual = await getCompletionList([
				'@use "sass:color" as magic;',
				".a { color: magic.ch|; }",
			]);

			ok(
				actual.items.some((item) => item.label === "change"),
				"Expected to find a change-function in the Sass built-in color module, but it's missing",
			);
		});
	});

	describe("Utils", () => {
		it("parseStringLiteralChoices returns an array of string literals from a docstring", () => {
			let result = parseStringLiteralChoices('"foo"');
			strictEqual(result.join(", "), '"foo"');

			result = parseStringLiteralChoices('"foo" | "bar"');
			strictEqual(result.join(", "), '"foo", "bar"');

			result = parseStringLiteralChoices("String | Number");
			strictEqual(result.join(", "), "");

			result = parseStringLiteralChoices('"String" | "Number"');
			strictEqual(result.join(", "), '"String", "Number"');
		});
	});

	describe("SassDoc", () => {
		it("Offers completions for SassDoc annotations on variable", async () => {
			const expectedCompletions = sassDocAnnotations.map((a) => a.annotation);

			const actual = await getCompletionList(["///|", "$doc-variable: 1px;"]);

			ok(
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
