import { SymbolKind, TextDocument } from "@somesass/language-server-types";
import { getLanguageService } from "@somesass/language-services";
import { assert, beforeEach, describe, test } from "vitest";
import { SignatureHelp } from "vscode-languageserver";
import { useContext } from "../../src/context-provider";
import { hasInFacts } from "../../src/features/signature-help/facts";
import { doSignatureHelp } from "../../src/features/signature-help/signature-help";
import { ScssDocument } from "../../src/parser";
import * as helpers from "../helpers";

async function getSignatureHelp(lines: string[]): Promise<SignatureHelp> {
	const text = lines.join("\n");

	const document = await helpers.makeDocument(text);
	const offset = text.indexOf("|");

	return doSignatureHelp(document, offset);
}

describe("Providers/SignatureHelp", () => {
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
					variables: new Map(),
					mixins: new Map([
						[
							"one",
							{
								name: "one",
								kind: SymbolKind.Method,
								parameters: [],
								offset: 0,
								position: { line: 1, character: 1 },
							},
						],
						[
							"two",
							{
								name: "two",
								kind: SymbolKind.Method,
								parameters: [
									{ name: "$a", value: null, offset: 0 },
									{ name: "$b", value: null, offset: 0 },
								],
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
						[
							"one",
							{
								name: "one",
								kind: SymbolKind.Function,
								parameters: [
									{ name: "$a", value: null, offset: 0 },
									{ name: "$b", value: null, offset: 0 },
									{ name: "$c", value: null, offset: 0 },
								],
								offset: 0,
								position: { line: 1, character: 1 },
							},
						],
						[
							"two",
							{
								name: "two",
								kind: SymbolKind.Function,
								parameters: [
									{ name: "$a", value: null, offset: 0 },
									{ name: "$b", value: null, offset: 0 },
								],
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
	describe("Empty", () => {
		test("Empty", async () => {
			const actual = await getSignatureHelp(["@include one(|"]);
			assert.strictEqual(actual.signatures.length, 1);
		});
		test("Closed without parameters", async () => {
			const actual = await getSignatureHelp(["@include two(|)"]);
			assert.strictEqual(actual.signatures.length, 1);
		});

		test("Closed with parameters", async () => {
			const actual = await getSignatureHelp(["@include two(1);"]);
			assert.strictEqual(actual.signatures.length, 0);
		});
	});

	describe("Two parameters", () => {
		test("Passed one parameter of two", async () => {
			const actual = await getSignatureHelp(["@include two(1,|"]);
			assert.strictEqual(actual.activeParameter, 1, "activeParameter");
			assert.strictEqual(actual.signatures.length, 1, "signatures.length");
		});

		test("Passed two parameter of two", async () => {
			const actual = await getSignatureHelp(["@include two(1, 2,|"]);
			assert.strictEqual(actual.activeParameter, 2, "activeParameter");
			assert.strictEqual(actual.signatures.length, 1, "signatures.length");
		});

		test("Passed three parameters of two", async () => {
			const actual = await getSignatureHelp(["@include two(1, 2, 3,|"]);
			assert.strictEqual(actual.signatures.length, 0);
		});

		test("Passed two parameter of two with parenthesis", async () => {
			const actual = await getSignatureHelp(["@include two(1, 2)|"]);
			assert.strictEqual(actual.signatures.length, 0);
		});
	});

	describe("parseArgumentsAtLine for Mixins", () => {
		test("RGBA", async () => {
			const actual = await getSignatureHelp([
				"@include two(rgba(0,0,0,.0001),|",
			]);
			assert.strictEqual(actual.activeParameter, 1, "activeParameter");
			assert.strictEqual(actual.signatures.length, 1, "signatures.length");
		});

		test("RGBA when typing", async () => {
			const actual = await getSignatureHelp(["@include two(rgba(0,0,0,|"]);
			assert.strictEqual(actual.activeParameter, 0, "activeParameter");
			assert.strictEqual(actual.signatures.length, 1, "signatures.length");
		});

		test("Quotes", async () => {
			const actual = await getSignatureHelp(['@include two("\\",;",|']);
			assert.strictEqual(actual.activeParameter, 1, "activeParameter");
			assert.strictEqual(actual.signatures.length, 1, "signatures.length");
		});

		test("With overload", async () => {
			const actual = await getSignatureHelp(["@include two(|"]);
			assert.strictEqual(actual.signatures.length, 1);
		});

		test("Single-line selector", async () => {
			const actual = await getSignatureHelp(["h1 { @include two(1,| }"]);
			assert.strictEqual(actual.signatures.length, 1);
		});

		test("Single-line Mixin reference", async () => {
			const actual = await getSignatureHelp([
				"h1 {",
				"    @include two(1, 2);",
				"    @include two(1,|)",
				"}",
			]);
			assert.strictEqual(actual.signatures.length, 1);
		});

		test("Mixin with named argument", async () => {
			const actual = await getSignatureHelp(["@include two($a: 1,|"]);
			assert.strictEqual(actual.signatures.length, 1);
		});
	});

	describe("parseArgumentsAtLine for Functions", () => {
		test("Empty", async () => {
			const actual = await getSignatureHelp(["content: make(|"]);
			assert.strictEqual(actual.signatures.length, 1, "length");
			assert.ok(actual.signatures[0]?.label.startsWith("make"), "name");
		});

		test("Single-line Function reference", async () => {
			const actual = await getSignatureHelp(["content: make()+make(|"]);
			assert.strictEqual(actual.signatures.length, 1, "length");
			assert.ok(actual.signatures[0]?.label.startsWith("make"), "name");
		});

		test("Inside another uncompleted function", async () => {
			const actual = await getSignatureHelp(["content: attr(make(|"]);
			assert.strictEqual(actual.signatures.length, 1, "length");
			assert.ok(actual.signatures[0]?.label.startsWith("make"), "name");
		});

		test("Inside another completed function", async () => {
			const actual = await getSignatureHelp([
				"content: attr(one(1, two(1, two(1, 2)),|",
			]);
			assert.strictEqual(actual.signatures.length, 1, "length");
			assert.ok(actual.signatures[0]?.label.startsWith("one"), "name");
		});

		test("Inside several completed functions", async () => {
			const actual = await getSignatureHelp([
				"background: url(one(1, one(1, 2, two(1, 2)),|",
			]);
			assert.strictEqual(actual.signatures.length, 1, "length");
			assert.ok(actual.signatures[0]?.label.startsWith("one"), "name");
		});

		test("Inside another function with CSS function", async () => {
			const actual = await getSignatureHelp(["background-color: make(rgba(|"]);
			assert.strictEqual(actual.signatures.length, 1, "length");
			assert.ok(actual.signatures[0]?.label.startsWith("make"), "name");
		});

		test("Inside another function with uncompleted CSS function", async () => {
			const actual = await getSignatureHelp([
				"background-color: make(rgba(1, 1,2,|",
			]);
			assert.strictEqual(actual.signatures.length, 1, "length");
			assert.ok(actual.signatures[0]?.label.startsWith("make"), "name");
		});

		test("Inside another function with completed CSS function", async () => {
			const actual = await getSignatureHelp([
				"background-color: make(rgba(1,2, 3,.5)|",
			]);
			assert.strictEqual(actual.signatures.length, 1, "length");
			assert.ok(actual.signatures[0]?.label.startsWith("make"), "name");
		});

		test("Interpolation", async () => {
			const actual = await getSignatureHelp(['background-color: "#{make(|}"']);
			assert.strictEqual(actual.signatures.length, 1, "length");
			assert.ok(actual.signatures[0]?.label.startsWith("make"), "name");
		});
	});

	describe("Utils/Facts", () => {
		test("Contains", () => {
			assert.ok(hasInFacts("rgba"));
			assert.ok(hasInFacts("selector-nest"));
			assert.ok(hasInFacts("quote"));
		});

		test("Not contains", () => {
			assert.ok(!hasInFacts("hello"));
			assert.ok(!hasInFacts("from"));
			assert.ok(!hasInFacts("panda"));
		});
	});
});
