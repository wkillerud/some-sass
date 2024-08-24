import { test, assert, beforeEach } from "vitest";
import { getLanguageService } from "../../language-services";
import {
	CompletionItemKind,
	InsertTextFormat,
	Position,
} from "../../language-services-types";
import { getOptions } from "../../utils/test-helpers";

const { fileSystemProvider, ...rest } = getOptions();
const ls = getLanguageService({ fileSystemProvider, ...rest });

beforeEach(() => {
	ls.clearCache();
	ls.configure({
		scss: {
			completion: {
				suggestFromUseOnly: true,
			},
		},
		sass: {
			completion: {
				suggestFromUseOnly: true,
			},
		},
	}); // Reset any configuration to default
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

test("suggest sass built-ins that are forwarded by the stylesheet that is @used", async () => {
	const one = fileSystemProvider.createDocument(['@forward "sass:math";'], {
		uri: "test.scss",
	});
	const two = fileSystemProvider.createDocument([
		'@use "./test";',
		"$var: test.",
	]);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const { items } = await ls.doComplete(two, Position.create(1, 11));
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
			filterText: "test.$pi",
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

test("suggest sass built-ins that are forwarded with a prefix", async () => {
	const one = fileSystemProvider.createDocument(
		['@forward "sass:math" as math-*;'],
		{
			uri: "test.scss",
		},
	);
	const two = fileSystemProvider.createDocument([
		'@use "./test";',
		"$var: test.",
	]);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const { items } = await ls.doComplete(two, Position.create(1, 11));
	assert.notEqual(
		items.length,
		0,
		"Expected to get completions from the sass:math module",
	);

	// Quick sampling of the results
	assert.deepStrictEqual(
		items.find((annotation) => annotation.label === "$math-pi"),
		{
			documentation: {
				kind: "markdown",
				value:
					"The value of the mathematical constant **π**.\n\n[Sass documentation](https://sass-lang.com/documentation/modules/math#$pi)",
			},
			filterText: "test.$math-pi",
			insertText: ".$math-pi",
			insertTextFormat: InsertTextFormat.PlainText,
			kind: CompletionItemKind.Variable,
			label: "$math-pi",
			labelDetails: {
				detail: undefined,
			},
		},
	);
	assert.ok(items.find((a) => a.label === "math-clamp"));
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
			insertText: ".$primary",
			kind: CompletionItemKind.Color,
			label: "$primary",
			sortText: undefined,
			tags: [],
		},
	);
});

test("should suggest symbols from the document we use when it also forwards another document with symbols", async () => {
	const one = fileSystemProvider.createDocument("$primary: limegreen;", {
		uri: "one.scss",
	});
	const two = fileSystemProvider.createDocument(
		['@forward "./one";', "$secondary: red;"],
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
	assert.notEqual(
		0,
		items.length,
		"Expected to find a completion item for $primary",
	);
	assert.deepStrictEqual(
		items.find((annotation) => annotation.label === "$secondary"),
		{
			commitCharacters: [";", ","],
			documentation: "red\n____\nVariable declared in two.scss",
			filterText: "two.$secondary",
			insertText: ".$secondary",
			kind: CompletionItemKind.Color,
			label: "$secondary",
			sortText: undefined,
			tags: [],
		},
	);
	assert.deepStrictEqual(
		items.find((annotation) => annotation.label === "$primary"),
		{
			commitCharacters: [";", ","],
			documentation: "limegreen\n____\nVariable declared in one.scss",
			filterText: "two.$primary",
			insertText: ".$primary",
			kind: CompletionItemKind.Color,
			label: "$primary",
			sortText: undefined,
			tags: [],
		},
	);
});

test("should not suggest symbols from a module used by the one we use", async () => {
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: true,
		},
	});

	const one = fileSystemProvider.createDocument(
		['@use "./three";', "$primary: limegreen;"],
		{
			uri: "one.scss",
		},
	);
	const two = fileSystemProvider.createDocument(
		['@use "./one";', "@function test() { @return one."],
		{
			uri: "two.scss",
		},
	);
	const three = fileSystemProvider.createDocument(
		["@function three() { @return 3; }"],
		{
			uri: "three.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);
	ls.parseStylesheet(three);

	const { items } = await ls.doComplete(two, Position.create(1, 31));
	assert.notOk(items.find((annotation) => annotation.label === "three"));
	assert.ok(items.find((annotation) => annotation.label === "$primary"));
});

test("should only suggest symbols from the current namespace, not others being used", async () => {
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: true,
		},
	});

	const one = fileSystemProvider.createDocument(
		['@use "./two";', '@use "./three";', "@function test() { @return two."],
		{
			uri: "one.scss",
		},
	);
	const two = fileSystemProvider.createDocument("$two: 2;", {
		uri: "two.scss",
	});
	const three = fileSystemProvider.createDocument(
		["@function three() { @return 3; }"],
		{
			uri: "three.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);
	ls.parseStylesheet(three);

	const { items } = await ls.doComplete(one, Position.create(2, 31));
	assert.notOk(items.find((annotation) => annotation.label === "three"));
	assert.ok(items.find((annotation) => annotation.label === "$two"));
});

test("should not suggest private symbols from the current namespace", async () => {
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: true,
		},
	});

	const one = fileSystemProvider.createDocument(
		['@use "./two";', "@function test() { @return two."],
		{
			uri: "one.scss",
		},
	);
	const two = fileSystemProvider.createDocument(
		["$two: 2;", "$-three: 3;", "$_four: 4;"],
		{
			uri: "two.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const { items } = await ls.doComplete(one, Position.create(2, 31));
	assert.notOk(items.find((annotation) => annotation.label === "$_four"));
	assert.notOk(items.find((annotation) => annotation.label === "$-three"));
	assert.ok(items.find((annotation) => annotation.label === "$two"));
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

	const { items } = await ls.doComplete(two, Position.create(1, 18));
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
		['@use "./one";', "@while $i > one.$"],
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
			insertText: ".$foo-primary",
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

	const { items } = await ls.doComplete(two, Position.create(1, 18));
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

	const { items } = await ls.doComplete(two, Position.create(1, 18));
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
				insertText: ".primary(${1:color})",
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
				insertText: ".primary(${1:color}) {\n\t$0\n}",
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

	const { items } = await ls.doComplete(two, Position.create(1, 18));
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
				insertText: ".primary(${1:color})",
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
				insertText: ".primary(${1:color}) {\n\t$0\n}",
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

	const { items } = await ls.doComplete(two, Position.create(1, 18));
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
				insertText: ".primary(${1:background})",
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
				insertText: ".primary(${1:background}) {\n\t$0\n}",
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
				insertText: ".primary(${1:background}, ${2:color})",
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
				insertText: ".primary(${1:background}, ${2:color}) {\n\t$0\n}",
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

	const { items } = await ls.doComplete(two, Position.create(1, 18));
	assert.deepStrictEqual(
		items.find((item) => item.label === "primary"),
		{
			documentation: {
				kind: "markdown",
				value:
					"```scss\n@function primary()\n```\n____\nFunction declared in one.scss",
			},
			filterText: "one.primary",
			insertText: ".primary()",
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
		".a { content: one.",
	]);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const { items } = await ls.doComplete(two, Position.create(1, 18));
	assert.deepStrictEqual(
		items.find((item) => item.label === "primary"),
		{
			documentation: {
				kind: "markdown",
				value:
					"```scss\n@function primary($color: red)\n```\n____\nFunction declared in one.scss",
			},
			filterText: "one.primary",
			insertText: ".primary()",
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

	const { items } = await ls.doComplete(two, Position.create(1, 18));
	assert.deepStrictEqual(
		items.find((item) => item.label === "primary"),
		{
			documentation: {
				kind: "markdown",
				value:
					"```scss\n@function primary($color)\n```\n____\nFunction declared in one.scss",
			},
			filterText: "one.primary",
			insertText: ".primary(${1:color})",
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

	const { items } = await ls.doComplete(two, Position.create(1, 18));
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
				insertText: ".primary(${1:a})",
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
				insertText: ".primary(${1:a}, ${2:b})",
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
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: false,
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
		scss: {
			completion: {
				suggestAllFromOpenDocument: true,
				suggestFromUseOnly: true,
			},
		},
		sass: {
			completion: {
				suggestFromUseOnly: true,
			},
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
		scss: {
			completion: {
				suggestFromUseOnly: true,
			},
		},
		sass: {
			completion: {
				suggestFromUseOnly: true,
			},
		},
	});

	const one = fileSystemProvider.createDocument(
		["$primary: limegreen;", "@function one() { @return 1; }"],
		{
			uri: "one.scss",
		},
	);
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
	assert.equal(2, items.length, "Expected to find two completion items");
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
	assert.deepStrictEqual(
		items.find((annotation) => annotation.label === "one"),
		{
			documentation: {
				kind: "markdown",
				value:
					"```scss\n@function one()\n```\n____\nFunction declared in one.scss",
			},
			filterText: "one",
			insertText: "one()",
			insertTextFormat: InsertTextFormat.Snippet,
			kind: CompletionItemKind.Function,
			label: "one",
			labelDetails: {
				detail: "()",
			},
			sortText: undefined,
			tags: [],
		},
	);
});

test("does not suggest sass globals if suggestFromUseOnly is true", async () => {
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: true,
		},
	});

	const document = fileSystemProvider.createDocument("@debug co");
	const { items } = await ls.doComplete(document, Position.create(0, 9));
	assert.isUndefined(items.find((item) => item.label === "comparable"));
});

// We don't call the upstream for suggestions here since we got complaints about duplicates
test.skip("does suggest sass globals if suggestFromUseOnly is false", async () => {
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: false,
		},
	});

	const document = fileSystemProvider.createDocument("@debug co");
	const { items } = await ls.doComplete(document, Position.create(0, 9));
	assert.isOk(items.find((item) => item.label === "comparable"));
});
