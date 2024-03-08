export function getNamespaceFromLink(target: string): string {
	if (target.startsWith("sass")) {
		return target.split(":")[1];
	}

	const bareTarget = target.replace("pkg:", "").replace("./", "");
	let from = 0;
	let to = bareTarget.length;
	if (bareTarget.includes("/")) {
		from = bareTarget.lastIndexOf("/") + 1;
	}
	if (bareTarget.includes(".")) {
		to = bareTarget.lastIndexOf(".");
	}
	let namespace = bareTarget.substring(from, to);
	namespace = namespace.startsWith("_") ? namespace.slice(1) : namespace;
	if (namespace === "index") {
		// The link points to an index file. Use the folder name above as a namespace.
		const linkOmitIndex = bareTarget.slice(
			0,
			Math.max(0, bareTarget.lastIndexOf("/")),
		);
		const newLastSlash = linkOmitIndex.lastIndexOf("/");
		namespace = linkOmitIndex.slice(Math.max(0, newLastSlash + 1));
	}

	return namespace;
}
