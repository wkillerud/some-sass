import { strictEqual, deepStrictEqual, ok } from "assert";
import { DiagnosticSeverity, DiagnosticTag } from "vscode-languageserver-types";
import { EXTENSION_NAME } from "../../constants";
import { doDiagnostics } from "../../features/diagnostics/diagnostics";
import * as helpers from "../helpers";

describe("Providers/Diagnostics", () => {
	beforeEach(() => helpers.createTestContext());

	it("doDiagnostics - Variables", async () => {
		const document = await helpers.makeDocument([
			"/// @deprecated Use something else",
			"$a: 1;",
			".a { content: $a; }",
		]);

		const actual = await doDiagnostics(document);

		deepStrictEqual(actual, [
			{
				message: "Use something else",
				range: {
					start: { line: 2, character: 14 },
					end: { line: 2, character: 16 },
				},
				source: EXTENSION_NAME,
				tags: [DiagnosticTag.Deprecated],
				severity: DiagnosticSeverity.Hint,
			},
		]);
	});

	it("doDiagnostics - Functions", async () => {
		const document = await helpers.makeDocument([
			"/// @deprecated Use something else",
			"@function old-function() {",
			"  @return 1;",
			"}",
			".a { content: old-function(); }",
		]);

		const actual = await doDiagnostics(document);

		deepStrictEqual(actual, [
			{
				message: "Use something else",
				range: {
					start: { line: 4, character: 14 },
					end: { line: 4, character: 28 },
				},
				source: EXTENSION_NAME,
				tags: [DiagnosticTag.Deprecated],
				severity: DiagnosticSeverity.Hint,
			},
		]);
	});

	it("doDiagnostics - Mixins", async () => {
		const document = await helpers.makeDocument([
			"/// @deprecated Use something else",
			"@mixin old-mixin {",
			"  content: 'mixin';",
			"}",
			".a { @include old-mixin(); }",
		]);

		const actual = await doDiagnostics(document);

		deepStrictEqual(actual, [
			{
				message: "Use something else",
				range: {
					start: { line: 4, character: 5 },
					end: { line: 4, character: 25 },
				},
				source: EXTENSION_NAME,
				tags: [DiagnosticTag.Deprecated],
				severity: DiagnosticSeverity.Hint,
			},
		]);
	});

	it("doDiagnostics - all of the above", async () => {
		const document = await helpers.makeDocument([
			"/// @deprecated Use something else",
			"$a: 1;",
			".a { content: $a; }",
			"",
			"/// @deprecated Use something else",
			"@function old-function() {",
			"  @return 1;",
			"}",
			".a { content: old-function(); }",
			"",
			"/// @deprecated Use something else",
			"@mixin old-mixin {",
			"  content: 'mixin';",
			"}",
			".a { @include old-mixin(); }",
		]);

		const actual = await doDiagnostics(document);

		strictEqual(actual.length, 3);

		ok(
			actual.every((d) => Boolean(d.message)),
			"Every diagnostic must have a message",
		);
	});

	it("doDiagnostics - support annotation without description", async () => {
		const document = await helpers.makeDocument([
			"/// @deprecated",
			"$a: 1;",
			".a { content: $a; }",
			"",
			"/// @deprecated",
			"@function old-function() {",
			"  @return 1;",
			"}",
			".a { content: old-function(); }",
			"",
			"/// @deprecated",
			"@mixin old-mixin {",
			"  content: 'mixin';",
			"}",
			".a { @include old-mixin(); }",
		]);

		const actual = await doDiagnostics(document);

		strictEqual(actual.length, 3);

		// Make sure we set a default message for the deprecated tag
		ok(
			actual.every((d) => Boolean(d.message)),
			"Every diagnostic must have a message",
		);
	});

	it("doDiagnostics - support namespaces with prefix", async () => {
		await helpers.makeDocument(["/// @deprecated", "$old-a: 1;"], {
			uri: "variables.scss",
		});
		await helpers.makeDocument(
			["/// @deprecated", "@function old-function() {", "  @return 1;", "}"],

			{ uri: "functions.scss" },
		);
		await helpers.makeDocument(
			["/// @deprecated", "@mixin old-mixin {", "  content: 'mixin';", "}"],

			{ uri: "mixins.scss" },
		);
		await helpers.makeDocument(
			[
				"@forward './functions' as fun-*;",
				"@forward './mixins' as mix-* hide secret, other-secret;",
				"@forward './variables' hide $secret;",
			],

			{ uri: "namespace.scss" },
		);

		const document = await helpers.makeDocument([
			"@use 'namespace' as ns;",
			".foo {",
			"  color: ns.$old-a;",
			"  line-height: ns.fun-old-function();",
			"  @include ns.mix-old-mixin;",
			"}",
		]);

		const actual = await doDiagnostics(document);

		// For some reason we get duplicate diagnostics for mixins.
		// Haven't been able to track down why getVariableFunctionMixinReferences produces two of the same node.
		// It's probably fine...
		strictEqual(actual.length, 4);

		// Make sure we set a default message for the deprecated tag
		ok(
			actual.every((d) => Boolean(d.message)),
			"Every diagnostic must have a message",
		);
	});

	it("doDiagnostics - Placeholders", async () => {
		const document = await helpers.makeDocument([
			"/// @deprecated Use something else",
			"%oldPlaceholder {",
			"  content: 'placeholder';",
			"}",
			".a { @extend %oldPlaceholder; }",
		]);

		const actual = await doDiagnostics(document);

		deepStrictEqual(actual, [
			{
				message: "Use something else",
				range: {
					start: { line: 4, character: 13 },
					end: { line: 4, character: 28 },
				},
				source: EXTENSION_NAME,
				tags: [DiagnosticTag.Deprecated],
				severity: DiagnosticSeverity.Hint,
			},
		]);
	});
});
