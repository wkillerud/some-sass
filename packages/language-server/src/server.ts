import {
	defaultConfiguration,
	EditorConfiguration,
	getLanguageService,
	LanguageConfiguration,
	LanguageServerConfiguration,
	LanguageService,
} from "@somesass/language-services";
import { newCSSDataProvider } from "@somesass/vscode-css-languageservice";
import { merge } from "es-toolkit/object";
import {
	ClientCapabilities,
	CodeAction,
	CodeActionKind,
	Command,
	Connection,
	FileChangeType,
	TextDocumentEdit,
} from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
	TextDocumentChangeEvent,
	TextDocuments,
	TextDocumentSyncKind,
} from "vscode-languageserver/node";
import { URI, Utils } from "vscode-uri";
import {
	ConfigurationV1,
	isOldConfiguration,
	toNewConfiguration,
} from "./configuration";
import { getSassRegionsDocument } from "./embedded";
import type { FileSystemProvider } from "./file-system";
import { getFileSystemProvider } from "./file-system-provider";
import { createLogger, type Logger } from "./logger";
import { RuntimeEnvironment } from "./runtime";
import WorkspaceScanner from "./workspace-scanner";

export class SomeSassServer {
	private readonly connection: Connection;
	private readonly runtime: RuntimeEnvironment;
	private readonly log: Logger;
	private configuration: LanguageServerConfiguration = defaultConfiguration;

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

			workspaceRoot = URI.parse(params.rootUri!);
			this.log.info(`Workspace root ${workspaceRoot}`);

