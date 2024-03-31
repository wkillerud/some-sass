import { test, assert, beforeEach } from "vitest";
import { Position, getLanguageService } from "../language-services";
import { getOptions } from "../utils/test-helpers";

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
