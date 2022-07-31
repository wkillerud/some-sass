import assert from "assert";
import { SymbolKind } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { goDefinition } from "../../server/features/go-definition/go-definition";
import { ScssDocument } from "../../server/parser";
import StorageService from "../../server/storage";
import * as helpers from "../helpers";
import { TestFileSystem } from "../test-file-system";

const storage = new StorageService();
const fs = new TestFileSystem(storage);

storage.set(
	"one.scss",
	new ScssDocument(fs, TextDocument.create("./one.scss", "scss", 1, ""), {
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
	}),
);

describe("Providers/GoDefinition", () => {
	it("doGoDefinition - Variables", async () => {
		const document = await helpers.makeDocument(
			storage,
			".a { content: $a; }",
			fs,
		);

		const actual = goDefinition(document, 15, storage);

		assert.ok(actual);
		assert.strictEqual(actual?.uri, "./one.scss");
		assert.deepStrictEqual(actual?.range, {
			start: { line: 1, character: 1 },
			end: { line: 1, character: 3 },
		});
	});

	it("doGoDefinition - Variable definition", async () => {
		const document = await helpers.makeDocument(storage, "$a: 1;", fs);

		const actual = goDefinition(document, 2, storage);

		assert.strictEqual(actual, null);
	});

	it("doGoDefinition - Mixins", async () => {
		const document = await helpers.makeDocument(
			storage,
			".a { @include mixin(); }",
			fs,
		);

		const actual = goDefinition(document, 16, storage);

		assert.ok(actual);
		assert.strictEqual(actual?.uri, "./one.scss");
		assert.deepStrictEqual(actual?.range, {
			start: { line: 1, character: 1 },
			end: { line: 1, character: 6 },
		});
	});

	it("doGoDefinition - Mixin definition", async () => {
		const document = await helpers.makeDocument(
			storage,
			"@mixin mixin($a) {}",
			fs,
		);

		const actual = goDefinition(document, 8, storage);

		assert.strictEqual(actual, null);
	});

	it("doGoDefinition - Mixin Arguments", async () => {
		const document = await helpers.makeDocument(
			storage,
			"@mixin mixin($a) {}",
			fs,
		);

		const actual = goDefinition(document, 10, storage);

		assert.strictEqual(actual, null);
	});

	it("doGoDefinition - Functions", async () => {
		const document = await helpers.makeDocument(
			storage,
			".a { content: make(1); }",
			fs,
		);

		const actual = goDefinition(document, 16, storage);

		assert.ok(actual);
		assert.strictEqual(actual?.uri, "./one.scss");
		assert.deepStrictEqual(actual?.range, {
			start: { line: 1, character: 1 },
			end: { line: 1, character: 5 },
		});
	});

	it("doGoDefinition - Function definition", async () => {
		const document = await helpers.makeDocument(
			storage,
			"@function make($a) {}",
			fs,
		);

		const actual = goDefinition(document, 8, storage);

		assert.strictEqual(actual, null);
	});

	it("doGoDefinition - Function Arguments", async () => {
		const document = await helpers.makeDocument(
			storage,
			"@function make($a) {}",
			fs,
		);

		const actual = goDefinition(document, 13, storage);

		assert.strictEqual(actual, null);
	});
});
