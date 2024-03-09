import {
	URI,
	FileType,
	LanguageService,
	FileSystemProvider,
} from "@somesass/language-server-types";
import { useContext } from "../context-provider";

let ls: LanguageService;

export function getLanguageService(): LanguageService {
	if (ls) {
		return ls;
	}

	const { fs, clientCapabilities } = useContext();

	const fileSystemProvider: FileSystemProvider = {
		readDirectory(uri) {
			return fs.readDirectory(uri);
		},
		async stat(uri: URI) {
			try {
				return await fs.stat(uri);
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
