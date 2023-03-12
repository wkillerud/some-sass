import { resolve, join } from "path";
import { Position, Range } from "vscode-css-languageservice";
import { TextDocument } from "vscode-languageserver-textdocument";
import { URI } from "vscode-uri";
import { createContext, useContext } from "../context-provider";
import { FileSystemProvider } from "../file-system";
import { parseDocument, type INode } from "../parser";
import { getLanguageService } from "../parser/language-service";
import type { ISettings } from "../settings";
import StorageService from "../storage";
import { TestFileSystem } from "./test-file-system";

export interface MakeDocumentOptions {
	uri?: string;
	languageId?: string;
	version?: number;
}

export async function makeDocument(
	lines: string[] | string,
	options: MakeDocumentOptions = {},
): Promise<TextDocument> {
	const text = Array.isArray(lines) ? lines.join("\n") : lines;
	const workspaceRootPath = resolve("");
	const workspaceRootUri = URI.file(workspaceRootPath);
	const uri = URI.file(join(process.cwd(), options.uri || "index.scss"));
	const document = TextDocument.create(
		uri.toString(),
		options.languageId || "scss",
		options.version || 1,
		text,
	);

	const scssDocument = await parseDocument(document, workspaceRootUri);
	const { storage } = useContext();
	storage.set(uri, scssDocument);
	return document;
}

export async function makeAst(lines: string[]): Promise<INode> {
	const document = await makeDocument(lines);
	const ls = getLanguageService();
	return ls.parseStylesheet(document) as INode;
}

export function makeSameLineRange(line = 1, start = 1, end = 1): Range {
	return Range.create(Position.create(line, start), Position.create(line, end));
}

export function makeSettings(options?: Partial<ISettings>): ISettings {
	return {
		scannerDepth: 30,
		scannerExclude: ["**/.git", "**/node_modules", "**/bower_components"],
		scanImportedFiles: true,
		suggestAllFromOpenDocument: false,
		suggestFromUseOnly: false,
		suggestFunctionsInStringContextAfterSymbols: " (+-*%",
		...options,
	};
}

export const createTestContext = (fsProvider?: FileSystemProvider): void => {
	const storage = new StorageService();
	const fs = fsProvider || new TestFileSystem(storage);

	createContext({
		storage,
		fs,
		settings: makeSettings(),
		editorSettings: {
			insertSpaces: false,
			indentSize: 2,
			tabSize: 2,
		},
		workspaceRoot: URI.parse(process.cwd()),
		clientCapabilities: {
			textDocument: {
				completion: {
					completionItem: { documentationFormat: ["markdown", "plaintext"] },
				},
				hover: {
					contentFormat: ["markdown", "plaintext"],
				},
			},
		},
	});
};
