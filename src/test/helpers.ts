import { resolve, join } from "path";
import {
	getSCSSLanguageService,
	Position,
	Range,
} from "vscode-css-languageservice";
import { TextDocument } from "vscode-languageserver-textdocument";
import { URI } from "vscode-uri";
import type { INode } from "../server/parser";
import { parseDocument } from "../server/parser";
import type { ISettings } from "../server/settings";
import type StorageService from "../server/storage";
import type { TestFileSystem } from "./test-file-system";

const ls = getSCSSLanguageService();

ls.configure({
	validate: false,
});

export interface MakeDocumentOptions {
	uri?: string;
	languageId?: string;
	version?: number;
}

export async function makeDocument(
	storage: StorageService,
	lines: string[] | string,
	fs: TestFileSystem,
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

	const scssDocument = await parseDocument(document, workspaceRootUri, fs);

	storage.set(uri, scssDocument);
	return document;
}

export async function makeAst(
	storage: StorageService,
	lines: string[],
	fs: TestFileSystem,
): Promise<INode> {
	const document = await makeDocument(storage, lines, fs);
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
