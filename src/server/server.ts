import { FileStat, FileType } from "vscode-css-languageservice";
import { Connection, RequestType } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
	TextDocuments,
	TextDocumentSyncKind,
} from "vscode-languageserver/node";
import type {
	InitializeParams,
	InitializeResult,
} from "vscode-languageserver/node";
import { URI } from "vscode-uri";
import {
	REQUEST_FS_FIND_FILES,
	REQUEST_FS_READ_FILE,
	REQUEST_FS_STAT,
} from "../shared/constants";
import type { FileSystemProvider } from "../shared/file-system";
import { doCompletion } from "./features/completion";
import { doDiagnostics } from "./features/diagnostics/diagnostics";
import { goDefinition } from "./features/go-definition/go-definition";
import { doHover } from "./features/hover/hover";
import { provideReferences } from "./features/references";
import { doSignatureHelp } from "./features/signature-help/signature-help";
import { searchWorkspaceSymbol } from "./features/workspace-symbols/workspace-symbol";
import { RuntimeEnvironment } from "./runtime";
import ScannerService from "./scanner";
import type { ISettings } from "./settings";
import StorageService from "./storage";
import { getSCSSRegionsDocument } from "./utils/embedded";

interface InitializationOption {
	workspace: string;
	settings: ISettings;
}

export class SomeSassServer {
	private readonly connection: Connection;
	private readonly runtime: RuntimeEnvironment;

	constructor(connection: Connection, runtime: RuntimeEnvironment) {
		this.connection = connection;
		this.runtime = runtime;
	}

	public listen(): void {
		let workspaceRoot: URI;
		let settings: ISettings;
		let storageService: StorageService;
		let scannerService: ScannerService;
		let fileSystemProvider: FileSystemProvider;

		// Create a simple text document manager. The text document manager
		// _supports full document sync only
		const documents = new TextDocuments(TextDocument);

		// Make the text document manager listen on the connection
		// _for open, change and close text document events
		documents.listen(this.connection);

		// After the server has started the client sends an initilize request. The server receives
		// _in the passed params the rootPath of the workspace plus the client capabilites
		this.connection.onInitialize(
			async (params: InitializeParams): Promise<InitializeResult> => {
				const options = params.initializationOptions as InitializationOption;

				fileSystemProvider = getFileSystemProvider(
					this.connection,
					this.runtime,
				);

				workspaceRoot = URI.parse(options.workspace);
				settings = options.settings;

				return {
					capabilities: {
						textDocumentSync: TextDocumentSyncKind.Incremental,
						referencesProvider: true,
						completionProvider: {
							resolveProvider: false,
							triggerCharacters: [
								// For SassDoc annotation completion
								"@",
								" ",
								"/",

								// For @use completion
								'"',
								"'",
							],
						},
						signatureHelpProvider: {
							triggerCharacters: ["(", ",", ";"],
						},
						hoverProvider: true,
						definitionProvider: true,
						workspaceSymbolProvider: true,
					},
				};
			},
		);

		this.connection.onInitialized(async () => {
			storageService = new StorageService();
			scannerService = new ScannerService(
				storageService,
				fileSystemProvider,
				settings,
			);

			const files = await fileSystemProvider.findFiles(
				"**/*.{scss,svelte,astro,vue}",
				settings.scannerExclude,
			);

			try {
				await scannerService.scan(files, workspaceRoot);
			} catch (error) {
				if (settings.showErrors) {
					this.connection.window.showErrorMessage(String(error));
				}
			}
		});

		documents.onDidChangeContent(async (change) => {
			try {
				await scannerService.update(change.document, workspaceRoot);
			} catch (error) {
				// Something went wrong trying to parse the changed document.
				console.error((error as Error).message);
				return;
			}

			const diagnostics = await doDiagnostics(change.document, storageService);

			// Check that no new version has been made while we waited
			const latestTextDocument = documents.get(change.document.uri);
			if (
				latestTextDocument &&
				latestTextDocument.version === change.document.version
			) {
				this.connection.sendDiagnostics({
					uri: latestTextDocument.uri,
					diagnostics,
				});
			}
		});

		this.connection.onDidChangeConfiguration((params) => {
			settings = params.settings.somesass;
		});

		this.connection.onDidChangeWatchedFiles((event) => {
			const files = event.changes.map((file) => URI.parse(file.uri));
			return scannerService.scan(files, workspaceRoot);
		});

		this.connection.onCompletion((textDocumentPosition) => {
			const uri = documents.get(textDocumentPosition.textDocument.uri);
			if (uri === undefined) {
				return;
			}

			const { document, offset } = getSCSSRegionsDocument(
				uri,
				textDocumentPosition.position,
			);
			if (!document) {
				return null;
			}

			return doCompletion(document, offset, settings, storageService);
		});

		this.connection.onHover((textDocumentPosition) => {
			const uri = documents.get(textDocumentPosition.textDocument.uri);
			if (uri === undefined) {
				return;
			}

			const { document, offset } = getSCSSRegionsDocument(
				uri,
				textDocumentPosition.position,
			);
			if (!document) {
				return null;
			}

			return doHover(document, offset, storageService);
		});

		this.connection.onSignatureHelp((textDocumentPosition) => {
			const uri = documents.get(textDocumentPosition.textDocument.uri);
			if (uri === undefined) {
				return;
			}

			const { document, offset } = getSCSSRegionsDocument(
				uri,
				textDocumentPosition.position,
			);
			if (!document) {
				return null;
			}

			return doSignatureHelp(document, offset, storageService);
		});

		this.connection.onDefinition((textDocumentPosition) => {
			const uri = documents.get(textDocumentPosition.textDocument.uri);
			if (uri === undefined) {
				return;
			}

			const { document, offset } = getSCSSRegionsDocument(
				uri,
				textDocumentPosition.position,
			);
			if (!document) {
				return null;
			}

			return goDefinition(document, offset, storageService);
		});

		this.connection.onReferences((referenceParams) => {
			const uri = documents.get(referenceParams.textDocument.uri);
			if (uri === undefined) {
				return undefined;
			}

			const { document, offset } = getSCSSRegionsDocument(
				uri,
				referenceParams.position,
			);
			if (!document) {
				return null;
			}

			const options = referenceParams.context;
			return provideReferences(document, offset, storageService, options);
		});

		this.connection.onWorkspaceSymbol((workspaceSymbolParams) => {
			return searchWorkspaceSymbol(
				workspaceSymbolParams.query,
				storageService,
				workspaceRoot.toString(),
			);
		});

		this.connection.onShutdown(() => {
			storageService.clear();
		});

		this.connection.listen();
	}
}

