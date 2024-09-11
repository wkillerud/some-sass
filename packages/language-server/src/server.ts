import {
	getLanguageService,
	LanguageService,
} from "@somesass/language-services";
import {
	ClientCapabilities,
	CodeAction,
	CodeActionKind,
	Command,
	Connection,
	FileChangeType,
	TextDocumentEdit,
} from "vscode-languageserver";
import {
	TextDocuments,
	TextDocumentSyncKind,
	TextDocumentChangeEvent,
} from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";
import { URI } from "vscode-uri";
import type { FileSystemProvider } from "./file-system";
import { getFileSystemProvider } from "./file-system-provider";
import { RuntimeEnvironment } from "./runtime";
import { defaultSettings, IEditorSettings, ISettings } from "./settings";
import { getSassRegionsDocument } from "./utils/embedded";
import WorkspaceScanner from "./workspace-scanner";

export class SomeSassServer {
	private readonly connection: Connection;
	private readonly runtime: RuntimeEnvironment;

	constructor(connection: Connection, runtime: RuntimeEnvironment) {
		this.connection = connection;
		this.runtime = runtime;
	}

	public listen(): void {
		let ls: LanguageService | undefined = undefined;
		let workspaceRoot: URI | undefined = undefined;
		let workspaceScanner: WorkspaceScanner | undefined = undefined;
		let fileSystemProvider: FileSystemProvider | undefined = undefined;
		let clientCapabilities: ClientCapabilities | undefined = undefined;
		let initialScan: Promise<void> | null = null;

		// Create a simple text document manager. The text document manager
		// _supports full document sync only
		const documents = new TextDocuments(TextDocument);

		// Make the text document manager listen on the connection
		// _for open, change and close text document events
		documents.listen(this.connection);
		this.connection.console.log(`[Server(${process.pid})] Listening`);

		// After the server has started the client sends an initilize request. The server receives
		// _in the passed params the rootPath of the workspace plus the client capabilites
		this.connection.onInitialize((params) => {
			this.connection.console.debug(
				`[Server${process.pid ? `(${process.pid})` : ""} ${workspaceRoot}] <initialize> received`,
			);

			clientCapabilities = params.capabilities;

			fileSystemProvider = getFileSystemProvider(this.connection, this.runtime);

			ls = getLanguageService({
				clientCapabilities,
				fileSystemProvider,
			});

			// TODO: migrate to workspace folders. Workspace was an unnecessary older workaround of mine.
			workspaceRoot = URI.parse(
				params.initializationOptions?.workspace || params.rootUri!,
			);

			this.connection.console.debug(
				`[Server${process.pid ? `(${process.pid})` : ""} ${workspaceRoot}] <initialize> returning server capabilities`,
			);

			return {
				capabilities: {
					textDocumentSync: TextDocumentSyncKind.Incremental,
					documentLinkProvider: {
						resolveProvider: false,
					},
					referencesProvider: true,
					completionProvider: {
						resolveProvider: false,
						triggerCharacters: [
							// For SassDoc annotation completion
							"@",
							"/",

							// For @use completion
							'"',
							"'",

							// For placeholder completion
							"%",

							// For namespaced completions
							".",

							// For property values
							":",

							// For custom properties
							"-",
						],
					},
					signatureHelpProvider: {
						triggerCharacters: ["(", ",", ";"],
					},
					hoverProvider: true,
					definitionProvider: true,
					documentHighlightProvider: true,
					workspaceSymbolProvider: true,
					codeActionProvider: {
						codeActionKinds: [
							CodeActionKind.RefactorExtract,
							CodeActionKind.RefactorExtract + ".function",
							CodeActionKind.RefactorExtract + ".constant",
						],
						resolveProvider: false,
					},
					renameProvider: { prepareProvider: true },
					colorProvider: {},
					foldingRangeProvider: true,
					selectionRangeProvider: true,
				},
			};
		});

		function applySettings(
			editorSettings: IEditorSettings,
			settings: ISettings,
		) {
			if (!ls) return;

			ls.configure({
				editorSettings,
				workspaceRoot,
				loadPaths: settings.loadPaths,
				completionSettings: {
					suggestAllFromOpenDocument: settings.suggestAllFromOpenDocument,
					suggestFromUseOnly: settings.suggestFromUseOnly,
					suggestionStyle: settings.suggestionStyle,
					suggestFunctionsInStringContextAfterSymbols:
						settings.suggestFunctionsInStringContextAfterSymbols,
					afterModule: settings.completion?.afterModule,
					beforeVariable: settings.completion?.beforeVariable,
				},
			});
		}

		this.connection.onInitialized(async () => {
			this.connection.console.debug(
				`[Server${process.pid ? `(${process.pid})` : ""} ${workspaceRoot}] <initialized> received`,
			);
			try {
				initialScan = new Promise<void>((resolve, reject) => {
					Promise.all([
						this.connection.workspace.getConfiguration("somesass"),
						this.connection.workspace.getConfiguration("editor"),
					]).then(
						([somesassConfiguration, editorConfiguration]: [
							Partial<ISettings>,
							Partial<IEditorSettings>,
						]) => {
							const settings = {
								...defaultSettings,
								...somesassConfiguration,
							};

							const editorSettings: IEditorSettings = {
								insertSpaces: false,
								indentSize: undefined,
								tabSize: 2,
								...editorConfiguration,
							};

							if (
								!ls ||
								!clientCapabilities ||
								!workspaceRoot ||
								!fileSystemProvider
							) {
								return reject(
									new Error(
										"Got onInitialized without onInitialize readying up all required globals",
									),
								);
							}

							applySettings(editorSettings, settings);

							this.connection.console.debug(
								`[Server${process.pid ? `(${process.pid})` : ""} ${workspaceRoot}] <initialized> scanning workspace for files`,
							);

							return fileSystemProvider
								.findFiles(
									"**/*.{scss,sass,svelte,astro,vue}",
									settings.scannerExclude,
								)
								.then((files) => {
									this.connection.console.debug(
										`[Server${process.pid ? `(${process.pid})` : ""} ${workspaceRoot}] <initialized> found ${files.length} files, starting parse`,
									);

									workspaceScanner = new WorkspaceScanner(
										ls!,
										fileSystemProvider!,
										{
											scanImportedFiles: settings.scanImportedFiles,
											scannerDepth: settings.scannerDepth,
										},
									);

									return workspaceScanner.scan(files);
								})
								.then((promises) => {
									this.connection.console.debug(
										`[Server${process.pid ? `(${process.pid})` : ""} ${workspaceRoot}] <initialized> parsed ${promises.length} files`,
									);
									resolve();
								});
						},
					);
				});
				await initialScan;
			} catch (error) {
				this.connection.console.log(String(error));
			}
		});

		const onDocumentChanged = async (
			params: TextDocumentChangeEvent<TextDocument>,
		) => {
			if (!workspaceScanner || !ls) return;

			try {
				ls.onDocumentChanged(params.document);
				// Check that no new version has been made while we waited,
				// in which case the diagnostics may no longer be valid.
				let latest = documents.get(params.document.uri);
				if (!latest || latest.version !== params.document.version) return;

				const diagnostics = await ls.doDiagnostics(params.document);

				latest = documents.get(params.document.uri);
				if (!latest || latest.version !== params.document.version) return;

				this.connection.sendDiagnostics({
					uri: latest.uri,
					diagnostics,
				});
			} catch {
				// Do nothing, the document might have changed
			}
		};

		documents.onDidOpen(onDocumentChanged);
		documents.onDidChangeContent(onDocumentChanged);

		this.connection.onDidChangeConfiguration((params) => {
			if (!ls) return;

			const somesassConfiguration: Partial<ISettings> =
				params.settings.somesass;

			const editorConfiguration: Partial<IEditorSettings> =
				params.settings.editor;

			const settings: ISettings = {
				...defaultSettings,
				...somesassConfiguration,
			};

			const editorSettings: IEditorSettings = {
				insertSpaces: false,
				indentSize: undefined,
				tabSize: 2,
				...editorConfiguration,
			};

			applySettings(editorSettings, settings);
		});

		this.connection.onDidChangeWatchedFiles(async (event) => {
			if (!workspaceScanner || !fileSystemProvider || !ls) return;
			try {
				const newFiles: URI[] = [];
				for (const change of event.changes) {
					const uri = await fileSystemProvider.realPath(URI.parse(change.uri));

					if (change.type === FileChangeType.Deleted) {
						ls.onDocumentRemoved(uri.toString());
					} else if (change.type === FileChangeType.Changed) {
						const document = documents.get(uri.toString());
						if (!document) {
							// New to us anyway
							newFiles.push(uri);
						} else {
							ls.onDocumentChanged(document);
						}
					} else {
						newFiles.push(uri);
					}
				}

				await workspaceScanner.scan(newFiles);
			} catch {
				// do nothing
			}
		});

		this.connection.onCompletion(async (params) => {
			if (!ls) return null;

			const document = getSassRegionsDocument(
				documents.get(params.textDocument.uri),
				params.position,
			);
			if (!document) return null;

			const result = await ls.doComplete(document, params.position);
			if (result.items.length === 0) {
				result.isIncomplete = true;
			}
			return result;
		});

		this.connection.onHover((params) => {
			if (!ls) return null;

			const document = getSassRegionsDocument(
				documents.get(params.textDocument.uri),
				params.position,
			);
			if (!document) return null;

			const result = ls.doHover(document, params.position);
			return result;
		});

		this.connection.onSignatureHelp(async (params) => {
			if (!ls) return null;

			const document = getSassRegionsDocument(
				documents.get(params.textDocument.uri),
				params.position,
			);
			if (!document) return null;

			const result = await ls.doSignatureHelp(document, params.position);
			return result;
		});

		this.connection.onDefinition((params) => {
			if (!ls) return null;

			const document = getSassRegionsDocument(
				documents.get(params.textDocument.uri),
				params.position,
			);
			if (!document) return null;

			const result = ls.findDefinition(document, params.position);
			return result;
		});

		this.connection.onDocumentHighlight(async (params) => {
			if (!ls) return null;

			const document = getSassRegionsDocument(
				documents.get(params.textDocument.uri),
				params.position,
			);
			if (!document) return null;

			try {
				if (initialScan) {
					await initialScan;
				}
				const result = ls.findDocumentHighlights(document, params.position);
				return result;
			} catch {
				// Do nothing
			}
		});

		this.connection.onDocumentLinks(async (params) => {
			if (!ls) return null;

			const document = getSassRegionsDocument(
				documents.get(params.textDocument.uri),
			);
			if (!document) return null;

			try {
				if (initialScan) {
					await initialScan;
				}
				const result = await ls.findDocumentLinks(document);
				return result;
			} catch {
				// Do nothing
			}
		});

		this.connection.onReferences(async (params) => {
			if (!ls) return null;

			const document = getSassRegionsDocument(
				documents.get(params.textDocument.uri),
				params.position,
			);
			if (!document) return null;

			const references = await ls.findReferences(
				document,
				params.position,
				params.context,
			);
			return references;
		});

		this.connection.onWorkspaceSymbol((params) => {
			if (!ls) return null;

			const result = ls.findWorkspaceSymbols(params.query);
			return result;
		});

		this.connection.onCodeAction(async (params) => {
			if (!ls) return null;

			const document = getSassRegionsDocument(
				documents.get(params.textDocument.uri),
			);
			if (!document) return null;

			const result: (Command | CodeAction)[] = [];

			const actions = await ls.getCodeActions(
				document,
				params.range,
				params.context,
			);

			for (const action of actions) {
				if (action.kind?.startsWith("refactor.extract")) {
					// Replace with a custom command that immediately starts a rename after applying the edit.
					// If this causes problems for other clients, look into passing some kind of client identifier (optional)
					// with initOptions that indicate this command exists in the client.

					const edit: TextDocumentEdit | undefined = action.edit
						?.documentChanges?.[0] as TextDocumentEdit;

					const command = Command.create(
						action.title,
						"_somesass.applyExtractCodeAction",
						document.uri,
						document.version,
						edit && edit.edits[0],
					);

					result.push(CodeAction.create(action.title, command, action.kind));
				} else {
					result.push(action);
				}
			}

			return result;
		});

		this.connection.onPrepareRename(async (params) => {
			if (!ls) return null;

			const document = getSassRegionsDocument(
				documents.get(params.textDocument.uri),
				params.position,
			);
			if (!document) return null;

			const preparations = await ls.prepareRename(document, params.position);
			return preparations;
		});

		this.connection.onRenameRequest(async (params) => {
			if (!ls) return null;

			const document = getSassRegionsDocument(
				documents.get(params.textDocument.uri),
				params.position,
			);
			if (!document) return null;

			const edits = await ls.doRename(
				document,
				params.position,
				params.newName,
			);
			return edits;
		});

		this.connection.onDocumentColor(async (params) => {
			if (!ls) return null;

			const document = getSassRegionsDocument(
				documents.get(params.textDocument.uri),
			);
			if (!document) return null;

			try {
				if (initialScan) {
					await initialScan;
				}
				const information = await ls.findColors(document);
				return information;
			} catch {
				// Do nothing
			}
		});

		this.connection.onColorPresentation((params) => {
			if (!ls) return null;

			const document = getSassRegionsDocument(
				documents.get(params.textDocument.uri),
			);
			if (!document) return null;

			const result = ls.getColorPresentations(
				document,
				params.color,
				params.range,
			);
			return result;
		});

		this.connection.onFoldingRanges(async (params) => {
			if (!ls) return null;

			const document = getSassRegionsDocument(
				documents.get(params.textDocument.uri),
			);
			if (!document) return null;

			const result = await ls.getFoldingRanges(document);
			return result;
		});

		this.connection.onSelectionRanges(async (params) => {
			if (!ls) return null;

			const document = getSassRegionsDocument(
				documents.get(params.textDocument.uri),
			);
			if (!document) return null;

			const result = await ls.getSelectionRanges(document, params.positions);
			return result;
		});

		this.connection.onShutdown(() => {
			if (!ls) return;

			ls.clearCache();
		});

		this.connection.listen();
	}
}
