/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
"use strict";

import {
	AliasSettings,
	Color,
	ColorInformation,
	ColorPresentation,
	DocumentHighlight,
	DocumentHighlightKind,
	Location,
	Position,
	Range,
	SymbolInformation,
	SymbolKind,
	TextEdit,
	WorkspaceEdit,
	TextDocument,
	DocumentContext,
	FileSystemProvider,
	FileType,
	DocumentSymbol,
	StylesheetDocumentLink,
} from "../cssLanguageTypes";
import * as l10n from "@vscode/l10n";
import * as nodes from "../parser/cssNodes";
import { Symbols } from "../parser/cssSymbolScope";
import {
	getColorValue,
	hslFromColor,
	hwbFromColor,
	labFromColor,
	lchFromColor,
	oklabFromColor,
	oklchFromColor,
} from "../languageFacts/facts";
import { startsWith } from "../utils/strings";
import { dirname, joinPath } from "../utils/resources";

type UnresolvedLinkData = { link: StylesheetDocumentLink; isRawLink: boolean };

type DocumentSymbolCollector = (
	name: string,
	kind: SymbolKind,
	symbolNodeOrRange: nodes.Node | Range,
	nameNodeOrRange: nodes.Node | Range | undefined,
	bodyNode: nodes.Node | undefined,
) => void;

const startsWithSchemeRegex = /^\w+:\/\//;
const startsWithData = /^data:/;
const startsWithSass = /^sass:/;

export class CSSNavigation {
	protected defaultSettings?: AliasSettings;
	protected loadPaths?: string[];

	constructor(
		protected fileSystemProvider: FileSystemProvider | undefined,
		private readonly resolveModuleReferences: boolean,
	) {}

	public configure(settings: AliasSettings | undefined, loadPaths: string[] | undefined) {
		this.defaultSettings = settings;
		this.loadPaths = loadPaths;
	}

	public findDefinition(document: TextDocument, position: Position, stylesheet: nodes.Node): Location | null {
		const symbols = new Symbols(stylesheet);
		const offset = document.offsetAt(position);
		const node = nodes.getNodeAtOffset(stylesheet, offset);

		if (!node) {
			return null;
		}

		const symbol = symbols.findSymbolFromNode(node);
		if (!symbol) {
			return null;
		}

		return {
			uri: document.uri,
			range: getRange(symbol.node, document),
		};
	}

	public findReferences(document: TextDocument, position: Position, stylesheet: nodes.Stylesheet): Location[] {
		const highlights = this.findDocumentHighlights(document, position, stylesheet);
		return highlights.map((h) => {
			return {
				uri: document.uri,
				range: h.range,
			};
		});
	}

	private getHighlightNode(
		document: TextDocument,
		position: Position,
		stylesheet: nodes.Stylesheet,
	): nodes.Node | undefined {
		const offset = document.offsetAt(position);
		let node = nodes.getNodeAtOffset(stylesheet, offset);
		if (
			!node ||
			node.type === nodes.NodeType.Stylesheet ||
			node.type === nodes.NodeType.Declarations ||
			node.type === nodes.NodeType.ModuleConfig
		) {
			return;
		}
		if (node.type === nodes.NodeType.Identifier && node.parent && node.parent.type === nodes.NodeType.ClassSelector) {
			node = node.parent;
		}

		return node;
	}

	public findDocumentHighlights(
		document: TextDocument,
		position: Position,
		stylesheet: nodes.Stylesheet,
	): DocumentHighlight[] {
		const result: DocumentHighlight[] = [];
		const node = this.getHighlightNode(document, position, stylesheet);
		if (!node) {
			return result;
		}

		const symbols = new Symbols(stylesheet);
		const symbol = symbols.findSymbolFromNode(node);
		const name = node.getText();

		stylesheet.accept((candidate) => {
			if (symbol) {
				if (symbols.matchesSymbol(candidate, symbol)) {
					result.push({
						kind: getHighlightKind(candidate),
						range: getRange(candidate, document),
					});
					return false;
				}
			} else if (node && node.type === candidate.type && candidate.matches(name)) {
				// Same node type and data
				result.push({
					kind: getHighlightKind(candidate),
					range: getRange(candidate, document),
				});
			}
			return true;
		});

		return result;
	}

