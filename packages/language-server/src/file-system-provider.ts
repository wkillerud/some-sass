import { type FileStat, FileType } from "vscode-css-languageservice";
import { type Connection, RequestType } from "vscode-languageserver";
import { URI } from "vscode-uri";
import {
	REQUEST_FS_FIND_FILES,
	REQUEST_FS_READ_DIRECTORY,
	REQUEST_FS_READ_FILE,
	REQUEST_FS_STAT,
} from "./constants";
import { FileSystemProvider } from "./file-system";
import { RuntimeEnvironment } from "./runtime";

export namespace FsFindFilesRequest {
	export const type: RequestType<
		{ pattern: string; exclude: string[] },
		string[],
		any
	> = new RequestType(REQUEST_FS_FIND_FILES);
}

export namespace FsReadFileRequest {
	export const type: RequestType<
		{ uri: string; encoding?: string },
		string,
		any
	> = new RequestType(REQUEST_FS_READ_FILE);
}

export namespace FsReadDirectoryRequest {
	export const type: RequestType<string, [string, FileType][], any> =
		new RequestType(REQUEST_FS_READ_DIRECTORY);
}

export namespace FsStatRequest {
	export const type: RequestType<string, FileStat, any> = new RequestType(
		REQUEST_FS_STAT,
	);
}

export function getFileSystemProvider(
	connection: Connection,
	runtime: RuntimeEnvironment,
): FileSystemProvider {
	return {
		async stat(uri: URI) {
			const handler = runtime.file;
			if (handler) {
				return handler.stat(uri);
			}
			try {
				const params = uri.toString();
				const res = await connection.sendRequest(FsStatRequest.type, params);
				return res as FileStat;
			} catch (e) {
				return {
					type: FileType.Unknown,
					mtime: -1,
					ctime: -1,
					size: -1,
				};
			}
		},
		async readFile(uri: URI, encoding = "utf-8") {
			const handler = runtime.file;
			if (handler) {
				return await handler.readFile(uri);
			}

			const params = uri.toString();
			const res = await connection.sendRequest(FsReadFileRequest.type, {
				uri: params,
				encoding,
			});
			return res;
		},
		async readDirectory(uri: URI) {
			const handler = runtime.file;
			if (handler) {
				return await handler.readDirectory(uri);
			}
			const res = await connection.sendRequest(
				FsReadDirectoryRequest.type,
				uri.toString(),
			);
			return res.map(([uri, type]) => [URI.parse(uri), type]);
		},
		async findFiles(pattern, exclude) {
			const handler = runtime.file;
			if (handler) {
				return handler.findFiles(pattern, exclude);
			}

			try {
				const res = await connection.sendRequest(FsFindFilesRequest.type, {
					pattern,
					exclude,
				});
				return res.map((stringUri) => URI.parse(stringUri));
			} catch (e) {
				console.error((e as Error).message);
				return [];
			}
		},
		async exists(uri: URI) {
			const handler = runtime.file;
			if (handler) {
				return handler.exists(uri);
			}

			try {
				const params = uri.toString();
				const res = await connection.sendRequest(FsStatRequest.type, params);
				const exists = res.type !== FileType.Unknown;
				return exists;
			} catch {
				return false;
			}
		},
		realPath(uri) {
			const handler = runtime.file;
			if (handler) {
				return handler.realPath(uri);
			}
			return Promise.resolve(uri);
		},
	};
}