export namespace FsFindFilesRequest {
	export const type: RequestType<
		{ pattern: string; exclude: string[] },
		string[],
		any
	> = new RequestType(REQUEST_FS_FIND_FILES);
}

export namespace FsReadFileRequest {
	export const type: RequestType<
		{ uri: string; encoding?: string },
		string,
		any
	> = new RequestType(REQUEST_FS_READ_FILE);
}

export namespace FsStatRequest {
	export const type: RequestType<string, FileStat, any> = new RequestType(
		REQUEST_FS_STAT,
	);
}

export function getFileSystemProvider(
	connection: Connection,
	runtime: RuntimeEnvironment,
): FileSystemProvider {
	return {
		async stat(uri: URI) {
			const handler = runtime.file;
			if (handler) {
				return handler.stat(uri);
			}
			try {
				const res = await connection.sendRequest(
					FsStatRequest.type,
					uri.toString(),
				);
				return res as FileStat;
			} catch (e) {
				return {
					type: FileType.Unknown,
					mtime: -1,
					ctime: -1,
					size: -1,
				};
			}
		},
		async readFile(uri: URI, encoding = "utf-8") {
			const handler = runtime.file;
			if (handler) {
				return await handler.readFile(uri);
			}
			const res = await connection.sendRequest(FsReadFileRequest.type, {
				uri: uri.toString(),
				encoding,
			});
			return res;
		},
		async findFiles(pattern, exclude) {
			const handler = runtime.file;
			if (handler) {
				return handler.findFiles(pattern, exclude);
			}

			try {
				const res = await connection.sendRequest(FsFindFilesRequest.type, {
					pattern,
					exclude,
				});
				return res.map((stringUri) => URI.parse(stringUri));
			} catch (e) {
				console.error((e as Error).message);
				return [];
			}
		},
		async exists(uri: URI) {
			const handler = runtime.file;
			if (handler) {
				return handler.exists(uri);
			}

			try {
				const res = await connection.sendRequest(
					FsStatRequest.type,
					uri.toString(),
				);
				const exists = res.type !== FileType.Unknown;
				return exists;
			} catch {
				return false;
			}
		},
		realPath(uri) {
			const handler = runtime.file;
			if (handler) {
				return handler.realPath(uri);
			}

			return Promise.resolve(uri.toString());
		},
	};
}