	protected isRawStringDocumentLinkNode(node: nodes.Node): boolean {
		return node.type === nodes.NodeType.Import;
	}

	public findDocumentLinks(
		document: TextDocument,
		stylesheet: nodes.Stylesheet,
		documentContext: DocumentContext,
	): StylesheetDocumentLink[] {
		const linkData = this.findUnresolvedLinks(document, stylesheet);
		const resolvedLinks: StylesheetDocumentLink[] = [];
		for (let data of linkData) {
			const link = data.link;
			const target = link.target;
			if (!target || startsWithData.test(target)) {
				// no links for data:
			} else if (startsWithSchemeRegex.test(target)) {
				resolvedLinks.push(link);
			} else if (startsWithSass.test(target)) {
				resolvedLinks.push(link);
			} else {
				const resolved = documentContext.resolveReference(target, document.uri);
				if (resolved) {
					link.target = resolved;
				}
				resolvedLinks.push(link);
			}
		}
		return resolvedLinks;
	}

	public async findDocumentLinks2(
		document: TextDocument,
		stylesheet: nodes.Stylesheet,
		documentContext: DocumentContext,
	): Promise<StylesheetDocumentLink[]> {
		const linkData = this.findUnresolvedLinks(document, stylesheet);
		const resolvedLinks: StylesheetDocumentLink[] = [];
		for (let data of linkData) {
			const link = data.link;
			const target = link.target;
			if (!target || startsWithData.test(target)) {
				// no links for data:
			} else if (startsWithSchemeRegex.test(target)) {
				resolvedLinks.push(link);
			} else if (startsWithSass.test(target)) {
				const targetless = link;
				resolvedLinks.push(targetless);
			} else {
				const resolvedTarget = await this.resolveReference(target, document.uri, documentContext, data.isRawLink);
				if (resolvedTarget !== undefined) {
					link.target = resolvedTarget;
					resolvedLinks.push(link);
				}
			}
		}
		return resolvedLinks;
	}

