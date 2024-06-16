/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
"use strict";

import { suite, test, assert } from "vitest";

import * as nodes from "../../parser/cssNodes";
import {
	assertScopesAndSymbols,
	assertHighlights,
	assertColorSymbols,
	assertLinks,
	newRange,
	getTestResource,
	assertDocumentSymbols,
	createScope,
} from "../css/navigation.test";
import {
	getSassLanguageService,
	TextDocument,
	SymbolKind,
	LanguageSettings,
	StylesheetDocumentLink,
	Range,
	Position,
} from "../../cssLanguageService";
import * as path from "path";
import { URI } from "vscode-uri";
import { getFsProvider } from "../testUtil/fsProvider";
import { getDocumentContext } from "../testUtil/documentContext";

function getSCSSLS() {
	return getSassLanguageService({ fileSystemProvider: getFsProvider() });
}

function aliasSettings(): LanguageSettings {
	return {
		importAliases: {
			"@SassStylesheet": "/src/assets/styles.scss",
			"@NoUnderscoreDir/": "/noUnderscore/",
			"@UnderscoreDir/": "/underscore/",
			"@BothDir/": "/both/",
		},
	};
}

export async function assertDynamicLinks(
	docUri: string,
	input: string,
	expected: StylesheetDocumentLink[],
	settings?: LanguageSettings,
) {
	const ls = getSCSSLS();
	if (settings) {
		ls.configure(settings);
	}
	const document = TextDocument.create(docUri, docUri.endsWith(".sass") ? "sass" : "scss", 0, input);

	const stylesheet = ls.parseStylesheet(document);

	const links = await ls.findDocumentLinks2(document, stylesheet, getDocumentContext(document.uri));
	assert.deepEqual(links, expected);
}

export async function assertNoDynamicLinks(docUri: string, input: string, extecedTarget: string | undefined) {
	const ls = getSCSSLS();
	const document = TextDocument.create(docUri, docUri.endsWith(".sass") ? "sass" : "scss", 0, input);

	const stylesheet = ls.parseStylesheet(document);

	const links = await ls.findDocumentLinks2(document, stylesheet, getDocumentContext(document.uri));
	if (extecedTarget) {
		assert.deepEqual(links.length, 1, `${docUri.toString()} should only return itself`);
		assert.deepEqual(links[0].target, extecedTarget, `${docUri.toString()} should only return itself`);
	} else {
		assert.deepEqual(links.length, 0, `${docUri.toString()} hould have no link`);
	}
}

export function assertSymbolsInScope(
	lang: "scss" | "sass",
	input: string,
	offset: number,
	...selections: { name: string; type: nodes.ReferenceType }[]
): void {
	const ls = getSCSSLS();
	const global = createScope(ls, input, lang);

	const scope = global.findScope(offset)!;

	const getErrorMessage = function (name: string) {
		let all = "symbol " + name + " not found. In scope: ";
		scope.getSymbols().forEach((sym) => {
			all += sym.name + " ";
		});
		return all;
	};

	for (let i = 0; i < selections.length; i++) {
		const selection = selections[i];
		const sym = scope.getSymbol(selection.name, selection.type) || global.getSymbol(selection.name, selection.type);
		assert.ok(!!sym, getErrorMessage(selection.name));
	}
}

