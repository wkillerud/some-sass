import { test, assert, beforeEach } from "vitest";
import { getLanguageService } from "../../language-services";
import { getOptions } from "../../utils/test-helpers";

const { fileSystemProvider, ...rest } = getOptions();
const ls = getLanguageService({ fileSystemProvider, ...rest });

beforeEach(() => {
	ls.clearCache();
});

test("should find color information from the variable declaration", async () => {
	const one = fileSystemProvider.createDocument("$a: red;", {
		uri: "one.scss",
	});
	const two = fileSystemProvider.createDocument([
		'@use "./one";',
		".a { content: one.$a; }",
	]);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const [colorInformation] = await ls.findColors(two);
	assert.deepStrictEqual(colorInformation, {
		color: {
			alpha: 1,
			blue: 0,
			green: 0,
			red: 1,
		},
		range: {
			end: {
				character: 20,
				line: 1,
			},
			start: {
				character: 18,
				line: 1,
			},
		},
	});
});
