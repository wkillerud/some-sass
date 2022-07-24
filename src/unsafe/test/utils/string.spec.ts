'use strict';

import assert from 'assert';

import {
	getCurrentWord,
	getTextBeforePosition,
	getTextAfterPosition,
	getLimitedString,
	asDollarlessVariable,
	stripTrailingComma
} from '../../utils/string';

describe('Utils/String', () => {
	it('getCurrentWord', () => {
		const text = `.text($a) {}`;

		assert.strictEqual(getCurrentWord(text, 5), '.text');
		assert.strictEqual(getCurrentWord(text, 8), '$a');
	});

	it('getTextBeforePosition', () => {
		const text = `\n.text($a) {}`;

		assert.strictEqual(getTextBeforePosition(text, 6), '.text');
		assert.strictEqual(getTextBeforePosition(text, 9), '.text($a');
	});

	it('getTextAfterPosition', () => {
		const text = `.text($a) {}`;

		assert.strictEqual(getTextAfterPosition(text, 5), '($a) {}');
		assert.strictEqual(getTextAfterPosition(text, 8), ') {}');
	});

	it('getLimitedString', () => {
		const text = `vscode`.repeat(24);

		assert.strictEqual(getLimitedString(text).length, 141);
		assert.strictEqual(getLimitedString(text, false).length, 140);
	});

	it('asDollarlessVariable', () => {
		assert.strictEqual(asDollarlessVariable('$some-text'), 'some-text');
		assert.strictEqual(asDollarlessVariable('$someText'), 'someText');
		assert.strictEqual(asDollarlessVariable('$$$ (⌐■_■) $$$'), '$$ (⌐■_■) $$$');
	});

	it('stripTrailingComma', () => {
		assert.strictEqual(stripTrailingComma('dev.$fun-day,'), 'dev.$fun-day');
		assert.strictEqual(stripTrailingComma('dev.$fun-day'), 'dev.$fun-day');
	})
});
