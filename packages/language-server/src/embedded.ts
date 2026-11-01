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
		/<style\s(?:[^>]*?\s)?(?:lang|type)=(?<quote>["'])(?:text\/)?(?<type>s[ac]ss)\k<quote>[^>]*>/g;
	const endRe = /<\/style>/g;
	let start: RegExpExecArray | null;
	while ((start = startRe.exec(content)) !== null) {
		// Find the end tag that comes after this start tag
		endRe.lastIndex = startRe.lastIndex;
		const end = endRe.exec(content);
		if (!end) break;
		regions.push({
			type: (start.groups?.type || "scss") as "sass" | "scss",
			range: [startRe.lastIndex, end.index],
		});
		startRe.lastIndex = endRe.lastIndex;
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
	if (regions.length === 0) {
		return null;
	}

	let type = regions[0].type;
	if (typeof position !== "undefined") {
		const current = regions.find(
			({ range }) => range[0] <= offset && range[1] >= offset,
		);
		if (!current) {
			return null;
		}
		type = current.type;
	}

	// The document can only have one language, so mask regions of the other type.
	return TextDocument.create(
		document.uri,
		type,
		document.version,
		getSassContent(
			text,
			regions.filter((region) => region.type === type),
		),
	);
}
