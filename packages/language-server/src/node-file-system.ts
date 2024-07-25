import { promises, constants, existsSync } from "fs";
import { type FileStat, FileType } from "@somesass/language-services";
import * as fg from "fast-glob";
import { URI, Utils } from "vscode-uri";
import type { FileSystemProvider } from "./file-system";

export class NodeFileSystem implements FileSystemProvider {
	async findFiles(
		pattern: string,
		exclude?: string | string[] | null | undefined,
	): Promise<URI[]> {
		const matches = await fg(pattern, {
			absolute: true,
			dot: true,
			suppressErrors: true,
			ignore: exclude
				? Array.isArray(exclude)
					? exclude
					: [exclude]
				: undefined,
		});
		const result = matches.map((fsPath) => URI.file(fsPath));
		return result;
	}

	async exists(uri: URI): Promise<boolean> {
		try {
			await promises.access(uri.fsPath, constants.R_OK | constants.W_OK);
			return true;
		} catch {
			return false;
		}
	}

	existsSync(path: string): boolean {
		return existsSync(path);
	}

	readFile(uri: URI, encoding: BufferEncoding = "utf-8"): Promise<string> {
		return promises.readFile(uri.fsPath, encoding);
	}

	async readDirectory(uri: URI): Promise<[string, FileType][]> {
		const dir = await promises.readdir(uri.fsPath);
		const result: [string, FileType][] = [];
		for (const name of dir) {
			try {
				const stats = await this.stat(Utils.joinPath(uri, name));
				result.push([name, stats.type]);
			} catch (e) {
				result.push([name, FileType.Unknown]);
			}
		}
		return result;
	}

	async realPath(uri: URI): Promise<URI> {
		try {
			const fsPath = await promises.realpath(uri.fsPath);
			return URI.file(fsPath);
		} catch (e) {
			// Not all links we get here point to real files or symlinks on disk.
			// Fall back to returning the same URI (#184).
			return uri;
		}
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
}
