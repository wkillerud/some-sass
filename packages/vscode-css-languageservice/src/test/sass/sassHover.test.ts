/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { suite, test } from "vitest";
import { Hover } from "../../cssLanguageService";
import { HoverSettings } from "../../cssLanguageTypes";
import { assertHover as assertCssHover } from "../css/hover.test";
import { BaselineImages } from "../../languageFacts/facts";

function assertHover(value: string, expected: Hover, hoverSettings?: HoverSettings): void {
	assertCssHover(value, expected, "sass", hoverSettings);
}

suite("Sass hover", () => {
	test("basic", () => {
		assertHover(`.test\n\t|color: blue`, {
			contents: {
				kind: "markdown",
				value: `Sets the color of an element's text\n\n![Baseline icon](${BaselineImages.BASELINE_HIGH}) _Widely available across major browsers (Baseline since 2015)_\n\nSyntax: &lt;color&gt;\n\n[MDN Reference](https://developer.mozilla.org/docs/Web/CSS/color)`,
			},
		});
		assertHover(
			`.test\n\t|color: blue`,
			{
				contents: {
					kind: "markdown",
					value: "[MDN Reference](https://developer.mozilla.org/docs/Web/CSS/color)",
				},
			},
			{ documentation: false },
		);
		assertHover(
			`.test\n\t|color: blue`,
			{
				contents: {
					kind: "markdown",
					value: `Sets the color of an element's text\n\n![Baseline icon](${BaselineImages.BASELINE_HIGH}) _Widely available across major browsers (Baseline since 2015)_\n\nSyntax: &lt;color&gt;`,
				},
			},
			{ references: false },
		);
	});

	test("specificity", () => {
		assertHover(`.|foo\n\t`, {
			contents: [
				{ language: "html", value: '<element class="foo">' },
				"[Selector Specificity](https://developer.mozilla.org/docs/Web/CSS/Specificity): (0, 1, 0)",
			],
		});
	});

	test("nested", () => {
		assertHover(
			`.foo
	.bar
		@media only screen
			.|bar`,
			{
				contents: [
					{
						language: "html",
						value:
							'@media only screen\n … <element class="foo">\n  …\n    <element class="bar">\n      …\n        <element class="bar">',
					},
					"[Selector Specificity](https://developer.mozilla.org/docs/Web/CSS/Specificity): (0, 1, 0)",
				],
			},
		);
		assertHover(`div\n\td|iv\n\t\t`, {
			contents: [
				{ language: "html", value: "<div>\n  …\n    <div>" },
				"[Selector Specificity](https://developer.mozilla.org/docs/Web/CSS/Specificity): (0, 0, 1)",
			],
		});
	});

	test("at-root", () => {
		assertHover(".test\n\t@|at-root", {
			contents: [],
		});
	});
});
