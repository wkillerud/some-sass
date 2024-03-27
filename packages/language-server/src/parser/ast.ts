import { Node, NodeType } from "@somesass/language-services";

/**
 * Get Node by offset position.
 */
export function getNodeAtOffset<T extends Node>(
	parsedDocument: Node,
	posOffset: number | null,
): T | null {
	let candidate: Node | null = null;

	parsedDocument.accept((node) => {
		if (node.offset === -1 && node.length === -1) {
			return true;
		}

		if (
			posOffset !== null &&
			node.offset <= posOffset &&
			node.end >= posOffset
		) {
			if (!candidate) {
				candidate = node;
			} else if (node.length <= candidate.length) {
				candidate = node;
			}

			return true;
		}

		return false;
	});

	return candidate;
}

/**
 * Returns the parent Node of the specified type, excluding NodeType.Stylesheet
 */
export function getParentNodeByType<T extends Node>(
	node: Node | null,
	type: NodeType,
): T | null {
	if (node === null) {
		return null;
	}

	node = node.getParent();

	while (node && node.type != type) {
		if (node.type === NodeType.Stylesheet) {
			return null;
		}

		node = node.getParent();
	}

	return node as T;
}
