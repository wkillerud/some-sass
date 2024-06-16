/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
"use strict";
import { suite, test } from "vitest";

import { SassParser } from "../../parser/sassParser";
import { assertColor2 } from "../css/languageFacts.test";
import { colorFrom256RGB as newColor } from "../../languageFacts/facts";
import { Color } from "vscode";
import { TextDocument } from "vscode-languageserver-textdocument";

function assertColor(text: string, selection: string, expected: Color | null, isColor = expected !== null) {
	let parser = new SassParser();
	let document = TextDocument.create(`test://test/test.scss`, "scss", 1, text);
	assertColor2(parser, document, selection, expected, isColor);
}

function assertColorSass(text: string, selection: string, expected: Color | null, isColor = expected !== null) {
	let parser = new SassParser();
	let document = TextDocument.create(`test://test/test.sass`, "sass", 1, text);
	assertColor2(parser, document, selection, expected, isColor);
}

suite("SCSS - Language facts", () => {
	test("is color", () => {
		assertColor("#main { color: foo(red) }", "red", newColor(0xff, 0, 0));
		assertColor("#main { color: red() }", "red", null);
		assertColor("#main { red { nested: 1px } }", "red", null);
		assertColor("#main { @include red; }", "red", null);
		assertColor("#main { @include foo($f: red); }", "red", newColor(0xff, 0, 0));
		assertColor("@function red($p) { @return 1px; }", "red", null);
		assertColor("@function foo($p) { @return red; }", "red", newColor(0xff, 0, 0));
		assertColor("@function foo($r: red) { @return $r; }", "red", newColor(0xff, 0, 0));
		assertColor("#main { color: rgba($input-border, 0.7) }", "rgba", null, true);
		assertColor("#main { color: rgba($input-border, 1, 1, 0.7) }", "rgba", null, true);
	});
});

suite("Sass - Language facts", () => {
	test("is color", () => {
		assertColorSass(
			`#main
	red
		nested: 1px`,
			"red",
			null,
		);
		assertColorSass("#main\n\tcolor: foo(red)", "red", newColor(0xff, 0, 0));
		assertColorSass("#main\n\tcolor: red()", "red", null);
		assertColorSass("#main\n\t@include red", "red", null);
		assertColorSass("#main\n\t@include foo($f: red)", "red", newColor(0xff, 0, 0));
		assertColorSass("@function red($p)\n\t@return 1px", "red", null);
		assertColorSass("@function foo($p)\n\t@return red", "red", newColor(0xff, 0, 0));
		assertColorSass("@function foo($r: red)\n\t@return $r", "red", newColor(0xff, 0, 0));
		assertColorSass("#main\n\tcolor: rgba($input-border, 0.7)", "rgba", null, true);
		assertColorSass("#main\n\tcolor: rgba($input-border, 1, 1, 0.7)", "rgba", null, true);
	});
});
