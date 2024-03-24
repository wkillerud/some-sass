import { test, assert } from "vitest";
import { SymbolKind, getLanguageService } from "../language-services";
import { getOptions } from "../utils/test-helpers";

const { fileSystemProvider, ...rest } = getOptions();
const ls = getLanguageService({ fileSystemProvider, ...rest });

test("should return variables", async () => {
	const document = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"@function function($a: 1, $b) {}",
		"%placeholder { color: blue; }",
	]);

	const symbols = await ls.findDocumentSymbols(document);
	assert.strictEqual(symbols.length, 4);
	const [variable, mixin, func, placeholder] = symbols;
	assert.deepStrictEqual(variable, {
		kind: SymbolKind.Variable,
		name: "$name",
		range: {
			end: {
				character: 14,
				line: 0,
			},
			start: {
				character: 0,
				line: 0,
			},
		},
		sassdoc: undefined,
		selectionRange: {
			end: {
				character: 5,
				line: 0,
			},
			start: {
				character: 0,
				line: 0,
			},
		},
	});
	assert.deepStrictEqual(mixin, {
		kind: SymbolKind.Method,
		name: "mixin",
		range: {
			end: {
				character: 26,
				line: 1,
			},
			start: {
				character: 0,
				line: 1,
			},
		},
		sassdoc: undefined,
		selectionRange: {
			end: {
				character: 12,
				line: 1,
			},
			start: {
				character: 7,
				line: 1,
			},
		},
	});
	assert.deepStrictEqual(func, {
		kind: SymbolKind.Function,
		name: "function",
		range: {
			end: {
				character: 32,
				line: 2,
			},
			start: {
				character: 0,
				line: 2,
			},
		},
		sassdoc: undefined,
		selectionRange: {
			end: {
				character: 18,
				line: 2,
			},
			start: {
				character: 10,
				line: 2,
			},
		},
	});
	assert.deepStrictEqual(placeholder, {
		kind: SymbolKind.Class,
		name: "%placeholder",
		range: {
			end: {
				character: 29,
				line: 3,
			},
			start: {
				character: 0,
				line: 3,
			},
		},
		sassdoc: undefined,
		selectionRange: {
			end: {
				character: 12,
				line: 3,
			},
			start: {
				character: 0,
				line: 3,
			},
		},
	});
});
