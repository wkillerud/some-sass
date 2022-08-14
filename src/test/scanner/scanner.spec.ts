import { strictEqual } from "assert";
import ScannerService from "../../server/scanner";
import { defaultSettings } from "../../server/settings";
import StorageService from "../../server/storage";
import { NodeFileSystem } from "../../shared/node-file-system";
import { getUri } from "./scanner-helper";

const storage = new StorageService();
const fs = new NodeFileSystem();

describe("Services/Parser", () => {
	it("should follow links", async () => {
		const workspaceUri = getUri("scanner/");
		const docUri = getUri("scanner/style.scss");
		const scanner = new ScannerService(storage, fs, defaultSettings);
		await scanner.scan([docUri], workspaceUri);

		const documents = [...storage.values()];

		strictEqual(
			documents.length,
			3,
			"expected to find three documents in fixtures/unit/scanner/",
		);
	});
});
