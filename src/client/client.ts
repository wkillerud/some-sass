import vscode from "vscode";
import {
	LanguageClientOptions,
	RevealOutputChannelOn,
} from "vscode-languageclient";
import { EXTENSION_ID } from "../shared/constants";

export function buildClientOptions(
	workspace: vscode.Uri,
): LanguageClientOptions {
	/**
	 * The workspace path is used to separate clients in multi-workspace environment.
	 * Otherwise, each client will participate in each workspace.
	 */
	const pattern = `${workspace.fsPath.replace(/\\/g, "/")}/**`;

	return {
		documentSelector: [
			{ scheme: "file", language: "scss", pattern },
			{ scheme: "file", language: "vue", pattern },
			{ scheme: "file", language: "svelte", pattern },
			{ scheme: "file", language: "astro", pattern },
		],
		synchronize: {
			configurationSection: ["somesass"],
			fileEvents: vscode.workspace.createFileSystemWatcher({
				baseUri: workspace,
				base: workspace.fsPath,
				pattern: "**/*.scss",
			}),
		},
		initializationOptions: {
			workspace: workspace.fsPath,
			settings: vscode.workspace.getConfiguration("somesass", workspace),
		},
		diagnosticCollectionName: EXTENSION_ID,
		outputChannel: vscode.window.createOutputChannel(EXTENSION_ID),
		// Don't open the output console (very annoying) in case of error
		revealOutputChannelOn: RevealOutputChannelOn.Never,
	};
}