suite("SCSS - Navigation", () => {
	suite("Scopes and Symbols", () => {
		test("symbols in scopes", () => {
			const ls = getSCSSLS();
			assertSymbolsInScope("scss", "$var: iable;", 0, { name: "$var", type: nodes.ReferenceType.Variable });
			assertSymbolsInScope("scss", "$var: iable;", 11, { name: "$var", type: nodes.ReferenceType.Variable });
			assertSymbolsInScope(
				"scss",
				"$var: iable; .class { $color: blue; }",
				11,
				{ name: "$var", type: nodes.ReferenceType.Variable },
				{ name: ".class", type: nodes.ReferenceType.Rule },
			);
			assertSymbolsInScope("scss", "$var: iable; .class { $color: blue; }", 22, {
				name: "$color",
				type: nodes.ReferenceType.Variable,
			});
			assertSymbolsInScope("scss", "$var: iable; .class { $color: blue; }", 36, {
				name: "$color",
				type: nodes.ReferenceType.Variable,
			});

			assertSymbolsInScope("scss", '@namespace "x"; @mixin mix() {}', 0, {
				name: "mix",
				type: nodes.ReferenceType.Mixin,
			});
			assertSymbolsInScope("scss", "@mixin mix { @mixin nested() {} }", 12, {
				name: "nested",
				type: nodes.ReferenceType.Mixin,
			});
			assertSymbolsInScope("scss", "@mixin mix () { @mixin nested() {} }", 13);
		});

		test("Sass symbols in scopes", () => {
			assertSymbolsInScope("sass", "$var: iable", 0, { name: "$var", type: nodes.ReferenceType.Variable });
			assertSymbolsInScope("sass", "$var: iable", 11, { name: "$var", type: nodes.ReferenceType.Variable });
			assertSymbolsInScope(
				"sass",
				`$var: iable
.class
	$color: blue`,
				11,
				{ name: "$var", type: nodes.ReferenceType.Variable },
				{ name: ".class", type: nodes.ReferenceType.Rule },
			);
			assertSymbolsInScope(
				"sass",
				`$var: iable
.class
	$color: blue`,
				22,
				{
					name: "$color",
					type: nodes.ReferenceType.Variable,
				},
			);
			assertSymbolsInScope(
				"sass",
				`$var: iable
.class
	$color: blue`,
				32,
				{
					name: "$color",
					type: nodes.ReferenceType.Variable,
				},
			);

			assertSymbolsInScope(
				"sass",
				`@namespace "x"
@mixin mix()
	content: "hello"`,
				0,
				{
					name: "mix",
					type: nodes.ReferenceType.Mixin,
				},
			);
			assertSymbolsInScope(
				"sass",
				`@mixin mix
	@mixin nested()
		content: "hello"`,
				12,
				{
					name: "nested",
					type: nodes.ReferenceType.Mixin,
				},
			);
			assertSymbolsInScope(
				"sass",
				`@mixin mix()
	@mixin nested()
		content: "hello"`,
				13,
			);
		});

		test("scopes and symbols", () => {
			const ls = getSCSSLS();
			assertScopesAndSymbols(ls, "$var1: 1; $var2: 2; .foo { $var3: 3; }", "$var1,$var2,.foo,[$var3]", "scss");
			assertScopesAndSymbols(
				ls,
				"@mixin mixin1 { $var0: 1} @mixin mixin2($var1) { $var3: 3 }",
				"mixin1,mixin2,[$var0],[$var1,$var3]",
				"scss",
			);
			assertScopesAndSymbols(ls, "a b { $var0: 1; c { d { } } }", "[$var0,c,[d,[]]]", "scss");
			assertScopesAndSymbols(ls, "@function a($p1: 1, $p2: 2) { $v1: 3; @return $v1; }", "a,[$p1,$p2,$v1]", "scss");
			assertScopesAndSymbols(
				ls,
				"$var1: 3; @if $var1 == 2 { $var2: 1; } @else { $var2: 2; $var3: 2;} ",
				"$var1,[$var2],[$var2,$var3]",
				"scss",
			);
			assertScopesAndSymbols(
				ls,
				"@if $var1 == 2 { $var2: 1; } @else if $var1 == 2 { $var3: 2; } @else { $var3: 2; } ",
				"[$var2],[$var3],[$var3]",
				"scss",
			);
			assertScopesAndSymbols(ls, "$var1: 3; @while $var1 < 2 { #rule { a: b; } }", "$var1,[#rule,[]]", "scss");
			assertScopesAndSymbols(ls, "$i:0; @each $name in f1, f2, f3  { $i:$i+1; }", "$i,[$name,$i]", "scss");
			assertScopesAndSymbols(ls, "$i:0; @for $x from $i to 5  { }", "$i,[$x]", "scss");
			assertScopesAndSymbols(ls, "@each $i, $j, $k in f1, f2, f3  { }", "[$i,$j,$k]", "scss");
		});

		test("Sass scopes and symbols", () => {
			const ls = getSCSSLS();
			assertScopesAndSymbols(
				ls,
				`$var1: 1
$var2: 2
.foo
	$var3: 3`,
				"$var1,$var2,.foo,[$var3]",
				"sass",
			);
			assertScopesAndSymbols(
				ls,
				`@mixin mixin1
	$var0: 1
@mixin mixin2($var1)
	$var3: 3`,
				"mixin1,mixin2,[$var0],[$var1,$var3]",
				"sass",
			);
			assertScopesAndSymbols(
				ls,
				`a b
	$var0: 1
	c
		d
			//`,
				"[$var0,c,[d,[]]]",
				"sass",
			);
			assertScopesAndSymbols(
				ls,
				`@function a($p1: 1, $p2: 2)
	$v1: 3
	@return $v1`,
				"a,[$p1,$p2,$v1]",
				"sass",
			);
			assertScopesAndSymbols(
				ls,
				`$var1: 3
@if $var1 == 2
	$var2: 1
@else
	$var2: 2
	$var3: 2`,
				"$var1,[$var2],[$var2,$var3]",
				"sass",
			);
			assertScopesAndSymbols(
				ls,
				`@if $var1 == 2
	$var2: 1
@else if $var1 == 2
	$var3: 2
@else
	$var3: 2`,
				"[$var2],[$var3],[$var3]",
				"sass",
			);
			assertScopesAndSymbols(
				ls,
				`$var1: 3
@while $var1 < 2
	#rule
		a: b`,
				"$var1,[#rule,[]]",
				"sass",
			);
			assertScopesAndSymbols(
				ls,
				`$i:0
@each $name in f1, f2, f3
	$i:$i+1`,
				"$i,[$name,$i]",
				"sass",
			);
			assertScopesAndSymbols(
				ls,
				`$i:0
@for $x from $i to 5
	//`,
				"$i,[$x]",
				"sass",
			);
			assertScopesAndSymbols(
				ls,
				`@each $i, $j, $k in f1, f2, f3
	//`,
				"[$i,$j,$k]",
				"sass",
			);
		});
	});

	suite("Highlight", () => {
		test("mark highlights", () => {
			const ls = getSCSSLS();

			assertHighlights(ls, "$var1: 1; $var2: /**/$var1;", "$var1", 2, 1);
			assertHighlights(ls, "$var1: 1; ls { $var2: /**/$var1; }", "/**/", 2, 1, "$var1");
			assertHighlights(
				ls,
				"r1 { $var1: 1; p1: $var1;} r2,r3 { $var1: 1; p1: /**/$var1 + $var1;}",
				"/**/",
				3,
				1,
				"$var1",
			);
			assertHighlights(ls, ".r1 { r1: 1em; } r2 { r1: 2em; @extend /**/.r1;}", "/**/", 2, 1, ".r1");
			assertHighlights(ls, "/**/%r1 { r1: 1em; } r2 { r1: 2em; @extend %r1;}", "/**/", 2, 1, "%r1");
			assertHighlights(ls, "@mixin r1 { r1: $p1; } r2 { r2: 2em; @include /**/r1; }", "/**/", 2, 1, "r1");
			assertHighlights(ls, "@mixin r1($p1) { r1: $p1; } r2 { r2: 2em; @include /**/r1(2px); }", "/**/", 2, 1, "r1");
			assertHighlights(
				ls,
				"$p1: 1; @mixin r1($p1: $p1) { r1: $p1; } r2 { r2: 2em; @include /**/r1; }",
				"/**/",
				2,
				1,
				"r1",
			);
			assertHighlights(ls, "/**/$p1: 1; @mixin r1($p1: $p1) { r1: $p1; }", "/**/", 2, 1, "$p1");
			assertHighlights(ls, "$p1 : 1; @mixin r1($p1) { r1: /**/$p1; }", "/**/", 2, 1, "$p1");
			assertHighlights(ls, "/**/$p1 : 1; @mixin r1($p1) { r1: $p1; }", "/**/", 1, 1, "$p1");
			assertHighlights(ls, "$p1 : 1; @mixin r1(/**/$p1) { r1: $p1; }", "/**/", 2, 1, "$p1");
			assertHighlights(
				ls,
				"$p1 : 1; @function r1($p1, $p2: /**/$p1) { @return $p1 + $p1 + $p2; }",
				"/**/",
				2,
				1,
				"$p1",
			);
			assertHighlights(
				ls,
				"$p1 : 1; @function r1($p1, /**/$p2: $p1) { @return $p1 + $p2 + $p2; }",
				"/**/",
				3,
				1,
				"$p2",
			);
			assertHighlights(
				ls,
				"@function r1($p1, $p2) { @return $p1 + $p2; } @function r2() { @return /**/r1(1, 2); }",
				"/**/",
				2,
				1,
				"r1",
			);
			assertHighlights(
				ls,
				"@function /**/r1($p1, $p2) { @return $p1 + $p2; } @function r2() { @return r1(1, 2); } ls { x: r2(); }",
				"/**/",
				2,
				1,
				"r1",
			);
			assertHighlights(
				ls,
				"@function r1($p1, $p2) { @return $p1 + $p2; } @function r2() { @return r1(/**/$p1 : 1, $p2 : 2); } ls { x: r2(); }",
				"/**/",
				3,
				1,
				"$p1",
			);

			assertHighlights(ls, "@mixin /*here*/foo { display: inline } foo { @include foo; }", "/*here*/", 2, 1, "foo");
			assertHighlights(ls, "@mixin foo { display: inline } foo { @include /*here*/foo; }", "/*here*/", 2, 1, "foo");
			assertHighlights(ls, "@mixin foo { display: inline } /*here*/foo { @include foo; }", "/*here*/", 1, 1, "foo");
			assertHighlights(
				ls,
				"@function /*here*/foo($i) { @return $i*$i; } #foo { width: foo(2); }",
				"/*here*/",
				2,
				1,
				"foo",
			);
			assertHighlights(
				ls,
				"@function foo($i) { @return $i*$i; } #foo { width: /*here*/foo(2); }",
				"/*here*/",
				2,
				1,
				"foo",
			);

			assertHighlights(
				ls,
				".text { @include mixins.responsive using ($multiplier) { font-size: /*here*/$multiplier * 10px; } }",
				"/*here*/$",
				2,
				1,
				"$multiplier",
			);
		});

		test("Sass mark highlights", () => {
			const ls = getSCSSLS();

			assertHighlights(ls, "$var1: 1\n$var2: /**/$var1", "$var1", 2, 1, undefined, "sass");
			assertHighlights(
				ls,
				`$var1: 1
ls
	$var2: /**/$var1`,
				"/**/",
				2,
				1,
				"$var1",
				"sass",
			);
			assertHighlights(
				ls,
				`r1
	$var1: 1
	p1: $var1
r2,r3
	$var1: 1
	p1: /**/$var1 + $var1`,
				"/**/",
				3,
				1,
				"$var1",
				"sass",
			);
			assertHighlights(
				ls,
				`.r1
	r1: 1em
r2
	r1: 2em
	@extend /**/.r1`,
				"/**/",
				2,
				1,
				".r1",
				"sass",
			);
			assertHighlights(
				ls,
				`/**/%r1
	r1: 1em
r2
	r1: 2em
	@extend %r1`,
				"/**/",
				2,
				1,
				"%r1",
				"sass",
			);
			assertHighlights(
				ls,
				`@mixin r1
	r1: $p1
r2
	r2: 2em
	@include /**/r1`,
				"/**/",
				2,
				1,
				"r1",
				"sass",
			);
			assertHighlights(
				ls,
				`@mixin r1($p1)
	r1: $p1
r2
	r2: 2em
	@include /**/r1(2px)`,
				"/**/",
				2,
				1,
				"r1",
				"sass",
			);
			assertHighlights(
				ls,
				`$p1: 1
@mixin r1($p1: $p1)
	r1: $p1
r2
	r2: 2em
	@include /**/r1`,
				"/**/",
				2,
				1,
				"r1",
				"sass",
			);
			assertHighlights(
				ls,
				`/**/$p1: 1
@mixin r1($p1: $p1)
	r1: $p1`,
				"/**/",
				2,
				1,
				"$p1",
				"sass",
			);
			assertHighlights(
				ls,
				`$p1 : 1
@mixin r1($p1)
	r1: /**/$p1`,
				"/**/",
				2,
				1,
				"$p1",
				"sass",
			);
			assertHighlights(
				ls,
				`/**/$p1 : 1
@mixin r1($p1)
	r1: $p1
`,
				"/**/",
				1,
				1,
				"$p1",
				"sass",
			);
			assertHighlights(
				ls,
				`$p1 : 1
@mixin r1(/**/$p1)
	r1: $p1`,
				"/**/",
				2,
				1,
				"$p1",
				"sass",
			);
			assertHighlights(
				ls,
				`$p1 : 1
@function r1($p1, $p2: /**/$p1)
	@return $p1 + $p1 + $p2`,
				"/**/",
				2,
				1,
				"$p1",
				"sass",
			);
			assertHighlights(
				ls,
				`$p1 : 1
@function r1($p1, /**/$p2: $p1)
	@return $p1 + $p2 + $p2`,
				"/**/",
				3,
				1,
				"$p2",
				"sass",
			);
			assertHighlights(
				ls,
				`@function r1($p1, $p2)
	@return $p1 + $p2
@function r2()
	@return /**/r1(1, 2)`,
				"/**/",
				2,
				1,
				"r1",
				"sass",
			);
			assertHighlights(
				ls,
				`@function /**/r1($p1, $p2)
	@return $p1 + $p2
@function r2()
	@return r1(1, 2)
ls
	x: r2()`,
				"/**/",
				2,
				1,
				"r1",
				"sass",
			);
			assertHighlights(
				ls,
				`@function r1($p1, $p2)
	@return $p1 + $p2
@function r2()
	@return r1(/**/$p1 : 1, $p2 : 2)
ls
	x: r2()`,
				"/**/",
				3,
				1,
				"$p1",
				"sass",
			);

			assertHighlights(
				ls,
				`@mixin /*here*/foo
	display: inline
foo
	@include foo`,
				"/*here*/",
				2,
				1,
				"foo",
				"sass",
			);
			assertHighlights(
				ls,
				`@mixin foo
	display: inline
foo
	@include /*here*/foo`,
				"/*here*/",
				2,
				1,
				"foo",
				"sass",
			);
			assertHighlights(
				ls,
				`@mixin foo
	display: inline
/*here*/foo
	@include foo`,
				"/*here*/",
				1,
				1,
				"foo",
				"sass",
			);
			assertHighlights(
				ls,
				`@function /*here*/foo($i)
	@return $i*$i
#foo
	width: foo(2)`,
				"/*here*/",
				2,
				1,
				"foo",
				"sass",
			);
			assertHighlights(
				ls,
				`@function foo($i)
	@return $i*$i
#foo
	width: /*here*/foo(2)`,
				"/*here*/",
				2,
				1,
				"foo",
				"sass",
			);

			assertHighlights(
				ls,
				`.text
	@include mixins.responsive using ($multiplier)
		font-size: /*here*/$multiplier * 10px`,
				"/*here*/$",
				2,
				1,
				"$multiplier",
				"sass",
			);
		});
	});

	suite("Links", () => {
		// For invalid links that have no corresponding file on disk, return no link
		test("Invalid SCSS partial file links", async () => {
			const fixtureRoot = path.resolve(__dirname, "../../../src/test/sass/linkFixture/non-existent");
			const getDocumentUri = (relativePath: string) => {
				return URI.file(path.resolve(fixtureRoot, relativePath)).toString(true);
			};

			await assertNoDynamicLinks(getDocumentUri("./index.scss"), `@import 'foo'`, getDocumentUri("foo"));
			await assertNoDynamicLinks(getDocumentUri("./index.scss"), `@import './foo'`, getDocumentUri("foo"));
			await assertNoDynamicLinks(getDocumentUri("./index.scss"), `@import './_foo'`, getDocumentUri("_foo"));
			await assertNoDynamicLinks(getDocumentUri("./index.scss"), `@import './foo-baz'`, getDocumentUri("foo-baz"));
		});

		test("Invalid Sass partial file links", async () => {
			const fixtureRoot = path.resolve(__dirname, "../../../src/test/sass/linkFixture/non-existent");
			const getDocumentUri = (relativePath: string) => {
				return URI.file(path.resolve(fixtureRoot, relativePath)).toString(true);
			};

			await assertNoDynamicLinks(getDocumentUri("./index.sass"), `@import 'foo'`, getDocumentUri("foo"));
			await assertNoDynamicLinks(getDocumentUri("./index.sass"), `@import './foo'`, getDocumentUri("foo"));
			await assertNoDynamicLinks(getDocumentUri("./index.sass"), `@import './_foo'`, getDocumentUri("_foo"));
			await assertNoDynamicLinks(getDocumentUri("./index.sass"), `@import './foo-baz'`, getDocumentUri("foo-baz"));
		});

		test("SCSS partial file dynamic links", async () => {
			const fixtureRoot = path.resolve(__dirname, "../../../src/test/sass/linkFixture");
			const getDocumentUri = (relativePath: string) => {
				return URI.file(path.resolve(fixtureRoot, relativePath)).toString(true);
			};

			await assertDynamicLinks(getDocumentUri("./noUnderscore/index.scss"), `@import 'foo'`, [
				{ range: newRange(8, 13), target: getDocumentUri("./noUnderscore/foo.scss"), type: nodes.NodeType.Import },
			]);
			await assertDynamicLinks(getDocumentUri("./underscore/index.scss"), `@import 'foo'`, [
				{ range: newRange(8, 13), target: getDocumentUri("./underscore/_foo.scss"), type: nodes.NodeType.Import },
			]);
			await assertDynamicLinks(getDocumentUri("./underscore/index.scss"), `@import 'foo.scss'`, [
				{ range: newRange(8, 18), target: getDocumentUri("./underscore/_foo.scss"), type: nodes.NodeType.Import },
			]);
			await assertDynamicLinks(getDocumentUri("./both/index.scss"), `@import 'foo'`, [
				{ range: newRange(8, 13), target: getDocumentUri("./both/foo.scss"), type: nodes.NodeType.Import },
			]);
			await assertDynamicLinks(getDocumentUri("./both/index.scss"), `@import '_foo'`, [
				{ range: newRange(8, 14), target: getDocumentUri("./both/_foo.scss"), type: nodes.NodeType.Import },
			]);
			await assertDynamicLinks(getDocumentUri("./index/index.scss"), `@import 'foo'`, [
				{ range: newRange(8, 13), target: getDocumentUri("./index/foo/index.scss"), type: nodes.NodeType.Import },
			]);
			await assertDynamicLinks(getDocumentUri("./index/index.scss"), `@import 'bar'`, [
				{ range: newRange(8, 13), target: getDocumentUri("./index/bar/_index.scss"), type: nodes.NodeType.Import },
			]);
		});

		test("Sass partial file dynamic links", async () => {
			const fixtureRoot = path.resolve(__dirname, "../../../src/test/sass/linkFixture");
			const getDocumentUri = (relativePath: string) => {
				return URI.file(path.resolve(fixtureRoot, relativePath)).toString(true);
			};

			await assertDynamicLinks(getDocumentUri("./underscore/index.sass"), `@import 'bar'`, [
				{ range: newRange(8, 13), target: getDocumentUri("./underscore/_bar.sass"), type: nodes.NodeType.Import },
			]);
			await assertDynamicLinks(getDocumentUri("./underscore/index.sass"), `@import 'bar.sass'`, [
				{ range: newRange(8, 18), target: getDocumentUri("./underscore/_bar.sass"), type: nodes.NodeType.Import },
			]);
			await assertDynamicLinks(getDocumentUri("./both/index.sass"), `@import 'bar'`, [
				{ range: newRange(8, 13), target: getDocumentUri("./both/bar.sass"), type: nodes.NodeType.Import },
			]);
			await assertDynamicLinks(getDocumentUri("./both/index.sass"), `@import '_bar'`, [
				{ range: newRange(8, 14), target: getDocumentUri("./both/_bar.sass"), type: nodes.NodeType.Import },
			]);
			await assertDynamicLinks(getDocumentUri("./indented-index/index.sass"), `@import "foo"`, [
				{
					range: newRange(8, 13),
					target: getDocumentUri("./indented-index/foo/index.sass"),
					type: nodes.NodeType.Import,
				},
			]);
			await assertDynamicLinks(getDocumentUri("./indented-index/index.sass"), `@import "bar"`, [
				{
					range: newRange(8, 13),
					target: getDocumentUri("./indented-index/bar/_index.sass"),
					type: nodes.NodeType.Import,
				},
			]);
		});

		test("SCSS straight links", async () => {
			const ls = getSCSSLS();

			await assertLinks(
				ls,
				`@import 'foo.css'`,
				[{ range: newRange(8, 17), target: "test://test/foo.css", type: nodes.NodeType.Import }],
				"scss",
			);
			await assertLinks(ls, `@import 'foo.scss' print;`, [
				{ range: newRange(8, 18), target: "test://test/foo.scss", type: nodes.NodeType.Import },
			]);
			await assertLinks(
				ls,
				`@import 'http://foo.com/foo.css'`,
				[{ range: newRange(8, 32), target: "http://foo.com/foo.css", type: nodes.NodeType.Import }],
				"scss",
			);
			await assertLinks(ls, `@import url("foo.css") print;`, [
				{ range: newRange(12, 21), target: "test://test/foo.css" },
			]);
		});

		test("Sass straight links", async () => {
			const ls = getSCSSLS();

			await assertLinks(
				ls,
				`@import 'foo.css'`,
				[{ range: newRange(8, 17), target: "test://test/foo.css", type: nodes.NodeType.Import }],
				"sass",
			);
			await assertLinks(ls, `@import 'foo.sass' print`, [
				{ range: newRange(8, 18), target: "test://test/foo.sass", type: nodes.NodeType.Import },
			]);
			await assertLinks(
				ls,
				`@import 'http://foo.com/foo.css'`,
				[{ range: newRange(8, 32), target: "http://foo.com/foo.css", type: nodes.NodeType.Import }],
				"sass",
			);
			await assertLinks(
				ls,
				`@import url("foo.css") print`,
				[{ range: newRange(12, 21), target: "test://test/foo.css" }],
				"sass",
			);
		});

		test("SCSS aliased links", async function () {
			const fixtureRoot = path.resolve(__dirname, "../../../src/test/sass/linkFixture");
			const getDocumentUri = (relativePath: string) => {
				return URI.file(path.resolve(fixtureRoot, relativePath)).toString(true);
			};

			const settings = aliasSettings();
			const ls = getSCSSLS();
			ls.configure(settings);

			await assertLinks(ls, '@import "@SassStylesheet"', [
				{ range: newRange(8, 25), target: "test://test/src/assets/styles.scss", type: nodes.NodeType.Import },
			]);

			await assertDynamicLinks(
				getDocumentUri("./"),
				`@import '@NoUnderscoreDir/foo'`,
				[{ range: newRange(8, 30), target: getDocumentUri("./noUnderscore/foo.scss"), type: nodes.NodeType.Import }],
				settings,
			);

			await assertDynamicLinks(
				getDocumentUri("./"),
				`@import '@UnderscoreDir/foo'`,
				[{ range: newRange(8, 28), target: getDocumentUri("./underscore/_foo.scss"), type: nodes.NodeType.Import }],
				settings,
			);

			await assertDynamicLinks(
				getDocumentUri("./"),
				`@import '@BothDir/foo'`,
				[{ range: newRange(8, 22), target: getDocumentUri("./both/foo.scss"), type: nodes.NodeType.Import }],
				settings,
			);

			await assertDynamicLinks(
				getDocumentUri("./"),
				`@import '@BothDir/_foo'`,
				[{ range: newRange(8, 23), target: getDocumentUri("./both/_foo.scss"), type: nodes.NodeType.Import }],
				settings,
			);
		});

		test("Sass aliased links", async function () {
			const fixtureRoot = path.resolve(__dirname, "../../../src/test/sass/linkFixture");
			const getDocumentUri = (relativePath: string) => {
				return URI.file(path.resolve(fixtureRoot, relativePath)).toString(true);
			};

			const settings: LanguageSettings = {
				importAliases: {
					"@SassStylesheet": "/src/assets/styles.sass",
					"@NoUnderscoreDir/": "/noUnderscore/",
					"@UnderscoreDir/": "/underscore/",
					"@BothDir/": "/both/",
				},
			};
			const ls = getSCSSLS();
			ls.configure(settings);

			await assertLinks(ls, '@import "@SassStylesheet"', [
				{ range: newRange(8, 25), target: "test://test/src/assets/styles.sass", type: nodes.NodeType.Import },
			]);
			await assertDynamicLinks(
				getDocumentUri("./"),
				`@import '@NoUnderscoreDir/bar'`,
				[{ range: newRange(8, 30), target: getDocumentUri("./noUnderscore/bar.sass"), type: nodes.NodeType.Import }],
				settings,
			);
			await assertDynamicLinks(
				getDocumentUri("./"),
				`@import '@UnderscoreDir/bar'`,
				[{ range: newRange(8, 28), target: getDocumentUri("./underscore/_bar.sass"), type: nodes.NodeType.Import }],
				settings,
			);
			await assertDynamicLinks(
				getDocumentUri("./"),
				`@import '@BothDir/bar'`,
				[{ range: newRange(8, 22), target: getDocumentUri("./both/bar.sass"), type: nodes.NodeType.Import }],
				settings,
			);
			await assertDynamicLinks(
				getDocumentUri("./"),
				`@import '@BothDir/_bar'`,
				[{ range: newRange(8, 23), target: getDocumentUri("./both/_bar.sass"), type: nodes.NodeType.Import }],
				settings,
			);
		});

		test("SCSS module file links", async () => {
			const fixtureRoot = path.resolve(__dirname, "../../../src/test/sass/linkFixture/module");
			const getDocumentUri = (relativePath: string) => {
				return URI.file(path.resolve(fixtureRoot, relativePath)).toString(true);
			};

			await assertDynamicLinks(getDocumentUri("./index.scss"), `@use './foo' as f;`, [
				{
					range: newRange(5, 12),
					target: getDocumentUri("./foo.scss"),
					type: nodes.NodeType.Use,
					as: "f",
					namespace: "f",
				},
			]);
			await assertDynamicLinks(getDocumentUri("./index.scss"), `@use 'sass:math' as *;`, [
				{ range: newRange(5, 16), type: nodes.NodeType.Use, as: "*", target: "sass:math" },
			]);
			await assertDynamicLinks(getDocumentUri("./index.scss"), `@forward './foo' hide $private;`, [
				{
					range: newRange(9, 16),
					target: getDocumentUri("./foo.scss"),
					type: nodes.NodeType.Forward,
					hide: ["$private"],
				},
			]);
			await assertDynamicLinks(getDocumentUri("./index.scss"), `@forward './foo' show $public;`, [
				{
					range: newRange(9, 16),
					target: getDocumentUri("./foo.scss"),
					type: nodes.NodeType.Forward,
					show: ["$public"],
				},
			]);
			await assertDynamicLinks(getDocumentUri("./index.scss"), `@forward './foo' as foo-*;`, [
				{
					range: newRange(9, 16),
					target: getDocumentUri("./foo.scss"),
					type: nodes.NodeType.Forward,
					as: "foo-",
				},
			]);
			await assertDynamicLinks(getDocumentUri("./index.scss"), `@forward './foo' as foo-* hide $private;`, [
				{
					range: newRange(9, 16),
					target: getDocumentUri("./foo.scss"),
					type: nodes.NodeType.Forward,
					as: "foo-",
					hide: ["$private"],
				},
			]);
			await assertDynamicLinks(getDocumentUri("./index.scss"), `@use 'sass:math';`, [
				{ range: newRange(5, 16), type: nodes.NodeType.Use, namespace: "math", target: "sass:math" },
			]);
			await assertNoDynamicLinks(
				getDocumentUri("./index.scss"),
				`@use './non-existent'`,
				getDocumentUri("non-existent"),
			);
		});

		test("Sass module file links", async () => {
			const fixtureRoot = path.resolve(__dirname, "../../../src/test/sass/linkFixture/module");
			const getDocumentUri = (relativePath: string) => {
				return URI.file(path.resolve(fixtureRoot, relativePath)).toString(true);
			};

			await assertDynamicLinks(getDocumentUri("./index.sass"), `@use './bar' as f`, [
				{
					range: newRange(5, 12),
					target: getDocumentUri("./bar.sass"),
					type: nodes.NodeType.Use,
					as: "f",
					namespace: "f",
				},
			]);
			await assertDynamicLinks(getDocumentUri("./index.sass"), `@use 'sass:math' as *`, [
				{ range: newRange(5, 16), type: nodes.NodeType.Use, as: "*", target: "sass:math" },
			]);
			await assertDynamicLinks(getDocumentUri("./index.sass"), `@forward './bar' hide $private`, [
				{
					range: newRange(9, 16),
					target: getDocumentUri("./bar.sass"),
					type: nodes.NodeType.Forward,
					hide: ["$private"],
				},
			]);
			await assertDynamicLinks(getDocumentUri("./index.sass"), `@forward './bar' show $public`, [
				{
					range: newRange(9, 16),
					target: getDocumentUri("./bar.sass"),
					type: nodes.NodeType.Forward,
					show: ["$public"],
				},
			]);
			await assertDynamicLinks(getDocumentUri("./index.sass"), `@forward './bar' as bar-*`, [
				{
					range: newRange(9, 16),
					target: getDocumentUri("./bar.sass"),
					type: nodes.NodeType.Forward,
					as: "bar-",
				},
			]);
			await assertDynamicLinks(getDocumentUri("./index.sass"), `@forward './bar' as bar-* hide $private`, [
				{
					range: newRange(9, 16),
					target: getDocumentUri("./bar.sass"),
					type: nodes.NodeType.Forward,
					as: "bar-",
					hide: ["$private"],
				},
			]);
			await assertDynamicLinks(getDocumentUri("./index.sass"), `@use 'sass:math'`, [
				{ range: newRange(5, 16), type: nodes.NodeType.Use, namespace: "math", target: "sass:math" },
			]);
			await assertNoDynamicLinks(
				getDocumentUri("./index.sass"),
				`@use './non-existent'`,
				getDocumentUri("non-existent"),
			);
		});

		test("SCSS empty path", async () => {
			const ls = getSCSSLS();

			/**
			 * https://github.com/microsoft/vscode/issues/79215
			 * No valid path — gradient-verlay.png is authority and path is ''
			 */
			await assertLinks(
				ls,
				`#navigation { background: #3d3d3d url(gantry-media://gradient-overlay.png); }`,
				[{ range: newRange(38, 73), target: "gantry-media://gradient-overlay.png" }],
				"scss",
			);
		});

		test("Sass empty path", async () => {
			const ls = getSCSSLS();

			/**
			 * https://github.com/microsoft/vscode/issues/79215
			 * No valid path — gradient-verlay.png is authority and path is ''
			 */
			await assertLinks(
				ls,
				`#navigation
	background: #3d3d3d url(gantry-media://gradient-overlay.png)`,
				[
					{
						range: Range.create(Position.create(1, 25), Position.create(1, 60)),
						target: "gantry-media://gradient-overlay.png",
					},
				],
				"sass",
			);
		});

		test("SCSS node module resolving", async function () {
			let ls = getSCSSLS();
			let testUri = getTestResource("about.scss");
			let workspaceFolder = getTestResource("");

			await assertLinks(
				ls,
				'html { background-image: url("~foo/hello.html")',
				[{ range: newRange(29, 46), target: getTestResource("node_modules/foo/hello.html") }],
				"scss",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				'html { background-image: url("foo/hello.html")',
				[{ range: newRange(29, 45), target: getTestResource("node_modules/foo/hello.html") }],
				"scss",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				`@use '@foo/bar/baz'`,
				[
					{
						range: newRange(5, 19),
						target: getTestResource("node_modules/@foo/bar/_baz.scss"),
						type: nodes.NodeType.Use,
						namespace: "baz",
					},
				],
				"scss",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				`@use '@foo/bar'`,
				[
					{
						range: newRange(5, 15),
						target: getTestResource("node_modules/@foo/bar/_index.scss"),
						type: nodes.NodeType.Use,
						namespace: "bar",
					},
				],
				"scss",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				'@import "green/d"',
				[{ range: newRange(8, 17), target: getTestResource("green/d.scss"), type: nodes.NodeType.Import }],
				"scss",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				'@import "./green/d"',
				[{ range: newRange(8, 19), target: getTestResource("green/d.scss"), type: nodes.NodeType.Import }],
				"scss",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				'@import "green/e"',
				[
					{
						range: newRange(8, 17),
						target: getTestResource("node_modules/green/_e.scss"),
						type: nodes.NodeType.Import,
					},
				],
				"scss",
				testUri,
				workspaceFolder,
			);
		});

		test("Sass node module resolving", async function () {
			let ls = getSCSSLS();
			let testUri = getTestResource("about.sass");
			let workspaceFolder = getTestResource("");

			await assertLinks(
				ls,
				`html
	background-image: url("~foo/hello.html")`,
				[
					{
						range: Range.create(Position.create(1, 23), Position.create(1, 40)),
						target: getTestResource("node_modules/foo/hello.html"),
					},
				],
				"sass",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				`html
	background-image: url("foo/hello.html")`,
				[
					{
						range: Range.create(Position.create(1, 23), Position.create(1, 39)),
						target: getTestResource("node_modules/foo/hello.html"),
					},
				],
				"sass",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				`@use '@foo/bar/baz'`,
				[
					{
						range: newRange(5, 19),
						target: getTestResource("node_modules/@foo/bar/_baz.scss"),
						type: nodes.NodeType.Use,
						namespace: "baz",
					},
				],
				"sass",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				`@use '@foo/bar'`,
				[
					{
						range: newRange(5, 15),
						target: getTestResource("node_modules/@foo/bar/_index.scss"),
						type: nodes.NodeType.Use,
						namespace: "bar",
					},
				],
				"sass",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				'@import "green/d"',
				[{ range: newRange(8, 17), target: getTestResource("green/d.scss"), type: nodes.NodeType.Import }],
				"sass",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				'@import "./green/d"',
				[{ range: newRange(8, 19), target: getTestResource("green/d.scss"), type: nodes.NodeType.Import }],
				"sass",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				'@import "green/e"',
				[
					{
						range: newRange(8, 17),
						target: getTestResource("node_modules/green/_e.scss"),
						type: nodes.NodeType.Import,
					},
				],
				"sass",
				testUri,
				workspaceFolder,
			);
		});

		test("SCSS node package resolving", async () => {
			let ls = getSCSSLS();
			let testUri = getTestResource("about.scss");
			let workspaceFolder = getTestResource("");
			await assertLinks(
				ls,
				`@use "pkg:bar"`,
				[
					{
						namespace: "bar",
						range: newRange(5, 14),
						target: getTestResource("node_modules/bar/styles/index.scss"),
						type: nodes.NodeType.Use,
					},
				],
				"scss",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				`@use "pkg:bar/colors"`,
				[
					{
						namespace: "colors",
						range: newRange(5, 21),
						target: getTestResource("node_modules/bar/styles/colors.scss"),
						type: nodes.NodeType.Use,
					},
				],
				"scss",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				`@use "pkg:bar/colors.scss"`,
				[
					{
						namespace: "colors",
						range: newRange(5, 26),
						target: getTestResource("node_modules/bar/styles/colors.scss"),
						type: nodes.NodeType.Use,
					},
				],
				"scss",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				`@use "pkg:@foo/baz"`,
				[
					{
						namespace: "baz",
						range: newRange(5, 19),
						target: getTestResource("node_modules/@foo/baz/styles/index.scss"),
						type: nodes.NodeType.Use,
					},
				],
				"scss",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				`@use "pkg:@foo/baz/colors"`,
				[
					{
						namespace: "colors",
						range: newRange(5, 26),
						target: getTestResource("node_modules/@foo/baz/styles/colors.scss"),
						type: nodes.NodeType.Use,
					},
				],
				"scss",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				`@use "pkg:@foo/baz/colors.scss"`,
				[
					{
						namespace: "colors",
						range: newRange(5, 31),
						target: getTestResource("node_modules/@foo/baz/styles/colors.scss"),
						type: nodes.NodeType.Use,
					},
				],
				"scss",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				`@use "pkg:@foo/baz/button"`,
				[
					{
						namespace: "button",
						range: newRange(5, 26),
						target: getTestResource("node_modules/@foo/baz/styles/button.scss"),
						type: nodes.NodeType.Use,
					},
				],
				"scss",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				`@use "pkg:@foo/baz/button.scss"`,
				[
					{
						namespace: "button",
						range: newRange(5, 31),
						target: getTestResource("node_modules/@foo/baz/styles/button.scss"),
						type: nodes.NodeType.Use,
					},
				],
				"scss",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				`@use "pkg:root-sass"`,
				[
					{
						namespace: "root-sass",
						range: newRange(5, 20),
						target: getTestResource("node_modules/root-sass/styles/index.scss"),
						type: nodes.NodeType.Use,
					},
				],
				"scss",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				`@use "pkg:root-style"`,
				[
					{
						namespace: "root-style",
						range: newRange(5, 21),
						target: getTestResource("node_modules/root-style/styles/index.scss"),
						type: nodes.NodeType.Use,
					},
				],
				"scss",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				`@use "pkg:bar-pattern/anything"`,
				[
					{
						namespace: "anything",
						range: newRange(5, 31),
						target: getTestResource("node_modules/bar-pattern/styles/anything.scss"),
						type: nodes.NodeType.Use,
					},
				],
				"scss",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				`@use "pkg:bar-pattern/anything.scss"`,
				[
					{
						namespace: "anything",
						range: newRange(5, 36),
						target: getTestResource("node_modules/bar-pattern/styles/anything.scss"),
						type: nodes.NodeType.Use,
					},
				],
				"scss",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				`@use "pkg:bar-pattern/theme/dark.scss"`,
				[
					{
						namespace: "dark",
						range: newRange(5, 38),
						target: getTestResource("node_modules/bar-pattern/styles/theme/dark.scss"),
						type: nodes.NodeType.Use,
					},
				],
				"scss",
				testUri,
				workspaceFolder,
			);
		});

		test("Sass node package resolving", async () => {
			let ls = getSCSSLS();
			let testUri = getTestResource("about.sass");
			let workspaceFolder = getTestResource("");
			await assertLinks(
				ls,
				`@use "pkg:bar-indented"`,
				[
					{
						namespace: "bar-indented",
						range: newRange(5, 23),
						target: getTestResource("node_modules/bar-indented/styles/index.sass"),
						type: nodes.NodeType.Use,
					},
				],
				"sass",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				`@use "pkg:bar-indented/colors"`,
				[
					{
						namespace: "colors",
						range: newRange(5, 30),
						target: getTestResource("node_modules/bar-indented/styles/colors.sass"),
						type: nodes.NodeType.Use,
					},
				],
				"sass",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				`@use "pkg:bar-indented/colors.sass"`,
				[
					{
						namespace: "colors",
						range: newRange(5, 35),
						target: getTestResource("node_modules/bar-indented/styles/colors.sass"),
						type: nodes.NodeType.Use,
					},
				],
				"sass",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				`@use "pkg:@foo/foo"`,
				[
					{
						namespace: "foo",
						range: newRange(5, 19),
						target: getTestResource("node_modules/@foo/foo/styles/index.sass"),
						type: nodes.NodeType.Use,
					},
				],
				"sass",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				`@use "pkg:@foo/foo/colors"`,
				[
					{
						namespace: "colors",
						range: newRange(5, 26),
						target: getTestResource("node_modules/@foo/foo/styles/colors.sass"),
						type: nodes.NodeType.Use,
					},
				],
				"sass",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				`@use "pkg:@foo/foo/colors.sass"`,
				[
					{
						namespace: "colors",
						range: newRange(5, 31),
						target: getTestResource("node_modules/@foo/foo/styles/colors.sass"),
						type: nodes.NodeType.Use,
					},
				],
				"sass",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				`@use "pkg:@foo/foo/button"`,
				[
					{
						namespace: "button",
						range: newRange(5, 26),
						target: getTestResource("node_modules/@foo/foo/styles/button.sass"),
						type: nodes.NodeType.Use,
					},
				],
				"sass",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				`@use "pkg:@foo/foo/button.sass"`,
				[
					{
						namespace: "button",
						range: newRange(5, 31),
						target: getTestResource("node_modules/@foo/foo/styles/button.sass"),
						type: nodes.NodeType.Use,
					},
				],
				"sass",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				`@use "pkg:root-indented"`,
				[
					{
						namespace: "root-indented",
						range: newRange(5, 24),
						target: getTestResource("node_modules/root-indented/styles/index.sass"),
						type: nodes.NodeType.Use,
					},
				],
				"sass",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				`@use "pkg:root-style-indented"`,
				[
					{
						namespace: "root-style-indented",
						range: newRange(5, 30),
						target: getTestResource("node_modules/root-style-indented/styles/index.sass"),
						type: nodes.NodeType.Use,
					},
				],
				"sass",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				`@use "pkg:bar-pattern-indented/anything"`,
				[
					{
						namespace: "anything",
						range: newRange(5, 40),
						target: getTestResource("node_modules/bar-pattern-indented/styles/anything.sass"),
						type: nodes.NodeType.Use,
					},
				],
				"sass",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				`@use "pkg:bar-pattern-indented/anything.sass"`,
				[
					{
						namespace: "anything",
						range: newRange(5, 45),
						target: getTestResource("node_modules/bar-pattern-indented/styles/anything.sass"),
						type: nodes.NodeType.Use,
					},
				],
				"sass",
				testUri,
				workspaceFolder,
			);
			await assertLinks(
				ls,
				`@use "pkg:bar-pattern-indented/theme/dark.sass"`,
				[
					{
						namespace: "dark",
						range: newRange(5, 47),
						target: getTestResource("node_modules/bar-pattern-indented/styles/theme/dark.sass"),
						type: nodes.NodeType.Use,
					},
				],
				"sass",
				testUri,
				workspaceFolder,
			);
		});

		test("links between Sass and SCSS", async () => {
			const fixtureRoot = path.resolve(__dirname, "../../../src/test/sass/linkFixture/module");
			const getDocumentUri = (relativePath: string) => {
				return URI.file(path.resolve(fixtureRoot, relativePath)).toString(true);
			};

			// scss using sass
			await assertDynamicLinks(getDocumentUri("./index.scss"), `@use './bar'`, [
				{
					range: newRange(5, 12),
					target: getDocumentUri("./bar.sass"),
					type: nodes.NodeType.Use,
					namespace: "bar",
				},
			]);
			// sass using scss
			await assertDynamicLinks(getDocumentUri("./index.sass"), `@use './foo'`, [
				{
					range: newRange(5, 12),
					target: getDocumentUri("./foo.scss"),
					type: nodes.NodeType.Use,
					namespace: "foo",
				},
			]);
		});
	});

	suite("Symbols", () => {
		test("scss document symbols", () => {
			const ls = getSCSSLS();

			// Incomplete Mixin
			assertDocumentSymbols(ls, "@mixin foo { }", [
				{ name: "foo", kind: SymbolKind.Method, range: newRange(0, 14), selectionRange: newRange(7, 10) },
			]);
			assertDocumentSymbols(ls, "@mixin {}", [
				{ name: "<undefined>", kind: SymbolKind.Method, range: newRange(0, 9), selectionRange: newRange(0, 0) },
			]);
		});

		test("sass document symbols", () => {
			const ls = getSCSSLS();

			// Incomplete Mixin
			assertDocumentSymbols(
				ls,
				"@mixin foo\n\t",
				[
					{
						name: "foo",
						kind: SymbolKind.Method,
						range: Range.create(Position.create(0, 0), Position.create(1, 1)),
						selectionRange: newRange(7, 10),
					},
				],
				"sass",
			);
			assertDocumentSymbols(
				ls,
				"@mixin \n\t",
				[{ name: "<undefined>", kind: SymbolKind.Method, range: newRange(0, 6), selectionRange: newRange(0, 0) }],
				"sass",
			);

			assertDocumentSymbols(
				ls,
				`$name: "value"
@mixin mixin($a: 1, $b)
	line-height: $a
	color: $b
@function function($a: 1, $b)
	@return $a * $b
%placeholder
	color: blue`,
				[
					{
						kind: SymbolKind.Variable,
						name: "$name",
						range: Range.create(Position.create(0, 0), Position.create(0, 14)),
						selectionRange: Range.create(Position.create(0, 0), Position.create(0, 5)),
					},
					{
						detail: "($a: 1, $b)",
						kind: SymbolKind.Method,
						name: "mixin",
						range: Range.create(Position.create(1, 0), Position.create(4, 0)),
						selectionRange: Range.create(Position.create(1, 7), Position.create(1, 12)),
					},
					{
						detail: "($a: 1, $b)",
						kind: SymbolKind.Function,
						name: "function",
						range: Range.create(Position.create(4, 0), Position.create(6, 0)),
						selectionRange: Range.create(Position.create(4, 10), Position.create(4, 18)),
					},
					{
						kind: SymbolKind.Class,
						name: "%placeholder",
						range: Range.create(Position.create(6, 0), Position.create(7, 12)),
						selectionRange: Range.create(Position.create(6, 0), Position.create(6, 12)),
					},
				],
				"sass",
			);
		});
	});

	suite("Color", () => {
		test("color symbols", () => {
			const ls = getSCSSLS();
			assertColorSymbols(ls, "$colors: (blue: $blue,indigo: $indigo)"); // issue #47209
		});

		test("Sass color symbols", () => {
			// map names are not colors
			const ls = getSCSSLS();
			const document = TextDocument.create(
				"test://test/test.sass",
				"sass",
				0,
				"$colors: (blue: $blue,indigo: $indigo)",
			);
			const stylesheet = ls.parseStylesheet(document);
			const result = ls.findDocumentColors(document, stylesheet);
			assert.deepEqual(result, []);
		});
	});
});
