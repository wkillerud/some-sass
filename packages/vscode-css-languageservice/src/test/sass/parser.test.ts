import { suite, test, assert } from "vitest";
import { ParseError } from "../../parser/cssErrors";
import { SassParser } from "../../parser/sassParser";
import * as nodes from "../../parser/cssNodes";
import { assertError, assertNode } from "../css/parser.test";

suite("Sass - Parser", () => {
	const parser = new SassParser({ syntax: "indented" });

	test("empty stylesheet", () => {
		assertNode("", parser, parser._parseStylesheet.bind(parser));
	});

	test("@charset", () => {
		assertNode('@charset "demo"', parser, parser._parseStylesheet.bind(parser));
		assertError("@charset", parser, parser._parseStylesheet.bind(parser), ParseError.IdentifierExpected);
		assertError('@charset "demo";', parser, parser._parseStylesheet.bind(parser), ParseError.UnexpectedSemicolon);
	});

	test("newline before at-rule", () => {
		assertNode(
			`
@charset "demo"`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
	});

	test("declarations", () => {
		assertNode(
			`body
	margin: 0px
	padding: 3em, 6em
`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
	});

	test("CSS comment", () => {
		assertNode(
			`a
	b: /* comment */ c
`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
	});

	test("Sass comment", () => {
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
		assertError(
			`a
	b: /* multi
line
comment */ c
`,
			parser,
			parser._parseStylesheet.bind(parser),
			ParseError.PropertyValueExpected,
		);
	});

	test("@media", () => {
		assertNode(
			`@media screen, projection
	a
		b: c`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@media screen and (max-width: 400px)
	@-ms-viewport
		width: 320px`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@-ms-viewport
	width: 320px
	height: 720px`,
			parser,
			parser._parseStylesheet.bind(parser),
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
			parser._parseStylesheet.bind(parser),
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
			parser._parseStylesheet.bind(parser),
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
			parser._parseStylesheet.bind(parser),
		);
	});

	test("@page", () => {
		assertNode(
			`
@page
	margin: 2.5cm
`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
	});

	test("@font-face", () => {
		assertNode(
			`
@font-face
	font-family: "Example Font"
`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`
@font-face
	src: url(http://test)
`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`
@font-face
	font-style: normal
	font-stretch: normal
`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`
@font-face
	unicode-range: U+0021-007F
`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
	});

	test("@namespace", () => {
		assertNode(`@namespace "http://www.w3.org/1999/xhtml"`, parser, parser._parseStylesheet.bind(parser));
		assertNode(`@namespace pref url(http://test)`, parser, parser._parseStylesheet.bind(parser));
		assertError("@charset", parser, parser._parseStylesheet.bind(parser), ParseError.IdentifierExpected);
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
			parser._parseStylesheet.bind(parser),
		);
	});

	test("attribute selectors", () => {
		assertNode(
			`E E[foo] E[foo="bar"] E[foo~="bar"] E[foo^="bar"] E[foo$="bar"] E[foo*="bar"] E[foo|="en"]
  color: limegreen`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`input[type="submit"]
  color: limegreen`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
	});

	test("pseudo-class selectors", () => {
		assertNode(
			`E:root E:nth-child(n) E:nth-last-child(n) E:nth-of-type(n) E:nth-last-of-type(n) E:first-child E:last-child
  color: limegreen`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`E:first-of-type E:last-of-type E:only-child E:only-of-type E:empty E:link E:visited E:active E:hover E:focus E:target E:lang(fr) E:enabled E:disabled E:checked
  color: limegreen`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`E::first-line E::first-letter E::before E::after
  color: limegreen`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`E.warning E#myid E:not(s)
  color: limegreen`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
	});

	test("graceful handling of unknown rules", () => {
		assertNode(`@unknown-rule`, parser, parser._parseStylesheet.bind(parser));
		assertNode(`@unknown-rule 'foo'`, parser, parser._parseStylesheet.bind(parser));
		assertNode(`@unknown-rule (foo)`, parser, parser._parseStylesheet.bind(parser));
		assertNode(
			`@unknown-rule (foo)
	.bar`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@mskeyframes darkWordHighlight
	from
		background-color: inherit

	to
		background-color: rgba(83, 83, 83, 0.7)`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`foo
	@unknown-rule`,
			parser,
			parser._parseStylesheet.bind(parser),
		);

		assertError(`@unknown-rule (`, parser, parser._parseStylesheet.bind(parser), ParseError.RightParenthesisExpected);
		assertError(
			`@unknown-rule [foo`,
			parser,
			parser._parseStylesheet.bind(parser),
			ParseError.RightSquareBracketExpected,
		);
		assertError(
			`@unknown-rule
	[foo`,
			parser,
			parser._parseStylesheet.bind(parser),
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
			parser._parseStylesheet.bind(parser),
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
			parser._parseStylesheet.bind(parser),
		);
	});

	test("stylesheet /panic/", () => {
		assertError('- @import "foo"', parser, parser._parseStylesheet.bind(parser), ParseError.RuleOrSelectorExpected);
	});

	test("@keyframe selector", () => {
		assertNode(
			`from
	color: red`,
			parser,
			parser._parseKeyframeSelector.bind(parser),
		);
		assertNode(
			`to
	color: blue`,
			parser,
			parser._parseKeyframeSelector.bind(parser),
		);
		assertNode(
			`0%
	color: blue`,
			parser,
			parser._parseKeyframeSelector.bind(parser),
		);
		assertNode(
			`10%
	color: purple`,
			parser,
			parser._parseKeyframeSelector.bind(parser),
		);
		assertNode(
			`cover 10%
	color: purple`,
			parser,
			parser._parseKeyframeSelector.bind(parser),
		);
		assertNode(
			`100000%
	color: purple`,
			parser,
			parser._parseKeyframeSelector.bind(parser),
		);
		assertNode(
			`from
	width: 100
	to: 10px`,
			parser,
			parser._parseKeyframeSelector.bind(parser),
		);
		assertNode(
			`from, to
	width: 10px`,
			parser,
			parser._parseKeyframeSelector.bind(parser),
		);
		assertNode(
			`10%, to
	width: 10px`,
			parser,
			parser._parseKeyframeSelector.bind(parser),
		);
		assertNode(
			`from, 20%
	width: 10px`,
			parser,
			parser._parseKeyframeSelector.bind(parser),
		);
		assertNode(
			`10%, 20%
	width: 10px`,
			parser,
			parser._parseKeyframeSelector.bind(parser),
		);
		assertNode(
			`cover 10%, exit 20%
	width: 10px`,
			parser,
			parser._parseKeyframeSelector.bind(parser),
		);
		assertNode(
			`10%, exit 20%
	width: 10px`,
			parser,
			parser._parseKeyframeSelector.bind(parser),
		);
		assertNode(
			`from, exit 20%
	width: 10px`,
			parser,
			parser._parseKeyframeSelector.bind(parser),
		);
		assertNode(
			`cover 10%, to
	width: 10px`,
			parser,
			parser._parseKeyframeSelector.bind(parser),
		);
		assertNode(
			`cover 10%, 20%
	width: 10px`,
			parser,
			parser._parseKeyframeSelector.bind(parser),
		);
	});

	test("@keyframe", () => {
		assertNode(
			`@keyframes name
	//`,
			parser,
			parser._parseKeyframe.bind(parser),
		);
		assertNode(
			`@-webkit-keyframes name
	//`,
			parser,
			parser._parseKeyframe.bind(parser),
		);
		assertNode(
			`@-o-keyframes name
	//`,
			parser,
			parser._parseKeyframe.bind(parser),
		);
		assertNode(
			`@-moz-keyframes name
	//`,
			parser,
			parser._parseKeyframe.bind(parser),
		);
		assertNode(
			`@keyframes name
	from
		//
	to
		//`,
			parser,
			parser._parseKeyframe.bind(parser),
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
			parser._parseKeyframe.bind(parser),
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
			parser._parseKeyframe.bind(parser),
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
			parser._parseKeyframe.bind(parser),
		);
		assertNode(
			`@keyframes name
	from
		top: 0px
		left: 1px
		right: 2px`,
			parser,
			parser._parseKeyframe.bind(parser),
		);
		assertNode(
			`@keyframes name
	exit 50%
		top: 0px
		left: 1px
		right: 2px`,
			parser,
			parser._parseKeyframe.bind(parser),
		);

		assertError("@keyframes )", parser, parser._parseKeyframe.bind(parser), ParseError.IdentifierExpected);
		assertError(
			`@keyframes name
	from, #123`,
			parser,
			parser._parseKeyframe.bind(parser),
			ParseError.DedentExpected, // Not as accurate as SCSS, but good enough
		);
		assertError(
			`@keyframes name
	10% from
		top: 0px`,
			parser,
			parser._parseKeyframe.bind(parser),
			ParseError.DedentExpected,
		);
		assertError(
			`@keyframes name
	10% 20%
		top: 0px`,
			parser,
			parser._parseKeyframe.bind(parser),
			ParseError.DedentExpected,
		);
		assertError(
			`@keyframes name
	from to
		top: 0px`,
			parser,
			parser._parseKeyframe.bind(parser),
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
			parser._parseStylesheet.bind(parser),
		);

		assertError(
			`@property
	syntax: '<color>'
	inherits: false
	initial-value: #c0ffee`,
			parser,
			parser._parseStylesheet.bind(parser),
			ParseError.IdentifierExpected,
		);
	});

	test("@container", () => {
		assertNode(
			`@container (width <= 150px)
	#inner
		background-color: skyblue`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@container card (inline-size > 30em) and style(--responsive: true)
	#inner
		background-color: skyblue`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`
@container card (inline-size > 30em)
	@container style(--responsive: true)
		#inner
			background-color: skyblue`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`
@container (min-width: 700px)
	.card h2
		font-size: max(1.5em, 1.23em + 2cqi)`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
	});

	test("@import", () => {
		assertNode(`@import "asdfasdf"`, parser, parser._parseImport.bind(parser));
		assertNode(`@ImPort "asdfasdf"`, parser, parser._parseImport.bind(parser));
		assertNode(`@import url(/css/screen.css) screen, projection`, parser, parser._parseImport.bind(parser));
		assertNode(
			`@import url('landscape.css') screen and (orientation:landscape)`,
			parser,
			parser._parseImport.bind(parser),
		);
		assertNode(`@import url("/inc/Styles/full.css") (min-width: 940px)`, parser, parser._parseImport.bind(parser));
		assertNode(`@import url(style.css) screen and (min-width:600px)`, parser, parser._parseImport.bind(parser));
		assertNode(`@import url("./700.css") only screen and (max-width: 700px)`, parser, parser._parseImport.bind(parser));
		assertNode(`@import url("override.css") layer`, parser, parser._parseImport.bind(parser));
		assertNode(`@import url("tabs.css") layer(framework.component)`, parser, parser._parseImport.bind(parser));
		assertNode(`@import "mystyle.css" supports(display: flex)`, parser, parser._parseImport.bind(parser));
		assertNode(
			`@import url("narrow.css") supports(display: flex) handheld and (max-width: 400px)`,
			parser,
			parser._parseImport.bind(parser),
		);
		assertNode(
			`@import url("fallback-layout.css") supports(not (display: flex))`,
			parser,
			parser._parseImport.bind(parser),
		);

		assertError(`@import`, parser, parser._parseImport.bind(parser), ParseError.URIOrStringExpected);
	});

	test("@supports", () => {
		assertNode(
			`@supports ( display: flexbox )
	body
		display: flexbox`,
			parser,
			parser._parseSupports.bind(parser),
		);
		assertNode(
			`@supports not (display: flexbox)
	.outline
		box-shadow: 2px 2px 2px black /* unprefixed last */`,
			parser,
			parser._parseSupports.bind(parser),
		);
		assertNode(
			`@supports ( box-shadow: 2px 2px 2px black ) or ( -moz-box-shadow: 2px 2px 2px black ) or ( -webkit-box-shadow: 2px 2px 2px black )
	.foo
		color: red`,
			parser,
			parser._parseSupports.bind(parser),
		);
		assertNode(
			`@supports ((transition-property: color) or (animation-name: foo)) and (transform: rotate(10deg))
	.foo
		color: red`,
			parser,
			parser._parseSupports.bind(parser),
		);
		assertNode(
			`@supports ((display: flexbox))
	.foo
		color: red`,
			parser,
			parser._parseSupports.bind(parser),
		);
		assertNode(
			`@supports (display: flexbox !important)
	.foo
		color: red`,
			parser,
			parser._parseSupports.bind(parser),
		);
		assertNode(
			`@supports (column-width: 1rem) OR (-moz-column-width: 1rem) OR (-webkit-column-width: 1rem) oR (-x-column-width: 1rem)
	.foo
		color: limegreen`,
			parser,
			parser._parseSupports.bind(parser),
		);
		assertNode(
			`@supports not (--validValue: , 0 )
	.foo
		color: limegreen`,
			parser,
			parser._parseSupports.bind(parser),
		);

		assertError(
			`@supports display: flexbox
	.foo
		color: limegreen`,
			parser,
			parser._parseSupports.bind(parser),
			ParseError.LeftParenthesisExpected,
		);
	});

	test("@media", () => {
		assertNode(
			`@media asdsa
	.foo
		color: black`,
			parser,
			parser._parseMedia.bind(parser),
		);
		assertNode(
			`@meDia asdsa
	.foo
		color: black`,
			parser,
			parser._parseMedia.bind(parser),
		);
		assertNode(
			`@meDia somename, othername2
	.foo
		color: black`,
			parser,
			parser._parseMedia.bind(parser),
		);
		assertNode(
			`@media only screen and (max-width:850px)
	.foo
		color: black`,
			parser,
			parser._parseMedia.bind(parser),
		);
		assertNode(
			`@media all and (min-width:500px)
	.foo
		color: black`,
			parser,
			parser._parseMedia.bind(parser),
		);
		assertNode(
			`@media screen and (color), projection and (color)
	.foo
		color: black`,
			parser,
			parser._parseMedia.bind(parser),
		);
		assertNode(
			`@media not screen and (device-aspect-ratio: 16/9)
	.foo
		color: black`,
			parser,
			parser._parseMedia.bind(parser),
		);
		assertNode(
			`@media print and (min-resolution: 300dpi)
	.foo
		color: black`,
			parser,
			parser._parseMedia.bind(parser),
		);
		assertNode(
			`@media print and (min-resolution: 118dpcm)
	.foo
		color: black`,
			parser,
			parser._parseMedia.bind(parser),
		);
		assertNode(
			`@media print
	@page
		margin: 10%
	blockquote, pre
		page-break-inside: avoid`,
			parser,
			parser._parseMedia.bind(parser),
		);
		assertNode(
			`@media print
	body:before
		page-break-inside: avoid`,
			parser,
			parser._parseMedia.bind(parser),
		);
		assertNode(
			`@media not (-moz-os-version: windows-win7)
	body
		color: black`,
			parser,
			parser._parseMedia.bind(parser),
		);
		assertNode(
			`@media not (not (-moz-os-version: windows-win7))
	body
		color: black`,
			parser,
			parser._parseMedia.bind(parser),
		);
		assertNode(
			`@media (height > 600px)
	body
		color: black`,
			parser,
			parser._parseMedia.bind(parser),
		);
		assertNode(
			`@media (height < 600px)
	body
		color: black`,
			parser,
			parser._parseMedia.bind(parser),
		);
		assertNode(
			`@media (height <= 600px)
	body
		color: black`,
			parser,
			parser._parseMedia.bind(parser),
		);
		assertNode(
			`@media (400px <= width <= 700px)
	body
		color: black`,
			parser,
			parser._parseMedia.bind(parser),
		);
		assertNode(
			`@media (400px >= width >= 700px)
	body
		color: black`,
			parser,
			parser._parseMedia.bind(parser),
		);
		assertNode(
			`@media screen and (750px <= width < 900px)
	body
		color: black`,
			parser,
			parser._parseMedia.bind(parser),
		);

		assertError(
			`@media somename othername2
	body
		color: black`,
			parser,
			parser._parseMedia.bind(parser),
			ParseError.IndentExpected,
		);
		assertError(
			`@media not, screen
	body
		color: black`,
			parser,
			parser._parseMedia.bind(parser),
			ParseError.MediaQueryExpected,
		);
		assertError(
			`@media not screen and foo
	body
		color: black`,
			parser,
			parser._parseMedia.bind(parser),
			ParseError.LeftParenthesisExpected,
		);
		assertError(
			`@media not screen and ()
	body
		color: black`,
			parser,
			parser._parseMedia.bind(parser),
			ParseError.IdentifierExpected,
		);
		assertError(
			`@media not screen and (color:)
	body
		color: black`,
			parser,
			parser._parseMedia.bind(parser),
			ParseError.TermExpected,
		);
		assertError(
			`@media not screen and (color:#fff
	body
		color: black`,
			parser,
			parser._parseMedia.bind(parser),
			ParseError.RightParenthesisExpected,
		);
	});

	test("media query list", () => {
		assertNode("somename", parser, parser._parseMediaQueryList.bind(parser));
		assertNode("somename, othername", parser, parser._parseMediaQueryList.bind(parser));
		assertNode("not all and (monochrome)", parser, parser._parseMediaQueryList.bind(parser));
	});

	test("medium", function () {
		assertNode("somename", parser, parser._parseMedium.bind(parser));
		assertNode("-asdas", parser, parser._parseMedium.bind(parser));
		assertNode("-asda34s", parser, parser._parseMedium.bind(parser));
	});
});
