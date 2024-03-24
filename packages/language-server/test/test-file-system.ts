import { FileStat, FileType } from "vscode-css-languageservice";
import { URI, Utils } from "vscode-uri";
import type { FileSystemProvider } from "../src/file-system";
import type StorageService from "../src/storage";

export class TestFileSystem implements FileSystemProvider {
	private readonly storage: StorageService;

	constructor(storage: StorageService) {
		this.storage = storage;
	}

	findFiles() {
		return Promise.resolve(
			[...this.storage.keys()].map((key) => URI.parse(key)),
		);
	}

	async stat(uri: URI): Promise<FileStat> {
		const file = this.storage.get(uri.toString());
		let type = FileType.Unknown;
		if (file) {
			type = FileType.File;
		} else {
			type = FileType.Directory;
		}

		const now = new Date();
		return {
			type,
			ctime: now.getTime(),
			mtime: now.getTime(),
			size: file?.getText()?.length || 0,
		};
	}

	readFile(uri: URI) {
		const doc = this.storage.get(uri);
		return Promise.resolve(doc?.getText() || "");
	}

	async readDirectory(uri: URI): Promise<[URI, FileType][]> {
		const dir = [...this.storage.keys()].filter((furi) =>
			furi.startsWith(uri.fsPath),
		);
		const result: [URI, FileType][] = [];
		for (const file of dir) {
			const furi = Utils.joinPath(uri, file);
			try {
				const stats = await this.stat(furi);
				result.push([furi, stats.type]);
			} catch (e) {
				result.push([furi, FileType.Unknown]);
			}
		}
		return result;
	}

	exists(uri: URI) {
		return Promise.resolve(Boolean(this.storage.get(uri)));
	}

	realPath(uri: URI) {
		return Promise.resolve(uri);
	}
}
