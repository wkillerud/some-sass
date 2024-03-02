import { TextDocument } from "vscode-languageserver-textdocument";
import { URI } from "vscode-uri";
import { useContext } from "./context-provider";
import type { ScssImport } from "./parser";
import { parseDocument } from "./parser";
import { getSCSSRegionsDocument } from "./utils/embedded";

export default class ScannerService {
	public async scan(files: URI[], workspaceRoot: URI): Promise<void> {
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
				return this.parse(uri, workspaceRoot, 0);
			}),
		);
	}

	public async update(
		document: TextDocument,
		workspaceRoot: URI,
	): Promise<void> {
		const scssRegions = getSCSSRegionsDocument(document);
		if (!scssRegions.document) {
			return;
		}

		const scssDocument = await parseDocument(
			scssRegions.document,
			workspaceRoot,
		);
		const { storage } = useContext();
		storage.set(scssDocument.uri, scssDocument);
	}

	protected async parse(
		uri: URI,
		workspaceRoot: URI,
		depth: number,
	): Promise<void> {
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

			const scssDocument = await parseDocument(
				scssRegions.document,
				workspaceRoot,
			);
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
}
