import { TextDocument } from "vscode-languageserver-textdocument";
import type { Position } from "vscode-languageserver-textdocument";

type Region = [number, number];

export function isFileWhereScssCanBeEmbedded(path: string) {
	if (path.endsWith(".scss")) {
		return false;
	}
	return true;
}

export function getSCSSRegions(content: string) {
	const regions: Region[] = [];
	const startRe =
		/<style[\w\t\n "'=]+(lang|type)=["'](text\/)?scss["'][\w\t\n "'=]*>/g;
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

export function getSCSSContent(
	content: string,
	regions = getSCSSRegions(content),
) {
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

/**
 * Function that extracts only the SCSS region of a template
 * language such as Vue, Svelte or Astro. This is not the correct
 * approach for embedded languages, compared to say the HTML language
 * server.
 *
 * @todo Look into how to do this properly with a goal to unship this custom handling.
 */
export function getSCSSRegionsDocument(
	document: TextDocument | null | undefined = null,
	position?: Position,
): TextDocument | null {
	if (!document) return document;

	const offset = position ? document.offsetAt(position) : 0;

	if (!isFileWhereScssCanBeEmbedded(document.uri)) {
		return document;
	}

	const text = document.getText();
	const scssRegions = getSCSSRegions(text);

	if (
		typeof position === "undefined" ||
		scssRegions.some((region) => region[0] <= offset && region[1] >= offset)
	) {
		const uri = document.uri;
		const version = document.version;

		return TextDocument.create(
			uri,
			"scss",
			version,
			getSCSSContent(text, scssRegions),
		);
	}

	return null;
}
