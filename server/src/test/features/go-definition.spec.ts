import { strictEqual, deepStrictEqual, ok } from "assert";
import { SymbolKind } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { useContext } from "../../context-provider";
import { goDefinition } from "../../features/go-definition/go-definition";
import { INode, ScssDocument } from "../../parser";
import { getLanguageService } from "../../parser/language-service";
import * as helpers from "../helpers";

describe("Providers/GoDefinition", () => {
	beforeEach(() => {
		helpers.createTestContext();

		const document = TextDocument.create("./one.scss", "scss", 1, "");
		const ls = getLanguageService();
		const ast = ls.parseStylesheet(document) as INode;

		const { fs, storage } = useContext();

		storage.set(
			"one.scss",
			new ScssDocument(
				fs,
				TextDocument.create("./one.scss", "scss", 1, ""),
				{
					variables: new Map([
						[
							"$a",
							{
								name: "$a",
								kind: SymbolKind.Variable,
								value: "1",
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
					placeholders: new Map(),
					placeholderUsages: new Map(),
				},
				ast,
			),
		);
	});

	it("doGoDefinition - Variables", async () => {
		const document = await helpers.makeDocument(".a { content: $a; }");

		const actual = goDefinition(document, 15);

		ok(actual);
		strictEqual(actual?.uri, "./one.scss");
		deepStrictEqual(actual?.range, {
			start: { line: 1, character: 1 },
			end: { line: 1, character: 3 },
		});
	});

	it("doGoDefinition - Variable definition", async () => {
		const document = await helpers.makeDocument("$a: 1;");

		const actual = goDefinition(document, 2);

		strictEqual(actual, null);
	});

	it("doGoDefinition - Mixins", async () => {
		const document = await helpers.makeDocument(".a { @include mixin(); }");

		const actual = goDefinition(document, 16);

		ok(actual);
		strictEqual(actual?.uri, "./one.scss");
		deepStrictEqual(actual?.range, {
			start: { line: 1, character: 1 },
			end: { line: 1, character: 6 },
		});
	});

	it("doGoDefinition - Mixin definition", async () => {
		const document = await helpers.makeDocument("@mixin mixin($a) {}");

		const actual = goDefinition(document, 8);

		strictEqual(actual, null);
	});

	it("doGoDefinition - Mixin Arguments", async () => {
		const document = await helpers.makeDocument("@mixin mixin($a) {}");

		const actual = goDefinition(document, 10);

		strictEqual(actual, null);
	});

	it("doGoDefinition - Functions", async () => {
		const document = await helpers.makeDocument(".a { content: make(1); }");

		const actual = goDefinition(document, 16);

		ok(actual);
		strictEqual(actual?.uri, "./one.scss");
		deepStrictEqual(actual?.range, {
			start: { line: 1, character: 1 },
			end: { line: 1, character: 5 },
		});
	});

	it("doGoDefinition - Function definition", async () => {
		const document = await helpers.makeDocument("@function make($a) {}");

		const actual = goDefinition(document, 8);

		strictEqual(actual, null);
	});

	it("doGoDefinition - Function Arguments", async () => {
		const document = await helpers.makeDocument("@function make($a) {}");

		const actual = goDefinition(document, 13);

		strictEqual(actual, null);
	});
});
