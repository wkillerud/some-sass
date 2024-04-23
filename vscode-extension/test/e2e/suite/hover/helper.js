const assert = require("assert");
const vscode = require("vscode");
const { showFile } = require("../util");

/**
 * @param {import('vscode').Uri} docUri
 * @param {import('vscode').Position} position
 * @param {import('vscode').Hover} expectedHover
 * @returns {Promise<void>}
 */
async function testHover(docUri, position, expectedHover) {
	await showFile(docUri);

	const result = /** @type {import('vscode').Hover[]} */ (
		await vscode.commands.executeCommand(
			"vscode.executeHoverProvider",
			docUri,
			position,
		)
	);

	if (!result[0]) {
		throw new Error(`Hover failed at position ${JSON.stringify(position)}`);
	}

	const contents = result
		.map((item) => {
			return item.contents.map((content) => {
				return /** @type {import('vscode').MarkdownString} */ (content).value;
			});
		})
		.join("\n");

	// We use `.includes` here because the hover can contain content from other plugins.
	assert.ok(
		contents.includes(expectedHover.contents.join("")),
		`Hover does not include expected output. Actual: '${contents}'.`,
	);

	if (expectedHover.range && result[0] && result[0].range) {
		assert.ok(
			result[0].range.isEqual(expectedHover.range),
			`Expected output does not match expected range. Actual: '${result[0].range?.toString()}'.`,
		);
	}
}

module.exports = {
	testHover,
};
