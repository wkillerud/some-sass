const { testCompletion } = require("./completion-helper");
const { getDocUri, showFile, position, sleep } = require("./util");

const sassdoc = getDocUri("completion/sassdoc.scss");

before(async () => {
	await showFile(sassdoc);
	await sleep();
});

test("completions for SassDoc block on mixin without parameters or @content", async () => {
	const expectedCompletions = [
		{
			label: "SassDoc Block",
			insertText: '" ${0}\\n/// @output ${1}"',
		},
	];

	await testCompletion(sassdoc, position(3, 4), expectedCompletions);
});

test("completions for SassDoc block on mixin with @content", async () => {
	const expectedCompletions = [
		{
			label: "SassDoc Block",
			insertText: '" ${0}\\n/// @content ${1}\\n/// @output ${2}"',
		},
	];

	await testCompletion(sassdoc, position(8, 4), expectedCompletions);
});

test("completions for SassDoc block on mixin with parameters", async () => {
	const expectedCompletions = [
		{
			label: "SassDoc Block",
			insertText:
				'" ${0}\\n/// @param {${1:Number}} \\\\$a [1px] ${2:-}\\n/// @param {${3:Number}} \\\\$b [2px] ${4:-}\\n/// @output ${5}"',
		},
	];

	await testCompletion(sassdoc, position(13, 4), expectedCompletions);
});

test("completions for SassDoc block on mixin with parameters and @content", async () => {
	const expectedCompletions = [
		{
			label: "SassDoc Block",
			insertText:
				'" ${0}\\n/// @param {${1:type}} \\\\$a ${2:-}\\n/// @param {${3:type}} \\\\$b ${4:-}\\n/// @content ${5}\\n/// @output ${6}"',
		},
	];

	await testCompletion(sassdoc, position(18, 4), expectedCompletions);
});

test("completions for SassDoc block on parameterless function", async () => {
	const expectedCompletions = [
		{
			label: "SassDoc Block",
			insertText: '" ${0}\\n/// @return {${1:type}} ${2:-}"',
		},
	];

	await testCompletion(sassdoc, position(25, 4), expectedCompletions);
});

test("completions for SassDoc block on parameterfull function", async () => {
	const expectedCompletions = [
		{
			label: "SassDoc Block",
			insertText:
				'" ${0}\\n/// @param {${1:Number}} \\\\$a [1px] ${2:-}\\n/// @param {${3:Number}} \\\\$b [2px] ${4:-}\\n/// @return {${5:type}} ${6:-}"',
		},
	];

	await testCompletion(sassdoc, position(30, 4), expectedCompletions);
});
