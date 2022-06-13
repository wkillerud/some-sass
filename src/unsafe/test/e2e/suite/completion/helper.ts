import * as assert from 'assert';

import * as vscode from 'vscode';
import type { CompletionItem, MarkupContent } from 'vscode-languageclient';
import { showFile } from '../util';

type CompletionTestOptions = {
	/**
	 * @default false
	 */
	expectNoMatch: boolean;
}

export async function testCompletion(
	docUri: vscode.Uri,
	position: vscode.Position,
	expectedItems: (string | CompletionItem)[],
	options: CompletionTestOptions = { expectNoMatch: false }
) {
	await showFile(docUri);

	const result = (await vscode.commands.executeCommand(
		'vscode.executeCompletionItemProvider',
		docUri,
		position
	)) as vscode.CompletionList;

	expectedItems.forEach(ei => {
		if (typeof ei === 'string') {
			if (options.expectNoMatch) {
				const match = result.items.find(i => i.label === ei);
				if (!match) {
					assert.ok(`Found no match for ${ei}`);
				} else {
					assert.fail(`Expected NOT to find ${ei} among results, but it's there: ${result.items.map(i => i.label)}`);
				}
				return;
			} else {
				assert.ok(
					result.items.some(i => {
						return i.label === ei;
					}),
					`Expected to find ${ei} among results`
				);
			}
		} else {
			const match = result.items.find(i => i.label === ei.label);
			if (!match) {
				if (options.expectNoMatch) {
					assert.ok(`Found no match for ${ei.label}`);
				} else {
					assert.fail(`Can't find matching item for ${JSON.stringify(ei, null, 2)}`);
				}
				return;
			}

			assert.strictEqual(match.label, ei.label);
			if (ei.kind) {
				assert.strictEqual(match.kind, ei.kind);
			}
			if (ei.detail) {
				assert.strictEqual(match.detail, ei.detail);
			}
			if (ei.insertText) {
				assert.strictEqual(JSON.stringify(match.insertText), ei.insertText, `Expected insertText to match ${ei.insertText}. Actual: ${JSON.stringify(match.insertText)}`);
			}

			if (ei.documentation) {
				if (typeof match.documentation === 'string') {
					assert.strictEqual(match.documentation, ei.documentation);
				} else {
					if (ei.documentation && (ei.documentation as MarkupContent).value && match.documentation) {
						assert.strictEqual(
							(match.documentation as vscode.MarkdownString).value,
							(ei.documentation as MarkupContent).value
						);
					}
				}
			}
		}
	});
}
