const path = require("path");
const vscode = require("vscode");
const {
	showFile,
	sleep,
	sleepCI,
} = require("../util");

/**
 * @param {string} p
 * @returns {string}
 */
function getDocPath(p) {
	return path.resolve(__dirname, "workspace", p);
}

/**
 * @param {string} p
 * @returns {import('vscode').Uri}
 */
function getDocUri(p) {
	return vscode.Uri.file(getDocPath(p));
}

module.exports = {
	sleep,
	sleepCI,
	showFile,
	getDocPath,
	getDocUri,
};
