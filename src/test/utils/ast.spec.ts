import assert from "assert";
import { NodeType } from "../../server/nodes";
import StorageService from "../../server/storage";
import { getNodeAtOffset, getParentNodeByType } from "../../server/utils/ast";
import * as helpers from "../helpers";

const storage = new StorageService();

describe("Utils/Ast", () => {
	it("getNodeAtOffset", async () => {
		const ast = await helpers.makeAst(storage, [".a {}"]);

		const node = getNodeAtOffset(ast, 4);

		assert.strictEqual(node?.type, NodeType.Declarations);
		assert.strictEqual(node?.getText(), "{}");
	});

	it("getParentNodeByType", async () => {
		const ast = await helpers.makeAst(storage, [".a {}"]);

		const node = getNodeAtOffset(ast, 4);
		const parentNode = getParentNodeByType(node, NodeType.Ruleset);

		assert.strictEqual(parentNode?.type, NodeType.Ruleset);
		assert.strictEqual(parentNode?.getText(), ".a {}");
	});
});
