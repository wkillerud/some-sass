import { TextEditor, Uri, window, workspace, WorkspaceFolder } from "vscode";
import { FileStat } from "vscode-css-languageservice";
import {
	BaseLanguageClient,
	LanguageClientOptions,
	RequestType,
	RevealOutputChannelOn,
} from "vscode-languageclient";
import { defaultSettings, ISettings } from "../server/settings";
import {
	EXTENSION_ID,
	EXTENSION_NAME,
	REQUEST_FS_FIND_FILES,
	REQUEST_FS_READ_FILE,
	REQUEST_FS_STAT,
} from "../shared/constants";
import { Runtime } from "./runtime";

const output = window.createOutputChannel(EXTENSION_NAME);

export function log(message: string): void {
	output.appendLine(message);
}

export function getCurrentWorkspace(
	editor: TextEditor | undefined,
): WorkspaceFolder | undefined {
	if (!editor) {
		return;
	}

	const uri = editor.document.uri;
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
		{ scheme: "vscode-vfs", language: "scss", pattern },
		{ scheme: "vscode-vfs", language: "vue", pattern },
		{ scheme: "vscode-vfs", language: "svelte", pattern },
		{ scheme: "vscode-vfs", language: "astro", pattern },
	];

	const configuration = workspace.getConfiguration(
		"somesass",
		currentWorkspace,
	);

	// The browser Worker stumbles if initializationOptions is given the WorkspaceConfiguration object directly.
	// Map it to a POJSO with default settings as well so both browser and node client/server comminication will work.
	const settings: ISettings = {
		scannerDepth:
			configuration.get<number>("scannerDepth") || defaultSettings.scannerDepth,
		scannerExclude:
			configuration.get<string[]>("scannerExclude") ||
			defaultSettings.scannerExclude,
		scanImportedFiles:
			configuration.get<boolean>("scanImportedFiles") ||
			defaultSettings.scanImportedFiles,
		showErrors:
			configuration.get<boolean>("showErrors") || defaultSettings.showErrors,
		suggestAllFromOpenDocument:
			configuration.get<boolean>("suggestAllFromOpenDocument") ||
			defaultSettings.suggestAllFromOpenDocument,
		suggestFromUseOnly:
			configuration.get<boolean>("suggestFromUseOnly") ||
			defaultSettings.suggestFromUseOnly,
		suggestVariables:
			configuration.get<boolean>("suggestVariables") ||
			defaultSettings.suggestVariables,
		suggestMixins:
			configuration.get<boolean>("suggestMixins") ||
			defaultSettings.suggestMixins,
		suggestFunctions:
			configuration.get<boolean>("suggestFunctions") ||
			defaultSettings.suggestFunctions,
		suggestFunctionsInStringContextAfterSymbols:
			configuration.get<string>(
				"suggestFunctionsInStringContextAfterSymbols",
			) || defaultSettings.suggestFunctionsInStringContextAfterSymbols,
	};

	const clientOptions: LanguageClientOptions = {
		documentSelector,
		synchronize: {
			configurationSection: ["somesass"],
			fileEvents: workspace.createFileSystemWatcher({
				baseUri: currentWorkspace.uri,
				base: currentWorkspace.uri.fsPath,
				pattern: "**/*.{scss,vue,svelte,astro}",
			}),
		},
		initializationOptions: {
			workspace: currentWorkspace.uri.fsPath,
			settings,
		},
		diagnosticCollectionName: EXTENSION_ID,
		outputChannel: output,
		// Don't open the output console (very annoying) in case of error
		revealOutputChannelOn: RevealOutputChannelOn.Never,
	};

	return clientOptions;
}

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
		async (param: { pattern: string; exclude: string[] }, token) => {
			if (runtime.fs) {
				const result = await runtime.fs.findFiles(param.pattern, param.exclude);
				return result.map((uri) => uri.toString());
			}

			log("Running workspace.findFiles...");
			const result = await workspace.findFiles(
				param.pattern,
				"**/node_modules/**",
				undefined,
				token,
			);
			log("workspace.findFiles is back!");
			return result.map((uri) => uri.toString());
		},
	);
}
