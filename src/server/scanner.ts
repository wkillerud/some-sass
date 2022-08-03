import { TextDocument } from "vscode-languageserver-textdocument";
import { URI } from "vscode-uri";
import type { FileSystemProvider } from "../shared/file-system";
import type { ScssImport } from "./parser";
import { parseDocument } from "./parser";
import type { ISettings } from "./settings";
import type StorageService from "./storage";
import {
	getSCSSRegionsDocument,
	isFileWhereScssCanBeEmbedded,
} from "./utils/embedded";

export default class ScannerService {
	private readonly maxDepth: number;
	private readonly storage: StorageService;
	private readonly fs: FileSystemProvider;
	private readonly settings: ISettings;

	constructor(
		storage: StorageService,
		fs: FileSystemProvider,
		settings: ISettings,
	) {
		this.storage = storage;
		this.fs = fs;
		this.settings = settings;
		this.maxDepth = settings.scannerDepth ?? 30;
	}

	public async scan(files: URI[], workspaceRoot: URI): Promise<void> {
		await Promise.all(
			files.map((uri) => {
				const path = uri.path;
				if (
					this.settings.scanImportedFiles &&
					(path.includes("/_") || path.includes("\\_"))
				) {
					// If we scan imported files (which we do by default), don't include partials in the initial scan.
					// This way we can be reasonably sure that we scan whatever index files there are _before_ we scan
					// partials which may or may not have been forwarded with a prefix.
					return;
				}
				return this.parse(uri, workspaceRoot, 0);
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

		const scssDocument = await parseDocument(
			scssRegions,
			workspaceRoot,
			this.fs,
		);
		this.storage.set(scssDocument.uri, scssDocument);
	}

	protected async parse(
		uri: URI,
		workspaceRoot: URI,
		depth: number,
	): Promise<void> {
		const isExistFile = await this.fs.exists(uri);
		if (!isExistFile) {
			this.storage.delete(uri);
			return;
		}

		const alreadyParsed = this.storage.get(uri);
		if (alreadyParsed) {
			// The same file may be referenced by multiple other files,
			// so skip doing the parsing work if it's already been done.
			// Changes to the file are handled by the `update` method.
			return;
		}

		try {
			const content = await this.fs.readFile(uri);
			const document = TextDocument.create(uri.toString(), "scss", 1, content);
			const scssRegions = this.getScssRegionsOfDocument(document);
			if (!scssRegions) {
				return;
			}

			const scssDocument = await parseDocument(
				scssRegions,
				workspaceRoot,
				this.fs,
			);
			// TODO: be inspired by the way the LSP sample handles document storage and cache invalidation? Documents can be renamed, deleted.
			this.storage.set(scssDocument.uri, scssDocument);

			if (depth > this.maxDepth || !this.settings.scanImportedFiles) {
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
						URI.parse(symbol.link.target),
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
