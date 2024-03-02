import * as assert from "assert";
import * as vscode from "vscode";
import { showFile } from "../util";

export async function testHover(
	docUri: vscode.Uri,
	position: vscode.Position,
	expectedHover: vscode.Hover,
) {
	await showFile(docUri);

	const result: any[] = await vscode.commands.executeCommand(
		"vscode.executeHoverProvider",
		docUri,
		position,
	);

	if (!result[0]) {
		throw new Error(`Hover failed at position ${JSON.stringify(position)}`);
	}

	const contents = result
		.map((item) => {
			return item.contents.map((content: any) => content.value);
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
