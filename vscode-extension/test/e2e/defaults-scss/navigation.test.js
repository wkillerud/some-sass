const vscode = require("vscode");
const { getDocUri, showFile, sleepCI } = require("./util");
const assert = require("assert");

const mainUri = getDocUri("completion/main.scss");
const circularUri = getDocUri("completion/circular.scss");

before(async () => {
	await showFile(mainUri);
	await sleepCI();
});

after(async () => {
	await vscode.commands.executeCommand("workbench.action.closeAllEditors");
});

test("navigating to a circular dependency does not cause a loop (#206)", async () => {
	await showFile(mainUri);
	let links = await findDocumentLinks(mainUri);

	const circular = links.find(
		(v) => v.target && v.target.path.endsWith("circular.scss"),
	);
	if (!circular || !circular.target) {
		return assert.fail("Didn't find a working link to circular.scss");
	}

	await goToTarget(circular.target);

	assert.equal(
		vscode.window.activeTextEditor?.document.uri.fsPath,
		circularUri.fsPath,
		"Should be viewing circular.scss right now",
	);

	links = await findDocumentLinks(circular.target);
	const main = links.find(
		(v) => v.target && v.target.path.endsWith("main.scss"),
	);
	if (!main || !main.target) {
		return assert.fail("Didn't find a working link to main.scss");
	}

	await goToTarget(main.target);

	assert.equal(
		vscode.window.activeTextEditor?.document.uri.fsPath,
		mainUri.fsPath,
		"Should be viewing main.scss right now",
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
