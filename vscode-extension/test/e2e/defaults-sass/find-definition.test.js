const vscode = require("vscode");
const { getDocUri, showFile, sleepCI } = require("./util");
const { testDefinition } = require("./definition-helper");

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
