/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { suite, test } from "vitest";
import { TextDocument } from "vscode-languageserver-textdocument";
import { LintConfigurationSettings, Rule, Rules } from "../../services/lintRules";
import { SassParser } from "../../parser/sassParser";
import { assertEntries } from "../css/lint.test";

const parser = new SassParser();

function assertRuleSet(input: string, ...rules: Rule[]): void {
	assertRuleSet2(input, rules);
}

function assertRuleSet2(input: string, rules: Rule[], messages?: string[], settings?: LintConfigurationSettings): void {
	const document = TextDocument.create("test://test/test.sass", "sass", 0, input);
	const node = parser.parseStylesheet(document);
	assertEntries(node, document, rules, messages, settings);
}

suite("Sass - Lint", () => {
	test("universal selector", () => {
		assertRuleSet(`*\n\tcolor: perty`, Rules.UniversalSelector);
		assertRuleSet(`*, div\n\tcolor: perty`, Rules.UniversalSelector);
		assertRuleSet(`div, *\n\tcolor: perty`, Rules.UniversalSelector);
		assertRuleSet(`div > *\n\tcolor: perty`, Rules.UniversalSelector);
		assertRuleSet(`div + *\n\tcolor: perty`, Rules.UniversalSelector);
	});

	test("empty ruleset", () => {
		assertRuleSet("selector\n\t", Rules.EmptyRuleSet);
		// this should probably be flagged if the Indent is missing as well
	});

	test("property ignored due to inline", () => {
		assertRuleSet(
			`selector
	display: inline
	float: right`,
			Rules.AvoidFloat,
		);
	});

	test("avoid !important", () => {
		assertRuleSet(`selector\n\tdisplay: inline !important`, Rules.AvoidImportant);
	});

	test("avoid float", () => {
		assertRuleSet(`selector\n\tfloat: right`, Rules.AvoidFloat);
	});

	test("avoid id selectors", () => {
		assertRuleSet(`#selector\n\tdisplay: inline`, Rules.AvoidIdSelector);
	});

	test("zero with unit", () => {
		assertRuleSet(`selector\n\twidth: 0px`, Rules.ZeroWithUnit);
	});

	test("duplicate declarations", () => {
		assertRuleSet(
			`selector
	color: perty
	color: perty`,
			Rules.DuplicateDeclarations,
			Rules.DuplicateDeclarations,
		);
	});

	test("unknown property", () => {
		assertRuleSet(`selector\n\t-ms-property: "rest is missing"`, Rules.UnknownVendorSpecificProperty);
		assertRuleSet(
			`selector\n\t-moz-box-shadow: "rest is missing"`,
			Rules.UnknownVendorSpecificProperty,
			Rules.IncludeStandardPropertyWhenUsingVendorPrefix,
		);
		assertRuleSet(`selector\n\tbox-property: "rest is missing"`, Rules.UnknownProperty);
	});
});
