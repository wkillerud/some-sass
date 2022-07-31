import assert from "assert";
import { SymbolKind } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { ScssDocument } from "../../server/document";
import { searchWorkspaceSymbol } from "../../server/features/workspace-symbol";
import StorageService from "../../server/storage";

const storage = new StorageService();

storage.set(
	"one.scss",
	new ScssDocument(TextDocument.create("./one.scss", "scss", 1, ""), {
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

describe("Providers/WorkspaceSymbol", () => {
	it("searchWorkspaceSymbol - Empty query", async () => {
		const actual = await searchWorkspaceSymbol("", storage, "");

		assert.strictEqual(actual.length, 3);
	});

	it("searchWorkspaceSymbol - Non-empty query", async () => {
		const actual = await searchWorkspaceSymbol("$", storage, "");

		assert.strictEqual(actual.length, 1);
	});
});
