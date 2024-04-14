import {
	FileSystemProvider,
	LanguageService,
} from "@somesass/language-services";
import { TextDocument } from "vscode-languageserver-textdocument";
import { URI } from "vscode-uri";
import { useContext } from "./context-provider";
import type { ScssImport } from "./parser";
import { parseDocument } from "./parser";
import { getSCSSRegionsDocument } from "./utils/embedded";

export default class ScannerService {
	#ls: LanguageService;
	#fs: FileSystemProvider;
	#settings: { scannerDepth: number; scanImportedFiles: boolean };

	constructor(
		ls: LanguageService,
		fs: FileSystemProvider,
		settings = { scannerDepth: 30, scanImportedFiles: true },
	) {
		this.#ls = ls;
		this.#fs = fs;
		this.#settings = settings;
	}

	public async scan(files: URI[]): Promise<void> {
		const { settings } = useContext();
		await Promise.all(
			files.map((uri) => {
				const path = uri.path;
				if (
					settings.scanImportedFiles &&
					(path.includes("/_") || path.includes("\\_"))
				) {
					// If we scan imported files (which we do by default), don't include partials in the initial scan.
					// This way we can be reasonably sure that we scan whatever index files there are _before_ we scan
					// partials which may or may not have been forwarded with a prefix.
					return;
				}
				return this.parse(uri, 0);
			}),
		);

		// Populate the cache for the new language services
		await Promise.all(
			files.map((uri) => {
				if (
					this.#settings.scanImportedFiles &&
					(uri.path.includes("/_") || uri.path.includes("\\_"))
				) {
					// If we scan imported files (which we do by default), don't include partials in the initial scan.
					// This way we can be reasonably sure that we scan whatever index files there are _before_ we scan
					// partials which may or may not have been forwarded with a prefix.
					return;
				}
				return this.parse2(uri);
			}),
		);
	}

	public async update(document: TextDocument): Promise<void> {
		const scssRegions = getSCSSRegionsDocument(document);
		if (!scssRegions.document) {
			return;
		}

		const scssDocument = await parseDocument(scssRegions.document);
		const { storage } = useContext();
		storage.set(scssDocument.uri, scssDocument);
	}

	protected async parse(uri: URI, depth: number): Promise<void> {
		const { settings, storage, fs } = useContext();
		const isExistFile = await fs.exists(uri);
		if (!isExistFile) {
			storage.delete(uri);
			return;
		}

		const alreadyParsed = storage.has(uri);
		if (alreadyParsed) {
			// The same file may be referenced by multiple other files,
			// so skip doing the parsing work if it's already been done.
			// Changes to the file are handled by the `update` method.
			return;
		}

		try {
			const content = await fs.readFile(uri);
			const document = TextDocument.create(uri.toString(), "scss", 1, content);
			const scssRegions = getSCSSRegionsDocument(document);
			if (!scssRegions.document) {
				return;
			}

			const scssDocument = await parseDocument(scssRegions.document);
			storage.set(scssDocument.uri, scssDocument);

			const maxDepth = settings.scannerDepth ?? 30;
			if (depth > maxDepth || !settings.scanImportedFiles) {
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
					await this.parse(URI.parse(symbol.link.target), depth + 1);
				} catch (error) {
					console.error((error as Error).message);
				}
			}
		} catch (error) {
			console.error((error as Error).message);
			// Something went wrong parsing this file. Try to parse the others.
		}
	}

	private async parse2(file: URI, depth = 0) {
		const maxDepth = this.#settings.scannerDepth ?? 30;
		if (depth > maxDepth || !this.#settings.scanImportedFiles) {
			return;
		}

		let uri = file;
		if (file.scheme === "vscode-test-web") {
			// TODO: test-web paths includes /static/extensions/fs which causes issues.
			// The URI ends up being vscode-test-web://mount/static/extensions/fs/file.scss when it should only be vscode-test-web://mount/file.scss.
			// This should probably be landed as a bugfix somewhere upstream.
			uri = URI.parse(file.toString().replace("/static/extensions/fs", ""));
		}

		const alreadyParsed = this.#ls.hasCached(uri);
		if (alreadyParsed) {
			// The same file may be referenced by multiple other files,
			// so skip doing the parsing work if it's already been done.
			// Changes to the file are handled by the `update` method.
			return;
		}

		const content = await this.#fs.readFile(uri);
		const document = TextDocument.create(uri.toString(), "scss", 1, content);
		const scssRegions = getSCSSRegionsDocument(document);
		if (!scssRegions.document) {
			return;
		}

		this.#ls.parseStylesheet(document);

		const links = await this.#ls.findDocumentLinks(document);
		for (const link of links) {
			if (
				!link.target ||
				link.target.endsWith(".css") ||
				link.target.includes("#{") ||
				link.target.startsWith("sass:")
			) {
				continue;
			}

			try {
				await this.parse2(URI.parse(link.target), depth + 1);
			} catch {
				// do nothing
			}
		}
	}
}
