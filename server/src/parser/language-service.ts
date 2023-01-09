import { FileType, getSCSSLanguageService } from "vscode-css-languageservice";
import type {
	LanguageService,
	FileSystemProvider as CSSFileSystemProvider,
} from "vscode-css-languageservice";
import { URI } from "vscode-uri";
import type { FileSystemProvider } from "../file-system";

let ls: LanguageService | null = null;

export function getLanguageService(fs: FileSystemProvider): LanguageService {
	if (ls) {
		return ls;
	}

	const fileSystemProvider: CSSFileSystemProvider = {
		async stat(uri: string) {
			try {
				return await fs.stat(URI.parse(uri));
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

	ls = getSCSSLanguageService({ fileSystemProvider });

	ls.configure({
		validate: false,
	});
	return ls;
}
