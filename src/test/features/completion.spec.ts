import assert from "assert";
import { CompletionItemKind, SymbolKind } from "vscode-languageserver";
import type { CompletionList } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { ScssDocument } from "../../server/document";
import { doCompletion } from "../../server/features/completion";
import { parseStringLiteralChoices } from "../../server/features/completion/completion-utils";
import { sassBuiltInModules } from "../../server/sass-built-in-modules";
import type { ISettings } from "../../server/settings";
import StorageService from "../../server/storage";
import * as helpers from "../helpers";

const storage = new StorageService();

storage.set(
	"one.scss",
	new ScssDocument(TextDocument.create("./one.scss", "scss", 1, ""), {
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
	}),
);

async function getCompletionList(
	lines: string[],
	options?: Partial<ISettings>,
): Promise<CompletionList> {
	const text = lines.join("\n");

	const settings = helpers.makeSettings(options);
	const document = await helpers.makeDocument(storage, text);
	const offset = text.indexOf("|");

	return doCompletion(document, offset, settings, storage);
}

describe("Providers/Completion - Basic", () => {
	it("Variables", async () => {
		const actual = await getCompletionList(["$|"]);

		assert.strictEqual(actual.items.length, 5);
	});

	it("Mixins", async () => {
		const actual = await getCompletionList(["@include |"]);

		assert.strictEqual(actual.items.length, 1);
	});
});

describe("Providers/Completion - Context", () => {
	it("Empty property value", async () => {
		const actual = await getCompletionList([".a { content: | }"]);

		assert.strictEqual(actual.items.length, 5);
	});

	it("Non-empty property value without suggestions", async () => {
		const actual = await getCompletionList([
			".a { background: url(../images/one|.png); }",
		]);

		assert.strictEqual(actual.items.length, 0);
	});

	it("Non-empty property value with Variables", async () => {
		const actual = await getCompletionList([
			".a { background: url(../images/#{$one|}/one.png); }",
		]);

		assert.strictEqual(actual.items.length, 5);
	});

	it("Discard suggestions inside quotes", async () => {
		const actual = await getCompletionList([
			".a {",
			'    background: url("../images/#{$one}/$one|.png");',
			"}",
		]);

		assert.strictEqual(actual.items.length, 0);
	});

	it("Custom value for `suggestFunctionsInStringContextAfterSymbols` option", async () => {
		const actual = await getCompletionList(
			[".a { background: url(../images/m|"],
			{
				suggestFunctionsInStringContextAfterSymbols: "/",
			},
		);

		assert.strictEqual(actual.items.length, 1);
	});

	it("Discard suggestions inside single-line comments", async () => {
		const actual = await getCompletionList(["// $|"]);

		assert.strictEqual(actual.items.length, 0);
	});

	it("Discard suggestions inside block comments", async () => {
		const actual = await getCompletionList(["/* $| */"]);

		assert.strictEqual(actual.items.length, 0);
	});

	it("Identify color variables", async () => {
		const actual = await getCompletionList(["$|"]);

		assert.strictEqual(actual.items[0]?.kind, CompletionItemKind.Variable);
		assert.strictEqual(actual.items[1]?.kind, CompletionItemKind.Variable);
		assert.strictEqual(actual.items[2]?.kind, CompletionItemKind.Color);
		assert.strictEqual(actual.items[3]?.kind, CompletionItemKind.Color);
		assert.strictEqual(actual.items[4]?.kind, CompletionItemKind.Color);
	});
});

describe("Providers/Completion - Import", () => {
	it("Suggests built-in Sass modules", async () => {
		const expectedCompletionLabels = Object.keys(sassBuiltInModules);

		const actual = await getCompletionList(['@use "|']);

		assert.ok(
			expectedCompletionLabels.every((expectedLabel) => {
				return actual.items.some((item) => item.label === expectedLabel);
			}),
			"Expected to find all Sass built-in modules, but some or all are missing",
		);
	});
});

describe("Providers/Completion - Built-in", () => {
	it("Suggests items from built-in Sass modules", async () => {
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

describe("Providers/Completion - Utils", () => {
	it("parseStringLiteralChoices returns an array of string literals from a docstring", () => {
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
