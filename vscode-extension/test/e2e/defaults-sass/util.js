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

/**
 * @private
 * @param {import('vscode').TextDocument} doc
 * @returns {Promise<import('vscode').TextDocument>}
 */
function onDocumentChange(doc) {
	return new Promise(resolve => {
		const sub = vscode.workspace.onDidChangeTextDocument(e => {
			if (e.document !== doc) {
				return;
			}
			sub.dispose();
			resolve(e.document);
		});
	});
};

/**
 *
 * @param {import('vscode').TextDocument} document
 * @param {string} text
 * @returns {Promise<import('vscode').TextDocument>}
 */
async function type(document, text) {
	const onChange = onDocumentChange(document);
	await vscode.commands.executeCommand('type', { text });
	await onChange;
	return document;
};

module.exports = {
	sleep,
	sleepCI,
	showFile,
	getDocPath,
	getDocUri,
	type,
};
