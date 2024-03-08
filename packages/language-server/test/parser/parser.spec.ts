import { strictEqual, deepStrictEqual, match } from "assert";
import { FileType, URI } from "@somesass/language-server-types";
import { stub, SinonStub } from "sinon";
import { useContext } from "../../src/context-provider";
import { parseDocument, rePlaceholderUsage } from "../../src/parser";
import * as helpers from "../helpers";

describe("Services/Parser", () => {
	describe(".parseDocument", () => {
		let statStub: SinonStub;
		let fileExistsStub: SinonStub;

		beforeEach(() => {
			helpers.createTestContext();
			const { fs } = useContext();
			fileExistsStub = stub(fs, "exists");
			statStub = stub(fs, "stat").yields(null, {
				type: FileType.Unknown,
				ctime: -1,
				mtime: -1,
				size: -1,
			});
		});

		afterEach(() => {
			fileExistsStub.restore();
			statStub.restore();
		});

		it("should return symbols", async () => {
			const document = await helpers.makeDocument([
				'$name: "value";',
				"@mixin mixin($a: 1, $b) {}",
				"@function function($a: 1, $b) {}",
				"%placeholder { color: blue; }",
			]);

			const symbols = await parseDocument(document, URI.parse(""));

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

			const symbols = await parseDocument(document, URI.parse(""));
			const usages = [...symbols.placeholderUsages.values()];
			strictEqual(usages.length, 1);

			strictEqual(usages[0]?.name, "%app");
		});

		it("should return links", async () => {
			fileExistsStub.resolves(true);

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
			strictEqual(uses.length, 2, "expected to find two uses");

			const [variables, corners] = uses;
			strictEqual(variables.namespace, "vars");
			match(
				variables.link.target || "",
				/file:.*\/language-server\/variables\.scss$/,
			);
			strictEqual(variables.isAliased, true);

			strictEqual(corners.namespace, "*");
			match(
				corners.link.target || "",
				/file:.*\/language-server\/corners\.scss$/,
			);
			strictEqual(corners.isAliased, true);

			// Forward
			const forwards = [...symbols.forwards.values()];
			strictEqual(forwards.length, 1, "expected to find one forward");
			match(forwards[0]?.link.target || "", /file:.*\/colors\.scss$/);
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
			fileExistsStub.resolves(true);

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

			strictEqual(uses.length, 3, "expected to find three uses");

			const [upper, middle, lower] = uses;
			match(upper.link.target || "", /file:.*\/language-server\/upper\.scss$/);
			match(
				middle.link.target || "",
				/file:.*\/language-server\/middle\/middle\.scss$/,
			);
			match(
				lower.link.target || "",
				/file:.*\/language-server\/middle\/lower\/lower\.scss$/,
			);
		});

		// TODO: handle this case in the workspace scanner, it's _technically_ a valid link as far as the parser is concerned
		// it("should not crash on link to the same document", async () => {
		// 	const document = await helpers.makeDocument(
		// 		['@use "./self";', "$var: 1px;"],

		// 		{
		// 			uri: "self.scss",
		// 		},
		// 	);
		// 	const symbols = await parseDocument(document, URI.parse(""));
		// 	const uses = [...symbols.uses.values()];
		// 	const variables = [...symbols.variables.values()];

		// 	strictEqual(variables.length, 1, "expected to find one variable");
		// 	strictEqual(uses, [], "expected to find no use link to self");
		// });
	});

	describe("regular expressions", () => {
		it("for placeholder usages", () => {
			strictEqual(
				rePlaceholderUsage.exec("@extend %app;")!.groups!["name"],
				"%app",
				"should match a basic usage with space",
			);

			strictEqual(
				rePlaceholderUsage.exec("@extend	%app-name;")!.groups!["name"],
				"%app-name",
				"should match a basic usage with tab",
			);

			strictEqual(
				rePlaceholderUsage.exec("@extend %spacing-2;")!.groups!["name"],
				"%spacing-2",
				"should match a basic usage with non-breaking space",
			);

			strictEqual(
				rePlaceholderUsage.exec("@extend %placeholder !optional;")!.groups![
					"name"
				],
				"%placeholder",
				"should match optional",
			);

			strictEqual(
				rePlaceholderUsage.exec("			@extend %down_low;")!.groups!["name"],
				"%down_low",
				"should match with indent",
			);

			strictEqual(
				rePlaceholderUsage.exec(".app-asdfqwer1234 { @extend %placeholder;")!
					.groups!["name"],
				"%placeholder",
				"should match on same line as class",
			);
		});
	});
});
