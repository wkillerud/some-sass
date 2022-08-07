import { strictEqual } from "assert";
import {
	getCurrentWord,
	getTextBeforePosition,
	getTextAfterPosition,
	getLimitedString,
	asDollarlessVariable,
	stripTrailingComma,
} from "../../server/utils/string";

describe("Utils/String", () => {
	it("getCurrentWord", () => {
		const text = ".text($a) {}";

		strictEqual(getCurrentWord(text, 5), ".text");
		strictEqual(getCurrentWord(text, 8), "$a");
	});

	it("getTextBeforePosition", () => {
		const text = "\n.text($a) {}";

		strictEqual(getTextBeforePosition(text, 6), ".text");
		strictEqual(getTextBeforePosition(text, 9), ".text($a");
	});

	it("getTextAfterPosition", () => {
		const text = ".text($a) {}";

		strictEqual(getTextAfterPosition(text, 5), "($a) {}");
		strictEqual(getTextAfterPosition(text, 8), ") {}");
	});

	it("getLimitedString", () => {
		const text = "vscode".repeat(24);

		strictEqual(getLimitedString(text).length, 141);
		strictEqual(getLimitedString(text, false).length, 140);
	});

	it("asDollarlessVariable", () => {
		strictEqual(asDollarlessVariable("$some-text"), "some-text");
		strictEqual(asDollarlessVariable("$someText"), "someText");
		strictEqual(asDollarlessVariable("$$$ (⌐■_■) $$$"), "$$ (⌐■_■) $$$");
	});

	it("stripTrailingComma", () => {
		strictEqual(stripTrailingComma("dev.$fun-day,"), "dev.$fun-day");
		strictEqual(stripTrailingComma("dev.$fun-day"), "dev.$fun-day");
	});
});
