import { strictEqual } from "assert";
import {
	getCurrentWord,
	getTextBeforePosition,
	getTextAfterPosition,
	asDollarlessVariable,
	stripTrailingComma,
} from "../../utils/string";

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
