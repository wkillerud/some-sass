import { assert, test, beforeEach } from "vitest";
import { Position, getLanguageService } from "../../language-services";
import { getOptions } from "../../utils/test-helpers";

const { fileSystemProvider, ...rest } = getOptions();
const ls = getLanguageService({ fileSystemProvider, ...rest });

beforeEach(() => {
	ls.clearCache();
});

test("finds variable references", async () => {
	const one = fileSystemProvider.createDocument('$day: "monday";', {
		uri: "ki.scss",
	});
	const two = fileSystemProvider.createDocument(
		['@use "ki";', ".a::after { content: ki.$day; }"],
		{
			uri: "helen.scss",
		},
	);
	const three = fileSystemProvider.createDocument(
		[
			'@use "ki";',
			".a::before {",
			" // Here it comes!",
			" content: ki.$day;",
			"}",
		],
		{
			uri: "gato.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);
	ls.parseStylesheet(three);

	const references = await ls.findReferences(two, Position.create(1, 25));

	assert.equal(references.length, 3);

	const [ki, helen, gato] = references;
	assert.match(ki.uri, /ki\.scss$/);
	assert.match(helen.uri, /helen\.scss$/);
	assert.match(gato.uri, /gato\.scss$/);

	assert.deepStrictEqual(ki.range, {
		start: {
			line: 0,
			character: 0,
		},
		end: {
			line: 0,
			character: 4,
		},
	});

	assert.deepStrictEqual(helen.range, {
		start: {
			line: 1,
			character: 24,
		},
		end: {
			line: 1,
			character: 28,
		},
	});

	assert.deepStrictEqual(gato.range, {
		start: {
			line: 3,
			character: 13,
		},
		end: {
			line: 3,
			character: 17,
		},
	});
});

test("exclude declaration if the user requests so", async () => {
	const one = fileSystemProvider.createDocument('$day: "monday";', {
		uri: "ki.scss",
	});
	const two = fileSystemProvider.createDocument(
		['@use "ki";', ".a::after { content: ki.$day; }"],
		{
			uri: "helen.scss",
		},
	);
	const three = fileSystemProvider.createDocument(
		[
			'@use "ki";',
			".a::before {",
			" // Here it comes!",
			" content: ki.$day;",
			"}",
		],
		{
			uri: "gato.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);
	ls.parseStylesheet(three);

	const references = await ls.findReferences(two, Position.create(1, 25), {
		includeDeclaration: false,
	});

	assert.equal(references.length, 2);

	const [helen, gato] = references;

	assert.match(helen.uri, /helen\.scss$/);
	assert.match(gato.uri, /gato\.scss$/);
});

test("finds variable with @forward prefix", async () => {
	const one = fileSystemProvider.createDocument('$day: "monday";', {
		uri: "ki.scss",
	});
	const two = fileSystemProvider.createDocument('@forward "ki" as ki-*;', {
		uri: "dev.scss",
	});
	const three = fileSystemProvider.createDocument(
		['@use "dev";', ".a::after { content: dev.$ki-day; }"],
		{
			uri: "helen.scss",
		},
	);
	const four = fileSystemProvider.createDocument(
		[
			'@use "ki";',
			".a::before {",
			" // Here it comes!",
			" content: ki.$day;",
			"}",
		],
		{
			uri: "gato.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);
	ls.parseStylesheet(three);
	ls.parseStylesheet(four);

	const references = await ls.findReferences(four, Position.create(3, 15));

	assert.equal(references.length, 3);

	const [ki, helen, gato] = references;
	assert.match(ki.uri, /ki\.scss$/);
	assert.match(helen.uri, /helen\.scss$/);
	assert.match(gato.uri, /gato\.scss$/);

	assert.deepStrictEqual(ki.range, {
		start: {
			line: 0,
			character: 0,
		},
		end: {
			line: 0,
			character: 4,
		},
	});

	assert.deepStrictEqual(helen.range, {
		start: {
			line: 1,
			character: 25,
		},
		end: {
			line: 1,
			character: 32,
		},
	});

	assert.deepStrictEqual(gato.range, {
		start: {
			line: 3,
			character: 13,
		},
		end: {
			line: 3,
			character: 17,
		},
	});
});

test("finds variables with @forward prefix when used as a function parameter", async () => {
	const one = fileSystemProvider.createDocument(
		[
			"@function hello($var) { @return $var; }",
			'$name: "there";',
			'$reply: "general";',
		],
		{
			uri: "fun.scss",
		},
	);
	const two = fileSystemProvider.createDocument('@forward "fun" as fun-*;', {
		uri: "dev.scss",
	});
	const three = fileSystemProvider.createDocument(
		[
			'@use "dev";',
			"$_b: 1;",
			".a {",
			"	// Here it comes!",
			" content: dev.fun-hello(dev.$fun-name, $_b);",
			"}",
		],
		{
			uri: "usage.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);
	ls.parseStylesheet(three);

	const references = await ls.findReferences(three, Position.create(4, 34));

	assert.equal(references.length, 2);

	const [fun, usage] = references;
	assert.match(fun.uri, /fun\.scss$/);
	assert.match(usage.uri, /usage\.scss$/);

	assert.deepStrictEqual(fun.range, {
		start: {
			line: 1,
			character: 0,
		},
		end: {
			line: 1,
			character: 5,
		},
	});
	assert.deepStrictEqual(usage.range, {
		start: {
			line: 4,
			character: 28,
		},
		end: {
			line: 4,
			character: 37,
		},
	});
});

// hide/show
test("finds variable used in visibility modifier", async () => {
	const one = fileSystemProvider.createDocument(["$secret: 1;"], {
		uri: "var.scss",
	});
	const two = fileSystemProvider.createDocument(
		['@forward "var" as var-* hide $secret;'],
		{
			uri: "dev.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const references = await ls.findReferences(one, Position.create(0, 2));

	assert.equal(references.length, 2);

	const [dec, hide] = references;
	assert.match(dec.uri, /var\.scss$/);
	assert.match(hide.uri, /dev\.scss$/);

	assert.deepStrictEqual(dec.range, {
		start: {
			line: 0,
			character: 0,
		},
		end: {
			line: 0,
			character: 7,
		},
	});
	assert.deepStrictEqual(hide.range, {
		start: {
			line: 0,
			character: 29,
		},
		end: {
			line: 0,
			character: 36,
		},
	});
});

test("finds function with @forward prefix", async () => {
	const one = fileSystemProvider.createDocument(
		"@function hello() { @return 1; }",
		{
			uri: "func.scss",
		},
	);
	const two = fileSystemProvider.createDocument('@forward "func" as fun-*;', {
		uri: "dev.scss",
	});
	const three = fileSystemProvider.createDocument(
		['@use "dev";', ".a {", " line-height: dev.fun-hello();", "}"],
		{
			uri: "one.scss",
		},
	);
	const four = fileSystemProvider.createDocument(
		[
			'@use "func";',
			".a {",
			"	// Here it comes!",
			" line-height: func.hello();",
			"}",
		],
		{
			uri: "two.scss",
		},
	);
	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);
	ls.parseStylesheet(three);
	ls.parseStylesheet(four);

	const references = await ls.findReferences(four, Position.create(3, 22), {
		includeDeclaration: true,
	});

	assert.equal(references.length, 3);

	const [func, o, t] = references;
	assert.match(func.uri, /func\.scss$/);
	assert.match(o.uri, /one\.scss$/);
	assert.match(t.uri, /two\.scss$/);

	assert.deepStrictEqual(func.range, {
		start: {
			line: 0,
			character: 10,
		},
		end: {
			line: 0,
			character: 15,
		},
	});
	assert.deepStrictEqual(o.range, {
		start: {
			line: 2,
			character: 18,
		},
		end: {
			line: 2,
			character: 27,
		},
	});
	assert.deepStrictEqual(t.range, {
		start: {
			line: 3,
			character: 19,
		},
		end: {
			line: 3,
			character: 24,
		},
	});
});

// TODO: you are here. ForwardVisibility is a bit tricky in that it can be both a mixin or a function in this case.
// hide/show
test("finds function used in visibility modifier", async () => {
	const one = fileSystemProvider.createDocument(
		"@function hello() { @return 1; }",
		{
			uri: "func.scss",
		},
	);
	const two = fileSystemProvider.createDocument(
		['@forward "func" as fun-* show hello;'],
		{
			uri: "dev.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const references = await ls.findReferences(one, Position.create(0, 12));

	assert.equal(references.length, 2);

	const [dec, hide] = references;
	assert.match(dec.uri, /func\.scss$/);
	assert.match(hide.uri, /dev\.scss$/);

	assert.deepStrictEqual(dec.range, {
		start: {
			line: 0,
			character: 10,
		},
		end: {
			line: 0,
			character: 15,
		},
	});
	assert.deepStrictEqual(hide.range, {
		start: {
			line: 0,
			character: 30,
		},
		end: {
			line: 0,
			character: 35,
		},
	});
});

test.todo("finds mixins");

test.todo("finds mixins with @forward prefix");

// hide/show
test.todo("finds mixins used in visibility modifier");

test.todo("finds references in maps", async () => {
	const one = fileSystemProvider.createDocument(
		["@function hello() { @return 1; }", '$day: "monday";'],

		{
			uri: "fun.scss",
		},
	);

	const two = fileSystemProvider.createDocument('@forward "fun" as fun-*;', {
		uri: "dev.scss",
	});

	const three = fileSystemProvider.createDocument(
		[
			'@use "dev";',
			"$map: (",
			' "gloomy": dev.$fun-day,',
			' "goodbye": dev.fun-hello(),',
			");",
		],
		{
			uri: "one.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);
	ls.parseStylesheet(three);

	const variableReferences = await ls.findReferences(
		three,
		Position.create(2, 21),
	);
	const functionReferences = await ls.findReferences(
		three,
		Position.create(3, 22),
	);

	assert.deepStrictEqual(variableReferences, [{ foo: "bar" }]);
	assert.deepStrictEqual(functionReferences, [{ foo: "bar" }]);
});

test.todo("finds sass built-ins", async () => {
	const one = fileSystemProvider.createDocument(
		[
			'@use "sass:color";',
			'$_color: color.scale($color: "#1b1917", $alpha: -75%);',
			".a {",
			"	color: $_color;",
			"	transform: scale(1.1);",
			"}",
		],

		{
			uri: "one.scss",
		},
	);
	const two = fileSystemProvider.createDocument(
		[
			'@use "sass:color";',
			'$_other-color: color.scale($color: "#1b1917", $alpha: -75%);',
		],

		{
			uri: "two.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const references = await ls.findReferences(one, Position.create(1, 16));

	assert.deepStrictEqual(references, [{ foo: "bar" }]);
});

test.todo("finds placeholders");
