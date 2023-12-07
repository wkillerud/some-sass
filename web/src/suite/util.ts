import * as vscode from "vscode";

export function sleep(ms = 1000): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getDocUri(path: string): vscode.Uri {
	return vscode.Uri.from({
		scheme: "vscode-test-web",
		authority: "mount",
		path: `/${path}`,
	});
}

export async function showFile(docUri: vscode.Uri) {
	const doc = await vscode.workspace.openTextDocument(docUri);
	return vscode.window.showTextDocument(doc);
}

/**
 * Line and Char as shown in lowerright of VS Code
 */
export function position(line: number, char: number) {
	return new vscode.Position(line - 1, char - 1);
}

export function sameLineRange(
	line: number,
	startChar: number,
	endChar: number,
) {
	return new vscode.Range(position(line, startChar), position(line, endChar));
}

export function sameLineLocation(
	uri: vscode.Uri,
	line: number,
	startChar: number,
	endChar: number,
) {
	return new vscode.Location(uri, sameLineRange(line, startChar, endChar));
}
