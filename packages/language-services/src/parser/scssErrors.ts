/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nodes from "./cssNodes";

export class SCSSIssueType implements nodes.IRule {
	id: string;
	message: string;

	public constructor(id: string, message: string) {
		this.id = id;
		this.message = message;
	}
}

export const SCSSParseError = {
	FromExpected: new SCSSIssueType("scss-fromexpected", "'from' expected"),
	ThroughOrToExpected: new SCSSIssueType(
		"scss-throughexpected",
		"'through' or 'to' expected",
	),
	InExpected: new SCSSIssueType("scss-fromexpected", "'in' expected"),
};
