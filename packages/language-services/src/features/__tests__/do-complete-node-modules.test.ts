import { test, assert, beforeEach } from "vitest";
import { getLanguageService } from "../../language-services";
import { Position } from "../../language-services-types";
import { getOptions } from "../../utils/test-helpers";

const { fileSystemProvider, ...rest } = getOptions();
const ls = getLanguageService({ fileSystemProvider, ...rest });

beforeEach(() => {
	ls.clearCache();
	ls.configure({
		completionSettings: {
			suggestFromUseOnly: true,
		},
	}); // Reset any configuration to default
});

test("symbols forwarded from node_modules don't get suggested unless used", async () => {
	const pkg = fileSystemProvider.createDocument(['{ "name": "test-module" }'], {
		languageId: "json",
		uri: "node_modules/sass-true/package.json",
	});
	const module = fileSystemProvider.createDocument(
		["$catch-errors: false !default;"],
		{
			uri: "node_modules/sass-true/_throw.scss",
		},
	);
	const forward = fileSystemProvider.createDocument(['@forward "sass-true";'], {
		uri: "_test.scss",
	});
	const unrelated = fileSystemProvider.createDocument(["@debug $"]);

	ls.parseStylesheet(module);
	ls.parseStylesheet(forward);
	ls.parseStylesheet(unrelated);

	const { items } = await ls.doComplete(unrelated, Position.create(0, 8));
	assert.notOk(
		items.find((item) => item.label === "$catch-errors"),
		"Expected not to find $catch-errors in suggestions",
	);
});
