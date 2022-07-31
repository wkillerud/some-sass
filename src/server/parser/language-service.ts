import { FileType, getSCSSLanguageService } from "vscode-css-languageservice";
import type {
	LanguageService,
	FileSystemProvider,
} from "vscode-css-languageservice";
import { URI } from "vscode-uri";
import { statFile } from "../node-fs";

const fileSystemProvider: FileSystemProvider = {
	async stat(uri: string) {
		const filePath = URI.parse(uri).fsPath;

		try {
			const stats = await statFile(filePath);

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
};

const ls = getSCSSLanguageService({ fileSystemProvider });

ls.configure({
	validate: false,
});

export function getLanguageService(): LanguageService {
	return ls;
}
