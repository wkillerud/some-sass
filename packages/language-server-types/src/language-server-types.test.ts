import { assert, describe, test } from "vitest";
// @ts-expect-error Not exported as enum type
import { NodeType as CSSNodeType } from "vscode-css-languageservice/lib/umd/parser/cssNodes";
import { NodeType } from "./language-server-types";

describe("NodeType", () => {
	test("type definition is in sync with vscode-css-languageservices", () => {
		const types = Object.entries(NodeType);
		assert.ok(types.length);

		for (const [nodeName, enumValue] of Object.entries(NodeType)) {
			// NodeType be synced with https://github.com/microsoft/vscode-css-languageservice/blob/main/src/parser/cssNodes.ts
			assert.strictEqual(
				CSSNodeType[nodeName],
				enumValue,
				`Expected ${nodeName} to have equal value to vscode-css-languageservice`,
			);
		}
	});
});
