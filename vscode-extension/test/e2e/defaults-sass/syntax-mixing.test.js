const assert = require("assert");
const vscode = require("vscode");
const { getDocUri, showFile, sleepCI } = require("./util");

const indentedStyles = getDocUri("syntax-mixing/styles.sass");
const scssStyles = getDocUri("syntax-mixing/styles.scss");
const indentedTokens = getDocUri("syntax-mixing/_indented.sass");
const scssTokens = getDocUri("syntax-mixing/_scss.scss");

before(async () => {
	await showFile(indentedStyles);
	await showFile(scssStyles);
	await sleepCI();
});

test("finds definition of a variable declared in indented from scss", async () => {
	const expected = new vscode.Location(
		indentedTokens,
		new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 10)),
	);

	await testDefinition(scssStyles, new vscode.Position(4, 24), expected);
});

test("finds definition of a variable declared in scss from indented", async () => {
	const expected = new vscode.Location(
		scssTokens,
		new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 10)),
	);

	await testDefinition(indentedStyles, new vscode.Position(5, 18), expected);
});


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
