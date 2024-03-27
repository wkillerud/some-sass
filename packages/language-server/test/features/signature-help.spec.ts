import { strictEqual, ok } from "assert";
import { SignatureHelp } from "@somesass/language-services";
import { hasInFacts } from "../../src/features/signature-help/facts";
import { doSignatureHelp } from "../../src/features/signature-help/signature-help";
import * as helpers from "../helpers";

async function getSignatureHelp(lines: string[]): Promise<SignatureHelp> {
	const text = lines.join("\n");

	const document = await helpers.makeDocument(text);
	const offset = text.indexOf("|");

	return doSignatureHelp(document, offset);
}

describe("Providers/SignatureHelp", () => {
	beforeEach(async () => {
		helpers.createTestContext();

		await helpers.makeDocument(
			[
				"@mixin one() { @content; }",
				"@mixin two($a, $b) { @content; }",
				"@function make() { @return; }",
				"@function one($a, $b, $c) { @return; }",
				"@function two($a, $b) { @return; }",
			],
			{ uri: "one.scss" },
		);
	});
	describe("Empty", () => {
		it("Empty", async () => {
			const actual = await getSignatureHelp(["@include one(|"]);

			strictEqual(actual.signatures.length, 1);
		});
		it("Closed without parameters", async () => {
			const actual = await getSignatureHelp(["@include two(|)"]);

			strictEqual(actual.signatures.length, 1);
		});

		it("Closed with parameters", async () => {
			const actual = await getSignatureHelp(["@include two(1);"]);

			strictEqual(actual.signatures.length, 0);
		});
	});

	describe("Two parameters", () => {
		it("Passed one parameter of two", async () => {
			const actual = await getSignatureHelp(["@include two(1,|"]);

			strictEqual(actual.activeParameter, 1, "activeParameter");
			strictEqual(actual.signatures.length, 1, "signatures.length");
		});

		it("Passed two parameter of two", async () => {
			const actual = await getSignatureHelp(["@include two(1, 2,|"]);

			strictEqual(actual.activeParameter, 2, "activeParameter");
			strictEqual(actual.signatures.length, 1, "signatures.length");
		});

		it("Passed three parameters of two", async () => {
			const actual = await getSignatureHelp(["@include two(1, 2, 3,|"]);

			strictEqual(actual.signatures.length, 0);
		});

		it("Passed two parameter of two with parenthesis", async () => {
			const actual = await getSignatureHelp(["@include two(1, 2)|"]);

			strictEqual(actual.signatures.length, 0);
		});
	});

	describe("parseArgumentsAtLine for Mixins", () => {
		it("RGBA", async () => {
			const actual = await getSignatureHelp([
				"@include two(rgba(0,0,0,.0001),|",
			]);

			strictEqual(actual.activeParameter, 1, "activeParameter");
			strictEqual(actual.signatures.length, 1, "signatures.length");
		});

		it("RGBA when typing", async () => {
			const actual = await getSignatureHelp(["@include two(rgba(0,0,0,|"]);

			strictEqual(actual.activeParameter, 0, "activeParameter");
			strictEqual(actual.signatures.length, 1, "signatures.length");
		});

		it("Quotes", async () => {
			const actual = await getSignatureHelp(['@include two("\\",;",|']);

			strictEqual(actual.activeParameter, 1, "activeParameter");
			strictEqual(actual.signatures.length, 1, "signatures.length");
		});

		it("With overload", async () => {
			const actual = await getSignatureHelp(["@include two(|"]);

			strictEqual(actual.signatures.length, 1);
		});

		it("Single-line selector", async () => {
			const actual = await getSignatureHelp(["h1 { @include two(1,| }"]);

			strictEqual(actual.signatures.length, 1);
		});

		it("Single-line Mixin reference", async () => {
			const actual = await getSignatureHelp([
				"h1 {",
				"    @include two(1, 2);",
				"    @include two(1,|)",
				"}",
			]);

			strictEqual(actual.signatures.length, 1);
		});

		it("Mixin with named argument", async () => {
			const actual = await getSignatureHelp(["@include two($a: 1,|"]);

			strictEqual(actual.signatures.length, 1);
		});
	});

	describe("parseArgumentsAtLine for Functions", () => {
		it("Empty", async () => {
			const actual = await getSignatureHelp(["content: make(|"]);

			strictEqual(actual.signatures.length, 1, "length");
			ok(actual.signatures[0]?.label.startsWith("make"), "name");
		});

		it("Single-line Function reference", async () => {
			const actual = await getSignatureHelp(["content: make()+make(|"]);

			strictEqual(actual.signatures.length, 1, "length");
			ok(actual.signatures[0]?.label.startsWith("make"), "name");
		});

		it("Inside another uncompleted function", async () => {
			const actual = await getSignatureHelp(["content: attr(make(|"]);

			strictEqual(actual.signatures.length, 1, "length");
			ok(actual.signatures[0]?.label.startsWith("make"), "name");
		});

		it("Inside another completed function", async () => {
			const actual = await getSignatureHelp([
				"content: attr(one(1, two(1, two(1, 2)),|",
			]);

			strictEqual(actual.signatures.length, 1, "length");
			ok(actual.signatures[0]?.label.startsWith("one"), "name");
		});

		it("Inside several completed functions", async () => {
			const actual = await getSignatureHelp([
				"background: url(one(1, one(1, 2, two(1, 2)),|",
			]);

			strictEqual(actual.signatures.length, 1, "length");
			ok(actual.signatures[0]?.label.startsWith("one"), "name");
		});

		it("Inside another function with CSS function", async () => {
			const actual = await getSignatureHelp(["background-color: make(rgba(|"]);

			strictEqual(actual.signatures.length, 1, "length");
			ok(actual.signatures[0]?.label.startsWith("make"), "name");
		});

		it("Inside another function with uncompleted CSS function", async () => {
			const actual = await getSignatureHelp([
				"background-color: make(rgba(1, 1,2,|",
			]);

			strictEqual(actual.signatures.length, 1, "length");
			ok(actual.signatures[0]?.label.startsWith("make"), "name");
		});

		it("Inside another function with completed CSS function", async () => {
			const actual = await getSignatureHelp([
				"background-color: make(rgba(1,2, 3,.5)|",
			]);

			strictEqual(actual.signatures.length, 1, "length");
			ok(actual.signatures[0]?.label.startsWith("make"), "name");
		});

		it("Interpolation", async () => {
			const actual = await getSignatureHelp(['background-color: "#{make(|}"']);

			strictEqual(actual.signatures.length, 1, "length");
			ok(actual.signatures[0]?.label.startsWith("make"), "name");
		});
	});

	describe("Utils/Facts", () => {
		it("Contains", () => {
			ok(hasInFacts("rgba"));
			ok(hasInFacts("selector-nest"));
			ok(hasInFacts("quote"));
		});

		it("Not contains", () => {
			ok(!hasInFacts("hello"));
			ok(!hasInFacts("from"));
			ok(!hasInFacts("panda"));
		});
	});
});
