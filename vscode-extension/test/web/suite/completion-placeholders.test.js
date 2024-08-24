const { testCompletion } = require("./completion-helper");
const { getDocUri, showFile, position, sleep } = require("./util");


const placeholders = getDocUri("completion/placeholders.scss");
const theme = getDocUri("completion/reverse-placeholders/_theme.scss");

before(async () => {
	await showFile(placeholders);
	await showFile(theme);
	// TODO: figure out why we need to open main.scss and sleep here in the test. It works as expected in the browser.
	await showFile(getDocUri("completion/reverse-placeholders/main.scss"));
	await sleep();
});


test("get completions", async () => {
	const expectedCompletions = [
		{
			label: "%mediumAlert",
			insertText: "mediumAlert",
		},
	];

	await testCompletion(placeholders, position(9, 14), expectedCompletions);
});

test("when implementing a placeholder selector", async () => {
	await testCompletion(theme, position(1, 2), [
		{
			label: "%app",
			insertText: "app",
		},
		{
			label: "%chat",
			insertText: "chat",
		},
	]);

	await testCompletion(theme, position(3, 4), [
		{
			label: "%chat",
			insertText: "chat",
		},
	]);
});
