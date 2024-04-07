import { test, assert, beforeEach } from "vitest";
import { Position, getLanguageService } from "../../language-services";
import { getOptions } from "../../utils/test-helpers";

const { fileSystemProvider, ...rest } = getOptions();
const ls = getLanguageService({ fileSystemProvider, ...rest });

beforeEach(() => {
	ls.clearCache();
});

test("should find variable value", async () => {
	const one = fileSystemProvider.createDocument("$a: 1;", { uri: "one.scss" });
	const two = fileSystemProvider.createDocument([
		'@use "./one";',
		".a { content: one.$a; }",
	]);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const value = await ls.findValue(two, Position.create(1, 20));
	assert.equal(value, "1");
});
