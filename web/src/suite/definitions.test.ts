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

describe("SCSS Definition Test", function () {
	const docUri = getDocUri("definition/main.scss");
	const vueDocUri = getDocUri("definition/AppButton.vue");
	const svelteDocUri = getDocUri("definition/AppButton.svelte");
	const astroDocUri = getDocUri("definition/AppButton.astro");

	before(async () => {
		await showFile(docUri);
		await showFile(vueDocUri);
		await showFile(svelteDocUri);
		await showFile(astroDocUri);
		await sleep(2000);
	});

	it("should find definition for variables", async () => {
		const expectedDocumentUri = getDocUri("_variables.scss");
		const expectedLocation = sameLineLocation(expectedDocumentUri, 1, 1, 10);
		await testDefinition(docUri, position(7, 13), expectedLocation);
		await testDefinition(vueDocUri, position(15, 13), expectedLocation);
		await testDefinition(svelteDocUri, position(9, 15), expectedLocation);
		await testDefinition(astroDocUri, position(12, 15), expectedLocation);
	});

	it("should find definition for functions", async () => {
		const expectedDocumentUri = getDocUri("_functions.scss");
		const expectedLocation = sameLineLocation(expectedDocumentUri, 1, 1, 9);

		await testDefinition(docUri, position(7, 24), expectedLocation);
		await testDefinition(vueDocUri, position(15, 24), expectedLocation);
		await testDefinition(svelteDocUri, position(9, 26), expectedLocation);
		await testDefinition(astroDocUri, position(12, 26), expectedLocation);
	});

	it("should find definition for mixins", async () => {
		const expectedDocumentUri = getDocUri("_mixins.scss");
		const expectedLocation = sameLineLocation(expectedDocumentUri, 1, 1, 6);

		await testDefinition(docUri, position(9, 12), expectedLocation);
		await testDefinition(vueDocUri, position(17, 12), expectedLocation);
		await testDefinition(svelteDocUri, position(11, 14), expectedLocation);
		await testDefinition(astroDocUri, position(14, 14), expectedLocation);
	});

	it("should find definition for placeholder", async () => {
		const expectedDocumentUri = getDocUri("_placeholders.scss");
		const expectedLocation = sameLineLocation(expectedDocumentUri, 1, 1, 7);

		await testDefinition(docUri, position(20, 14), expectedLocation);
	});

	it("should find symbol definition behind namespace", async () => {
		const expectedDocumentUri = getDocUri("namespace/_variables.scss");
		const expectedLocation = sameLineLocation(expectedDocumentUri, 1, 1, 18);

		await testDefinition(docUri, position(15, 14), expectedLocation);
		await testDefinition(vueDocUri, position(23, 14), expectedLocation);
		await testDefinition(svelteDocUri, position(17, 14), expectedLocation);
		await testDefinition(astroDocUri, position(20, 14), expectedLocation);
	});

	it("should find symbol definition behind namespace and prefix", async () => {
		const expectedDocumentUri = getDocUri("namespace/_mixins.scss");
		const expectedLocation = sameLineLocation(expectedDocumentUri, 1, 1, 10);

		await testDefinition(docUri, position(16, 17), expectedLocation);
		await testDefinition(vueDocUri, position(24, 17), expectedLocation);
		await testDefinition(svelteDocUri, position(18, 17), expectedLocation);
		await testDefinition(astroDocUri, position(21, 17), expectedLocation);
	});
});
