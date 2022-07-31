import path from "path";
import { TextDocument } from "vscode-languageserver-textdocument";
import { URI } from "vscode-uri";
import { parseDocument } from "./parser";
import type { ISettings } from "./settings";
import type StorageService from "./storage";
import type { ScssImport } from "./symbols";
import {
	getSCSSRegionsDocument,
	isFileWhereScssCanBeEmbedded,
} from "./utils/embedded";
import { readFile, fileExists } from "./utils/fs";

export default class ScannerService {
	private readonly maxDepth: number;

	constructor(
		private readonly _storage: StorageService,
		private readonly _settings: ISettings,
	) {
		this.maxDepth = _settings.scannerDepth ?? 30;
	}

	public async scan(files: string[], workspaceRoot: URI): Promise<void> {
		await Promise.all(
			files.map((path) => {
				if (
					this._settings.scanImportedFiles &&
					(path.includes("/_") || path.includes("\\_"))
				) {
					// If we scan imported files (which we do by default), don't include partials in the initial scan.
					// This way we can be reasonably sure that we scan whatever index files there are _before_ we scan
					// partials which may or may not have been forwarded with a prefix.
					return;
				}

				return this.parse(path, workspaceRoot, 0);
			}),
		);
	}

	public async update(
		document: TextDocument,
		workspaceRoot: URI,
	): Promise<void> {
		const scssRegions = this.getScssRegionsOfDocument(document);
		if (!scssRegions) {
			return;
		}

		const scssDocument = await parseDocument(scssRegions, workspaceRoot);
		this._storage.set(scssDocument.uri, scssDocument);
	}

	protected async parse(
		filepath: string,
		workspaceRoot: URI,
		depth: number,
	): Promise<void> {
		// Cast to the system file path style
		filepath = path.normalize(filepath);
		const uri = URI.file(filepath).toString();

		const isExistFile = await fileExists(filepath);
		if (!isExistFile) {
			this._storage.delete(uri);
			return;
		}

		const alreadyParsed = this._storage.get(uri);
		if (alreadyParsed) {
			// The same file may be referenced by multiple other files,
			// so skip doing the parsing work if it's already been done.
			// Changes to the file are handled by the `update` method.
			return;
		}

		try {
			const content = await readFile(filepath);
			const document = TextDocument.create(uri, "scss", 1, content);
			const scssRegions = this.getScssRegionsOfDocument(document);
			if (!scssRegions) {
				return;
			}

			const scssDocument = await parseDocument(scssRegions, workspaceRoot);
			// TODO: be inspired by the way the LSP sample handles document storage and cache invalidation? Documents can be renamed, deleted.
			this._storage.set(scssDocument.uri, scssDocument);

			if (depth > this.maxDepth || !this._settings.scanImportedFiles) {
				return;
			}

			for (const symbol of scssDocument.getLinks()) {
				if (
					!symbol.link.target ||
					(symbol as ScssImport).dynamic ||
					(symbol as ScssImport).css
				) {
					continue;
				}

				try {
					await this.parse(
						URI.parse(symbol.link.target).fsPath,
						workspaceRoot,
						depth + 1,
					);
				} catch (error) {
					console.error((error as Error).message);
				}
			}
		} catch (error) {
			console.error((error as Error).message);
			// Something went wrong parsing this file. Try to parse the others.
		}
	}

	protected getScssRegionsOfDocument(
		document: TextDocument,
	): TextDocument | null {
		if (isFileWhereScssCanBeEmbedded(document.uri)) {
			const regions = getSCSSRegionsDocument(document);
			if (regions.document) {
				return regions.document;
			}

			return null;
		}

		return document;
	}
}
