/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as nodes from "./cssNodes";

export class CSSIssueType implements nodes.IRule {
	id: string;
	message: string;

	public constructor(id: string, message: string) {
		this.id = id;
		this.message = message;
	}
}

export const ParseError = {
	NumberExpected: new CSSIssueType("css-numberexpected", "number expected"),
	ConditionExpected: new CSSIssueType(
		"css-conditionexpected",
		"condition expected",
	),
	RuleOrSelectorExpected: new CSSIssueType(
		"css-ruleorselectorexpected",
		"at-rule or selector expected",
	),
	DotExpected: new CSSIssueType("css-dotexpected", "dot expected"),
	ColonExpected: new CSSIssueType("css-colonexpected", "colon expected"),
	SemiColonExpected: new CSSIssueType(
		"css-semicolonexpected",
		"semi-colon expected",
	),
	TermExpected: new CSSIssueType("css-termexpected", "term expected"),
	ExpressionExpected: new CSSIssueType(
		"css-expressionexpected",
		"expression expected",
	),
	OperatorExpected: new CSSIssueType(
		"css-operatorexpected",
		"operator expected",
	),
	IdentifierExpected: new CSSIssueType(
		"css-identifierexpected",
		"identifier expected",
	),
	PercentageExpected: new CSSIssueType(
		"css-percentageexpected",
		"percentage expected",
	),
	URIOrStringExpected: new CSSIssueType(
		"css-uriorstringexpected",
		"uri or string expected",
	),
	URIExpected: new CSSIssueType("css-uriexpected", "URI expected"),
	VariableNameExpected: new CSSIssueType(
		"css-varnameexpected",
		"variable name expected",
	),
	VariableValueExpected: new CSSIssueType(
		"css-varvalueexpected",
		"variable value expected",
	),
	PropertyValueExpected: new CSSIssueType(
		"css-propertyvalueexpected",
		"property value expected",
	),
	LeftCurlyExpected: new CSSIssueType("css-lcurlyexpected", "{ expected"),
	RightCurlyExpected: new CSSIssueType("css-rcurlyexpected", "} expected"),
	LeftSquareBracketExpected: new CSSIssueType(
		"css-rbracketexpected",
		"[ expected",
	),
	RightSquareBracketExpected: new CSSIssueType(
		"css-lbracketexpected",
		"] expected",
	),
	LeftParenthesisExpected: new CSSIssueType(
		"css-lparentexpected",
		"( expected",
	),
	RightParenthesisExpected: new CSSIssueType(
		"css-rparentexpected",
		") expected",
	),
	CommaExpected: new CSSIssueType("css-commaexpected", "comma expected"),
	PageDirectiveOrDeclarationExpected: new CSSIssueType(
		"css-pagedirordeclexpected",
		"page directive or declaraton expected",
	),
	UnknownAtRule: new CSSIssueType("css-unknownatrule", "at-rule unknown"),
	UnknownKeyword: new CSSIssueType("css-unknownkeyword", "unknown keyword"),
	SelectorExpected: new CSSIssueType(
		"css-selectorexpected",
		"selector expected",
	),
	StringLiteralExpected: new CSSIssueType(
		"css-stringliteralexpected",
		"string literal expected",
	),
	WhitespaceExpected: new CSSIssueType(
		"css-whitespaceexpected",
		"whitespace expected",
	),
	MediaQueryExpected: new CSSIssueType(
		"css-mediaqueryexpected",
		"media query expected",
	),
	IdentifierOrWildcardExpected: new CSSIssueType(
		"css-idorwildcardexpected",
		"identifier or wildcard expected",
	),
	WildcardExpected: new CSSIssueType(
		"css-wildcardexpected",
		"wildcard expected",
	),
	IdentifierOrVariableExpected: new CSSIssueType(
		"css-idorvarexpected",
		"identifier or variable expected",
	),
};
