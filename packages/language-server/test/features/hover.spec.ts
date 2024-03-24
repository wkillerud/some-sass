import { deepStrictEqual } from "assert";
import {
	MarkupKind,
	Hover,
	SymbolKind,
	TextDocument,
	getLanguageService,
} from "@somesass/language-services";
import { useContext } from "../../src/context-provider";
import { doHover } from "../../src/features/hover/hover";
import { ScssDocument } from "../../src/parser";
import * as helpers from "../helpers";

async function getHover(lines: string[]): Promise<Hover | null> {
	let text = lines.join("\n");
	const offset = text.indexOf("|");
	text = text.replace("|", "");

	const document = await helpers.makeDocument(text);

	return doHover(document, offset);
}

describe("Providers/Hover", () => {
	beforeEach(async () => {
		helpers.createTestContext();

		const document = TextDocument.create("./one.scss", "scss", 1, "");
		const ls = getLanguageService(helpers.createTestLsOptions());
		const ast = await ls.parseStylesheet(document);
		ls.clearCache(); // The service is a singleton with a shared cache that needs clearing between tests

		const { fs, storage } = useContext();

		storage.set(
			"file.scss",
			new ScssDocument(
				fs,
				TextDocument.create("./file.scss", "scss", 1, ""),
				{
					variables: new Map([
						[
							"$variable",
							{
								name: "$variable",
								kind: SymbolKind.Variable,
								value: "2",
								offset: 0,
								position: { line: 1, character: 1 },
							},
						],
					]),
					mixins: new Map([
						[
							"mixin",
							{
								name: "mixin",
								kind: SymbolKind.Method,
								parameters: [],
								offset: 0,
								position: { line: 1, character: 1 },
							},
						],
					]),
					functions: new Map([
						[
							"func",
							{
								name: "func",
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
					placeholders: new Map(),
					placeholderUsages: new Map(),
				},
				ast,
			),
		);
	});

	it("should suggest local symbols", async () => {
		const actual = await getHover(["$one: 1;", ".a { content: $one|; }"]);

		deepStrictEqual(actual?.contents, {
			kind: MarkupKind.Markdown,
			value: [
				"```scss",
				"$one: 1;",
				"```",
				"____",
				"Variable declared in index.scss",
			].join("\n"),
		});
	});

	it("should suggest global variables", async () => {
		const actual = await getHover([".a { content: $variable|; }"]);

		deepStrictEqual(actual?.contents, {
			kind: MarkupKind.Markdown,
			value: [
				"```scss",
				"$variable: 2;",
				"```",
				"____",
				"Variable declared in file.scss",
			].join("\n"),
		});
	});

	it("should suggest global mixins", async () => {
		const actual = await getHover([".a { @include mixin| }"]);

		deepStrictEqual(actual?.contents, {
			kind: MarkupKind.Markdown,
			value: [
				"```scss",
				"@mixin mixin()",
				"```",
				"____",
				"Mixin declared in file.scss",
			].join("\n"),
		});
	});

	it("should suggest global functions", async () => {
		const actual = await getHover([".a {", "	width: func|();", "}"]);

		deepStrictEqual(actual?.contents, {
			kind: MarkupKind.Markdown,
			value: [
				"```scss",
				"@function func()",
				"```",
				"____",
				"Function declared in file.scss",
			].join("\n"),
		});
	});
});
