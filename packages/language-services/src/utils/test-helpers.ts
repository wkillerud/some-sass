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
		const text = Array.isArray(lines) ? lines.join("\n") : lines;
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
		const doc = this.storage.get(uri.toString());
		return Promise.resolve(doc?.getText() || "");
	}

	async readDirectory(uri: URI): Promise<[URI, FileType][]> {
		const dir = [...this.storage.keys()].filter((furi) =>
			furi.startsWith(uri.fsPath),
		);
		const result: [URI, FileType][] = [];
		for (const file of dir) {
			const furi = URI.parse(file);
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
					completionItem: { documentationFormat: ["markdown", "plaintext"] },
				},
				hover: {
					contentFormat: ["markdown", "plaintext"],
				},
			},
		},
	};
}
