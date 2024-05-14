import { suite, test } from "vitest";
import { ParseError } from "../../parser/cssErrors";
import { SassParser } from "../../parser/sassParser";
import { assertError, assertNode } from "../css/parser.test";

suite("Sass - Parser", () => {
	test("CSS comment", () => {
		const parser = new SassParser({ dialect: "indented" });
		assertNode(
			`a
	b: /* comment */ c
`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
	});

	test("Sass comment", () => {
		const parser = new SassParser({ dialect: "indented" });
		assertNode(
			`a
	// single-line comment
	b: c
`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
	});

	test("Multi-line CSS comment should error", () => {
		const parser = new SassParser({ dialect: "indented" });
		assertError(
			`a
	b: /* multi
line
comment */ c
`,
			parser,
			parser._parseStylesheet.bind(parser),
			ParseError.WildcardExpected, // TODO: make one for comment closing? How's it done in CSS if it's missing?
		);
	});
});
