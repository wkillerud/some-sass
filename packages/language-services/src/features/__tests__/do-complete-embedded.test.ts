import { test, assert, beforeEach } from "vitest";
import { getLanguageService } from "../../language-services";
import {
	CompletionItemKind,
	Position,
	TextDocument,
} from "../../language-services-types";
import { getOptions } from "../../utils/test-helpers";

const { fileSystemProvider, ...rest } = getOptions();
const ls = getLanguageService({ fileSystemProvider, ...rest });

const reSassExt = /\.s(a|c)ss$/;

type Region = [number, number];

function getStylesheetRegions(content: string) {
	const regions: Region[] = [];
	const startRe =
		/<style[\w\t\n "'=]+(lang|type)=["'](text\/)?s(a|c)ss["'][\w\t\n "'=]*>/g;
	const endRe = /<\/style>/g;
	let start: RegExpExecArray | null;
	let end: RegExpExecArray | null;
	while (
		(start = startRe.exec(content)) !== null &&
		(end = endRe.exec(content)) !== null
	) {
		if (start[0] !== undefined) {
			regions.push([start.index + start[0].length, end.index]);
		}
	}
	return regions;
}

function getStylesheetContent(content: string, regions: Region[]) {
	const oldContent = content;
	let newContent = oldContent
		.split("\n")
		.map((line) => " ".repeat(line.length))
		.join("\n");
	for (const r of regions) {
		newContent =
			newContent.slice(0, r[0]) +
			oldContent.slice(r[0], r[1]) +
			newContent.slice(r[1]);
	}
	return newContent;
}

function getSCSSRegionsDocument(document: TextDocument, position?: Position) {
	if (document.uri.match(reSassExt)) {
		return document;
	}

	const offset = position ? document.offsetAt(position) : 0;
	const text = document.getText();
	const stylesheetRegions = getStylesheetRegions(text);

	if (
		typeof position === "undefined" ||
		stylesheetRegions.some(
			(region) => region[0] <= offset && region[1] >= offset,
		)
	) {
		const uri = document.uri;
		const version = document.version;

		return TextDocument.create(
			uri,
			"scss",
			version,
			getStylesheetContent(text, stylesheetRegions),
		);
	}

	return document;
}

beforeEach(() => {
	ls.clearCache();
	ls.configure({}); // Reset any configuration to default
});

test("should suggest symbol from a different document via @use", async () => {
	const one = fileSystemProvider.createDocument("$primary: limegreen;", {
		uri: "one.scss",
	});
	const vue = fileSystemProvider.createDocument(
		[
			"<template>",
			'	<p class="foo"></p>',
			"</template>",
			"<script>",
			"	export default {}",
			"</script>",
			'<style lang="scss">',
			'@use "./one" as ns;',
			".foo {",
			"	color: ns.;",
			"}",
			"</style>",
		],
		{
			uri: "two.vue",
		},
	);

	const position = Position.create(9, 11);
	const two = getSCSSRegionsDocument(vue, position);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const { items } = await ls.doComplete(two, position);
	assert.notEqual(
		0,
		items.length,
		"Expected to find a completion item for $primary",
	);
	assert.deepStrictEqual(
		items.find((annotation) => annotation.label === "$primary"),
		{
			commitCharacters: [";", ","],
			documentation: "limegreen\n____\nVariable declared in one.scss",
			filterText: "ns.$primary",
			kind: CompletionItemKind.Color,
			label: "$primary",
			sortText: undefined,
			tags: [],
			textEdit: {
				newText: "ns.$primary",
				range: {
					end: {
						character: 11,
						line: 9,
					},
					start: {
						character: 8,
						line: 9,
					},
				},
			},
		},
	);
});
