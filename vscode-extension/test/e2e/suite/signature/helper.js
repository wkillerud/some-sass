const assert = require("assert");
const vscode = require("vscode");
const { showFile } = require("../util");

/**
 * @param {import('vscode').Uri} docUri
 * @param {import('vscode').Position} position
 * @param {import('vscode').SignatureHelp} signature
 * @returns {Promise<void>}
 */
async function testSignature(docUri, position, signature) {
	await showFile(docUri);

	const result = /** @type {import('vscode').SignatureHelp} */ (
		await vscode.commands.executeCommand(
			"vscode.executeSignatureHelpProvider",
			docUri,
			position,
		)
	);

	if (result === undefined) {
		assert.fail("The 'result' is undefined.");
	}

	assert.strictEqual(
		result.activeParameter,
		signature.activeParameter,
		`activeParameter in ${docUri.fsPath}`,
	);
	assert.strictEqual(
		result.activeSignature,
		signature.activeSignature,
		"activeSignature",
	);

	assert.strictEqual(
		result.signatures.length,
		signature.signatures.length,
		`Count of signatures: ${signature.signatures.length} expected; ${result.signatures.length} actual`,
	);

	signature.signatures.forEach((expectedSignature, i) => {
		const actualSignature = result.signatures[i];

		if (actualSignature === undefined) {
			assert.fail("The 'actualSignature' is undefined.");
		}

		assert.strictEqual(actualSignature.label, expectedSignature.label);

		assert.strictEqual(
			actualSignature.parameters.length,
			expectedSignature.parameters.length,
			`Count of parameters for {expectedSignature.label}: ${expectedSignature.parameters.length} expected; ${actualSignature.parameters.length} actual`,
		);
	});
}

module.exports = {
	testSignature,
};
