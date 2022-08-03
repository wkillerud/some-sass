import { FileSystemProvider } from "../shared/file-system";

export interface RuntimeEnvironment {
	file?: FileSystemProvider;
}
