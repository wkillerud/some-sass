import { test, assert, beforeEach } from "vitest";
import { getLanguageService } from "../../language-services";
import { Position } from "../../language-services-types";
import { getOptions } from "../../utils/test-helpers";

const { fileSystemProvider, ...rest } = getOptions();
const ls = getLanguageService({ fileSystemProvider, ...rest });

beforeEach(() => {
	ls.clearCache();
});

test("sassdoc comment block for mixin", async () => {
	const document = fileSystemProvider.createDocument([
		"$a: 1;",
		"",
		"///",
		"@mixin interactive() { color: blue; }",
	]);

	const { items } = await ls.doComplete(document, Position.create(2, 3));
	assert.equal(items.length, 1, "Expected to get a completion result");
	assert.deepStrictEqual(items[0], {
		insertText: " ${0}\n/// @output ${1}",
		insertTextFormat: 2,
		label: "SassDoc Block",
		sortText: "-",
	});
});

test("sassdoc comment block for mixin with parameters", async () => {
	const document = fileSystemProvider.createDocument([
		"$a: 1;",
		"",
		"///",
		"@mixin interactive($color: blue) { color: $color; }",
	]);

	const { items } = await ls.doComplete(document, Position.create(2, 3));
	assert.equal(items.length, 1, "Expected to get a completion result");
	assert.deepStrictEqual(items[0], {
		insertText:
			" ${0}\n/// @param {${1:type}} \\$color [blue] ${2:-}\n/// @output ${3}",
		insertTextFormat: 2,
		label: "SassDoc Block",
		sortText: "-",
	});
});

test("sassdoc comment block for function with parameters", async () => {
	const document = fileSystemProvider.createDocument([
		"$a: 1;",
		"",
		"///",
		"@function interactive($color: blue) { @return $color; }",
	]);

	const { items } = await ls.doComplete(document, Position.create(2, 3));
	assert.equal(items.length, 1, "Expected to get a completion result");
	assert.deepStrictEqual(items[0], {
		insertText:
			" ${0}\n/// @param {${1:type}} \\$color [blue] ${2:-}\n/// @return {${3:type}} ${4:-}",
		insertTextFormat: 2,
		label: "SassDoc Block",
		sortText: "-",
	});
});

test("sassdoc comment block for mixin with @content", async () => {
	const document = fileSystemProvider.createDocument([
		"$a: 1;",
		"",
		"///",
		"@mixin apply-to-ie6-only {",
		"	* html {",
		"		@content;",
		"	}",
		"}",
	]);

	const { items } = await ls.doComplete(document, Position.create(2, 3));
	assert.equal(items.length, 1, "Expected to get a completion result");
	assert.deepStrictEqual(items[0], {
		insertText: " ${0}\n/// @content ${1}\n/// @output ${2}",
		insertTextFormat: 2,
		label: "SassDoc Block",
		sortText: "-",
	});
});

test("sassdoc comment block for mixin with parameters and @content", async () => {
	const document = fileSystemProvider.createDocument([
		"$a: 1;",
		"",
		"///",
		"@mixin apply-to-ie6-only($color: #fff, $visibility: hidden) {",
		"	* html {",
		"   color: $color;",
		"   visibility: $visibility;",
		"		@content;",
		"	}",
		"}",
	]);

	const { items } = await ls.doComplete(document, Position.create(2, 3));
	assert.equal(items.length, 1, "Expected to get a completion result");
	assert.deepStrictEqual(items[0], {
		insertText:
			" ${0}\n/// @param {${1:Color}} \\$color [#fff] ${2:-}\n/// @param {${3:type}} \\$visibility [hidden] ${4:-}\n/// @content ${5}\n/// @output ${6}",
		insertTextFormat: 2,
		label: "SassDoc Block",
		sortText: "-",
	});
});

test("sassdoc annotation values for @example", async () => {
	const document = fileSystemProvider.createDocument("/// @example ");
	const { items } = await ls.doComplete(document, Position.create(0, 13));
	assert.notEqual(items.length, 0, "Expected to get completion results");
	assert.deepStrictEqual(items, [
		{
			kind: 12,
			label: "scss",
			sortText: "-",
		},
		{
			kind: 12,
			label: "css",
		},
		{
			kind: 12,
			label: "markup",
		},
		{
			kind: 12,
			label: "javascript",
			sortText: "y",
		},
	]);
});

test("sassdoc annotations", async () => {
	const document = fileSystemProvider.createDocument("/// ");
	const { items } = await ls.doComplete(document, Position.create(0, 4));
	assert.notEqual(items.length, 0, "Expected to get completion results");

	// Quick sampling of the results
	assert.ok(
		items.find((annotation) => annotation.label === "@access"),
		"Expected to find @access annotation",
	);
	assert.ok(
		items.find((annotation) => annotation.label === "@type"),
		"Expected to find @type annotation",
	);
});

test("sassdoc string literal union type", async () => {
	const one = fileSystemProvider.createDocument(
		[
			"/// Get a timing value for use in animations.",
			'/// @param {"sonic" | "link" | "homer" | "snorlax"} $mode - The timing you want',
			"/// @return {String} - the timing value in ms",
			"@function timing($mode) {",
			"	@if map.has-key($_timings, $mode) {",
			"			@return map.get($_timings, $mode);",
			"	} @else {",
			"			@error 'Unable to find a mode for #{$mode}';",
			"	}",
			"}",
		],
		{ uri: "timing.scss" },
	);
	const two = fileSystemProvider.createDocument([
		'@use "./timing" as t;',
		".a {",
		"	transition-duration: t.timi",
		"}",
	]);

	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const result = await ls.doComplete(two, Position.create(2, 28));

	assert.deepStrictEqual(result, {
		isIncomplete: false,
		items: [
			{
				documentation: {
					kind: "markdown",
					value: `\`\`\`scss
@function timing($mode)
\`\`\`
____
Get a timing value for use in animations.


@param "sonic" | "link" | "homer" | "snorlax"\`mode\` - The timing you want

@return String - the timing value in ms
____
Function declared in timing.scss`,
				},
				filterText: "t.timing",
				insertText: '.timing(${1|"sonic","link","homer","snorlax"|})',
				insertTextFormat: 2,
				kind: 3,
				label: "timing",
				labelDetails: {
					detail: "($mode)",
				},
				sortText: undefined,
				tags: [],
			},
		],
	});
});
