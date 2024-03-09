import { describe, assert, test } from "vitest";
import {
	getCurrentWord,
	getTextBeforePosition,
	getTextAfterPosition,
	asDollarlessVariable,
	stripTrailingComma,
} from "../../src/utils/string";

describe("Utils/String", () => {
	test("getCurrentWord", () => {
		const text = ".text($a) {}";

		assert.strictEqual(getCurrentWord(text, 5), ".text");
		assert.strictEqual(getCurrentWord(text, 8), "$a");
	});

	test("getTextBeforePosition", () => {
		const text = "\n.text($a) {}";

		assert.strictEqual(getTextBeforePosition(text, 6), ".text");
		assert.strictEqual(getTextBeforePosition(text, 9), ".text($a");
	});

	test("getTextAfterPosition", () => {
		const text = ".text($a) {}";

		assert.strictEqual(getTextAfterPosition(text, 5), "($a) {}");
		assert.strictEqual(getTextAfterPosition(text, 8), ") {}");
	});

	test("asDollarlessVariable", () => {
		assert.strictEqual(asDollarlessVariable("$some-text"), "some-text");
		assert.strictEqual(asDollarlessVariable("$someText"), "someText");
		assert.strictEqual(asDollarlessVariable("$$$ (⌐■_■) $$$"), "$$ (⌐■_■) $$$");
	});

	test("stripTrailingComma", () => {
		assert.strictEqual(stripTrailingComma("dev.$fun-day,"), "dev.$fun-day");
		assert.strictEqual(stripTrailingComma("dev.$fun-day"), "dev.$fun-day");
	});
});
