import { test, assert, beforeEach } from "vitest";
import { Position, getLanguageService } from "../../language-services";
import { getOptions } from "../../utils/test-helpers";

const { fileSystemProvider, ...rest } = getOptions();
const ls = getLanguageService({ fileSystemProvider, ...rest });

beforeEach(() => {
	ls.clearCache();
});

test("suggests built-in sass modules for imports", async () => {
	const document = fileSystemProvider.createDocument('@use "');
	const { items } = await ls.doComplete(document, Position.create(0, 6));
	assert.notEqual(
		items.length,
		0,
		"Expected to get built-in Sass modules as completions",
	);

	// Quick sampling of the results
	assert.ok(
		items.find((annotation) => annotation.label === "sass:color"),
		"Expected to find sass:color entry",
	);
});

test("suggests subdirectories from node_modules module", async () => {
	fileSystemProvider.createDocument("", {
		uri: "./node_modules/bootstrap/scss/bootstrap.scss",
		languageId: "scss",
	});
	fileSystemProvider.createDocument("", {
		uri: "./node_modules/bootstrap/package.json",
		languageId: "json",
	});
	const document = fileSystemProvider.createDocument('@use "bootstrap/');
	const { items } = await ls.doComplete(document, Position.create(0, 6));

	assert.notEqual(items.length, 0, "Expected to get completions");

	assert.ok(
		items.find((annotation) => annotation.label === "scss/"),
		`Expected to find scss/ entry, got ${JSON.stringify(items, null, 2)}`,
	);
});

test("suggests files from node_modules module", async () => {
	fileSystemProvider.createDocument("", {
		uri: "./node_modules/bootstrap/scss/bootstrap.scss",
		languageId: "scss",
	});
	fileSystemProvider.createDocument("", {
		uri: "./node_modules/bootstrap/package.json",
		languageId: "json",
	});
	const document = fileSystemProvider.createDocument('@use "bootstrap/scss/');
	const { items } = await ls.doComplete(document, Position.create(0, 6));

	assert.notEqual(items.length, 0, "Expected to get completions");

	assert.ok(
		items.find((annotation) => annotation.label === "bootstrap.scss"),
		`Expected to find bootstrap.scss entry, got ${JSON.stringify(items, null, 2)}`,
	);
});

test.todo("suggests files from pkg: imports");
