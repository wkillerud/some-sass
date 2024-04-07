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

describe("Completions", () => {
	const docUri = getDocUri("completion/main.scss");

	before(async () => {
		await showFile(docUri);
		await sleep();
	});

	it("from partial file", async () => {
		const expectedCompletions = [{ label: "$partial" }];

		await testCompletion(docUri, position(17, 11), expectedCompletions);
	});

	it("for namespaces including prefixes", async () => {
		let expectedCompletions = [
			{
				label: "$var-var-variable",
				insertText: '".$var-var-variable"',
				filterText: '"ns.$var-var-variable"',
			},
			{
				label: "fun-fun-function",
				insertText: '".fun-fun-function()"',
			},
		];

		await testCompletion(docUri, position(23, 13), expectedCompletions);

		expectedCompletions = [
			{
				label: "mix-mix-mixin",
				insertText: '".mix-mix-mixin"',
			},
		];

		await testCompletion(docUri, position(24, 15), expectedCompletions);
	});

	it("inside string interpolation", async () => {
		const expectedCompletions = [
			{
				label: "$var-var-variable",
				insertText: '".$var-var-variable"',
				filterText: '"ns.$var-var-variable"',
			},
			{
				label: "fun-fun-function",
				insertText: '".fun-fun-function()"',
			},
		];

		await testCompletion(docUri, position(25, 40), expectedCompletions);
	});

	it("for Sass built-ins", async () => {
		const expectedCompletions = [
			{
				label: "floor",
				insertText: '".floor(${1:number})"',
				filterText: '"math.floor"',
			},
		];

		await testCompletion(docUri, position(36, 19), expectedCompletions);
	});

	it("inside string interpolation with preceeding non-space character", async () => {
		const expectedCompletions = [
			{
				label: "$var-var-variable",
				insertText: '".$var-var-variable"',
				filterText: '"ns.$var-var-variable"',
			},
			{
				label: "fun-fun-function",
				insertText: '".fun-fun-function()"',
			},
		];

		await testCompletion(docUri, position(26, 20), expectedCompletions);
	});

	it("as part of return statement", async () => {
		const expectedCompletions = [
			{
				label: "$var-var-variable",
				insertText: '".$var-var-variable"',
				filterText: '"ns.$var-var-variable"',
			},
			{
				label: "fun-fun-function",
				insertText: '".fun-fun-function()"',
			},
		];

		await testCompletion(docUri, position(30, 23), expectedCompletions);
	});

	describe("SassDoc", () => {
		const docUri = getDocUri("completion/sassdoc.scss");

		before(async () => {
			await showFile(docUri);
		});

		it("completions for SassDoc block on mixin without parameters or @content", async () => {
			const expectedCompletions = [
				{
					label: "SassDoc Block",
					insertText: '" ${0}\\n/// @output ${1}"',
				},
			];

			await testCompletion(docUri, position(3, 4), expectedCompletions);
		});

		it("completions for SassDoc block on mixin with @content", async () => {
			const expectedCompletions = [
				{
					label: "SassDoc Block",
					insertText: '" ${0}\\n/// @content ${1}\\n/// @output ${2}"',
				},
			];

			await testCompletion(docUri, position(8, 4), expectedCompletions);
		});

		it("completions for SassDoc block on mixin with parameters", async () => {
			const expectedCompletions = [
				{
					label: "SassDoc Block",
					insertText:
						'" ${0}\\n/// @param {${1:Number}} \\\\$a [1px] ${2:-}\\n/// @param {${3:Number}} \\\\$b [2px] ${4:-}\\n/// @output ${5}"',
				},
			];

			await testCompletion(docUri, position(13, 4), expectedCompletions);
		});

		it("completions for SassDoc block on mixin with parameters and @content", async () => {
			const expectedCompletions = [
				{
					label: "SassDoc Block",
					insertText:
						'" ${0}\\n/// @param {${1:type}} \\\\$a ${2:-}\\n/// @param {${3:type}} \\\\$b ${4:-}\\n/// @content ${5}\\n/// @output ${6}"',
				},
			];

			await testCompletion(docUri, position(18, 4), expectedCompletions);
		});

		it("completions for SassDoc block on parameterless function", async () => {
			const expectedCompletions = [
				{
					label: "SassDoc Block",
					insertText: '" ${0}\\n/// @return {${1:type}} ${2:-}"',
				},
			];

			await testCompletion(docUri, position(25, 4), expectedCompletions);
		});

		it("completions for SassDoc block on parameterfull function", async () => {
			const expectedCompletions = [
				{
					label: "SassDoc Block",
					insertText:
						'" ${0}\\n/// @param {${1:Number}} \\\\$a [1px] ${2:-}\\n/// @param {${3:Number}} \\\\$b [2px] ${4:-}\\n/// @return {${5:type}} ${6:-}"',
				},
			];

			await testCompletion(docUri, position(30, 4), expectedCompletions);
		});
	});

	describe("Placeholders", () => {
		const docUri = getDocUri("completion/placeholders.scss");

		before(async () => {
			await showFile(docUri);
		});

		it("get completions", async () => {
			const expectedCompletions = [
				{
					label: "%mediumAlert",
					insertText: "mediumAlert",
				},
			];

			await testCompletion(docUri, position(9, 14), expectedCompletions);
		});
	});

	describe("Reverse placeholders", () => {
		const docUri = getDocUri("completion/reverse-placeholders/_theme.scss");

		before(async () => {
			await showFile(docUri);
			// TODO: figure out why we need to open main.scss and sleep here in the test. It works as expected in the browser.
			await showFile(getDocUri("completion/reverse-placeholders/main.scss"));
			await sleep();
		});

		it("when implementing a placeholder selector", async () => {
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
});
