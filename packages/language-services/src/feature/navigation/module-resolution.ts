import { DocumentUri, URI, Utils } from "@somesass/language-server-types";

export function toPathVariations(target: string): DocumentUri[] {
	// No variation for links that ends with .css suffix
	if (target.endsWith(".css")) {
		return [target];
	}

	// If a link is like a/, try resolving a/index.scss, a/_index.scss, a/index.sass and a/_index.sass
	if (target.endsWith("/")) {
		return [
			target + "index.scss",
			target + "_index.scss",
			target + "index.sass",
			target + "_index.sass",
		];
	}

	const targetUri = URI.parse(target.replace(/\.s[ac]ss$/, ""));
	const basename = Utils.basename(targetUri);
	const dirname = Utils.dirname(targetUri);
	if (basename.startsWith("_")) {
		// No variation for links such as _a
		return [
			Utils.joinPath(dirname, basename + ".scss").toString(true),
			Utils.joinPath(dirname, basename + ".sass").toString(true),
		];
	}

	const variants = [
		Utils.joinPath(dirname, basename + ".scss").toString(true),
		Utils.joinPath(dirname, "_" + basename + ".scss").toString(true),
		target + "/index.scss",
		target + "/_index.scss",
		Utils.joinPath(dirname, basename + ".sass").toString(true),
		Utils.joinPath(dirname, "_" + basename + ".sass").toString(true),
		target + "/index.sass",
		target + "/_index.sass",
		Utils.joinPath(dirname, basename + ".css").toString(true),
	];
	return variants;
}

export function getSubpathEntry(
	subpathObject: string | Record<string, unknown>,
): string | undefined {
	return (
		// @ts-expect-error If subpathObject is a string this just produces undefined
		subpathObject["sass"] ||
		// @ts-expect-error If subpathObject is a string this just produces undefined
		subpathObject["styles"] ||
		// @ts-expect-error If subpathObject is a string this just produces undefined
		subpathObject["default"]
	);
}
