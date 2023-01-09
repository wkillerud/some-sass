import { strictEqual } from "assert";
import { NodeType } from "../../parser";
import { getNodeAtOffset, getParentNodeByType } from "../../parser/ast";
import StorageService from "../../storage";
import * as helpers from "../helpers";
import { TestFileSystem } from "../test-file-system";

const storage = new StorageService();
const fs = new TestFileSystem(storage);

describe("Utils/Ast", () => {
	it("getNodeAtOffset", async () => {
		const ast = await helpers.makeAst(storage, [".a {}"], fs);

		const node = getNodeAtOffset(ast, 4);

		strictEqual(node?.type, NodeType.Declarations);
		strictEqual(node?.getText(), "{}");
	});

	it("getParentNodeByType", async () => {
		const ast = await helpers.makeAst(storage, [".a {}"], fs);

		const node = getNodeAtOffset(ast, 4);
		const parentNode = getParentNodeByType(node, NodeType.Ruleset);

		strictEqual(parentNode?.type, NodeType.Ruleset);
		strictEqual(parentNode?.getText(), ".a {}");
	});
});
