import { promises } from "fs";
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
		try {
			const stats = await promises.stat(uri.fsPath);
			let type = FileType.Unknown;
			if (stats.isFile()) {
				type = FileType.File;
			} else if (stats.isDirectory()) {
				type = FileType.Directory;
			} else if (stats.isSymbolicLink()) {
				type = FileType.SymbolicLink;
			}

			return {
				type,
				ctime: stats.ctime.getTime(),
				mtime: stats.mtime.getTime(),
				size: stats.size,
			};
		} catch (e) {
			return {
				type: FileType.Unknown,
				ctime: -1,
				mtime: -1,
				size: -1,
			};
		}
	}

	readFile(uri: URI) {
		const doc = this.storage.get(uri);
		return Promise.resolve(doc?.getText() || "");
	}

	async readDirectory(uri: string): Promise<[string, FileType][]> {
		const dir = await promises.readdir(uri);
		const result: [string, FileType][] = [];
		for (const file of dir) {
			try {
				const stats = await this.stat(Utils.joinPath(URI.parse(uri), file));
				result.push([file, stats.type]);
			} catch (e) {
				result.push([file, FileType.Unknown]);
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
