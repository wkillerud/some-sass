import { suite, test, assert } from "vitest";
import { ParseError } from "../../parser/cssErrors";
import { SassParser } from "../../parser/sassParser";
import * as nodes from "../../parser/cssNodes";
import { assertError, assertNode } from "../css/parser.test";

suite("Sass - Parser", () => {
	const parser = new SassParser({ syntax: "indented" });
	const parseStylesheet = parser._parseStylesheet.bind(parser);
	const parseKeyframeSelector = parser._parseKeyframeSelector.bind(parser);
	const parseKeyframe = parser._parseKeyframe.bind(parser);
	const parseImport = parser._parseImport.bind(parser);
	const parseSupports = parser._parseSupports.bind(parser);

	test("empty stylesheet", () => {
		assertNode("", parser, parseStylesheet);
	});

	test("@charset", () => {
		assertNode('@charset "demo"', parser, parseStylesheet);
		assertError("@charset", parser, parseStylesheet, ParseError.IdentifierExpected);
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

	test("@page", () => {
		assertNode(
			`
@page
	margin: 2.5cm
`,
			parser,
			parseStylesheet,
		);
	});

	test("@font-face", () => {
		assertNode(
			`
@font-face
	font-family: "Example Font"
`,
			parser,
			parseStylesheet,
		);
		assertNode(
			`
@font-face
	src: url(http://test)
`,
			parser,
			parseStylesheet,
		);
		assertNode(
			`
@font-face
	font-style: normal
	font-stretch: normal
`,
			parser,
			parseStylesheet,
		);
		assertNode(
			`
@font-face
	unicode-range: U+0021-007F
`,
			parser,
			parseStylesheet,
		);
	});

	test("@namespace", () => {
		assertNode(`@namespace "http://www.w3.org/1999/xhtml"`, parser, parseStylesheet);
		assertNode(`@namespace pref url(http://test)`, parser, parseStylesheet);
		assertError("@charset", parser, parseStylesheet, ParseError.IdentifierExpected);
	});

	test("@-moz-document", () => {
		assertNode(
			`
@-moz-document url(http://test), url-prefix(http://www.w3.org/Style/)
	body
		color: purple
		background: yellow
`,
			parser,
			parseStylesheet,
		);
	});

	test("attribute selectors", () => {
		assertNode(
			`E E[foo] E[foo="bar"] E[foo~="bar"] E[foo^="bar"] E[foo$="bar"] E[foo*="bar"] E[foo|="en"]
  color: limegreen`,
			parser,
			parseStylesheet,
		);
		assertNode(
			`input[type="submit"]
  color: limegreen`,
			parser,
			parseStylesheet,
		);
	});

	test("pseudo-class selectors", () => {
		assertNode(
			`E:root E:nth-child(n) E:nth-last-child(n) E:nth-of-type(n) E:nth-last-of-type(n) E:first-child E:last-child
  color: limegreen`,
			parser,
			parseStylesheet,
		);
		assertNode(
			`E:first-of-type E:last-of-type E:only-child E:only-of-type E:empty E:link E:visited E:active E:hover E:focus E:target E:lang(fr) E:enabled E:disabled E:checked
  color: limegreen`,
			parser,
			parseStylesheet,
		);
		assertNode(
			`E::first-line E::first-letter E::before E::after
  color: limegreen`,
			parser,
			parseStylesheet,
		);
		assertNode(
			`E.warning E#myid E:not(s)
  color: limegreen`,
			parser,
			parseStylesheet,
		);
	});

	test("graceful handling of unknown rules", () => {
		assertNode(`@unknown-rule`, parser, parseStylesheet);
		assertNode(`@unknown-rule 'foo'`, parser, parseStylesheet);
		assertNode(`@unknown-rule (foo)`, parser, parseStylesheet);
		assertNode(
			`@unknown-rule (foo)
	.bar`,
			parser,
			parseStylesheet,
		);
		assertNode(
			`@mskeyframes darkWordHighlight
	from
		background-color: inherit

	to
		background-color: rgba(83, 83, 83, 0.7)`,
			parser,
			parseStylesheet,
		);
		assertNode(
			`foo
	@unknown-rule`,
			parser,
			parseStylesheet,
		);

		assertError(`@unknown-rule (`, parser, parseStylesheet, ParseError.RightParenthesisExpected);
		assertError(`@unknown-rule [foo`, parser, parseStylesheet, ParseError.RightSquareBracketExpected);
		assertError(
			`@unknown-rule
	[foo`,
			parser,
			parseStylesheet,
			ParseError.RightSquareBracketExpected,
		);
	});

	test("unknown rules node ends properly", () => {
		const node = assertNode(
			`@unknown-rule (foo)
	.bar
		color: limegreen

.foo
	color: red`,
			parser,
			parseStylesheet,
		);

		const unknownAtRule = node.getChild(0)!;
		assert.equal(unknownAtRule.type, nodes.NodeType.UnknownAtRule);
		assert.equal(unknownAtRule.offset, 0);
		assert.equal(node.getChild(0)!.length, 13);

		assertNode(
			`
.foo
	@apply p-4 bg-neutral-50
	min-height: var(--space-14)
`,
			parser,
			parseStylesheet,
		);
	});

	test("stylesheet /panic/", () => {
		assertError('- @import "foo"', parser, parseStylesheet, ParseError.RuleOrSelectorExpected);
	});

	test("@keyframe selector", () => {
		assertNode(
			`from
	color: red`,
			parser,
			parseKeyframeSelector,
		);
		assertNode(
			`to
	color: blue`,
			parser,
			parseKeyframeSelector,
		);
		assertNode(
			`0%
	color: blue`,
			parser,
			parseKeyframeSelector,
		);
		assertNode(
			`10%
	color: purple`,
			parser,
			parseKeyframeSelector,
		);
		assertNode(
			`cover 10%
	color: purple`,
			parser,
			parseKeyframeSelector,
		);
		assertNode(
			`100000%
	color: purple`,
			parser,
			parseKeyframeSelector,
		);
		assertNode(
			`from
	width: 100
	to: 10px`,
			parser,
			parseKeyframeSelector,
		);
		assertNode(
			`from, to
	width: 10px`,
			parser,
			parseKeyframeSelector,
		);
		assertNode(
			`10%, to
	width: 10px`,
			parser,
			parseKeyframeSelector,
		);
		assertNode(
			`from, 20%
	width: 10px`,
			parser,
			parseKeyframeSelector,
		);
		assertNode(
			`10%, 20%
	width: 10px`,
			parser,
			parseKeyframeSelector,
		);
		assertNode(
			`cover 10%, exit 20%
	width: 10px`,
			parser,
			parseKeyframeSelector,
		);
		assertNode(
			`10%, exit 20%
	width: 10px`,
			parser,
			parseKeyframeSelector,
		);
		assertNode(
			`from, exit 20%
	width: 10px`,
			parser,
			parseKeyframeSelector,
		);
		assertNode(
			`cover 10%, to
	width: 10px`,
			parser,
			parseKeyframeSelector,
		);
		assertNode(
			`cover 10%, 20%
	width: 10px`,
			parser,
			parseKeyframeSelector,
		);
	});

	test("@keyframe", () => {
		assertNode(
			`@keyframes name
	//`,
			parser,
			parseKeyframe,
		);
		assertNode(
			`@-webkit-keyframes name
	//`,
			parser,
			parseKeyframe,
		);
		assertNode(
			`@-o-keyframes name
	//`,
			parser,
			parseKeyframe,
		);
		assertNode(
			`@-moz-keyframes name
	//`,
			parser,
			parseKeyframe,
		);
		assertNode(
			`@keyframes name
	from
		//
	to
		//`,
			parser,
			parseKeyframe,
		);
		assertNode(
			`@keyframes name
	from
		//
	80%
		//
	100%
		//`,
			parser,
			parseKeyframe,
		);
		assertNode(
			`@keyframes name
	from
		top: 0px
	80%
		top: 100px
	100%
		top: 50px`,
			parser,
			parseKeyframe,
		);
		assertNode(
			`@keyframes name
	from
		top: 0px
	70%, 80%
		top: 100px
	100%
		top: 50px`,
			parser,
			parseKeyframe,
		);
		assertNode(
			`@keyframes name
	from
		top: 0px
		left: 1px
		right: 2px`,
			parser,
			parseKeyframe,
		);
		assertNode(
			`@keyframes name
	exit 50%
		top: 0px
		left: 1px
		right: 2px`,
			parser,
			parseKeyframe,
		);

		assertError("@keyframes )", parser, parseKeyframe, ParseError.IdentifierExpected);
		assertError(
			`@keyframes name
	from, #123`,
			parser,
			parseKeyframe,
			ParseError.DedentExpected, // Not as accurate as SCSS, but good enough
		);
		assertError(
			`@keyframes name
	10% from
		top: 0px`,
			parser,
			parseKeyframe,
			ParseError.DedentExpected,
		);
		assertError(
			`@keyframes name
	10% 20%
		top: 0px`,
			parser,
			parseKeyframe,
			ParseError.DedentExpected,
		);
		assertError(
			`@keyframes name
	from to
		top: 0px`,
			parser,
			parseKeyframe,
			ParseError.DedentExpected,
		);
	});

	test("@property", () => {
		assertNode(
			`@property --my-color
	syntax: '<color>'
	inherits: false
	initial-value: #c0ffee`,
			parser,
			parseStylesheet,
		);

		assertError(
			`@property
	syntax: '<color>'
	inherits: false
	initial-value: #c0ffee`,
			parser,
			parseStylesheet,
			ParseError.IdentifierExpected,
		);
	});

	test("@container", () => {
		assertNode(
			`@container (width <= 150px)
	#inner
		background-color: skyblue`,
			parser,
			parseStylesheet,
		);
		assertNode(
			`@container card (inline-size > 30em) and style(--responsive: true)
	#inner
		background-color: skyblue`,
			parser,
			parseStylesheet,
		);
		assertNode(
			`
@container card (inline-size > 30em)
	@container style(--responsive: true)
		#inner
			background-color: skyblue`,
			parser,
			parseStylesheet,
		);
		assertNode(
			`
@container (min-width: 700px)
	.card h2
		font-size: max(1.5em, 1.23em + 2cqi)`,
			parser,
			parseStylesheet,
		);
	});

	test("@import", () => {
		assertNode(`@import "asdfasdf"`, parser, parseImport);
		assertNode(`@ImPort "asdfasdf"`, parser, parseImport);
		assertNode(`@import url(/css/screen.css) screen, projection`, parser, parseImport);
		assertNode(`@import url('landscape.css') screen and (orientation:landscape)`, parser, parseImport);
		assertNode(`@import url("/inc/Styles/full.css") (min-width: 940px)`, parser, parseImport);
		assertNode(`@import url(style.css) screen and (min-width:600px)`, parser, parseImport);
		assertNode(`@import url("./700.css") only screen and (max-width: 700px)`, parser, parseImport);
		assertNode(`@import url("override.css") layer`, parser, parseImport);
		assertNode(`@import url("tabs.css") layer(framework.component)`, parser, parseImport);
		assertNode(`@import "mystyle.css" supports(display: flex)`, parser, parseImport);
		assertNode(
			`@import url("narrow.css") supports(display: flex) handheld and (max-width: 400px)`,
			parser,
			parseImport,
		);
		assertNode(`@import url("fallback-layout.css") supports(not (display: flex))`, parser, parseImport);

		assertError(`@import`, parser, parseImport, ParseError.URIOrStringExpected);
	});

	test("@supports", () => {
		assertNode(
			`@supports ( display: flexbox )
	body
		display: flexbox`,
			parser,
			parseSupports,
		);
		assertNode(
			`@supports not (display: flexbox)
	.outline
		box-shadow: 2px 2px 2px black /* unprefixed last */`,
			parser,
			parseSupports,
		);
		assertNode(
			`@supports ( box-shadow: 2px 2px 2px black ) or ( -moz-box-shadow: 2px 2px 2px black ) or ( -webkit-box-shadow: 2px 2px 2px black )
	.foo
		color: red`,
			parser,
			parseSupports,
		);
		assertNode(
			`@supports ((transition-property: color) or (animation-name: foo)) and (transform: rotate(10deg))
	.foo
		color: red`,
			parser,
			parseSupports,
		);
		assertNode(
			`@supports ((display: flexbox))
	.foo
		color: red`,
			parser,
			parseSupports,
		);
		assertNode(
			`@supports (display: flexbox !important)
	.foo
		color: red`,
			parser,
			parseSupports,
		);
		assertNode(
			`@supports (column-width: 1rem) OR (-moz-column-width: 1rem) OR (-webkit-column-width: 1rem) oR (-x-column-width: 1rem)
	.foo
		color: limegreen`,
			parser,
			parseSupports,
		);
		assertNode(
			`@supports not (--validValue: , 0 )
	.foo
		color: limegreen`,
			parser,
			parseSupports,
		);

		assertError(
			`@supports display: flexbox
	.foo
		color: limegreen`,
			parser,
			parseSupports,
			ParseError.LeftParenthesisExpected,
		);
	});
});
