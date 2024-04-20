import { assert, test, beforeEach } from "vitest";
import { getLanguageService } from "../../language-services";
import { Position, Range } from "../../language-services-types";
import { getOptions } from "../../utils/test-helpers";

const { fileSystemProvider, ...rest } = getOptions();
const ls = getLanguageService({ fileSystemProvider, ...rest });

beforeEach(() => {
	ls.clearCache();
});

test("rename variable", async () => {
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

	const position = Position.create(1, 26);
	const preparation = await ls.prepareRename(two, position);

	assert.isNotNull(preparation);

	const edits = await ls.doRename(
		two,
		// @ts-expect-error the range is there
		(preparation.range as Range).start,
		"gato",
	);

	assert.isNotNull(edits);

	const changes = Object.values(edits!.changes!);
	assert.equal(changes.length, 2);

	const [ki, helen] = changes;
	assert.deepStrictEqual(ki, [
		{
			newText: "gato",
			// range to be replaced
			range: {
				start: {
					line: 0,
					character: 1,
				},
				end: {
					line: 0,
					character: 4,
				},
			},
		},
	]);
	assert.deepStrictEqual(helen, [
		{
			newText: "gato",
			// range to be replaced
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
		},
	]);
});

test("rename prefixed variable", async () => {
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

	assert.isNotNull(preparation);

	const edits = await ls.doRename(
		three,
		// @ts-expect-error the range is there
		(preparation.range as Range).start,
		"gato",
	);

	assert.isNotNull(edits);

	const changes = Object.values(edits!.changes!);
	assert.equal(changes.length, 2);

	const [ki, helen] = changes;
	assert.deepStrictEqual(ki, [
		{
			newText: "gato",
			// range to be replaced
			range: {
				start: {
					line: 0,
					character: 1,
				},
				end: {
					line: 0,
					character: 4,
				},
			},
		},
	]);
	assert.deepStrictEqual(helen, [
		{
			newText: "gato",
			// range to be replaced
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
		},
	]);
});

test("rename placeholder", async () => {
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

	const edits = await ls.doRename(
		two,
		// @ts-expect-error the range is there
		(preparation.range as Range).start,
		"gato",
	);

	assert.isNotNull(edits);

	const changes = Object.values(edits!.changes!);
	assert.equal(changes.length, 2);

	const [ki, helen] = changes;
	assert.deepStrictEqual(ki, [
		{
			newText: "gato",
			// range to be replaced
			range: {
				start: {
					line: 0,
					character: 1,
				},
				end: {
					line: 0,
					character: 6,
				},
			},
		},
	]);
	assert.deepStrictEqual(helen, [
		{
			newText: "gato",
			// range to be replaced
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
		},
	]);
});
