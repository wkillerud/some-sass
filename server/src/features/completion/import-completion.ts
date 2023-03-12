import { FileType } from "vscode-css-languageservice";
import {
	type CompletionItem,
	CompletionItemKind,
	CompletionList,
	MarkupKind,
} from "vscode-languageserver";
import type { TextDocument } from "vscode-languageserver-textdocument";
import { URI, Utils } from "vscode-uri";
import { FileSystemProvider } from "../../file-system";
import { sassBuiltInModules } from "../sass-built-in-modules";
import type { CompletionContext } from "./completion-context";

export const rePartialUse = /@use ["'|](?<url>.*)["'|]?/;

export async function doImportCompletion(
	document: TextDocument,
	context: CompletionContext,
	workspaceRoot: URI,
	fileSystemProvider: FileSystemProvider,
): Promise<CompletionList> {
	const completions = CompletionList.create([], false);

	if (!rePartialUse.test(context.textBeforeWord)) {
		return completions;
	}

	const match = rePartialUse.exec(context.textBeforeWord);
	if (!match) {
		// Empty URL, provide suggestions for built-ins
		createSassBuiltInCompletionItems(completions.items);
		return completions;
	}

	const [, url] = match;
	const isPathImport =
		url.startsWith(".") || url.includes("/") || url.includes("@");
	if (!isPathImport) {
		// Don't pollute path imports with built-ins
		createSassBuiltInCompletionItems(completions.items);
	}

	// Need file system access for import completions
	if (document.uri.startsWith("file://")) {
		const moduleName = getModuleNameFromPath(url);
		if (moduleName && moduleName !== "." && moduleName !== "..") {
			const rootFolderUri = Utils.joinPath(workspaceRoot, "/").toString(true);
			const documentFolderUri = Utils.dirname(URI.parse(document.uri)).toString(
				true,
			);
			const modulePath = await resolvePathToModule(
				moduleName,
				documentFolderUri,
				rootFolderUri,
				fileSystemProvider,
			);
			if (modulePath) {
				const pathWithinModule = url.substring(moduleName.length + 1);
				const pathInsideModule = Utils.joinPath(
					URI.parse(modulePath),
					pathWithinModule,
				);
				const filesInModulePath = await fileSystemProvider.readDirectory(
					pathInsideModule.fsPath,
				);
				for (const [file, fileType] of filesInModulePath) {
					if (fileType === FileType.File && file.endsWith(".scss")) {
						let insertText = file.slice(0, -5);
						if (insertText.startsWith("_")) {
							insertText = insertText.slice(1);
						}
						completions.items.push({
							label: escapePath(file),
							insertText: escapePath(insertText),
							kind: CompletionItemKind.File,
						});
					} else if (fileType === FileType.Directory) {
						completions.items.push({
							label: `${escapePath(file)}/`,
							kind: CompletionItemKind.Folder,
							insertText: `${escapePath(file)}/`,
							command: {
								title: "Suggest",
								command: "editor.action.triggerSuggest",
							},
						});
					}
				}
			}
		}
	}

	return completions;
}

function createSassBuiltInCompletionItems(completions: CompletionItem[]): void {
	for (const [moduleName, { summary, reference }] of Object.entries(
		sassBuiltInModules,
	)) {
		completions.push({
			label: moduleName,
			documentation: {
				kind: MarkupKind.Markdown,
				value: [summary, "", `[Sass reference](${reference})`].join("\n"),
			},
		});
	}
}

function getModuleNameFromPath(modulePath: string) {
	let path = modulePath;

	// Slice away deprecated tilde import
	if (path.startsWith("~")) {
		path = path.slice(1);
	}

	const firstSlash = path.indexOf("/");
	if (firstSlash === -1) {
		return "";
	}

	// If a scoped module (starts with @) then get up until second instance of '/', or to the end of the string for root-level imports.
	if (path[0] === "@") {
		const secondSlash = path.indexOf("/", firstSlash + 1);
		if (secondSlash === -1) {
			return path;
		}
		return path.substring(0, secondSlash);
	}
	// Otherwise get until first instance of '/'
	return path.substring(0, firstSlash);
}

// Escape https://www.w3.org/TR/CSS1/#url
function escapePath(p: string) {
	return p.replace(/(\s|\(|\)|,|"|')/g, "\\$1");
}

async function resolvePathToModule(
	_moduleName: string,
	documentFolderUri: string,
	rootFolderUri: string | undefined,
	fileSystemProvider: FileSystemProvider,
): Promise<string | undefined> {
	// resolve the module relative to the document. We can't use `require` here as the code is webpacked.

	const packPath = Utils.joinPath(
		URI.parse(documentFolderUri),
		"node_modules",
		_moduleName,
		"package.json",
	);
	if (await fileExists(fileSystemProvider, packPath.fsPath)) {
		return Utils.dirname(packPath).toString(true);
	} else if (
		rootFolderUri &&
		documentFolderUri.startsWith(rootFolderUri) &&
		documentFolderUri.length !== rootFolderUri.length
	) {
		return resolvePathToModule(
			_moduleName,
			Utils.dirname(URI.parse(documentFolderUri)).toString(true),
			rootFolderUri,
			fileSystemProvider,
		);
	}
	return undefined;
}

async function fileExists(
	fileSystemProvider: FileSystemProvider,
	uri: string,
): Promise<boolean> {
	if (!fileSystemProvider) {
		return false;
	}
	try {
		const stat = await fileSystemProvider.stat(URI.parse(uri));
		if (stat.type === FileType.Unknown && stat.size === -1) {
			return false;
		}

		return true;
	} catch (err) {
		return false;
	}
}
