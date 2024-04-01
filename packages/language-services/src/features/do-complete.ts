import {
	TokenType,
	IToken,
	NodeType,
	CompletionItem,
	FunctionDeclaration,
	MixinDeclaration,
	InsertTextFormat,
	FunctionParameter,
	CompletionItemKind,
	Use,
	Forward,
	Node,
	Module,
	MarkupKind,
	SymbolKind,
	CompletionItemTag,
} from "@somesass/vscode-css-languageservice";
import ColorDotJS from "colorjs.io";
import { SassBuiltInModule, sassBuiltInModules } from "../facts/sass";
import { sassDocAnnotations } from "../facts/sassdoc";
import { LanguageFeature } from "../language-feature";
import {
	CompletionList,
	FileType,
	Position,
	TextDocument,
	URI,
	Utils,
	getNodeAtOffset,
} from "../language-services-types";
import { asDollarlessVariable } from "../utils/sass";
import { applySassDoc } from "../utils/sassdoc";
import { getName } from "../utils/uri";

const reNewSassdocBlock = /\/\/\/\s?$/;
const reSassdocLine = /\/\/\/\s/;
const reSassExt = /\.s(a|c)ss$/;
const rePrivate = /^\$?[_].*$/;

export class DoComplete extends LanguageFeature {
	async doComplete(
		document: TextDocument,
		position: Position,
	): Promise<CompletionList> {
		const result = CompletionList.create([]);

		const stylesheet = this.ls.parseStylesheet(document);
		const offset = document.offsetAt(position);
		const node = getNodeAtOffset(stylesheet, offset);

		// If the document begins with a comment, the Stylesheet node does not begin at offset 0,
		// instead starting where the comment block ends. In that case node may be null. Otherwise
		// if we get NodeType.Stylesheet, it's likely we're in a comment context and want to check
		// if it's Sassdoc.
		const isMaybeSassdocContext =
			(!node && stylesheet.offset !== 0) ||
			(node && node.type === NodeType.Stylesheet);
		if (isMaybeSassdocContext) {
			const scanner = this.getScanner(document);
			let token: IToken = scanner.scan();
			let prevToken: IToken | null = null;
			while (token.type !== TokenType.EOF) {
				// Lookback is needed to figure out if we should do Sassdoc block completion.
				// It should happen if we hit a function or mixin declaration with `///`
				// (and an optional space) as the previous token. If we overshoot offset
				// and that has not happened we don't really care about the rest of the
				// document and break out of the loop.
				if (prevToken && prevToken.offset + prevToken.len > offset) {
					break;
				}

				// Don't start processing the token until we've reached the token under the cursor
				if (token.offset + token.len < offset) {
					prevToken = token;
					token = scanner.scan();
					continue;
				}

				if (token.type === TokenType.AtKeyword) {
					const keyword = token.text.toLowerCase();
					const isFunction = keyword === "@function";
					const isMixin = keyword === "@mixin";
					if (isFunction || isMixin) {
						if (prevToken && prevToken.text.match(reNewSassdocBlock)) {
							const node = getNodeAtOffset(stylesheet, token.offset);
							if (
								node &&
								(node instanceof MixinDeclaration ||
									node instanceof FunctionDeclaration)
							) {
								const item = this.doSassdocBlockCompletion(document, node);
								result.items.push(item);
							}
						}
					}
				}

				if (
					token.type === TokenType.Comment &&
					token.text.match(reSassdocLine)
				) {
					const beforeCursor = token.text.substring(0, offset - token.offset);
					const items = this.doSassdocAnnotationCompletion(beforeCursor);
					result.items.push(...items);
				}

				prevToken = token;
				token = scanner.scan();
			}

			if (result.items.length > 0) {
				return result;
			}
		}

		// Same as for Sassdoc, but if we reach this point we can assume it's a regular comment block
		// where we don't want to provide any suggestions.
		const isCommentContext = !node || node.type === NodeType.Stylesheet;
		if (isCommentContext) {
			return result;
		}

		if (
			node &&
			node.parent &&
			(node.parent instanceof Use || node.parent instanceof Forward)
		) {
			// Upstream includes thing like suggestions based on relative paths
			// and imports of built-in sass modules like sass:color and sass:math
			const upstreamResult = await this._internal.scssLs.doComplete2(
				document,
				position,
				stylesheet,
				this.getDocumentContext(),
				// TODO: pass on CompletionSettings
			);
			if (upstreamResult.items.length > 0) {
				result.items.push(...upstreamResult.items);
			}
			const items = await this.doModuleImportCompletion(document, node);
			if (items.length > 0) {
				result.items.push(...items);
			}
			return result;
		}

		if (node instanceof Module) {
			const items = await this.doNamespaceCompletion(document, node);
			if (items.length > 0) {
				result.items.push(...items);
			}
		}

		// TODO: isPlaceholderDeclarationContext, doPlaceholderDeclarationComplete
		// TODO: hasWildcardNamespace, this.findInWorkspace (extended with a "links" parameter limited to wildcard links) completionItems

		// TODO: placeholder complete
		const suggestFromUseOnly = false; // TODO: get CompletionSettings via configure and read here
		if (!suggestFromUseOnly) {
			// TODO: @import-style fallback complete
		}
		// TODO: isImportContext, doImportComplete for node_modules stuff

		const upstreamResult = await this._internal.scssLs.doComplete2(
			document,
			position,
			stylesheet,
			this.getDocumentContext(),
			// TODO: pass on CompletionSettings
		);
		if (upstreamResult.items.length > 0) {
			result.items.push(...upstreamResult.items);
		}
		return result;
	}

