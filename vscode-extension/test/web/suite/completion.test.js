const { testCompletion } = require("./completion-helper");
const { getDocUri, showFile, position, sleep } = require("./util");

const docUri = getDocUri("completion/main.scss");

before(async () => {
	await showFile(docUri);
	await sleep();
});

// Started having issues in Nightly around August 20 2024. Manual test in browser works OK.
test.skip("from partial file", async () => {
	const expectedCompletions = [{ label: "$partial" }];

	await testCompletion(docUri, position(17, 11), expectedCompletions);
});

test("for namespaces including prefixes", async () => {
	let expectedCompletions = [
		{
			label: "$var-var-variable",
			insertText: '"ns.$var-var-variable"',
			filterText: '"ns.$var-var-variable"',
		},
		{
			label: "fun-fun-function",
			insertText: '"ns.fun-fun-function()"',
		},
	];

	await testCompletion(docUri, position(23, 13), expectedCompletions);

	expectedCompletions = [
		{
			label: "mix-mix-mixin",
			insertText: '"ns.mix-mix-mixin"',
		},
	];

	await testCompletion(docUri, position(24, 15), expectedCompletions);
});

test("inside string interpolation", async () => {
	const expectedCompletions = [
		{
			label: "$var-var-variable",
			insertText: '"ns.$var-var-variable"',
			filterText: '"ns.$var-var-variable"',
		},
		{
			label: "fun-fun-function",
			insertText: '"ns.fun-fun-function()"',
		},
	];

	await testCompletion(docUri, position(25, 40), expectedCompletions);
});

test("for Sass built-ins", async () => {
	const expectedCompletions = [
		{
			label: "floor",
			insertText: '"math.floor(${1:number})"',
			filterText: '"math.floor"',
		},
	];

	await testCompletion(docUri, position(36, 19), expectedCompletions);
});

test("inside string interpolation with preceeding non-space character", async () => {
	const expectedCompletions = [
		{
			label: "$var-var-variable",
			insertText: '"ns.$var-var-variable"',
			filterText: '"ns.$var-var-variable"',
		},
		{
			label: "fun-fun-function",
			insertText: '"ns.fun-fun-function()"',
		},
	];

	await testCompletion(docUri, position(26, 20), expectedCompletions);
});

test("as part of return statement", async () => {
	const expectedCompletions = [
		{
			label: "$var-var-variable",
			insertText: '"ns.$var-var-variable"',
			filterText: '"ns.$var-var-variable"',
		},
		{
			label: "fun-fun-function",
			insertText: '"ns.fun-fun-function()"',
		},
	];

	await testCompletion(docUri, position(30, 23), expectedCompletions);
});
