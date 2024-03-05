import { URI, FileType } from "@somesass/language-server-types";
import {
	type LanguageService,
	type FileSystemProvider as CSSFileSystemProvider,
	getSCSSLanguageService,
} from "vscode-css-languageservice";
import { useContext } from "../context-provider";

let ls: LanguageService;

export function getLanguageService(): LanguageService {
	if (ls) {
		return ls;
	}

	const { fs, clientCapabilities } = useContext();

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

	ls = getSCSSLanguageService({ fileSystemProvider, clientCapabilities });

	ls.configure({
		validate: false,
	});

	return ls;
}
