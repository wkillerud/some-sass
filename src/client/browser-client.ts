import {
	ExtensionContext,
	ProgressLocation,
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
import { EXTENSION_ID, EXTENSION_NAME } from "../shared/constants";
import {
	createLanguageClientOptions,
	getCurrentWorkspace,
	serveFileSystemRequests,
} from "./client";

const clients: Map<string, BaseLanguageClient> = new Map<
	string,
	BaseLanguageClient
>();

export async function activate(context: ExtensionContext): Promise<void> {
	context.subscriptions.push(
		window.onDidChangeActiveTextEditor(async (editor) => {
			const workspace = getCurrentWorkspace(editor);
			if (workspace === undefined || clients.has(workspace.uri.toString())) {
				return;
			}
			await initializeClient(context, workspace);
		}),
		workspace.onDidChangeWorkspaceFolders((event) =>
			Promise.all(
				event.removed.map((folder) => clients.get(folder.uri.fsPath)?.stop()),
			),
		),
	);

	const currentWorkspace = getCurrentWorkspace(window.activeTextEditor);
	if (
		currentWorkspace === undefined ||
		clients.has(currentWorkspace.uri.toString())
	) {
		return;
	}
	await initializeClient(context, currentWorkspace);
}

async function initializeClient(
	context: ExtensionContext,
	currentWorkspace: WorkspaceFolder,
): Promise<void> {
	const clientOptions = createLanguageClientOptions(currentWorkspace);
	if (!clientOptions) {
		return;
	}

	const client: BaseLanguageClient = createWorkerLanguageClient(
		context,
		clientOptions,
	);

	clients.set(currentWorkspace.uri.toString(), client);

	return await window.withProgress(
		{
			title: `[${currentWorkspace.name}] Starting Some Sass server`,
			location: ProgressLocation.Window,
		},
		async () => {
			try {
				client.registerProposedFeatures();
				await client.start();
				serveFileSystemRequests(client, {
					TextDecoder,
				});
			} catch (error: unknown) {
				await window.showErrorMessage(
					`Client initialization failed. ${
						(error as Error).stack ?? "<empty_stack>"
					}`,
				);
			}
		},
	);
}

function createWorkerLanguageClient(
	context: ExtensionContext,
	clientOptions: LanguageClientOptions,
) {
	const serverMain = Uri.joinPath(
		context.extensionUri,
		"dist/browser-server.js",
	);
	const worker = new Worker(serverMain.toString(/* skipEncoding */ true));

	return new LanguageClient(
		EXTENSION_ID,
		EXTENSION_NAME,
		clientOptions,
		worker,
	);
}

export async function deactivate(): Promise<void> {
	await Promise.all([...clients.values()].map((client) => client.stop()));
}
