import { getDocUri, showFile, position, sleepCI } from "../util";
import { testCompletion } from "./helper";

describe("SCSS Completion Test", function () {
	const docUri = getDocUri("completion/main.scss");
	const modulesDocUri = getDocUri("completion/modules.scss");
	const vueDocUri = getDocUri("completion/AppButton.vue");
	const svelteDocUri = getDocUri("completion/AppButton.svelte");
	const astroDocUri = getDocUri("completion/AppButton.astro");

	before(async () => {
		await showFile(docUri);
		await showFile(vueDocUri);
		await showFile(svelteDocUri);
		await showFile(astroDocUri);
		await sleepCI();
	});

	it("Offers completions when using node_modules", async () => {
		await testCompletion(modulesDocUri, position(1, 17), [
			{
				label: "scss/",
				insertText: "scss/",
			},
		]);
		await testCompletion(modulesDocUri, position(2, 22), [
			{
				label: "bootstrap.scss",
				insertText: "bootstrap",
			},
		]);
		await testCompletion(modulesDocUri, position(3, 11), [
			{
				label: "bar.scss",
				insertText: "bar",
			},
		]);

		// Deprecated tilde imports
		await testCompletion(modulesDocUri, position(4, 18), [
			{
				label: "scss/",
				insertText: "scss/",
			},
		]);
		await testCompletion(modulesDocUri, position(5, 23), [
			{
				label: "bootstrap.scss",
				insertText: "bootstrap",
			},
		]);
		await testCompletion(modulesDocUri, position(6, 12), [
			{
				label: "bar.scss",
				insertText: "bar",
			},
		]);
	});

	it("Offers completions from tilde imports", async () => {
		let expectedCompletions = [
			{
				label: "$tilde",
				insertText: '"$tilde"',
			},
		];
		await testCompletion(docUri, position(11, 11), expectedCompletions);
		await testCompletion(svelteDocUri, position(14, 11), expectedCompletions);

		// For Vue and Astro, the existing $ is not replaced by VS Code, so omit it from insertText
		expectedCompletions = [
			{
				label: "$tilde",
				insertText: '"tilde"',
			},
		];
		await testCompletion(vueDocUri, position(22, 11), expectedCompletions);
		await testCompletion(astroDocUri, position(17, 11), expectedCompletions);
	});

	it("Offers completions from partial file", async () => {
		const expectedCompletions = [{ label: "$partial" }];

		await testCompletion(docUri, position(17, 11), expectedCompletions);
		await testCompletion(vueDocUri, position(28, 11), expectedCompletions);
		await testCompletion(svelteDocUri, position(20, 11), expectedCompletions);
		await testCompletion(astroDocUri, position(23, 11), expectedCompletions);
	});

	it("Offers namespaces completions including prefixes", async () => {
		let expectedCompletions = [
			{
				label: "$var-var-variable",
				insertText: '".$var-var-variable"',
				filterText: '"ns.$var-var-variable"',
			},
			{
				label: "fun-fun-function",
				insertText: '".fun-fun-function()"',
			},
		];

		await testCompletion(docUri, position(23, 13), expectedCompletions);

		// For Vue, Svelte and Astro, the existing . from the namespace is not replaced by VS Code, so omit them from insertText.
		// However, we still need them both in the filter text.
		expectedCompletions = [
			{
				label: "$var-var-variable",
				insertText: '"$var-var-variable"',
				filterText: '"ns.$var-var-variable"',
			},
			{
				label: "fun-fun-function",
				insertText: '"fun-fun-function()"',
			},
		];

		await testCompletion(vueDocUri, position(34, 13), expectedCompletions);
		await testCompletion(svelteDocUri, position(26, 13), expectedCompletions);
		await testCompletion(astroDocUri, position(29, 13), expectedCompletions);

		expectedCompletions = [
			{
				label: "mix-mix-mixin",
				insertText: '".mix-mix-mixin"',
			},
		];

		await testCompletion(docUri, position(24, 15), expectedCompletions);

		// Same as for functions with regards to the . from the namespace.
		expectedCompletions = [
			{
				label: "mix-mix-mixin",
				insertText: '"mix-mix-mixin"',
			},
		];

		await testCompletion(vueDocUri, position(35, 15), expectedCompletions);
		await testCompletion(svelteDocUri, position(27, 15), expectedCompletions);
		await testCompletion(astroDocUri, position(30, 15), expectedCompletions);
	});

	// We can't test this until somesass.suggestOnlyFromUse: true becomes the default setting
	it.skip("Offers no hidden items in namespace completions", async () => {
		let expectedCompletions = ["$secret"];

		await testCompletion(docUri, position(23, 13), expectedCompletions, {
			expectNoMatch: true,
		});
		await testCompletion(vueDocUri, position(34, 13), expectedCompletions, {
			expectNoMatch: true,
		});
		await testCompletion(svelteDocUri, position(26, 13), expectedCompletions, {
			expectNoMatch: true,
		});
		await testCompletion(astroDocUri, position(29, 13), expectedCompletions, {
			expectNoMatch: true,
		});

		expectedCompletions = [
			"secret",
			"other-secret",
			"mix-secret",
			"mix-other-secret",
		];

		await testCompletion(docUri, position(24, 15), expectedCompletions, {
			expectNoMatch: true,
		});
		await testCompletion(vueDocUri, position(35, 15), expectedCompletions, {
			expectNoMatch: true,
		});
		await testCompletion(svelteDocUri, position(27, 15), expectedCompletions, {
			expectNoMatch: true,
		});
		await testCompletion(astroDocUri, position(30, 15), expectedCompletions, {
			expectNoMatch: true,
		});
	});

	it("Offers no completions on Vuelike file outside SCSS regions", async () => {
		await testCompletion(vueDocUri, position(2, 9), []);
		await testCompletion(vueDocUri, position(6, 8), []);
		await testCompletion(svelteDocUri, position(1, 16), []);
		await testCompletion(astroDocUri, position(4, 16), []);
	});

	it("Offers variable completions on Vuelike file", async () => {
		// In Vue and Astro files:
		// For variables _without_ a namespace ($color as opposed to namespace.$color),
		// VS Code does not replace the existing $ when using the completion.
		// The insertText must be without one to avoid $$color. However, filterText
		// still need the $ sign for the suggestion to match.
		let expectedCompletions = [
			{ label: "$color", insertText: '"color"' },
			{ label: "$fonts", insertText: '"fonts"' },
		];

		await testCompletion(vueDocUri, position(16, 11), expectedCompletions);
		await testCompletion(astroDocUri, position(11, 11), expectedCompletions);

		expectedCompletions = [
			{ label: "$color", insertText: '"$color"' },
			{ label: "$fonts", insertText: '"$fonts"' },
		];

		await testCompletion(svelteDocUri, position(8, 11), expectedCompletions);
	});

	it("Offers namespace completion inside string interpolation", async () => {
		let expectedCompletions = [
			{
				label: "$var-var-variable",
				insertText: '".$var-var-variable"',
				filterText: '"ns.$var-var-variable"',
			},
			{
				label: "fun-fun-function",
				insertText: '".fun-fun-function()"',
			},
		];

		await testCompletion(docUri, position(25, 40), expectedCompletions);

		// For Vue, Svelte and Astro, the existing . from the namespace is not replaced by VS Code, so omit them from insertText.
		// However, we still need them both in the filter text.
		expectedCompletions = [
			{
				label: "$var-var-variable",
				insertText: '"$var-var-variable"',
				filterText: '"ns.$var-var-variable"',
			},
			{
				label: "fun-fun-function",
				insertText: '"fun-fun-function()"',
			},
		];

		await testCompletion(vueDocUri, position(36, 40), expectedCompletions);
		await testCompletion(svelteDocUri, position(28, 40), expectedCompletions);
		await testCompletion(astroDocUri, position(31, 40), expectedCompletions);
	});

	it("Offers completions for Sass built-ins", async () => {
		let expectedCompletions = [
			{
				label: "floor",
				insertText: '".floor(${1:number})"',
				filterText: '"math.floor"',
			},
		];

		await testCompletion(docUri, position(36, 19), expectedCompletions);

		// For Vue, Svelte and Astro, the existing . from the namespace is not replaced by VS Code, so omit them from insertText.
		// However, we still need them both in the filter text.
		expectedCompletions = [
			{
				label: "floor",
				insertText: '"floor(${1:number})"',
				filterText: '"math.floor"',
			},
		];

		await testCompletion(vueDocUri, position(42, 19), expectedCompletions);
		await testCompletion(svelteDocUri, position(34, 19), expectedCompletions);
		await testCompletion(astroDocUri, position(37, 19), expectedCompletions);
	});

	it("Offers namespace completion inside string interpolation with preceeding non-space character", async () => {
		const expectedCompletions = [
			{
				label: "$var-var-variable",
				insertText: '".$var-var-variable"',
				filterText: '"ns.$var-var-variable"',
			},
			{
				label: "fun-fun-function",
				insertText: '".fun-fun-function()"',
			},
		];

		await testCompletion(docUri, position(26, 20), expectedCompletions);
	});

	it("Offers namespace completion as part of return statement", async () => {
		const expectedCompletions = [
			{
				label: "$var-var-variable",
				insertText: '".$var-var-variable"',
				filterText: '"ns.$var-var-variable"',
			},
			{
				label: "fun-fun-function",
				insertText: '".fun-fun-function()"',
			},
		];

		await testCompletion(docUri, position(30, 23), expectedCompletions);
	});
});

