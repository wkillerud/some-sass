import { suite, test } from "vitest";
import { SassParser } from "../../parser/sassParser";
import { ParseError } from "../../parser/cssErrors";
import { assertNode, assertError } from "../css/parser.test";

suite("Sass - Parser", () => {
	test.skip("Comments", function () {
		const parser = new SassParser({ dialect: "indented" });
		assertNode(
			`
a
	b: /* comment */ c
`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`
a
	// single-line comment
	b: c
`,
			parser,
			parser._parseStylesheet.bind(parser),
		);

		assertError(
			`
a
	b: /* multi
line
comment */ c
`,
			parser,
			parser._parseStylesheet.bind(parser),
			ParseError.WildcardExpected, // TODO: make one for comment closing? How's it done in CSS?
		);
	});
});
