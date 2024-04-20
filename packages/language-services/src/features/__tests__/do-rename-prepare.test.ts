import { assert, test, beforeEach } from "vitest";
import { getLanguageService } from "../../language-services";
import { Position } from "../../language-services-types";
import { getOptions } from "../../utils/test-helpers";

const { fileSystemProvider, ...rest } = getOptions();
const ls = getLanguageService({ fileSystemProvider, ...rest });

beforeEach(() => {
	ls.clearCache();
});

test("excludes the $ of a variable from the renaming", async () => {
	const one = fileSystemProvider.createDocument('$day: "monday";', {
		uri: "ki.scss",
	});
	const two = fileSystemProvider.createDocument(
		['@use "ki";', ".a::after { content: ki.$day; }"],
		{
			uri: "helen.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const preparation = await ls.prepareRename(two, Position.create(1, 26));

	assert.deepStrictEqual(preparation, {
		placeholder: "day",
		range: {
			start: {
				line: 1,
				character: 25,
			},
			end: {
				line: 1,
				character: 28,
			},
		},
	});
});

test("excludes the % of a placeholder from the renaming", async () => {
	const one = fileSystemProvider.createDocument("%alert {	color: blue; }", {
		uri: "place.scss",
	});
	const two = fileSystemProvider.createDocument(
		['@use "place";', ".a { @extend %alert; }"],
		{
			uri: "first.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const preparation = await ls.prepareRename(two, Position.create(1, 15));

	assert.deepStrictEqual(preparation, {
		placeholder: "alert",
		range: {
			start: {
				line: 1,
				character: 14,
			},
			end: {
				line: 1,
				character: 19,
			},
		},
	});
});

test("excludes any forward prefix from the renaming, only including the base symbol name that is the same across the workspace", async () => {
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

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);
	ls.parseStylesheet(three);

	const preparation = await ls.prepareRename(three, Position.create(1, 30));

	assert.deepStrictEqual(preparation, {
		placeholder: "day",
		range: {
			start: {
				line: 1,
				character: 29,
			},
			end: {
				line: 1,
				character: 32,
			},
		},
	});
});
