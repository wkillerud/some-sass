import { EOL } from "node:os";
import { join } from "path";
import {
	LanguageServiceOptions,
	FileSystemProvider,
	URI,
	FileStat,
	FileType,
	TextDocument,
} from "../language-services-types";

class MemoryFileSystem implements FileSystemProvider {
	storage: Map<string, TextDocument>;

	constructor() {
		this.storage = new Map();
	}

	createDocument(
		lines: string[] | string,
		options: { uri?: string; languageId?: string; version?: number } = {},
	): TextDocument {
		const text = Array.isArray(lines) ? lines.join(EOL) : lines;
		const uri = URI.file(join(process.cwd(), options.uri || "index.scss"));
		const document = TextDocument.create(
			uri.toString(),
			options.languageId || "scss",
			options.version || 1,
			text,
		);
		this.storage.set(uri.toString(), document);
		return document;
	}

	findFiles() {
		return Promise.resolve([...this.storage.keys()].map((s) => URI.parse(s)));
	}

	async stat(uri: URI): Promise<FileStat> {
		try {
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
				size: file?.getText().length || 0,
			};
		} catch {
			return {
				type: FileType.Unknown,
				ctime: -1,
				mtime: -1,
				size: -1,
			};
		}
	}

	readFile(uri: URI) {
		const doc = this.storage.get(uri.toString());
		return Promise.resolve(doc?.getText() || "");
	}

	private getName(uriString: string): string {
		if (uriString.endsWith("/")) {
			uriString = uriString.slice(0, uriString.length - 1);
		}
		return uriString.substring(uriString.lastIndexOf("/") + 1);
	}

	async readDirectory(uri: URI): Promise<[string, FileType][]> {
		const toMatch = uri.toString();
		const result: [string, FileType][] = [];
		for (const file of this.storage.keys()) {
			if (!file.startsWith(toMatch)) {
				continue;
			}

			const directoryIndex = file.indexOf(toMatch);
			if (directoryIndex === -1) {
				continue;
			}

			let fileType = FileType.File;
			let name = this.getName(file);
			const subdirectoryIndex = file.indexOf("/", toMatch.length + 1);
			if (subdirectoryIndex !== -1) {
				const subdirectory = file.substring(0, subdirectoryIndex);
				const subsub = file.indexOf("/", subdirectory.length + 1);
				if (subsub !== -1) {
					// Files or folders in subdirectories should not be included
					continue;
				}

				name = this.getName(subdirectory);
				fileType = FileType.Directory;
			}

			result.push([name, fileType]);
		}
		return result;
	}

	exists(uri: URI) {
		return Promise.resolve(Boolean(this.storage.get(uri.toString())));
	}

	realPath(uri: URI) {
		return Promise.resolve(uri);
	}
}

export function getOptions(): LanguageServiceOptions & {
	fileSystemProvider: MemoryFileSystem;
} {
	const fileSystemProvider = new MemoryFileSystem();
	return {
		fileSystemProvider,
		clientCapabilities: {
			textDocument: {
				completion: {
					completionItem: {
						snippetSupport: true,
						documentationFormat: ["markdown", "plaintext"],
					},
				},
				hover: {
					contentFormat: ["markdown", "plaintext"],
				},
			},
		},
	};
}
