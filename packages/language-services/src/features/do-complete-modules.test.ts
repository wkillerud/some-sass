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
	ls.configure({}); // Reset any configuration to default
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
			insertText: "$pi",
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
			filterText: "one.$primary",
			insertText: "$primary",
			kind: CompletionItemKind.Color,
			label: "$primary",
			sortText: undefined,
			tags: [],
		},
	);
});

test("should suggest symbol from a different document via @use when in string interpolation", async () => {
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: true,
		},
	});

	const one = fileSystemProvider.createDocument("$primary: limegreen;", {
		uri: "one.scss",
	});
	const two = fileSystemProvider.createDocument(
		['@use "./one";', '.a { background: url("/#{one.'],
		{
			uri: "two.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const { items } = await ls.doComplete(two, Position.create(1, 29));
	assert.ok(items.find((annotation) => annotation.label === "$primary"));
});

test("should suggest symbol from a different document via @use when in @return", async () => {
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: true,
		},
	});

	const one = fileSystemProvider.createDocument("$primary: limegreen;", {
		uri: "one.scss",
	});
	const two = fileSystemProvider.createDocument(
		['@use "./one";', "@function test() { @return one."],
		{
			uri: "two.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const { items } = await ls.doComplete(two, Position.create(1, 31));
	assert.ok(items.find((annotation) => annotation.label === "$primary"));
});

test("should suggest symbol from a different document via @use when in @if", async () => {
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: true,
		},
	});

	const one = fileSystemProvider.createDocument("$primary: limegreen;", {
		uri: "one.scss",
	});
	const two = fileSystemProvider.createDocument(['@use "./one";', "@if one."], {
		uri: "two.scss",
	});

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const { items } = await ls.doComplete(two, Position.create(1, 8));
	assert.ok(items.find((annotation) => annotation.label === "$primary"));
});

test("should suggest symbol from a different document via @use when in @else if", async () => {
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: true,
		},
	});

	const one = fileSystemProvider.createDocument("$primary: limegreen;", {
		uri: "one.scss",
	});
	const two = fileSystemProvider.createDocument(
		['@use "./one";', "@if $foo {", "} @else if one."],
		{
			uri: "two.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const { items } = await ls.doComplete(two, Position.create(2, 15));
	assert.ok(items.find((annotation) => annotation.label === "$primary"));
});

test("should suggest symbol from a different document via @use when in @each", async () => {
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: true,
		},
	});

	const one = fileSystemProvider.createDocument("$primary: limegreen;", {
		uri: "one.scss",
	});
	const two = fileSystemProvider.createDocument(
		['@use "./one";', "@each $foo in one."],
		{
			uri: "two.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const { items } = await ls.doComplete(two, Position.create(1, 18));
	assert.ok(items.find((annotation) => annotation.label === "$primary"));
});

test("should suggest symbol from a different document via @use when in @for", async () => {
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: true,
		},
	});

	const one = fileSystemProvider.createDocument("$primary: limegreen;", {
		uri: "one.scss",
	});
	const two = fileSystemProvider.createDocument(
		['@use "./one";', "@for $i from one."],
		{
			uri: "two.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const { items } = await ls.doComplete(two, Position.create(1, 17));
	assert.ok(items.find((annotation) => annotation.label === "$primary"));
});

test("should suggest symbol from a different document via @use when in @wile", async () => {
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: true,
		},
	});

	const one = fileSystemProvider.createDocument("$primary: limegreen;", {
		uri: "one.scss",
	});
	const two = fileSystemProvider.createDocument(
		['@use "./one";', "@while $i > one."],
		{
			uri: "two.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const { items } = await ls.doComplete(two, Position.create(1, 16));
	assert.ok(items.find((annotation) => annotation.label === "$primary"));
});

test("should suggest prefixed symbol from a different document via @use and @forward", async () => {
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
			filterText: "two.$foo-primary",
			insertText: "$foo-primary",
			kind: CompletionItemKind.Color,
			label: "$foo-primary",
			sortText: undefined,
			tags: [],
		},
	);
});

test("should not include hidden symbol if configured", async () => {
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: true,
		},
	});

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

test("should only include shown symbol if configured", async () => {
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: true,
		},
	});

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
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: true,
		},
	});

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
			insertText: "primary",
			insertTextFormat: InsertTextFormat.Snippet,
			kind: CompletionItemKind.Method,
			label: "primary",
			labelDetails: undefined,
			sortText: undefined,
			tags: [],
		},
	);
});

