import { assert, test, beforeEach } from "vitest";
import { getLanguageService } from "../../language-services";
import { Position } from "../../language-services-types";
import { getOptions } from "../../utils/test-helpers";

const { fileSystemProvider, ...rest } = getOptions();
const ls = getLanguageService({ fileSystemProvider, ...rest });

beforeEach(() => {
	ls.clearCache();

	const stuff = fileSystemProvider.createDocument(
		[
			"@mixin one() { @content; }",
			"@mixin two($a, $b) { @content; }",
			"@function make() { @return 1; }",
			"@function one($a, $b, $c) { @return 1; }",
			"@function two($d, $e) { @return 1; }",
		],
		{ uri: "stuff.scss" },
	);

	ls.parseStylesheet(stuff);
});

test("signature help for a parameterless mixin", async () => {
	const document = fileSystemProvider.createDocument("@include one(", {
		uri: "things.scss",
	});
	const result = await ls.doSignatureHelp(document, Position.create(0, 13));

	assert.deepStrictEqual(result, {
		signatures: [
			{
				documentation: {
					kind: "markdown",
					value: "",
				},
				label: "one()",
				parameters: [],
			},
		],
		activeParameter: 0,
		activeSignature: 0,
	});
});

test("signature help for a parameterless function", async () => {
	const document = fileSystemProvider.createDocument(".a { content: make()", {
		uri: "things.scss",
	});
	const result = await ls.doSignatureHelp(document, Position.create(0, 19));

	assert.deepStrictEqual(result, {
		signatures: [
			{
				documentation: {
					kind: "markdown",
					value: "",
				},
				label: "make()",
				parameters: [],
			},
		],
		activeParameter: 0,
		activeSignature: 0,
	});
});

test("signature help for a mixin closed without parameters", async () => {
	const document = fileSystemProvider.createDocument("@include two()", {
		uri: "things.scss",
	});
	const result = await ls.doSignatureHelp(document, Position.create(0, 13));

	assert.deepStrictEqual(result, {
		signatures: [
			{
				documentation: {
					kind: "markdown",
					value: "",
				},
				label: "two($a, $b)",
				parameters: [
					{
						documentation: undefined,
						label: "$a",
					},
					{
						documentation: undefined,
						label: "$b",
					},
				],
			},
		],
		activeParameter: 0,
		activeSignature: 0,
	});
});

test("signature help when one of two mixin parameters are filled in", async () => {
	const document = fileSystemProvider.createDocument("@include two($a: 1,)", {
		uri: "things.scss",
	});
	const result = await ls.doSignatureHelp(document, Position.create(0, 19));

	assert.deepStrictEqual(result, {
		signatures: [
			{
				documentation: {
					kind: "markdown",
					value: "",
				},
				label: "two($a, $b)",
				parameters: [
					{
						documentation: undefined,
						label: "$a",
					},
					{
						documentation: undefined,
						label: "$b",
					},
				],
			},
		],
		activeParameter: 1,
		activeSignature: 0,
	});
});

test("signature help for module mixin", async () => {
	const document = fileSystemProvider.createDocument(
		['@use "stuff";', "@include stuff.two("],
		{
			uri: "things.scss",
		},
	);
	const result = await ls.doSignatureHelp(document, Position.create(1, 19));

	assert.deepStrictEqual(result, {
		signatures: [
			{
				documentation: {
					kind: "markdown",
					value: "",
				},
				label: "two($a, $b)",
				parameters: [
					{
						documentation: undefined,
						label: "$a",
					},
					{
						documentation: undefined,
						label: "$b",
					},
				],
			},
		],
		activeParameter: 0,
		activeSignature: 0,
	});
});

test("signature help for module mixin with parameters", async () => {
	const document = fileSystemProvider.createDocument(
		['@use "stuff";', "@include stuff.two(1,)"],
		{
			uri: "things.scss",
		},
	);
	const result = await ls.doSignatureHelp(document, Position.create(1, 21));

	assert.deepStrictEqual(result, {
		signatures: [
			{
				documentation: {
					kind: "markdown",
					value: "",
				},
				label: "two($a, $b)",
				parameters: [
					{
						documentation: undefined,
						label: "$a",
					},
					{
						documentation: undefined,
						label: "$b",
					},
				],
			},
		],
		activeParameter: 1,
		activeSignature: 0,
	});
});

