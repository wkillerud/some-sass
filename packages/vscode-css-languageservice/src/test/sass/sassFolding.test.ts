/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { suite, test, assert } from "vitest";
import { FoldingRange, FoldingRangeKind } from "vscode-languageserver-types";
import { assertRanges as assertCssRanges } from "../css/folding.test";

function assertRanges(lines: string[], expected: FoldingRange[], rangeLimit: number | null = null) {
	assertCssRanges(lines, expected, "sass", rangeLimit);
}

function r(startLine: number, endLine: number, kind?: FoldingRangeKind | string): FoldingRange {
	return { startLine, endLine, kind };
}

suite("Sass folding", () => {
	suite("basic", () => {
		test("fold single rule", () => {
			let input = [".foo", "  color: red"];
			assertRanges(input, [r(0, 1)]);
		});

		test("fold multiple rules", () => {
			let input = [".foo", "  color: red", "  opacity: 1"];
			assertRanges(input, [r(0, 2)]);
		});
	});

	suite("nested", () => {
		test("selectors", () => {
			let input = [".foo", "  & .bar", "    color: red"];
			assertRanges(input, [r(0, 2), r(1, 2)]);
		});

		test("media query", () => {
			let input = ["@media screen", "  .foo", "    color: red"];
			assertRanges(input, [r(0, 2), r(1, 2)]);
		});
	});

	suite("regions", () => {
		test("region", () => {
			let input = ["/* #region */", ".bar", "  color: red", "/* #endregion */"];
			assertRanges(input, [r(0, 3, "region"), r(1, 2)]);
		});

		test("region with description", () => {
			let input = ["/* #region This is a description */", ".bar", "  color: red", "/* #endregion */"];
			assertRanges(input, [r(0, 3, "region"), r(1, 2)]);
		});

		test("region with Sass comment", () => {
			let input = ["// #region", ".bar", "  color: red", "// #endregion"];
			assertRanges(input, [r(0, 3, "region"), r(1, 2)]);
		});

		test("region with Sass comment and description", () => {
			let input = ["// #region This is a description", ".bar", "  color: red", "// #endregion"];
			assertRanges(input, [r(0, 3, "region"), r(1, 2)]);
		});
	});

	suite("max ranges option", () => {
		test("max range one omits anything but the outermost range", () => {
			let input = ["/* #region This is a description */", ".bar", "  color: red", "/* #endregion */"];
			assertRanges(input, [r(0, 3, "region")], 1);
		});
	});

	suite("Sass features", () => {
		test("mixin declaration", () => {
			let input = [
				"@mixin clearfix($width)",
				"  @if !$width",
				"    // if width is not passed",
				"  @else",
				"    display: inline-block",
				"    width: $width",
			];
			assertRanges(input, [r(0, 5), r(1, 2), r(3, 5)]);
		});

		test("interpolation", () => {
			let input = [".orbit-#{$d}-prev", "  foo-#{$d}-bar: 1", "  #{$d}-bar-#{$d}: 2"];
			assertRanges(input, [r(0, 2)]);
		});

		test("while", () => {
			let input = ["@while $i > 0", "  .item-#{$i}", "    width: 2em * $i", "  $i: $i - 2"];
			assertRanges(input, [r(0, 3), r(1, 2)]);
		});
	});
});
