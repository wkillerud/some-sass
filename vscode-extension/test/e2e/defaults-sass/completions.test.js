const assert = require("assert");
const vscode = require("vscode");
const { getDocUri, showFile, sleepCI, type, sleep } = require("./util");

const completionsUri = getDocUri("completions.sass");

before(async () => {
	await showFile(completionsUri);
	await sleepCI();
});

test("shows completions for a module after typing the module name and .", async () => {
	const completions = await showFile(completionsUri);
	await sleepCI();

	// give syntax highlighting time to tell Emmet to GTFO
	await sleep(300);

	const cursor = new vscode.Position(2, 0);
	completions.selection = new vscode.Selection(cursor, cursor);

	// should show suggestions for dark- and light-mode-variables
	await type(completions, "@include theme.");

	// give suggestions time to appear
	await sleep(300);

	// accept the first
	await vscode.commands.executeCommand("acceptSelectedSuggestion");

	// confirm the suggestion was applied
	assert.match(completions.document.getText(), /dark-mode-variables/);
});
