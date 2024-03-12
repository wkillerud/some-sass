import { parseSync as parseSassdoc } from "scss-sassdoc-parser";

const spaces = [
	9, 11, 12, 32, 133, 160, 5760, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8199,
	8200, 8201, 8202, 8232, 8233, 8239, 8287, 12288,
];
const newlines = [10, 13];
const whitespace = [...newlines, ...spaces];
const slash = 47;

/**
 * Starts right after the first /// of the Sassdoc block.
 * @param {import("@lezer/lr").InputStream} input
 * @return {import("scss-sassdoc-parser").ParseResult}
 */
export function readSassdoc(input) {
	const stringBuilder = ["/", "/", "/"];
	while (input.next >= 0) {
		let { next } = input;
		// Consume the line until we hit a newline
		input.advance();

		if (newlines.includes(next) && spaces.includes(input.next)) {
			// consume all the indentation space before continuing
			do {
				input.advance();
			} while (spaces.includes(input.next));

			if (input.next !== slash) {
				break;
			}
		}

		stringBuilder.push(String.fromCharCode(next));
	}

	const sassdoc = stringBuilder.join();
	const [parseResult] = parseSassdoc(sassdoc);
	return parseResult;
}
