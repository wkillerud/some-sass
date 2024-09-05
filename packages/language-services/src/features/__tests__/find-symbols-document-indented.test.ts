import { test, assert, beforeEach } from "vitest";
import { getLanguageService } from "../../language-services";
import { SymbolKind, Range, Position } from "../../language-services-types";
import { getOptions } from "../../utils/test-helpers";

const { fileSystemProvider, ...rest } = getOptions();
const ls = getLanguageService({ fileSystemProvider, ...rest });

beforeEach(() => {
	ls.clearCache();
});

test("should return symbols", async () => {
	const document = fileSystemProvider.createDocument(
		`$name: "value"
@mixin mixin($a: 1, $b)
	line-height: $a
	color: $b
@function function($a: 1, $b)
	@return $a * $b
%placeholder
	color: blue`,
		{
			languageId: "sass",
		},
	);

	const symbols = ls.findDocumentSymbols(document);
	const [variable, mixin, func, placeholder] = symbols;

	assert.deepStrictEqual(variable, {
		kind: SymbolKind.Variable,
		name: "$name",
		range: Range.create(Position.create(0, 0), Position.create(0, 14)),
		selectionRange: Range.create(Position.create(0, 0), Position.create(0, 5)),
	});
	assert.deepStrictEqual(mixin, {
		kind: SymbolKind.Method,
		name: "mixin",
		detail: "($a: 1, $b)",
		range: Range.create(Position.create(1, 0), Position.create(4, 0)),
		selectionRange: Range.create(Position.create(1, 7), Position.create(1, 12)),
	});
	assert.deepStrictEqual(func, {
		kind: SymbolKind.Function,
		name: "function",
		detail: "($a: 1, $b)",
		range: Range.create(Position.create(4, 0), Position.create(6, 0)),
		selectionRange: Range.create(
			Position.create(4, 10),
			Position.create(4, 18),
		),
	});
	assert.deepStrictEqual(placeholder, {
		kind: SymbolKind.Class,
		name: "%placeholder",
		range: Range.create(Position.create(6, 0), Position.create(7, 12)),
		selectionRange: Range.create(Position.create(6, 0), Position.create(6, 12)),
	});
});
