const { showFile, position, sleepCI } = require("../util");
const { testCompletion, getDocPath } = require("./helper");

const styles = getDocPath("styles.scss");

before(async () => {
	await showFile(styles);
	await sleepCI();
});

test("setting gets applied", async () => {
	await testCompletion(styles, position(3, 6), [
		{
			label: "$a",
		},
	]);

	// Does not suggest from b or c
	await testCompletion(
		styles,
		position(3, 6),
		[
			{
				label: "$b",
			},
		],
		{
			expectNoMatch: true,
		},
	);
	await testCompletion(
		styles,
		position(3, 6),
		[
			{
				label: "$c",
			},
		],
		{
			expectNoMatch: true,
		},
	);
});

test("offers no hidden items in namespace completions", async () => {
	let expectedCompletions = ["$secret"];

	await testCompletion(styles, position(23, 13), expectedCompletions, {
		expectNoMatch: true,
	});
});
