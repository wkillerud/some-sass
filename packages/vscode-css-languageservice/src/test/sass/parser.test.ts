import { suite, test } from "vitest";
import { ParseError } from "../../parser/cssErrors";
import { SassParseError } from "../../parser/sassErrors";
import { SassParser } from "../../parser/sassParser";
import { assertError, assertNode } from "../css/parser.test";

suite("Sass - Parser", () => {
	const parser = new SassParser({ syntax: "indented" });
	const parseStylesheet = parser._parseStylesheet.bind(parser);

	test("empty stylesheet", () => {
		assertNode("", parser, parseStylesheet);
	});

	test("@charset", () => {
		assertNode('@charset "demo"', parser, parseStylesheet);
		assertError('@charset "demo";', parser, parseStylesheet, ParseError.UnexpectedSemicolon);
	});

	test("newline before at-rule", () => {
		assertNode(
			`
@charset "demo"`,
			parser,
			parseStylesheet,
		);
	});

	test("declarations", () => {
		assertNode(
			`body
	margin: 0px
	padding: 3em, 6em
`,
			parser,
			parseStylesheet,
		);
	});

	test("CSS comment", () => {
		assertNode(
			`a
	b: /* comment */ c
`,
			parser,
			parseStylesheet,
		);
	});

	test("Sass comment", () => {
		assertNode(
			`a
	// single-line comment
	b: c
`,
			parser,
			parseStylesheet,
		);
	});

	test("Multi-line CSS comment should error", () => {
		assertError(
			`a
	b: /* multi
line
comment */ c
`,
			parser,
			parseStylesheet,
			ParseError.PropertyValueExpected,
		);
	});

	test("@media", () => {
		assertNode(
			`@media screen, projection
	a
		b: c`,
			parser,
			parseStylesheet,
		);
		assertNode(
			`@media screen and (max-width: 400px)
	@-ms-viewport
		width: 320px`,
			parser,
			parseStylesheet,
		);
		assertNode(
			`@-ms-viewport
	width: 320px
	height: 720px`,
			parser,
			parseStylesheet,
		);
	});

	test("selectors", () => {
		assertNode(
			`
#boo, far
	a: b

.far boo
	c: d
`,
			parser,
			parseStylesheet,
		);
	});

	test("nested selectors", () => {
		assertNode(
			`
#boo, far
	a: b

	&:hover
		a: c

	d: e
`,
			parser,
			parseStylesheet,
		);
	});

	test("@-moz-keyframes", () => {
		assertNode(
			`
@-moz-keyframes darkWordHighlight
	from
		background-color: inherit
	to
		background-color: rgba(83, 83, 83, 0.7)
`,
			parser,
			parseStylesheet,
		);
	});
});
