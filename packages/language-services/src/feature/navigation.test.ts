/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as assert from "node:assert";
import * as path from "node:path";
import {
	DocumentLink,
	LanguageService,
	LanguageSettings,
	TextDocument,
	URI,
} from "@somesass/language-server-types";
import { getLanguageService } from "../language-services";
import { getDocumentContext } from "../test/test-document-context";
import { NodeFileSystem } from "../test/test-fs-provider";
import { newRange } from "../test/test-resources";

const getLS = () =>
	getLanguageService({ fileSystemProvider: new NodeFileSystem() });

suite("findDocumentLinks", () => {
	async function assertLinks(
		ls: LanguageService,
		input: string,
		expected: DocumentLink[],
		lang: string = "css",
		testUri?: string,
		workspaceFolder?: string,
	) {
		const document = TextDocument.create(
			testUri || `test://test/test.${lang}`,
			lang,
			0,
			input,
		);
		const stylesheet = ls.parseStylesheet(document);
		const links = await ls.findDocumentLinks(
			document,
			stylesheet,
			getDocumentContext(workspaceFolder || "test://test"),
		);
		assert.deepEqual(links, expected);
	}

	async function assertDynamicLinks(
		docUri: string,
		input: string,
		expected: DocumentLink[],
		settings?: LanguageSettings,
		lang: string = "scss",
	) {
		const ls = getLS();
		if (settings) {
			ls.configure(settings);
		}
		const document = TextDocument.create(docUri, lang, 0, input);
		const stylesheet = ls.parseStylesheet(document);
		const links = await ls.findDocumentLinks(
			document,
			stylesheet,
			getDocumentContext(document.uri),
		);
		assert.deepEqual(links, expected);
	}

	async function assertNoDynamicLinks(
		docUri: string,
		input: string,
		extecedTarget: string | undefined,
		lang: string = "scss",
	) {
		const ls = getLS();
		const document = TextDocument.create(docUri, lang, 0, input);
		const stylesheet = ls.parseStylesheet(document);
		const links = await ls.findDocumentLinks(
			document,
			stylesheet,
			getDocumentContext(document.uri),
		);
		if (extecedTarget) {
			assert.deepEqual(
				links.length,
				1,
				`${docUri.toString()} should only return itself`,
			);
			assert.deepEqual(
				links[0].target,
				extecedTarget,
				`${docUri.toString()} should only return itself`,
			);
		} else {
			assert.deepEqual(
				links.length,
				0,
				`${docUri.toString()} hould have no link`,
			);
		}
	}

	function getLinksFixture(_path: string) {
		return URI.file(
			path.join(__dirname, "../test/fixtures/links", _path),
		).toString(true);
	}

	test("invalid partial file links returns no link", async () => {
		await assertNoDynamicLinks(
			getLinksFixture("./non-existent/index.scss"),
			`@import 'foo'`,
			getLinksFixture("./non-existent/foo"),
		);

		await assertNoDynamicLinks(
			getLinksFixture("./non-existent/index.sass"),
			`@import 'foo'`,
			getLinksFixture("./non-existent/foo"),
		);

		await assertNoDynamicLinks(
			getLinksFixture("./non-existent/index.scss"),
			`@import './foo'`,
			getLinksFixture("./non-existent/foo"),
		);

		await assertNoDynamicLinks(
			getLinksFixture("./non-existent/index.sass"),
			`@import './foo'`,
			getLinksFixture("./non-existent/foo"),
		);

		await assertNoDynamicLinks(
			getLinksFixture("./non-existent/index.scss"),
			`@import './_foo'`,
			getLinksFixture("./non-existent/_foo"),
		);

		await assertNoDynamicLinks(
			getLinksFixture("./non-existent/index.sass"),
			`@import './_foo'`,
			getLinksFixture("./non-existent/_foo"),
		);

		await assertNoDynamicLinks(
			getLinksFixture("./non-existent/index.scss"),
			`@import './foo-baz'`,
			getLinksFixture("./non-existent/foo-baz"),
		);

		await assertNoDynamicLinks(
			getLinksFixture("./non-existent/index.sass"),
			`@import './foo-baz'`,
			getLinksFixture("./non-existent/foo-baz"),
		);
	});

	test("partial file dynamic links", async () => {
		await assertDynamicLinks(
			getLinksFixture("./noUnderscore/index.scss"),
			`@import 'foo'`,
			[
				{
					range: newRange(8, 13),
					target: getLinksFixture("./noUnderscore/foo.scss"),
				},
			],
		);

		await assertDynamicLinks(
			getLinksFixture("./noUnderscore/index.scss"),
			`@import 'bar'`,
			[
				{
					range: newRange(8, 13),
					target: getLinksFixture("./noUnderscore/bar.sass"),
				},
			],
		);

		await assertDynamicLinks(
			getLinksFixture("./underscore/index.scss"),
			`@import 'foo'`,
			[
				{
					range: newRange(8, 13),
					target: getLinksFixture("./underscore/_foo.scss"),
				},
			],
		);

		await assertDynamicLinks(
			getLinksFixture("./underscore/index.scss"),
			`@import 'bar'`,
			[
				{
					range: newRange(8, 13),
					target: getLinksFixture("./underscore/_bar.sass"),
				},
			],
		);

		await assertDynamicLinks(
			getLinksFixture("./underscore/index.scss"),
			`@import 'foo.scss'`,
			[
				{
					range: newRange(8, 18),
					target: getLinksFixture("./underscore/_foo.scss"),
				},
			],
		);

		await assertDynamicLinks(
			getLinksFixture("./underscore/index.scss"),
			`@import 'bar.sass'`,
			[
				{
					range: newRange(8, 18),
					target: getLinksFixture("./underscore/_bar.sass"),
				},
			],
		);

		await assertDynamicLinks(
			getLinksFixture("./both/index.scss"),
			`@import 'foo'`,
			[{ range: newRange(8, 13), target: getLinksFixture("./both/foo.scss") }],
		);

		await assertDynamicLinks(
			getLinksFixture("./both/index.scss"),
			`@import 'bar'`,
			[{ range: newRange(8, 13), target: getLinksFixture("./both/bar.sass") }],
		);

		await assertDynamicLinks(
			getLinksFixture("./both/index.scss"),
			`@import '_foo'`,
			[{ range: newRange(8, 14), target: getLinksFixture("./both/_foo.scss") }],
		);

		await assertDynamicLinks(
			getLinksFixture("./both/index.scss"),
			`@import '_bar'`,
			[{ range: newRange(8, 14), target: getLinksFixture("./both/_bar.sass") }],
		);

		await assertDynamicLinks(
			getLinksFixture("./index/index.scss"),
			`@import 'foo'`,
			[
				{
					range: newRange(8, 13),
					target: getLinksFixture("./index/foo/index.scss"),
				},
			],
		);

		await assertDynamicLinks(
			getLinksFixture("./index/index.scss"),
			`@import 'fizz'`,
			[
				{
					range: newRange(8, 14),
					target: getLinksFixture("./index/fizz/index.sass"),
				},
			],
		);

		await assertDynamicLinks(
			getLinksFixture("./index/index.scss"),
			`@import 'bar'`,
			[
				{
					range: newRange(8, 13),
					target: getLinksFixture("./index/bar/_index.scss"),
				},
			],
		);

		await assertDynamicLinks(
			getLinksFixture("./index/index.scss"),
			`@import 'buzz'`,
			[
				{
					range: newRange(8, 14),
					target: getLinksFixture("./index/buzz/_index.sass"),
				},
			],
		);
	});

	test("straight links", async () => {
		const ls = getLS();

		await assertLinks(
			ls,
			`@import 'foo.css'`,
			[{ range: newRange(8, 17), target: "test://test/foo.css" }],
			"scss",
		);

		await assertLinks(ls, `@import 'foo.scss' print;`, [
			{ range: newRange(8, 18), target: "test://test/foo.scss" },
		]);

		await assertLinks(ls, `@import 'foo.sass' print;`, [
			{ range: newRange(8, 18), target: "test://test/foo.sass" },
		]);

		await assertLinks(
			ls,
			`@import 'http://foo.com/foo.css'`,
			[{ range: newRange(8, 32), target: "http://foo.com/foo.css" }],
			"scss",
		);

		await assertLinks(ls, `@import url("foo.css") print;`, [
			{ range: newRange(12, 21), target: "test://test/foo.css" },
			{ range: newRange(12, 21), target: "test://test/foo.css" }, // todo: potential improvement, but it's fine...
		]);
	});

	test("aliased links", async function () {
		const settings: LanguageSettings = {
			importAliases: {
				"@SassStylesheet": "/src/assets/styles.scss",
				"@NoUnderscoreDir/": "/noUnderscore/",
				"@UnderscoreDir/": "/underscore/",
				"@BothDir/": "/both/",
			},
		};

		const ls = getLS();
		ls.configure(settings);

		await assertLinks(ls, '@import "@SassStylesheet"', [
			{ range: newRange(8, 25), target: "test://test/src/assets/styles.scss" },
		]);

		await assertDynamicLinks(
			getLinksFixture("./"),
			`@import '@NoUnderscoreDir/foo'`,
			[
				{
					range: newRange(8, 30),
					target: getLinksFixture("./noUnderscore/foo.scss"),
				},
			],
			settings,
		);

		await assertDynamicLinks(
			getLinksFixture("./"),
			`@import '@UnderscoreDir/foo'`,
			[
				{
					range: newRange(8, 28),
					target: getLinksFixture("./underscore/_foo.scss"),
				},
			],
			settings,
		);

		await assertDynamicLinks(
			getLinksFixture("./"),
			`@import '@BothDir/foo'`,
			[{ range: newRange(8, 22), target: getLinksFixture("./both/foo.scss") }],
			settings,
		);

		await assertDynamicLinks(
			getLinksFixture("./"),
			`@import '@BothDir/_foo'`,
			[{ range: newRange(8, 23), target: getLinksFixture("./both/_foo.scss") }],
			settings,
		);
	});

	test("aliased links - Sass", async function () {
		const settings: LanguageSettings = {
			importAliases: {
				"@SassStylesheet": "/src/assets/styles.sass",
				"@NoUnderscoreDir/": "/noUnderscore/",
				"@UnderscoreDir/": "/underscore/",
				"@BothDir/": "/both/",
			},
		};

		const ls = getLS();
		ls.configure(settings);

		await assertLinks(ls, '@import "@SassStylesheet"', [
			{ range: newRange(8, 25), target: "test://test/src/assets/styles.sass" },
		]);

		await assertDynamicLinks(
			getLinksFixture("./"),
			`@import '@NoUnderscoreDir/bar'`,
			[
				{
					range: newRange(8, 30),
					target: getLinksFixture("./noUnderscore/bar.sass"),
				},
			],
			settings,
		);

		await assertDynamicLinks(
			getLinksFixture("./"),
			`@import '@UnderscoreDir/bar'`,
			[
				{
					range: newRange(8, 28),
					target: getLinksFixture("./underscore/_bar.sass"),
				},
			],
			settings,
		);

		await assertDynamicLinks(
			getLinksFixture("./"),
			`@import '@BothDir/bar'`,
			[{ range: newRange(8, 22), target: getLinksFixture("./both/bar.sass") }],
			settings,
		);

		await assertDynamicLinks(
			getLinksFixture("./"),
			`@import '@BothDir/_bar'`,
			[{ range: newRange(8, 23), target: getLinksFixture("./both/_bar.sass") }],
			settings,
		);
	});

	test("module file links", async () => {
		await assertDynamicLinks(
			getLinksFixture("./module/index.scss"),
			`@use './foo' as f`,
			[
				{
					range: newRange(5, 12),
					target: getLinksFixture("./module/foo.scss"),
				},
			],
		);

		await assertDynamicLinks(
			getLinksFixture("./module/index.scss"),
			`@forward './foo' hide $private`,
			[
				{
					range: newRange(9, 16),
					target: getLinksFixture("./module/foo.scss"),
				},
			],
		);

		await assertNoDynamicLinks(
			getLinksFixture("./module/index.scss"),
			`@use 'sass:math'`,
			undefined,
		);
		await assertNoDynamicLinks(
			getLinksFixture("./module/index.scss"),
			`@use './non-existent'`,
			getLinksFixture("./module/non-existent"),
		);
	});

	test("module file links - Sass", async () => {
		await assertDynamicLinks(
			getLinksFixture("./module/index.scss"),
			`@use './bar' as f`,
			[
				{
					range: newRange(5, 12),
					target: getLinksFixture("./module/bar.sass"),
				},
			],
		);

		await assertDynamicLinks(
			getLinksFixture("./module/index.scss"),
			`@forward './bar' hide $private`,
			[
				{
					range: newRange(9, 16),
					target: getLinksFixture("./module/bar.sass"),
				},
			],
		);

		await assertNoDynamicLinks(
			getLinksFixture("./module/index.scss"),
			`@use 'sass:math'`,
			undefined,
		);
		await assertNoDynamicLinks(
			getLinksFixture("./module/index.scss"),
			`@use './non-existent'`,
			getLinksFixture("./module/non-existent"),
		);
	});

	test("empty path", async () => {
		const ls = getLS();

		/**
		 * https://github.com/microsoft/vscode/issues/79215
		 * No valid path — gradient-overlay.png is authority and path is ''
		 */
		await assertLinks(
			ls,
			`#navigation { background: #3d3d3d url(gantry-media://gradient-overlay.png); }`,
			[
				{
					range: newRange(38, 73),
					target: "gantry-media://gradient-overlay.png",
				},
			],
			"scss",
		);
	});

	test("node module resolving", async function () {
		const ls = getLS();
		const testUri = getLinksFixture("about.scss");
		const workspaceFolder = getLinksFixture("");

		await assertLinks(
			ls,
			'html { background-image: url("~foo/hello.html")',
			[
				{
					range: newRange(29, 46),
					target: getLinksFixture("node_modules/foo/hello.html"),
				},
			],
			"scss",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			'html { background-image: url("foo/hello.html")',
			[
				{
					range: newRange(29, 45),
					target: getLinksFixture("node_modules/foo/hello.html"),
				},
			],
			"scss",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			`@use '@foo/bar/baz'`,
			[
				{
					range: newRange(5, 19),
					target: getLinksFixture("node_modules/@foo/bar/_baz.scss"),
				},
			],
			"scss",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			`@use '@foo/bar/buzz'`,
			[
				{
					range: newRange(5, 20),
					target: getLinksFixture("node_modules/@foo/bar/_buzz.sass"),
				},
			],
			"scss",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			`@use '@foo/bar'`,
			[
				{
					range: newRange(5, 15),
					target: getLinksFixture("node_modules/@foo/bar/_index.scss"),
				},
			],
			"scss",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			`@use '@foo/buzz'`,
			[
				{
					range: newRange(5, 16),
					target: getLinksFixture("node_modules/@foo/buzz/_index.sass"),
				},
			],
			"scss",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			'@import "green/d"',
			[{ range: newRange(8, 17), target: getLinksFixture("green/d.scss") }],
			"scss",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			'@import "./green/d"',
			[{ range: newRange(8, 19), target: getLinksFixture("green/d.scss") }],
			"scss",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			'@import "green/e"',
			[
				{
					range: newRange(8, 17),
					target: getLinksFixture("node_modules/green/_e.scss"),
				},
			],
			"scss",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			'@import "blue/b"',
			[{ range: newRange(8, 16), target: getLinksFixture("blue/b.sass") }],
			"sass",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			'@import "./blue/b"',
			[{ range: newRange(8, 18), target: getLinksFixture("blue/b.sass") }],
			"sass",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			'@import "blue/c"',
			[
				{
					range: newRange(8, 16),
					target: getLinksFixture("node_modules/blue/_c.sass"),
				},
			],
			"sass",
			testUri,
			workspaceFolder,
		);
	});

	test("node package resolving", async () => {
		const ls = getLS();
		const testUri = getLinksFixture("about.scss");
		const workspaceFolder = getLinksFixture("");
		await assertLinks(
			ls,
			`@use "pkg:bar"`,
			[
				{
					range: newRange(5, 14),
					target: getLinksFixture("node_modules/bar/styles/index.scss"),
				},
			],
			"scss",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			`@use "pkg:bar/colors"`,
			[
				{
					range: newRange(5, 21),
					target: getLinksFixture("node_modules/bar/styles/colors.scss"),
				},
			],
			"scss",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			`@use "pkg:bar/colors.scss"`,
			[
				{
					range: newRange(5, 26),
					target: getLinksFixture("node_modules/bar/styles/colors.scss"),
				},
			],
			"scss",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			`@use "pkg:@foo/baz"`,
			[
				{
					range: newRange(5, 19),
					target: getLinksFixture("node_modules/@foo/baz/styles/index.scss"),
				},
			],
			"scss",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			`@use "pkg:@foo/baz/colors"`,
			[
				{
					range: newRange(5, 26),
					target: getLinksFixture("node_modules/@foo/baz/styles/colors.scss"),
				},
			],
			"scss",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			`@use "pkg:@foo/baz/colors.scss"`,
			[
				{
					range: newRange(5, 31),
					target: getLinksFixture("node_modules/@foo/baz/styles/colors.scss"),
				},
			],
			"scss",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			`@use "pkg:@foo/baz/button"`,
			[
				{
					range: newRange(5, 26),
					target: getLinksFixture("node_modules/@foo/baz/styles/button.scss"),
				},
			],
			"scss",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			`@use "pkg:@foo/baz/button.scss"`,
			[
				{
					range: newRange(5, 31),
					target: getLinksFixture("node_modules/@foo/baz/styles/button.scss"),
				},
			],
			"scss",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			`@use "pkg:root-scss"`,
			[
				{
					range: newRange(5, 20),
					target: getLinksFixture("node_modules/root-scss/styles/index.scss"),
				},
			],
			"scss",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			`@use "pkg:root-style"`,
			[
				{
					range: newRange(5, 21),
					target: getLinksFixture("node_modules/root-style/styles/index.scss"),
				},
			],
			"scss",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			`@use "pkg:bar-pattern/anything"`,
			[
				{
					range: newRange(5, 31),
					target: getLinksFixture(
						"node_modules/bar-pattern/styles/anything.scss",
					),
				},
			],
			"scss",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			`@use "pkg:bar-pattern/anything.scss"`,
			[
				{
					range: newRange(5, 36),
					target: getLinksFixture(
						"node_modules/bar-pattern/styles/anything.scss",
					),
				},
			],
			"scss",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			`@use "pkg:bar-pattern/theme/dark.scss"`,
			[
				{
					range: newRange(5, 38),
					target: getLinksFixture(
						"node_modules/bar-pattern/styles/theme/dark.scss",
					),
				},
			],
			"scss",
			testUri,
			workspaceFolder,
		);
	});

	test.only("node package resolving - Sass", async () => {
		const ls = getLS();
		const testUri = getLinksFixture("about.sass");
		const workspaceFolder = getLinksFixture("");
		await assertLinks(
			ls,
			`@use "pkg:fizz"`,
			[
				{
					range: newRange(5, 15),
					target: getLinksFixture("node_modules/fizz/styles/index.sass"),
				},
			],
			"sass",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			`@use "pkg:fizz/colors"`,
			[
				{
					range: newRange(5, 22),
					target: getLinksFixture("node_modules/fizz/styles/colors.sass"),
				},
			],
			"sass",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			`@use "pkg:fizz/colors.sass"`,
			[
				{
					range: newRange(5, 27),
					target: getLinksFixture("node_modules/fizz/styles/colors.sass"),
				},
			],
			"sass",
			testUri,
			workspaceFolder,
		);

		await assertLinks(
			ls,
			`@use "pkg:@fizz/buzz"`,
			[
				{
					range: newRange(5, 21),
					target: getLinksFixture("node_modules/@fizz/buzz/styles/index.sass"),
				},
			],
			"sass",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			`@use "pkg:@fizz/buzz/colors"`,
			[
				{
					range: newRange(5, 28),
					target: getLinksFixture("node_modules/@fizz/buzz/styles/colors.sass"),
				},
			],
			"sass",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			`@use "pkg:@fizz/buzz/colors.sass"`,
			[
				{
					range: newRange(5, 33),
					target: getLinksFixture("node_modules/@fizz/buzz/styles/colors.sass"),
				},
			],
			"sass",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			`@use "pkg:@fizz/buzz/button"`,
			[
				{
					range: newRange(5, 28),
					target: getLinksFixture("node_modules/@fizz/buzz/styles/button.sass"),
				},
			],
			"sass",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			`@use "pkg:@fizz/buzz/button.sass"`,
			[
				{
					range: newRange(5, 33),
					target: getLinksFixture("node_modules/@fizz/buzz/styles/button.sass"),
				},
			],
			"sass",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			`@use "pkg:root-sass"`,
			[
				{
					range: newRange(5, 20),
					target: getLinksFixture("node_modules/root-sass/styles/index.sass"),
				},
			],
			"sass",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			`@use "pkg:root-style-sass"`,
			[
				{
					range: newRange(5, 26),
					target: getLinksFixture(
						"node_modules/root-style-sass/styles/index.sass",
					),
				},
			],
			"sass",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			`@use "pkg:fizz-pattern/anything"`,
			[
				{
					range: newRange(5, 32),
					target: getLinksFixture(
						"node_modules/fizz-pattern/styles/anything.sass",
					),
				},
			],
			"sass",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			`@use "pkg:fizz-pattern/anything.sass"`,
			[
				{
					range: newRange(5, 37),
					target: getLinksFixture(
						"node_modules/fizz-pattern/styles/anything.sass",
					),
				},
			],
			"sass",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			`@use "pkg:fizz-pattern/theme/dark.sass"`,
			[
				{
					range: newRange(5, 39),
					target: getLinksFixture(
						"node_modules/fizz-pattern/styles/theme/dark.sass",
					),
				},
			],
			"sass",
			testUri,
			workspaceFolder,
		);
	});
});
