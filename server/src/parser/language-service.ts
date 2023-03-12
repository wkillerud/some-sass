import { FileType, getSCSSLanguageService } from "vscode-css-languageservice";
import type {
	LanguageService,
	FileSystemProvider as CSSFileSystemProvider,
} from "vscode-css-languageservice";
import { ClientCapabilities } from "vscode-languageserver";
import { URI } from "vscode-uri";
import type { FileSystemProvider } from "../file-system";

export function getLanguageService(
	fs: FileSystemProvider,
	clientCapabilities: ClientCapabilities,
): LanguageService {
	const fileSystemProvider: CSSFileSystemProvider = {
		readDirectory(uri) {
			return fs.readDirectory(uri);
		},
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

	const ls = getSCSSLanguageService({ fileSystemProvider, clientCapabilities });

	ls.configure({
		validate: false,
	});

	return ls;
}
