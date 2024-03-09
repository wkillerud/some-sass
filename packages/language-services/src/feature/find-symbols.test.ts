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
	lang: string = "scss",
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

test("basic document symbols - sass", () => {
	const ls = getLS();
	const symbols = getDocumentSymbols(
		ls,
		`.foo
`,
	);
	expect(symbols).matchSnapshot();
});

test("complex selector", () => {
	const ls = getLS();
	const symbols = getDocumentSymbols(ls, ".foo:not(.selected) {}");
	expect(symbols).matchSnapshot();
});

test("complex selector - sass", () => {
	const ls = getLS();
	const symbols = getDocumentSymbols(
		ls,
		`.foo:not(.selected)
`,
		"sass",
	);
	expect(symbols).matchSnapshot();
});

test("multiple selectors for same block, each range starts with the selector offset", () => {
	const ls = getLS();
	const symbols = getDocumentSymbols(ls, ".voo.doo, .bar {}");
	expect(symbols).matchSnapshot();
});

test("multiple selectors for same block, each range starts with the selector offset - sass", () => {
	const ls = getLS();
	const symbols = getDocumentSymbols(
		ls,
		`.voo.doo, .bar
`,
		"sass",
	);
	expect(symbols).matchSnapshot();
});

test("media query", () => {
	const ls = getLS();
	const symbols = getDocumentSymbols(ls, "@media screen, print {}");
	expect(symbols).matchSnapshot();
});

test("media query - sass", () => {
	const ls = getLS();
	const symbols = getDocumentSymbols(
		ls,
		`@media screen, print
`,
		"sass",
	);
	expect(symbols).matchSnapshot();
});

test("mixin", () => {
	const ls = getLS();
	const symbols = getDocumentSymbols(ls, "@mixin foo { }");
	expect(symbols).matchSnapshot();
});

test("mixin - sass", () => {
	const ls = getLS();
	const symbols = getDocumentSymbols(
		ls,
		`@mixin foo
`,
		"sass",
	);
	expect(symbols).matchSnapshot();
});

test("mixin without a name", () => {
	const ls = getLS();
	const symbols = getDocumentSymbols(ls, "@mixin {}");
	expect(symbols).matchSnapshot();
});

test("mixin without a name - sass", () => {
	const ls = getLS();
	const symbols = getDocumentSymbols(
		ls,
		`@mixin
`,
		"sass",
	);
	expect(symbols).matchSnapshot();
});

test("function declaration", () => {
	const ls = getLS();
	const symbols = getDocumentSymbols(ls, "@function fibonacci($n) { }");
	expect(symbols).matchSnapshot();
});

test("function declaration - sass", () => {
	const ls = getLS();
	const symbols = getDocumentSymbols(
		ls,
		`@function fibonacci($n)
`,
		"sass",
	);
	expect(symbols).matchSnapshot();
});

test("variable", () => {
	const ls = getLS();
	const symbols = getDocumentSymbols(ls, "$color: lime;");
	expect(symbols).matchSnapshot();
});

test("variable - sass", () => {
	const ls = getLS();
	const symbols = getDocumentSymbols(ls, `$color: lime`, "sass");
	expect(symbols).matchSnapshot();
});
