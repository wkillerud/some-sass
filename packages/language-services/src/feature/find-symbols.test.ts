import {
	LanguageService,
	SassDocumentSymbol,
	TextDocument,
} from "@somesass/language-server-types";
import { expect, test } from "vitest";
import { getLanguageService } from "../language-services";

const getLS = () => getLanguageService();

export function getDocumentSymbols(
	ls: LanguageService,
	input: string,
	lang: string = "css",
): SassDocumentSymbol[] {
	const document = TextDocument.create(
		`test://test/test.${lang}`,
		lang,
		0,
		input,
	);

	const stylesheet = ls.parseStylesheet(document);
	return ls.findDocumentSymbols(document, stylesheet);
}

test("basic document symbols", () => {
	const ls = getLS();
	const symbols = getDocumentSymbols(ls, ".foo {}");
	expect(symbols).matchSnapshot();
});

test.only("complex selector", () => {
	const ls = getLS();
	const symbols = getDocumentSymbols(ls, ".foo:not(.selected) {}");
	expect(symbols).matchSnapshot();
});

test("multiple selectors for same block, each range starts with the selector offset", () => {
	const ls = getLS();
	const symbols = getDocumentSymbols(ls, ".voo.doo, .bar {}");
	expect(symbols).matchSnapshot();
});

test("media query", () => {
	const ls = getLS();
	const symbols = getDocumentSymbols(ls, "@media screen, print {}");
	expect(symbols).matchSnapshot();
});

test("mixin", () => {
	const ls = getLS();
	const symbols = getDocumentSymbols(ls, "@mixin foo { }");
	expect(symbols).matchSnapshot();
});

test("mixin without a name", () => {
	const ls = getLS();
	const symbols = getDocumentSymbols(ls, "@mixin {}");
	expect(symbols).matchSnapshot();
});
