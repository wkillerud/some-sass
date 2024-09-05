/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { suite, test, assert } from "vitest";
import { TextDocument } from "../../cssLanguageTypes";
import * as nodes from "../../parser/cssNodes";
import { SassParser } from "../../parser/sassParser";
import * as selectorPrinting from "../../services/selectorPrinting";
import { elementToString } from "../css/selectorPrinting.test";

function doParse(p: SassParser, input: string, selectorName: string): nodes.Selector | null {
	let ext = p.syntax === "indented" ? "sass" : "scss";
	let document = TextDocument.create(`test://test/test.${ext}`, ext, 0, input);
	let styleSheet = p.parseStylesheet(document);

	let node = nodes.getNodeAtOffset(styleSheet, input.indexOf(selectorName));
	if (!node) {
		return null;
	}
	return <nodes.Selector>node.findParent(nodes.NodeType.Selector);
}

export function assertSelector(p: SassParser, input: string, selectorName: string, expected: string): void {
	let selector = doParse(p, input, selectorName);
	assert.ok(selector);

	let element = selectorPrinting.selectorToElement(selector!);
	assert.ok(element);

	assert.equal(elementToString(element!), expected);
}

suite("SCSS - Selector Printing", () => {
	test("simple selector", function () {
		let p = new SassParser();
		assertSelector(p, "o1 { }", "o1", "{o1}");
		assertSelector(p, ".div { } ", ".div", "{[class=div]}");
		assertSelector(p, "#div { } ", "#div", "{[id=div]}");
		assertSelector(p, "o1.div { } ", "o1", "{o1[class=div]}");
		assertSelector(p, "o1#div { }", "o1", "{o1[id=div]}");
		assertSelector(p, "#div.o1 { }", "o1", "{[id=div|class=o1]}");
		assertSelector(p, ".o1#div { }", "o1", "{[class=o1|id=div]}");
	});

	test("nested selector", function () {
		let p = new SassParser();
		assertSelector(p, "o1 { e1 { } }", "e1", "{o1{…{e1}}}");
		assertSelector(p, "o1 { e1.div { } }", "e1", "{o1{…{e1[class=div]}}}");
		assertSelector(p, "o1 o2 { e1 { } }", "e1", "{o1{…{o2{…{e1}}}}}");
		assertSelector(p, "o1, o2 { e1 { } }", "e1", "{o1{…{e1}}}");
		assertSelector(p, "o1 { @if $a { e1 { } } }", "e1", "{o1{…{e1}}}");
		assertSelector(p, "o1 { @mixin a { e1 { } } }", "e1", "{e1}");
		assertSelector(p, "o1 { @mixin a { e1 { } } }", "e1", "{e1}");
	});

	test("referencing selector", function () {
		let p = new SassParser();
		assertSelector(p, "o1 { &:hover { }}", "&", "{o1[:hover=]}");
		assertSelector(p, "o1 { &:hover & { }}", "&", "{o1[:hover=]{…{o1}}}");
		assertSelector(p, "o1 { &__bar {}}", "&", "{o1__bar}");
		assertSelector(p, ".c1 { &__bar {}}", "&", "{[class=c1__bar]}");
		assertSelector(p, "o.c1 { &__bar {}}", "&", "{o[class=c1__bar]}");
	});

	test("placeholders", function () {
		let p = new SassParser();
		assertSelector(p, "%o1 { e1 { } }", "e1", "{%o1{…{e1}}}");
	});
});

suite("Sass - Selector Printing", () => {
	test("simple selector", function () {
		let p = new SassParser({ syntax: "indented" });
		assertSelector(p, "o1\n\t", "o1", "{o1}");
		assertSelector(p, ".div\n\t ", ".div", "{[class=div]}");
		assertSelector(p, "#div\n\t ", "#div", "{[id=div]}");
		assertSelector(p, "o1.div\n\t ", "o1", "{o1[class=div]}");
		assertSelector(p, "o1#div\n\t", "o1", "{o1[id=div]}");
		assertSelector(p, "#div.o1\n\t", "o1", "{[id=div|class=o1]}");
		assertSelector(p, ".o1#div\n\t", "o1", "{[class=o1|id=div]}");
	});

	test("nested selector", function () {
		let p = new SassParser({ syntax: "indented" });
		assertSelector(
			p,
			`o1
	e1
		//`,
			"e1",
			"{o1{…{e1}}}",
		);
		assertSelector(
			p,
			`o1
	e1.div
		//`,
			"e1",
			"{o1{…{e1[class=div]}}}",
		);
		assertSelector(
			p,
			`o1 o2
	e1
		//`,
			"e1",
			"{o1{…{o2{…{e1}}}}}",
		);
		assertSelector(
			p,
			`o1, o2
	e1
		//`,
			"e1",
			"{o1{…{e1}}}",
		);
		assertSelector(
			p,
			`o1
	@if $a
		e1
			//`,
			"e1",
			"{o1{…{e1}}}",
		);
		assertSelector(
			p,
			`o1
	@mixin a
		e1
			//`,
			"e1",
			"{e1}",
		);
		assertSelector(
			p,
			`o1
	@mixin a
		e1
			//`,
			"e1",
			"{e1}",
		);
	});

	test("referencing selector", function () {
		let p = new SassParser({ syntax: "indented" });
		assertSelector(
			p,
			`o1
	&:hover
		//`,
			"&",
			"{o1[:hover=]}",
		);
		assertSelector(
			p,
			`o1
	&:hover &
		//`,
			"&",
			"{o1[:hover=]{…{o1}}}",
		);
		assertSelector(
			p,
			`o1
	&__bar
		//`,
			"&",
			"{o1__bar}",
		);
		assertSelector(
			p,
			`.c1
	&__bar
		//`,
			"&",
			"{[class=c1__bar]}",
		);
		assertSelector(
			p,
			`o.c1
	&__bar
		//`,
			"&",
			"{o[class=c1__bar]}",
		);
	});

	test("placeholders", function () {
		let p = new SassParser({ syntax: "indented" });
		assertSelector(
			p,
			`%o1
	e1
		//`,
			"e1",
			"{%o1{…{e1}}}",
		);
	});
});
