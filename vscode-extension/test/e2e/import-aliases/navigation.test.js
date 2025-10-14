const vscode = require("vscode");
const { getDocUri, showFile, sleepCI } = require("./util");
const assert = require("assert");

const mainUri = getDocUri("apps/frontpage/styles.scss");
const moduleUri = getDocUri("packages/fake-module/fake-module.scss");
const colorsUri = getDocUri("packages/fake-module/_colors.scss");

before(async () => {
	await showFile(mainUri);
	await sleepCI();
});

after(async () => {
	await vscode.commands.executeCommand("workbench.action.closeAllEditors");
});

test("supports import aliases (#347)", async () => {
	await showFile(mainUri);
	let links = await findDocumentLinks(mainUri);

	const module = links.find(
		(v) => v.target && v.target.path.endsWith("fake-module.scss"),
	);
	if (!module || !module.target) {
		return assert.fail("Didn't find a working link to fake-module.scss");
	}

	await goToTarget(module.target);

	assert.equal(
		vscode.window.activeTextEditor?.document.uri.fsPath,
		moduleUri.fsPath,
		"Should be viewing fake-module.scss right now",
	);
});

test("supports import aliases to directories", async () => {
	await showFile(mainUri);
	let links = await findDocumentLinks(mainUri);

	const module = links.find(
		(v) => v.target && v.target.path.endsWith("colors.scss"),
	);
	if (!module || !module.target) {
		return assert.fail("Didn't find a working link to _colors.scss");
	}

	await goToTarget(module.target);

	assert.equal(
		vscode.window.activeTextEditor?.document.uri.fsPath,
		colorsUri.fsPath,
		"Should be viewing _colors.scss right now",
	);
});


/**
 * @param {import('vscode').Uri} documentUri
 * @returns {Promise<import('vscode').DocumentLink[]>}
 */
async function findDocumentLinks(documentUri) {
	/** @type {import('vscode').DocumentLink[]} */
	const links = await vscode.commands.executeCommand(
		"vscode.executeLinkProvider",
		documentUri,
		/*linkResolveCount*/ 100,
	);
	return links;
}

/**
 * @param {import('vscode').Uri} uri
 * @returns {Promise<void>}
 */
async function goToTarget(uri) {
	await vscode.commands.executeCommand("vscode.open", uri);
}
