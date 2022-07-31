import path from "path";
import vscode from "vscode";
import { LanguageClient, TransportKind } from "vscode-languageclient/node";
import { EXTENSION_ID, EXTENSION_NAME } from "../shared/constants";
import { buildClientOptions } from "./client";

const EXTENSION_SERVER_MODULE_PATH = path.join(__dirname, "./node-server.js");

const clients: Map<string, LanguageClient> = new Map<string, LanguageClient>();

export async function activate(
	context: vscode.ExtensionContext,
): Promise<void> {
	context.subscriptions.push(
		vscode.workspace.onDidChangeWorkspaceFolders(
			changeWorkspaceFoldersEventHandler,
		),
		vscode.window.onDidChangeActiveTextEditor(
			changeActiveTextEditorEventHandler,
		),
	);

	await changeActiveTextEditorEventHandler(vscode.window.activeTextEditor);
}

export async function deactivate(): Promise<void> {
	await Promise.all([...clients.values()].map((client) => client.stop()));
}

async function changeWorkspaceFoldersEventHandler(
	event: vscode.WorkspaceFoldersChangeEvent,
): Promise<void> {
	await Promise.all(
		event.removed.map((folder) => clients.get(folder.uri.fsPath)?.stop()),
	);
}

async function changeActiveTextEditorEventHandler(
	editor: vscode.TextEditor | undefined,
): Promise<void> {
	const document = editor?.document;
	const uri = document?.uri;

	/**
	 * Here the `scheme` field may not be `file` when the active window is a panel like `output`.
	 * The plugin only works with files, so other types of editors are ignored.
	 */
	if (uri?.scheme !== "file") {
		return;
	}

	const workspace = vscode.workspace.getWorkspaceFolder(uri);

	if (workspace === undefined || clients.has(workspace.uri.toString())) {
		return;
	}

	await initializeClient(workspace);
}

async function initializeClient(
	workspace: vscode.WorkspaceFolder,
): Promise<LanguageClient> {
	const client = new LanguageClient(
		EXTENSION_ID,
		EXTENSION_NAME,
		{
			run: {
				module: EXTENSION_SERVER_MODULE_PATH,
				transport: TransportKind.ipc,
			},
			debug: {
				module: EXTENSION_SERVER_MODULE_PATH,
				transport: TransportKind.ipc,
				options: {
					execArgv: ["--nolazy", "--inspect=6006"],
				},
			},
		},
		buildClientOptions(workspace.uri),
	);

	clients.set(workspace.uri.toString(), client);

	return vscode.window.withProgress(
		{
			title: `[${workspace.name}] Starting SCSS IntelliSense server`,
			location: vscode.ProgressLocation.Window,
		},
		async () => {
			try {
				await client.start();
			} catch (error: unknown) {
				await vscode.window.showErrorMessage(
					`Client initialization failed. ${
						(error as Error).stack ?? "<empty_stack>"
					}`,
				);
			}

			return client;
		},
	);
}
