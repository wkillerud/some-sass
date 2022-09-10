import { ok, strictEqual } from "assert";
import { isMatch } from "micromatch";
import ScannerService from "../../server/scanner";
import { defaultSettings } from "../../server/settings";
import StorageService from "../../server/storage";
import { NodeFileSystem } from "../../shared/node-file-system";
import { getUri } from "./scanner-helper";

const fs = new NodeFileSystem();

describe("Services/Scanner", () => {
	it("should follow links", async () => {
		const workspaceUri = getUri("scanner/follow-links/");
		const docUri = getUri("scanner/follow-links/styles.scss");
		const storage = new StorageService();
		const scanner = new ScannerService(storage, fs, defaultSettings);
		await scanner.scan([docUri], workspaceUri);

		const documents = [...storage.values()];

		strictEqual(
			documents.length,
			3,
			"expected to find three documents in fixtures/unit/scanner/follow-links/",
		);
	});

	it("should not get stuck in loops if the author links a document to itself", async () => {
		// Yes, I've had this happen to me during a refactor :D

		const workspaceUri = getUri("scanner/self-reference/");
		const docUri = getUri("scanner/self-reference/styles.scss");
		const storage = new StorageService();
		const scanner = new ScannerService(storage, fs, defaultSettings);
		await scanner.scan([docUri], workspaceUri);

		const documents = [...storage.values()];

		strictEqual(
			documents.length,
			1,
			"expected to find a document in fixtures/unit/scanner/self-reference/",
		);
	});

	it("exclude matcher works as expected", () => {
		ok(isMatch("/home/user/project/.git/index", "**/.git/**"));
		ok(
			isMatch(
				"/home/user/project/node_modules/package/some.scss",
				"**/node_modules/**",
			),
		);
	});
});
