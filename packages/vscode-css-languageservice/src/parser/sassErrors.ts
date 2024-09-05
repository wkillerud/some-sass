/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
"use strict";

import * as nodes from "./cssNodes";

import * as l10n from "@vscode/l10n";

export class SassIssueType implements nodes.IRule {
	id: string;
	message: string;

	public constructor(id: string, message: string) {
		this.id = id;
		this.message = message;
	}
}

export const SassParseError = {
	FromExpected: new SassIssueType("scss-fromexpected", l10n.t("'from' expected")),
	ThroughOrToExpected: new SassIssueType("scss-throughexpected", l10n.t("'through' or 'to' expected")),
	InExpected: new SassIssueType("scss-fromexpected", l10n.t("'in' expected")),
};
