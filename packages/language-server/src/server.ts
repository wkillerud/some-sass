import {
	defaultConfiguration,
	getLanguageService,
	LanguageService,
	LanguageServiceConfiguration,
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
import {
	ConfigurationV1,
	isOldConfiguration,
	toNewConfiguration,
} from "./configuration";
import { getSassRegionsDocument } from "./embedded";
import WorkspaceScanner from "./workspace-scanner";
import { createLogger, type Logger } from "./logger";
import {
	EditorConfiguration,
	LanguageConfiguration,
} from "@somesass/language-services/dist/language-services-types";
import merge from "lodash.merge";

export class SomeSassServer {
	private readonly connection: Connection;
	private readonly runtime: RuntimeEnvironment;
	private readonly log: Logger;
	private configuration: LanguageServiceConfiguration = defaultConfiguration;

	constructor(connection: Connection, runtime: RuntimeEnvironment) {
		this.connection = connection;
		this.runtime = runtime;
		this.log = createLogger(connection.console);
		this.log.trace(`Process ID ${process.pid}`);
	}

	public listen(): void {
		let ls: LanguageService | undefined = undefined;
		let workspaceRoot: URI | undefined = undefined;
		let workspaceScanner: WorkspaceScanner | undefined = undefined;
		let fileSystemProvider: FileSystemProvider | undefined = undefined;
		let clientCapabilities: ClientCapabilities | undefined = undefined;
		let initialScan: Promise<void> | null = null;

		const documents = new TextDocuments(TextDocument);
		documents.listen(this.connection);

		this.connection.onInitialize((params) => {
			clientCapabilities = params.capabilities;

			fileSystemProvider = getFileSystemProvider(this.connection, this.runtime);

			ls = getLanguageService({
				clientCapabilities,
				fileSystemProvider,
				logger: this.log,
			});

			// TODO: migrate to workspace folders
			workspaceRoot = URI.parse(params.rootUri!);
			this.log.info(`Workspace root ${workspaceRoot}`);

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

		const applyConfiguration = (
			somesass: Partial<ConfigurationV1 | LanguageServiceConfiguration>,
			editor: Partial<EditorConfiguration>,
		): LanguageServiceConfiguration => {
			if (isOldConfiguration(somesass)) {
				this.log.warn(
					`Your somesass configuration uses old setting names. They will continue to work for some time, but it's recommended you change your settings to the new names. For all the available settings see https://wkillerud.github.io/some-sass/user-guide/settings.html`,
				);

				somesass = toNewConfiguration(
					somesass as Partial<ConfigurationV1>,
					this.log,
				);
			}

			const settings: LanguageServiceConfiguration = merge(
				defaultConfiguration,
				somesass,
				{
					editor: {
						...editor,
					},
				},
			);
			settings.workspace.workspaceRoot = workspaceRoot;

			if (settings.workspace.logLevel) {
				this.log.setLogLevel(settings.workspace.logLevel);
			}

			this.configuration = settings;
			if (ls) {
				ls.configure(settings);
			}

			this.log.debug("Applied user configuration");
			this.log.trace(JSON.stringify(this.configuration));

			return settings;
		};

		this.connection.onInitialized(async () => {
			try {
				// Let other methods await the result of the initial scan before proceeding
				initialScan = new Promise<void>((resolve, reject) => {
					const configurationRequests = [
						this.connection.workspace.getConfiguration("somesass"),
						this.connection.workspace.getConfiguration("editor"),
					];

					Promise.all(configurationRequests).then((configs) => {
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

						let [somesass, editor] = configs as [
							Partial<LanguageServiceConfiguration | ConfigurationV1>,
							Partial<EditorConfiguration>,
						];

						const configuration = applyConfiguration(somesass, editor);

						this.log.debug("Scanning workspace for files");

						return fileSystemProvider
							.findFiles(
								"**/*.{css,scss,sass,svelte,astro,vue}",
								configuration.workspace.exclude,
							)
							.then((files) => {
								this.log.debug(`Found ${files.length} files, starting parse`);

								workspaceScanner = new WorkspaceScanner(
									ls!,
									fileSystemProvider!,
								);

								return workspaceScanner.scan(files);
							})
							.then((promises) => {
								this.log.debug(
									`Initial scan finished, parsed ${promises.length} files`,
								);
								resolve();
							});
					});
				});
				await initialScan;
			} catch (error) {
				this.log.fatal(String(error));
			}
		});

		this.connection.onDidChangeConfiguration((params) => {
			applyConfiguration(params.settings.somesass, params.settings.editor);
		});

		const doDiagnostics = async (
			params: TextDocumentChangeEvent<TextDocument>,
		): Promise<void> => {
			if (!ls) return;

			const document = getSassRegionsDocument(
				documents.get(params.document.uri),
			);
			if (!document) return;

			const config = this.languageConfiguration(document);
			if (config.diagnostics.enabled) {
				let latest = documents.get(params.document.uri);
				if (!latest || latest.version !== params.document.version) return;

				const diagnostics = await ls.doDiagnostics(params.document);

				// Check that no new version has been made while we waited,
				// in which case the diagnostics may no longer be valid.
				latest = documents.get(params.document.uri);
				if (!latest || latest.version !== params.document.version) return;

				this.connection.sendDiagnostics({
					uri: latest.uri,
					diagnostics,
				});
			}
		};

		documents.onDidOpen(async (params) => {
			try {
				if (initialScan) {
					await initialScan;
				}
				await doDiagnostics(params);
			} catch (e) {
				this.log.debug((e as Error).message);
			}
		});

		documents.onDidChangeContent(async (params) => {
			if (!workspaceScanner || !ls) return;
			try {
				ls.onDocumentChanged(params.document);
				await doDiagnostics(params);
			} catch (e) {
				this.log.debug((e as Error).message);
			}
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
			} catch (e) {
				this.log.debug((e as Error).message);
			}
		});

		this.connection.onCompletion(async (params) => {
			if (!ls) return null;
			try {
				const document = getSassRegionsDocument(
					documents.get(params.textDocument.uri),
					params.position,
				);
				if (!document) return null;

				const config = this.languageConfiguration(document);
				if (config.completion.enabled) {
					const result = await ls.doComplete(document, params.position);
					if (result.items.length === 0) {
						result.isIncomplete = true;
					}
					return result;
				} else {
					return null;
				}
			} catch (e) {
				this.log.debug((e as Error).message);
				return null;
			}
		});

		this.connection.onHover((params) => {
			if (!ls) return null;
			try {
				const document = getSassRegionsDocument(
					documents.get(params.textDocument.uri),
					params.position,
				);
				if (!document) return null;

				const config = this.languageConfiguration(document);
				if (config.hover.enabled) {
					const result = ls.doHover(document, params.position);
					return result;
				} else {
					return null;
				}
			} catch (e) {
				this.log.debug((e as Error).message);
				return null;
			}
		});

		this.connection.onSignatureHelp(async (params) => {
			if (!ls) return null;
			try {
				const document = getSassRegionsDocument(
					documents.get(params.textDocument.uri),
					params.position,
				);
				if (!document) return null;

				const config = this.languageConfiguration(document);
				if (config.signatureHelp.enabled) {
					const result = await ls.doSignatureHelp(document, params.position);
					return result;
				} else {
					return null;
				}
			} catch (e) {
				this.log.debug((e as Error).message);
				return null;
			}
		});

		this.connection.onDefinition((params) => {
			if (!ls) return null;
			try {
				const document = getSassRegionsDocument(
					documents.get(params.textDocument.uri),
					params.position,
				);
				if (!document) return null;

				const config = this.languageConfiguration(document);
				if (config.definition.enabled) {
					const result = ls.findDefinition(document, params.position);
					return result;
				} else {
					return null;
				}
			} catch (e) {
				this.log.debug((e as Error).message);
				return null;
			}
		});

		this.connection.onDocumentHighlight(async (params) => {
			if (!ls) return null;
			try {
				const document = getSassRegionsDocument(
					documents.get(params.textDocument.uri),
					params.position,
				);
				if (!document) return null;

				const config = this.languageConfiguration(document);
				if (config.highlights.enabled) {
					try {
						if (initialScan) {
							await initialScan;
						}
						const result = ls.findDocumentHighlights(document, params.position);
						return result;
					} catch {
						// Do nothing
					}
				} else {
					return null;
				}
			} catch (e) {
				this.log.debug((e as Error).message);
				return null;
			}
		});

		this.connection.onDocumentLinks(async (params) => {
			if (!ls) return null;
			try {
				const document = getSassRegionsDocument(
					documents.get(params.textDocument.uri),
				);
				if (!document) return null;

				const config = this.languageConfiguration(document);
				if (config.links.enabled) {
					if (initialScan) {
						await initialScan;
					}
					const result = await ls.findDocumentLinks(document);
					return result;
				} else {
					return null;
				}
			} catch (e) {
				this.log.debug((e as Error).message);
				return null;
			}
		});

		this.connection.onReferences(async (params) => {
			if (!ls) return null;
			try {
				const document = getSassRegionsDocument(
					documents.get(params.textDocument.uri),
					params.position,
				);
				if (!document) return null;

				const config = this.languageConfiguration(document);
				if (config.references.enabled) {
					const references = await ls.findReferences(
						document,
						params.position,
						params.context,
					);
					return references;
				} else {
					return null;
				}
			} catch (e) {
				this.log.debug((e as Error).message);
				return null;
			}
		});

		this.connection.onWorkspaceSymbol((params) => {
			if (!ls) return null;
			try {
				const result = ls.findWorkspaceSymbols(params.query);
				return result;
			} catch (e) {
				this.log.debug((e as Error).message);
				return null;
			}
		});

		this.connection.onCodeAction(async (params) => {
			if (!ls) return null;
			try {
				const document = getSassRegionsDocument(
					documents.get(params.textDocument.uri),
				);
				if (!document) return null;

				const config = this.languageConfiguration(document);
				if (!config.codeAction.enabled) {
					return null;
				}

				const result: (Command | CodeAction)[] = [];

				const actions = await ls.getCodeActions(
					document,
					params.range,
					params.context,
				);

				for (const action of actions) {
					if (action.kind?.startsWith("refactor.extract")) {
						// TODO: can we detect support for the custom command here before we do this?

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
			} catch (e) {
				this.log.debug((e as Error).message);
				return null;
			}
		});

		this.connection.onPrepareRename(async (params) => {
			if (!ls) return null;
			try {
				const document = getSassRegionsDocument(
					documents.get(params.textDocument.uri),
					params.position,
				);
				if (!document) return null;

				const config = this.languageConfiguration(document);
				if (config.rename.enabled) {
					const preparations = await ls.prepareRename(
						document,
						params.position,
					);
					return preparations;
				} else {
					return null;
				}
			} catch (e) {
				this.log.debug((e as Error).message);
				return null;
			}
		});

		this.connection.onRenameRequest(async (params) => {
			if (!ls) return null;
			try {
				const document = getSassRegionsDocument(
					documents.get(params.textDocument.uri),
					params.position,
				);
				if (!document) return null;

				const config = this.languageConfiguration(document);
				if (config.rename.enabled) {
					const edits = await ls.doRename(
						document,
						params.position,
						params.newName,
					);
					return edits;
				} else {
					return null;
				}
			} catch (e) {
				this.log.debug((e as Error).message);
				return null;
			}
		});

		this.connection.onDocumentColor(async (params) => {
			if (!ls) return null;
			try {
				const document = getSassRegionsDocument(
					documents.get(params.textDocument.uri),
				);
				if (!document) return null;

				const config = this.languageConfiguration(document);
				if (config.colors.enabled) {
					if (initialScan) {
						await initialScan;
					}
					const information = await ls.findColors(document);
					return information;
				} else {
					return null;
				}
			} catch (e) {
				this.log.debug((e as Error).message);
				return null;
			}
		});

		this.connection.onColorPresentation((params) => {
			if (!ls) return null;
			try {
				const document = getSassRegionsDocument(
					documents.get(params.textDocument.uri),
				);
				if (!document) return null;

				const config = this.languageConfiguration(document);
				if (config.colors.enabled) {
					const result = ls.getColorPresentations(
						document,
						params.color,
						params.range,
					);
					return result;
				} else {
					return null;
				}
			} catch (e) {
				this.log.debug((e as Error).message);
				return null;
			}
		});

		this.connection.onFoldingRanges(async (params) => {
			if (!ls) return null;
			try {
				const document = getSassRegionsDocument(
					documents.get(params.textDocument.uri),
				);
				if (!document) return null;

				const config = this.languageConfiguration(document);
				if (config.foldingRanges.enabled) {
					const result = await ls.getFoldingRanges(document);
					return result;
				} else {
					return null;
				}
			} catch (e) {
				this.log.debug((e as Error).message);
				return null;
			}
		});

		this.connection.onSelectionRanges(async (params) => {
			if (!ls) return null;
			try {
				const document = getSassRegionsDocument(
					documents.get(params.textDocument.uri),
				);
				if (!document) return null;

				const config = this.languageConfiguration(document);
				if (config.selectionRanges.enabled) {
					const result = await ls.getSelectionRanges(
						document,
						params.positions,
					);
					return result;
				} else {
					return null;
				}
			} catch (e) {
				this.log.debug((e as Error).message);
				return null;
			}
		});

		this.connection.onShutdown(() => {
			if (!ls) return;

			ls.clearCache();
		});

		this.connection.listen();
		this.log.debug(`Some Sass language server is running`);
	}

	languageConfiguration(document: TextDocument): LanguageConfiguration {
		switch (document.languageId) {
			case "css": {
				return this.configuration.css;
			}
			case "sass": {
				return this.configuration.sass;
			}
			case "scss": {
				return this.configuration.scss;
			}
		}
		throw new Error(`Unsupported language ${document.languageId}`);
	}
}
