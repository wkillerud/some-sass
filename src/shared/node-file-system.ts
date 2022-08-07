import { promises, constants, existsSync } from "fs";
import * as fg from "fast-glob";
import { FileStat, FileType } from "vscode-css-languageservice";
import { URI } from "vscode-uri";
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

	existsSync(uri: URI): boolean {
		return existsSync(uri.fsPath);
	}

	readFile(uri: URI, encoding: BufferEncoding = "utf-8"): Promise<string> {
		return promises.readFile(uri.fsPath, encoding);
	}

	realPath(uri: URI): Promise<string> {
		return promises.realpath(uri.fsPath);
	}

	async stat(uri: URI): Promise<FileStat> {
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
	}
}
