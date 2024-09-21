import {
	FileSystemProvider,
	LanguageService,
} from "@somesass/language-services";
import { TextDocument } from "vscode-languageserver-textdocument";
import { URI } from "vscode-uri";
import { getSassRegionsDocument } from "./utils/embedded";

export default class WorkspaceScanner {
	#ls: LanguageService;
	#fs: FileSystemProvider;
	#settings: { scannerDepth: number; scanImportedFiles: boolean };

	constructor(
		ls: LanguageService,
		fs: FileSystemProvider,
		settings = { scannerDepth: 256, scanImportedFiles: true },
	) {
		this.#ls = ls;
		this.#fs = fs;

		this.#settings = settings;
	}

	public async scan(files: URI[]): Promise<void[]> {
		// Populate the cache for the new language services
		return Promise.all(
			files.map((uri) => {
				if (
					this.#settings.scanImportedFiles &&
					(uri.path.includes("/_") || uri.path.includes("\\_"))
				) {
					// If we scan imported files (which we do by default), don't include partials in the initial scan.
					// This way we can be reasonably sure that we scan whatever index files there are _before_ we scan
					// partials which may or may not have been forwarded with a prefix.
					return Promise.resolve();
				}
				return this.parse(uri);
			}),
		);
	}

	private async parse(file: URI, depth = 0) {
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

		try {
			let document: TextDocument | null | undefined =
				this.#ls.getCachedTextDocument(uri);

			if (!document) {
				const content = await this.#fs.readFile(uri);
				const uriString = uri.toString();

				document = getSassRegionsDocument(
					TextDocument.create(
						uriString,
						uriString.endsWith(".sass") ? "sass" : "scss",
						1,
						content,
					),
				);

				if (!document) return;
				this.#ls.parseStylesheet(document);
			}

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

				let uri = URI.parse(link.target);
				let visited: TextDocument | null | undefined =
					this.#ls.getCachedTextDocument(uri);

				if (visited) {
					// avoid infinite loop if circular references
					continue;
				}

				try {
					await this.parse(uri, depth + 1);
				} catch {
					// do nothing
				}
			}
		} catch {
			// Something went wrong parsing this file, try parsing the others
		}
	}
}
