'use strict';

import assert from 'assert';
import path from 'path';
import fs from 'fs';

import sinon from 'sinon';
import { Stats } from '@nodelib/fs.macchiato';

import StorageService from '../../services/storage';
import ScannerService from '../../services/scanner';
import * as fsUtils from '../../utils/fs';
import * as helpers from '../helpers';
import { URI } from 'vscode-uri';

describe('Services/Scanner', () => {
	describe('.scan', () => {
		let statStub: sinon.SinonStub;
		let fileExistsStub: sinon.SinonStub;
		let readFileStub: sinon.SinonStub;

		beforeEach(() => {
			statStub = sinon.stub(fs, 'stat').yields(null, new Stats());
			fileExistsStub = sinon.stub(fsUtils, 'fileExists');
			readFileStub = sinon.stub(fsUtils, 'readFile');
		});

		afterEach(() => {
			statStub.restore();
			fileExistsStub.restore();
			readFileStub.restore();
		});

		it('should find files and update cache', async () => {
			const workspaceRootPath = path.resolve('');
			const workspaceRootUri = URI.file(workspaceRootPath);
			const indexDocumentPath = path.resolve('index.scss').toLowerCase();
			const indexDocumentUri = URI.file(indexDocumentPath).toString();
			const variablesDocumentPath = path.resolve('variables.scss').toLowerCase();
			const variablesDocumentUri = URI.file(variablesDocumentPath).toString();

			const storage = new StorageService();
			const settings = helpers.makeSettings();
			const scanner = new ScannerService(storage, settings);

			fileExistsStub.resolves(true);
			readFileStub.onFirstCall().resolves('$name: value;');
			readFileStub.onSecondCall().resolves('');

			await scanner.scan([indexDocumentPath, variablesDocumentPath], workspaceRootUri);

			const expected = new Map([
				[indexDocumentUri, indexDocumentUri],
				[variablesDocumentUri, variablesDocumentUri]
			]);
			assert.deepStrictEqual(storage.keys(), expected.keys());
			assert.strictEqual(storage.get(indexDocumentUri)?.variables.size, 1);

			assert.strictEqual(fileExistsStub.callCount, 2, "File exists was not called twice");
			assert.strictEqual(readFileStub.callCount, 2, "Read file was not called twice");
		});

		it('should find file and imported files', async () => {
			const workspaceRootPath = path.resolve('');
			const workspaceRootUri = URI.file(workspaceRootPath);
			const indexDocumentPath = path.resolve('index.scss').toLowerCase();
			const indexDocumentUri = URI.file(indexDocumentPath).toString();
			const variablesDocumentPath = path.resolve('variables.scss').toLowerCase();
			const variablesDocumentUri = URI.file(variablesDocumentPath).toString();

			const storage = new StorageService();
			const settings = helpers.makeSettings();
			const scanner = new ScannerService(storage, settings);

			fileExistsStub.resolves(true);
			readFileStub.onFirstCall().resolves('@import "variables.scss";');
			readFileStub.onSecondCall().resolves('');

			await scanner.scan([indexDocumentPath], workspaceRootUri);

			const expected = new Map([
					[indexDocumentUri, indexDocumentUri],
					[variablesDocumentUri, variablesDocumentUri]
			]);
			assert.deepStrictEqual(storage.keys(), expected.keys());

			assert.strictEqual(fileExistsStub.callCount, 3, "File exists was not called three times"); // Scanner only calls twice, but parser does as well
			assert.strictEqual(readFileStub.callCount, 2, "Read file was not called twice");
		});

		it('should do not find imported files when it not required', async () => {
			const workspaceRootPath = path.resolve('');
			const workspaceRootUri = URI.file(workspaceRootPath);

			const storage = new StorageService();
			const settings = helpers.makeSettings({ scanImportedFiles: false });
			const scanner = new ScannerService(storage, settings);

			fileExistsStub.resolves(true);
			readFileStub.onFirstCall().resolves('@import "variables.scss";');
			readFileStub.onSecondCall().resolves('');

			await scanner.scan(['index.scss'], workspaceRootUri);

			const indexDocumentUri = URI.file('index.scss').toString();
			const expected = new Map([
				[indexDocumentUri, indexDocumentUri],
			]);
			assert.deepStrictEqual(storage.keys(), expected.keys());

			assert.strictEqual(fileExistsStub.callCount, 2, "File exists was not called twice");  // Scanner only calls once, but parser does as well
			assert.strictEqual(readFileStub.callCount, 1, "Read file was not called once");
		});
	});
});