	private findUnresolvedLinks(document: TextDocument, stylesheet: nodes.Stylesheet): UnresolvedLinkData[] {
		const result: UnresolvedLinkData[] = [];

		const collect = (uriStringNode: nodes.Node) => {
			const linkStatement = uriStringNode.parent;
			// There should always be a parent link statement
			if (!linkStatement) {
				return;
			}

			let rawUri = uriStringNode.getText();
			const range = getRange(uriStringNode, document);
			// Make sure the range is not empty
			if (range.start.line === range.end.line && range.start.character === range.end.character) {
				return;
			}

			if (startsWith(rawUri, `'`) || startsWith(rawUri, `"`)) {
				rawUri = rawUri.slice(1, -1);
			}

			const isRawLink = this.isRawStringDocumentLinkNode(linkStatement);
			const unresolved: UnresolvedLinkData = { link: { target: rawUri, range }, isRawLink };
			if (isRawLink) {
				unresolved.link.type = linkStatement.type;

				if (linkStatement.type === nodes.NodeType.Use) {
					const alias: nodes.Node | undefined = linkStatement
						.getChildren()
						.find((c) => c.type === nodes.NodeType.Identifier || c.type === nodes.NodeType.Value);

					const as = alias ? alias.getText() : undefined;
					if (as) {
						unresolved.link.as = as;
					}

					// Wildcard imports make symbols available in the document without a namespace,
					// so mirror that by not having a namespace for the link.
					if (as !== "*") {
						const namespace = as || getNamespaceFromLink(rawUri);
						unresolved.link.namespace = namespace;
					}
				} else if (linkStatement.type === nodes.NodeType.Forward) {
					const alias: nodes.Node | undefined = linkStatement
						.getChildren()
						.find((c) => c.type === nodes.NodeType.Identifier);

					const as = alias ? alias.getText() : undefined;
					if (as) {
						unresolved.link.as = as;
					}

					const visibility = linkStatement
						.getChildren()
						.find((c) => c.type === nodes.NodeType.ForwardVisibility)
						?.getChildren();
					if (visibility) {
						const [showOrHide, ...toShowOrHide] = visibility;
						const keyword = showOrHide.getText();
						const values = toShowOrHide.map((n) => n.getText());
						if (keyword === "show") {
							unresolved.link.show = values;
						} else if (keyword === "hide") {
							unresolved.link.hide = values;
						}
					}
				}
			}
			result.push(unresolved);
		};

		stylesheet.accept((candidate) => {
			if (candidate.type === nodes.NodeType.URILiteral) {
				const first = candidate.getChild(0);
				if (first) {
					collect(first);
				}
				return false;
			}

			/**
			 * In @import, it is possible to include links that do not use `url()`
			 * For example, `@import 'foo.css';`
			 */
			if (candidate.parent && this.isRawStringDocumentLinkNode(candidate.parent)) {
				const rawText = candidate.getText();
				if (startsWith(rawText, `'`) || startsWith(rawText, `"`)) {
					collect(candidate);
				} else if (document.languageId === "sass" && candidate.type === nodes.NodeType.StringLiteral) {
					// In the Sass indented syntax the string quotes are optional for @import
					collect(candidate);
				}
				return false;
			}

			return true;
		});

		return result;
	}

	public findSymbolInformations(document: TextDocument, stylesheet: nodes.Stylesheet): SymbolInformation[] {
		const result: SymbolInformation[] = [];

		const addSymbolInformation = (name: string, kind: SymbolKind, symbolNodeOrRange: nodes.Node | Range) => {
			const range = symbolNodeOrRange instanceof nodes.Node ? getRange(symbolNodeOrRange, document) : symbolNodeOrRange;
			const entry: SymbolInformation = {
				name: name || l10n.t("<undefined>"),
				kind,
				location: Location.create(document.uri, range),
			};
			result.push(entry);
		};

		this.collectDocumentSymbols(document, stylesheet, addSymbolInformation);

		return result;
	}

	public findDocumentSymbols(document: TextDocument, stylesheet: nodes.Stylesheet): DocumentSymbol[] {
		const result: DocumentSymbol[] = [];

		const parents: [DocumentSymbol, Range][] = [];

		const addDocumentSymbol = (
			name: string,
			kind: SymbolKind,
			symbolNodeOrRange: nodes.Node | Range,
			nameNodeOrRange: nodes.Node | Range | undefined,
			bodyNode: nodes.Node | undefined,
		) => {
			const range = symbolNodeOrRange instanceof nodes.Node ? getRange(symbolNodeOrRange, document) : symbolNodeOrRange;
			let selectionRange =
				nameNodeOrRange instanceof nodes.Node ? getRange(nameNodeOrRange, document) : nameNodeOrRange;
			if (!selectionRange || !containsRange(range, selectionRange)) {
				selectionRange = Range.create(range.start, range.start);
			}

			const entry: DocumentSymbol = {
				name: name || l10n.t("<undefined>"),
				kind,
				range,
				selectionRange,
			};

			if (
				symbolNodeOrRange instanceof nodes.MixinDeclaration ||
				symbolNodeOrRange instanceof nodes.FunctionDeclaration
			) {
				const parameters = symbolNodeOrRange.getParameters().getChildren();
				if (parameters.length > 0) {
					const signatureParts: string[] = [];
					for (const parameter of parameters) {
						if (parameter instanceof nodes.FunctionParameter) {
							const name = parameter.getName();
							const defaultValue = parameter.getDefaultValue();
							if (defaultValue) {
								signatureParts.push(`${name}: ${defaultValue.getText()}`);
							} else {
								signatureParts.push(name);
							}
						}
					}
					entry.detail = `(${signatureParts.join(", ")})`;
				}
			}

			let top = parents.pop();
			while (top && !containsRange(top[1], range)) {
				top = parents.pop();
			}
			if (top) {
				const topSymbol = top[0];
				if (!topSymbol.children) {
					topSymbol.children = [];
				}
				topSymbol.children.push(entry);
				parents.push(top); // put back top
			} else {
				result.push(entry);
			}
			if (bodyNode) {
				parents.push([entry, getRange(bodyNode, document)]);
			}
		};

		this.collectDocumentSymbols(document, stylesheet, addDocumentSymbol);

		return result;
	}

