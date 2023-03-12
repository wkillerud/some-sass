import { strictEqual } from "assert";
import { NodeType } from "../../parser";
import { getNodeAtOffset, getParentNodeByType } from "../../parser/ast";
import * as helpers from "../helpers";

describe("Utils/Ast", () => {
	beforeEach(() => helpers.createTestContext());

	it("getNodeAtOffset", async () => {
		const ast = await helpers.makeAst([".a {}"]);

		const node = getNodeAtOffset(ast, 4);

		strictEqual(node?.type, NodeType.Declarations);
		strictEqual(node?.getText(), "{}");
	});

	it("getParentNodeByType", async () => {
		const ast = await helpers.makeAst([".a {}"]);

		const node = getNodeAtOffset(ast, 4);
		const parentNode = getParentNodeByType(node, NodeType.Ruleset);

		strictEqual(parentNode?.type, NodeType.Ruleset);
		strictEqual(parentNode?.getText(), ".a {}");
	});
});