test("should suggest mixin with optional parameter", async () => {
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: true,
		},
	});

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
				documentation: {
					kind: "markdown",
					value:
						"```scss\n@mixin primary($color: red)\n```\n____\nMixin declared in one.scss",
				},
				filterText: "one.primary",
				insertText: "primary(${1:color})",
				insertTextFormat: InsertTextFormat.Snippet,
				kind: CompletionItemKind.Method,
				label: "primary",
				labelDetails: { detail: "($color: red)" },
				sortText: undefined,
				tags: [],
			},
			{
				documentation: {
					kind: "markdown",
					value:
						"```scss\n@mixin primary($color: red)\n```\n____\nMixin declared in one.scss",
				},
				filterText: "one.primary",
				insertText: "primary(${1:color}) {\n\t$0\n}",
				insertTextFormat: InsertTextFormat.Snippet,
				kind: CompletionItemKind.Method,
				label: "primary",
				labelDetails: { detail: "($color: red) { }" },
				sortText: undefined,
				tags: [],
			},
		],
	);
});

test("should suggest mixin with required parameter", async () => {
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: true,
		},
	});

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
				documentation: {
					kind: "markdown",
					value:
						"```scss\n@mixin primary($color)\n```\n____\nMixin declared in one.scss",
				},
				filterText: "one.primary",
				insertText: "primary(${1:color})",
				insertTextFormat: InsertTextFormat.Snippet,
				kind: CompletionItemKind.Method,
				label: "primary",
				labelDetails: { detail: "($color)" },
				sortText: undefined,
				tags: [],
			},
			{
				documentation: {
					kind: "markdown",
					value:
						"```scss\n@mixin primary($color)\n```\n____\nMixin declared in one.scss",
				},
				filterText: "one.primary",
				insertText: "primary(${1:color}) {\n\t$0\n}",
				insertTextFormat: InsertTextFormat.Snippet,
				kind: CompletionItemKind.Method,
				label: "primary",
				labelDetails: { detail: "($color) { }" },
				sortText: undefined,
				tags: [],
			},
		],
	);
});

test("given both required and optional parameters should suggest two variants of mixin - one with all parameters and one with only required", async () => {
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: true,
		},
	});

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
				documentation: {
					kind: "markdown",
					value:
						"```scss\n@mixin primary($background, $color: red)\n```\n____\nMixin declared in one.scss",
				},
				filterText: "one.primary",
				insertText: "primary(${1:background})",
				insertTextFormat: InsertTextFormat.Snippet,
				kind: CompletionItemKind.Method,
				label: "primary",
				labelDetails: { detail: "($background)" },
				sortText: undefined,
				tags: [],
			},
			{
				documentation: {
					kind: "markdown",
					value:
						"```scss\n@mixin primary($background, $color: red)\n```\n____\nMixin declared in one.scss",
				},
				filterText: "one.primary",
				insertText: "primary(${1:background}) {\n\t$0\n}",
				insertTextFormat: InsertTextFormat.Snippet,
				kind: CompletionItemKind.Method,
				label: "primary",
				labelDetails: { detail: "($background) { }" },
				sortText: undefined,
				tags: [],
			},
			{
				documentation: {
					kind: "markdown",
					value:
						"```scss\n@mixin primary($background, $color: red)\n```\n____\nMixin declared in one.scss",
				},
				filterText: "one.primary",
				insertText: "primary(${1:background}, ${2:color})",
				insertTextFormat: InsertTextFormat.Snippet,
				kind: CompletionItemKind.Method,
				label: "primary",
				labelDetails: { detail: "($background, $color: red)" },
				sortText: undefined,
				tags: [],
			},
			{
				documentation: {
					kind: "markdown",
					value:
						"```scss\n@mixin primary($background, $color: red)\n```\n____\nMixin declared in one.scss",
				},
				filterText: "one.primary",
				insertText: "primary(${1:background}, ${2:color}) {\n\t$0\n}",
				insertTextFormat: InsertTextFormat.Snippet,
				kind: CompletionItemKind.Method,
				label: "primary",
				labelDetails: { detail: "($background, $color: red) { }" },
				sortText: undefined,
				tags: [],
			},
		],
	);
});

test("should suggest function with no parameter", async () => {
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: true,
		},
	});

	const one = fileSystemProvider.createDocument(
		["@function primary() { @return $primary; }"],
		{ uri: "one.scss" },
	);
	const two = fileSystemProvider.createDocument([
		'@use "./one";',
		".a { content: one.",
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
					"```scss\n@function primary()\n```\n____\nFunction declared in one.scss",
			},
			filterText: "one.primary",
			insertText: "primary()",
			insertTextFormat: InsertTextFormat.Snippet,
			kind: CompletionItemKind.Function,
			label: "primary",
			labelDetails: { detail: "()" },
			sortText: undefined,
			tags: [],
		},
	);
});

