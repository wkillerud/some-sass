import {
	FileType,
	FileSystemProvider,
	URI,
} from "@somesass/language-server-types";
import type { FileSystemProvider as CSSFileSystemProvider } from "vscode-css-languageservice";

export function mapFsProviders(
	ours: FileSystemProvider,
): CSSFileSystemProvider {
	const theirs = {
		async stat(uri: string) {
			try {
				return await ours.stat(URI.parse(uri));
			} catch (error) {
				if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
					throw error;
				}
				return {
					type: FileType.Unknown,
					ctime: -1,
					mtime: -1,
					size: -1,
				};
			}
		},
		readDirectory(uri: string) {
			return ours.readDirectory(uri);
		},
	};
	return theirs;
}
