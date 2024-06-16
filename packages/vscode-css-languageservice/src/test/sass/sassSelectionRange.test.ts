/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { suite, test, assert } from "vitest";
import { getSassLanguageService, TextDocument, SelectionRange } from "../../cssLanguageService";

function assertRanges(content: string, expected: (number | string)[][]): void {
	let message = `${content} gives selection range:\n`;

	const offset = content.indexOf("|");
	content = content.substr(0, offset) + content.substr(offset + 1);

	const ls = getSassLanguageService();

	const document = TextDocument.create("test://foo/bar.sass", "sass", 1, content);
	const actualRanges = ls.getSelectionRanges(document, [document.positionAt(offset)], ls.parseStylesheet(document));
	assert.equal(actualRanges.length, 1);
	const offsetPairs: [number, string][] = [];
	let curr: SelectionRange | undefined = actualRanges[0];
	while (curr) {
		offsetPairs.push([document.offsetAt(curr.range.start), document.getText(curr.range)]);
		curr = curr.parent;
	}

	message += `${JSON.stringify(offsetPairs)}\n but should give:\n${JSON.stringify(expected)}\n`;
	assert.deepEqual(offsetPairs, expected, message);
}

suite("Sass SelectionRange", () => {
	test("basic", () => {
		assertRanges(
			`.foo
	|color: blue`,
			[
				[6, "color"],
				[6, "color: blue"],
				[
					4,
					`
	color: blue`,
				],
				[
					0,
					`.foo
	color: blue`,
				],
			],
		);
	});
});
