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

test("should suggest symbol from a different document via @use when in @debug", async () => {
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: true,
		},
	});

	const one = fileSystemProvider.createDocument("$primary: limegreen;", {
		uri: "one.scss",
	});
	const two = fileSystemProvider.createDocument(
		['@use "./one";', "@debug one."],
		{
			uri: "two.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const { items } = await ls.doComplete(two, Position.create(1, 11));
	assert.ok(items.find((annotation) => annotation.label === "$primary"));
});

test("should suggest symbol from a different document via @use when in @warn", async () => {
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: true,
		},
	});

	const one = fileSystemProvider.createDocument("$primary: limegreen;", {
		uri: "one.scss",
	});
	const two = fileSystemProvider.createDocument(
		['@use "./one";', "@warn one."],
		{
			uri: "two.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const { items } = await ls.doComplete(two, Position.create(1, 11));
	assert.ok(items.find((annotation) => annotation.label === "$primary"));
});

test("should suggest symbol from a different document via @use when in @error", async () => {
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: true,
		},
	});

	const one = fileSystemProvider.createDocument("$primary: limegreen;", {
		uri: "one.scss",
	});
	const two = fileSystemProvider.createDocument(
		['@use "./one";', "@error one."],
		{
			uri: "two.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const { items } = await ls.doComplete(two, Position.create(1, 11));
	assert.ok(items.find((annotation) => annotation.label === "$primary"));
});
