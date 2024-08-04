import { test, assert, beforeEach } from "vitest";
import { getLanguageService } from "../../language-services";
import { Position } from "../../language-services-types";
import { getOptions } from "../../utils/test-helpers";

const { fileSystemProvider, ...rest } = getOptions();
const ls = getLanguageService({ fileSystemProvider, ...rest });

beforeEach(() => {
	ls.clearCache();
	ls.configure({}); // Reset any configuration to default
});

test("should not suggest mixin or placeholder in string interpolation", async () => {
	ls.configure({
		completionSettings: {
			suggestAllFromOpenDocument: true,
			suggestFromUseOnly: false,
		},
	});

	const one = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"@function compare($a: 1, $b) {}",
		"%placeholder { color: blue; }",
		'$interpolation: "/some/#{',
	]);

	ls.parseStylesheet(one);

	const { items } = await ls.doComplete(one, Position.create(4, 25));

	assert.ok(items.find((item) => item.label === "$name"));
	assert.ok(items.find((item) => item.label === "compare"));
	assert.isUndefined(items.find((item) => item.label === "mixin"));
	assert.isUndefined(items.find((item) => item.label === "%placeholder"));
});

test("should not suggest module mixin in string interpolation", async () => {
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: true,
		},
	});

	const one = fileSystemProvider.createDocument(
		["$primary: limegreen;", "@mixin mixin($a: 1, $b) {}"],
		{
			uri: "one.scss",
		},
	);
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
	assert.equal(items.length, 1);
	assert.ok(items.find((annotation) => annotation.label === "$primary"));
	assert.isUndefined(items.find((item) => item.label === "mixin"));
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

test("should suggest symbols when interpolation is part of CSS selector", async () => {
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: true,
		},
	});

	const one = fileSystemProvider.createDocument("$selector: 'test';", {
		uri: "one.scss",
	});
	const two = fileSystemProvider.createDocument(
		['@use "./one";', ".#{one.} {}"],
		{
			uri: "two.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const { items } = await ls.doComplete(two, Position.create(1, 7));
	assert.ok(items.find((annotation) => annotation.label === "$selector"));
});