	private collectDocumentSymbols(
		document: TextDocument,
		stylesheet: nodes.Stylesheet,
		collect: DocumentSymbolCollector,
	): void {
		stylesheet.accept((node) => {
			if (node instanceof nodes.RuleSet) {
				for (const selector of node.getSelectors().getChildren()) {
					if (selector instanceof nodes.Selector) {
						const range = Range.create(document.positionAt(selector.offset), document.positionAt(node.end));
						collect(selector.getText(), SymbolKind.Class, range, selector, node.getDeclarations());
					}
				}
			} else if (node instanceof nodes.VariableDeclaration) {
				collect(node.getName(), SymbolKind.Variable, node, node.getVariable(), undefined);
			} else if (node instanceof nodes.MixinDeclaration) {
				collect(node.getName(), SymbolKind.Method, node, node.getIdentifier(), node.getDeclarations());
			} else if (node instanceof nodes.FunctionDeclaration) {
				collect(node.getName(), SymbolKind.Function, node, node.getIdentifier(), node.getDeclarations());
			} else if (node instanceof nodes.Keyframe) {
				const name = l10n.t("@keyframes {0}", node.getName());
				collect(name, SymbolKind.Class, node, node.getIdentifier(), node.getDeclarations());
			} else if (node instanceof nodes.FontFace) {
				const name = l10n.t("@font-face");
				collect(name, SymbolKind.Class, node, undefined, node.getDeclarations());
			} else if (node instanceof nodes.Media) {
				const mediaList = node.getChild(0);
				if (mediaList instanceof nodes.Medialist) {
					const name = "@media " + mediaList.getText();
					collect(name, SymbolKind.Module, node, mediaList, node.getDeclarations());
				}
			} else if (node instanceof nodes.Scope) {
				let scopeName = "";

				const scopeLimits = node.getChild(0);
				if (scopeLimits instanceof nodes.ScopeLimits) {
					scopeName = `${scopeLimits.getName()}`;
				}

				collect(
					`@scope${scopeName ? ` ${scopeName}` : ""}`,
					SymbolKind.Module,
					node,
					scopeLimits ?? undefined,
					node.getDeclarations(),
				);
			} else if (node.type === nodes.NodeType.SelectorPlaceholder) {
				const parent = node.getParent();
				// avoid duplicating when used as a selector
				if (parent && parent instanceof nodes.ExtendsReference) {
					const range = Range.create(document.positionAt(node.offset), document.positionAt(node.end));
					collect(node.getText(), SymbolKind.Class, range, node, undefined);
				}
			}
			return true;
		});
	}

	public findDocumentColors(document: TextDocument, stylesheet: nodes.Stylesheet): ColorInformation[] {
		const result: ColorInformation[] = [];
		stylesheet.accept((node) => {
			const colorInfo = getColorInformation(node, document);
			if (colorInfo) {
				result.push(colorInfo);
			}
			return true;
		});
		return result;
	}

