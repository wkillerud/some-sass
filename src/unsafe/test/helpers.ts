import path from 'path';

import { TextDocument } from 'vscode-languageserver-textdocument';
import { getSCSSLanguageService, Position, Range } from 'vscode-css-languageservice';
import { URI } from 'vscode-uri';
import { parseDocument } from '../services/parser';

import type { INode } from '../types/nodes';
import type { ISettings } from '../types/settings';
import type StorageService from '../services/storage';

const ls = getSCSSLanguageService();

ls.configure({
	validate: false
});

export type MakeDocumentOptions = {
	uri?: string;
	languageId?: string;
	version?: number;
};

export async function makeDocument(storage: StorageService, lines: string | string[],  options: MakeDocumentOptions = {}): Promise<TextDocument> {
	const workspaceRootPath = path.resolve('');
	const workspaceRootUri = URI.file(workspaceRootPath);
	const uri = options.uri || URI.file(path.join(process.cwd(), 'index.scss')).toString();
	const document = TextDocument.create(
		uri,
		options.languageId || 'scss',
		options.version || 1,
		Array.isArray(lines) ? lines.join('\n') : lines
	);
	const scssDocument = await parseDocument(document, workspaceRootUri);
	storage.set(uri, scssDocument)
	return document;
}

export async function makeAst(storage: StorageService, lines: string[]): Promise<INode> {
	const document = await makeDocument(storage, lines);
	return ls.parseStylesheet(document) as INode;
}

export function makeSameLineRange(line: number = 1, start: number = 1, end: number = 1): Range {
	return Range.create(Position.create(line, start), Position.create(line, end));
}

export function makeSettings(options?: Partial<ISettings>): ISettings {
	return {
		scannerDepth: 30,
		scannerExclude: ['**/.git', '**/node_modules', '**/bower_components'],
		scanImportedFiles: true,
		showErrors: false,
		suggestAllFromOpenDocument: false,
		suggestVariables: true,
		suggestMixins: true,
		suggestFunctions: true,
		suggestFunctionsInStringContextAfterSymbols: ' (+-*%',
		...options
	};
}
