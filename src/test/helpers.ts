import path from "path";
import {
	getSCSSLanguageService,
	Position,
	Range,
} from "vscode-css-languageservice";
import { TextDocument } from "vscode-languageserver-textdocument";
import { URI } from "vscode-uri";
import { parseDocument } from "../server/services/parser";
import type StorageService from "../server/services/storage";
import type { INode } from "../server/types/nodes";
import type { ISettings } from "../server/types/settings";

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
	options: MakeDocumentOptions = {},
): Promise<TextDocument> {
	const workspaceRootPath = path.resolve("");
	const workspaceRootUri = URI.file(workspaceRootPath);
	const uri = URI.file(
		path.join(process.cwd(), options.uri || "index.scss"),
	).toString();
	const document = TextDocument.create(
		uri,
		options.languageId || "scss",
		options.version || 1,
		Array.isArray(lines) ? lines.join("\n") : lines,
	);
	const scssDocument = await parseDocument(document, workspaceRootUri);
	storage.set(uri, scssDocument);
	return document;
}

export async function makeAst(
	storage: StorageService,
	lines: string[],
): Promise<INode> {
	const document = await makeDocument(storage, lines);
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
		showErrors: false,
		suggestAllFromOpenDocument: false,
		suggestFromUseOnly: false,
		suggestVariables: true,
		suggestMixins: true,
		suggestFunctions: true,
		suggestFunctionsInStringContextAfterSymbols: " (+-*%",
		...options,
	};
}
