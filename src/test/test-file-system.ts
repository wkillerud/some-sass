import { FileType } from "vscode-css-languageservice";
import { URI } from "vscode-uri";
import type StorageService from "../server/storage";
import type { FileSystemProvider } from "../shared/file-system";

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

	stat() {
		return Promise.resolve({
			type: FileType.Unknown,
			ctime: -1,
			mtime: -1,
			size: -1,
		});
	}

	readFile(uri: URI) {
		const doc = this.storage.get(uri);
		return Promise.resolve(doc?.getText() || "");
	}

	exists(uri: URI) {
		return Promise.resolve(Boolean(this.storage.get(uri)));
	}

	realPath(uri: URI) {
		return Promise.resolve(uri);
	}
}
