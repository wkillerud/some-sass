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

/**
 * Limit of string length.
 */
export function getLimitedString(str: string, ellipsis = true): string {
	if (!str) {
		return "null";
	}

	// Twitter <3
	if (str.length < 140) {
		return str;
	}

	return str.slice(0, 140) + (ellipsis ? "\u2026" : "");
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
