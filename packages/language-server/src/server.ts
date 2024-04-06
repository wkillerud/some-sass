import {
	LanguageService,
	getLanguageService,
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
} from "vscode-languageserver/node";
import type {
	InitializeParams,
	InitializeResult,
} from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";
import { URI } from "vscode-uri";
import {
	changeConfiguration,
	createContext,
	useContext,
} from "./context-provider";
import { ExtractProvider } from "./features/code-actions";
import { doDiagnostics } from "./features/diagnostics/diagnostics";
import { provideReferences } from "./features/references";
import { doRename, prepareRename } from "./features/rename";
import { doSignatureHelp } from "./features/signature-help/signature-help";
import type { FileSystemProvider } from "./file-system";
import { getFileSystemProvider } from "./file-system-provider";
import { RuntimeEnvironment } from "./runtime";
import ScannerService from "./scanner";
import { defaultSettings, IEditorSettings, type ISettings } from "./settings";
import StorageService from "./storage";
import { getSCSSRegionsDocument } from "./utils/embedded";

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
		let scannerService: ScannerService | undefined = undefined;
		let fileSystemProvider: FileSystemProvider | undefined = undefined;
		let clientCapabilities: ClientCapabilities | undefined = undefined;

		// Create a simple text document manager. The text document manager
		// _supports full document sync only
		const documents = new TextDocuments(TextDocument);

		// Make the text document manager listen on the connection
		// _for open, change and close text document events
		documents.listen(this.connection);
		this.connection.console.log(`[Server(${process.pid})] Listening`);

		// After the server has started the client sends an initilize request. The server receives
		// _in the passed params the rootPath of the workspace plus the client capabilites
		this.connection.onInitialize(
			(params: InitializeParams): InitializeResult => {
				this.connection.console.debug(
					`[Server${process.pid ? `(${process.pid})` : ""} ${workspaceRoot}] <initialize> received`,
				);

				clientCapabilities = params.capabilities;

				fileSystemProvider = getFileSystemProvider(
					this.connection,
					this.runtime,
				);

				ls = getLanguageService({
					clientCapabilities,
					fileSystemProvider,
					languageModelCache: {
						cleanupIntervalTimeInSeconds: 60,
					},
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
					},
				};
			},
		);

		this.connection.onInitialized(async () => {
			try {
				this.connection.console.debug(
					`[Server${process.pid ? `(${process.pid})` : ""} ${workspaceRoot}] <initialized> received`,
				);

				const somesassConfiguration: Partial<ISettings> =
					await this.connection.workspace.getConfiguration("somesass");
				const editorConfiguration: Partial<IEditorSettings> =
					await this.connection.workspace.getConfiguration("editor");
				const storageService = new StorageService();

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

				if (
					!ls ||
					!clientCapabilities ||
					!workspaceRoot ||
					!fileSystemProvider
				) {
					throw new Error(
						"Got onInitialized without onInitialize readying up all required globals",
					);
				}

				ls.configure({
					editorSettings,
					workspaceRoot,
				});

				createContext({
					clientCapabilities: clientCapabilities!,
					fs: fileSystemProvider!,
					settings,
					editorSettings,
					workspaceRoot: workspaceRoot!,
					storage: storageService,
				});

				scannerService = new ScannerService();

				this.connection.console.debug(
					`[Server${process.pid ? `(${process.pid})` : ""} ${workspaceRoot}] <initialized> scanning workspace for files`,
				);

				const files = await fileSystemProvider.findFiles(
					"**/*.{scss,svelte,astro,vue}",
					settings.scannerExclude,
				);

				this.connection.console.debug(
					`[Server${process.pid ? `(${process.pid})` : ""} ${workspaceRoot}] <initialized> found ${files.length} files, starting parse`,
				);

				// Populate the cache for the new language services
				for (const file of files) {
					let uri = file;
					if (file.scheme === "vscode-test-web") {
						// TODO: test-web paths includes /static/extensions/fs which causes issues.
						// The URI ends up being vscode-test-web://mount/static/extensions/fs/file.scss when it should only be vscode-test-web://mount/file.scss.
						// This should probably be landed as a bugfix somewhere upstream.
						uri = URI.parse(
							file.toString().replace("/static/extensions/fs", ""),
						);
					}
					const content = await fileSystemProvider.readFile(uri);
					const document = TextDocument.create(
						uri.toString(),
						"scss",
						1,
						content,
					);
					const scssRegions = getSCSSRegionsDocument(document);
					if (!scssRegions.document) {
						continue;
					}
					ls.parseStylesheet(document);
				}

				await scannerService.scan(files);

				this.connection.console.debug(
					`[Server${process.pid ? `(${process.pid})` : ""} ${workspaceRoot}] <initialized> parsed ${files.length} files`,
				);
			} catch (error) {
				this.connection.console.log(String(error));
			}
		});

		documents.onDidChangeContent(async (change) => {
			if (!scannerService || !ls) return;

			try {
				ls.onDocumentChanged(change.document);
				await scannerService.update(change.document);
			} catch (error) {
				// Something went wrong trying to parse the changed document.
				this.connection.console.error((error as Error).message);
				return;
			}

			const diagnostics = await doDiagnostics(change.document);

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
			const settings: ISettings = params.settings.somesass;
			changeConfiguration(settings);
		});

		this.connection.onDidChangeWatchedFiles(async (event) => {
			if (!scannerService || !fileSystemProvider || !ls) return;

			const context = useContext();
			if (!context) return;

			const { storage } = context;
			const newFiles: URI[] = [];
			for (const change of event.changes) {
				const uri = URI.parse(change.uri);
				if (change.type === FileChangeType.Deleted) {
					storage.delete(uri);
					ls.onDocumentRemoved(uri.toString());
				} else if (change.type === FileChangeType.Changed) {
					const document = storage.get(uri);
					if (document) {
						await scannerService.update(document);
					} else {
						// New to us anyway
						newFiles.push(uri);
					}
				} else {
					newFiles.push(uri);
				}
			}

			for (const file of newFiles) {
				const content = await fileSystemProvider.readFile(file);
				const document = TextDocument.create(
					file.toString(),
					"scss",
					1,
					content,
				);
				const scssRegions = getSCSSRegionsDocument(document);
				if (!scssRegions.document) {
					continue;
				}
				ls.parseStylesheet(document);
			}

			await scannerService.scan(newFiles);
		});

		this.connection.onCompletion(async (textDocumentPosition) => {
			if (!ls) return null;

			const uri = documents.get(textDocumentPosition.textDocument.uri);
			if (!uri) return null;

			const { document } = getSCSSRegionsDocument(
				uri,
				textDocumentPosition.position,
			);
			if (!document) return null;

			const result = await ls.doComplete(
				document,
				textDocumentPosition.position,
			);
			return result;
		});

		this.connection.onHover((params) => {
			if (!ls) return null;

			const uri = documents.get(params.textDocument.uri);
			if (!uri) return null;

			const { document } = getSCSSRegionsDocument(uri, params.position);
			if (!document) return null;

			const result = ls.doHover(document, params.position);
			return result;
		});

		this.connection.onSignatureHelp((textDocumentPosition) => {
			const uri = documents.get(textDocumentPosition.textDocument.uri);
			if (!uri) return null;

			const { document, offset } = getSCSSRegionsDocument(
				uri,
				textDocumentPosition.position,
			);
			if (!document) return null;

			const result = doSignatureHelp(document, offset);
			return result;
		});

		this.connection.onDefinition((params) => {
			if (!ls) return null;

			const uri = documents.get(params.textDocument.uri);
			if (!uri) return null;

			const { document } = getSCSSRegionsDocument(uri, params.position);
			if (!document) return null;

			const result = ls.findDefinition(document, params.position);
			return result;
		});

		this.connection.onDocumentHighlight((params) => {
			if (!ls) return null;

			const document = documents.get(params.textDocument.uri);
			if (!document) return null;

			const result = ls.findDocumentHighlights(document, params.position);
			return result;
		});

		this.connection.onReferences(async (referenceParams) => {
			const uri = documents.get(referenceParams.textDocument.uri);
			if (uri === undefined) return null;

			const { document, offset } = getSCSSRegionsDocument(
				uri,
				referenceParams.position,
			);
			if (!document) return null;

			const options = referenceParams.context;
			const references = await provideReferences(document, offset, options);
			if (!references) return null;

			return references.references.map((r) => r.location);
		});

		this.connection.onWorkspaceSymbol((params) => {
			if (!ls) return null;

			const result = ls.findWorkspaceSymbols(params.query);
			return result;
		});

		this.connection.onCodeAction(async (params) => {
			const context = useContext();
			if (!context) return null;

			const { editorSettings } = context;
			const codeActionProviders = [new ExtractProvider(editorSettings)];

			const document = documents.get(params.textDocument.uri);
			if (document === undefined) return null;

			const allActions: (Command | CodeAction)[] = [];

			for (const provider of codeActionProviders) {
				const actions = await provider.provideCodeActions(
					document,
					params.range,
				);

				if (provider instanceof ExtractProvider) {
					for (const action of actions) {
						const edit: TextDocumentEdit | undefined = action.edit
							?.documentChanges?.[0] as TextDocumentEdit;

						const command = Command.create(
							action.title,
							"_somesass.applyExtractCodeAction",
							document.uri,
							document.version,
							edit && edit.edits[0],
						);

						allActions.push(
							CodeAction.create(action.title, command, action.kind),
						);
					}
				}
			}

			return allActions;
		});

		this.connection.onPrepareRename(async (params) => {
			const uri = documents.get(params.textDocument.uri);
			if (uri === undefined) return null;

			const { document, offset } = getSCSSRegionsDocument(uri, params.position);
			if (!document) return null;

			const preparations = await prepareRename(document, offset);
			return preparations;
		});

		this.connection.onRenameRequest(async (params) => {
			const uri = documents.get(params.textDocument.uri);
			if (uri === undefined) return null;

			const { document, offset } = getSCSSRegionsDocument(uri, params.position);
			if (!document) return null;

			const edits = await doRename(document, offset, params.newName);
			return edits;
		});

		this.connection.onDocumentColor(async (params) => {
			this.connection.console.debug(
				`[Server${process.pid ? `(${process.pid})` : ""} ${workspaceRoot}] <textDocument/color> received`,
			);
			if (!ls || !scannerService) return null;

			const uri = documents.get(params.textDocument.uri);
			if (uri === undefined) return null;

			const { document } = getSCSSRegionsDocument(uri);
			if (!document) return null;

			const context = useContext();
			if (!context) return null;

			const { storage } = context;
			const scssDocument = storage.get(document.uri);
			if (!scssDocument) {
				// For the first open document, we may have a race condition where the scanner
				// hasn't finished before the documentColor request is sent from the client.
				// In these cases, initiate a scan for the document and wait for it to finish,
				// to ensure we get color decorators without having to edit the file first.
				await scannerService.scan([URI.parse(document.uri)]);
			}

			const information = await ls.findColors(document);
			return information;
		});

		this.connection.onColorPresentation((params) => {
			if (!ls) return null;

			const uri = documents.get(params.textDocument.uri);
			if (uri === undefined) return null;

			const { document } = getSCSSRegionsDocument(uri);
			if (!document) return null;

			const result = ls.getColorPresentations(
				document,
				params.color,
				params.range,
			);
			return result;
		});

		this.connection.onShutdown(() => {
			const context = useContext();
			if (context) {
				context.storage.clear();
			}
		});

		this.connection.listen();
	}
}
