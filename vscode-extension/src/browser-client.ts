import {
	ExtensionContext,
	ProgressLocation,
	TextDocument,
	Uri,
	window,
	workspace,
	WorkspaceFolder,
} from "vscode";
import {
	BaseLanguageClient,
	LanguageClient,
	LanguageClientOptions,
} from "vscode-languageclient/browser";
import {
	createLanguageClientOptions,
	registerCodeActionCommand,
	serveFileSystemRequests,
} from "./client";
import { EXTENSION_ID, EXTENSION_NAME } from "./constants";

let defaultClient: LanguageClient;
const clients: Map<string, BaseLanguageClient> = new Map<
	string,
	BaseLanguageClient
>();

let _sortedWorkspaceFolders: string[] | undefined;
function sortedWorkspaceFolders(): string[] {
	if (_sortedWorkspaceFolders === void 0) {
		_sortedWorkspaceFolders = workspace.workspaceFolders
			? workspace.workspaceFolders
					.map((folder) => {
						let result = folder.uri.toString();
						if (result.charAt(result.length - 1) !== "/") {
							result = result + "/";
						}
						return result;
					})
					.sort((a, b) => {
						return a.length - b.length;
					})
			: [];
	}
	return _sortedWorkspaceFolders;
}
workspace.onDidChangeWorkspaceFolders(
	() => (_sortedWorkspaceFolders = undefined),
);

function getOuterMostWorkspaceFolder(folder: WorkspaceFolder): WorkspaceFolder {
	const sorted = sortedWorkspaceFolders();
	for (const element of sorted) {
		let uri = folder.uri.toString();
		if (uri.charAt(uri.length - 1) !== "/") {
			uri = uri + "/";
		}
		if (uri.startsWith(element)) {
			const folder = workspace.getWorkspaceFolder(Uri.parse(element));
			if (folder) {
				return folder;
			}
		}
	}
	return folder;
}

export async function activate(context: ExtensionContext): Promise<void> {
	async function didOpenTextDocument(document: TextDocument): Promise<void> {
		if (
			document.uri.scheme !== "file" &&
			document.uri.scheme !== "untitled" &&
			document.uri.scheme !== "vscode-vfs" &&
			document.uri.scheme !== "vscode-test-web" &&
			document.languageId !== "scss" &&
			document.languageId !== "sass" &&
			document.languageId !== "vue" &&
			document.languageId !== "svelte" &&
			document.languageId !== "astro"
		) {
			return;
		}

		const uri = document.uri;
		// Untitled files go to a default client.
		if (uri.scheme === "untitled" && !defaultClient) {
			const defaultOptions = createLanguageClientOptions();
			defaultClient = createWorkerLanguageClient(context, defaultOptions);
			defaultClient.start();
			return;
		}

		let folder = workspace.getWorkspaceFolder(uri);
		// Require a workspace folder
		if (!folder) {
			return;
		}
		// If we have nested workspace folders we only start a server on the outer most workspace folder.
		folder = getOuterMostWorkspaceFolder(folder);
		if (!clients.has(folder.uri.toString())) {
			const clientOptions = createLanguageClientOptions(folder);
			const client = createWorkerLanguageClient(context, clientOptions);

			await window.withProgress(
				{
					title: `[${folder.name}] Starting Some Sass server`,
					location: ProgressLocation.Window,
				},
				async () => {
					try {
						client.registerProposedFeatures();
						await client.start();
						serveFileSystemRequests(client, {
							TextDecoder,
						});
						registerCodeActionCommand(client);
					} catch (error: unknown) {
						await window.showErrorMessage(
							`Client initialization failed. ${
								(error as Error).stack ?? "<empty_stack>"
							}`,
						);
					}
				},
			);
			client.start();
			clients.set(folder.uri.toString(), client);
		}
	}

	workspace.onDidOpenTextDocument(didOpenTextDocument);
	workspace.textDocuments.forEach(didOpenTextDocument);
	workspace.onDidChangeWorkspaceFolders((event) => {
		for (const folder of event.removed) {
			const client = clients.get(folder.uri.toString());
			if (client) {
				clients.delete(folder.uri.toString());
				client.stop();
			}
		}
	});
}

function createWorkerLanguageClient(
	context: ExtensionContext,
	clientOptions: LanguageClientOptions,
) {
	const serverMain = Uri.joinPath(context.extensionUri, "dist/browser-main.js");
	const worker = new Worker(serverMain.toString(/* skipEncoding */ true));

	return new LanguageClient(
		EXTENSION_ID,
		EXTENSION_NAME,
		clientOptions,
		worker,
	);
}

export async function deactivate(): Promise<void> {
	const promises: Thenable<void>[] = [];
	if (defaultClient) {
		promises.push(defaultClient.stop());
	}
	for (const client of clients.values()) {
		promises.push(client.stop());
	}
	return Promise.all(promises).then(() => undefined);
}
