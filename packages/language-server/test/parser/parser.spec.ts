import { FileStat, FileType, URI } from "@somesass/language-server-types";
import {
	MockInstance,
	assert,
	describe,
	beforeEach,
	afterEach,
	test,
	vi,
} from "vitest";
import { useContext } from "../../src/context-provider";
import { parseDocument, rePlaceholderUsage } from "../../src/parser";
import * as helpers from "../helpers";

describe("Services/Parser", () => {
	describe(".parseDocument", () => {
		let statStub: MockInstance<[uri: URI], Promise<FileStat>>;
		let fileExistsStub: MockInstance<[uri: URI], Promise<boolean>>;

		beforeEach(() => {
			helpers.createTestContext();
			const { fs } = useContext();
			fileExistsStub = vi.spyOn(fs, "exists");
			statStub = vi.spyOn(fs, "stat").mockImplementation(async () => ({
				type: FileType.Unknown,
				ctime: -1,
				mtime: -1,
				size: -1,
			}));
		});

		afterEach(() => {
			fileExistsStub.mockRestore();
			statStub.mockRestore();
		});

		test("should return symbols", async () => {
			const document = await helpers.makeDocument([
				'$name: "value";',
				"@mixin mixin($a: 1, $b) {}",
				"@function function($a: 1, $b) {}",
				"%placeholder { color: blue; }",
			]);

			const symbols = await parseDocument(document, URI.parse(""));

			// Variables
			const variables = [...symbols.variables.values()];
			assert.strictEqual(variables.length, 1);

			assert.strictEqual(variables[0]?.name, "$name");
			assert.strictEqual(variables[0]?.value, '"value"');

			// Mixins
			const mixins = [...symbols.mixins.values()];
			assert.strictEqual(mixins.length, 1);

			assert.strictEqual(mixins[0]?.name, "mixin");
			assert.strictEqual(mixins[0]?.parameters.length, 2);

			assert.strictEqual(mixins[0]?.parameters[0]?.name, "$a");
			assert.strictEqual(mixins[0]?.parameters[0]?.value, "1");

			assert.strictEqual(mixins[0]?.parameters[1]?.name, "$b");
			assert.strictEqual(mixins[0]?.parameters[1]?.value, null);

			// Functions
			const functions = [...symbols.functions.values()];
			assert.strictEqual(functions.length, 1);

			assert.strictEqual(functions[0]?.name, "function");
			assert.strictEqual(functions[0]?.parameters.length, 2);

			assert.strictEqual(functions[0]?.parameters[0]?.name, "$a");
			assert.strictEqual(functions[0]?.parameters[0]?.value, "1");

			assert.strictEqual(functions[0]?.parameters[1]?.name, "$b");
			assert.strictEqual(functions[0]?.parameters[1]?.value, null);

			// Placeholders
			const placeholders = [...symbols.placeholders.values()];
			assert.strictEqual(placeholders.length, 1);

			assert.strictEqual(placeholders[0]?.name, "%placeholder");
		});

		test("should return placeholder usages", async () => {
			const document = await helpers.makeDocument([
				".app-asdfqwer1234 {",
				"	@extend %app !optional;",
				"}",
			]);

			const symbols = await parseDocument(document, URI.parse(""));
			const usages = [...symbols.placeholderUsages.values()];
			assert.strictEqual(usages.length, 1);

			assert.strictEqual(usages[0]?.name, "%app");
		});

		test("should return links", async () => {
			fileExistsStub.mockResolvedValue(true);

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

			const symbols = await parseDocument(document, URI.parse(""));

			// Uses
			const uses = [...symbols.uses.values()];
			assert.strictEqual(uses.length, 2, "expected to find two uses");

			const [variables, corners] = uses;
			assert.strictEqual(variables.namespace, "vars");
			assert.match(
				variables.link.target || "",
				/file:.*\/language-server\/variables\.scss$/,
			);
			assert.strictEqual(variables.isAliased, true);

			assert.strictEqual(corners.namespace, "*");
			assert.match(
				corners.link.target || "",
				/file:.*\/language-server\/corners\.scss$/,
			);
			assert.strictEqual(corners.isAliased, true);

			// Forward
			const forwards = [...symbols.forwards.values()];
			assert.strictEqual(forwards.length, 1, "expected to find one forward");
			assert.match(forwards[0]?.link.target || "", /file:.*\/colors\.scss$/);
			assert.strictEqual(forwards[0]?.prefix, "color-");
			assert.deepStrictEqual(forwards[0]?.hide, [
				"$varslingsfarger",
				"varslingsfarge",
			]);

			// Placeholder
			const placeholders = [...symbols.placeholders.values()];
			assert.strictEqual(
				placeholders.length,
				1,
				"expected to find one placeholder",
			);
			assert.strictEqual(placeholders[0]?.name, "%alert");
		});

		test("should return relative links", async () => {
			fileExistsStub.mockResolvedValue(true);

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

			const symbols = await parseDocument(document, URI.parse(""));
			const uses = [...symbols.uses.values()];

			assert.strictEqual(uses.length, 3, "expected to find three uses");

			const [upper, middle, lower] = uses;
			assert.match(
				upper.link.target || "",
				/file:.*\/language-server\/upper\.scss$/,
			);
			assert.match(
				middle.link.target || "",
				/file:.*\/language-server\/middle\/middle\.scss$/,
			);
			assert.match(
				lower.link.target || "",
				/file:.*\/language-server\/middle\/lower\/lower\.scss$/,
			);
		});

		// TODO: handle this case in the workspace scanner, it's _technically_ a valid link as far as the parser is concerned
		// test("should not crash on link to the same document", async () => {
		// 	const document = await helpers.makeDocument(
		// 		['@use "./self";', "$var: 1px;"],

		// 		{
		// 			uri: "self.scss",
		// 		},
		// 	);
		// 	const symbols = await parseDocument(document, URI.parse(""));
		// 	const uses = [...symbols.uses.values()];
		// 	const variables = [...symbols.variables.values()];

		// 	assert.strictEqual(variables.length, 1, "expected to find one variable");
		// 	assert.strictEqual(uses, [], "expected to find no use link to self");
		// });
	});

	describe("regular expressions", () => {
		test("for placeholder usages", () => {
			assert.strictEqual(
				rePlaceholderUsage.exec("@extend %app;")!.groups!["name"],
				"%app",
				"should match a basic usage with space",
			);

			assert.strictEqual(
				rePlaceholderUsage.exec("@extend	%app-name;")!.groups!["name"],
				"%app-name",
				"should match a basic usage with tab",
			);

			assert.strictEqual(
				rePlaceholderUsage.exec("@extend %spacing-2;")!.groups!["name"],
				"%spacing-2",
				"should match a basic usage with non-breaking space",
			);

			assert.strictEqual(
				rePlaceholderUsage.exec("@extend %placeholder !optional;")!.groups![
					"name"
				],
				"%placeholder",
				"should match optional",
			);

			assert.strictEqual(
				rePlaceholderUsage.exec("			@extend %down_low;")!.groups!["name"],
				"%down_low",
				"should match with indent",
			);

			assert.strictEqual(
				rePlaceholderUsage.exec(".app-asdfqwer1234 { @extend %placeholder;")!
					.groups!["name"],
				"%placeholder",
				"should match on same line as class",
			);
		});
	});
});
