import { test, assert } from "vitest";
import { getLanguageService } from "../../language-services";
import { NodeType } from "../../language-services-types";
import { getOptions } from "../../utils/test-helpers";

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
		'@use "corners" as *;',
		'@use "variables" as vars;',
		'@forward "colors" as color-* hide $varslingsfarger, varslingsfarge;',
		'@forward "./foo" as foo-* hide $private;',
	]);

	const links = await ls.findDocumentLinks(document);

	// Uses
	const uses = links.filter((link) => link.type === NodeType.Use);
	assert.strictEqual(uses.length, 2, "expected to find two uses");
	assert.strictEqual(uses[0]?.namespace, undefined);
	assert.strictEqual(uses[0]?.as, "*");
	assert.strictEqual(uses[1]?.namespace, "vars");

	// Forward
	const forwards = links.filter((link) => link.type === NodeType.Forward);
	assert.strictEqual(forwards.length, 2, "expected to find two forward");
	assert.strictEqual(forwards[0]?.as, "color-");
	assert.deepStrictEqual(forwards[0]?.hide, [
		"$varslingsfarger",
		"varslingsfarge",
	]);
	assert.strictEqual(forwards[1]?.as, "foo-");
	assert.deepStrictEqual(forwards[1]?.hide, ["$private"]);
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

test("does not break on circular reference", async () => {
	const ping = fileSystemProvider.createDocument(
		['@use "./pong";', "$var: ping;"],
		{ uri: "ping.scss" },
	);
	const pong = fileSystemProvider.createDocument(
		['@use "./ping";', "$var: pong;"],
		{ uri: "pong.scss" },
	);

	ls.parseStylesheet(ping);
	ls.parseStylesheet(pong);

	const links = await ls.findDocumentLinks(ping);

	assert.strictEqual(links.length, 1, "expected to find link to pong");
});
