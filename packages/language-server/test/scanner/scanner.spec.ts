import { isMatch } from "micromatch";
import { describe, beforeEach, assert, test } from "vitest";
import { useContext } from "../../src/context-provider";
import { NodeFileSystem } from "../../src/node-file-system";
import WorkspaceScannerService from "../../src/workspace-scanner";
import { getUri } from "../fixture-helper";
import * as helpers from "../helpers";

describe("Services/Scanner", () => {
	beforeEach(() => {
		helpers.createTestContext(new NodeFileSystem());
	});

	test("should follow links", async () => {
		const workspaceUri = getUri("scanner/follow-links/");
		const docUri = getUri("scanner/follow-links/styles.scss");
		const scanner = new WorkspaceScannerService();
		await scanner.scan([docUri], workspaceUri);

		const { storage } = useContext();
		const documents = [...storage.values()];

		assert.strictEqual(
			documents.length,
			3,
			"expected to find three documents in fixtures/unit/scanner/follow-links/",
		);
	});

	test("should not get stuck in loops if the author links a document to itself", async () => {
		// Yes, I've had this happen to me during a refactor :D

		const workspaceUri = getUri("scanner/self-reference/");
		const docUri = getUri("scanner/self-reference/styles.scss");
		const scanner = new WorkspaceScannerService();
		await scanner.scan([docUri], workspaceUri);

		const { storage } = useContext();
		const documents = [...storage.values()];

		assert.strictEqual(
			documents.length,
			1,
			"expected to find a document in fixtures/unit/scanner/self-reference/",
		);
	});

	test("exclude matcher works as expected", () => {
		assert.ok(isMatch("/home/user/project/.git/index", "**/.git/**"));
		assert.ok(
			isMatch(
				"/home/user/project/node_modules/package/some.scss",
				"**/node_modules/**",
			),
		);
	});
});