	async doNamespaceCompletion(
		document: TextDocument,
		node: Module,
	): Promise<CompletionItem[]> {
		const items: CompletionItem[] = [];

		const namespace: string | undefined = node.getIdentifier()?.getText();
		if (!namespace) {
			return items;
		}

		const links = await this.ls.findDocumentLinks(document);
		let start: TextDocument | undefined = undefined;
		for (const link of links) {
			if (
				link.target &&
				link.type === NodeType.Use &&
				link.namespace === namespace
			) {
				if (link.target.includes("sass:")) {
					// Look for matches in built-in namespaces, which do not appear in storage
					for (const [builtIn, docs] of Object.entries(sassBuiltInModules)) {
						if (builtIn === link.target) {
							const items = this.doSassBuiltInCompletion(document, node, docs);
							return items;
						}
					}
				} else {
					start = this._internal.cache.document(link.target);
				}
				break;
			}
		}

		if (!start) {
			return items;
		}

		const result = await this.findInWorkspace<CompletionItem>(
			async (currentDocument, prefix, hide, show) => {
				const items: CompletionItem[] = [];
				const symbols = this.ls.findDocumentSymbols(currentDocument);
				for (const symbol of symbols) {
					if (show.length > 0 && !show.includes(symbol.name)) {
						continue;
					}
					if (hide.includes(symbol.name)) {
						continue;
					}
					const isPrivate = symbol.name.match(rePrivate);
					if (isPrivate && currentDocument.uri !== document.uri) {
						continue;
					}

					switch (symbol.kind) {
						case SymbolKind.Variable: {
							// Avoid ending up with namespace.prefix-$variable
							const label = `$${prefix}${asDollarlessVariable(symbol.name)}`;
							const rawValue = this.getVariableValue(document, symbol);
							const value = await this.ls.findValue(
								document,
								symbol.selectionRange.start,
							);
							const color = value ? getColorValue(value) : null;
							const completionKind = color
								? CompletionItemKind.Color
								: CompletionItemKind.Variable;

							let documentation =
								color ||
								[
									"```scss",
									`${label}: ${value};${
										value !== rawValue ? ` // via ${rawValue}` : ""
									}`,
									"```",
								].join("\n") ||
								"";
							const sassdoc = applySassDoc(symbol);
							if (sassdoc) {
								documentation += `\n____\n${sassdoc}`;
							}
							documentation += `\n____\nVariable declared in ${this.getFileName(currentDocument)}`;

							const sortText = isPrivate
								? label.replace(/^$[_]/, "")
								: undefined;

							let filterText: string | undefined;
							let insertText: string | undefined;

							// TODO: regression-test the replacement issues with . and $ in SCSS and Astro/Vue/Svelte
							// const isEmbedded = !currentDocument.languageId.match(reSassExt);

							const item: CompletionItem = {
								commitCharacters: [";", ","],
								documentation:
									completionKind === CompletionItemKind.Color
										? documentation
										: {
												kind: MarkupKind.Markdown,
												value: documentation,
											},
								filterText,
								kind: completionKind,
								label,
								insertText,
								sortText,
								tags: symbol.sassdoc?.deprecated
									? [CompletionItemTag.Deprecated]
									: [],
							};
							items.push(item);
							break;
						}
						case SymbolKind.Method: {
							break;
						}
						case SymbolKind.Function: {
							break;
						}
						case SymbolKind.Class: {
							// TODO: these completions shouldn't be _here_ though, should they?
							if (!symbol.name.startsWith("%")) {
								break;
							}

							let documentation = symbol.name;
							const sassdoc = applySassDoc(symbol);
							if (sassdoc) {
								documentation += `\n____\n${sassdoc}`;
							}

							const filterText = symbol.name.substring(1);

							const item: CompletionItem = {
								detail: `Placeholder declared in ${this.getFileName(currentDocument)}`,
								documentation: {
									kind: "markdown",
									value: documentation,
								},
								filterText,
								insertText: filterText,
								insertTextFormat: InsertTextFormat.Snippet,
								kind: CompletionItemKind.Class,
								label: symbol.name,
								tags: symbol.sassdoc?.deprecated
									? [CompletionItemTag.Deprecated]
									: undefined,
							};
							items.push(item);
							break;
						}
					}
				}
				return items;
			},
			start,
		);
		return result;
	}

	doSassBuiltInCompletion(
		document: TextDocument,
		node: Module,
		moduleDocs: SassBuiltInModule,
	): CompletionItem[] {
		const items: CompletionItem[] = [];
		for (const [name, docs] of Object.entries(moduleDocs.exports)) {
			const { description, signature, parameterSnippet, returns } = docs;
			// Client needs the namespace as part of the text that is matched,
			const filterText = `${node.getIdentifier()}.${name}`;

			// Inserted text needs to include the `.` which will otherwise
			// be replaced (except when we're embedded in Vue, Svelte or Astro).
			// Example result: .floor(${1:number})
			const isEmbedded = document.languageId !== "scss";
			const insertText = node.getText().includes(".")
				? `${isEmbedded ? "" : "."}${name}${
						signature ? `(${parameterSnippet})` : ""
					}`
				: name;

			items.push({
				label: name,
				filterText,
				insertText,
				insertTextFormat: parameterSnippet
					? InsertTextFormat.Snippet
					: InsertTextFormat.PlainText,
				labelDetails: {
					detail:
						signature && returns ? `${signature} => ${returns}` : signature,
				},
				documentation: {
					kind: MarkupKind.Markdown,
					value: `${description}\n\n[Sass documentation](${moduleDocs.reference}#${name})`,
				},
			});
		}

		return items;
	}

	async doModuleImportCompletion(
		document: TextDocument,
		node: Node,
	): Promise<CompletionItem[]> {
		const items: CompletionItem[] = [];
		const url = node.getText().replace(/["']/g, "");

		const moduleName = getModuleNameFromPath(url);
		if (moduleName && moduleName !== "." && moduleName !== "..") {
			const rootFolderUri = this.configuration.workspaceRoot
				? Utils.joinPath(this.configuration.workspaceRoot, "/").toString(true)
				: "";
			const documentFolderUri = Utils.dirname(URI.parse(document.uri)).toString(
				true,
			);

			const modulePath = await this.resolvePathToModule(
				moduleName,
				documentFolderUri,
				rootFolderUri,
			);
			if (modulePath) {
				const pathWithinModule = url.substring(moduleName.length + 1);
				const pathInsideModule = Utils.joinPath(
					URI.parse(modulePath),
					pathWithinModule,
				);
				const filesInModulePath =
					await this.options.fileSystemProvider.readDirectory(pathInsideModule);
				for (const [uri, fileType] of filesInModulePath) {
					const file = getName(uri);
					if (fileType === FileType.File && file.match(reSassExt)) {
						const filename = file.startsWith("/") ? file.slice(1) : file;
						// Prefer to insert without file extension
						let insertText = filename.slice(0, -5);
						if (insertText.startsWith("/")) {
							insertText = insertText.slice(1);
						}
						if (insertText.startsWith("_")) {
							insertText = insertText.slice(1);
						}
						items.push({
							label: escapePath(filename),
							insertText: escapePath(insertText),
							kind: CompletionItemKind.File,
						});
					} else if (fileType === FileType.Directory) {
						let insertText = escapePath(file);
						if (insertText.startsWith("/")) {
							insertText = insertText.slice(1);
						}
						insertText = `${insertText}/`;
						items.push({
							label: insertText,
							kind: CompletionItemKind.Folder,
							insertText,
							command: {
								title: "Suggest",
								command: "editor.action.triggerSuggest",
							},
						});
					}
				}
			}
		}

		return items;
	}

	async resolvePathToModule(
		_moduleName: string,
		documentFolderUri: string,
		rootFolderUri: string | undefined,
	): Promise<string | undefined> {
		// resolve the module relative to the document. We can't use `require` here as the code is webpacked.

		const packPath = Utils.joinPath(
			URI.parse(documentFolderUri),
			"node_modules",
			_moduleName,
			"package.json",
		);
		if (await this.options.fileSystemProvider.exists(packPath)) {
			return Utils.dirname(packPath).toString(true);
		} else if (
			rootFolderUri &&
			documentFolderUri.startsWith(rootFolderUri) &&
			documentFolderUri.length !== rootFolderUri.length
		) {
			return this.resolvePathToModule(
				_moduleName,
				Utils.dirname(URI.parse(documentFolderUri)).toString(true),
				rootFolderUri,
			);
		}
		return undefined;
	}

	doSassdocAnnotationCompletion(beforeCursor: string): CompletionItem[] {
		if (beforeCursor.includes("@example")) {
			return [
				{
					label: "scss",
					sortText: "-", // Give highest priority
					kind: CompletionItemKind.Value,
				},
				{
					label: "css",
					kind: CompletionItemKind.Value,
				},
				{
					label: "markup",
					kind: CompletionItemKind.Value,
				},
				{
					label: "javascript",
					sortText: "y", // Give lowest priority
					kind: CompletionItemKind.Value,
				},
			];
		}

		const items: CompletionItem[] = [];
		for (const {
			annotation,
			aliases,
			insertText,
			insertTextFormat,
		} of sassDocAnnotations) {
			const item = {
				label: annotation,
				kind: CompletionItemKind.Keyword,
				insertText,
				insertTextFormat,
				sortText: "-", // Give highest priority
			};

			items.push(item);

			if (aliases) {
				for (const alias of aliases) {
					items.push({
						...item,
						label: alias,
						insertText: insertText
							? insertText.replace(annotation, alias)
							: insertText,
					});
				}
			}
		}

		return items;
	}

	/**
	 * Generates a suggestion for a Sassdoc block above a mixin or function that includes its parameters.
	 */
	doSassdocBlockCompletion(
		document: TextDocument,
		node: FunctionDeclaration | MixinDeclaration,
	): CompletionItem {
		const isMixin = node.type === NodeType.MixinDeclaration;

		// Incremented when used, starting at position zero below.
		// This ensures each snippet gets a unique tab position, ending at
		// position 0 which is the description for the block itself.
		let position = 0;
		let snippet = ` \${${position++}}`; // " ${0}"

		const parameters = node
			.getParameters()
			.getChildren() as FunctionParameter[];

		for (const parameter of parameters) {
			const name = parameter.getName();
			const defaultValue = parameter.getDefaultValue()?.getText();
			let typeSnippet = "type";
			let defaultValueSnippet = "";
			if (defaultValue) {
				defaultValueSnippet = ` [${defaultValue}]`;

				// Try to give a sensible default type if we can
				if (defaultValue === "true" || defaultValue === "false") {
					typeSnippet = "Boolean";
				} else if (/^["']/.exec(defaultValue)) {
					typeSnippet = "String";
				} else if (
					defaultValue.startsWith("#") ||
					defaultValue.startsWith("rgb") ||
					defaultValue.startsWith("hsl")
				) {
					typeSnippet = "Color";
				} else {
					const maybeNumber = Number.parseFloat(defaultValue);
					if (!Number.isNaN(maybeNumber)) {
						typeSnippet = "Number";
					}
				}
			}

			// A parameter snippet such as the one below. The escape sequence "\\${name}" is needed to get the $ of variable names as part of the snippet output.
			// "/// @param {$1:Number} \$start [0] ${2:-}"
			snippet += `\n/// @param {\${${position++}:${typeSnippet}}} \\${name}${defaultValueSnippet} \${${position++}:-}`;
		}

		if (isMixin) {
			const text = node.getText();
			const hasContentAtKeyword = text.includes("@content");
			if (hasContentAtKeyword) {
				snippet += `\n/// @content \${${position++}}`;
			}
			snippet += `\n/// @output \${${position++}}`;
		} else {
			snippet += `\n/// @return \${${position++}}`;
		}

		return {
			label: "SassDoc Block",
			insertText: snippet,
			insertTextFormat: InsertTextFormat.Snippet,
			sortText: "-", // Give highest priority
		};
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

function getColorValue(from: string): string | null {
	try {
		ColorDotJS.parse(from);
		return from;
	} catch {
		return null;
	}
}
