import type { FileSystemProvider } from "./file-system";

export interface RuntimeEnvironment {
	file?: FileSystemProvider;
}