test("signature help for module mixin behind prefix", async () => {
	const forward = fileSystemProvider.createDocument(
		['@forward "stuff" as things-*;'],
		{
			uri: "things.scss",
		},
	);
	ls.parseStylesheet(forward);

	const document = fileSystemProvider.createDocument(
		['@use "things" as t;', "@include t.things-two()"],
		{
			uri: "other-things.scss",
		},
	);

	const result = await ls.doSignatureHelp(document, Position.create(1, 22));

	assert.deepStrictEqual(result, {
		signatures: [
			{
				documentation: {
					kind: "markdown",
					value: "",
				},
				label: "things-two($a, $b)",
				parameters: [
					{
						documentation: undefined,
						label: "$a",
					},
					{
						documentation: undefined,
						label: "$b",
					},
				],
			},
		],
		activeParameter: 0,
		activeSignature: 0,
	});
});

test("signature help when one of two function parameters are filled in", async () => {
	const document = fileSystemProvider.createDocument(
		['@use "stuff";', ".a { content: stuff.two(1,)"],
		{
			uri: "things.scss",
		},
	);
	const result = await ls.doSignatureHelp(document, Position.create(1, 26));

	assert.deepStrictEqual(result, {
		signatures: [
			{
				documentation: {
					kind: "markdown",
					value: "",
				},
				label: "two($d, $e)",
				parameters: [
					{
						documentation: undefined,
						label: "$d",
					},
					{
						documentation: undefined,
						label: "$e",
					},
				],
			},
		],
		activeParameter: 1,
		activeSignature: 0,
	});
});

test("signature help for module function", async () => {
	const document = fileSystemProvider.createDocument(".a { content: two(1,)", {
		uri: "things.scss",
	});
	const result = await ls.doSignatureHelp(document, Position.create(0, 20));

	assert.deepStrictEqual(result, {
		signatures: [
			{
				documentation: {
					kind: "markdown",
					value: "",
				},
				label: "two($d, $e)",
				parameters: [
					{
						documentation: undefined,
						label: "$d",
					},
					{
						documentation: undefined,
						label: "$e",
					},
				],
			},
		],
		activeParameter: 1,
		activeSignature: 0,
	});
});

test("signature help when given more parameters than are supported", async () => {
	const document = fileSystemProvider.createDocument("@include two(1,2,3)", {
		uri: "things.scss",
	});
	const result = await ls.doSignatureHelp(document, Position.create(0, 18));

	assert.deepStrictEqual(result, {
		signatures: [],
		activeParameter: 0,
		activeSignature: 0,
	});
});

test("is not confused by using a function as a parameter", async () => {
	const document = fileSystemProvider.createDocument(
		".a { content: two(rgba(0,0,0,.0001),)",
		{
			uri: "things.scss",
		},
	);
	const result = await ls.doSignatureHelp(document, Position.create(0, 36));

	assert.deepStrictEqual(result, {
		signatures: [
			{
				documentation: {
					kind: "markdown",
					value: "",
				},
				label: "two($d, $e)",
				parameters: [
					{
						documentation: undefined,
						label: "$d",
					},
					{
						documentation: undefined,
						label: "$e",
					},
				],
			},
		],
		activeParameter: 1,
		activeSignature: 0,
	});
});

test("does not get the functions mixed when editing a function as a parameter", async () => {
	const document = fileSystemProvider.createDocument(
		".a { content: two(rgba(0,0,0,",
		{
			uri: "things.scss",
		},
	);
	const result = await ls.doSignatureHelp(document, Position.create(0, 29));

	assert.deepStrictEqual(result, {
		signatures: [],
		activeParameter: 3,
		activeSignature: 0,
	});
});

test("signature help inside string interpolation", async () => {
	const document = fileSystemProvider.createDocument(
		".a { content: #{two(1,)}",
		{
			uri: "things.scss",
		},
	);
	const result = await ls.doSignatureHelp(document, Position.create(0, 22));

	assert.deepStrictEqual(result, {
		signatures: [
			{
				documentation: {
					kind: "markdown",
					value: "",
				},
				label: "two($d, $e)",
				parameters: [
					{
						documentation: undefined,
						label: "$d",
					},
					{
						documentation: undefined,
						label: "$e",
					},
				],
			},
		],
		activeParameter: 1,
		activeSignature: 0,
	});
});

