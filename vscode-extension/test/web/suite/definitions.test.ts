import * as assert from "assert";
import * as vscode from "vscode";
import { getDocUri, showFile, position, sameLineLocation, sleep } from "./util";

async function testDefinition(
	docUri: vscode.Uri,
	position: vscode.Position,
	expectedLocation: vscode.Location,
) {
	await showFile(docUri);

	const result: any = await vscode.commands.executeCommand(
		"vscode.executeDefinitionProvider",
		docUri,
		position,
	);

	if (result[0] === undefined) {
		assert.fail("The 'result[0]' is undefined.");
	}

	assert.ok(
		result[0].range.isEqual(expectedLocation.range),
		`Expected ${JSON.stringify(result[0].range)} to equal ${JSON.stringify(
			expectedLocation.range,
		)} in ${docUri.fsPath}`,
	);
	assert.strictEqual(result[0].uri.fsPath, expectedLocation.uri.fsPath);
}

describe("Definitions", function () {
	const docUri = getDocUri("definition/main.scss");

	before(async () => {
		await showFile(docUri);
		await sleep(1000);
	});

	it("should find definition for variables", async () => {
		const expectedDocumentUri = getDocUri("_variables.scss");
		const expectedLocation = sameLineLocation(expectedDocumentUri, 1, 1, 10);
		await testDefinition(docUri, position(7, 13), expectedLocation);
	});

	it("should find definition for functions", async () => {
		const expectedDocumentUri = getDocUri("_functions.scss");
		const expectedLocation = sameLineLocation(expectedDocumentUri, 1, 1, 9);
		await testDefinition(docUri, position(7, 24), expectedLocation);
	});

	it("should find definition for mixins", async () => {
		const expectedDocumentUri = getDocUri("_mixins.scss");
		const expectedLocation = sameLineLocation(expectedDocumentUri, 1, 1, 6);
		await testDefinition(docUri, position(9, 12), expectedLocation);
	});

	it("should find definition for placeholder", async () => {
		const expectedDocumentUri = getDocUri("_placeholders.scss");
		const expectedLocation = sameLineLocation(expectedDocumentUri, 1, 1, 7);
		await testDefinition(docUri, position(20, 14), expectedLocation);
	});

	it("should find symbol definition behind namespace", async () => {
		const expectedDocumentUri = getDocUri("namespace/_variables.scss");
		const expectedLocation = sameLineLocation(expectedDocumentUri, 1, 1, 18);
		await testDefinition(docUri, position(15, 15), expectedLocation);
	});

	it("should find symbol definition behind namespace and prefix", async () => {
		const expectedDocumentUri = getDocUri("namespace/_mixins.scss");
		const expectedLocation = sameLineLocation(expectedDocumentUri, 1, 1, 10);
		await testDefinition(docUri, position(16, 18), expectedLocation);
	});
});
