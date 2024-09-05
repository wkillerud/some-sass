const vscode = require("vscode");
const { getDocUri, showFile, position, sleepCI, type, sleep } = require("./util");
const { testCompletion } = require("./completion-helper");
const assert = require("assert");

const docUri = getDocUri("completion/main.scss");
const modulesDocUri = getDocUri("completion/modules.scss");

before(async () => {
	await showFile(docUri);
	await sleepCI();
});

test("Offers completions when using node_modules", async () => {
	await testCompletion(modulesDocUri, position(1, 17), [
		{
			label: "scss/",
			insertText: "scss/",
		},
	]);
	await testCompletion(modulesDocUri, position(2, 22), [
		{
			label: "bootstrap.scss",
			insertText: "bootstrap",
		},
	]);
	await testCompletion(modulesDocUri, position(3, 11), [
		{
			label: "bar.scss",
			insertText: "bar",
		},
	]);

	// Deprecated tilde imports
	await testCompletion(modulesDocUri, position(4, 18), [
		{
			label: "scss/",
			insertText: "scss/",
		},
	]);
	await testCompletion(modulesDocUri, position(5, 23), [
		{
			label: "bootstrap.scss",
			insertText: "bootstrap",
		},
	]);
	await testCompletion(modulesDocUri, position(6, 12), [
		{
			label: "bar.scss",
			insertText: "bar",
		},
	]);
});

test("Offers completions from tilde imports", async () => {
	let expectedCompletions = [
		{
			label: "$tilde",
			insertText: '"$tilde"',
		},
	];
	await testCompletion(docUri, position(11, 11), expectedCompletions);
});

test("Offers completions from partial file", async () => {
	const expectedCompletions = [{ label: "$partial" }];

	await testCompletion(docUri, position(17, 11), expectedCompletions);
});

test("Offers namespaces completions including prefixes", async () => {
	let expectedCompletions = [
		{
			label: "$var-var-variable",
			insertText: '".$var-var-variable"',
			filterText: '"ns.$var-var-variable"',
		},
		{
			label: "fun-fun-function",
			insertText: '".fun-fun-function()"',
		},
	];

	await testCompletion(docUri, position(23, 13), expectedCompletions);

	expectedCompletions = [
		{
			label: "mix-mix-mixin",
			insertText: '".mix-mix-mixin"',
		},
	];

	await testCompletion(docUri, position(24, 15), expectedCompletions);
});

test("shows completions for a module after typing the module name and .", async () => {
	const completions = await showFile(docUri);

	const cursor = new vscode.Position(39, 0);
	completions.selection = new vscode.Selection(cursor, cursor);

	// should show suggestions from sass:math
	await type(completions, "$e: math.");

	// give suggestions time to appear
	await sleep(300);

	// accept the first
	await vscode.commands.executeCommand("acceptSelectedSuggestion");

	// confirm the suggestion was applied
	assert.match(completions.document.getText(), /\$e: math\.\$e/);
});

test("Offers namespace completion inside string interpolation", async () => {
	let expectedCompletions = [
		{
			label: "$var-var-variable",
			insertText: '".$var-var-variable"',
			filterText: '"ns.$var-var-variable"',
		},
		{
			label: "fun-fun-function",
			insertText: '".fun-fun-function()"',
		},
	];

	await testCompletion(docUri, position(25, 40), expectedCompletions);
});

test("Offers completions for Sass built-ins", async () => {
	let expectedCompletions = [
		{
			label: "floor",
			insertText: '".floor(${1:number})"',
			filterText: '"math.floor"',
		},
	];

	await testCompletion(docUri, position(36, 19), expectedCompletions);
});

test("Offers namespace completion inside string interpolation with preceeding non-space character", async () => {
	const expectedCompletions = [
		{
			label: "$var-var-variable",
			insertText: '".$var-var-variable"',
			filterText: '"ns.$var-var-variable"',
		},
		{
			label: "fun-fun-function",
			insertText: '".fun-fun-function()"',
		},
	];

	await testCompletion(docUri, position(26, 20), expectedCompletions);
});

test("Offers namespace completion as part of return statement", async () => {
	const expectedCompletions = [
		{
			label: "$var-var-variable",
			insertText: '".$var-var-variable"',
			filterText: '"ns.$var-var-variable"',
		},
		{
			label: "fun-fun-function",
			insertText: '".fun-fun-function()"',
		},
	];

	await testCompletion(docUri, position(30, 23), expectedCompletions);
});
