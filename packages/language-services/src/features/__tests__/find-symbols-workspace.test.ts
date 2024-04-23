import { test, assert, beforeEach } from "vitest";
import { getLanguageService } from "../../language-services";
import { getOptions } from "../../utils/test-helpers";

const { fileSystemProvider, ...rest } = getOptions();
const ls = getLanguageService({ fileSystemProvider, ...rest });

beforeEach(() => {
	ls.clearCache();
});

test("empty query returns all workspace symbols", async () => {
	const one = fileSystemProvider.createDocument(
		[
			"$vone: 1;",
			"@mixin mone() { @content; }",
			"@function fone() { @return; }",
		],
		{ uri: "one.scss" },
	);
	const two = fileSystemProvider.createDocument(
		[
			"$vone: 1;",
			"@mixin mone() { @content; }",
			"@function fone() { @return; }",
		],
		{
			uri: "two.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const result = ls.findWorkspaceSymbols("");

	assert.equal(result.length, 6);
});

test("returns workspace symbols matching query", async () => {
	const one = fileSystemProvider.createDocument(
		[
			"$vone: 1;",
			"@mixin mone() { @content; }",
			"@function fone() { @return; }",
		],
		{ uri: "one.scss" },
	);
	const two = fileSystemProvider.createDocument(
		[
			"$vtwo: 1;",
			"@mixin mtwo() { @content; }",
			"@function ftwo() { @return; }",
		],
		{
			uri: "two.scss",
		},
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const result = ls.findWorkspaceSymbols("two");

	assert.equal(result.length, 3);
});
