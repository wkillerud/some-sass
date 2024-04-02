import { test, assert, beforeEach } from "vitest";
import {
	CompletionItemKind,
	InsertTextFormat,
	Position,
	getLanguageService,
} from "../language-services";
import { getOptions } from "../utils/test-helpers";

const { fileSystemProvider, ...rest } = getOptions();
const ls = getLanguageService({ fileSystemProvider, ...rest });

beforeEach(() => {
	ls.clearCache();
});

test("suggests built-in sass modules", async () => {
	const document = fileSystemProvider.createDocument([
		'@use "sass:math";',
		"$var: math.",
	]);
	const { items } = await ls.doComplete(document, Position.create(1, 11));
	assert.notEqual(
		items.length,
		0,
		"Expected to get completions from the sass:math module",
	);

	// Quick sampling of the results
	assert.deepStrictEqual(
		items.find((annotation) => annotation.label === "$pi"),
		{
			documentation: {
				kind: "markdown",
				value:
					"The value of the mathematical constant **π**.\n\n[Sass documentation](https://sass-lang.com/documentation/modules/math#$pi)",
			},
			filterText: "math.$pi",
			insertText: ".$pi",
			insertTextFormat: InsertTextFormat.PlainText,
			kind: CompletionItemKind.Variable,
			label: "$pi",
			labelDetails: {
				detail: undefined,
			},
		},
	);
});

