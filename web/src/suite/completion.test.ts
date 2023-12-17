import * as assert from "assert";
import * as vscode from "vscode";
import { getDocUri, position, showFile, sleep } from "./util";

type CompletionTestOptions = {
	/**
	 * @default false
	 */
	expectNoMatch: boolean;
};

async function testCompletion(
	docUri: vscode.Uri,
	position: vscode.Position,
	expectedItems: (string | vscode.CompletionItem)[],
	options: CompletionTestOptions = { expectNoMatch: false },
) {
	await showFile(docUri);

	const result = (await vscode.commands.executeCommand(
		"vscode.executeCompletionItemProvider",
		docUri,
		position,
	)) as vscode.CompletionList;

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
				const value =
					typeof ei.insertText === "string"
						? ei.insertText
						: ei.insertText.value;
				assert.ok(
					JSON.stringify(match.insertText).includes(value),
					`Expected insertText to include ${value}. Actual: ${JSON.stringify(
						match.insertText,
					)}`,
				);
			}

			// This may deliberatly be undefined, in which case the filter matches the label
			if (Object.prototype.hasOwnProperty.call(ei, "filterText")) {
				assert.strictEqual(
					JSON.stringify(match.filterText),
					ei.filterText,
					`Expected filterText to match ${
						ei.filterText
					}. Actual: ${JSON.stringify(match.filterText)}`,
				);
			}

			if (ei.documentation) {
				if (typeof match.documentation === "string") {
					assert.strictEqual(match.documentation, ei.documentation);
				} else {
					const value = ei.documentation
						? typeof ei.documentation === "string"
							? ei.documentation
							: ei.documentation.value
						: "";
					if (value && match.documentation) {
						assert.strictEqual(
							(match.documentation as vscode.MarkdownString).value,
							value,
						);
					}
				}
			}
		}
	});
}

describe("Reverse placeholders", () => {
	const docUri = getDocUri("completion/reverse-placeholders/_theme.scss");

	before(async () => {
		await showFile(docUri);
		await sleep(5000);
	});

	it("Offers completions for placeholder usages when implementing a placeholder selector", async () => {
		await testCompletion(docUri, position(1, 2), [
			{
				label: "%app",
				insertText: "app",
			},
			{
				label: "%chat",
				insertText: "chat",
			},
		]);

		await testCompletion(docUri, position(3, 4), [
			{
				label: "%chat",
				insertText: "chat",
			},
		]);
	});
});
