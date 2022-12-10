import { join } from "path";
import {
	window,
	workspace,
	ExtensionContext,
	WorkspaceFolder,
	ProgressLocation,
} from "vscode";
import {
	BaseLanguageClient,
	LanguageClient,
	TransportKind,
} from "vscode-languageclient/node";
import { EXTENSION_ID, EXTENSION_NAME } from "../shared/constants";
import { NodeFileSystem } from "../shared/node-file-system";
import {
	createLanguageClientOptions,
	getCurrentWorkspace,
	registerCodeActionCommand,
	serveFileSystemRequests,
} from "./client";

const serverModulePath = join(__dirname, "./node-server.js");
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
			await initializeClient(workspace);
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
	await initializeClient(currentWorkspace);
}

async function initializeClient(
	currentWorkspace: WorkspaceFolder,
): Promise<void> {
	const clientOptions = createLanguageClientOptions(currentWorkspace);
	if (!clientOptions) {
		return;
	}

	const client = new LanguageClient(
		EXTENSION_ID,
		EXTENSION_NAME,
		{
			run: {
				module: serverModulePath,
				transport: TransportKind.ipc,
			},
			debug: {
				module: serverModulePath,
				transport: TransportKind.ipc,
				options: {
					execArgv: ["--nolazy", "--inspect=6006"],
				},
			},
		},
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
					fs: new NodeFileSystem(),
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
}

export async function deactivate(): Promise<void> {
	await Promise.all([...clients.values()].map((client) => client.stop()));
}
