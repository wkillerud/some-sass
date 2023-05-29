import { strictEqual, deepStrictEqual, notDeepStrictEqual } from "assert";
import { Position } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
	isFileWhereScssCanBeEmbedded,
	getSCSSRegions,
	getSCSSContent,
	getSCSSRegionsDocument,
} from "../../utils/embedded";

describe("Utils/VueSvelte", () => {
	it("isFileWhereScssCanBeEmbedded", () => {
		strictEqual(isFileWhereScssCanBeEmbedded("sdasdsa/AppButton.vue"), true);
		strictEqual(
			isFileWhereScssCanBeEmbedded("sdasdsa/AppButton.scss.vue"),
			true,
		);
		strictEqual(isFileWhereScssCanBeEmbedded("sda.vue/AppButton.scss"), false);
		strictEqual(
			isFileWhereScssCanBeEmbedded("sdasdsa/AppButton.vue.scss"),
			false,
		);

		strictEqual(isFileWhereScssCanBeEmbedded("sdasdsa/AppButton.svelte"), true);
		strictEqual(
			isFileWhereScssCanBeEmbedded("sdasdsa/AppButton.scss.svelte"),
			true,
		);
		strictEqual(
			isFileWhereScssCanBeEmbedded("sda.svelte/AppButton.scss"),
			false,
		);
		strictEqual(
			isFileWhereScssCanBeEmbedded("sdasdsa/AppButton.svelte.scss"),
			false,
		);

		strictEqual(isFileWhereScssCanBeEmbedded("sdasdsa/AppButton.astro"), true);
		strictEqual(
			isFileWhereScssCanBeEmbedded("sdasdsa/AppButton.scss.astro"),
			true,
		);
		strictEqual(
			isFileWhereScssCanBeEmbedded("sda.astro/AppButton.scss"),
			false,
		);
		strictEqual(
			isFileWhereScssCanBeEmbedded("sdasdsa/AppButton.astro.scss"),
			false,
		);
	});

	it("getSCSSRegions", () => {
		deepStrictEqual(
			getSCSSRegions('<style sdad lang="scss" afsaf sdd></style>'),
			[[34, 34]],
		);
		deepStrictEqual(getSCSSRegions('<style lang="scss" scoped></style>'), [
			[26, 26],
		]);
		deepStrictEqual(getSCSSRegions('<style lang="scss" module></style>'), [
			[26, 26],
		]);
		deepStrictEqual(getSCSSRegions('<style lang="scss"></style>'), [[19, 19]]);
		deepStrictEqual(getSCSSRegions("<style lang='scss'></style>"), [[19, 19]]);
		deepStrictEqual(getSCSSRegions('<style type="text/scss"></style>'), [
			[24, 24],
		]);

		deepStrictEqual(
			getSCSSRegions(
				"<template><p>style lang='scss'</p></template><script></script></script><style lang='scss'></style>",
			),
			[[90, 90]],
		);
		deepStrictEqual(
			getSCSSRegions(
				"<template><p>style lang='scss'</p></template><script></script></script>\n<style lang='scss'></style>",
			),
			[[91, 91]],
		);
		deepStrictEqual(
			getSCSSRegions(
				"<template><p>style lang='scss'</p></template><script></script></script>\n<style lang='scss'>\n</style>",
			),
			[[91, 92]],
		);
		deepStrictEqual(
			getSCSSRegions(
				"<template><p>style lang='scss'</p></template><script></script></script>\n<style lang='scss'>a { color: white; }</style>",
			),
			[[91, 110]],
		);

		deepStrictEqual(
			getSCSSRegions(
				"<template><p>style lang='scss'</p></template><script></script></script><style lang='scss'>a { color: white; }</style><style lang='scss' module>a { color: white; }</style>\n",
			),
			[
				[90, 109],
				[143, 162],
			],
		);
		deepStrictEqual(
			getSCSSRegions(
				"<template><p>style lang='scss'</p></template><script></script></script><style lang='scss'>a { color: white; }</style><style lang='scss' module>a { color: white; }</style>\n\n<style lang='scss' module=\"a\">a { color: white; }</style>",
			),
			[
				[90, 109],
				[143, 162],
				[202, 221],
			],
		);

		deepStrictEqual(getSCSSRegions('<style lang="sass"></style>'), []);
		deepStrictEqual(getSCSSRegions('<style lang="stylus"></style>'), []);
		deepStrictEqual(getSCSSRegions('<style lang="sass" scoped></style>'), []);
		deepStrictEqual(getSCSSRegions("<style></style>"), []);
		deepStrictEqual(getSCSSRegions('<style>lang="scss"</style>'), []);
	});

	it("getSCSSContent", () => {
		strictEqual(
			getSCSSContent("sadja|sio|fuioaf", [[5, 10]]),
			"     |sio|      ",
		);
		strictEqual(
			getSCSSContent("sadja|sio|fuio^af^", [
				[5, 10],
				[14, 18],
			]),
			"     |sio|    ^af^",
		);

		strictEqual(
			getSCSSContent(
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
		strictEqual(
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
		notDeepStrictEqual(
			getSCSSRegionsDocument(exVueDocument, Position.create(2, 15)).document,
			exVueDocument,
		);
		deepStrictEqual(
			getSCSSRegionsDocument(exVueDocument, Position.create(2, 15)).document,
			null,
		);

		notDeepStrictEqual(
			getSCSSRegionsDocument(exVueDocument, Position.create(5, 15)).document,
			exVueDocument,
		);
		notDeepStrictEqual(
			getSCSSRegionsDocument(exVueDocument, Position.create(5, 15)).document,
			null,
		);

		notDeepStrictEqual(
			getSCSSRegionsDocument(exVueDocument, Position.create(6, 9)).document,
			exVueDocument,
		);
		deepStrictEqual(
			getSCSSRegionsDocument(exVueDocument, Position.create(6, 9)).document,
			null,
		);
	});
});