test("provides signature help for sass built-ins", async () => {
	const document = fileSystemProvider.createDocument(
		[
			"@use 'sass:math' as magic;",
			".foo {",
			"  font-size: magic.clamp();",
			"  font-size: magic.clamp(1,);",
			"  font-size: magic.clamp(1,2,);",
			"}",
		],
		{ uri: "builtins.scss" },
	);

	const first = await ls.doSignatureHelp(document, Position.create(2, 25));
	const second = await ls.doSignatureHelp(document, Position.create(3, 27));
	const third = await ls.doSignatureHelp(document, Position.create(4, 29));

	assert.deepStrictEqual(first, {
		signatures: [
			{
				documentation: {
					kind: "markdown",
					value:
						"Restricts $number to the range between `$min` and `$max`. If `$number` is less than `$min` this returns `$min`, and if it's greater than `$max` this returns `$max`.\n\n[Sass reference](https://sass-lang.com/documentation/modules/math#clamp)",
				},
				label: "clamp($min, $number, $max)",
				parameters: [
					{
						label: "$min",
					},
					{
						label: "$number",
					},
					{
						label: "$max",
					},
				],
			},
		],
		activeParameter: 0,
		activeSignature: 0,
	});
	assert.deepStrictEqual(second, {
		signatures: [
			{
				documentation: {
					kind: "markdown",
					value:
						"Restricts $number to the range between `$min` and `$max`. If `$number` is less than `$min` this returns `$min`, and if it's greater than `$max` this returns `$max`.\n\n[Sass reference](https://sass-lang.com/documentation/modules/math#clamp)",
				},
				label: "clamp($min, $number, $max)",
				parameters: [
					{
						label: "$min",
					},
					{
						label: "$number",
					},
					{
						label: "$max",
					},
				],
			},
		],
		activeParameter: 1,
		activeSignature: 0,
	});
	assert.deepStrictEqual(third, {
		signatures: [
			{
				documentation: {
					kind: "markdown",
					value:
						"Restricts $number to the range between `$min` and `$max`. If `$number` is less than `$min` this returns `$min`, and if it's greater than `$max` this returns `$max`.\n\n[Sass reference](https://sass-lang.com/documentation/modules/math#clamp)",
				},
				label: "clamp($min, $number, $max)",
				parameters: [
					{
						label: "$min",
					},
					{
						label: "$number",
					},
					{
						label: "$max",
					},
				],
			},
		],
		activeParameter: 2,
		activeSignature: 0,
	});
});

test("provides signature help for sass built-ins with named parameters in signature info", async () => {
	const document = fileSystemProvider.createDocument(
		[
			"@use 'sass:color';",
			".foo {",
			"  $_primary: #303030;",
			"  background-color: color.adjust($_primary, 100, 1,);",
			"}",
		],
		{ uri: "builtins.scss" },
	);

	const help = await ls.doSignatureHelp(document, Position.create(3, 51));

	assert.deepStrictEqual(help, {
		signatures: [
			{
				documentation: {
					kind: "markdown",
					value:
						"Increases or decreases one or more properties of `$color` by fixed amounts. All optional arguments must be numbers.\n\nIt's an error to specify an RGB property at the same time as an HSL property, or either of those at the same time as an HWB property.\n\n[Sass reference](https://sass-lang.com/documentation/modules/color#adjust)",
				},
				label:
					"adjust($color, $red: null, $green: null, $blue: null, $hue: null, $saturation: null, $lightness: null, $whiteness: null, $blackness: null, $alpha: null)",
				parameters: [
					{
						label: "$color",
					},
					{
						label: "$red",
					},
					{
						label: "$green",
					},
					{
						label: "$blue",
					},
					{
						label: "$hue",
					},
					{
						label: "$saturation",
					},
					{
						label: "$lightness",
					},
					{
						label: "$whiteness",
					},
					{
						label: "$blackness",
					},
					{
						label: "$alpha",
					},
				],
			},
		],
		activeParameter: 3,
		activeSignature: 0,
	});
});
