import path from 'path';

import { TextDocument } from 'vscode-languageserver-textdocument';
import { URI } from 'vscode-uri';

import type { ISettings } from '../types/settings';
import { readFile, fileExists } from '../utils/fs';
import { parseDocument } from './parser';
import type StorageService from './storage';

export default class ScannerService {
	constructor(private readonly _storage: StorageService, private readonly _settings: ISettings) {}

	public async scan(files: string[], recursive = true): Promise<void> {
		let uniqueFiles = [...new Set(files)];
		if (this._settings.scanImportedFiles) {
			// If we scan imported files (which we do by default), don't include partials in the initial scan.
			// This way we can be reasonably sure that we scan whatever index files there are _before_ we scan
			// partials which may or may not have been forwarded with a prefix.
			uniqueFiles = uniqueFiles.filter((file) => !file.includes("/_") && !file.includes("\\_"));
		}
		await Promise.all(
			uniqueFiles.map((path) => {
				return this.parse(path, recursive);
			})
		);
	}

	protected async parse(filepath: string, recursive: boolean): Promise<void> {
		// Cast to the system file path style
		filepath = path.normalize(filepath);
		const uri = URI.file(filepath).toString();

		const isExistFile = await this._fileExists(filepath);
		if (!isExistFile) {
			this._storage.delete(uri);
			return;
		}

		const alreadyParsed = this._storage.get(uri);
		if (alreadyParsed) {
			return;
		}

		const content = await this._readFile(filepath);
		const document = TextDocument.create(uri, 'scss', 1, content);
		const { symbols } = await parseDocument(document, null);

		this._storage.set(uri, { ...symbols, filepath });

		if (!recursive || !this._settings.scanImportedFiles) {
			return;
		}

		for (const symbol of symbols.imports) {
			if (symbol.dynamic || symbol.css) {
				continue;
			}

			await this.parse(symbol.filepath, recursive);
		}
	}

	protected _readFile(filepath: string): Promise<string> {
		return readFile(filepath);
	}

	protected _fileExists(filepath: string): Promise<boolean> {
		return fileExists(filepath);
	}
}
