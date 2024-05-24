import { suite, test, assert } from "vitest";
import { ParseError } from "../../parser/cssErrors";
import { SassParser } from "../../parser/sassParser";
import * as nodes from "../../parser/cssNodes";
import { assertError, assertFunction, assertNoNode, assertNode } from "../css/parser.test";
import { SassParseError } from "../../parser/sassErrors";

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

	test("stylesheet", () => {
		assertNode(`$color: #F5F5F5`, parser, parser._parseStylesheet.bind(parser));
		assertNode(
			`$color: #F5F5F5
$color: #F5F5F5`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`$color: #F5F5F5
$color: #F5F5F5
$color: #F5F5F5`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(`$color: #F5F5F5 !important`, parser, parser._parseStylesheet.bind(parser));
		assertNode(
			`#main
	width: 97%
	p, div
		a
			font-weight: bold`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`a
	&:hover
		color: red`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`fo
	font: 2px/3px
		family: fantasy`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`.foo
	bar:
		yoo: fantasy`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`selector
	propsuffix:
		nested: 1px
	rule: 1px
	nested.selector
		foo: 1
	nested:selector
		foo: 2`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`legend
	foo
		a:s
	margin-top: 0
	margin-bottom: #123
	margin-top:s(1)`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@mixin keyframe
	@keyframes name
		@content`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@include keyframe
	10%
		top: 3px`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`.class
	&--sub-class-with-ampersand
		color: red`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertError(
			`fo
	font: 2px/3px
		family`,
			parser,
			parser._parseStylesheet.bind(parser),
			ParseError.ColonExpected,
		);

		assertNode(
			`legend
	foo
		a:s
	margin-top:0
	margin-bottom:#123
	margin-top:m.s(1)`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@include module.keyframe
	10%
		top: 3px`,
			parser,
			parser._parseStylesheet.bind(parser),
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
	unicode-range: U+0021-007F, u+1f49C, U+4??, U+??????
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
	});

	test("@keyframes sass", () => {
		assertNode(
			`@keyframes name
	@content`,
			parser,
			parser._parseKeyframe.bind(parser),
		);
		assertNode(
			`@keyframes name
	@for $i from 0 through $steps
		#{$i * (100%/$steps)}
			transform: $rotate $translate`,
			parser,
			parser._parseKeyframe.bind(parser),
		);
		assertNode(
			`@keyframes test-keyframe
	@for $i from 1 through 60
		$s: ($i * 100) / 60 + "%"`,
			parser,
			parser._parseKeyframe.bind(parser),
		);

		assertNode(
			`@keyframes name
	@for $i from 0 through m.$steps
		#{$i * (100%/$steps)}
			transform: $rotate $translate`,
			parser,
			parser._parseKeyframe.bind(parser),
		);
		assertNode(
			`@keyframes name
	@function bar()
		@return 1`,
			parser,
			parser._parseKeyframe.bind(parser),
		);
		assertNode(
			`@keyframes name
	@include keyframe-mixin()`,
			parser,
			parser._parseKeyframe.bind(parser),
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

	test("@media sass", () => {
		assertNode(
			`@media screen
	.sidebar
		@media (orientation: landscape)
			width: 500px`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(`@media #{$media} and ($feature: $value)\n\t`, parser, parser._parseStylesheet.bind(parser));
		assertNode(`@media only screen and #{$query}\n\t`, parser, parser._parseStylesheet.bind(parser));
		assertNode(
			`foo
	bar
		@media screen and (orientation: landscape)
			color: red`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(`@media screen and (nth($query, 1): nth($query, 2))\n\t`, parser, parser._parseMedia.bind(parser));
		assertNode(
			`.something
	@media (max-width: 760px)
		> .test
			color: blue`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`.something
	@media (max-width: 760px)
		~ div
			display: block`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`.something
	@media (max-width: 760px)
		+ div
			display: block`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@media (max-width: 760px)
	+ div
		display: block`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(`@media (height <= 600px)\n\t`, parser, parser._parseMedia.bind(parser));
		assertNode(`@media (height >= 600px)\n\t`, parser, parser._parseMedia.bind(parser));

		assertNode(`@media #{layout.$media} and ($feature: $value)\n\t`, parser, parser._parseStylesheet.bind(parser));
		assertNode(`@media #{$media} and (layout.$feature: $value)\n\t`, parser, parser._parseStylesheet.bind(parser));
		assertNode(`@media #{$media} and ($feature: layout.$value)\n\t`, parser, parser._parseStylesheet.bind(parser));
		assertNode(
			`@media #{layout.$media} and (layout.$feature: $value)\n\t`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@media #{$media} and (layout.$feature: layout.$value)\n\t`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@media #{layout.$media} and (layout.$feature: layout.$value)\n\t`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(`@media screen and (list.nth($query, 1): nth($query, 2))\n\t`, parser, parser._parseMedia.bind(parser));
		assertNode(`@media screen and (nth(list.$query, 1): nth($query, 2))\n\t`, parser, parser._parseMedia.bind(parser));
		assertNode(`@media screen and (nth($query, 1): list.nth($query, 2))\n\t`, parser, parser._parseMedia.bind(parser));
		assertNode(`@media screen and (nth($query, 1): nth(list.$query, 2))\n\t`, parser, parser._parseMedia.bind(parser));
		assertNode(
			`@media screen and (list.nth(list.$query, 1): nth($query, 2))\n\t`,
			parser,
			parser._parseMedia.bind(parser),
		);
		assertNode(
			`@media screen and (list.nth($query, 1): list.nth($query, 2))\n\t`,
			parser,
			parser._parseMedia.bind(parser),
		);
		assertNode(
			`@media screen and (list.nth($query, 1): nth(list.$query, 2))\n\t`,
			parser,
			parser._parseMedia.bind(parser),
		);
		assertNode(
			`@media screen and (nth(list.$query, 1): list.nth($query, 2))\n\t`,
			parser,
			parser._parseMedia.bind(parser),
		);
		assertNode(
			`@media screen and (nth(list.$query, 1): nth(list.$query, 2))\n\t`,
			parser,
			parser._parseMedia.bind(parser),
		);
		assertNode(
			`@media screen and (nth($query, 1): list.nth(list.$query, 2))\n\t`,
			parser,
			parser._parseMedia.bind(parser),
		);
		assertNode(
			`@media screen and (list.nth(list.$query, 1): list.nth($query, 2))\n\t`,
			parser,
			parser._parseMedia.bind(parser),
		);
		assertNode(
			`@media screen and (nth(list.$query, 1): list.nth(list.$query, 2))\n\t`,
			parser,
			parser._parseMedia.bind(parser),
		);
		assertNode(
			`@media screen and (list.nth(list.$query, 1): list.nth(list.$query, 2))\n\t`,
			parser,
			parser._parseMedia.bind(parser),
		);
	});

	test("media query list", () => {
		assertNode("somename", parser, parser._parseMediaQueryList.bind(parser));
		assertNode("somename, othername", parser, parser._parseMediaQueryList.bind(parser));
		assertNode("not all and (monochrome)", parser, parser._parseMediaQueryList.bind(parser));
	});

	test("medium", () => {
		assertNode("somename", parser, parser._parseMedium.bind(parser));
		assertNode("-asdas", parser, parser._parseMedium.bind(parser));
		assertNode("-asda34s", parser, parser._parseMedium.bind(parser));
	});

	test("@page", () => {
		assertNode(
			`@page : name
	some: "asdf"`,
			parser,
			parser._parsePage.bind(parser),
		);
		assertNode(
			`@page :left, :right
	some: "asdf"`,
			parser,
			parser._parsePage.bind(parser),
		);
		assertNode(
			`@page : name
	some: "asdf" !important
	some: "asdf" !important`,
			parser,
			parser._parsePage.bind(parser),
		);
		assertNode(
			`@page rotated
	size: landscape`,
			parser,
			parser._parsePage.bind(parser),
		);
		assertNode(
			`@page :left
	margin-left: 4cm
	margin-right: 3cm`,
			parser,
			parser._parsePage.bind(parser),
		);
		assertNode(
			`@page
	@top-right-corner
		content: url(foo.png)
		border: solid green`,
			parser,
			parser._parsePage.bind(parser),
		);
		assertNode(
			`@page
	@top-left-corner
		content: " "
		border: solid green
	@bottom-right-corner
		content: counter(page)
		border: solid green`,
			parser,
			parser._parsePage.bind(parser),
		);

		assertError(
			`@page
	@top-left-corner foo
		content: " "
		border: solid green`,
			parser,
			parser._parsePage.bind(parser),
			ParseError.IndentExpected,
		);
		assertError(
			`@page :
	@top-left-corner foo
		content: " "
		border: solid green`,
			parser,
			parser._parsePage.bind(parser),
			ParseError.IdentifierExpected,
		);
		assertError(
			`@page :left,
	@top-left-corner foo
		content: " "
		border: solid green`,
			parser,
			parser._parsePage.bind(parser),
			ParseError.IdentifierExpected,
		);
	});

	test("@layer", () => {
		assertNode(
			`@layer utilities
	.padding-sm
		padding: .5rem`,
			parser,
			parser._parseLayer.bind(parser),
		);
		assertNode(`@layer utilities`, parser, parser._parseLayer.bind(parser));
		assertNode(`@layer theme, layout, utilities`, parser, parser._parseLayer.bind(parser));
		assertNode(
			`@layer framework
	@layer layout
		.padding-sm
			padding: .5rem`,
			parser,
			parser._parseLayer.bind(parser),
		);
		assertNode(
			`@layer framework.layout
	@keyframes slide-left
		from
			foo: bar
		to
			foo: baz`,
			parser,
			parser._parseLayer.bind(parser),
		);

		assertNode(
			`@media (min-width: 30em)
	@layer layout
		.padding-sm
			padding: .5rem`,
			parser,
			parser._parseStylesheet.bind(parser),
		);

		assertError(`@layer theme. layout`, parser, parser._parseLayer.bind(parser), ParseError.IdentifierExpected);
	});

	test("operator", () => {
		assertNode("/", parser, parser._parseOperator.bind(parser));
		assertNode("*", parser, parser._parseOperator.bind(parser));
		assertNode("+", parser, parser._parseOperator.bind(parser));
		assertNode("-", parser, parser._parseOperator.bind(parser));
	});

	test("combinator", () => {
		assertNode("+", parser, parser._parseCombinator.bind(parser));
		assertNode("+  ", parser, parser._parseCombinator.bind(parser));
		assertNode(">  ", parser, parser._parseCombinator.bind(parser));
		assertNode(">", parser, parser._parseCombinator.bind(parser));
		assertNode(">>>", parser, parser._parseCombinator.bind(parser));
		assertNode("/deep/", parser, parser._parseCombinator.bind(parser));
		assertNode(
			`:host >>> .data-table
	width: 100%`,
			parser,
			parser._parseStylesheet.bind(parser),
		);

		assertError(
			`:host >> .data-table
	width: 100%`,
			parser,
			parser._parseStylesheet.bind(parser),
			ParseError.IndentExpected,
		);
	});

	test("unary_operator", () => {
		assertNode("-", parser, parser._parseUnaryOperator.bind(parser));
		assertNode("+", parser, parser._parseUnaryOperator.bind(parser));
	});

	test("property", () => {
		assertNode("asdsa", parser, parser._parseProperty.bind(parser));
		assertNode("asdsa334", parser, parser._parseProperty.bind(parser));

		assertNode("--color", parser, parser._parseProperty.bind(parser));
		assertNode("--primary-font", parser, parser._parseProperty.bind(parser));
		assertNode("-color", parser, parser._parseProperty.bind(parser));
		assertNode("somevar", parser, parser._parseProperty.bind(parser));
		assertNode("some--let", parser, parser._parseProperty.bind(parser));
		assertNode("somevar--", parser, parser._parseProperty.bind(parser));
	});

	test("ruleset", () => {
		assertNode(
			`
.foo
	font:
		family: Arial
		size: 20px
	color: #ff0000`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`selector
	property: value
	@keyframes foo
		from
			top: 0
		100%
			top: 100%
	@-moz-keyframes foo
		from
			top: 0
		100%
			top: 100%`,
			parser,
			parser._parseRuleset.bind(parser),
		);

		assertNode("foo|bar\n\t//", parser, parser._parseRuleset.bind(parser));

		assertNode(
			`name
	foo: bar`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`

name
	foo: "asdfasdf"`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`

name
	foo : "asdfasdf" !important`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`*
	foo: bar`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`.far
	foo: bar`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`boo
	foo: bar`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`.far #boo
	foo: bar`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`name
	foo: bar
	baz: bar`,
			parser,
			parser._parseRuleset.bind(parser),
		);

		assertError(
			`name
	--minimal:`,
			parser,
			parser._parseRuleset.bind(parser),
			ParseError.PropertyValueExpected,
		);
		assertNode(
			`name
	--minimal:

	other
		padding: 1rem`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`name
	--normal-text: red yellow green`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`name
	--normal-text: red !important`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`name
	--nested:
		color: green`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`name
	--normal-text: this()is()ok()`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`name
	--normal-text: this[]is[]ok[]`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`name
	--normal-text: ([{{[]()()}[]{}}])()`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`name
	--normal-text: , 0 0`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`name
	--normal-text: {}`,
			parser,
			parser._parseRuleset.bind(parser),
		);

		assertNode(
			`.selector
	prop: erty $const 1px`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`.selector
	prop: erty $const 1px m.$foo`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`selector:active
	property: value
	nested: hover
		property: value`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`selector
	property: declaration`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`selector
	$variable: declaration`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`selector
	property: value
	property: $value`,
			parser,
			parser._parseRuleset.bind(parser),
		);

		assertError(
			`name
	font-size: {}`,
			parser,
			parser._parseRuleset.bind(parser),
			ParseError.PropertyValueExpected,
		);
		assertError(
			`boo,
	`,
			parser,
			parser._parseRuleset.bind(parser),
			ParseError.SelectorExpected,
		);
	});

	test("ruleset /Panic/", () => {
		assertError(
			`
foo
	bar:`,
			parser,
			parser._parseRuleset.bind(parser),
			ParseError.PropertyValueExpected,
		);
		assertError(
			`
foo
	bar:
	far: 12em`,
			parser,
			parser._parseRuleset.bind(parser),
			ParseError.PropertyValueExpected,
		);
		assertError(
			`
foo
	bar`,
			parser,
			parser._parseRuleset.bind(parser),
			ParseError.ColonExpected,
		);
		assertError(
			`
foo
	--too-minimal:`,
			parser,
			parser._parseRuleset.bind(parser),
			ParseError.PropertyValueExpected,
		);
		assertError(
			`
foo
	--double-important: red !important !important`,
			parser,
			parser._parseRuleset.bind(parser),
			ParseError.NewlineExpected,
		);
		assertError(
			`
foo
	--unbalanced-parens: not)()(cool`,
			parser,
			parser._parseRuleset.bind(parser),
			ParseError.LeftParenthesisExpected,
		);
		assertError(
			`
foo
	--unbalanced-parens: not][][cool`,
			parser,
			parser._parseRuleset.bind(parser),
			ParseError.LeftSquareBracketExpected,
		);
	});

	test("nested ruleset", () => {
		assertNode(
			`
.foo
	color: red
	input
		color: blue`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`
.foo
	color: red
	:focus
		color: blue`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`
.foo
	color: red
	.bar
		color: blue`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`
.foo
	color: red
	&:hover
		color: blue`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`
.foo
	color: red
	+ .bar
		color: blue`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`
.foo
	color: red
	foo:hover
		color: blue`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`
.foo
	color: red
	@media screen
		color: blue`,
			parser,
			parser._parseRuleset.bind(parser),
		);

		assertNode(
			`
.foo
	$const: 1
	.class
		$const: 2
		$const: 3
	one: $const`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`
.class1
	> .class2
		& > .class4
			rule1: v1`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`
foo
	@at-root
		display: none`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`
th, tr
	@at-root #{selector-replace(&, "tr")}
		border-bottom: 0`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`
foo
	@supports(display: grid)
		.bar
			display: none`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`
foo
	@supports(display: grid)
		display: none`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`
foo
	@supports(position: sticky)
		@media (min-width: map-get($grid-breakpoints, medium))
			position: sticky`,
			parser,
			parser._parseRuleset.bind(parser),
		);
	});

	test("nested ruleset 2", () => {
		assertNode(
			`
.foo
	.parent &
		color: blue`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`
.foo
	color: red
	& > .bar, > .baz
		color: blue`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`
.foo
	& .bar & .baz & .hmm
		color: blue`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`
.foo
	color: red
	:not(&)
		color: blue
	+ .bar + &
		color: green`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`
.foo
	color: red
	&
		color: blue
	&&
		color: green`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`
.foo
	& :is(.bar, &.baz)
		color: red`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`
figure
	> figcaption
		background: hsl(0 0% 0% / 50%)
		> p
			font-size: .9rem`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`
@layer base
	html
		& body
			min-block-size: 100%`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
	});

	test("selector", () => {
		assertNode("asdsa", parser, parser._parseSelector.bind(parser));
		assertNode("asdsa + asdas", parser, parser._parseSelector.bind(parser));
		assertNode("asdsa + asdas + name", parser, parser._parseSelector.bind(parser));
		assertNode("asdsa + asdas + name", parser, parser._parseSelector.bind(parser));
		assertNode("name #id#anotherid", parser, parser._parseSelector.bind(parser));
		assertNode("name.far .boo", parser, parser._parseSelector.bind(parser));
		assertNode("name .name .zweitername", parser, parser._parseSelector.bind(parser));
		assertNode("*", parser, parser._parseSelector.bind(parser));
		assertNode("#id", parser, parser._parseSelector.bind(parser));
		assertNode("far.boo", parser, parser._parseSelector.bind(parser));
		assertNode("::slotted(div)::after", parser, parser._parseSelector.bind(parser)); // 35076
	});

	test("attrib", () => {
		assertNode("[name]", parser, parser._parseAttrib.bind(parser));
		assertNode("[name = name2]", parser, parser._parseAttrib.bind(parser));
		assertNode("[name ~= name3]", parser, parser._parseAttrib.bind(parser));
		assertNode("[name~=name3]", parser, parser._parseAttrib.bind(parser));
		assertNode("[name |= name3]", parser, parser._parseAttrib.bind(parser));
		assertNode('[name |= "this is a striiiing"]', parser, parser._parseAttrib.bind(parser));
		assertNode('[href*="insensitive" i]', parser, parser._parseAttrib.bind(parser));
		assertNode('[href*="sensitive" S]', parser, parser._parseAttrib.bind(parser));

		// Single namespace
		assertNode("[namespace|name]", parser, parser._parseAttrib.bind(parser));
		assertNode("[name-space|name = name2]", parser, parser._parseAttrib.bind(parser));
		assertNode("[name_space|name ~= name3]", parser, parser._parseAttrib.bind(parser));
		assertNode("[name0spae|name~=name3]", parser, parser._parseAttrib.bind(parser));
		assertNode('[NameSpace|name |= "this is a striiiing"]', parser, parser._parseAttrib.bind(parser));
		assertNode("[name\\*space|name |= name3]", parser, parser._parseAttrib.bind(parser));
		assertNode("[*|name]", parser, parser._parseAttrib.bind(parser));
	});

	test("pseudo", () => {
		assertNode(":some", parser, parser._parsePseudo.bind(parser));
		assertNode(":some(thing)", parser, parser._parsePseudo.bind(parser));
		assertNode(":nth-child(12)", parser, parser._parsePseudo.bind(parser));
		assertNode(":nth-child(1n)", parser, parser._parsePseudo.bind(parser));
		assertNode(":nth-child(-n+3)", parser, parser._parsePseudo.bind(parser));
		assertNode(":nth-child(2n+1)", parser, parser._parsePseudo.bind(parser));
		assertNode(":nth-child(2n+1 of .foo)", parser, parser._parsePseudo.bind(parser));
		assertNode(':nth-child(2n+1 of .foo > bar, :not(*) ~ [other="value"])', parser, parser._parsePseudo.bind(parser));
		assertNode(":lang(it)", parser, parser._parsePseudo.bind(parser));
		assertNode(":not(.class)", parser, parser._parsePseudo.bind(parser));
		assertNode(":not(:disabled)", parser, parser._parsePseudo.bind(parser));
		assertNode(":not(#foo)", parser, parser._parsePseudo.bind(parser));
		assertNode("::slotted(*)", parser, parser._parsePseudo.bind(parser)); // #35076
		assertNode("::slotted(div:hover)", parser, parser._parsePseudo.bind(parser)); // #35076
		assertNode(":global(.output ::selection)", parser, parser._parsePseudo.bind(parser)); // #49010
		assertNode(":matches(:hover, :focus)", parser, parser._parsePseudo.bind(parser)); // #49010
		assertNode(":host([foo=bar][bar=foo])", parser, parser._parsePseudo.bind(parser)); // #49589
		assertNode(":has(> .test)", parser, parser._parsePseudo.bind(parser)); // #250
		assertNode(":has(~ .test)", parser, parser._parsePseudo.bind(parser)); // #250
		assertNode(":has(+ .test)", parser, parser._parsePseudo.bind(parser)); // #250
		assertNode(":has(~ div .test)", parser, parser._parsePseudo.bind(parser)); // #250
		assertError("::", parser, parser._parsePseudo.bind(parser), ParseError.IdentifierExpected);
		assertError(":: foo", parser, parser._parsePseudo.bind(parser), ParseError.IdentifierExpected);
		assertError(":nth-child(1n of)", parser, parser._parsePseudo.bind(parser), ParseError.SelectorExpected);
	});

	test("declaration", () => {
		assertNode('name : "this is a string" !important', parser, parser._parseDeclaration.bind(parser));
		assertNode('name : "this is a string"', parser, parser._parseDeclaration.bind(parser));
		assertNode("property:12", parser, parser._parseDeclaration.bind(parser));
		assertNode("-vendor-property: 12", parser, parser._parseDeclaration.bind(parser));
		assertNode("font-size: 12px", parser, parser._parseDeclaration.bind(parser));
		assertNode("color : #888 /4", parser, parser._parseDeclaration.bind(parser));
		assertNode(
			"filter : progid:DXImageTransform.Microsoft.Shadow(color=#000000,direction=45)",
			parser,
			parser._parseDeclaration.bind(parser),
		);
		assertNode(
			"filter : progid: DXImageTransform.Microsoft.DropShadow(offx=2, offy=1, color=#000000)",
			parser,
			parser._parseDeclaration.bind(parser),
		);
		assertNode("font-size: 12px", parser, parser._parseDeclaration.bind(parser));
		assertNode("*background: #f00 /* IE 7 and below */", parser, parser._parseDeclaration.bind(parser));
		assertNode("_background: #f60 /* IE 6 and below */", parser, parser._parseDeclaration.bind(parser));
		assertNode(
			"background-image: linear-gradient(to right, silver, white 50px, white calc(100% - 50px), silver)",
			parser,
			parser._parseDeclaration.bind(parser),
		);
		assertNode(
			"grid-template-columns: [first nav-start] 150px [main-start] 1fr [last]",
			parser,
			parser._parseDeclaration.bind(parser),
		);
		assertNode(
			"grid-template-columns: repeat(4, 10px [col-start] 250px [col-end]) 10px",
			parser,
			parser._parseDeclaration.bind(parser),
		);
		assertNode(
			"grid-template-columns: [a] auto [b] minmax(min-content, 1fr) [b c d] repeat(2, [e] 40px)",
			parser,
			parser._parseDeclaration.bind(parser),
		);
		assertNode("grid-template: [foo] 10px / [bar] 10px", parser, parser._parseDeclaration.bind(parser));
		assertNode(
			`grid-template: 'left1 footer footer' 1fr [end] / [ini] 1fr [info-start] 2fr 1fr [end]`,
			parser,
			parser._parseDeclaration.bind(parser),
		);
		assertNode(`content: "("counter(foo) ")"`, parser, parser._parseDeclaration.bind(parser));
		assertNode(`content: 'Hello\\0A''world'`, parser, parser._parseDeclaration.bind(parser));
	});

	test("term", () => {
		assertNode('"asdasd"', parser, parser._parseTerm.bind(parser));
		assertNode("name", parser, parser._parseTerm.bind(parser));
		assertNode("#FFFFFF", parser, parser._parseTerm.bind(parser));
		assertNode('url("this is a url")', parser, parser._parseTerm.bind(parser));
		assertNode("+324", parser, parser._parseTerm.bind(parser));
		assertNode("-45", parser, parser._parseTerm.bind(parser));
		assertNode("+45", parser, parser._parseTerm.bind(parser));
		assertNode("-45%", parser, parser._parseTerm.bind(parser));
		assertNode("-45mm", parser, parser._parseTerm.bind(parser));
		assertNode("-45em", parser, parser._parseTerm.bind(parser));
		assertNode('"asdsa"', parser, parser._parseTerm.bind(parser));
		assertNode("faa", parser, parser._parseTerm.bind(parser));
		assertNode('url("this is a striiiiing")', parser, parser._parseTerm.bind(parser));
		assertNode("#FFFFFF", parser, parser._parseTerm.bind(parser));
		assertNode("name(asd)", parser, parser._parseTerm.bind(parser));
		assertNode("calc(50% + 20px)", parser, parser._parseTerm.bind(parser));
		assertNode("calc(50% + (100%/3 - 2*1em - 2*1px))", parser, parser._parseTerm.bind(parser));
		assertNoNode(
			"%('repetitions: %S file: %S', 1 + 2, \"directory/file.less\")",
			parser,
			parser._parseTerm.bind(parser),
		); // less syntax
		assertNoNode('~"ms:alwaysHasItsOwnSyntax.For.Stuff()"', parser, parser._parseTerm.bind(parser)); // less syntax
		assertNode("U+002?-0199", parser, parser._parseTerm.bind(parser));
		assertNoNode("U+002?-01??", parser, parser._parseTerm.bind(parser));
		assertNoNode("U+00?0;", parser, parser._parseTerm.bind(parser));
		assertNoNode("U+0XFF;", parser, parser._parseTerm.bind(parser));
	});

	test("function", () => {
		assertNode('name( "bla" )', parser, parser._parseFunction.bind(parser));
		assertNode("name( name )", parser, parser._parseFunction.bind(parser));
		assertNode("name( -500mm )", parser, parser._parseFunction.bind(parser));
		assertNode("\u060frf()", parser, parser._parseFunction.bind(parser));
		assertNode("über()", parser, parser._parseFunction.bind(parser));

		assertNoNode("über ()", parser, parser._parseFunction.bind(parser));
		assertNoNode("%()", parser, parser._parseFunction.bind(parser));
		assertNoNode("% ()", parser, parser._parseFunction.bind(parser));

		assertFunction("let(--color)", parser, parser._parseFunction.bind(parser));
		assertFunction("let(--color, somevalue)", parser, parser._parseFunction.bind(parser));
		assertFunction("let(--variable1, --variable2)", parser, parser._parseFunction.bind(parser));
		assertFunction("let(--variable1, let(--variable2))", parser, parser._parseFunction.bind(parser));
		assertFunction("fun(value1, value2)", parser, parser._parseFunction.bind(parser));
		assertFunction("fun(value1,)", parser, parser._parseFunction.bind(parser));
	});

	test("test token prio", () => {
		assertNode("!important", parser, parser._parsePrio.bind(parser));
		assertNode("!/*demo*/important", parser, parser._parsePrio.bind(parser));
		assertNode("! /*demo*/ important", parser, parser._parsePrio.bind(parser));
		assertNode("! /*dem o*/  important", parser, parser._parsePrio.bind(parser));
	});

	test("hexcolor", () => {
		assertNode("#FFF", parser, parser._parseHexColor.bind(parser));
		assertNode("#FFFF", parser, parser._parseHexColor.bind(parser));
		assertNode("#FFFFFF", parser, parser._parseHexColor.bind(parser));
		assertNode("#FFFFFFFF", parser, parser._parseHexColor.bind(parser));
	});

	test("test class", () => {
		assertNode(".faa", parser, parser._parseClass.bind(parser));
		assertNode("faa", parser, parser._parseElementName.bind(parser));
		assertNode("*", parser, parser._parseElementName.bind(parser));
		assertNode(".faa42", parser, parser._parseClass.bind(parser));
	});

	test("prio", () => {
		assertNode("!important", parser, parser._parsePrio.bind(parser));
	});

	test("expr", () => {
		assertNode("45,5px", parser, parser._parseExpr.bind(parser));
		assertNode(" 45 , 5px ", parser, parser._parseExpr.bind(parser));
		assertNode("5/6", parser, parser._parseExpr.bind(parser));
		assertNode("36mm, -webkit-calc(100%-10px)", parser, parser._parseExpr.bind(parser));
	});

	test("url", () => {
		assertNode("url(foo())", parser, parser._parseURILiteral.bind(parser));
		assertNode(
			"url('data:image/svg+xml;utf8,%3Csvg%20fill%3D%22%23' + $color + 'foo')",
			parser,
			parser._parseURILiteral.bind(parser),
		);
		assertNode("url(//yourdomain/yourpath.png)", parser, parser._parseURILiteral.bind(parser));
		assertNode("url('http://msft.com')", parser, parser._parseURILiteral.bind(parser));
		assertNode('url("http://msft.com")', parser, parser._parseURILiteral.bind(parser));
		assertNode('url( "http://msft.com")', parser, parser._parseURILiteral.bind(parser));
		assertNode('url(\t"http://msft.com")', parser, parser._parseURILiteral.bind(parser));
		assertNode('url("")', parser, parser._parseURILiteral.bind(parser));
		assertNode('uRL("")', parser, parser._parseURILiteral.bind(parser));
		assertNode('URL("")', parser, parser._parseURILiteral.bind(parser));
		assertNode("url(http://msft.com)", parser, parser._parseURILiteral.bind(parser));
		assertNode("url()", parser, parser._parseURILiteral.bind(parser));
		assertError(
			'url("http://msft.com"',
			parser,
			parser._parseURILiteral.bind(parser),
			ParseError.RightParenthesisExpected,
		);
		assertError(
			"url(http://msft.com')",
			parser,
			parser._parseURILiteral.bind(parser),
			ParseError.RightParenthesisExpected,
		);
	});

	test("map", () => {
		assertNode("(key1: 1px, key2: solid + px, key3: (2+3))", parser, parser._parseExpr.bind(parser));
		assertNode("($key1 + 3: 1px)", parser, parser._parseExpr.bind(parser));
	});

	test("parent selector", () => {
		assertNode("&:hover", parser, parser._parseSimpleSelector.bind(parser));
		assertNode("&.float", parser, parser._parseSimpleSelector.bind(parser));
		assertNode("&-bar", parser, parser._parseSimpleSelector.bind(parser));
		assertNode("&-1", parser, parser._parseSimpleSelector.bind(parser));
		assertNode("&1", parser, parser._parseSimpleSelector.bind(parser));
		assertNode("&-foo-1", parser, parser._parseSimpleSelector.bind(parser));
		assertNode("&&", parser, parser._parseSimpleSelector.bind(parser));
		assertNode("&-10-thing", parser, parser._parseSimpleSelector.bind(parser));
	});

	test("placeholder selector", () => {
		assertNode("%hover", parser, parser._parseSimpleSelector.bind(parser));
		assertNode("a%float", parser, parser._parseSimpleSelector.bind(parser));
	});

	test("selector interpolation", function () {
		assertNode(`.#{$name}\n\t//`, parser, parser._parseRuleset.bind(parser));
		assertNode(`.#{$name}-foo\n\t//`, parser, parser._parseRuleset.bind(parser));
		assertNode(`.#{$name}-foo-3\n\t//`, parser, parser._parseRuleset.bind(parser));
		assertNode(`.#{$name}-1\n\t//`, parser, parser._parseRuleset.bind(parser));
		assertNode(`.sc-col#{$postfix}-2-1\n\t//`, parser, parser._parseRuleset.bind(parser));
		assertNode(`p.#{$name}\n\t#{$attr}-color: blue`, parser, parser._parseRuleset.bind(parser));
		assertNode(
			`sans-#{serif}
	a-#{1 + 2}-color-#{$attr}: blue`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(`##{f} .#{f} #{f}:#{f}\n\t//`, parser, parser._parseRuleset.bind(parser));
		assertNode(`.foo-#{&} .foo-#{&-sub}\n\t//`, parser, parser._parseRuleset.bind(parser));
		assertNode(`.-#{$variable}\n\t//`, parser, parser._parseRuleset.bind(parser));
		assertNode(`#{&}([foo=bar][bar=foo])\n\t//`, parser, parser._parseRuleset.bind(parser));

		assertNode(`.#{module.$name}\n\t//`, parser, parser._parseRuleset.bind(parser));
		assertNode(`.#{module.$name}-foo\n\t//`, parser, parser._parseRuleset.bind(parser));
		assertNode(`.#{module.$name}-foo-3\n\t//`, parser, parser._parseRuleset.bind(parser));
		assertNode(`.#{module.$name}-1\n\t//`, parser, parser._parseRuleset.bind(parser));
		assertNode(`.sc-col#{module.$postfix}-2-1\n\t//`, parser, parser._parseRuleset.bind(parser));
		assertNode(
			`p.#{module.$name}
	#{$attr}-color: blue`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`p.#{$name}
	#{module.$attr}-color: blue`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`p.#{module.$name}
	#{module.$attr}-color: blue`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(
			`sans-#{serif}
	a-#{1 + 2}-color-#{module.$attr}: blue`,
			parser,
			parser._parseRuleset.bind(parser),
		);
		assertNode(`.-#{module.$variable}\n\t//`, parser, parser._parseRuleset.bind(parser));
	});

	test("@at-root", () => {
		assertNode(
			`@mixin unify-parent($child)
	@at-root f#{selector.unify(&, $child)}
		color: f`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@at-root #main2 .some-class
	padding-left: calc( #{$a-variable} + 8px)`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@media print
	.page
		@at-root (without: media)
			foo: bar`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@media print
	.page
		@at-root (with: rule)
			foo: bar`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
	});

	test("@function", () => {
		assertNode(
			`@function grid-width($n)
	@return $n * $grid-width + ($n - 1) * $gutter-width`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@function grid-width($n: 1, $e)
	@return 0`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@function foo($total, $a)
	@for $i from 0 to $total
		//
	@return $grid`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@function foo()
	@if (unit($a) == "%") and ($i == ($total - 1))
		@return 0
	@return 1`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@function is-even($int)
	@if $int%2 == 0
		@return true
	@return false`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@function bar ($i)
	@if $i > 0
		@return $i * bar($i - 1)
	@return 1`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@function foo($a,)
	//`,
			parser,
			parser._parseStylesheet.bind(parser),
		);

		assertError(
			`@function foo
	//`,
			parser,
			parser._parseStylesheet.bind(parser),
			ParseError.LeftParenthesisExpected,
		);
		assertError(
			`@function
	//`,
			parser,
			parser._parseStylesheet.bind(parser),
			ParseError.IdentifierExpected,
		);
		assertError(
			`@function foo($a $b)
	//`,
			parser,
			parser._parseStylesheet.bind(parser),
			ParseError.RightParenthesisExpected,
		);
		assertError(
			`@function foo($a
	//`,
			parser,
			parser._parseStylesheet.bind(parser),
			ParseError.RightParenthesisExpected,
		);
		assertError(
			`@function foo($a...)
	@return`,
			parser,
			parser._parseStylesheet.bind(parser),
			ParseError.ExpressionExpected,
		);
		assertError(
			`@function foo($a:)
	//`,
			parser,
			parser._parseStylesheet.bind(parser),
			ParseError.VariableValueExpected,
		);
	});

	test("@include", () => {
		assertNode(
			`p
	@include double-border(blue)`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`.shadows
	@include box-shadow(0px 4px 5px #666, 2px 6px 10px #999)`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`$values: #ff0000, #00ff00, #0000ff

.primary
	@include colors($values...)`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(`@include colors(this("styles")...)`, parser, parser._parseStylesheet.bind(parser));
		assertNode(
			`.test
	@include fontsize(16px, 21px !important)`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`p
	@include apply-to-ie6-only
		#logo
			background-image: url(/logo.gif)`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`p
	@include foo($values,)`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`p
	@include foo($values,)`,
			parser,
			parser._parseStylesheet.bind(parser),
		);

		assertError(
			`p
	@include double-border($values blue`,
			parser,
			parser._parseStylesheet.bind(parser),
			ParseError.RightParenthesisExpected,
		);
		assertError(
			`p
	@include`,
			parser,
			parser._parseStylesheet.bind(parser),
			ParseError.IdentifierExpected,
		);
		assertError(
			`p
	@include foo($values`,
			parser,
			parser._parseStylesheet.bind(parser),
			ParseError.RightParenthesisExpected,
		);
		assertError(
			`p
	@include foo($values,`,
			parser,
			parser._parseStylesheet.bind(parser),
			ParseError.ExpressionExpected,
		);

		assertNode(
			`p
	@include lib.double-border(blue)`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`.shadows
	@include lib.box-shadow(0px 4px 5px #666, 2px 6px 10px #999)`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`$values: #ff0000, #00ff00, #0000ff
.primary
	@include lib.colors($values...)`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`.primary
	@include colors(lib.$values...)`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`.primary
	@include lib.colors(lib.$values...)`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(`@include lib.colors(this("styles")...)`, parser, parser._parseStylesheet.bind(parser));
		assertNode(`@include colors(lib.this("styles")...)`, parser, parser._parseStylesheet.bind(parser));
		assertNode(`@include lib.colors(lib.this("styles")...)`, parser, parser._parseStylesheet.bind(parser));
		assertNode(
			`.test
	@include lib.fontsize(16px, 21px !important)`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`p
	@include lib.apply-to-ie6-only
		#logo
			background-image: url(/logo.gif)`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`p
	@include lib.foo($values,)`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`p
	@include foo(lib.$values,)`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`p
	@include lib.foo(m.$values,)`,
			parser,
			parser._parseStylesheet.bind(parser),
		);

		assertError(
			`p
	@include foo.($values)`,
			parser,
			parser._parseStylesheet.bind(parser),
			ParseError.IdentifierExpected,
		);

		assertNode(
			`@include rtl("left") using ($dir)
	margin-#{$dir}: 10px`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
	});

	test("@content", () => {
		assertNode("@content", parser, parser._parseMixinContent.bind(parser));
		assertNode("@content($type)", parser, parser._parseMixinContent.bind(parser));
	});

	test("@mixin", () => {
		assertNode(
			`@mixin large-text
	font:
		family: Arial
		size: 20px
	color: #ff0000`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@mixin double-border($color, $width: 1in)
	color: black`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@mixin box-shadow($shadows...)
	-moz-box-shadow: $shadows`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@mixin apply-to-ie6-only
	* html
		@content`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(`@mixin #{foo}($color)\n\t//`, parser, parser._parseStylesheet.bind(parser));
		assertNode(
			`@mixin foo ($i:4)
	size: $i
	@include wee ($i - 1)`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(`@mixin foo ($i,)\n\t//`, parser, parser._parseStylesheet.bind(parser));

		assertError(`@mixin $1\n\t//`, parser, parser._parseStylesheet.bind(parser), ParseError.IdentifierExpected);
		assertError(`@mixin foo() i\n\t//`, parser, parser._parseStylesheet.bind(parser), ParseError.IndentExpected);
		assertError(
			`@mixin foo(1)\n\t//`,
			parser,
			parser._parseStylesheet.bind(parser),
			ParseError.RightParenthesisExpected,
		);
		assertError(
			`@mixin foo($color = 9)\n\t//`,
			parser,
			parser._parseStylesheet.bind(parser),
			ParseError.RightParenthesisExpected,
		);
		assertError(`@mixin foo($color)`, parser, parser._parseStylesheet.bind(parser), ParseError.IndentExpected);
	});

	test("@while", () => {
		assertNode(
			`@while $i < 0
	.item-#{$i}
		width: 2em * $i
	$i: $i - 2`,
			parser,
			parser._parseRuleSetDeclaration.bind(parser),
		);
		assertError(`@while\n\t//`, parser, parser._parseRuleSetDeclaration.bind(parser), ParseError.ExpressionExpected);
		assertError(`@while $i != 4`, parser, parser._parseRuleSetDeclaration.bind(parser), ParseError.IndentExpected);
	});

	test("@each", () => {
		assertNode(`@each $i in 1, 2, 3\n\t`, parser, parser._parseRuleSetDeclaration.bind(parser));
		assertNode(`@each $i in 1 2 3\n\t`, parser, parser._parseRuleSetDeclaration.bind(parser));
		assertNode(
			`@each $animal, $color, $cursor in (puma, black, default), (egret, white, move)\n\t`,
			parser,
			parser._parseRuleSetDeclaration.bind(parser),
		);
		assertError(
			`@each i in 4\n\t`,
			parser,
			parser._parseRuleSetDeclaration.bind(parser),
			ParseError.VariableNameExpected,
		);
		assertError(`@each $i from 4\n\t`, parser, parser._parseRuleSetDeclaration.bind(parser), SassParseError.InExpected);
		assertError(`@each $i in\n\t`, parser, parser._parseRuleSetDeclaration.bind(parser), ParseError.ExpressionExpected);
		assertError(
			`@each $animal,  in (1, 1, 1), (2, 2, 2)\n\t`,
			parser,
			parser._parseRuleSetDeclaration.bind(parser),
			ParseError.VariableNameExpected,
		);
	});

	test("@for", () => {
		assertNode(
			`@for $i from 1 to 5
	.item-#{$i}
		width: 2em * $i`,
			parser,
			parser._parseRuleSetDeclaration.bind(parser),
		);
		assertNode(`@for $k from 1 + $x through 5 + $x\n\t`, parser, parser._parseRuleSetDeclaration.bind(parser));
		assertError(
			`@for i from 0 to 4\n\t`,
			parser,
			parser._parseRuleSetDeclaration.bind(parser),
			ParseError.VariableNameExpected,
		);
		assertError(`@for $i to 4\n\t`, parser, parser._parseRuleSetDeclaration.bind(parser), SassParseError.FromExpected);
		assertError(
			`@for $i from 0 by 4\n\t`,
			parser,
			parser._parseRuleSetDeclaration.bind(parser),
			SassParseError.ThroughOrToExpected,
		);
		assertError(
			`@for $i from\n\t`,
			parser,
			parser._parseRuleSetDeclaration.bind(parser),
			ParseError.ExpressionExpected,
		);
		assertError(
			`@for $i from 0 to\n\t`,
			parser,
			parser._parseRuleSetDeclaration.bind(parser),
			ParseError.ExpressionExpected,
		);
		assertNode(
			`@for $i from 1 through 60
	$s: $i + "%"`,
			parser,
			parser._parseRuleSetDeclaration.bind(parser),
		);

		assertNode(`@for $k from 1 + m.$x through 5 + $x\n\t`, parser, parser._parseRuleSetDeclaration.bind(parser));
		assertNode(`@for $k from 1 + $x through 5 + m.$x\n\t`, parser, parser._parseRuleSetDeclaration.bind(parser));
		assertNode(`@for $k from 1 + m.$x through 5 + m.$x\n\t`, parser, parser._parseRuleSetDeclaration.bind(parser));
	});

	test("@if", () => {
		assertNode(
			`@if 1 + 1 == 2
	border: 1px solid`,
			parser,
			parser._parseRuleSetDeclaration.bind(parser),
		);
		assertNode(
			`@if 5 < 3
	border: 2px dotted`,
			parser,
			parser._parseRuleSetDeclaration.bind(parser),
		);
		assertNode(
			`@if null
	border: 3px double`,
			parser,
			parser._parseRuleSetDeclaration.bind(parser),
		);
		assertNode(
			`@if 1 <= $const
	border: 3px
@else
	border: 4px`,
			parser,
			parser._parseRuleSetDeclaration.bind(parser),
		);
		assertNode(
			`@if 1 >= (1 + $foo)
	border: 3px
@else if 1 + 1 == 2
	border: 4px`,
			parser,
			parser._parseRuleSetDeclaration.bind(parser),
		);
		assertNode(
			`p
	@if $i == 1
		x: 3px
	@else if $i == 1
		x: 4px
	@else
		x: 4px`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@if (index($_RESOURCES, "clean") != null)
	@error "sdssd"`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@if $i == 1
	p
		x: 3px`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertError(
			`@if
	border: 1px solid`,
			parser,
			parser._parseRuleSetDeclaration.bind(parser),
			ParseError.ExpressionExpected,
		);

		assertNode(
			`@if 1 <= m.$const
	border: 3px
@else
	border: 4px`,
			parser,
			parser._parseRuleSetDeclaration.bind(parser),
		);
		assertNode(
			`@if 1 >= (1 + m.$foo)
	border: 3px
@else if 1 + 1 == 2
	border: 4px`,
			parser,
			parser._parseRuleSetDeclaration.bind(parser),
		);
		assertNode(
			`p
	@if m.$i == 1
		x: 3px
	@else if $i == 1
		x: 4px
	@else
		x: 4px`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`p
	@if $i == 1
		x: 3px
	@else if m.$i == 1
		x: 4px
	@else
		x: 4px`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`p
	@if m.$i == 1
		x: 3px
	@else if m.$i == 1
		x: 4px
	@else
		x: 4px`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@if (list.index($_RESOURCES, "clean") != null)
	@error "sdssd"`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@if (index(m.$_RESOURCES, "clean") != null)
	@error "sdssd"`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@if (list.index(m.$_RESOURCES, "clean") != null)
	@error "sdssd"`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
	});

	test("@debug", () => {
		assertNode(`@debug test`, parser, parser._parseStylesheet.bind(parser));
		assertNode(
			`foo
	@debug 1 + 4
	nested
		@warn 1 4`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@if $foo == 1
	@debug 1 + 4`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@function setStyle($map, $object, $style)
	@warn "The key ´#{$object} is not available in the map."
	@return null`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
	});

	test("@extend", () => {
		assertNode(
			`.themable
	@extend %theme`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`foo
	@extend .error
	border-width: 3px`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`a.important
	@extend .notice !optional`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`.hoverlink
	@extend a:hover`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`.seriousError
	@extend .error
	@extend .attention`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`#context a%extreme
	color: blue
.notice
	@extend %extreme`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@media print
	.error
		color: red
	.seriousError
		@extend .error`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@mixin error($a: false)
	@extend .#{$a}
	@extend ##{$a}`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`.foo
	@extend .text-center, .uppercase`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`.foo
	@extend .text-center, .uppercase, `,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`.foo
	@extend .text-center, .uppercase !optional `,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertError(
			`.hoverlink
	@extend`,
			parser,
			parser._parseStylesheet.bind(parser),
			ParseError.SelectorExpected,
		);
		assertError(
			`.hoverlink
	@extend %extreme !default`,
			parser,
			parser._parseStylesheet.bind(parser),
			ParseError.UnknownKeyword,
		);
	});

	test("@forward", () => {
		assertNode('@forward "test"', parser, parser._parseForward.bind(parser));
		assertNode('@forward "test" as foo-*', parser, parser._parseForward.bind(parser));
		assertNode('@forward "test" hide this', parser, parser._parseForward.bind(parser));
		assertNode('@forward "test" hide $that', parser, parser._parseForward.bind(parser));
		assertNode('@forward "test" hide this $that', parser, parser._parseForward.bind(parser));
		assertNode('@forward "test" hide this, $that', parser, parser._parseForward.bind(parser));
		assertNode('@forward "abstracts/functions" show px-to-rem, theme-color', parser, parser._parseForward.bind(parser));
		assertNode('@forward "test" show this', parser, parser._parseForward.bind(parser));
		assertNode('@forward "test" show $that', parser, parser._parseForward.bind(parser));
		assertNode('@forward "test" show this $that', parser, parser._parseForward.bind(parser));
		assertNode('@forward "test" as foo-* show this $that', parser, parser._parseForward.bind(parser));

		assertError("@forward", parser, parser._parseForward.bind(parser), ParseError.StringLiteralExpected);
		assertError('@forward "test" as', parser, parser._parseForward.bind(parser), ParseError.IdentifierExpected);
		assertError('@forward "test" as foo-', parser, parser._parseForward.bind(parser), ParseError.WildcardExpected);
		assertError('@forward "test" as foo- *', parser, parser._parseForward.bind(parser), ParseError.WildcardExpected);
		assertError(
			'@forward "test" show',
			parser,
			parser._parseForward.bind(parser),
			ParseError.IdentifierOrVariableExpected,
		);
		assertError(
			'@forward "test" hide',
			parser,
			parser._parseForward.bind(parser),
			ParseError.IdentifierOrVariableExpected,
		);

		assertNode(
			'@forward "test" with (  $black: #222 !default,  $border-radius: 0.1rem !default )',
			parser,
			parser._parseForward.bind(parser),
		);
		assertNode(
			'@forward "../forms.scss" as components-* with ( $field-border: false )',
			parser,
			parser._parseForward.bind(parser),
		); // #145108

		assertNode(
			`@use "lib"
@forward "test"`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@forward "test"
@forward "lib"`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`$test: "test"
@forward "test"`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
	});

	test("@use", () => {
		assertNode('@use "test"', parser, parser._parseUse.bind(parser));
		assertNode('@use "test" as foo', parser, parser._parseUse.bind(parser));
		assertNode('@use "test" as *', parser, parser._parseUse.bind(parser));
		assertNode('@use "test" with ($foo: "test", $bar: 1)', parser, parser._parseUse.bind(parser));
		assertNode('@use "test" as foo with ($foo: "test", $bar: 1)', parser, parser._parseUse.bind(parser));

		assertError("@use", parser, parser._parseUse.bind(parser), ParseError.StringLiteralExpected);
		assertError('@use "test" foo', parser, parser._parseUse.bind(parser), ParseError.UnknownKeyword);
		assertError('@use "test" as', parser, parser._parseUse.bind(parser), ParseError.IdentifierOrWildcardExpected);
		assertError('@use "test" with', parser, parser._parseUse.bind(parser), ParseError.LeftParenthesisExpected);
		assertError('@use "test" with ($foo)', parser, parser._parseUse.bind(parser), ParseError.VariableValueExpected);
		assertError('@use "test" with ("bar")', parser, parser._parseUse.bind(parser), ParseError.VariableNameExpected);
		assertError(
			'@use "test" with ($foo: 1, "bar")',
			parser,
			parser._parseUse.bind(parser),
			ParseError.VariableNameExpected,
		);
		assertError(
			'@use "test" with ($foo: "bar"',
			parser,
			parser._parseUse.bind(parser),
			ParseError.RightParenthesisExpected,
		);

		assertNode(
			`@forward "test"
@use "lib"`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`@use "test"
@use "lib"`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`$test: "test"
@use "lib"`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
	});

	test("@container", () => {
		assertNode(
			`@container (min-width: #{$minWidth})
	.scss-interpolation
		line-height: 10cqh`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`.item-icon
	@container (max-height: 100px)
		.item-icon
			display: none`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
		assertNode(
			`:root
	@container (max-height: 100px)
		display: none`,
			parser,
			parser._parseStylesheet.bind(parser),
		);
	});

	test("@layer", () => {
		assertNode("@layer #{$layer}\n\t", parser, parser._parseLayer.bind(parser));
	});

	test("@import", () => {
		assertNode('@import "test.css"', parser, parser._parseImport.bind(parser));
		assertNode('@import url("test.css")', parser, parser._parseImport.bind(parser));
		assertNode('@import "test.css", "bar.css"', parser, parser._parseImport.bind(parser));
		assertNode('@import "test.css", "bar.css" screen, projection', parser, parser._parseImport.bind(parser));
		assertNode(
			`foo
	@import "test.css"`,
			parser,
			parser._parseStylesheet.bind(parser),
		);

		assertError(
			'@import "test.css" "bar.css"',
			parser,
			parser._parseStylesheet.bind(parser),
			ParseError.MediaQueryExpected,
		);
		assertError('@import "test.css", screen', parser, parser._parseImport.bind(parser), ParseError.URIOrStringExpected);
		assertError("@import", parser, parser._parseImport.bind(parser), ParseError.URIOrStringExpected);
		assertNode('@import url("override.css") layer', parser, parser._parseStylesheet.bind(parser));
	});

	test("declaration", () => {
		assertNode("border: thin solid 1px", parser, parser._parseDeclaration.bind(parser));
		assertNode("dummy: $color", parser, parser._parseDeclaration.bind(parser));
		assertNode("dummy: blue", parser, parser._parseDeclaration.bind(parser));
		assertNode("dummy: (20 / $const)", parser, parser._parseDeclaration.bind(parser));
		assertNode("dummy: (20 / 20 + $const)", parser, parser._parseDeclaration.bind(parser));
		assertNode("dummy: func($red)", parser, parser._parseDeclaration.bind(parser));
		assertNode("dummy: func($red) !important", parser, parser._parseDeclaration.bind(parser));
		assertNode("dummy: desaturate($red, 10%)", parser, parser._parseDeclaration.bind(parser));
		assertNode("dummy: desaturate(16, 10%)", parser, parser._parseDeclaration.bind(parser));
		assertNode("color: $base-color + #111", parser, parser._parseDeclaration.bind(parser));
		assertNode("color: 100% / 2 + $ref", parser, parser._parseDeclaration.bind(parser));
		assertNode("border: ($width * 2) solid black", parser, parser._parseDeclaration.bind(parser));
		assertNode("property: $class", parser, parser._parseDeclaration.bind(parser));
		assertNode("prop-erty: fnc($t, 10%)", parser, parser._parseDeclaration.bind(parser));
		assertNode("width: (1em + 2em) * 3", parser, parser._parseDeclaration.bind(parser));
		assertNode("color: #010203 + #040506", parser, parser._parseDeclaration.bind(parser));
		assertNode('font-family: sans- + "serif"', parser, parser._parseDeclaration.bind(parser));
		assertNode("margin: 3px + 4px auto", parser, parser._parseDeclaration.bind(parser));
		assertNode("color: hsl(0, 100%, 50%)", parser, parser._parseDeclaration.bind(parser));
		assertNode(
			"color: hsl($hue: 0, $saturation: 100%, $lightness: 50%)",
			parser,
			parser._parseDeclaration.bind(parser),
		);
		assertNode("foo: if($value == 'default', flex-gutter(), $value)", parser, parser._parseDeclaration.bind(parser));
		assertNode("foo: if(true, !important, null)", parser, parser._parseDeclaration.bind(parser));
		assertNode("color: selector-replace(&, 1)", parser, parser._parseDeclaration.bind(parser));

		assertNode("dummy: module.$color", parser, parser._parseDeclaration.bind(parser));
		assertNode("dummy: (20 / module.$const)", parser, parser._parseDeclaration.bind(parser));
		assertNode("dummy: (20 / 20 + module.$const)", parser, parser._parseDeclaration.bind(parser));
		assertNode("dummy: module.func($red)", parser, parser._parseDeclaration.bind(parser));
		assertNode("dummy: module.func($red) !important", parser, parser._parseDeclaration.bind(parser));
		assertNode("dummy: module.desaturate($red, 10%)", parser, parser._parseDeclaration.bind(parser));
		assertNode("dummy: desaturate(module.$red, 10%)", parser, parser._parseDeclaration.bind(parser));
		assertNode("dummy: module.desaturate(module.$red, 10%)", parser, parser._parseDeclaration.bind(parser));
		assertNode("dummy: module.desaturate(16, 10%)", parser, parser._parseDeclaration.bind(parser));
		assertNode("color: module.$base-color + #111", parser, parser._parseDeclaration.bind(parser));
		assertNode("color: 100% / 2 + module.$ref", parser, parser._parseDeclaration.bind(parser));
		assertNode("border: (module.$width * 2) solid black", parser, parser._parseDeclaration.bind(parser));
		assertNode("property: module.$class", parser, parser._parseDeclaration.bind(parser));
		assertNode("prop-erty: module.fnc($t, 10%)", parser, parser._parseDeclaration.bind(parser));
		assertNode("prop-erty: fnc(module.$t, 10%)", parser, parser._parseDeclaration.bind(parser));
		assertNode("prop-erty: module.fnc(module.$t, 10%)", parser, parser._parseDeclaration.bind(parser));
		assertNode("width: (1em + 2em) * 3", parser, parser._parseDeclaration.bind(parser));
		assertNode("color: #010203 + #040506", parser, parser._parseDeclaration.bind(parser));
		assertNode('font-family: sans- + "serif"', parser, parser._parseDeclaration.bind(parser));
		assertNode("margin: 3px + 4px auto", parser, parser._parseDeclaration.bind(parser));
		assertNode("color: color.hsl(0, 100%, 50%)", parser, parser._parseDeclaration.bind(parser));
		assertNode(
			"color: color.hsl($hue: 0, $saturation: 100%, $lightness: 50%)",
			parser,
			parser._parseDeclaration.bind(parser),
		);
		assertNode(
			"foo: if(module.$value == 'default', flex-gutter(), $value)",
			parser,
			parser._parseDeclaration.bind(parser),
		);
		assertNode(
			"foo: if($value == 'default', module.flex-gutter(), $value)",
			parser,
			parser._parseDeclaration.bind(parser),
		);
		assertNode(
			"foo: if($value == 'default', flex-gutter(), module.$value)",
			parser,
			parser._parseDeclaration.bind(parser),
		);
		assertNode(
			"foo: if(module.$value == 'default', module.flex-gutter(), $value)",
			parser,
			parser._parseDeclaration.bind(parser),
		);
		assertNode(
			"foo: if($value == 'default', module.flex-gutter(), module.$value)",
			parser,
			parser._parseDeclaration.bind(parser),
		);
		assertNode(
			"foo: if(module.$value == 'default', module.flex-gutter(), module.$value)",
			parser,
			parser._parseDeclaration.bind(parser),
		);
		assertNode("color: selector.replace(&, 1)", parser, parser._parseDeclaration.bind(parser));

		assertError("fo = 8", parser, parser._parseDeclaration.bind(parser), ParseError.ColonExpected);
		assertError("fo:", parser, parser._parseDeclaration.bind(parser), ParseError.PropertyValueExpected);
		assertError("color: hsl($hue: 0,", parser, parser._parseDeclaration.bind(parser), ParseError.ExpressionExpected);
		assertError(
			"color: hsl($hue: 0",
			parser,
			parser._parseDeclaration.bind(parser),
			ParseError.RightParenthesisExpected,
		);
	});

	test("interpolation", () => {
		assertNode("--#{module.$propname}: some-value", parser, parser._parseDeclaration.bind(parser));
	});

	test("operators", () => {
		assertNode(">=", parser, parser._parseOperator.bind(parser));
		assertNode(">", parser, parser._parseOperator.bind(parser));
		assertNode("<", parser, parser._parseOperator.bind(parser));
		assertNode("<=", parser, parser._parseOperator.bind(parser));
		assertNode("==", parser, parser._parseOperator.bind(parser));
		assertNode("!=", parser, parser._parseOperator.bind(parser));
		assertNode("and", parser, parser._parseOperator.bind(parser));
		assertNode("+", parser, parser._parseOperator.bind(parser));
		assertNode("-", parser, parser._parseOperator.bind(parser));
		assertNode("*", parser, parser._parseOperator.bind(parser));
		assertNode("/", parser, parser._parseOperator.bind(parser));
		assertNode("%", parser, parser._parseOperator.bind(parser));
		assertNode("not", parser, parser._parseUnaryOperator.bind(parser));
	});

	test("expressions", () => {
		assertNode("($const + 20)", parser, parser._parseExpr.bind(parser));
		assertNode("($const - 20)", parser, parser._parseExpr.bind(parser));
		assertNode("($const * 20)", parser, parser._parseExpr.bind(parser));
		assertNode("($const / 20)", parser, parser._parseExpr.bind(parser));
		assertNode("(20 + $const)", parser, parser._parseExpr.bind(parser));
		assertNode("(20 - $const)", parser, parser._parseExpr.bind(parser));
		assertNode("(20 * $const)", parser, parser._parseExpr.bind(parser));
		assertNode("(20 / $const)", parser, parser._parseExpr.bind(parser));
		assertNode("(20 / 20 + $const)", parser, parser._parseExpr.bind(parser));
		assertNode("(20 + 20 + $const)", parser, parser._parseExpr.bind(parser));
		assertNode("(20 + 20 + 20 + $const)", parser, parser._parseExpr.bind(parser));
		assertNode("(20 + 20 + 20 + 20 + $const)", parser, parser._parseExpr.bind(parser));
		assertNode("(20 + 20 + $const + 20 + 20 + $const)", parser, parser._parseExpr.bind(parser));
		assertNode("(20 + 20)", parser, parser._parseExpr.bind(parser));
		assertNode("($var1 + $var2)", parser, parser._parseExpr.bind(parser));
		assertNode("(($const + 5) * 2)", parser, parser._parseExpr.bind(parser));
		assertNode("(($const + (5 + 2)) * 2)", parser, parser._parseExpr.bind(parser));
		assertNode("($const + ((5 + 2) * 2))", parser, parser._parseExpr.bind(parser));
		assertNode("$color", parser, parser._parseExpr.bind(parser));
		assertNode("$color, $color", parser, parser._parseExpr.bind(parser));
		assertNode("$color, 42%", parser, parser._parseExpr.bind(parser));
		assertNode("$color, 42%, $color", parser, parser._parseExpr.bind(parser));
		assertNode("$color - ($color + 10%)", parser, parser._parseExpr.bind(parser));
		assertNode("($base + $filler)", parser, parser._parseExpr.bind(parser));
		assertNode("(100% / 2 + $filler)", parser, parser._parseExpr.bind(parser));
		assertNode("100% / 2 + $filler", parser, parser._parseExpr.bind(parser));
		assertNode("not ($v and $b) or $c", parser, parser._parseExpr.bind(parser));

		assertNode("(module.$const + 20)", parser, parser._parseExpr.bind(parser));
		assertNode("(module.$const - 20)", parser, parser._parseExpr.bind(parser));
		assertNode("(module.$const * 20)", parser, parser._parseExpr.bind(parser));
		assertNode("(module.$const / 20)", parser, parser._parseExpr.bind(parser));
		assertNode("(20 + module.$const)", parser, parser._parseExpr.bind(parser));
		assertNode("(20 - module.$const)", parser, parser._parseExpr.bind(parser));
		assertNode("(20 * module.$const)", parser, parser._parseExpr.bind(parser));
		assertNode("(20 / module.$const)", parser, parser._parseExpr.bind(parser));
		assertNode("(20 + 20 + module.$const)", parser, parser._parseExpr.bind(parser));
		assertNode("(20 + 20 + 20 + module.$const)", parser, parser._parseExpr.bind(parser));
		assertNode("(20 + 20 + 20 + 20 + module.$const)", parser, parser._parseExpr.bind(parser));
		assertNode("(20 + 20 + module.$const + 20 + 20 + module.$const)", parser, parser._parseExpr.bind(parser));
		assertNode("($var1 + module.$var2)", parser, parser._parseExpr.bind(parser));
		assertNode("(module.$var1 + $var2)", parser, parser._parseExpr.bind(parser));
		assertNode("(module.$var1 + module.$var2)", parser, parser._parseExpr.bind(parser));
		assertNode("((module.$const + 5) * 2)", parser, parser._parseExpr.bind(parser));
		assertNode("((module.$const + (5 + 2)) * 2)", parser, parser._parseExpr.bind(parser));
		assertNode("(module.$const + ((5 + 2) * 2))", parser, parser._parseExpr.bind(parser));
		assertNode("module.$color", parser, parser._parseExpr.bind(parser));
		assertNode("module.$color, $color", parser, parser._parseExpr.bind(parser));
		assertNode("$color, module.$color", parser, parser._parseExpr.bind(parser));
		assertNode("module.$color, module.$color", parser, parser._parseExpr.bind(parser));
		assertNode("module.$color, 42%", parser, parser._parseExpr.bind(parser));
		assertNode("module.$color, 42%, $color", parser, parser._parseExpr.bind(parser));
		assertNode("$color, 42%, module.$color", parser, parser._parseExpr.bind(parser));
		assertNode("module.$color, 42%, module.$color", parser, parser._parseExpr.bind(parser));
		assertNode("module.$color - ($color + 10%)", parser, parser._parseExpr.bind(parser));
		assertNode("$color - (module.$color + 10%)", parser, parser._parseExpr.bind(parser));
		assertNode("module.$color - (module.$color + 10%)", parser, parser._parseExpr.bind(parser));
		assertNode("(module.$base + $filler)", parser, parser._parseExpr.bind(parser));
		assertNode("($base + module.$filler)", parser, parser._parseExpr.bind(parser));
		assertNode("(module.$base + module.$filler)", parser, parser._parseExpr.bind(parser));
		assertNode("(100% / 2 + module.$filler)", parser, parser._parseExpr.bind(parser));
		assertNode("100% / 2 + module.$filler", parser, parser._parseExpr.bind(parser));
		assertNode("not (module.$v and $b) or $c", parser, parser._parseExpr.bind(parser));
		assertNode("not ($v and module.$b) or $c", parser, parser._parseExpr.bind(parser));
		assertNode("not ($v and $b) or module.$c", parser, parser._parseExpr.bind(parser));
		assertNode("not (module.$v and module.$b) or $c", parser, parser._parseExpr.bind(parser));
		assertNode("not (module.$v and $b) or module.$c", parser, parser._parseExpr.bind(parser));
		assertNode("not ($v and module.$b) or module.$c", parser, parser._parseExpr.bind(parser));
		assertNode("not (module.$v and module.$b) or module.$c", parser, parser._parseExpr.bind(parser));
		assertNode("not module.$v", parser, parser._parseExpr.bind(parser));

		assertError("(20 + 20", parser, parser._parseExpr.bind(parser), ParseError.RightParenthesisExpected);
	});

	test("variable declaration", () => {
		assertNode("$color: #F5F5F5", parser, parser._parseVariableDeclaration.bind(parser));
		assertNode("$color: 0", parser, parser._parseVariableDeclaration.bind(parser));
		assertNode("$color: 255", parser, parser._parseVariableDeclaration.bind(parser));
		assertNode("$color: 25.5", parser, parser._parseVariableDeclaration.bind(parser));
		assertNode("$color: 25px", parser, parser._parseVariableDeclaration.bind(parser));
		assertNode("$color: 25.5px !default", parser, parser._parseVariableDeclaration.bind(parser));
		assertNode("$text-color: green !global", parser, parser._parseVariableDeclaration.bind(parser));
		assertNode(
			'$_RESOURCES: append($_RESOURCES, "clean") !global',
			parser,
			parser._parseVariableDeclaration.bind(parser),
		);
		assertNode("$footer-height: 40px !default !global", parser, parser._parseVariableDeclaration.bind(parser));
		assertNode(
			'$primary-font: "wf_SegoeUI","Segoe UI","Segoe","Segoe WP"',
			parser,
			parser._parseVariableDeclaration.bind(parser),
		);
		assertNode("$color: red !important", parser, parser._parseVariableDeclaration.bind(parser));

		assertError("$color: red !def", parser, parser._parseVariableDeclaration.bind(parser), ParseError.UnknownKeyword);
		assertError(
			"$color : !default",
			parser,
			parser._parseVariableDeclaration.bind(parser),
			ParseError.VariableValueExpected,
		);
		assertError("$color !default", parser, parser._parseVariableDeclaration.bind(parser), ParseError.ColonExpected);
	});

	test("variable", () => {
		assertNode("$color", parser, parser._parseVariable.bind(parser));
		assertNode("$co42lor", parser, parser._parseVariable.bind(parser));
		assertNode("$-co42lor", parser, parser._parseVariable.bind(parser));
	});

	test("module variable", () => {
		assertNode("module.$color", parser, parser._parseModuleMember.bind(parser));
		assertNode("module.$co42lor", parser, parser._parseModuleMember.bind(parser));
		assertNode("module.$-co42lor", parser, parser._parseModuleMember.bind(parser));
		assertNode("module.function()", parser, parser._parseModuleMember.bind(parser));

		assertError("module.", parser, parser._parseModuleMember.bind(parser), ParseError.IdentifierOrVariableExpected);
	});
});
