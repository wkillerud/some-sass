import { TextDocument } from "@somesass/language-server-types";
import { describe, assert, test } from "vitest";
import { Position } from "vscode-languageserver";
import {
	isFileWhereScssCanBeEmbedded,
	getSCSSRegions,
	getSCSSContent,
	getSCSSRegionsDocument,
} from "../../src/utils/embedded";

describe("Utils/VueSvelte", () => {
	test("isFileWhereScssCanBeEmbedded", () => {
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

	test("getSCSSRegions", () => {
		assert.deepStrictEqual(
			getSCSSRegions('<style sdad lang="scss" afsaf sdd></style>'),
			[[34, 34]],
		);
		assert.deepStrictEqual(
			getSCSSRegions('<style lang="scss" scoped></style>'),
			[[26, 26]],
		);
		assert.deepStrictEqual(
			getSCSSRegions('<style lang="scss" module></style>'),
			[[26, 26]],
		);
		assert.deepStrictEqual(getSCSSRegions('<style lang="scss"></style>'), [
			[19, 19],
		]);
		assert.deepStrictEqual(getSCSSRegions("<style lang='scss'></style>"), [
			[19, 19],
		]);
		assert.deepStrictEqual(getSCSSRegions('<style type="text/scss"></style>'), [
			[24, 24],
		]);

		assert.deepStrictEqual(
			getSCSSRegions(
				"<template><p>style lang='scss'</p></template><script></script></script><style lang='scss'></style>",
			),
			[[90, 90]],
		);
		assert.deepStrictEqual(
			getSCSSRegions(
				"<template><p>style lang='scss'</p></template><script></script></script>\n<style lang='scss'></style>",
			),
			[[91, 91]],
		);
		assert.deepStrictEqual(
			getSCSSRegions(
				"<template><p>style lang='scss'</p></template><script></script></script>\n<style lang='scss'>\n</style>",
			),
			[[91, 92]],
		);
		assert.deepStrictEqual(
			getSCSSRegions(
				"<template><p>style lang='scss'</p></template><script></script></script>\n<style lang='scss'>a { color: white; }</style>",
			),
			[[91, 110]],
		);

		assert.deepStrictEqual(
			getSCSSRegions(
				"<template><p>style lang='scss'</p></template><script></script></script><style lang='scss'>a { color: white; }</style><style lang='scss' module>a { color: white; }</style>\n",
			),
			[
				[90, 109],
				[143, 162],
			],
		);
		assert.deepStrictEqual(
			getSCSSRegions(
				"<template><p>style lang='scss'</p></template><script></script></script><style lang='scss'>a { color: white; }</style><style lang='scss' module>a { color: white; }</style>\n\n<style lang='scss' module=\"a\">a { color: white; }</style>",
			),
			[
				[90, 109],
				[143, 162],
				[202, 221],
			],
		);

		assert.deepStrictEqual(getSCSSRegions('<style lang="sass"></style>'), []);
		assert.deepStrictEqual(getSCSSRegions('<style lang="stylus"></style>'), []);
		assert.deepStrictEqual(
			getSCSSRegions('<style lang="sass" scoped></style>'),
			[],
		);
		assert.deepStrictEqual(getSCSSRegions("<style></style>"), []);
		assert.deepStrictEqual(getSCSSRegions('<style>lang="scss"</style>'), []);
	});

	test("getSCSSContent", () => {
		assert.strictEqual(
			getSCSSContent("sadja|sio|fuioaf", [[5, 10]]),
			"     |sio|      ",
		);
		assert.strictEqual(
			getSCSSContent("sadja|sio|fuio^af^", [
				[5, 10],
				[14, 18],
			]),
			"     |sio|    ^af^",
		);

		assert.strictEqual(
			getSCSSContent(
				"<template><p>style lang='scss'</p></template><script></script></script><style lang='scss'> a\n { color: white;  }</style>",
			),
			`${" ".repeat(90)} a\n { color: white;  }${" ".repeat(8)}`,
		);
	});

	test("getSCSSRegionsDocument", () => {
		const exSCSSDocument = TextDocument.create(
			"sdfdsf.vue/sasfsf.scss",
			"scss",
			1,
			"",
		);
		assert.strictEqual(
			getSCSSRegionsDocument(exSCSSDocument, Position.create(0, 0)).document,
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
			getSCSSRegionsDocument(exVueDocument, Position.create(2, 15)).document,
			exVueDocument,
		);
		assert.deepStrictEqual(
			getSCSSRegionsDocument(exVueDocument, Position.create(2, 15)).document,
			null,
		);

		assert.notDeepEqual(
			getSCSSRegionsDocument(exVueDocument, Position.create(5, 15)).document,
			exVueDocument,
		);
		assert.notDeepEqual(
			getSCSSRegionsDocument(exVueDocument, Position.create(5, 15)).document,
			null,
		);

		assert.notDeepEqual(
			getSCSSRegionsDocument(exVueDocument, Position.create(6, 9)).document,
			exVueDocument,
		);
		assert.deepStrictEqual(
			getSCSSRegionsDocument(exVueDocument, Position.create(6, 9)).document,
			null,
		);
	});
});