test("should suggest symbol from a different document via @use", async () => {
	const one = fileSystemProvider.createDocument("$primary: limegreen;", {
		uri: "one.scss",
	});
	const two = fileSystemProvider.createDocument(
		['@use "./one";', ".a { color: one."],
		{
			uri: "two.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const { items } = await ls.doComplete(two, Position.create(1, 16));
	assert.notEqual(
		0,
		items.length,
		"Expected to find a completion item for $primary",
	);
	assert.deepStrictEqual(
		items.find((annotation) => annotation.label === "$primary"),
		{
			commitCharacters: [";", ","],
			documentation: "limegreen\n____\nVariable declared in one.scss",
			filterText: undefined,
			insertText: undefined,
			kind: CompletionItemKind.Color,
			label: "$primary",
			sortText: undefined,
			tags: [],
		},
	);
});

test("should suggest prefixed symbol from a different document via @use and", async () => {
	const one = fileSystemProvider.createDocument("$primary: limegreen;", {
		uri: "one.scss",
	});
	const two = fileSystemProvider.createDocument('@forward "./one" as foo-*;', {
		uri: "two.scss",
	});
	const three = fileSystemProvider.createDocument(
		['@use "./two";', ".a { color: two."],
		{
			uri: "three.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);
	ls.parseStylesheet(three);

	const { items } = await ls.doComplete(three, Position.create(1, 16));
	assert.notEqual(
		0,
		items.length,
		"Expected to find a completion item for $foo-primary",
	);
	assert.deepStrictEqual(
		items.find((annotation) => annotation.label === "$foo-primary"),
		{
			commitCharacters: [";", ","],
			documentation: "limegreen\n____\nVariable declared in one.scss",
			filterText: undefined,
			insertText: undefined,
			kind: CompletionItemKind.Color,
			label: "$foo-primary",
			sortText: undefined,
			tags: [],
		},
	);
});

test("should not include hidden symbol", async () => {
	const one = fileSystemProvider.createDocument(
		["$primary: limegreen;", "$secret: red;"],
		{
			uri: "one.scss",
		},
	);
	const two = fileSystemProvider.createDocument(
		'@forward "./one" hide $secret;',
		{
			uri: "two.scss",
		},
	);
	const three = fileSystemProvider.createDocument(
		['@use "./two";', ".a { color: two."],
		{
			uri: "three.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);
	ls.parseStylesheet(three);

	const { items } = await ls.doComplete(three, Position.create(1, 16));
	assert.notExists(
		items.find((item) => item.label === "$secret"),
		"Expected not to find hidden symbol $secret",
	);
});

test("should not include private symbol", async () => {
	const one = fileSystemProvider.createDocument(
		["$primary: limegreen;", "$_private: red;"],
		{
			uri: "one.scss",
		},
	);
	const two = fileSystemProvider.createDocument('@forward "./one";', {
		uri: "two.scss",
	});
	const three = fileSystemProvider.createDocument(
		['@use "./two";', ".a { color: two."],
		{
			uri: "three.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);
	ls.parseStylesheet(three);

	const { items } = await ls.doComplete(three, Position.create(1, 16));
	assert.notExists(
		items.find((item) => item.label === "$_private"),
		"Expected not to find hidden symbol $_private",
	);
});

test("should only include shown symbol", async () => {
	const one = fileSystemProvider.createDocument(
		["$primary: limegreen;", "$secondary: yellow;", "$public: red;"],
		{
			uri: "one.scss",
		},
	);
	const two = fileSystemProvider.createDocument(
		'@forward "./one" show $public;',
		{
			uri: "two.scss",
		},
	);
	const three = fileSystemProvider.createDocument(
		['@use "./two";', ".a { color: two."],
		{
			uri: "three.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);
	ls.parseStylesheet(three);

	const { items } = await ls.doComplete(three, Position.create(1, 16));
	assert.exists(
		items.find((item) => item.label === "$public"),
		"Expected to find shown symbol $public",
	);
	assert.notExists(
		items.find((item) => item.label === "$primary"),
		"Expected not to find hidden symbol $primary",
	);
	assert.notExists(
		items.find((item) => item.label === "$secondary"),
		"Expected not to find hidden symbol $secondary",
	);
});

test("should suggest mixin with no parameter", async () => {
	const one = fileSystemProvider.createDocument(
		["@mixin primary() { color: $primary; }"],
		{ uri: "one.scss" },
	);
	const two = fileSystemProvider.createDocument([
		'@use "./one";',
		".a { @include one.",
	]);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const { items } = await ls.doComplete(two, Position.create(1, 17));
	assert.deepStrictEqual(
		items.find((item) => item.label === "primary"),
		{
			documentation: {
				kind: "markdown",
				value:
					"```scss\n@mixin primary()\n```\n____\nMixin declared in one.scss",
			},
			filterText: "one.primary",
			insertText: ".primary",
			kind: CompletionItemKind.Method,
			label: "primary",
			sortText: undefined,
			tags: [],
		},
	);
});

test("should suggest mixin with optional parameter", async () => {
	const one = fileSystemProvider.createDocument(
		["@mixin primary($color: red) { color: $color; }"],
		{ uri: "one.scss" },
	);
	const two = fileSystemProvider.createDocument([
		'@use "./one";',
		".a { @include one.",
	]);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const { items } = await ls.doComplete(two, Position.create(1, 17));
	assert.deepStrictEqual(
		items.filter((item) => item.label === "primary"),
		[
			{
				detail: "($color: red)",
				documentation: {
					kind: "markdown",
					value:
						"```scss\n@mixin primary($color: red)\n```\n____\nMixin declared in one.scss",
				},
				filterText: "one.primary",
				insertText: ".primary(${1:color})",
				kind: CompletionItemKind.Method,
				label: "primary",
				sortText: undefined,
				tags: [],
			},
		],
	);
});

test("should suggest mixin with required parameter", async () => {
	const one = fileSystemProvider.createDocument(
		["@mixin primary($color) { color: $color; }"],
		{ uri: "one.scss" },
	);
	const two = fileSystemProvider.createDocument([
		'@use "./one";',
		".a { @include one.",
	]);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const { items } = await ls.doComplete(two, Position.create(1, 17));
	assert.deepStrictEqual(
		items.filter((item) => item.label === "primary"),
		[
			{
				detail: "($color)",
				documentation: {
					kind: "markdown",
					value:
						"```scss\n@mixin primary($color)\n```\n____\nMixin declared in one.scss",
				},
				filterText: "one.primary",
				insertText: ".primary(${1:color})",
				kind: CompletionItemKind.Method,
				label: "primary",
				sortText: undefined,
				tags: [],
			},
		],
	);
});

test("given both required and optional parameters should suggest two variants of mixin - one with all parameters and one with only required", async () => {
	const one = fileSystemProvider.createDocument(
		[
			"@mixin primary($background, $color: red) { color: $color; background-color: $background; }",
		],
		{ uri: "one.scss" },
	);
	const two = fileSystemProvider.createDocument([
		'@use "./one";',
		".a { @include one.",
	]);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const { items } = await ls.doComplete(two, Position.create(1, 17));
	assert.deepStrictEqual(
		items.filter((item) => item.label === "primary"),
		[
			{
				detail: "($background)",
				documentation: {
					kind: "markdown",
					value:
						"```scss\n@mixin primary($background, $color: red)\n```\n____\nMixin declared in one.scss",
				},
				filterText: "one.primary",
				insertText: ".primary(${1:background})",
				kind: 2,
				label: "primary",
				sortText: undefined,
				tags: [],
			},
			{
				detail: "($background, $color: red)",
				documentation: {
					kind: "markdown",
					value:
						"```scss\n@mixin primary($background, $color: red)\n```\n____\nMixin declared in one.scss",
				},
				filterText: "one.primary",
				insertText: ".primary(${1:background}, ${2:color})",
				kind: 2,
				label: "primary",
				sortText: undefined,
				tags: [],
			},
		],
	);
});

test("should suggest function with no parameter", async () => {
	const one = fileSystemProvider.createDocument(
		["@function primary() { @return $primary; }"],
		{ uri: "one.scss" },
	);
	const two = fileSystemProvider.createDocument([
		'@use "./one";',
		".a { @include one.",
	]);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const { items } = await ls.doComplete(two, Position.create(1, 17));
	assert.deepStrictEqual(
		items.find((item) => item.label === "primary"),
		{
			detail: "()",
			documentation: {
				kind: "markdown",
				value:
					"```scss\n@function primary()\n```\n____\nFunction declared in one.scss",
			},
			filterText: "one.primary",
			insertText: ".primary()",
			kind: CompletionItemKind.Function,
			label: "primary",
			sortText: undefined,
			tags: [],
		},
	);
});

test("should suggest function with optional parameter", async () => {
	const one = fileSystemProvider.createDocument(
		["@function primary($color: red) { @return $color; }"],
		{ uri: "one.scss" },
	);
	const two = fileSystemProvider.createDocument([
		'@use "./one";',
		".a { @include one.",
	]);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const { items } = await ls.doComplete(two, Position.create(1, 17));
	assert.deepStrictEqual(
		items.find((item) => item.label === "primary"),
		{
			detail: "()",
			documentation: {
				kind: "markdown",
				value:
					"```scss\n@function primary($color: red)\n```\n____\nFunction declared in one.scss",
			},
			filterText: "one.primary",
			insertText: ".primary()",
			kind: CompletionItemKind.Function,
			label: "primary",
			sortText: undefined,
			tags: [],
		},
	);
});

test("should suggest function with required parameter", async () => {
	const one = fileSystemProvider.createDocument(
		["@function primary($color) { @return $color; }"],
		{ uri: "one.scss" },
	);
	const two = fileSystemProvider.createDocument([
		'@use "./one";',
		".a { @include one.",
	]);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const { items } = await ls.doComplete(two, Position.create(1, 17));
	assert.deepStrictEqual(
		items.find((item) => item.label === "primary"),
		{
			detail: "($color)",
			documentation: {
				kind: "markdown",
				value:
					"```scss\n@function primary($color)\n```\n____\nFunction declared in one.scss",
			},
			filterText: "one.primary",
			insertText: ".primary(${1:color})",
			kind: CompletionItemKind.Function,
			label: "primary",
			sortText: undefined,
			tags: [],
		},
	);
});

test("given both required and optional parameters should suggest two variants of function - one with all parameters and one with only required", async () => {
	const one = fileSystemProvider.createDocument(
		["@function primary($a, $b: 1) { @return $a * $b; }"],
		{ uri: "one.scss" },
	);
	const two = fileSystemProvider.createDocument([
		'@use "./one";',
		".a { @include one.",
	]);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const { items } = await ls.doComplete(two, Position.create(1, 17));
	assert.deepStrictEqual(
		items.filter((item) => item.label === "primary"),
		[
			{
				detail: "($a)",
				documentation: {
					kind: "markdown",
					value:
						"```scss\n@function primary($a, $b: 1)\n```\n____\nFunction declared in one.scss",
				},
				filterText: "one.primary",
				insertText: ".primary(${1:a})",
				kind: CompletionItemKind.Function,
				label: "primary",
				sortText: undefined,
				tags: [],
			},
			{
				detail: "($a, $b: 1)",
				documentation: {
					kind: "markdown",
					value:
						"```scss\n@function primary($a, $b: 1)\n```\n____\nFunction declared in one.scss",
				},
				filterText: "one.primary",
				insertText: ".primary(${1:a}, ${2:b})",
				kind: CompletionItemKind.Function,
				label: "primary",
				sortText: undefined,
				tags: [],
			},
		],
	);
});
