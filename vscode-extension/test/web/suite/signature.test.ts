import * as assert from "assert";
import * as vscode from "vscode";
import { getDocUri, showFile, position, sleep } from "./util";

async function testSignature(
	docUri: vscode.Uri,
	position: vscode.Position,
	signature: vscode.SignatureHelp,
) {
	await showFile(docUri);

	const result = await vscode.commands.executeCommand<vscode.SignatureHelp>(
		"vscode.executeSignatureHelpProvider",
		docUri,
		position,
	);

	if (result === undefined) {
		assert.fail("The 'result' is undefined.");
	}

	assert.strictEqual(
		result.activeParameter,
		signature.activeParameter,
		`activeParameter in ${docUri.fsPath}`,
	);
	assert.strictEqual(
		result.activeSignature,
		signature.activeSignature,
		"activeSignature",
	);

	assert.strictEqual(
		result.signatures.length,
		signature.signatures.length,
		`Count of signatures: ${signature.signatures.length} expected; ${result.signatures.length} actual`,
	);

	signature.signatures.forEach((expectedSignature, i) => {
		const actualSignature = result.signatures[i];

		if (actualSignature === undefined) {
			assert.fail("The 'actualSignature' is undefined.");
		}

		assert.strictEqual(actualSignature.label, expectedSignature.label);

		assert.strictEqual(
			actualSignature.parameters.length,
			expectedSignature.parameters.length,
			`Count of parameters for {expectedSignature.label}: ${expectedSignature.parameters.length} expected; ${actualSignature.parameters.length} actual`,
		);
	});
}

describe("Signature", () => {
	const docUri = getDocUri("signature/main.scss");

	before(async () => {
		await showFile(docUri);
		await sleep();
	});

	describe("mixin", () => {
		it("should suggest all parameters of mixin", async () => {
			const expected = {
				activeParameter: 0,
				activeSignature: 0,
				signatures: [
					{
						label: "square ($size: null, $radius: 0)",
						parameters: [{ label: "$size" }, { label: "$radius" }],
					},
				],
			};

			await testSignature(docUri, position(5, 19), expected);
		});

		it("should suggest all parameters of mixin behind namespace and prefix", async () => {
			const expected = {
				activeParameter: 0,
				activeSignature: 0,
				signatures: [
					{
						label: "mix-square ($size: null, $radius: 0)",
						parameters: [{ label: "$size" }, { label: "$radius" }],
					},
				],
			};

			await testSignature(docUri, position(14, 30), expected);
		});

		it("should suggest the second parameter of mixin", async () => {
			const expected = {
				activeParameter: 1,
				activeSignature: 0,
				signatures: [
					{
						label: "square ($size: null, $radius: 0)",
						parameters: [{ label: "$size" }, { label: "$radius" }],
					},
				],
			};

			await testSignature(docUri, position(6, 21), expected);
		});

		it("should suggest the second parameter of mixin behind namespace and prefix", async () => {
			const expected = {
				activeParameter: 1,
				activeSignature: 0,
				signatures: [
					{
						label: "mix-square ($size: null, $radius: 0)",
						parameters: [{ label: "$size" }, { label: "$radius" }],
					},
				],
			};

			await testSignature(docUri, position(15, 32), expected);
		});
	});

	describe("function", () => {
		it("should suggest all parameters of function", async () => {
			const expected = {
				activeParameter: 0,
				activeSignature: 0,
				signatures: [
					{
						label: "pow ($base: null, $exponent: null)",
						parameters: [{ label: "$base" }, { label: "$exponent" }],
					},
				],
			};

			await testSignature(docUri, position(8, 16), expected);
		});

		it("should suggest all parameters of function behind namespace and prefix", async () => {
			const expected = {
				activeParameter: 0,
				activeSignature: 0,
				signatures: [
					{
						label: "fun-pow ($base: null, $exponent: null)",
						parameters: [{ label: "$base" }, { label: "$exponent" }],
					},
				],
			};

			await testSignature(docUri, position(17, 27), expected);
		});

		it("should suggest the second parameter of function", async () => {
			const expected = {
				activeParameter: 1,
				activeSignature: 0,
				signatures: [
					{
						label: "pow ($base: null, $exponent: null)",
						parameters: [{ label: "$base" }, { label: "$exponent" }],
					},
				],
			};

			await testSignature(docUri, position(8, 26), expected);
		});

		it("should suggest the second parameter of function behind namespace and prefix", async () => {
			const expected = {
				activeParameter: 1,
				activeSignature: 0,
				signatures: [
					{
						label: "fun-pow ($base: null, $exponent: null)",
						parameters: [{ label: "$base" }, { label: "$exponent" }],
					},
				],
			};

			await testSignature(docUri, position(17, 48), expected);
		});

		it("should suggest all parameters of function from Sass built-in", async () => {
			const expected = {
				activeParameter: 0,
				activeSignature: 0,
				signatures: [
					{
						label: "clamp ($min, $number, $max)",
						parameters: [
							{ label: "$min" },
							{ label: "$number" },
							{ label: "$max" },
						],
					},
				],
			};

			await testSignature(docUri, position(23, 26), expected);
		});

		it("should suggest second and third parameters of function from Sass built-in", async () => {
			const expected = {
				activeParameter: 1,
				activeSignature: 0,
				signatures: [
					{
						label: "clamp ($min, $number, $max)",
						parameters: [
							{ label: "$min" },
							{ label: "$number" },
							{ label: "$max" },
						],
					},
				],
			};

			await testSignature(docUri, position(24, 28), expected);
		});

		it("should suggest third parameters of function from Sass built-in", async () => {
			const expected = {
				activeParameter: 2,
				activeSignature: 0,
				signatures: [
					{
						label: "clamp ($min, $number, $max)",
						parameters: [
							{ label: "$min" },
							{ label: "$number" },
							{ label: "$max" },
						],
					},
				],
			};

			await testSignature(docUri, position(25, 30), expected);
		});
	});
});
