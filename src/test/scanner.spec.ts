import assert from "assert";
import path from "path";
import { isMatch } from "micromatch";
import { stub, SinonStub } from "sinon";
import { FileType } from "vscode-css-languageservice";
import { URI } from "vscode-uri";
import { NodeFileSystem } from "../server/node-file-system";
import ScannerService from "../server/scanner";
import StorageService from "../server/storage";
import * as helpers from "./helpers";

const fs = new NodeFileSystem();

describe("Services/Scanner", () => {
	describe(".scan", () => {
		let statStub: SinonStub;
		let fileExistsStub: SinonStub;
		let readFileStub: SinonStub;

		beforeEach(() => {
			statStub = stub(fs, "stat").yields(null, {
				type: FileType.Unknown,
				ctime: -1,
				mtime: -1,
				size: -1,
			});
			fileExistsStub = stub(fs, "exists");
			readFileStub = stub(fs, "readFile");
		});

		afterEach(() => {
			statStub.restore();
			fileExistsStub.restore();
			readFileStub.restore();
		});

		it("should find files and update cache", async () => {
			const workspaceRootPath = path.resolve("");
			const workspaceRootUri = URI.file(workspaceRootPath);
			const indexDocumentPath = path.resolve("index.scss").toLowerCase();
			const indexDocumentUri = URI.file(indexDocumentPath);
			const variablesDocumentPath = path
				.resolve("variables.scss")
				.toLowerCase();
			const variablesDocumentUri = URI.file(variablesDocumentPath);

			const storage = new StorageService();
			const settings = helpers.makeSettings();
			const scanner = new ScannerService(storage, fs, settings);

			fileExistsStub.resolves(true);
			readFileStub.onFirstCall().resolves("$name: value;");
			readFileStub.onSecondCall().resolves("");

			await scanner.scan(
				[indexDocumentUri, variablesDocumentUri],
				workspaceRootUri,
			);

			const expected = new Map([
				[indexDocumentUri.toString(), indexDocumentUri],
				[variablesDocumentUri.toString(), variablesDocumentUri],
			]);
			assert.deepStrictEqual(storage.keys(), expected.keys());
			assert.strictEqual(storage.get(indexDocumentUri)?.variables.size, 1);

			assert.strictEqual(
				fileExistsStub.callCount,
				2,
				"File exists was not called twice",
			);
			assert.strictEqual(
				readFileStub.callCount,
				2,
				"Read file was not called twice",
			);
		});

		it("should find file and imported files", async () => {
			const workspaceRootPath = path.resolve("");
			const workspaceRootUri = URI.file(workspaceRootPath);
			const indexDocumentPath = path.resolve("index.scss").toLowerCase();
			const indexDocumentUri = URI.file(indexDocumentPath);
			const variablesDocumentPath = path
				.resolve("variables.scss")
				.toLowerCase();
			const variablesDocumentUri = URI.file(variablesDocumentPath);

			const storage = new StorageService();
			const settings = helpers.makeSettings();
			const scanner = new ScannerService(storage, fs, settings);

			fileExistsStub.resolves(true);
			readFileStub.onFirstCall().resolves('@import "variables.scss";');
			readFileStub.onSecondCall().resolves("");

			await scanner.scan([indexDocumentUri], workspaceRootUri);

			const expected = new Map([
				[indexDocumentUri.toString(), indexDocumentUri],
				[variablesDocumentUri.toString(), variablesDocumentUri],
			]);
			assert.deepStrictEqual(storage.keys(), expected.keys());

			assert.strictEqual(
				fileExistsStub.callCount,
				3,
				"File exists was not called three times",
			); // Scanner only calls twice, but parser does as well
			assert.strictEqual(
				readFileStub.callCount,
				2,
				"Read file was not called twice",
			);
		});

		it("should do not find imported files when it not required", async () => {
			const workspaceRootPath = path.resolve("");
			const workspaceRootUri = URI.file(workspaceRootPath);

			const storage = new StorageService();
			const settings = helpers.makeSettings({ scanImportedFiles: false });
			const scanner = new ScannerService(storage, fs, settings);

			fileExistsStub.resolves(true);
			readFileStub.onFirstCall().resolves('@import "variables.scss";');
			readFileStub.onSecondCall().resolves("");

			const indexDocumentUri = URI.file("index.scss");
			await scanner.scan([indexDocumentUri], workspaceRootUri);

			const expected = new Map([
				[indexDocumentUri.toString(), indexDocumentUri],
			]);
			assert.deepStrictEqual(storage.keys(), expected.keys());

			assert.strictEqual(
				fileExistsStub.callCount,
				2,
				"File exists was not called twice",
			); // Scanner only calls once, but parser does as well
			assert.strictEqual(
				readFileStub.callCount,
				1,
				"Read file was not called once",
			);
		});

		it("exclude matcher works as expected", () => {
			assert.ok(isMatch("/home/user/project/.git/index", "**/.git/**"));
			assert.ok(
				isMatch(
					"/home/user/project/node_modules/package/some.scss",
					"**/node_modules/**",
				),
			);
		});
	});
});
