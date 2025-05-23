/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

"use strict";

import { suite, test, assert } from "vitest";
import { Hover, TextDocument, getCSSLanguageService, getSassLanguageService } from "../../cssLanguageService";
import { HoverSettings } from "../../cssLanguageTypes";
import { BaselineImages } from "../../languageFacts/facts";

export function assertHover(value: string, expected: Hover, languageId = "css", hoverSettings?: HoverSettings): void {
	let offset = value.indexOf("|");
	value = value.substr(0, offset) + value.substr(offset + 1);
	const ls = languageId === "css" ? getCSSLanguageService() : getSassLanguageService();

	const document = TextDocument.create(`test://foo/bar.${languageId}`, languageId, 1, value);
	const hoverResult = ls.doHover(document, document.positionAt(offset), ls.parseStylesheet(document), hoverSettings);
	assert(hoverResult);

	if (hoverResult!.range && expected.range) {
		assert.equal(hoverResult!.range, expected.range);
	}
	assert.deepEqual(hoverResult!.contents, expected.contents);
}

suite("CSS Hover", () => {
	test("basic", () => {
		assertHover(".test { |color: blue; }", {
			contents: {
				kind: "markdown",
				value: `Sets the color of an element's text\n\n![Baseline icon](${BaselineImages.BASELINE_HIGH}) _Widely available across major browsers (Baseline since 2015)_\n\nSyntax: &lt;color&gt;\n\n[MDN Reference](https://developer.mozilla.org/docs/Web/CSS/color)`,
			},
		});
		assertHover(
			".test { |color: blue; }",
			{
				contents: {
					kind: "markdown",
					value: "[MDN Reference](https://developer.mozilla.org/docs/Web/CSS/color)",
				},
			},
			undefined,
			{ documentation: false },
		);
		assertHover(
			".test { |color: blue; }",
			{
				contents: {
					kind: "markdown",
					value: `Sets the color of an element's text\n\n![Baseline icon](${BaselineImages.BASELINE_HIGH}) _Widely available across major browsers (Baseline since 2015)_\n\nSyntax: &lt;color&gt;`,
				},
			},
			undefined,
			{ references: false },
		);

		/**
		 * Reenable after converting specificity to use MarkupContent
		 */

		// assertHover('.test:h|over { color: blue; }', {
		// 	contents: `Applies while the user designates an element with a pointing device, but does not necessarily activate it. For example, a visual user agent could apply this pseudo-class when the cursor (mouse pointer) hovers over a box generated by the element.`
		// });

		// assertHover('.test::a|fter { color: blue; }', {
		// 	contents: `Represents a styleable child pseudo-element immediately after the originating element’s actual content.`
		// });
	});

	test("specificity", () => {
		assertHover(".|foo {}", {
			contents: [
				{ language: "html", value: '<element class="foo">' },
				"[Selector Specificity](https://developer.mozilla.org/docs/Web/CSS/Specificity): (0, 1, 0)",
			],
		});
	});

	assertHover(
		"@scope (.foo) to (.bar) { .|baz{ } }",
		{
			contents: [
				{
					language: "html",
					value: '@scope .foo → .bar\n<element class="baz">',
				},
				"[Selector Specificity](https://developer.mozilla.org/docs/Web/CSS/Specificity): (0, 1, 0)",
			],
		},
		"css",
	);

	assertHover(
		"@scope (.from) to (.to) { .foo { @media print { .bar { @media only screen{ .|bar{ } } } } } }",
		{
			contents: [
				{
					language: "html",
					value:
						'@scope .from → .to\n@media print\n@media only screen\n<element class="foo">\n  …\n    <element class="bar">\n      …\n        <element class="bar">',
				},
				"[Selector Specificity](https://developer.mozilla.org/docs/Web/CSS/Specificity): (0, 1, 0)",
			],
		},
		"css",
	);
});

suite("SCSS Hover", () => {
	test("nested", () => {
		assertHover(
			"div { d|iv {} }",
			{
				contents: [
					{ language: "html", value: "<div>\n  …\n    <div>" },
					"[Selector Specificity](https://developer.mozilla.org/docs/Web/CSS/Specificity): (0, 0, 1)",
				],
			},
			"scss",
		);
		assertHover(
			".foo{ .bar{ @media only screen{ .|bar{ } } } }",
			{
				contents: [
					{
						language: "html",
						value:
							'@media only screen\n<element class="foo">\n  …\n    <element class="bar">\n      …\n        <element class="bar">',
					},
					"[Selector Specificity](https://developer.mozilla.org/docs/Web/CSS/Specificity): (0, 1, 0)",
				],
			},
			"scss",
		);
	});

	test("@at-root", () => {
		assertHover(
			".test { @|at-root { }",
			{
				contents: [],
			},
			"scss",
		);
	});
});
