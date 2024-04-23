const vscode = require("vscode");

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms = 1000) {
	if (process.env["CI"]) {
		return new Promise((resolve) => setTimeout(resolve, ms * 2));
	}
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @param {string} path
 * @returns {import('vscode').Uri}
 */
function getDocUri(path) {
	return vscode.Uri.from({
		scheme: "vscode-test-web",
		authority: "mount",
		path: `/${path}`,
	});
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

module.exports = {
	sleep,
	showFile,
	getDocUri,
	position,
	sameLineLocation,
	sameLineRange,
};
