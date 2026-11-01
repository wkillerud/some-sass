import { assert, describe, it } from "vitest";
import { Position } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
	isFileWhereScssCanBeEmbedded,
	getSassRegions,
	getSassContent,
	getSassRegionsDocument,
} from "../embedded";

describe("Utils/VueSvelte", () => {
	it("isFileWhereScssCanBeEmbedded", () => {
		assert.strictEqual(
			isFileWhereScssCanBeEmbedded("sdasdsa/AppButton.vue"),
			true,
		);
		assert.strictEqual(
			isFileWhereScssCanBeEmbedded("sdasdsa/AppButton.scss.vue"),
			true,
		);
		assert.strictEqual(
			isFileWhereScssCanBeEmbedded("sda.vue/AppButton.scss"),
			false,
		);
		assert.strictEqual(
			isFileWhereScssCanBeEmbedded("sdasdsa/AppButton.vue.scss"),
			false,
		);

		assert.strictEqual(
			isFileWhereScssCanBeEmbedded("sdasdsa/AppButton.svelte"),
			true,
		);
		assert.strictEqual(
			isFileWhereScssCanBeEmbedded("sdasdsa/AppButton.scss.svelte"),
			true,
		);
		assert.strictEqual(
			isFileWhereScssCanBeEmbedded("sda.svelte/AppButton.scss"),
			false,
		);
		assert.strictEqual(
			isFileWhereScssCanBeEmbedded("sdasdsa/AppButton.svelte.scss"),
			false,
		);

		assert.strictEqual(
			isFileWhereScssCanBeEmbedded("sdasdsa/AppButton.astro"),
			true,
		);
		assert.strictEqual(
			isFileWhereScssCanBeEmbedded("sdasdsa/AppButton.scss.astro"),
			true,
		);
		assert.strictEqual(
			isFileWhereScssCanBeEmbedded("sda.astro/AppButton.scss"),
			false,
		);
		assert.strictEqual(
			isFileWhereScssCanBeEmbedded("sdasdsa/AppButton.astro.scss"),
			false,
		);
	});

	it("getSCSSRegions", () => {
		assert.deepStrictEqual(
			getSassRegions('<style sdad lang="scss" afsaf sdd></style>'),
			[{ type: "scss", range: [34, 34] }],
		);
		assert.deepStrictEqual(
			getSassRegions('<style lang="scss" scoped></style>'),
			[{ type: "scss", range: [26, 26] }],
		);
		assert.deepStrictEqual(
			getSassRegions('<style lang="scss" module></style>'),
			[{ type: "scss", range: [26, 26] }],
		);
		assert.deepStrictEqual(getSassRegions('<style lang="scss"></style>'), [
			{ type: "scss", range: [19, 19] },
		]);
		assert.deepStrictEqual(getSassRegions("<style lang='scss'></style>"), [
			{ type: "scss", range: [19, 19] },
		]);
		assert.deepStrictEqual(getSassRegions('<style type="text/scss"></style>'), [
			{ type: "scss", range: [24, 24] },
		]);

		assert.deepStrictEqual(
			getSassRegions(
				"<template><p>style lang='scss'</p></template><script></script></script><style lang='scss'></style>",
			),
			[{ type: "scss", range: [90, 90] }],
		);
		assert.deepStrictEqual(
			getSassRegions(
				"<template><p>style lang='scss'</p></template><script></script></script>\n<style lang='scss'></style>",
			),
			[{ type: "scss", range: [91, 91] }],
		);
		assert.deepStrictEqual(
			getSassRegions(
				"<template><p>style lang='scss'</p></template><script></script></script>\n<style lang='scss'>\n</style>",
			),
			[{ type: "scss", range: [91, 92] }],
		);
		assert.deepStrictEqual(
			getSassRegions(
				"<template><p>style lang='scss'</p></template><script></script></script>\n<style lang='scss'>a { color: white; }</style>",
			),
			[{ type: "scss", range: [91, 110] }],
		);

		assert.deepStrictEqual(
			getSassRegions(
				"<template><p>style lang='scss'</p></template><script></script></script><style lang='scss'>a { color: white; }</style><style lang='scss' module>a { color: white; }</style>\n",
			),
			[
				{ type: "scss", range: [90, 109] },
				{ type: "scss", range: [143, 162] },
			],
		);
		assert.deepStrictEqual(
			getSassRegions(
				"<template><p>style lang='scss'</p></template><script></script></script><style lang='scss'>a { color: white; }</style><style lang='scss' module>a { color: white; }</style>\n\n<style lang='scss' module=\"a\">a { color: white; }</style>",
			),
			[
				{ type: "scss", range: [90, 109] },
				{ type: "scss", range: [143, 162] },
				{ type: "scss", range: [202, 221] },
			],
		);

		assert.deepStrictEqual(getSassRegions('<style lang="sass"></style>'), [
			{ type: "sass", range: [19, 19] },
		]);
		assert.deepStrictEqual(getSassRegions('<style type="sass"></style>'), [
			{ type: "sass", range: [19, 19] },
		]);
		assert.deepStrictEqual(getSassRegions('<style lang="stylus"></style>'), []);
		assert.deepStrictEqual(
			getSassRegions('<style lang="sass" scoped></style>'),
			[{ type: "sass", range: [26, 26] }],
		);
		assert.deepStrictEqual(getSassRegions("<style></style>"), []);
		assert.deepStrictEqual(getSassRegions('<style>lang="scss"</style>'), []);
	});

	it("getSassRegions pairs each start tag with the end tag after it", () => {
		const content = '<style>a{}</style>\n<style lang="scss">$x: 1;</style>';
		const regions = getSassRegions(content);
		assert.deepStrictEqual(regions, [{ type: "scss", range: [38, 44] }]);
		assert.strictEqual(content.slice(38, 44), "$x: 1;");
	});

	it("getSassRegions accepts attributes with special characters", () => {
		assert.deepStrictEqual(
			getSassRegions('<style data-v lang="scss"></style>'),
			[{ type: "scss", range: [26, 26] }],
		);
		assert.deepStrictEqual(
			getSassRegions('<style data-v-1a2b lang="scss" scoped></style>'),
			[{ type: "scss", range: [38, 38] }],
		);
		assert.deepStrictEqual(
			getSassRegions('<style :is-global="true" @foo lang="scss"></style>'),
			[{ type: "scss", range: [42, 42] }],
		);
		assert.deepStrictEqual(
			getSassRegions("<style scoped lang='sass'></style>"),
			[{ type: "sass", range: [26, 26] }],
		);
		assert.deepStrictEqual(getSassRegions("<style\n\tlang='scss'\n></style>"), [
			{ type: "scss", range: [21, 21] },
		]);
	});

	it("getSassRegions does not match look-alike tags and attributes", () => {
		assert.deepStrictEqual(getSassRegions('<styles lang="scss"></styles>'), []);
		assert.deepStrictEqual(
			getSassRegions('<style data-lang="scss"></style>'),
			[],
		);
		assert.deepStrictEqual(getSassRegions("<style lang=\"scss'></style>"), []);
		assert.deepStrictEqual(getSassRegions('<style lang="scss">a {}'), []);
	});

	it("getSassRegions finds several blocks of mixed types", () => {
		const content = [
			"<template><div></div></template>",
			'<style lang="scss">$a: 1;</style>',
			"<style>b{}</style>",
			"<style lang='sass'>",
			"$b: 2",
			"</style>",
			'<style type="text/scss" scoped>$c: 3;</style>',
		].join("\n");
		const regions = getSassRegions(content);
		assert.deepStrictEqual(
			regions.map(({ type, range }) => ({
				type,
				text: content.slice(range[0], range[1]),
			})),
			[
				{ type: "scss", text: "$a: 1;" },
				{ type: "sass", text: "\n$b: 2\n" },
				{ type: "scss", text: "$c: 3;" },
			],
		);
	});

	it("getSCSSContent", () => {
		assert.strictEqual(
			getSassContent("sadja|sio|fuioaf", [{ type: "scss", range: [5, 10] }]),
			"     |sio|      ",
		);
		assert.strictEqual(
			getSassContent("sadja|sio|fuio^af^", [
				{ type: "scss", range: [5, 10] },
				{ type: "scss", range: [14, 18] },
			]),
			"     |sio|    ^af^",
		);

		assert.strictEqual(
			getSassContent(
				"<template><p>style lang='scss'</p></template><script></script></script><style lang='scss'> a\n { color: white;  }</style>",
			),
			`${" ".repeat(90)} a\n { color: white;  }${" ".repeat(8)}`,
		);
	});

	it("getSCSSRegionsDocument", () => {
		const exSCSSDocument = TextDocument.create(
			"sdfdsf.vue/sasfsf.scss",
			"scss",
			1,
			"",
		);
		assert.strictEqual(
			getSassRegionsDocument(exSCSSDocument, Position.create(0, 0)),
			exSCSSDocument,
		);

		const exVueDocument = TextDocument.create(
			"components/AppButton.vue",
			"vue",
			1,
			`
			<template>
				<button>@import "mixin.scss";</button>
			</template>
			<style lang="scss">
				@import "variables.scss";
			</style>
		`,
		);
		assert.notDeepEqual(
			getSassRegionsDocument(exVueDocument, Position.create(2, 15)),
			exVueDocument,
		);
		assert.deepStrictEqual(
			getSassRegionsDocument(exVueDocument, Position.create(2, 15)),
			null,
		);

		assert.notDeepEqual(
			getSassRegionsDocument(exVueDocument, Position.create(5, 15)),
			exVueDocument,
		);
		assert.notDeepEqual(
			getSassRegionsDocument(exVueDocument, Position.create(5, 15)),
			null,
		);

		assert.notDeepEqual(
			getSassRegionsDocument(exVueDocument, Position.create(6, 9)),
			exVueDocument,
		);
		assert.deepStrictEqual(
			getSassRegionsDocument(exVueDocument, Position.create(6, 9)),
			null,
		);
	});

	it("getSassRegionsDocument keeps offsets of the original file", () => {
		const content = [
			"<template>",
			'\t<p class="a">Hello</p>',
			"</template>",
			"<style>p { color: red; }</style>",
			'<style data-v lang="scss" scoped>',
			"$color: red;",
			".a { color: $color; }",
			"</style>",
		].join("\n");
		const document = TextDocument.create("App.vue", "vue", 1, content);
		const result = getSassRegionsDocument(document, Position.create(5, 2));
		assert.isNotNull(result);
		const masked = result!.getText();
		assert.strictEqual(result!.languageId, "scss");
		assert.strictEqual(masked.length, content.length);
		assert.strictEqual(masked.split("\n").length, content.split("\n").length);
		const start = content.indexOf("$color: red;");
		const end = content.indexOf("</style>", start);
		assert.strictEqual(masked.slice(start, end), content.slice(start, end));
		assert.strictEqual(masked.slice(0, start).trim(), "");
		assert.strictEqual(masked.slice(end).trim(), "");
		assert.deepStrictEqual(
			result!.positionAt(content.indexOf("$color", start + 1)),
			document.positionAt(content.indexOf("$color", start + 1)),
		);
	});

	it("getSassRegionsDocument uses the type of the block at the position", () => {
		const content = [
			"<template></template>",
			'<style lang="scss">',
			"$a: 1;",
			"</style>",
			"<style lang='sass'>",
			"$b: 2",
			"</style>",
		].join("\n");
		const document = TextDocument.create("App.vue", "vue", 1, content);
		const scss = "$a: 1;";
		const sass = "$b: 2";
		const scssOffset = content.indexOf(scss);
		const sassOffset = content.indexOf(sass);

		const inScss = getSassRegionsDocument(document, Position.create(2, 1));
		assert.isNotNull(inScss);
		assert.strictEqual(inScss!.languageId, "scss");
		assert.strictEqual(inScss!.getText().length, content.length);
		assert.strictEqual(
			inScss!.getText().slice(scssOffset, scssOffset + scss.length),
			scss,
		);
		assert.strictEqual(
			inScss!
				.getText()
				.slice(sassOffset, sassOffset + sass.length)
				.trim(),
			"",
		);

		const inSass = getSassRegionsDocument(document, Position.create(5, 1));
		assert.isNotNull(inSass);
		assert.strictEqual(inSass!.languageId, "sass");
		assert.strictEqual(inSass!.getText().length, content.length);
		assert.strictEqual(
			inSass!.getText().slice(sassOffset, sassOffset + sass.length),
			sass,
		);
		assert.strictEqual(
			inSass!
				.getText()
				.slice(scssOffset, scssOffset + scss.length)
				.trim(),
			"",
		);

		assert.isNull(getSassRegionsDocument(document, Position.create(0, 1)));

		// Without a position, use the type of the first block and mask the others
		const noPosition = getSassRegionsDocument(document);
		assert.isNotNull(noPosition);
		assert.strictEqual(noPosition!.languageId, "scss");
		assert.strictEqual(
			noPosition!
				.getText()
				.slice(sassOffset, sassOffset + sass.length)
				.trim(),
			"",
		);
	});

	it("getSassRegionsDocument returns null when there are no Sass blocks", () => {
		const document = TextDocument.create(
			"App.vue",
			"vue",
			1,
			"<template></template><style>a {}</style>",
		);
		assert.isNull(getSassRegionsDocument(document));
		assert.isNull(getSassRegionsDocument(document, Position.create(0, 30)));
	});
});
