import fs from "fs";
import fg from "fast-glob";
import { FileStat, FileType } from "vscode-css-languageservice";
import { URI } from "vscode-uri";
import type { FileSystemProvider } from "./file-system";

export class NodeFileSystem implements FileSystemProvider {
	async findFiles(pattern: string): Promise<URI[]> {
		const matches = await fg(pattern, {
			absolute: true,
			dot: true,
			suppressErrors: true,
		});
		const result = matches.map((fsPath) => URI.file(fsPath));
		return result;
	}

	async exists(uri: URI): Promise<boolean> {
		try {
			await fs.promises.access(
				uri.fsPath,
				fs.constants.R_OK | fs.constants.W_OK,
			);
			return true;
		} catch {
			return false;
		}
	}

	existsSync(uri: URI): boolean {
		return fs.existsSync(uri.fsPath);
	}

	readFile(uri: URI): Promise<string> {
		return fs.promises.readFile(uri.fsPath, "utf8");
	}

	realPath(uri: URI): Promise<string> {
		return fs.promises.realpath(uri.fsPath);
	}

	async stat(uri: URI): Promise<FileStat> {
		const stats = await fs.promises.stat(uri.fsPath);
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
