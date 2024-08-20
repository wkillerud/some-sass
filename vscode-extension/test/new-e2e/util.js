const vscode = require("vscode");

/**
 * Line and Char as shown in lowerright of VS Code
 *
 * @param {number} char
 * @param {number} line
 * @returns {import('vscode').Position}
 */
function position(line, char) {
	return new vscode.Position(line - 1, char - 1);
}

/**
 * @param {number} line
 * @param {number} startChar
 * @param {number} endChar
 * @returns {import('vscode').Range}
 */
function sameLineRange(line, startChar, endChar) {
	return new vscode.Range(position(line, startChar), position(line, endChar));
}

/**
 * @param {import('vscode').Uri} uri
 * @param {number} line
 * @param {number} startChar
 * @param {number} endChar
 * @returns {import('vscode').Location}
 */
function sameLineLocation(uri, line, startChar, endChar) {
	return new vscode.Location(uri, sameLineRange(line, startChar, endChar));
}

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @param {import('vscode').Uri} docUri
 * @returns {Promise<import('vscode').TextEditor>}
 */
async function showFile(docUri) {
	const doc = await vscode.workspace.openTextDocument(docUri);
	return vscode.window.showTextDocument(doc);
}

/**
 * Try to work around some instabilities on CI
 * @param {number} ms
 * @returns {Promise<void>}
 */
async function sleepCI(ms = 2000) {
	if (process.env["CI"]) {
		await sleep(ms);
		return;
	}

	await sleep(0);
}

module.exports = {
	sleep,
	sleepCI,
	showFile,
	position,
	sameLineLocation,
	sameLineRange,
};