	public getColorPresentations(
		document: TextDocument,
		stylesheet: nodes.Stylesheet,
		color: Color,
		range: Range,
	): ColorPresentation[] {
		const result: ColorPresentation[] = [];
		const red256 = Math.round(color.red * 255),
			green256 = Math.round(color.green * 255),
			blue256 = Math.round(color.blue * 255);

		let label;
		if (color.alpha === 1) {
			label = `rgb(${red256}, ${green256}, ${blue256})`;
		} else {
			label = `rgba(${red256}, ${green256}, ${blue256}, ${color.alpha})`;
		}
		result.push({ label: label, textEdit: TextEdit.replace(range, label) });

		if (color.alpha === 1) {
			label = `#${toTwoDigitHex(red256)}${toTwoDigitHex(green256)}${toTwoDigitHex(blue256)}`;
		} else {
			label = `#${toTwoDigitHex(red256)}${toTwoDigitHex(green256)}${toTwoDigitHex(blue256)}${toTwoDigitHex(Math.round(color.alpha * 255))}`;
		}
		result.push({ label: label, textEdit: TextEdit.replace(range, label) });

		const hsl = hslFromColor(color);
		if (hsl.a === 1) {
			label = `hsl(${hsl.h}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)`;
		} else {
			label = `hsla(${hsl.h}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%, ${hsl.a})`;
		}
		result.push({ label: label, textEdit: TextEdit.replace(range, label) });

		const hwb = hwbFromColor(color);
		if (hwb.a === 1) {
			label = `hwb(${hwb.h} ${Math.round(hwb.w * 100)}% ${Math.round(hwb.b * 100)}%)`;
		} else {
			label = `hwb(${hwb.h} ${Math.round(hwb.w * 100)}% ${Math.round(hwb.b * 100)}% / ${hwb.a})`;
		}
		result.push({ label: label, textEdit: TextEdit.replace(range, label) });

		const lab = labFromColor(color);
		if (lab.alpha === 1) {
			label = `lab(${lab.l}% ${lab.a} ${lab.b})`;
		} else {
			label = `lab(${lab.l}% ${lab.a} ${lab.b} / ${lab.alpha})`;
		}
		result.push({ label: label, textEdit: TextEdit.replace(range, label) });

		const lch = lchFromColor(color);
		if (lch.alpha === 1) {
			label = `lch(${lch.l}% ${lch.c} ${lch.h})`;
		} else {
			label = `lch(${lch.l}% ${lch.c} ${lch.h} / ${lch.alpha})`;
		}
		result.push({ label: label, textEdit: TextEdit.replace(range, label) });

		const oklab = oklabFromColor(color);
		label =
			oklab.alpha === 1
				? `oklab(${oklab.l}% ${oklab.a} ${oklab.b})`
				: `oklab(${oklab.l}% ${oklab.a} ${oklab.b} / ${oklab.alpha})`;
		result.push({ label: label, textEdit: TextEdit.replace(range, label) });

		const oklch = oklchFromColor(color);
		label =
			oklch.alpha === 1
				? `oklch(${oklch.l}% ${oklch.c} ${oklch.h})`
				: `oklch(${oklch.l}% ${oklch.c} ${oklch.h} / ${oklch.alpha})`;
		result.push({ label: label, textEdit: TextEdit.replace(range, label) });

		return result;
	}

	public prepareRename(document: TextDocument, position: Position, stylesheet: nodes.Stylesheet): Range | undefined {
		const node = this.getHighlightNode(document, position, stylesheet);
		if (node) {
			return Range.create(document.positionAt(node.offset), document.positionAt(node.end));
		}
	}

	public doRename(
		document: TextDocument,
		position: Position,
		newName: string,
		stylesheet: nodes.Stylesheet,
	): WorkspaceEdit {
		const highlights = this.findDocumentHighlights(document, position, stylesheet);
		const edits = highlights.map((h) => TextEdit.replace(h.range, newName));
		return {
			changes: { [document.uri]: edits },
		};
	}

