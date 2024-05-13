/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {
	IPropertyData,
	IAtDirectiveData,
	IPseudoClassData,
	IPseudoElementData,
	IValueData,
	MarkupContent,
	MarkupKind,
	MarkedString,
	HoverSettings,
} from "vscode-languageserver-types";

export type EntryStatus =
	| "standard"
	| "experimental"
	| "nonstandard"
	| "obsolete";

export interface Browsers {
	E?: string;
	FF?: string;
	IE?: string;
	O?: string;
	C?: string;
	S?: string;
	count: number;
	all: boolean;
	onCodeComplete: boolean;
}

export const browserNames = {
	E: "Edge",
	FF: "Firefox",
	S: "Safari",
	C: "Chrome",
	IE: "IE",
	O: "Opera",
};

function getEntryStatus(status: EntryStatus) {
	switch (status) {
		case "experimental":
			return "⚠️ Property is experimental. Be cautious when using it.️\n\n";
		case "nonstandard":
			return "🚨️ Property is nonstandard. Avoid using it.\n\n";
		case "obsolete":
			return "🚨️️️ Property is obsolete. Avoid using it.\n\n";
		default:
			return "";
	}
}

/**
 * Input is like `["E12","FF49","C47","IE","O"]`
 * Output is like `Edge 12, Firefox 49, Chrome 47, IE, Opera`
 */
export function getBrowserLabel(browsers: string[] = []): string | null {
	if (browsers.length === 0) {
		return null;
	}

	return browsers
		.map((b) => {
			let result = "";
			const matches = b.match(/([A-Z]+)(\d+)?/)!;

			const name = matches[1];
			const version = matches[2];

			if (name in browserNames) {
				result += browserNames[name as keyof typeof browserNames];
			}
			if (version) {
				result += " " + version;
			}
			return result;
		})
		.join(", ");
}

export type IEntry =
	| IPropertyData
	| IAtDirectiveData
	| IPseudoClassData
	| IPseudoElementData
	| IValueData;

export interface IValue {
	name: string;
	description?: string | MarkupContent;
	browsers?: string[];
}