test("should suggest function with optional parameter", async () => {
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: true,
		},
	});

	const one = fileSystemProvider.createDocument(
		["@function primary($color: red) { @return $color; }"],
		{ uri: "one.scss" },
	);
	const two = fileSystemProvider.createDocument([
		'@use "./one";',
		".a { content:q one.",
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
					"```scss\n@function primary($color: red)\n```\n____\nFunction declared in one.scss",
			},
			filterText: "one.primary",
			insertText: "primary()",
			insertTextFormat: InsertTextFormat.Snippet,
			kind: CompletionItemKind.Function,
			label: "primary",
			labelDetails: { detail: "()" },
			sortText: undefined,
			tags: [],
		},
	);
});

test("should suggest function with required parameter", async () => {
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: true,
		},
	});

	const one = fileSystemProvider.createDocument(
		["@function primary($color) { @return $color; }"],
		{ uri: "one.scss" },
	);
	const two = fileSystemProvider.createDocument([
		'@use "./one";',
		".a { content: one.",
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
					"```scss\n@function primary($color)\n```\n____\nFunction declared in one.scss",
			},
			filterText: "one.primary",
			insertText: "primary(${1:color})",
			insertTextFormat: InsertTextFormat.Snippet,
			kind: CompletionItemKind.Function,
			label: "primary",
			labelDetails: { detail: "($color)" },
			sortText: undefined,
			tags: [],
		},
	);
});

test("given both required and optional parameters should suggest two variants of function - one with all parameters and one with only required", async () => {
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: true,
		},
	});

	const one = fileSystemProvider.createDocument(
		["@function primary($a, $b: 1) { @return $a * $b; }"],
		{ uri: "one.scss" },
	);
	const two = fileSystemProvider.createDocument([
		'@use "./one";',
		".a { content: one.",
	]);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const { items } = await ls.doComplete(two, Position.create(1, 17));
	assert.deepStrictEqual(
		items.filter((item) => item.label === "primary"),
		[
			{
				documentation: {
					kind: "markdown",
					value:
						"```scss\n@function primary($a, $b: 1)\n```\n____\nFunction declared in one.scss",
				},
				filterText: "one.primary",
				insertText: "primary(${1:a})",
				insertTextFormat: InsertTextFormat.Snippet,
				kind: CompletionItemKind.Function,
				label: "primary",
				labelDetails: { detail: "($a)" },
				sortText: undefined,
				tags: [],
			},
			{
				documentation: {
					kind: "markdown",
					value:
						"```scss\n@function primary($a, $b: 1)\n```\n____\nFunction declared in one.scss",
				},
				filterText: "one.primary",
				insertText: "primary(${1:a}, ${2:b})",
				insertTextFormat: InsertTextFormat.Snippet,
				kind: CompletionItemKind.Function,
				label: "primary",
				labelDetails: { detail: "($a, $b: 1)" },
				sortText: undefined,
				tags: [],
			},
		],
	);
});

test("should suggest all symbols as legacy @import may be in use", async () => {
	const one = fileSystemProvider.createDocument("$primary: limegreen;", {
		uri: "one.scss",
	});
	const two = fileSystemProvider.createDocument(".a { color: ", {
		uri: "two.scss",
	});

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const { items } = await ls.doComplete(two, Position.create(0, 12));
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

test("should not suggest legacy @import symbols if configured", async () => {
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: true,
		},
	});

	const one = fileSystemProvider.createDocument("$primary: limegreen;", {
		uri: "one.scss",
	});
	const two = fileSystemProvider.createDocument(".a { color: ", {
		uri: "two.scss",
	});

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const { items } = await ls.doComplete(two, Position.create(0, 12));
	assert.isUndefined(
		items.find((annotation) => annotation.label === "$primary"),
		"Expected not to find a suggestion for $primary",
	);
});

test("should suggest symbol from a different document via @use with wildcard alias", async () => {
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: true,
		},
	});

	const one = fileSystemProvider.createDocument("$primary: limegreen;", {
		uri: "one.scss",
	});
	const two = fileSystemProvider.createDocument(
		['@use "./one" as *;', ".a { color: "],
		{
			uri: "two.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const { items } = await ls.doComplete(two, Position.create(1, 12));
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
