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

test("should find color information from variable referenced by another variable", async () => {
	// the design tokens case
	const tokens = fileSystemProvider.createDocument(
		[
			"$_color-black: #000",
			"$_color-white: #fff",
			"$color-background-light: $_color-white",
			"$color-text-on-light: $_color-black",
		],
		{
			uri: "_tokens.sass",
			languageId: "sass",
		},
	);
	const styles = fileSystemProvider.createDocument(
		[
			'@use "./tokens";',
			"body",
			"  --color-body-background: #{tokens.$color-background-light}",
			"  --color-body-text: #{tokens.$color-text-on-light}",
		],
		{ uri: "styles.sass", languageId: "sass" },
	);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(tokens);
	ls.parseStylesheet(styles);

	const [colorInformation] = await ls.findColors(styles);
	assert.deepStrictEqual(colorInformation, {
		color: {
			alpha: 1,
			blue: 1,
			green: 1,
			red: 1,
		},
		range: {
			end: {
				character: 59,
				line: 2,
			},
			start: {
				character: 36,
				line: 2,
			},
		},
	});
});
