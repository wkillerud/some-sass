import { test, assert, beforeEach } from "vitest";
import {
	SassDocumentSymbol,
	SymbolKind,
	getLanguageService,
} from "../language-services";
import { getOptions } from "../utils/test-helpers";

const { fileSystemProvider, ...rest } = getOptions();
const ls = getLanguageService({ fileSystemProvider, ...rest });

beforeEach(() => {
	ls.clearCache();
});

test("should return variables", async () => {
	const document = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"@function function($a: 1, $b) {}",
		"%placeholder { color: blue; }",
	]);

	const symbols = ls.findDocumentSymbols(document);
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
		children: [
			{
				kind: 13,
				name: "$a",
				range: {
					end: {
						character: 18,
						line: 1,
					},
					start: {
						character: 13,
						line: 1,
					},
				},
				selectionRange: {
					end: {
						character: 15,
						line: 1,
					},
					start: {
						character: 13,
						line: 1,
					},
				},
			},
			{
				kind: 13,
				name: "$b",
				range: {
					end: {
						character: 22,
						line: 1,
					},
					start: {
						character: 20,
						line: 1,
					},
				},
				selectionRange: {
					end: {
						character: 22,
						line: 1,
					},
					start: {
						character: 20,
						line: 1,
					},
				},
			},
		],
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
		children: [
			{
				kind: 13,
				name: "$a",
				range: {
					end: {
						character: 24,
						line: 2,
					},
					start: {
						character: 19,
						line: 2,
					},
				},
				selectionRange: {
					end: {
						character: 21,
						line: 2,
					},
					start: {
						character: 19,
						line: 2,
					},
				},
			},
			{
				kind: 13,
				name: "$b",
				range: {
					end: {
						character: 28,
						line: 2,
					},
					start: {
						character: 26,
						line: 2,
					},
				},
				selectionRange: {
					end: {
						character: 28,
						line: 2,
					},
					start: {
						character: 26,
						line: 2,
					},
				},
			},
		],
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

test("includes placeholder usages in a way that is distinguishable from declarations", () => {
	const document = fileSystemProvider.createDocument([
		"%placeholder { color: blue; }",
		".button { @extend %placeholder; }",
	]);

	const symbols = ls.findDocumentSymbols(document);
	const [declaration, buttonWithPlaceholderUsage] = symbols;

	assert.deepStrictEqual(declaration, {
		kind: SymbolKind.Class,
		name: "%placeholder",
		range: {
			end: {
				character: 29,
				line: 0,
			},
			start: {
				character: 0,
				line: 0,
			},
		},
		selectionRange: {
			end: {
				character: 12,
				line: 0,
			},
			start: {
				character: 0,
				line: 0,
			},
		},
	});

	assert.deepStrictEqual(buttonWithPlaceholderUsage, {
		children: [
			{
				kind: 5,
				name: "%placeholder",
				range: {
					end: {
						character: 30,
						line: 1,
					},
					start: {
						character: 18,
						line: 1,
					},
				},
				selectionRange: {
					end: {
						character: 30,
						line: 1,
					},
					start: {
						character: 18,
						line: 1,
					},
				},
			},
		],
		kind: 5,
		name: ".button",
		range: {
			end: {
				character: 33,
				line: 1,
			},
			start: {
				character: 0,
				line: 1,
			},
		},
		selectionRange: {
			end: {
				character: 7,
				line: 1,
			},
			start: {
				character: 0,
				line: 1,
			},
		},
	});
});

test("includes sassdoc for function parameters", () => {
	const document = fileSystemProvider.createDocument([
		"/// @param {Number} $value - Value to return",
		"/// @return {Number} - $value",
		"@function to-length($value) {",
		"	@return $value;",
		"}",
	]);

	const [func] = ls.findDocumentSymbols(document);
	assert.ok(func);
	assert.ok(func.children);
	const variable: SassDocumentSymbol = func.children![0];
	assert.ok(variable.sassdoc);
});
