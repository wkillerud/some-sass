import type { FileStat } from "vscode";
import { FileType } from "vscode-css-languageservice";
import type { CancellationToken } from "vscode-languageclient/node";
import type { URI } from "vscode-uri";

/**
 * API to abstract away whether or not we have direct file system access.
 */
export interface FileSystemProvider {
	exists(uri: URI): Promise<boolean>;
	findFiles(
		include: string,
		exclude?: string | string[] | null,
		maxResults?: number,
		token?: CancellationToken,
	): Promise<URI[]>;
	readFile(uri: URI, encoding?: BufferEncoding): Promise<string>;
	readDirectory(uri: string): Promise<[string, FileType][]>;
	stat(uri: URI): Promise<FileStat>;
	realPath(uri: URI): Promise<URI>;
}
