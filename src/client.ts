import path from 'path';

import vscode from 'vscode';
import { LanguageClient, TransportKind, RevealOutputChannelOn } from 'vscode-languageclient/node';

import { EXTENSION_ID, EXTENSION_NAME } from './constants';

import type { LanguageClientOptions, ServerOptions } from 'vscode-languageclient/node';
import type { URI } from 'vscode-uri';

const EXTENSION_SERVER_MODULE_PATH = path.join(__dirname, './unsafe/server.js');

const clients: Map<string, LanguageClient> = new Map<string, LanguageClient>();

export async function activate(context: vscode.ExtensionContext): Promise<void> {
	context.subscriptions.push(
		vscode.workspace.onDidChangeWorkspaceFolders(changeWorkspaceFoldersEventHandler),
		vscode.window.onDidChangeActiveTextEditor(changeActiveTextEditorEventHandler),
	);

	await changeActiveTextEditorEventHandler(vscode.window.activeTextEditor);
}

export async function deactivate(): Promise<void> {
	await Promise.all([...clients.values()].map((client) => client.stop()));
}

async function changeWorkspaceFoldersEventHandler(event: vscode.WorkspaceFoldersChangeEvent): Promise<void> {
	await Promise.all(event.removed.map((folder) => clients.get(folder.uri.fsPath)?.stop()));
}

async function changeActiveTextEditorEventHandler(editor: vscode.TextEditor | undefined): Promise<void> {
	const document = editor?.document;
	const uri = document?.uri;

	/**
	 * Here the `scheme` field may not be `file` when the active window is a panel like `output`.
	 * The plugin only works with files, so other types of editors are ignored.
	 */
	if (uri?.scheme !== 'file') {
		return;
	}

	const workspace = vscode.workspace.getWorkspaceFolder(uri);

	if (workspace === undefined || clients.has(workspace.uri.toString())) {
		return;
	}

	await initializeClient(workspace);
}

async function initializeClient(workspace: vscode.WorkspaceFolder): Promise<LanguageClient> {
	const client = buildClient(workspace.uri);

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
				await vscode.window.showErrorMessage(`Client initialization failed. ${(error as Error).stack ?? '<empty_stack>'}`);
			}

			return client;
		},
	);
}

function buildClient(workspace: URI): LanguageClient {
	return new LanguageClient(EXTENSION_ID, EXTENSION_NAME, buildServerOptions(), buildClientOptions(workspace));
}

function buildServerOptions(): ServerOptions {
	return {
		run: {
			module: EXTENSION_SERVER_MODULE_PATH,
			transport: TransportKind.ipc,
		},
		debug: {
			module: EXTENSION_SERVER_MODULE_PATH,
			transport: TransportKind.ipc,
			options: {
				execArgv: ['--nolazy', '--inspect=6006'],
			},
		},
	};
}

function buildClientOptions(workspace: URI): LanguageClientOptions {
	/**
	 * The workspace path is used to separate clients in multi-workspace environment.
	 * Otherwise, each client will participate in each workspace.
	 */
	const pattern = `${workspace.fsPath.replace(/\\/g, '/')}/**`;

	return {
		documentSelector: [
			{ scheme: 'file', language: 'scss', pattern },
			{ scheme: 'file', language: 'vue', pattern },
			{ scheme: 'file', language: 'svelte', pattern },
		],
		synchronize: {
			configurationSection: ['somesass'],
			fileEvents: vscode.workspace.createFileSystemWatcher({
				baseUri: workspace,
				base: workspace.fsPath,
				pattern: '**/*.scss',
			}),
		},
		initializationOptions: {
			workspace: workspace.fsPath,
			settings: vscode.workspace.getConfiguration('somesass', workspace),
		},
		diagnosticCollectionName: EXTENSION_ID,
		outputChannel: vscode.window.createOutputChannel(EXTENSION_ID),
		// Don't open the output console (very annoying) in case of error
		revealOutputChannelOn: RevealOutputChannelOn.Never,
	};
}
