const assert = require("assert");
const vscode = require("vscode");
const { showFile } = require("./util");

/**
 * @typedef {object} CompletionTestOptions
 * @property {boolean} [expectNoMatch=false]
 */

/**
 * @param {import('vscode').Uri} docUri
 * @param {import('vscode').Position} position
 * @param {Array<string | import('vscode-languageclient').CompletionItem>} expectedItems
 * @param {CompletionTestOptions} options
 * @returns {Promise<void>}
 */
async function testCompletion(
	docUri,
	position,
	expectedItems,
	options = { expectNoMatch: false },
) {
	await showFile(docUri);

	const result = /** @type {import('vscode').CompletionList} */ (
		await vscode.commands.executeCommand(
			"vscode.executeCompletionItemProvider",
			docUri,
			position,
		)
	);

	expectedItems.forEach((ei) => {
		if (typeof ei === "string") {
			if (options.expectNoMatch) {
				const match = result.items.find((i) => i.label === ei);
				if (!match) {
					assert.ok(`Found no match for ${ei}`);
				} else {
					assert.fail(
						`Expected NOT to find ${ei} among results, but it's there: ${result.items.map(
							(i) => i.label,
						)}`,
					);
				}
				return;
			} else {
				assert.ok(
					result.items.some((i) => {
						return i.label === ei;
					}),
					`Expected to find ${ei} among results`,
				);
			}
		} else {
			const match = result.items.find((i) => {
				if (Object.prototype.hasOwnProperty.call(ei, "filterText")) {
					if (JSON.stringify(i.filterText) === ei.filterText) {
						return true;
					} else {
						return false;
					}
				}

				if (typeof i.label === "string") {
					return i.label === ei.label;
				}
				return i.label.label === ei.label;
			});
			if (!match) {
				if (options.expectNoMatch) {
					assert.ok(`Found no match for ${ei.label}`);
				} else {
					assert.fail(
						`Can't find matching item for ${JSON.stringify(ei, null, 2)}`,
					);
				}
				return;
			}

			if (typeof match.label === "string") {
				assert.strictEqual(match.label, ei.label);
			} else {
				assert.strictEqual(match.label.label, ei.label);
			}

			if (ei.kind) {
				assert.strictEqual(match.kind, ei.kind);
			}
			if (ei.detail) {
				assert.strictEqual(match.detail, ei.detail);
			}

			if (ei.insertText) {
				assert.ok(
					JSON.stringify(match.insertText).includes(ei.insertText),
					`Expected insertText to include ${
						ei.insertText
					}. Actual: ${JSON.stringify(match.insertText)}`,
				);
			}

			if (
				typeof match.documentation === "string" &&
				typeof ei.documentation === "string"
			) {
				assert.strictEqual(match.documentation, ei.documentation);
			} else if (
				typeof ei.documentation === "object" &&
				typeof match.documentation === "object"
			) {
				assert.strictEqual(match.documentation.value, ei.documentation.value);
			}
		}
	});
}

module.exports = {
	testCompletion,
};