			return {
				capabilities: {
					textDocumentSync: TextDocumentSyncKind.Incremental,
					documentLinkProvider: {
						resolveProvider: false,
					},
					documentSymbolProvider: true,
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
			somesass: Partial<ConfigurationV1 | LanguageServerConfiguration>,
			editor: Partial<EditorConfiguration>,
		): LanguageServerConfiguration => {
			if (isOldConfiguration(somesass)) {
				this.log.warn(
					`Your somesass configuration uses old setting names. They will continue to work for some time, but it's recommended you change your settings to the new names. For all the available settings see https://wkillerud.github.io/some-sass/user-guide/settings.html`,
				);

				somesass = toNewConfiguration(
					somesass as Partial<ConfigurationV1>,
					this.log,
				);

				this.log.info(
					"Replace old setting IDs with new ones to remove these messages",
				);
			}

			const settings: LanguageServerConfiguration = merge(
				merge(defaultConfiguration, somesass),
				{
					editor: {
						...editor,
					},
				},
			);

			settings.workspace.workspaceRoot = workspaceRoot;

			if (
				typeof settings.workspace.importAliases === "object" &&
				Object.keys(settings.workspace.importAliases).length
			) {
				if (!settings.scss.links.enabled) {
					this.log.info(
						"somesass.workspace.importAliases requires somesass.scss.links.enabled to be true, ignoring the `false` value",
					);
					settings.scss.links.enabled = true;
				}
				if (!settings.sass.links.enabled) {
					this.log.info(
						"somesass.workspace.importAliases requires somesass.sass.links.enabled to be true, ignoring the `false` value",
					);
					settings.sass.links.enabled = true;
				}
				if (!settings.css.links.enabled) {
					this.log.info(
						"somesass.workspace.importAliases requires somesass.css.links.enabled to be true, ignoring the `false` value",
					);
					settings.css.links.enabled = true;
				}

				for (const [alias, path] of Object.entries(
					settings.workspace.importAliases,
				)) {
					// Remove the commonly used ${workspace} variable https://code.visualstudio.com/docs/reference/variables-reference
					// We require paths from the workspace root anyway.
					if (path.includes("${workspace}")) {
						settings.workspace.importAliases[alias] = path.replace(
							"${workspace}",
							"",
						);
					}
					// WorkspaceFolder is not supported, one instance of the language server is started per workspace in a multi-root project.
					if (path.includes("${workspaceFolder:")) {
						this.log.warn(
							"Using the workspaceFolder variable in importAliases is not supported. Some Sass starts one instance of the language server per root in a multi-root project. Each folder is treated as an isolated project.",
						);
					}
				}
			}

			this.configuration = settings;
			if (ls) {
				ls.configure(settings);
			}

			this.log.setLogLevel(settings.workspace.logLevel);
			this.log.debug("Applied user configuration");
			this.log.trace(JSON.stringify(this.configuration, null, 2));

			return settings;
		};

		const applyCustomData = async (
			configuration: LanguageServerConfiguration,
		) => {
			const paths: string[] = [];
			if (configuration.css.customData) {
				paths.push(...configuration.css.customData);
			}
			if (configuration.sass.customData) {
				paths.push(...configuration.sass.customData);
			}
			if (configuration.scss.customData) {
				paths.push(...configuration.scss.customData);
			}

			const customDataProviders = await Promise.all(
				paths.map(async (path) => {
					try {
						let uri = path.startsWith("/")
							? URI.parse(path)
							: Utils.joinPath(workspaceRoot!, path);

						const content = await fileSystemProvider!.readFile(uri, "utf-8");
						const rawData = JSON.parse(content);

						return newCSSDataProvider({
							version: rawData.version || 1,
							properties: rawData.properties || [],
							atDirectives: rawData.atDirectives || [],
							pseudoClasses: rawData.pseudoClasses || [],
							pseudoElements: rawData.pseudoElements || [],
						});
					} catch (error) {
						this.log.debug(String(error));
						return newCSSDataProvider({ version: 1 });
					}
				}),
			);

			ls!.setDataProviders(customDataProviders);
		};

		this.connection.onInitialized(async () => {
			try {
				// Let other methods await the result of the initial scan before proceeding
				initialScan = new Promise<void>(
					(resolveInitialScan, rejectInitialScan) => {
						const configurationRequests = [
							this.connection.workspace.getConfiguration("somesass"),
							this.connection.workspace.getConfiguration("editor"),
						];

						Promise.all(configurationRequests)
							.then((configs) => {
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

								let [somesass, editor] = configs as [
									Partial<LanguageServerConfiguration | ConfigurationV1>,
									Partial<EditorConfiguration>,
								];

								const configuration = applyConfiguration(somesass, editor);

								return applyCustomData(configuration)
									.then(() =>
										fileSystemProvider!.findFiles(
											"**/*.{css,scss,sass,svelte,astro,vue}",
											configuration.workspace.exclude,
										),
									)
									.then((files) => {
										this.log.debug(
											`Found ${files.length} files, starting parse`,
										);

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
										resolveInitialScan();
									})
									.catch((reason) => rejectInitialScan(reason));
							})
							.catch((reason) => rejectInitialScan(reason));
					},
				);
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

				const diagnostics = await ls.doDiagnostics(document);

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
				const error = e as Error;
				this.log.debug(String(error));
				if (error.stack) this.log.debug(error.stack);
			}
		});

		documents.onDidChangeContent(async (params) => {
			if (!workspaceScanner || !ls) return;
			try {
				ls.onDocumentChanged(params.document);
				await doDiagnostics(params);
			} catch (e) {
				const error = e as Error;
				this.log.debug(String(error));
				if (error.stack) this.log.debug(error.stack);
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
				const error = e as Error;
				this.log.debug(String(error));
				if (error.stack) this.log.debug(error.stack);
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
				const error = e as Error;
				this.log.debug(String(error));
				if (error.stack) this.log.debug(error.stack);
				return null;
			}
		});

		this.connection.onDocumentSymbol(async (params) => {
			if (!ls) return null;
			try {
				const document = getSassRegionsDocument(
					documents.get(params.textDocument.uri),
				);
				if (!document) return null;

				const config = this.languageConfiguration(document);
				if (config.documentSymbols.enabled) {
					const result = ls.findDocumentSymbols(document);
					return result;
				} else {
					return null;
				}
			} catch (e) {
				const error = e as Error;
				this.log.debug(String(error));
				if (error.stack) this.log.debug(error.stack);
				return null;
			}
		});

		this.connection.onHover(async (params) => {
			if (!ls) return null;
			try {
				const document = getSassRegionsDocument(
					documents.get(params.textDocument.uri),
					params.position,
				);
				if (!document) return null;

				const config = this.languageConfiguration(document);
				if (config.hover.enabled) {
					const result = await ls.doHover(document, params.position);
					return result;
				} else {
					return null;
				}
			} catch (e) {
				const error = e as Error;
				this.log.debug(String(error));
				if (error.stack) this.log.debug(error.stack);
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
				const error = e as Error;
				this.log.debug(String(error));
				if (error.stack) this.log.debug(error.stack);
				return null;
			}
		});

		this.connection.onDefinition(async (params) => {
			if (!ls) return null;
			try {
				const document = getSassRegionsDocument(
					documents.get(params.textDocument.uri),
					params.position,
				);
				if (!document) return null;

				const config = this.languageConfiguration(document);
				if (config.definition.enabled) {
					const result = await ls.findDefinition(document, params.position);
					return result;
				} else {
					return null;
				}
			} catch (e) {
				const error = e as Error;
				this.log.debug(String(error));
				if (error.stack) this.log.debug(error.stack);
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
					if (initialScan) {
						await initialScan;
					}
					const result = ls.findDocumentHighlights(document, params.position);
					return result;
				} else {
					return null;
				}
			} catch (e) {
				const error = e as Error;
				this.log.debug(String(error));
				if (error.stack) this.log.debug(error.stack);
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
					return result.filter((link) => {
						// Filter out links that don't lead anywhere (#256).
						// Done here since we rely on findDocumentLinks returning
						// these links for other features internally (completions).
						return !link.target?.startsWith("sass:");
					});
				} else {
					return null;
				}
			} catch (e) {
				const error = e as Error;
				this.log.debug(String(error));
				if (error.stack) this.log.debug(error.stack);
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
				const error = e as Error;
				this.log.debug(String(error));
				if (error.stack) this.log.debug(error.stack);
				return null;
			}
		});

		this.connection.onWorkspaceSymbol((params) => {
			if (!ls) return null;
			try {
				const result = ls.findWorkspaceSymbols(params.query);
				return result;
			} catch (e) {
				const error = e as Error;
				this.log.debug(String(error));
				if (error.stack) this.log.debug(error.stack);
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
				const error = e as Error;
				this.log.debug(String(error));
				if (error.stack) this.log.debug(error.stack);
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
				const error = e as Error;
				this.log.debug(String(error));
				if (error.stack) this.log.debug(error.stack);
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
				const error = e as Error;
				this.log.debug(String(error));
				if (error.stack) this.log.debug(error.stack);
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
				const error = e as Error;
				this.log.debug(String(error));
				if (error.stack) this.log.debug(error.stack);
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
				const error = e as Error;
				this.log.debug(String(error));
				if (error.stack) this.log.debug(error.stack);
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
				const error = e as Error;
				this.log.debug(String(error));
				if (error.stack) this.log.debug(error.stack);
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
				const error = e as Error;
				this.log.debug(String(error));
				if (error.stack) this.log.debug(error.stack);
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
