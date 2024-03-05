import { strictEqual, deepStrictEqual, ok, match } from "assert";
import { FileType, URI } from "@somesass/language-server-types";
import { stub, SinonStub } from "sinon";
import { useContext } from "../../src/context-provider";
import {
	parseDocument,
	reForward,
	reModuleAtRule,
	rePlaceholderUsage,
	reUse,
} from "../../src/parser";
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

		it("should not crash on link to the same document", async () => {
			const document = await helpers.makeDocument(
				['@use "./self";', "$var: 1px;"],

				{
					uri: "self.scss",
				},
			);
			const symbols = await parseDocument(document, URI.parse(""));
			const uses = [...symbols.uses.values()];
			const variables = [...symbols.variables.values()];

			strictEqual(variables.length, 1, "expected to find one variable");
			strictEqual(uses.length, 0, "expected to find no use link to self");
		});
	});

	describe("regular expressions", () => {
		it("for detecting module at rules", () => {
			ok(reModuleAtRule.test('@use "file";'), "should match a basic @use");
			ok(
				reModuleAtRule.test('  @use "file";'),
				"should match an indented @use",
			);
			ok(
				reModuleAtRule.test('@use "~file";'),
				"should match @use from node_modules",
			);
			ok(
				reModuleAtRule.test("@use 'file';"),
				"should match @use with single quotes",
			);
			ok(
				reModuleAtRule.test('@use "../file";'),
				"should match relative @use one level up",
			);
			ok(
				reModuleAtRule.test('@use "../../../file";'),
				"should match relative @use several levels up",
			);
			ok(
				reModuleAtRule.test('@use "./file/other";'),
				"should match relative @use one level down",
			);
			ok(
				reModuleAtRule.test('@use "./file/yet/another";'),
				"should match relative @use several levels down",
			);

			ok(
				reModuleAtRule.test('@forward "file";'),
				"should match a basic @forward",
			);
			ok(
				reModuleAtRule.test('  @forward "file";'),
				"should match an indented @forward",
			);
			ok(
				reModuleAtRule.test('@forward "~file";'),
				"should match @forward from node_modules",
			);
			ok(
				reModuleAtRule.test("@forward 'file';"),
				"should match @forward with single quotes",
			);
			ok(
				reModuleAtRule.test('@forward "../file";'),
				"should match relative @forward one level up",
			);
			ok(
				reModuleAtRule.test('@forward "../../../file";'),
				"should match relative @forward several levels up",
			);
			ok(
				reModuleAtRule.test('@forward "./file/other";'),
				"should match relative @forward one level down",
			);
			ok(
				reModuleAtRule.test('@forward "./file/yet/another";'),
				"should match relative @forward several levels down",
			);

			ok(
				reModuleAtRule.test('@import "file";'),
				"should match a basic @import",
			);
			ok(
				reModuleAtRule.test('  @import "file";'),
				"should match an indented @import",
			);
			ok(
				reModuleAtRule.test('@import "~file";'),
				"should match @import from node_modules",
			);
			ok(
				reModuleAtRule.test("@import 'file';"),
				"should match @import with single quotes",
			);
			ok(
				reModuleAtRule.test('@import "../file";'),
				"should match relative @import one level up",
			);
			ok(
				reModuleAtRule.test('@import "../../../file";'),
				"should match relative @import several levels up",
			);
			ok(
				reModuleAtRule.test('@import "./file/other";'),
				"should match relative @import one level down",
			);
			ok(
				reModuleAtRule.test('@import "./file/yet/another";'),
				"should match relative @import several levels down",
			);
		});

		it("for use", () => {
			ok(reUse.test('@use "file";'), "should match a basic @use");
			ok(reUse.test('  @use "file";'), "should match an indented @use");
			ok(reUse.test('@use "~file";'), "should match @use from node_modules");
			ok(reUse.test("@use 'file';"), "should match @use with single quotes");
			ok(
				reUse.test('@use "../file";'),
				"should match relative @use one level up",
			);
			ok(
				reUse.test('@use "../../../file";'),
				"should match relative @use several levels up",
			);
			ok(
				reUse.test('@use "./file/other";'),
				"should match relative @use one level down",
			);
			ok(
				reUse.test('@use "./file/yet/another";'),
				"should match relative @use several levels down",
			);

			ok(
				reUse.test('@use "variables" as vars;'),
				"should match a @use with an alias",
			);
			ok(
				reUse.test('@use "src/corners" as *;'),
				"should match a @use with a wildcard as alias",
			);

			const match = reUse.exec('@use "variables" as vars;');
			strictEqual(match!.groups!["url"] as string, "variables");
			strictEqual(match!.groups!["namespace"] as string, "vars");
		});

		it("for forward", () => {
			ok(reForward.test('@forward "file";'), "should match a basic @forward");
			ok(
				reForward.test('  @forward "file";'),
				"should match an indented @forward",
			);
			ok(
				reForward.test('@forward "~file";'),
				"should match @forward from node_modules",
			);
			ok(
				reForward.test("@forward 'file';"),
				"should match @forward with single quotes",
			);
			ok(
				reForward.test('@forward "../file";'),
				"should match relative @forward one level up",
			);
			ok(
				reForward.test('@forward "../../../file";'),
				"should match relative @forward several levels up",
			);
			ok(
				reForward.test('@forward "./file/other";'),
				"should match relative @forward one level down",
			);
			ok(
				reForward.test('@forward "./file/yet/another";'),
				"should match relative @forward several levels down",
			);

			ok(
				reForward.test(
					'@forward "colors" as color-* hide $varslingsfarger, varslingsfarge;',
				),
				"should match a @forward with an alias and several hide",
			);
			ok(
				reForward.test('@forward "shadow";'),
				"should match a @forward with no alias and no hide",
			);
			ok(
				reForward.test('@forward "spacing" hide $spacing-new;'),
				"should match a @forward with no alias and a hide",
			);

			const match = reForward.exec(
				'@forward "colors" as color-* hide $varslingsfarger, varslingsfarge;',
			);
			strictEqual(match!.groups!["url"] as string, "colors");
			strictEqual(match!.groups!["prefix"] as string, "color-");
			strictEqual(
				match!.groups!["hide"] as string,
				"$varslingsfarger, varslingsfarge",
			);
		});

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
