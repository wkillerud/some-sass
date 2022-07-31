import { parseString } from "scss-sassdoc-parser";
import type { ParseResult } from "scss-sassdoc-parser";
import {
	Position,
	Range,
	SymbolKind,
	DocumentLink,
} from "vscode-css-languageservice";
import type { TextDocument } from "vscode-languageserver-textdocument";
import { URI } from "vscode-uri";
import { sassBuiltInModuleNames } from "../features/sass-built-in-modules";
import { fileExists } from "../node-fs";
import { asDollarlessVariable, getLinesFromText } from "../utils/string";
import { getNodeAtOffset, getParentNodeByType } from "./ast";
import { buildDocumentContext } from "./document";
import { getLanguageService } from "./language-service";
import { INode, NodeType } from "./node";
import { ScssDocument } from "./scss-document";
import type { IScssSymbols } from "./scss-symbol";

export const reModuleAtRule = /@(?:use|forward|import)/;
export const reUse = /@use ["'|](?<url>.+)["'|](?: as (?<namespace>\*|\w+))?;/;
export const reForward =
	/@forward ["'|](?<url>.+)["'|](?: as (?<prefix>\w+-)\*)?(?: hide (?<hide>.+))?;/;
export const reImport = /@import ["'|](?<url>.+)["'|]/;

const reDynamicPath = /[#*{}]/;

const ls = getLanguageService();

export async function parseDocument(
	document: TextDocument,
	workspaceRoot: URI,
): Promise<ScssDocument> {
	const ast = ls.parseStylesheet(document) as INode;
	const symbols = await findDocumentSymbols(document, ast, workspaceRoot);

	return new ScssDocument(document, symbols, ast);
}

async function findDocumentSymbols(
	document: TextDocument,
	ast: INode,
	workspaceRoot: URI,
): Promise<IScssSymbols> {
	const result: IScssSymbols = {
		functions: new Map(),
		mixins: new Map(),
		variables: new Map(),
		imports: new Map(),
		uses: new Map(),
		forwards: new Map(),
	};

	const links = await ls.findDocumentLinks2(
		document,
		ast,
		buildDocumentContext(document.uri, workspaceRoot),
	);

	const text = document.getText();
	const lines = getLinesFromText(text);

	for (const line of lines) {
		for (const link of links) {
			if (
				!link.target ||
				link.target.endsWith(".css") ||
				!reModuleAtRule.test(line)
			) {
				continue;
			}

			link.target = ensureScssExtension(link.target);

			const targetFsPath = URI.parse(link.target).fsPath;
			const targetExists = await fileExists(targetFsPath);
			if (!targetExists) {
				// The target string may be a partial without its _ prefix,
				// so try looking for it by that name.
				const partial = ensurePartial(link.target);
				const partialFsPath = URI.parse(partial).fsPath;
				const partialExists = await fileExists(partialFsPath);
				if (!partialExists) {
					// We tried to resolve the file as a partial, but it doesn't exist.
					continue;
				}

				link.target = partial;
			}

			const matchUse = reUse.exec(line);
			if (matchUse) {
				const url = matchUse.groups?.["url"];
				if (urlMatches(url as string, link.target)) {
					const namespace = matchUse.groups?.["namespace"];
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
					result.forwards.set(link.target, {
						link,
						prefix: matchForward.groups?.["prefix"],
						hide: matchForward.groups?.["hide"]
							? matchForward.groups["hide"].split(",").map((s) => s.trim())
							: [],
					});
				}

				continue;
			}

			const matchImport = reImport.exec(line);
			if (matchImport) {
				const url = matchImport.groups?.["url"];
				if (urlMatches(url as string, link.target)) {
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
			const builtIn = sassBuiltInModuleNames.find((module) => module === url);
			if (builtIn) {
				const namespace = matchUse.groups?.["namespace"];
				result.uses.set(builtIn, {
					// Fake link with builtin as target
					link: DocumentLink.create(
						Range.create(Position.create(1, 1), Position.create(1, 1)),
						builtIn,
					),
					namespace: namespace || builtIn.split(":")[1],
					isAliased: Boolean(namespace),
				});
			}

			continue;
		}
	}

	let sassdoc: ParseResult[] = [];
	try {
		sassdoc = await parseString(text);
	} catch (error) {
		console.error(error);
	}

	const symbols = ls.findDocumentSymbols(document, ast);

	for (const symbol of symbols) {
		const position = symbol.location.range.start;
		const offset = document.offsetAt(symbol.location.range.start);
		switch (symbol.kind) {
			case SymbolKind.Variable: {
				const dollarlessName = symbol.name.replace("$", "");
				const docs = sassdoc.find(
					(v) =>
						v.context.name === dollarlessName && v.context.type === "variable",
				);
				result.variables.set(symbol.name, {
					name: symbol.name,
					kind: SymbolKind.Variable,
					offset,
					position,
					value: getVariableValue(ast, offset),
					sassdoc: docs,
				});

				break;
			}

			case SymbolKind.Method: {
				const docs = sassdoc.find(
					(v) => v.context.name === symbol.name && v.context.type === "mixin",
				);
				result.mixins.set(symbol.name, {
					name: symbol.name,
					kind: SymbolKind.Method,
					offset,
					position,
					parameters: getMethodParameters(ast, offset, docs),
					sassdoc: docs,
				});

				break;
			}

			case SymbolKind.Function: {
				const docs = sassdoc.find(
					(v) =>
						v.context.name === symbol.name && v.context.type === "function",
				);
				result.functions.set(symbol.name, {
					name: symbol.name,
					kind: SymbolKind.Function,
					offset,
					position,
					parameters: getMethodParameters(ast, offset, docs),
					sassdoc: docs,
				});

				break;
			}
			// No default
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

function getVariableValue(ast: INode, offset: number): string | null {
	const node = getNodeAtOffset(ast, offset);

	if (node === null) {
		return null;
	}

	const parent = getParentNodeByType(node, NodeType.VariableDeclaration);

	return parent?.getValue()?.getText() || null;
}

function getMethodParameters(
	ast: INode,
	offset: number,
	sassDoc: ParseResult | undefined,
) {
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

			const dollarlessName = asDollarlessVariable(name);
			const docs = sassDoc
				? sassDoc.parameter?.find((p) => p.name === dollarlessName)
				: undefined;

			return {
				name,
				offset: child.offset,
				value,
				kind: SymbolKind.Variable,
				sassdoc: docs,
			};
		});
}
