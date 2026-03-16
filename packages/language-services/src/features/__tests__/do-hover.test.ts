import { test, assert, beforeEach } from "vitest";
import { getLanguageService } from "../../language-services";
import { Position } from "../../language-services-types";
import { getOptions } from "../../utils/test-helpers";

const { fileSystemProvider, ...rest } = getOptions();
const ls = getLanguageService({ fileSystemProvider, ...rest });

beforeEach(() => {
	ls.clearCache();
});

test("should show hover information for symbol in the same document", async () => {
	const document = fileSystemProvider.createDocument([
		"$primary: limegreen;",
		".a { color: $primary; }",
	]);

	const result = await ls.doHover(document, Position.create(1, 15));
	assert.isNotNull(result, "Expected to find a hover result for $primary");
	assert.match(JSON.stringify(result), /\$primary/);
});

test("symbol declared with indented syntax is not previewed as SCSS", async () => {
	const document = fileSystemProvider.createDocument(
		`$primary: limegreen
.a
	color: $primary
`,
		{ languageId: "sass" },
	);

	const result = await ls.doHover(document, Position.create(2, 10));
	assert.isNotNull(result, "Expected to find a hover result for $primary");
	const json = JSON.stringify(result);
	assert.match(json, /\$primary/);
	assert.match(json, /```sass/);
	assert.notInclude(json, ";");
});

test("should show hover information for symbol in a different document via @import", async () => {
	const one = fileSystemProvider.createDocument("$primary: limegreen;", {
		uri: "one.scss",
	});
	const two = fileSystemProvider.createDocument(".a { color: $primary; }", {
		uri: "two.scss",
	});

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const result = await ls.doHover(two, Position.create(0, 15));
	assert.isNotNull(result, "Expected to find a hover result for $primary");
	assert.match(JSON.stringify(result), /\$primary/);
});

test("should show hover information for symbol in a different document via @use", async () => {
	const one = fileSystemProvider.createDocument("$primary: limegreen;", {
		uri: "one.scss",
	});
	const two = fileSystemProvider.createDocument(
		['@use "./one";', ".a { color: one.$primary; }"],
		{
			uri: "two.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const result = await ls.doHover(two, Position.create(1, 19));
	assert.isNotNull(result, "Expected to find a hover result for $primary");
	assert.match(JSON.stringify(result), /\$primary/);
});

test("should show hover information for symbol in a different document via @use with alias", async () => {
	const one = fileSystemProvider.createDocument("$primary: limegreen;", {
		uri: "one.scss",
	});
	const two = fileSystemProvider.createDocument(
		['@use "./one" as o;', ".a { color: o.$primary; }"],
		{
			uri: "two.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const result = await ls.doHover(two, Position.create(1, 17));
	assert.isNotNull(result, "Expected to find a hover result for $primary");
	assert.match(JSON.stringify(result), /\$primary/);
});

test("should show hover information for symbol in a different document via @use with wildcard alias", async () => {
	const one = fileSystemProvider.createDocument("$primary: limegreen;", {
		uri: "one.scss",
	});
	const two = fileSystemProvider.createDocument(
		['@use "./one" as *;', ".a { color: $primary; }"],
		{
			uri: "two.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const result = await ls.doHover(two, Position.create(1, 17));
	assert.isNotNull(result, "Expected to find a hover result for $primary");
	assert.match(JSON.stringify(result), /\$primary/);
});

test("should show correct hover information when aliased modules symbols collide", async () => {
	const one = fileSystemProvider.createDocument("$primary: red;", {
		uri: "one.scss",
	});
	const two = fileSystemProvider.createDocument("$primary: green;", {
		uri: "two.scss",
	});
	const main = fileSystemProvider.createDocument([
		'@use "./one" as o;',
		'@use "./two" as t;',
		".one { color: o.$primary; }",
		".two { color: t.$primary; }",
	]);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);
	ls.parseStylesheet(main);

	const resultOne = await ls.doHover(main, Position.create(2, 21));
	assert.isNotNull(resultOne, "Expected to find a hover result for $primary");
	const stringifiedOne = JSON.stringify(resultOne);
	assert.match(stringifiedOne, /\$primary/);
	assert.match(stringifiedOne, /one.scss/);

	const resultTwo = await ls.doHover(main, Position.create(3, 21));
	assert.isNotNull(resultTwo, "Expected to find a hover result for $primary");
	const stringifiedTwo = JSON.stringify(resultTwo);
	assert.match(stringifiedTwo, /\$primary/);
	assert.match(stringifiedTwo, /two.scss/);
});

test("should show correct hover information when modules variables collide", async () => {
	const one = fileSystemProvider.createDocument("$primary: red;", {
		uri: "one.scss",
	});
	const two = fileSystemProvider.createDocument("$primary: green;", {
		uri: "two.scss",
	});
	const main = fileSystemProvider.createDocument([
		'@use "./one";',
		'@use "./two";',
		".one { color: one.$primary; }",
		".two { color: two.$primary; }",
	]);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);
	ls.parseStylesheet(main);

	const resultOne = await ls.doHover(main, Position.create(2, 21));
	assert.isNotNull(resultOne, "Expected to find a hover result for $primary");
	const stringifiedOne = JSON.stringify(resultOne);
	assert.match(stringifiedOne, /\$primary/);
	assert.match(stringifiedOne, /one.scss/);

	const resultTwo = await ls.doHover(main, Position.create(3, 21));
	assert.isNotNull(resultTwo, "Expected to find a hover result for $primary");
	const stringifiedTwo = JSON.stringify(resultTwo);
	assert.match(stringifiedTwo, /\$primary/);
	assert.match(stringifiedTwo, /two.scss/);
});

test("should show correct hover information when modules functions collide", async () => {
	const one = fileSystemProvider.createDocument(
		"@function primary() { @return red; }",
		{ uri: "one.scss" },
	);
	const two = fileSystemProvider.createDocument(
		"@function primary() { @return green; }",
		{ uri: "two.scss" },
	);
	const main = fileSystemProvider.createDocument([
		'@use "./one";',
		'@use "./two";',
		".one { color: one.primary(); }",
		".two { color: two.primary(); }",
	]);

	ls.parseStylesheet(one);
	ls.parseStylesheet(two);
	ls.parseStylesheet(main);

	const resultOne = await ls.doHover(main, Position.create(2, 21));
	assert.isNotNull(resultOne, "Expected to find a hover result for primary");
	const stringifiedOne = JSON.stringify(resultOne);
	assert.match(stringifiedOne, /primary/);
	assert.match(stringifiedOne, /one.scss/);

	const resultTwo = await ls.doHover(main, Position.create(3, 21));
	assert.isNotNull(resultTwo, "Expected to find a hover result for primary");
	const stringifiedTwo = JSON.stringify(resultTwo);
	assert.match(stringifiedTwo, /primary/);
	assert.match(stringifiedTwo, /two.scss/);
});

test("should show correct hover information when modules mixins collide", async () => {
	const one = fileSystemProvider.createDocument(
		"@mixin primary() { color: red; }",
		{ uri: "one.scss" },
	);
	const two = fileSystemProvider.createDocument(
		"@mixin primary() { color: green; }",
		{ uri: "two.scss" },
	);
	const main = fileSystemProvider.createDocument([
		'@use "./one";',
		'@use "./two";',
		".one { @include one.primary(); }",
		".two { @include two.primary(); }",
	]);

	ls.parseStylesheet(one);
	ls.parseStylesheet(two);
	ls.parseStylesheet(main);

	const resultOne = await ls.doHover(main, Position.create(2, 22));
	assert.isNotNull(resultOne, "Expected to find a hover result for primary");
	const stringifiedOne = JSON.stringify(resultOne);
	assert.match(stringifiedOne, /primary/);
	assert.match(stringifiedOne, /one.scss/);

	const resultTwo = await ls.doHover(main, Position.create(3, 22));
	assert.isNotNull(resultTwo, "Expected to find a hover result for primary");
	const stringifiedTwo = JSON.stringify(resultTwo);
	assert.match(stringifiedTwo, /primary/);
	assert.match(stringifiedTwo, /two.scss/);
});

test("should show correct hover information when user defined symbol collide with sass builtin", async () => {
	const one = fileSystemProvider.createDocument(
		"$e: 1; @function random() { @return 1; };",
		{ uri: "one.scss" },
	);
	const two = fileSystemProvider.createDocument(
		"$e: 2; @function random() { @return 2; };",
		{ uri: "two.scss" },
	);
	const main = fileSystemProvider.createDocument([
		'@use "./one";',
		'@use "sass:math";',
		'@use "./two";',
		".one { opacity: one.$e; scale: one.random(); }",
		".builtin { opacity: math.$e; scale: math.random(); }",
		".two { opacity: two.$e; scale: two.random(); }",
	]);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);
	ls.parseStylesheet(main);

	const resultOne = await ls.doHover(main, Position.create(3, 21));
	assert.isNotNull(resultOne, "Expected to find a hover result for $e");
	const stringifiedOne = JSON.stringify(resultOne);
	assert.match(stringifiedOne, /\$e/);
	assert.match(stringifiedOne, /one.scss/);

	const resultRandomOne = await ls.doHover(main, Position.create(3, 37));
	assert.isNotNull(
		resultRandomOne,
		"Expected to find a hover result for random",
	);
	const stringifiedRandomOne = JSON.stringify(resultRandomOne);
	assert.match(stringifiedRandomOne, /random/);
	assert.match(stringifiedRandomOne, /one.scss/);

	const resultBuiltin = await ls.doHover(main, Position.create(4, 26));
	assert.isNotNull(resultBuiltin, "Expected to find a hover result for $e");
	const stringifiedBuiltin = JSON.stringify(resultBuiltin);
	assert.match(stringifiedBuiltin, /\$e/);
	assert.match(stringifiedBuiltin, /\[Sass reference\]/);

	const resultRandomBuiltin = await ls.doHover(main, Position.create(4, 43));
	assert.isNotNull(
		resultRandomBuiltin,
		"Expected to find a hover result for random",
	);
	const stringifiedRandomBuiltin = JSON.stringify(resultRandomBuiltin);
	assert.match(stringifiedRandomBuiltin, /random/);
	assert.match(stringifiedRandomBuiltin, /\[Sass reference\]/);

	const resultTwo = await ls.doHover(main, Position.create(5, 21));
	assert.isNotNull(resultTwo, "Expected to find a hover result for $e");
	const stringifiedTwo = JSON.stringify(resultTwo);
	assert.match(stringifiedTwo, /\$e/);
	assert.match(stringifiedTwo, /two.scss/);

	const resultRandomTwo = await ls.doHover(main, Position.create(5, 38));
	assert.isNotNull(
		resultRandomTwo,
		"Expected to find a hover result for random",
	);
	const stringifiedRandomTwo = JSON.stringify(resultRandomTwo);
	assert.match(stringifiedRandomTwo, /random/);
	assert.match(stringifiedRandomTwo, /two.scss/);
});

test("should show hover information for symbol prefixed via @forward", async () => {
	const one = fileSystemProvider.createDocument(
		["$a: 1;", "@mixin mixin() { @content; }", "@function make() { @return; }"],
		{ uri: "one.scss" },
	);
	const two = fileSystemProvider.createDocument('@forward "./one" as foo-*;', {
		uri: "two.scss",
	});
	const three = fileSystemProvider.createDocument([
		'@use "./two";',
		".a { content: two.foo-make(1); }",
		".a { @include two.foo-mixin(); }",
		".a { content: two.$foo-a; }",
	]);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);
	ls.parseStylesheet(three);

	const result = await ls.doHover(three, Position.create(1, 20));
	assert.isNotNull(result, "Expected to find a hover result for foo-make");
	assert.match(JSON.stringify(result), /foo-make/);
});

test("should show hover information for mixin", async () => {
	const document = fileSystemProvider.createDocument([
		"@mixin primary() { color: $primary; }",
		".a { @include primary; }",
	]);

	const result = await ls.doHover(document, Position.create(1, 17));
	assert.isNotNull(result, "Expected to find a hover result for primary");
	assert.match(JSON.stringify(result), /primary/);
});

test("should show hover information for function", async () => {
	const document = fileSystemProvider.createDocument([
		"@function getprimary() { @return limegreen; }",
		".a { color: getprimary(); }",
	]);

	const result = await ls.doHover(document, Position.create(1, 17));
	assert.isNotNull(result, "Expected to find a hover result for getprimary");
	assert.match(JSON.stringify(result), /getprimary/);
});

test("should show hover information for placeholder", async () => {
	const document = fileSystemProvider.createDocument([
		"%alert { color: limegreen; }",
		".a { @extend %alert; }",
	]);

	const result = await ls.doHover(document, Position.create(1, 17));
	assert.isNotNull(result, "Expected to find a hover result for primary");
	assert.match(JSON.stringify(result), /alert/);
});

test("should show hover information for Sassdoc annotation", async () => {
	const document = fileSystemProvider.createDocument([
		"$a: 1;",
		"/// Some wise words",
		"/// @type String",
		'$documented-variable: "value";',
	]);

	const result = await ls.doHover(document, Position.create(2, 8));
	assert.isNotNull(result, "Expected to find a hover result for @type");
	assert.match(JSON.stringify(result), /@type/);
});

test("Sass indented should show hover information for Sassdoc annotation", async () => {
	const document = fileSystemProvider.createDocument(
		[
			"$a: 1",
			"/// Some wise words",
			"/// @type String",
			'$documented-variable: "value"',
		],
		{ languageId: "sass" },
	);

	const result = await ls.doHover(document, Position.create(2, 8));
	assert.isNotNull(result, "Expected to find a hover result for @type");
	assert.match(JSON.stringify(result), /@type/);
});

test("SassDoc hover info works for indented", async () => {
	const document = fileSystemProvider.createDocument(
		`/// Foo bar
/// @type Color
$_decoration: underline dotted red
a
	text-decoration: $_decoration
	`,
		{ languageId: "sass" },
	);

	const result = await ls.doHover(document, Position.create(4, 24));
	assert.isNotNull(result, "Expected to find a hover result for $_decoration");
	assert.match(JSON.stringify(result), /Foo bar/);
});

test("should show hover information for Sassdoc annotation at the start of the document", async () => {
	const document = fileSystemProvider.createDocument([
		"/// Some wise words",
		"/// @type String",
		'$documented-variable: "value";',
	]);

	const result = await ls.doHover(document, Position.create(1, 8));
	assert.isNotNull(result, "Expected to find a hover result for @type");
	assert.match(JSON.stringify(result), /@type/);
});

test("should show expected hover information for Sassdoc in the case of more than one", async () => {
	const document = fileSystemProvider.createDocument([
		"/// Some wise words",
		"/// @type String",
		"/// @author wkillerud",
		'$documented-variable: "value";',
	]);

	const result = await ls.doHover(document, Position.create(2, 8));
	assert.isNotNull(result, "Expected to find a hover result for @author");
	assert.match(JSON.stringify(result), /@author/);
});
