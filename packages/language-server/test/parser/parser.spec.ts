import { strictEqual, deepStrictEqual } from "assert";
import { parseDocument } from "../../src/parser";
import * as helpers from "../helpers";

describe("Services/Parser", () => {
	describe(".parseDocument", () => {
		beforeEach(() => helpers.createTestContext());

		it("should return symbols", async () => {
			const document = await helpers.makeDocument([
				'$name: "value";',
				"@mixin mixin($a: 1, $b) {}",
				"@function function($a: 1, $b) {}",
				"%placeholder { color: blue; }",
			]);

			const symbols = await parseDocument(document);

			// Variables
			const variables = [...symbols.variables.values()];
			strictEqual(variables.length, 1);

			strictEqual(variables[0]?.name, "$name");
			strictEqual(variables[0]?.value, '"value"');

			// Mixins
			const mixins = [...symbols.mixins.values()];
			strictEqual(mixins.length, 1);

			strictEqual(mixins[0]?.name, "mixin");
			strictEqual(mixins[0]?.parameters.length, 2);

			strictEqual(mixins[0]?.parameters[0]?.name, "$a");
			strictEqual(mixins[0]?.parameters[0]?.value, "1");

			strictEqual(mixins[0]?.parameters[1]?.name, "$b");
			strictEqual(mixins[0]?.parameters[1]?.value, null);

			// Functions
			const functions = [...symbols.functions.values()];
			strictEqual(functions.length, 1);

			strictEqual(functions[0]?.name, "function");
			strictEqual(functions[0]?.parameters.length, 2);

			strictEqual(functions[0]?.parameters[0]?.name, "$a");
			strictEqual(functions[0]?.parameters[0]?.value, "1");

			strictEqual(functions[0]?.parameters[1]?.name, "$b");
			strictEqual(functions[0]?.parameters[1]?.value, null);

			// Placeholders
			const placeholders = [...symbols.placeholders.values()];
			strictEqual(placeholders.length, 1);

			strictEqual(placeholders[0]?.name, "%placeholder");
		});

		it("should return placeholder usages", async () => {
			const document = await helpers.makeDocument([
				".app-asdfqwer1234 {",
				"	@extend %app !optional;",
				"}",
			]);

			const symbols = await parseDocument(document);
			const usages = [...symbols.placeholderUsages.values()];
			strictEqual(usages.length, 1);

			strictEqual(usages[0]?.name, "%app");
		});

		it("should return links", async () => {
			await helpers.makeDocument(["$var: 1px;"], {
				uri: "variables.scss",
			});
			await helpers.makeDocument(["$tr: 2px;"], {
				uri: "corners.scss",
			});
			await helpers.makeDocument(["$b: #000;"], {
				uri: "color.scss",
			});

			const document = await helpers.makeDocument([
				'@use "variables" as vars;',
				'@use "corners" as *;',
				'@forward "colors" as color-* hide $varslingsfarger, varslingsfarge;',
				"%alert { color: blue; }",
			]);

			const symbols = await parseDocument(document);

			// Uses
			const uses = [...symbols.uses.values()];
			strictEqual(uses.length, 2, "expected to find two uses");
			strictEqual(uses[0]?.namespace, "vars");
			strictEqual(uses[0]?.isAliased, true);

			strictEqual(uses[1]?.namespace, "*");
			strictEqual(uses[1]?.isAliased, true);

			// Forward
			const forwards = [...symbols.forwards.values()];
			strictEqual(forwards.length, 1, "expected to find one forward");
			strictEqual(forwards[0]?.prefix, "color-");
			deepStrictEqual(forwards[0]?.hide, [
				"$varslingsfarger",
				"varslingsfarge",
			]);

			// Placeholder
			const placeholders = [...symbols.placeholders.values()];
			strictEqual(placeholders.length, 1, "expected to find one placeholder");
			strictEqual(placeholders[0]?.name, "%alert");
		});

		it("should return relative links", async () => {
			await helpers.makeDocument(["$var: 1px;"], {
				uri: "upper.scss",
			});
			await helpers.makeDocument(["$b: #000;"], {
				uri: "middle/middle.scss",
			});
			await helpers.makeDocument(["$tr: 2px;"], {
				uri: "middle/lower/lower.scss",
			});

			const document = await helpers.makeDocument(
				['@use "../upper";', '@use "./middle";', '@use "./lower/lower";'],

				{ uri: "middle/main.scss" },
			);

			const symbols = await parseDocument(document);
			const uses = [...symbols.uses.values()];

			strictEqual(uses.length, 3, "expected to find three uses");
		});
	});
});
