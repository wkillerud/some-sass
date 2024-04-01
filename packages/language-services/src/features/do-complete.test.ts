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

test("should not include priavet symbol", async () => {
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