describe("SassDoc Completion Test", () => {
	const docUri = getDocUri("completion/sassdoc.scss");

	before(async () => {
		await showFile(docUri);
	});

	it("Offers completions for SassDoc block on mixin without parameters or @content", async () => {
		const expectedCompletions = [
			{
				label: "SassDoc Block",
				insertText: '" ${0}\\n/// @output ${1}"',
			},
		];

		await testCompletion(docUri, position(3, 4), expectedCompletions);
	});

	it("Offers completions for SassDoc block on mixin with @content", async () => {
		const expectedCompletions = [
			{
				label: "SassDoc Block",
				insertText: '" ${0}\\n/// @content ${1}\\n/// @output ${2}"',
			},
		];

		await testCompletion(docUri, position(8, 4), expectedCompletions);
	});

	it("Offers completions for SassDoc block on mixin with parameters", async () => {
		const expectedCompletions = [
			{
				label: "SassDoc Block",
				insertText:
					'" ${0}\\n/// @param {${1:Number}} \\\\$a [1px] ${2:-}\\n/// @param {${3:Number}} \\\\$b [2px] ${4:-}\\n/// @output ${5:-}"',
			},
		];

		await testCompletion(docUri, position(13, 4), expectedCompletions);
	});

	it("Offers completions for SassDoc block on mixin with parameters and @content", async () => {
		const expectedCompletions = [
			{
				label: "SassDoc Block",
				insertText:
					'" ${0}\\n/// @param {${1:type}} \\\\$a ${2:-}\\n/// @param {${3:type}} \\\\$b ${4:-}\\n/// @output ${5:-}"',
			},
		];

		await testCompletion(docUri, position(18, 4), expectedCompletions);
	});

	it("Offers completions for SassDoc block on parameterless function", async () => {
		const expectedCompletions = [
			{
				label: "SassDoc Block",
				insertText: '" ${0}\\n/// @return {${1:type}} ${2:-}"',
			},
		];

		await testCompletion(docUri, position(25, 4), expectedCompletions);
	});

	it("Offers completions for SassDoc block on parameterfull function", async () => {
		const expectedCompletions = [
			{
				label: "SassDoc Block",
				insertText:
					'" ${0}\\n/// @param {${1:Number}} \\\\$a [1px] ${2:-}\\n/// @param {${3:Number}} \\\\$b [2px] ${4:-}\\n/// @return {${5:type}} ${6:-}"',
			},
		];

		await testCompletion(docUri, position(30, 4), expectedCompletions);
	});
});

