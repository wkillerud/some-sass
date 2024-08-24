const { getDocUri, showFile, position, sleepCI } = require("./util");
const { testHover } = require("./hover-helper");

const docUri = getDocUri("hover/main.scss");
const collisionUri = getDocUri("hover/collision.scss");
const pkgImportUri = getDocUri("pkg-import/src/styles.scss");

before(async () => {
	await showFile(docUri);
	await showFile(collisionUri);
	await showFile(pkgImportUri);
	await sleepCI();
});

test("shows hover for variables", async () => {
	const expectedContents = {
		contents: [
			"```scss\n$variable: 'value';\n```\n____\nVariable declared in _variables.scss",
		],
	};

	await testHover(docUri, position(7, 13), expectedContents);
});

test("shows hover for functions", async () => {
	const expectedContents = {
		contents: [
			"```scss\n@function function()\n```\n____\nFunction declared in _functions.scss",
		],
	};

	await testHover(docUri, position(7, 24), expectedContents);
});

test("shows hover for mixins", async () => {
	const expectedContents = {
		contents: [
			"```scss\n@mixin mixin()\n```\n____\nMixin declared in _mixins.scss",
		],
	};

	await testHover(docUri, position(9, 12), expectedContents);
});

test("shows hover for placeholders", async () => {
	const expectedContents = {
		contents: [
			"```scss\n%alert\n```\n____\nPlaceholder declared in _placeholders.scss",
		],
	};

	await testHover(docUri, position(30, 14), expectedContents);
});

test("shows hover for symbol behind namespace", async () => {
	const expectedContents = {
		contents: [
			"```scss\n$var-var-variable: 'value';\n```\n____\nVariable declared in _variables.scss",
		],
	};

	await testHover(docUri, position(15, 14), expectedContents);
});

test("shows hover for symbol behind namespace and prefix", async () => {
	// Prefixed symbols are shown with their original names
	const expectedContents = {
		contents: [
			"```scss\n@mixin mix-mix-mixin()\n```\n____\nMixin declared as mix-mixin in _mixins.scss",
		],
	};

	await testHover(docUri, position(16, 17), expectedContents);
});

test("shows hover for SassDoc annotations", async () => {
	// Prefixed symbols are shown with their original names
	const expectedContents = {
		contents: [
			"@type\n____\n[SassDoc reference](http://sassdoc.com/annotations/#type)",
		],
	};

	await testHover(docUri, position(20, 6), expectedContents);

	const expectedEmpty = {
		contents: [""],
	};

	await testHover(docUri, position(20, 5), expectedEmpty);
});

test("shows hover for Sass built-in", async () => {
	// Prefixed symbols are shown with their original names
	const expectedContents = {
		contents: [
			"Rounds down to the nearest whole number.\n\n[Sass reference](https://sass-lang.com/documentation/modules/math#floor)",
		],
	};

	await testHover(docUri, position(26, 22), expectedContents);
});

test("shows hover for user-defined symbol in case of naming collision with built-in", async () => {
	// Prefixed symbols are shown with their original names
	const expectedContents = {
		contents: ["Deliberate name collision with sass:map"],
	};

	await testHover(collisionUri, position(5, 20), expectedContents);
});

test("shows hover for symbols from pkg: import", async () => {
	const expectedContents = {
		contents: ["Primary brand color"],
	};
	await testHover(pkgImportUri, position(4, 19), expectedContents);
});
