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
import {
	createLanguageClientOptions,
	getCurrentWorkspace,
	registerCodeActionCommand,
	serveFileSystemRequests,
} from "./client";
import { EXTENSION_ID, EXTENSION_NAME } from "./constants";
import { NodeFileSystem } from "./node/node-file-system";

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

	const serverModule = context.asAbsolutePath(`./dist/node-server.js`);
	const client = new LanguageClient(
		EXTENSION_ID,
		EXTENSION_NAME,
		{
			run: {
				module: serverModule,
				transport: TransportKind.ipc,
			},
			debug: {
				module: serverModule,
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
