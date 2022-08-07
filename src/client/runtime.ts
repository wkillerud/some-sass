import { FileSystemProvider } from "../shared/file-system";

export interface Runtime {
	TextDecoder: {
		new (encoding?: string): { decode(buffer: ArrayBuffer): string };
	};
	fs?: FileSystemProvider;
}
