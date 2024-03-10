import { ExternalTokenizer } from "@lezer/lr";
import {
	Description,
	AnnotationDescription,
	Annotation,
	Example,
	ExampleLanguage,
	ExampleCode,
} from "./parser.terms.js";

const space = [
	9, 11, 12, 32, 133, 160, 5760, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8199,
	8200, 8201, 8202, 8232, 8233, 8239, 8287, 12288,
];

const newline = 10;
const slash = "/".charCodeAt(0);
const at = "@".charCodeAt(0);

/**
 * @param {import("@lezer/lr").InputStream} input
 * @returns {boolean}
 */
function trippleSlash(input) {
	return (
		input.next == slash && input.peek(1) == slash && input.peek(2) == slash
	);
}

/**
 * @param {import("@lezer/lr").InputStream} input
 * @returns {boolean}
 */
function indented(input) {
	return space.includes(input.next) && space.includes(input.peek(1));
}

/**
 * @param {import("@lezer/lr").InputStream} input
 * @param {string} string ex. "@example"
 * @returns {boolean}
 */
function readCharacters(input, string) {
	const characters = string.split("");
	for (const c of characters) {
		if (input.next !== c.charCodeAt(0)) {
			return false;
		}
		input.advance();
	}
	return true;
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
	while (input.next !== newline && input.next !== -1) {
		input.advance();
	}

	if (input.next === newline) {
		maybeMultilineDescription(input);
	}

	input.acceptToken(Description);
});

/**
 * @param {import("@lezer/lr").InputStream} input
 * @returns
 */
function maybeMultilineDescription(input) {
	do {
		input.advance();
		// go to the next line and get past indentation
	} while (space.includes(input.next));

	if (!trippleSlash(input)) {
		return;
	}
	if (space.includes(input.peek(3)) && space.includes(input.peek(4))) {
		// This is likely an indented example block
		return;
	}
	if (input.peek(3) === at || input.peek(4) === at) {
		// Annotation on next line, not a continued description
		return;
	}

	// treat this line as the same description
	while (input.next !== newline && input.next !== -1) {
		input.advance();
	}
}

/**
 * @see http://sassdoc.com/annotations/#example
 */
export const example = new ExternalTokenizer((input) => {
	if (!trippleSlash(input)) {
		return;
	}
	input.advance(3);
	if (space.includes(input.next)) {
		input.advance();
	}

	if (!readCharacters(input, "@example")) {
		return;
	}
	input.acceptToken(Annotation);

	if (space.includes(input.next)) {
		input.advance();
		// the first word after @example is the example language
		do {
			input.advance();
		} while (
			input.next !== newline &&
			!space.includes(input.next) &&
			input.next !== -1
		);
		input.acceptToken(ExampleLanguage);

		if (input.next !== newline) {
			do {
				input.advance();
			} while (input.next !== newline && input.next !== -1);
			input.acceptToken(AnnotationDescription);
		}
	}

	if (input.next !== newline) {
		input.acceptToken(Example);
		return;
	}

	do {
		input.advance();
		// go to the next line and get past indentation
	} while (space.includes(input.next));

	if (trippleSlash(input)) {
		input.advance(3);
	} else {
		input.acceptToken(Example);
		return;
	}

	if (indented(input)) {
		console.log("In the indent");
		readExampleCode(input);
		console.log("Out the read example code");
		input.acceptToken(ExampleCode);
	}

	console.log("End");
	input.acceptToken(Example);
});

/**
 * Reads all indented lines of an @example block. In other words,
 * reads until it hits a tripple slash _not_ followed by two spaces,
 * or a line without tripple slash.
 *
 * @param {import("@lezer/lr").InputStream} input
 * @returns
 */
function readExampleCode(input) {
	do {
		input.advance();
	} while (input.next !== newline && input.next !== -1);

	do {
		input.advance();
		// go to the next line and get past indentation
	} while (space.includes(input.next));

	if (trippleSlash(input)) {
		input.advance(3);
	} else {
		return;
	}

	if (indented(input)) {
		readExampleCode(input);
	}
	return;
}