describe("Placeholders", () => {
	const docUri = getDocUri("completion/placeholders.scss");

	before(async () => {
		await showFile(docUri);
		await sleepCI();
	});

	it("Offers completions for placeholders", async () => {
		const expectedCompletions = [
			{
				label: "%mediumAlert",
				insertText: "mediumAlert",
			},
			{
				label: "%strongAlert",
				insertText: "strongAlert",
			},
		];

		await testCompletion(docUri, position(9, 14), expectedCompletions);
	});

	it("Completions filter as expected", async () => {
		const expectedCompletions = [
			{
				label: "%strongAlert",
				insertText: "strongAlert",
			},
		];

		await testCompletion(docUri, position(13, 15), expectedCompletions);
	});
});

describe("Reverse placeholders", () => {
	const docUri = getDocUri("completion/reverse-placeholders/_theme.scss");

	before(async () => {
		await showFile(docUri);
		await sleepCI();
	});

	it("Offers completions for placeholder usages when implementing a placeholder selector", async () => {
		await testCompletion(docUri, position(1, 2), [
			{
				label: "%app",
				insertText: "app",
			},
			{
				label: "%app",
				labelDetails: { detail: " { }" },
			},
			{
				label: "%chat",
				insertText: "chat",
			},
			{
				label: "%chat",
				labelDetails: { detail: " { }" },
			},
		]);

		await testCompletion(docUri, position(3, 4), [
			{
				label: "%chat",
				insertText: "chat",
			},
			{
				label: "%chat",
				labelDetails: { detail: " { }" },
			},
		]);
	});
});
