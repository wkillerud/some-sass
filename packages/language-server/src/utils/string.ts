import { IEditorSettings } from "../settings";

/**
 * Returns word by specified position.
 */
export function getCurrentWord(text: string, offset: number) {
	let i = offset - 1;
	while (i >= 0 && !' \t\n\r":[()]}/,'.includes(text.charAt(i))) {
		i--;
	}

	return text.substring(i + 1, offset);
}

/**
 * Returns text before specified position.
 */
export function getTextBeforePosition(text: string, offset: number) {
	let i = offset - 1;
	while (!"\n\r".includes(text.charAt(i))) {
		i--;
	}

	return text.substring(i + 1, offset);
}

/**
 * Returns text after specified position.
 */
export function getTextAfterPosition(text: string, offset: number) {
	let i = offset + 1;
	while (!"\n\r".includes(text.charAt(i))) {
		i++;
	}

	return text.substring(i + 1, offset);
}

export const reNewline = /\r\n|\r|\n/;

export function getLinesFromText(text: string): string[] {
	return text.split(reNewline);
}

const space = " ";
const tab = "	";

export function indentText(text: string, settings: IEditorSettings): string {
	if (settings.insertSpaces) {
		const numberOfSpaces: number =
			typeof settings.indentSize === "number"
				? settings.indentSize
				: typeof settings.tabSize === "number"
					? settings.tabSize
					: 2;
		return `${space.repeat(numberOfSpaces)}${text}`;
	}

	return `${tab}${text}`;
}

/** Strips the dollar prefix off a variable name */
export function asDollarlessVariable(variable: string): string {
	return variable.replace(/^\$/, "");
}

export function stripTrailingComma(string: string): string {
	return stripTrailingCharacter(string, ",");
}

export function stripParentheses(string: string): string {
	return string.replace(/[()]/g, "");
}

function stripTrailingCharacter(string: string, char: string): string {
	return string.endsWith(char)
		? string.slice(0, Math.max(0, string.length - char.length))
		: string;
}

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * MIT License
 *--------------------------------------------------------------------------------------------*/
export function getEOL(text: string): string {
	for (let i = 0; i < text.length; i++) {
		const ch = text.charAt(i);
		if (ch === "\r") {
			if (i + 1 < text.length && text.charAt(i + 1) === "\n") {
				return "\r\n";
			}
			return "\r";
		} else if (ch === "\n") {
			return "\n";
		}
	}
	return "\n";
}
