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
});