	protected async resolveModuleReference(
		ref: string,
		documentUri: string,
		documentContext: DocumentContext,
	): Promise<string | undefined> {
		if (startsWith(documentUri, "file://")) {
			const moduleName = getModuleNameFromPath(ref);
			if (moduleName && moduleName !== "." && moduleName !== "..") {
				const rootFolderUri = documentContext.resolveReference("/", documentUri);
				const documentFolderUri = dirname(documentUri);
				const modulePath = await this.resolvePathToModule(moduleName, documentFolderUri, rootFolderUri);
				if (modulePath) {
					const pathWithinModule = ref.substring(moduleName.length + 1);
					return joinPath(modulePath, pathWithinModule);
				}
			}
		}
		return undefined;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected async mapReference(target: string | undefined, isRawLink: boolean): Promise<string | undefined> {
		return target;
	}

	protected async resolveReference(
		target: string,
		documentUri: string,
		documentContext: DocumentContext,
		isRawLink = false,
		settings = this.defaultSettings,
	): Promise<string | undefined> {
		// Following [css-loader](https://github.com/webpack-contrib/css-loader#url)
		// and [sass-loader's](https://github.com/webpack-contrib/sass-loader#imports)
		// convention, if an import path starts with ~ then use node module resolution
		// *unless* it starts with "~/" as this refers to the user's home directory.
		if (target[0] === "~" && target[1] !== "/" && this.fileSystemProvider) {
			target = target.substring(1);
			return this.mapReference(await this.resolveModuleReference(target, documentUri, documentContext), isRawLink);
		}

		const ref = await this.mapReference(documentContext.resolveReference(target, documentUri), isRawLink);

		// Following [less-loader](https://github.com/webpack-contrib/less-loader#imports)
		// and [sass-loader's](https://github.com/webpack-contrib/sass-loader#resolving-import-at-rules)
		// new resolving import at-rules (~ is deprecated). The loader will first try to resolve @import as a relative path. If it cannot be resolved,
		// then the loader will try to resolve @import inside node_modules.
		if (this.resolveModuleReferences) {
			if (ref && (await this.fileExists(ref))) {
				return ref;
			}

			const moduleReference = await this.mapReference(
				await this.resolveModuleReference(target, documentUri, documentContext),
				isRawLink,
			);
			if (moduleReference) {
				return moduleReference;
			}
		}

		// Try resolving the reference from the language configuration alias settings or loadPaths
		if (ref && !(await this.fileExists(ref))) {
			const rootFolderUri = documentContext.resolveReference("/", documentUri);
			if (settings && rootFolderUri) {
				// Specific file reference
				if (target in settings) {
					return this.mapReference(joinPath(rootFolderUri, settings[target]), isRawLink);
				}
				// Reference folder
				const firstSlash = target.indexOf("/");
				const prefix = `${target.substring(0, firstSlash)}/`;
				if (prefix in settings) {
					const aliasPath = settings[prefix].slice(0, -1);
					let newPath = joinPath(rootFolderUri, aliasPath);
					return this.mapReference((newPath = joinPath(newPath, target.substring(prefix.length - 1))), isRawLink);
				}
			}
			if (this.loadPaths && rootFolderUri) {
				for (let loadPath of this.loadPaths) {
					let newPath = joinPath(rootFolderUri, loadPath, target);
					let ref = await this.mapReference(newPath, isRawLink);
					if (ref) {
						let exists = await this.fileExists(ref);
						if (exists) {
							return ref;
						}
					}
				}
			}
		}

		// fall back. it might not exists
		return ref;
	}

	protected async resolvePathToModule(
		_moduleName: string,
		documentFolderUri: string,
		rootFolderUri: string | undefined,
	): Promise<string | undefined> {
		// resolve the module relative to the document. We can't use `require` here as the code is webpacked.

		const packPath = joinPath(documentFolderUri, "node_modules", _moduleName, "package.json");
		if (await this.fileExists(packPath)) {
			return dirname(packPath);
		} else if (
			rootFolderUri &&
			documentFolderUri.startsWith(rootFolderUri) &&
			documentFolderUri.length !== rootFolderUri.length
		) {
			return this.resolvePathToModule(_moduleName, dirname(documentFolderUri), rootFolderUri);
		}
		return undefined;
	}

	protected async fileExists(uri: string): Promise<boolean> {
		if (!this.fileSystemProvider) {
			return false;
		}
		try {
			const stat = await this.fileSystemProvider.stat(uri);
			if (stat.type === FileType.Unknown && stat.size === -1) {
				return false;
			}

			return true;
		} catch {
			return false;
		}
	}

	protected async getContent(uri: string): Promise<string | null> {
		if (!this.fileSystemProvider || !this.fileSystemProvider.getContent) {
			return null;
		}
		try {
			return await this.fileSystemProvider.getContent(uri);
		} catch {
			return null;
		}
	}
}

function getColorInformation(node: nodes.Node, document: TextDocument): ColorInformation | null {
	const color = getColorValue(node);
	if (color) {
		const range = getRange(node, document);
		return { color, range };
	}
	return null;
}

function getRange(node: nodes.Node, document: TextDocument): Range {
	return Range.create(document.positionAt(node.offset), document.positionAt(node.end));
}

/**
 * Test if `otherRange` is in `range`. If the ranges are equal, will return true.
 */
function containsRange(range: Range, otherRange: Range): boolean {
	const otherStartLine = otherRange.start.line,
		otherEndLine = otherRange.end.line;
	const rangeStartLine = range.start.line,
		rangeEndLine = range.end.line;

	if (otherStartLine < rangeStartLine || otherEndLine < rangeStartLine) {
		return false;
	}
	if (otherStartLine > rangeEndLine || otherEndLine > rangeEndLine) {
		return false;
	}
	if (otherStartLine === rangeStartLine && otherRange.start.character < range.start.character) {
		return false;
	}
	if (otherEndLine === rangeEndLine && otherRange.end.character > range.end.character) {
		return false;
	}
	return true;
}

function getHighlightKind(node: nodes.Node): DocumentHighlightKind {
	if (node.type === nodes.NodeType.Selector) {
		return DocumentHighlightKind.Write;
	}

	if (node instanceof nodes.Identifier) {
		if (node.parent && node.parent instanceof nodes.Property) {
			if (node.isCustomProperty) {
				return DocumentHighlightKind.Write;
			}
		}
	}

	if (node.parent) {
		switch (node.parent.type) {
			case nodes.NodeType.FunctionDeclaration:
			case nodes.NodeType.MixinDeclaration:
			case nodes.NodeType.Keyframe:
			case nodes.NodeType.VariableDeclaration:
			case nodes.NodeType.FunctionParameter:
				return DocumentHighlightKind.Write;
		}
	}

	return DocumentHighlightKind.Read;
}

function toTwoDigitHex(n: number): string {
	const r = n.toString(16);
	return r.length !== 2 ? "0" + r : r;
}

export function getModuleNameFromPath(path: string) {
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

function getNamespaceFromLink(target: string): string {
	if (target.startsWith("sass")) {
		return target.split(":")[1];
	}

	const bareTarget = target.replace("pkg:", "").replace("./", "");
	let from = 0;
	let to = bareTarget.length;
	if (bareTarget.includes("/")) {
		from = bareTarget.lastIndexOf("/") + 1;
	}
	if (bareTarget.includes(".")) {
		to = bareTarget.lastIndexOf(".");
	}
	let namespace = bareTarget.substring(from, to);
	namespace = namespace.startsWith("_") ? namespace.slice(1) : namespace;
	if (namespace === "index") {
		// The link points to an index file. Use the folder name above as a namespace.
		const linkOmitIndex = bareTarget.slice(0, Math.max(0, bareTarget.lastIndexOf("/")));
		const newLastSlash = linkOmitIndex.lastIndexOf("/");
		namespace = linkOmitIndex.slice(Math.max(0, newLastSlash + 1));
	}

	return namespace;
}
