const { showFile, position, sleepCI } = require("../util");
const { testCompletion, getDocPath } = require("./helper");

describe("Suggest from use only", function () {
	const styles = getDocPath("styles.scss");

	before(async () => {
		await showFile(styles);
		await sleepCI();
	});

	it("setting gets applied", async () => {
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
});
