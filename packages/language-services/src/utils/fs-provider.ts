import type { FileSystemProvider as CSSFileSystemProvider } from "@somesass/vscode-css-languageservice";
import { FileType, FileSystemProvider, URI } from "../language-services-types";

export function mapFsProviders(
	ours: FileSystemProvider,
): CSSFileSystemProvider {
	const theirs: CSSFileSystemProvider = {
		async stat(uri: string) {
			try {
				const result = await ours.stat(URI.parse(uri));
				return result;
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
			const result: [string, FileType][] = dir.map(([uri, info]) => [
				uri,
				info,
			]);
			return result;
		},
	};
	return theirs;
}
