import {
	commands,
	Position,
	Selection,
	TextEdit,
	Uri,
	window,
	workspace,
	WorkspaceFolder,
} from "vscode";
import type { FileStat, FileType } from "vscode-css-languageservice";
import {
	BaseLanguageClient,
	DocumentSelector,
	LanguageClientOptions,
	RequestType,
	RevealOutputChannelOn,
} from "vscode-languageclient";
import {
	EXTENSION_ID,
	EXTENSION_NAME,
	REQUEST_FS_FIND_FILES,
	REQUEST_FS_READ_DIRECTORY,
	REQUEST_FS_READ_FILE,
	REQUEST_FS_STAT,
} from "./constants";
import { Runtime } from "./runtime";
import { getEOL } from "./utils/string";

const output = window.createOutputChannel(EXTENSION_NAME);

export function log(message: string): void {
	output.appendLine(message);
}

export function createLanguageClientOptions(
	currentWorkspace?: WorkspaceFolder,
): LanguageClientOptions {
	let documentSelector: DocumentSelector = [
		{ scheme: "untitled", language: "css" },
		{ scheme: "untitled", language: "scss" },
		{ scheme: "untitled", language: "sass" },
		{ scheme: "untitled", language: "vue" },
		{ scheme: "untitled", language: "svelte" },
		{ scheme: "untitled", language: "astro" },
	];

	if (currentWorkspace) {
		/**
		 * The workspace path is used to separate clients in multi-workspace environment.
		 * Otherwise, each client will participate in each workspace.
		 */
		const pattern = `${currentWorkspace.uri.fsPath.replace(/\\/g, "/")}/**`;
		const webPattern = `${currentWorkspace.uri.path}**`;

		documentSelector = [
			{ scheme: "file", language: "css", pattern },
			{ scheme: "file", language: "scss", pattern },
			{ scheme: "file", language: "sass", pattern },
			{ scheme: "file", language: "vue", pattern },
			{ scheme: "file", language: "svelte", pattern },
			{ scheme: "file", language: "astro", pattern },
			{ scheme: "vscode-vfs", language: "css", pattern },
			{ scheme: "vscode-vfs", language: "scss", pattern },
			{ scheme: "vscode-vfs", language: "sass", pattern },
			{ scheme: "vscode-vfs", language: "vue", pattern },
			{ scheme: "vscode-vfs", language: "svelte", pattern },
			{ scheme: "vscode-vfs", language: "astro", pattern },
			{ scheme: "vscode-test-web", language: "css", pattern: webPattern },
			{ scheme: "vscode-test-web", language: "scss", pattern: webPattern },
			{ scheme: "vscode-test-web", language: "sass", pattern: webPattern },
			{ scheme: "vscode-test-web", language: "vue", pattern: webPattern },
			{ scheme: "vscode-test-web", language: "svelte", pattern: webPattern },
			{ scheme: "vscode-test-web", language: "astro", pattern: webPattern },
		];
	}

	const clientOptions: LanguageClientOptions = {
		documentSelector,
		synchronize: {
			configurationSection: ["somesass"],
			fileEvents: currentWorkspace
				? workspace.createFileSystemWatcher({
						baseUri: currentWorkspace.uri,
						base: currentWorkspace.uri.fsPath,
						pattern: "**/*.{css,scss,sass,vue,svelte,astro}",
					})
				: undefined,
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

export namespace FsReadDirectoryRequest {
	export const type: RequestType<string, [string, FileType][], any> =
		new RequestType(REQUEST_FS_READ_DIRECTORY);
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
	client.onRequest(FsStatRequest.type, (uriString) => {
		const uri = Uri.parse(uriString);
		if (uri.scheme === "file" && runtime.fs) {
			return runtime.fs.stat(uri);
		}
		return workspace.fs.stat(uri);
	});
	client.onRequest(FsReadFileRequest.type, async (param) => {
		const uri = Uri.parse(param.uri);
		if (uri.scheme === "file" && runtime.fs) {
			return runtime.fs.readFile(uri);
		}
		const buffer = await workspace.fs.readFile(uri);
		return new runtime.TextDecoder(param.encoding).decode(buffer);
	});
	client.onRequest(FsReadDirectoryRequest.type, async (param) => {
		const uri = Uri.parse(param);
		if (uri.scheme === "file" && runtime.fs) {
			return runtime.fs.readDirectory(param);
		}
		const dir = await workspace.fs.readDirectory(uri);
		return dir;
	});
	client.onRequest(FsFindFilesRequest.type, async (param, token) => {
		if (runtime.fs) {
			const result = await runtime.fs.findFiles(param.pattern, param.exclude);
			return result.map((uri) => uri.toString());
		}

		const result = await workspace.findFiles(
			param.pattern,
			"**/node_modules/**",
			undefined,
			token,
		);
		return result.map((uri) => uri.toString());
	});
}

export async function registerCodeActionCommand(client: BaseLanguageClient) {
	const existingCommands = await commands.getCommands(true);
	if (!existingCommands.includes("_somesass.applyExtractCodeAction")) {
		commands.registerCommand(
			"_somesass.applyExtractCodeAction",
			applyExtractCodeAction,
		);
	}

	function applyExtractCodeAction(
		uri: string,
		documentVersion: number,
		textEdit: TextEdit,
	) {
		const textEditor = window.activeTextEditor;
		if (!textEditor || textEditor.document.uri.toString() !== uri) {
			return;
		}

		if (textEditor.document.version !== documentVersion) {
			window.showInformationMessage(
				"The document has changed since the extract edit was made. Please save and retry.",
			);
			return;
		}

		textEditor
			.edit((editor) => {
				editor.replace(
					client.protocol2CodeConverter.asRange(textEdit.range),
					textEdit.newText,
				);
			})
			.then((success) => {
				if (!success) {
					window.showErrorMessage(
						"Failed to extract. Consider opening an issue with steps to reproduce.",
					);
					return;
				}

				// Position where the newly extracted symbol is being used.
				const lines = textEdit.newText.split(getEOL(textEdit.newText));
				const lineOfUsage = lines[lines.length - 1];

				const _variable = lineOfUsage.indexOf("_variable");
				const _function = lineOfUsage.indexOf("_function");
				const _mixin = lineOfUsage.indexOf("_mixin");

				const newCursorPosition = new Position(
					textEdit.range.start.line + lines.length - 1,
					Math.max(_variable, _function, _mixin) + 1,
				);

				// Clear selection
				textEditor.selection = new Selection(
					newCursorPosition,
					newCursorPosition,
				);

				// Trigger rename of extracted symbol
				commands.executeCommand("editor.action.rename", [
					textEditor.document.uri,
					newCursorPosition,
				]);
			});
	}
}
