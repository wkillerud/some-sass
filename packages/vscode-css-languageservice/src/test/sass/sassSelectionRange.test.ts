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
	const stylesheet = ls.parseStylesheet(document);
	const actualRanges = ls.getSelectionRanges(document, [document.positionAt(offset)], stylesheet);
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
		assertRanges(`.foo\n\t|color: blue`, [
			[6, "color"],
			[6, "color: blue"],
			[4, `\n\tcolor: blue`],
			[0, `.foo\n\tcolor: blue`],
		]);
		assertRanges(`.foo\n\tc|olor: blue`, [
			[6, "color"],
			[6, "color: blue"],
			[4, `\n\tcolor: blue`],
			[0, `.foo\n\tcolor: blue`],
		]);
		assertRanges(`.foo\n\tcolor|: blue`, [
			[6, "color"],
			[6, "color: blue"],
			[4, `\n\tcolor: blue`],
			[0, `.foo\n\tcolor: blue`],
		]);
		assertRanges(`.foo\n\tcolor: |blue`, [
			[13, "blue"],
			[6, "color: blue"],
			[4, `\n\tcolor: blue`],
			[0, `.foo\n\tcolor: blue`],
		]);
		assertRanges(`.foo\n\tcolor: b|lue`, [
			[13, "blue"],
			[6, "color: blue"],
			[4, `\n\tcolor: blue`],
			[0, `.foo\n\tcolor: blue`],
		]);
		assertRanges(`.foo\n\tcolor: blue|`, [
			[13, "blue"],
			[6, "color: blue"],
			[4, `\n\tcolor: blue`],
			[0, `.foo\n\tcolor: blue`],
		]);

		assertRanges(`.|foo\n\tcolor: blue`, [
			[1, `foo`],
			[0, `.foo`],
			[0, `.foo\n\tcolor: blue`],
		]);
		assertRanges(`.fo|o\n\tcolor: blue`, [
			[1, `foo`],
			[0, `.foo`],
			[0, `.foo\n\tcolor: blue`],
		]);

		assertRanges(`.foo|\n\tcolor: blue`, [
			[4, `\n\tcolor: blue`],
			[0, `.foo\n\tcolor: blue`],
		]);
	});

	test("multiple values", () => {
		assertRanges(
			`.foo
	font-family: '|Courier New', Courier, monospace`,
			[
				[19, `'Courier New'`],
				[19, `'Courier New', Courier, monospace`],
				[6, `font-family: 'Courier New', Courier, monospace`],
				[4, `\n\tfont-family: 'Courier New', Courier, monospace`],
				[0, `.foo\n\tfont-family: 'Courier New', Courier, monospace`],
			],
		);
	});

	test("edge behavior for declaration", () => {
		assertRanges(
			`.foo|
	`,
			[
				[4, "\n\t"],
				[0, ".foo\n\t"],
			],
		);
		assertRanges(
			`.foo
	color: red
|`,
			[
				[4, "\n\tcolor: red\n"],
				[0, ".foo\n\tcolor: red\n"],
			],
		);
		assertRanges(
			`.foo
	|
`,
			[
				[4, "\n\t\n"],
				[0, ".foo\n\t\n"],
			],
		);
	});

	test("stops in time for next declaration when there's nesting", () => {
		assertRanges(
			`.foo
	color: red|
	&.bar
		color: blue

.baz
	color: green`,
			[
				[13, "red"],
				[6, "color: red"],
				[4, "\n\tcolor: red\n\t&.bar\n\t\tcolor: blue\n\n"],
				[0, ".foo\n\tcolor: red\n\t&.bar\n\t\tcolor: blue\n\n"],
				[0, ".foo\n\tcolor: red\n\t&.bar\n\t\tcolor: blue\n\n.baz\n\tcolor: green"],
			],
		);

		assertRanges(
			`.foo
	color: red
	&.bar
		color: blue|

		&.lol
			color: yellow

	&.rofl
		color: purple

.baz
	color: green
`,
			[
				[33, `blue`],
				[26, `color: blue`],
				[
					23,
					`
		color: blue

		&.lol
			color: yellow

	`,
				],
				[
					18,
					`&.bar
		color: blue

		&.lol
			color: yellow

	`,
				],
				[
					4,
					`
	color: red
	&.bar
		color: blue

		&.lol
			color: yellow

	&.rofl
		color: purple

`,
				],
				[
					0,
					`.foo
	color: red
	&.bar
		color: blue

		&.lol
			color: yellow

	&.rofl
		color: purple

`,
				],
				[
					0,
					`.foo
	color: red
	&.bar
		color: blue

		&.lol
			color: yellow

	&.rofl
		color: purple

.baz
	color: green
`,
				],
			],
		);
	});

	test("handles :root and css variables", () => {
		assertRanges(
			`:root
	--myvar: red

body
	color: --myvar|`,
			[
				[34, `--myvar`],
				[27, `color: --myvar`],
				[
					25,
					`
	color: --myvar`,
				],
				[
					21,
					`body
	color: --myvar`,
				],
				[
					0,
					`:root
	--myvar: red

body
	color: --myvar`,
				],
			],
		);
	});
});
