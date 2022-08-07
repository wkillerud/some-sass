import { TextEditor, Uri, window, workspace, WorkspaceFolder } from "vscode";
import { FileStat } from "vscode-css-languageservice";
import {
	BaseLanguageClient,
	LanguageClientOptions,
	RequestType,
	RevealOutputChannelOn,
} from "vscode-languageclient";
import {
	EXTENSION_ID,
	REQUEST_FS_FIND_FILES,
	REQUEST_FS_READ_FILE,
	REQUEST_FS_STAT,
} from "../shared/constants";
import { Runtime } from "./runtime";

export function getCurrentWorkspace(
	editor: TextEditor | undefined,
): WorkspaceFolder | undefined {
	if (!editor) {
		return;
	}

	const uri = editor.document.uri;
	if (uri.scheme !== "file") {
		/**
		 * Here the `scheme` field may not be `file` when the active window is a panel like `output`.
		 * The plugin only works with files, so other types of editors are ignored.
		 */
		return;
	}

	return workspace.getWorkspaceFolder(uri);
}

export function createLanguageClientOptions(
	currentWorkspace: WorkspaceFolder,
): LanguageClientOptions | undefined {
	/**
	 * The workspace path is used to separate clients in multi-workspace environment.
	 * Otherwise, each client will participate in each workspace.
	 */
	const pattern = `${currentWorkspace.uri.fsPath.replace(/\\/g, "/")}/**`;

	const documentSelector = [
		{ scheme: "file", language: "scss", pattern },
		{ scheme: "file", language: "vue", pattern },
		{ scheme: "file", language: "svelte", pattern },
		{ scheme: "file", language: "astro", pattern },
	];

	const clientOptions: LanguageClientOptions = {
		documentSelector,
		synchronize: {
			configurationSection: ["somesass"],
			fileEvents: workspace.createFileSystemWatcher({
				baseUri: currentWorkspace.uri,
				base: currentWorkspace.uri.fsPath,
				pattern: "**/*.scss",
			}),
		},
		initializationOptions: {
			workspace: currentWorkspace.uri.fsPath,
			settings: workspace.getConfiguration("somesass", currentWorkspace),
		},
		diagnosticCollectionName: EXTENSION_ID,
		outputChannel: window.createOutputChannel(EXTENSION_ID),
		// Don't open the output console (very annoying) in case of error
		revealOutputChannelOn: RevealOutputChannelOn.Never,
	};

	return clientOptions;
}

export namespace FsFindFilesRequest {
	export const type: RequestType<
		{ pattern: string; exclude: string[] },
		Uri[],
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

export namespace FsStatRequest {
	export const type: RequestType<string, FileStat, any> = new RequestType(
		REQUEST_FS_STAT,
	);
}

export function serveFileSystemRequests(
	client: BaseLanguageClient,
	runtime: Runtime,
) {
	client.onRequest(FsStatRequest.type, (uriString: string) => {
		const uri = Uri.parse(uriString);
		if (uri.scheme === "file" && runtime.fs) {
			return runtime.fs.stat(uri);
		}
		return workspace.fs.stat(uri);
	});
	client.onRequest(
		FsReadFileRequest.type,
		async (param: { uri: string; encoding?: string }) => {
			const uri = Uri.parse(param.uri);
			if (uri.scheme === "file" && runtime.fs) {
				return runtime.fs.readFile(uri);
			}
			const buffer = await workspace.fs.readFile(uri);
			return new runtime.TextDecoder(param.encoding).decode(buffer);
		},
	);
	client.onRequest(
		FsFindFilesRequest.type,
		async (param: { pattern: string; exclude: string[] }) => {
			if (runtime.fs) {
				return runtime.fs.findFiles(param.pattern, param.exclude);
			}
			return workspace.findFiles(param.pattern, "**/node_modules/**");
		},
	);
}
