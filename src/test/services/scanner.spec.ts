import assert from "assert";
import fs from "fs";
import path from "path";
import { Stats } from "@nodelib/fs.macchiato";
import { isMatch } from "micromatch";
import { stub, SinonStub } from "sinon";
import { URI } from "vscode-uri";
import ScannerService from "../../server/scanner";
import StorageService from "../../server/storage";
import * as fsUtils from "../../server/utils/fs";
import * as helpers from "../helpers";

describe("Services/Scanner", () => {
	describe(".scan", () => {
		let statStub: SinonStub;
		let fileExistsStub: SinonStub;
		let readFileStub: SinonStub;

		beforeEach(() => {
			statStub = stub(fs, "stat").yields(null, new Stats());
			fileExistsStub = stub(fsUtils, "fileExists");
			readFileStub = stub(fsUtils, "readFile");
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
			const indexDocumentUri = URI.file(indexDocumentPath).toString();
			const variablesDocumentPath = path
				.resolve("variables.scss")
				.toLowerCase();
			const variablesDocumentUri = URI.file(variablesDocumentPath).toString();

			const storage = new StorageService();
			const settings = helpers.makeSettings();
			const scanner = new ScannerService(storage, settings);

			fileExistsStub.resolves(true);
			readFileStub.onFirstCall().resolves("$name: value;");
			readFileStub.onSecondCall().resolves("");

			await scanner.scan(
				[indexDocumentPath, variablesDocumentPath],
				workspaceRootUri,
			);

			const expected = new Map([
				[indexDocumentUri, indexDocumentUri],
				[variablesDocumentUri, variablesDocumentUri],
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
			const indexDocumentUri = URI.file(indexDocumentPath).toString();
			const variablesDocumentPath = path
				.resolve("variables.scss")
				.toLowerCase();
			const variablesDocumentUri = URI.file(variablesDocumentPath).toString();

			const storage = new StorageService();
			const settings = helpers.makeSettings();
			const scanner = new ScannerService(storage, settings);

			fileExistsStub.resolves(true);
			readFileStub.onFirstCall().resolves('@import "variables.scss";');
			readFileStub.onSecondCall().resolves("");

			await scanner.scan([indexDocumentPath], workspaceRootUri);

			const expected = new Map([
				[indexDocumentUri, indexDocumentUri],
				[variablesDocumentUri, variablesDocumentUri],
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
			const scanner = new ScannerService(storage, settings);

			fileExistsStub.resolves(true);
			readFileStub.onFirstCall().resolves('@import "variables.scss";');
			readFileStub.onSecondCall().resolves("");

			await scanner.scan(["index.scss"], workspaceRootUri);

			const indexDocumentUri = URI.file("index.scss").toString();
			const expected = new Map([[indexDocumentUri, indexDocumentUri]]);
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
