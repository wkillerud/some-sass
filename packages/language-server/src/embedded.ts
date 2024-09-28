import { TextDocument } from "vscode-languageserver-textdocument";
import type { Position } from "vscode-languageserver-textdocument";

type Region = {
	type: "scss" | "sass";
	range: [number, number];
};

export function isFileWhereScssCanBeEmbedded(path: string) {
	if (
		path.endsWith(".scss") ||
		path.endsWith(".sass") ||
		path.endsWith(".css")
	) {
		return false;
	}
	return true;
}

export function getSassRegions(content: string) {
	const regions: Region[] = [];
	const startRe =
		/<style[\w\t\n "'=]+(lang|type)=["'](text\/)?(?<type>s(a|c)ss)["'][\w\t\n "'=]*>/g;
	const endRe = /<\/style>/g;
	let start: RegExpExecArray | null;
	let end: RegExpExecArray | null;
	while (
		(start = startRe.exec(content)) !== null &&
		(end = endRe.exec(content)) !== null
	) {
		if (start[0] !== undefined) {
			regions.push({
				type: (start.groups?.type || "scss") as "sass" | "scss",
				range: [start.index + start[0].length, end.index],
			});
		}
	}

	return regions;
}

export function getSassContent(
	content: string,
	regions = getSassRegions(content),
) {
	const oldContent = content;

	let newContent = oldContent
		.split("\n")
		.map((line) => " ".repeat(line.length))
		.join("\n");

	for (const { range } of regions) {
		newContent =
			newContent.slice(0, range[0]) +
			oldContent.slice(range[0], range[1]) +
			newContent.slice(range[1]);
	}

	return newContent;
}

/**
 * Function that extracts only the Sass region of a template
 * language such as Vue, Svelte or Astro. This is not the correct
 * approach for embedded languages, compared to say the HTML language
 * server.
 *
 * @todo Look into how to do this properly with a goal to unship this custom handling.
 */
export function getSassRegionsDocument(
	document: TextDocument | null | undefined = null,
	position?: Position,
): TextDocument | null {
	if (!document) return document;

	const offset = position ? document.offsetAt(position) : 0;

	if (!isFileWhereScssCanBeEmbedded(document.uri)) {
		return document;
	}

	const text = document.getText();
	const regions = getSassRegions(text);

	if (
		typeof position === "undefined" ||
		(regions.some(({ range }) => range[0] <= offset && range[1] >= offset) &&
			regions.every(({ type }) => type === regions[0].type))
	) {
		const uri = document.uri;
		const version = document.version;

		return TextDocument.create(
			uri,
			regions[0].type,
			version,
			getSassContent(text, regions),
		);
	}

	return null;
}
