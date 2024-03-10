import { ExternalTokenizer } from "@lezer/lr";
import { Description } from "./parser.terms.js";

const space = [
	9, 10, 11, 12, 13, 32, 133, 160, 5760, 8192, 8193, 8194, 8195, 8196, 8197,
	8198, 8199, 8200, 8201, 8202, 8232, 8233, 8239, 8287, 12288,
];

const newline = 10;
const slash = 47;
const at = 97;

/**
 * @param {import("@lezer/lr").InputStream} input
 * @returns {boolean}
 */
function trippleSlash(input) {
	return (
		input.next == slash && input.peek(1) == slash && input.peek(2) == slash
	);
}

export const description = new ExternalTokenizer((input) => {
	if (!trippleSlash(input)) {
		return;
	}
	input.advance(3);
	if (space.includes(input.next)) {
		input.advance();
	}
	if (space.includes(input.next)) {
		// This is likely an indented example block
		return;
	}
	if (input.next === at) {
		// Handle attribute descriptions in grammar
		return;
	}
	do {
		input.advance();
	} while (input.next !== newline);
	input.acceptToken(Description);
});
