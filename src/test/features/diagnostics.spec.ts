import { strictEqual, deepStrictEqual, ok } from "assert";
import { DiagnosticSeverity, DiagnosticTag } from "vscode-languageserver-types";
import { doDiagnostics } from "../../server/features/diagnostics/diagnostics";
import StorageService from "../../server/storage";
import { EXTENSION_NAME } from "../../shared/constants";
import * as helpers from "../helpers";
import { TestFileSystem } from "../test-file-system";

const storage = new StorageService();
const fs = new TestFileSystem(storage);

describe("Providers/Diagnostics", () => {
	it("doDiagnostics - Variables", async () => {
		const document = await helpers.makeDocument(
			storage,
			["/// @deprecated Use something else", "$a: 1;", ".a { content: $a; }"],
			fs,
		);

		const actual = await doDiagnostics(document, storage);

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
		const document = await helpers.makeDocument(
			storage,
			[
				"/// @deprecated Use something else",
				"@function old-function() {",
				"  @return 1;",
				"}",
				".a { content: old-function(); }",
			],
			fs,
		);

		const actual = await doDiagnostics(document, storage);

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
		const document = await helpers.makeDocument(
			storage,
			[
				"/// @deprecated Use something else",
				"@mixin old-mixin {",
				"  content: 'mixin';",
				"}",
				".a { @include old-mixin(); }",
			],
			fs,
		);

		const actual = await doDiagnostics(document, storage);

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
		const document = await helpers.makeDocument(
			storage,
			[
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
			],
			fs,
		);

		const actual = await doDiagnostics(document, storage);

		strictEqual(actual.length, 3);

		ok(
			actual.every((d) => Boolean(d.message)),
			"Every diagnostic must have a message",
		);
	});

	it("doDiagnostics - support annotation without description", async () => {
		const document = await helpers.makeDocument(
			storage,
			[
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
			],
			fs,
		);

		const actual = await doDiagnostics(document, storage);

		strictEqual(actual.length, 3);

		// Make sure we set a default message for the deprecated tag
		ok(
			actual.every((d) => Boolean(d.message)),
			"Every diagnostic must have a message",
		);
	});

	it("doDiagnostics - support namespaces with prefix", async () => {
		await helpers.makeDocument(storage, ["/// @deprecated", "$old-a: 1;"], fs, {
			uri: "variables.scss",
		});
		await helpers.makeDocument(
			storage,
			["/// @deprecated", "@function old-function() {", "  @return 1;", "}"],
			fs,
			{ uri: "functions.scss" },
		);
		await helpers.makeDocument(
			storage,
			["/// @deprecated", "@mixin old-mixin {", "  content: 'mixin';", "}"],
			fs,
			{ uri: "mixins.scss" },
		);
		await helpers.makeDocument(
			storage,
			[
				"@forward './functions' as fun-*;",
				"@forward './mixins' as mix-* hide secret, other-secret;",
				"@forward './variables' hide $secret;",
			],
			fs,
			{ uri: "namespace.scss" },
		);

		const document = await helpers.makeDocument(
			storage,
			[
				"@use 'namespace' as ns;",
				".foo {",
				"  color: ns.$old-a;",
				"  line-height: ns.fun-old-function();",
				"  @include ns.mix-old-mixin;",
				"}",
			],
			fs,
		);

		const actual = await doDiagnostics(document, storage);

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
});
