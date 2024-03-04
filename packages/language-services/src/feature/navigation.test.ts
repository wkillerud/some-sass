import * as assert from "node:assert";
import * as path from "node:path";
import { TextDocument } from "vscode-languageserver-textdocument";
import { DocumentLink } from "vscode-languageserver-types";
import { URI } from "vscode-uri";
import { getLanguageService } from "../language-services";
import { LanguageService, LanguageSettings } from "../language-services-types";
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
	) {
		const ls = getLS();
		if (settings) {
			ls.configure(settings);
		}
		const document = TextDocument.create(docUri, "scss", 0, input);
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
	) {
		const ls = getLS();
		const document = TextDocument.create(docUri, "scss", 0, input);
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

	function getTestResource(_path: string) {
		return URI.file(
			path.join(__dirname, "../test/fixtures/linksTestFixtures", _path),
		).toString(true);
	}

	test("invalid partial file links returns no link", async () => {
		const fixtureRoot = path.resolve(
			__dirname,
			"../test/fixtures/linkFixture/non-existent",
		);
		const getDocumentUri = (relativePath: string) => {
			return URI.file(path.resolve(fixtureRoot, relativePath)).toString(true);
		};

		await assertNoDynamicLinks(
			getDocumentUri("./index.scss"),
			`@import 'foo'`,
			getDocumentUri("foo"),
		);

		await assertNoDynamicLinks(
			getDocumentUri("./index.scss"),
			`@import './foo'`,
			getDocumentUri("foo"),
		);

		await assertNoDynamicLinks(
			getDocumentUri("./index.scss"),
			`@import './_foo'`,
			getDocumentUri("_foo"),
		);

		await assertNoDynamicLinks(
			getDocumentUri("./index.scss"),
			`@import './foo-baz'`,
			getDocumentUri("foo-baz"),
		);
	});

	test("partial file dynamic links", async () => {
		const fixtureRoot = path.resolve(__dirname, "../test/fixtures/linkFixture");
		const getDocumentUri = (relativePath: string) => {
			return URI.file(path.resolve(fixtureRoot, relativePath)).toString(true);
		};

		await assertDynamicLinks(
			getDocumentUri("./noUnderscore/index.scss"),
			`@import 'foo'`,
			[
				{
					range: newRange(8, 13),
					target: getDocumentUri("./noUnderscore/foo.scss"),
				},
			],
		);

		await assertDynamicLinks(
			getDocumentUri("./underscore/index.scss"),
			`@import 'foo'`,
			[
				{
					range: newRange(8, 13),
					target: getDocumentUri("./underscore/_foo.scss"),
				},
			],
		);

		await assertDynamicLinks(
			getDocumentUri("./underscore/index.scss"),
			`@import 'foo.scss'`,
			[
				{
					range: newRange(8, 18),
					target: getDocumentUri("./underscore/_foo.scss"),
				},
			],
		);

		await assertDynamicLinks(
			getDocumentUri("./both/index.scss"),
			`@import 'foo'`,
			[{ range: newRange(8, 13), target: getDocumentUri("./both/foo.scss") }],
		);

		await assertDynamicLinks(
			getDocumentUri("./both/index.scss"),
			`@import '_foo'`,
			[{ range: newRange(8, 14), target: getDocumentUri("./both/_foo.scss") }],
		);

		await assertDynamicLinks(
			getDocumentUri("./index/index.scss"),
			`@import 'foo'`,
			[
				{
					range: newRange(8, 13),
					target: getDocumentUri("./index/foo/index.scss"),
				},
			],
		);

		await assertDynamicLinks(
			getDocumentUri("./index/index.scss"),
			`@import 'bar'`,
			[
				{
					range: newRange(8, 13),
					target: getDocumentUri("./index/bar/_index.scss"),
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
		const fixtureRoot = path.resolve(__dirname, "../test/fixtures/linkFixture");
		const getDocumentUri = (relativePath: string) => {
			return URI.file(path.resolve(fixtureRoot, relativePath)).toString(true);
		};

		const ls = getLS();
		ls.configure(settings);

		await assertLinks(ls, '@import "@SassStylesheet"', [
			{ range: newRange(8, 25), target: "test://test/src/assets/styles.scss" },
		]);

		await assertDynamicLinks(
			getDocumentUri("./"),
			`@import '@NoUnderscoreDir/foo'`,
			[
				{
					range: newRange(8, 30),
					target: getDocumentUri("./noUnderscore/foo.scss"),
				},
			],
			settings,
		);

		await assertDynamicLinks(
			getDocumentUri("./"),
			`@import '@UnderscoreDir/foo'`,
			[
				{
					range: newRange(8, 28),
					target: getDocumentUri("./underscore/_foo.scss"),
				},
			],
			settings,
		);

		await assertDynamicLinks(
			getDocumentUri("./"),
			`@import '@BothDir/foo'`,
			[{ range: newRange(8, 22), target: getDocumentUri("./both/foo.scss") }],
			settings,
		);

		await assertDynamicLinks(
			getDocumentUri("./"),
			`@import '@BothDir/_foo'`,
			[{ range: newRange(8, 23), target: getDocumentUri("./both/_foo.scss") }],
			settings,
		);
	});

	test("module file links", async () => {
		const fixtureRoot = path.resolve(
			__dirname,
			"../test/fixtures/linkFixture/module",
		);
		const getDocumentUri = (relativePath: string) => {
			return URI.file(path.resolve(fixtureRoot, relativePath)).toString(true);
		};

		await assertDynamicLinks(
			getDocumentUri("./index.scss"),
			`@use './foo' as f`,
			[{ range: newRange(5, 12), target: getDocumentUri("./foo.scss") }],
		);

		await assertDynamicLinks(
			getDocumentUri("./index.scss"),
			`@forward './foo' hide $private`,
			[{ range: newRange(9, 16), target: getDocumentUri("./foo.scss") }],
		);

		await assertNoDynamicLinks(
			getDocumentUri("./index.scss"),
			`@use 'sass:math'`,
			undefined,
		);
		await assertNoDynamicLinks(
			getDocumentUri("./index.scss"),
			`@use './non-existent'`,
			getDocumentUri("non-existent"),
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
		const testUri = getTestResource("about.scss");
		const workspaceFolder = getTestResource("");

		await assertLinks(
			ls,
			'html { background-image: url("~foo/hello.html")',
			[
				{
					range: newRange(29, 46),
					target: getTestResource("node_modules/foo/hello.html"),
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
					target: getTestResource("node_modules/foo/hello.html"),
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
					target: getTestResource("node_modules/@foo/bar/_baz.scss"),
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
					target: getTestResource("node_modules/@foo/bar/_index.scss"),
				},
			],
			"scss",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			'@import "green/d"',
			[{ range: newRange(8, 17), target: getTestResource("green/d.scss") }],
			"scss",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			'@import "./green/d"',
			[{ range: newRange(8, 19), target: getTestResource("green/d.scss") }],
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
					target: getTestResource("node_modules/green/_e.scss"),
				},
			],
			"scss",
			testUri,
			workspaceFolder,
		);
	});

	test("node package resolving", async () => {
		const ls = getLS();
		const testUri = getTestResource("about.scss");
		const workspaceFolder = getTestResource("");
		await assertLinks(
			ls,
			`@use "pkg:bar"`,
			[
				{
					range: newRange(5, 14),
					target: getTestResource("node_modules/bar/styles/index.scss"),
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
					target: getTestResource("node_modules/bar/styles/colors.scss"),
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
					target: getTestResource("node_modules/bar/styles/colors.scss"),
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
					target: getTestResource("node_modules/@foo/baz/styles/index.scss"),
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
					target: getTestResource("node_modules/@foo/baz/styles/colors.scss"),
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
					target: getTestResource("node_modules/@foo/baz/styles/colors.scss"),
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
					target: getTestResource("node_modules/@foo/baz/styles/button.scss"),
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
					target: getTestResource("node_modules/@foo/baz/styles/button.scss"),
				},
			],
			"scss",
			testUri,
			workspaceFolder,
		);
		await assertLinks(
			ls,
			`@use "pkg:root-sass"`,
			[
				{
					range: newRange(5, 20),
					target: getTestResource("node_modules/root-sass/styles/index.scss"),
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
					target: getTestResource("node_modules/root-style/styles/index.scss"),
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
					target: getTestResource(
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
					target: getTestResource(
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
					target: getTestResource(
						"node_modules/bar-pattern/styles/theme/dark.scss",
					),
				},
			],
			"scss",
			testUri,
			workspaceFolder,
		);
	});
});
