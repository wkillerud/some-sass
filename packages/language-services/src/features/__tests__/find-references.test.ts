import { assert, test } from "vitest";
import { Position, getLanguageService } from "../../language-services";
import { getOptions } from "../../utils/test-helpers";

const { fileSystemProvider, ...rest } = getOptions();
const ls = getLanguageService({ fileSystemProvider, ...rest });

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
			"",
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

	assert.deepStrictEqual(references, [{ foo: "bar" }]);
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
			"",
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

	const references = await ls.findReferences(three, Position.create(1, 30));

	assert.deepStrictEqual(references, [{ foo: "bar" }]);
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
			uri: "one.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);
	ls.parseStylesheet(three);

	const references = await ls.findReferences(three, Position.create(4, 34));

	assert.deepStrictEqual(references, [{ foo: "bar" }]);
});

// hide/show
test.todo("finds variable used in visibility modifier");

test.todo("finds function with @forward prefix");

// hide/show
test.todo("finds function used in visibility modifier");

test.todo("finds mixins");

test.todo("finds mixins with @forward prefix");

// hide/show
test.todo("finds mixins used in visibility modifier");

test("finds references in maps", async () => {
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

test("finds sass built-ins", async () => {
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
