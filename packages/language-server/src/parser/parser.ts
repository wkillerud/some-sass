import {
	INode,
	NodeType,
	TextDocument,
	URI,
	Position,
	Range,
	SymbolKind,
	DocumentLink,
	FileSystemProvider,
	LanguageService,
} from "@somesass/language-server-types";
import { getLanguageService } from "@somesass/language-services";
import { parse, type ParseResult } from "scss-sassdoc-parser";
import { useContext } from "../context-provider";
import { sassBuiltInModuleNames } from "../features/sass-built-in-modules";
import { asDollarlessVariable, getLinesFromText } from "../utils/string";
import { getNodeAtOffset, getParentNodeByType } from "./ast";
import { buildDocumentContext } from "./document";
import { ScssDocument } from "./scss-document";
import type { IScssSymbols } from "./scss-symbol";

export const reModuleAtRule = /@(?:use|forward|import)/;
export const reUse = /@use ["'|](?<url>.+)["'|](?: as (?<namespace>\*|\w+))?;/;
export const reForward =
	/@forward ["'|](?<url>.+)["'|](?: as (?<prefix>\w+-)\*)?(?: hide (?<hide>.+))?(?: show (?<show>.+))?;/;
export const reImport = /@import ["'|](?<url>.+)["'|]/;
export const rePlaceholder = /^\s*%(?<name>\w+)/;
export const rePlaceholderUsage = /\s*@extend\s+(?<name>%[\w\d-_]+)/;

const reDynamicPath = /[#*{}]/;

export async function parseDocument(
	document: TextDocument,
	workspaceRoot: URI,
): Promise<ScssDocument> {
	const { fs, clientCapabilities } = useContext();
	const ls = getLanguageService({
		fileSystemProvider: fs,
		clientCapabilities,
	});
	const ast = ls.parseStylesheet(document);
	const symbols = await findDocumentSymbols(
		document,
		ast,
		workspaceRoot,
		fs,
		ls,
	);
	return new ScssDocument(fs, document, symbols, ast);
}

async function findDocumentSymbols(
	document: TextDocument,
	ast: INode,
	workspaceRoot: URI,
	fs: FileSystemProvider,
	ls: LanguageService,
): Promise<IScssSymbols> {
	const result: IScssSymbols = {
		functions: new Map(),
		mixins: new Map(),
		variables: new Map(),
		imports: new Map(),
		uses: new Map(),
		forwards: new Map(),
		placeholders: new Map(),
		placeholderUsages: new Map(),
	};

	const links = await ls.findDocumentLinks(document);

	const text = document.getText();
	const lines = getLinesFromText(text);

	for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
		const line = lines.at(lineNumber);
		if (typeof line === "undefined") {
			continue;
		}

		for (const link of links) {
			if (
				!link.target ||
				link.target.endsWith(".css") ||
				!reModuleAtRule.test(line)
			) {
				continue;
			}

			link.target = ensureScssExtension(link.target);

			const targetUri = URI.parse(link.target);
			const targetExists = await fs.exists(targetUri);
			if (!targetExists) {
				// The target string may be a partial without its _ prefix,
				// so try looking for it by that name.
				const partial = ensurePartial(link.target);
				const partialUri = URI.parse(partial);
				const partialExists = await fs.exists(partialUri);
				if (!partialExists) {
					// We tried to resolve the file as a partial, but it doesn't exist.
					// The target string may be a folder with an index file
					// so try looking for it by that name.
					const index = ensureIndex(link.target);
					const indexUri = URI.parse(index);
					const indexExists = await fs.exists(indexUri);
					if (!indexExists) {
						const partialIndex = ensurePartial(ensureIndex(link.target));
						const partialIndexUri = URI.parse(partialIndex);
						const partialIndexExists = await fs.exists(partialIndexUri);
						if (!partialIndexExists) {
							// We tried, this file doesn't exist
							continue;
						} else {
							link.target = partialIndexUri.toString();
						}
					} else {
						link.target = indexUri.toString();
					}
				} else {
					link.target = partialUri.toString();
				}
			} else {
				link.target = targetUri.toString();
			}

			const matchUse = reUse.exec(line);
			if (matchUse) {
				const url = matchUse.groups?.["url"];
				if (urlMatches(url as string, link.target)) {
					const namespace = matchUse.groups?.["namespace"];
					link.target = await toRealPath(link.target, fs);
					result.uses.set(link.target, {
						link,
						namespace: namespace || getNamespaceFromLink(link),
						isAliased: Boolean(namespace),
					});
				}

				continue;
			}

			const matchForward = reForward.exec(line);
			if (matchForward) {
				const url = matchForward.groups?.["url"];
				if (urlMatches(url as string, link.target)) {
					link.target = await toRealPath(link.target, fs);
					result.forwards.set(link.target, {
						link,
						prefix: matchForward.groups?.["prefix"],
						hide: matchForward.groups?.["hide"]
							? matchForward.groups["hide"].split(",").map((s) => s.trim())
							: [],
						show: matchForward.groups?.["show"]
							? matchForward.groups["show"].split(",").map((s) => s.trim())
							: [],
					});
				}

				continue;
			}

			const matchImport = reImport.exec(line);
			if (matchImport) {
				const url = matchImport.groups?.["url"];
				if (urlMatches(url as string, link.target)) {
					link.target = await toRealPath(link.target, fs);
					result.imports.set(link.target, {
						link,
						dynamic: reDynamicPath.test(link.target),
						css: link.target.endsWith(".css"),
					});
				}
			}
		}

		// Look for any usage of built-in modules like @use "sass:math";
		const matchUse = reUse.exec(line);
		if (matchUse) {
			const url = matchUse.groups?.["url"];
			if (!url) {
				continue;
			}
			const isBuiltIn = sassBuiltInModuleNames.has(url);
			if (isBuiltIn) {
				const namespace = matchUse.groups?.["namespace"];
				result.uses.set(url, {
					// Fake link with builtin as target
					link: DocumentLink.create(
						Range.create(Position.create(1, 1), Position.create(1, 1)),
						url,
					),
					namespace: namespace || url.split(":")[1],
					isAliased: Boolean(namespace),
				});
			}

			continue;
		}

		if (rePlaceholderUsage.test(line)) {
			const match = rePlaceholderUsage.exec(line);
			if (match) {
				const name = match.groups?.["name"];
				if (name) {
					const position = Position.create(lineNumber, line.indexOf(name));
					result.placeholderUsages.set(name, {
						name,
						position,
						offset: document.offsetAt(position),
						kind: SymbolKind.Class,
					});
				}
			}
		}
	}

	const symbols = await ls.findDocumentSymbols(document);
	for (const symbol of symbols) {
		const position = symbol.range.start;
		const offset = document.offsetAt(symbol.range.start);
		switch (symbol.kind) {
			case SymbolKind.Variable: {
				result.variables.set(symbol.name, {
					...symbol,
					offset,
					position,
					value: getVariableValue(ast, offset),
				});

				break;
			}

			case SymbolKind.Method: {
				result.mixins.set(symbol.name, {
					...symbol,
					offset,
					position,
					parameters: getMethodParameters(ast, offset),
				});

				break;
			}

			case SymbolKind.Function: {
				result.functions.set(symbol.name, {
					...symbol,
					offset,
					position,
					parameters: getMethodParameters(ast, offset),
				});

				break;
			}

			case SymbolKind.Class: {
				if (symbol.name.startsWith("%")) {
					result.placeholders.set(symbol.name, {
						...symbol,
						offset,
						position,
					});
				}
				break;
			}
		}
	}

	return result;
}

function getNamespaceFromLink(link: DocumentLink): string | undefined {
	if (!link.target) {
		return undefined;
	}

	const lastSlash = link.target.lastIndexOf("/");
	const extension = link.target.lastIndexOf(".");
	let candidate = link.target.substring(lastSlash + 1, extension);

	candidate = candidate.startsWith("_") ? candidate.slice(1) : candidate;

	if (candidate === "index") {
		// The link points to an index file. Use the folder name above as a namespace.
		const linkOmitIndex = link.target.slice(0, Math.max(0, lastSlash));
		const newLastSlash = linkOmitIndex.lastIndexOf("/");
		candidate = linkOmitIndex.slice(Math.max(0, newLastSlash + 1));
	}

	return candidate;
}

function ensureScssExtension(target: string): string {
	if (target.endsWith(".scss")) {
		return target;
	}

	return `${target}.scss`;
}

function ensurePartial(target: string): string {
	const lastSlash = target.lastIndexOf("/");
	const lastDot = target.lastIndexOf(".");
	const fileName = target.substring(lastSlash + 1, lastDot);

	if (fileName.startsWith("_")) {
		return target;
	}

	const path = target.slice(0, Math.max(0, lastSlash + 1));
	const extension = target.slice(Math.max(0, lastDot));
	return `${path}_${fileName}${extension}`;
}

function ensureIndex(target: string): string {
	const lastSlash = target.lastIndexOf("/");
	const lastDot = target.lastIndexOf(".");
	const fileName = target.substring(lastSlash + 1, lastDot);

	if (fileName.includes("index")) {
		return target;
	}

	const path = target.slice(0, Math.max(0, lastSlash + 1));
	const extension = target.slice(Math.max(0, lastDot));
	return `${path}/${fileName}/index${extension}`;
}

function urlMatches(url: string, linkTarget: string): boolean {
	let safeUrl = url;
	while (/^[./@~]/.exec(safeUrl)) {
		safeUrl = safeUrl.slice(1);
	}

	let match = linkTarget.includes(safeUrl);
	if (!match) {
		const lastSlash = safeUrl.lastIndexOf("/");
		const toLastSlash = safeUrl.slice(0, Math.max(0, lastSlash));
		const restOfUrl = safeUrl.slice(Math.max(0, lastSlash + 1));
		const partial = `${toLastSlash}/_${restOfUrl}`;
		match = linkTarget.includes(partial);
	}

	return match;
}

async function toRealPath(
	target: string,
	fs: FileSystemProvider,
): Promise<string> {
	const linkUri = URI.parse(target);
	const realPathUri = await fs.realPath(linkUri);
	return realPathUri.toString();
}

function getVariableValue(ast: INode, offset: number): string | null {
	const node = getNodeAtOffset(ast, offset);

	if (node === null) {
		return null;
	}

	const parent = getParentNodeByType(node, NodeType.VariableDeclaration);

	return parent?.getValue()?.getText() || null;
}

function getMethodParameters(ast: INode, offset: number) {
	const node = getNodeAtOffset(ast, offset);

	if (node === null) {
		return [];
	}

	return node
		.getParameters()
		.getChildren()
		.map((child) => {
			const defaultValueNode = child.getDefaultValue();

			const value =
				defaultValueNode === undefined ? null : defaultValueNode.getText();
			const name = child.getName();

			// TODO: get this (all of this) into documentsymbols
			// const dollarlessName = asDollarlessVariable(name);
			// const docs = sassDoc
			// 	? sassDoc.parameter?.find((p) => p.name === dollarlessName)
			// 	: undefined;

			return {
				name,
				offset: child.offset,
				value,
				kind: SymbolKind.Variable,
				// sassdoc: docs,
			};
		});
}
