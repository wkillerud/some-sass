const assert = require("assert");
const vscode = require("vscode");
const { getDocUri, showFile, sleepCI } = require("./util");

const styles = getDocUri("styles.sass");
const tokens = getDocUri("core/_tokens.sass");
const theme = getDocUri("core/_theme.sass");

before(async () => {
	await showFile(styles);
	await sleepCI();
});

test("finds definition of a sass variable", async () => {
	const expected = new vscode.Location(
		tokens,
		new vscode.Range(new vscode.Position(20, 0), new vscode.Position(20, 23)),
	);

	await testDefinition(styles, new vscode.Position(4, 40), expected);
});

test("finds definition of a sass mixin included with short-hand", async () => {
	const expected = new vscode.Location(
		theme,
		new vscode.Range(new vscode.Position(0, 7), new vscode.Position(0, 27)),
	);

	await testDefinition(styles, new vscode.Position(3, 13), expected);
});

test("finds definition of a sass mixin included with at-rule", async () => {
	const expected = new vscode.Location(
		theme,
		new vscode.Range(new vscode.Position(5, 7), new vscode.Position(5, 26)),
	);

	await testDefinition(styles, new vscode.Position(7, 13), expected);
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
