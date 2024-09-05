const { getDocUri, showFile, position, sleepCI } = require("./util");
const { testCompletion } = require("./completion-helper");

const docUri = getDocUri("completion/reverse-placeholders/_theme.scss");

before(async () => {
	await showFile(docUri);
	await sleepCI();
});

test("Offers completions for placeholder usages when implementing a placeholder selector", async () => {
	await testCompletion(docUri, position(1, 2), [
		{
			label: "%app",
			insertText: "app",
		},
		{
			label: "%app",
			labelDetails: { detail: " { }" },
		},
		{
			label: "%chat",
			insertText: "chat",
		},
		{
			label: "%chat",
			labelDetails: { detail: " { }" },
		},
	]);

	await testCompletion(docUri, position(3, 4), [
		{
			label: "%chat",
			insertText: "chat",
		},
		{
			label: "%chat",
			labelDetails: { detail: " { }" },
		},
	]);
});
