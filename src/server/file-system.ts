import type { FileStat } from "vscode-css-languageservice";
import type { CancellationToken, GlobPattern } from "vscode-languageserver";
import type { URI } from "vscode-uri";

/**
 * API to abstract away whether or not we have direct file system access.
 */
export interface FileSystemProvider {
	exists(uri: URI): Promise<boolean>;
	findFiles(
		include: GlobPattern,
		exclude?: GlobPattern | GlobPattern[] | null,
		maxResults?: number,
		token?: CancellationToken,
	): Promise<URI[]>;
	readFile(uri: URI): Promise<string>;
	stat(uri: URI): Promise<FileStat>;
	realPath(uri: URI): Promise<string>;
}
