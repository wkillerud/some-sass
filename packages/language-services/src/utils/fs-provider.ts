import type { FileSystemProvider as CSSFileSystemProvider } from "vscode-css-languageservice";
import { FileType, FileSystemProvider, URI } from "../language-services-types";

export function mapFsProviders(
	ours: FileSystemProvider,
): CSSFileSystemProvider {
	const theirs: CSSFileSystemProvider = {
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
		async readDirectory(uri: string) {
			const dir = await ours.readDirectory(URI.parse(uri));
			return dir.map(([uri, info]) => [uri.toString(), info]);
		},
	};
	return theirs;
}
