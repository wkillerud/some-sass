import { test, assert, beforeEach } from "vitest";
import { Position, getLanguageService } from "../language-services";
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
	assert.ok(
		items.find((annotation) => annotation.label === "$pi"),
		`Expected to find $pi entry, got ${JSON.stringify(items)}`,
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
	assert.ok(
		items.find((annotation) => annotation.label === "$primary"),
		`Expected to find $primary entry, got ${JSON.stringify(items)}`,
	);
});
