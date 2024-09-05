const assert = require("assert");
const vscode = require("vscode");
const { getDocUri, showFile, sleepCI } = require("./util");

const stylesUri = getDocUri("styles.sass");

before(async () => {
	await showFile(stylesUri);
	await sleepCI();
});

test("shows hover information for a Sass shorthand mixin", async () => {
	const [hover] = await doHover(stylesUri, new vscode.Position(3, 10));
	assert.ok(hover, "Didn't get hover info for shorthand mixin");

	assertHoverMatch(hover, /light-mode-variables/);
	assertHoverMatch(hover, /Mixin declared in _theme\.sass/);
});

test("shows hover information for a Sass at-rule mixin", async () => {
	const [hover] = await doHover(stylesUri, new vscode.Position(7, 10));
	assert.ok(hover, "Didn't get hover info for at-rule mixin");

	assertHoverMatch(hover, /dark-mode-variables/);
	assertHoverMatch(hover, /Mixin declared in _theme\.sass/);
});

test("shows hover information for a Sass variable", async () => {
	const [hover] = await doHover(stylesUri, new vscode.Position(14, 24));
	assert.ok(hover, "Didn't get hover info for Sass variable");

	assertHoverMatch(hover, /font-size-body/);
	assertHoverMatch(hover, /Variable declared in _tokens\.sass/);
});

test("shows hover info for a CSS attribute", async () => {
	const [hover] = await doHover(stylesUri, new vscode.Position(12, 5));
	assert.ok(hover, "Didn't get hover info for a CSS attribute");

	assertHoverMatch(hover, /Sets the background color/);
	assertHoverMatch(hover, /MDN Reference/);
});

test("shows hover info for a selector", async () => {
	const [hover] = await doHover(stylesUri, new vscode.Position(11, 0));
	assert.ok(hover, "Didn't get hover info for a CSS selector");

	assertHoverMatch(hover, /Specificity/);
});

/**
 *
 * @param {import('vscode').Uri} uri
 * @param {import('vscode').Position} position
 * @returns {Promise<import('vscode').Hover[]>}
 */
async function doHover(uri, position) {
	return await vscode.commands.executeCommand(
		"vscode.executeHoverProvider",
		uri,
		position,
	);
}

/**
 * @param {import('vscode').Hover} hover
 * @param {RegExp} re
 */
function assertHoverMatch(hover, re) {
	let hoverContents = hover.contents
		.map(
			(content) =>
				/** @type {import('vscode').MarkdownString} */ (content).value,
		)
		.join("\n");
	assert.match(hoverContents, re);
}
