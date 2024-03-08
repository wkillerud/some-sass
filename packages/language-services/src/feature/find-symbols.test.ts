import * as assert from "node:assert";
import {
	LanguageService,
	SassDocumentSymbol,
	SymbolKind,
	SyntaxNodeType,
	TextDocument,
} from "@somesass/language-server-types";
import { getLanguageService } from "../language-services";
import { newRange } from "../test/test-resources";

const getLS = () => getLanguageService();

export function assertDocumentSymbols(
	ls: LanguageService,
	input: string,
	expected: SassDocumentSymbol[],
	lang: string = "css",
) {
	const document = TextDocument.create(
		`test://test/test.${lang}`,
		lang,
		0,
		input,
	);

	const stylesheet = ls.parseStylesheet(document);

	const symbols = ls.findDocumentSymbols(document, stylesheet);
	assert.deepEqual(symbols, expected);
}

test("basic document symbols", () => {
	const ls = getLS();
	assertDocumentSymbols(ls, ".foo {}", [
		{
			name: ".foo",
			type: SyntaxNodeType.ClassName,
			kind: SymbolKind.Class,
			range: newRange(0, 7),
			selectionRange: newRange(0, 4),
		},
	]);
	assertDocumentSymbols(ls, ".foo:not(.selected) {}", [
		{
			name: ".foo:not(.selected)",
			type: SyntaxNodeType.ClassName,
			kind: SymbolKind.Class,
			range: newRange(0, 22),
			selectionRange: newRange(0, 19),
		},
	]);

	// multiple selectors, each range starts with the selector offset
	assertDocumentSymbols(ls, ".voo.doo, .bar {}", [
		{
			name: ".voo.doo",
			kind: SymbolKind.Class,
			type: SyntaxNodeType.ClassName,
			range: newRange(0, 17),
			selectionRange: newRange(0, 8),
		},
		{
			name: ".bar",
			kind: SymbolKind.Class,
			type: SyntaxNodeType.ClassName,
			range: newRange(10, 17),
			selectionRange: newRange(10, 14),
		},
	]);

	// Media Query
	assertDocumentSymbols(ls, "@media screen, print {}", [
		{
			name: "@media screen, print",
			kind: SymbolKind.Module,
			type: SyntaxNodeType.MediaStatement,
			range: newRange(0, 23),
			selectionRange: newRange(7, 20),
		},
	]);
	assertDocumentSymbols(ls, "@media screen, print {}", [
		{
			name: "@media screen, print",
			type: SyntaxNodeType.MediaStatement,
			kind: SymbolKind.Module,
			range: newRange(0, 23),
			selectionRange: newRange(7, 20),
		},
	]);
});

test("mixins", () => {
	const ls = getLS();
	assertDocumentSymbols(ls, "@mixin foo { }", [
		{
			name: "foo",
			type: SyntaxNodeType.MixinStatement,
			kind: SymbolKind.Method,
			range: newRange(0, 14),
			selectionRange: newRange(7, 10),
		},
	]);
	assertDocumentSymbols(ls, "@mixin {}", [
		{
			name: "<undefined>",
			type: SyntaxNodeType.MixinStatement,
			kind: SymbolKind.Method,
			range: newRange(0, 9),
			selectionRange: newRange(0, 0),
		},
	]);
});
