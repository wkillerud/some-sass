import { NodeType } from "@somesass/language-services";
import { test, assert } from "vitest";
import { getLanguageService } from "../language-services";
import { getOptions } from "../utils/test-helpers";

const { fileSystemProvider, ...rest } = getOptions();
const ls = getLanguageService({ fileSystemProvider, ...rest });

test("should return links", async () => {
	fileSystemProvider.createDocument(["$var: 1px;"], {
		uri: "variables.scss",
	});
	fileSystemProvider.createDocument(["$b: #000;"], {
		uri: "corners.scss",
	});
	fileSystemProvider.createDocument(["$tr: 2px;"], {
		uri: "colors.scss",
	});

	const document = fileSystemProvider.createDocument([
		'@use "variables" as vars;',
		'@use "corners" as *;',
		'@forward "colors" as color-* hide $varslingsfarger, varslingsfarge;',
	]);

	const links = await ls.findDocumentLinks(document);

	// Uses
	const uses = links.filter((link) => link.type === NodeType.Use);
	assert.strictEqual(uses.length, 2, "expected to find two uses");
	assert.strictEqual(uses[0]?.namespace, "vars");
	assert.strictEqual(uses[1]?.namespace, "*");

	// Forward
	const forwards = links.filter((link) => link.type === NodeType.Forward);
	assert.strictEqual(forwards.length, 1, "expected to find one forward");
	assert.strictEqual(forwards[0]?.as, "color-");
	assert.deepStrictEqual(forwards[0]?.hide, [
		"$varslingsfarger",
		"varslingsfarge",
	]);
});

test("should return relative links", async () => {
	fileSystemProvider.createDocument(["$var: 1px;"], {
		uri: "upper.scss",
	});
	fileSystemProvider.createDocument(["$b: #000;"], {
		uri: "middle/middle.scss",
	});
	fileSystemProvider.createDocument(["$tr: 2px;"], {
		uri: "middle/lower/lower.scss",
	});

	const document = fileSystemProvider.createDocument(
		['@use "../upper";', '@use "./middle";', '@use "./lower/lower";'],
		{ uri: "middle/main.scss" },
	);

	const links = await ls.findDocumentLinks(document);
	assert.strictEqual(links.length, 3, "expected to find three uses");
});
