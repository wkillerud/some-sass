import { resolve, join } from "path";
import {
	LanguageServiceOptions,
	Position,
	Range,
	TextDocument,
	FileSystemProvider,
	URI,
} from "@somesass/language-services";
import { createContext, useContext } from "../src/context-provider";
import { parseDocument } from "../src/parser";
import type { ISettings } from "../src/settings";
import StorageService from "../src/storage";
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

export function makeSameLineRange(line = 1, start = 1, end = 1): Range {
	return Range.create(Position.create(line, start), Position.create(line, end));
}

export function makeSettings(options?: Partial<ISettings>): ISettings {
	return {
		scannerDepth: 30,
		scannerExclude: ["**/.git", "**/node_modules", "**/bower_components"],
		suggestionStyle: "all",
		scanImportedFiles: true,
		suggestAllFromOpenDocument: false,
		suggestFromUseOnly: false,
		suggestFunctionsInStringContextAfterSymbols: " (+-*%",
		...options,
	};
}

export const createTestLsOptions = (): LanguageServiceOptions => {
	const storage = new StorageService();
	const fileSystemProvider = new TestFileSystem(storage);

	return {
		fileSystemProvider,
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
	};
};

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
