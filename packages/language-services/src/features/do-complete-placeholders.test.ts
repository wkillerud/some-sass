import { test, assert, beforeEach } from "vitest";
import {
	CompletionItemKind,
	InsertTextFormat,
	Position,
	getLanguageService,
} from "../language-services";
import { getOptions } from "../utils/test-helpers";

const { fileSystemProvider, ...rest } = getOptions();
const ls = getLanguageService({ fileSystemProvider, ...rest });

beforeEach(() => {
	ls.clearCache();
});

test("when declaring a placeholder selector, suggest placeholders that have an @extend usage", async () => {
	// https://github.com/wkillerud/some-sass/issues/49

	const one = fileSystemProvider.createDocument(".main { @extend %main; }", {
		uri: "one.scss",
	});
	const two = fileSystemProvider.createDocument("%");

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const { items } = await ls.doComplete(two, Position.create(0, 1));
	assert.deepStrictEqual(items[0], {
		filterText: "main",
		insertText: "main",
		insertTextFormat: InsertTextFormat.PlainText,
		kind: CompletionItemKind.Class,
		label: "%main",
	});
});
