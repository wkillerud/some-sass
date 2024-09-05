const assert = require("assert");
const vscode = require("vscode");
const { showFile } = require("./util");

/**
 * @param {import('vscode').Uri} docUri
 * @param {import('vscode').Position} position
 * @param {import('vscode').Location} expectedLocation
 * @returns {Promise<void>}
 */
async function testDefinition(docUri, position, expectedLocation) {
	await showFile(docUri);

	const result =
		/** @type {import('vscode').Location[]} */
		(
			await vscode.commands.executeCommand(
				"vscode.executeDefinitionProvider",
				docUri,
				position,
			)
		);

	if (result[0] === undefined) {
		assert.fail("The 'result[0]' is undefined.");
	}

	assert.ok(
		result[0].range.isEqual(expectedLocation.range),
		`Expected ${JSON.stringify(result[0].range)} to equal ${JSON.stringify(
			expectedLocation.range,
		)} in ${docUri.fsPath}`,
	);
	assert.strictEqual(result[0].uri.fsPath, expectedLocation.uri.fsPath);
}

module.exports = { testDefinition };
