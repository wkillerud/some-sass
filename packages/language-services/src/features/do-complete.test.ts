import { test, assert, beforeEach } from "vitest";
import { Position, getLanguageService } from "../language-services";
import { getOptions } from "../utils/test-helpers";

const { fileSystemProvider, ...rest } = getOptions();
const ls = getLanguageService({ fileSystemProvider, ...rest });

beforeEach(() => {
	ls.clearCache();
});

test("suggests built-in sass modules for imports", async () => {
	const document = fileSystemProvider.createDocument([
		'@use "sass:math";',
		"$var: math.",
	]);
	const { items } = await ls.doComplete(document, Position.create(1, 11));
	assert.notEqual(
		items.length,
		0,
		"Expected to get built-in Sass modules as completions",
	);

	// Quick sampling of the results
	assert.ok(
		items.find((annotation) => annotation.label === "$pi"),
		`Expected to find $pi entry, got ${JSON.stringify(items)}`,
	);
});
