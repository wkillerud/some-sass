'use strict';

import { SymbolKind, DocumentLink } from 'vscode-css-languageservice';
import type { TextDocument } from 'vscode-languageserver-textdocument';

import { INode, NodeType } from '../types/nodes';
import type { IScssSymbols } from '../types/symbols';
import { getNodeAtOffset, getParentNodeByType } from '../utils/ast';
import { buildDocumentContext, getLinesFromText } from '../utils/document';
import { getLanguageService } from '../language-service';
import { ScssDocument } from '../document';
import { parseString, ParseResult } from 'scss-sassdoc-parser';
import { fileExists } from '../utils/fs';
import { URI } from 'vscode-uri';

export const reModuleAtRule = /@[use|forward|import]/;
export const reUse = /@use ["|'](?<url>.+)["|'](?: as (?<namespace>\*|\w+))?;/;
export const reForward = /@forward ["|'](?<url>.+)["|'](?: as (?<prefix>\w+-)\*)?(?: hide (?<hide>.+))?;/;

const reDynamicPath = /[#{}\*]/;

const ls = getLanguageService();

export async function parseDocument(document: TextDocument, workspaceRoot: URI): Promise<ScssDocument> {
	const ast = ls.parseStylesheet(document) as INode;
	const symbols = await findDocumentSymbols(document, ast, workspaceRoot)

	return new ScssDocument(document, symbols, ast);
}

async function findDocumentSymbols(document: TextDocument, ast: INode, workspaceRoot: URI): Promise<IScssSymbols> {
	const result: IScssSymbols = {
		functions: new Map(),
		mixins: new Map(),
		variables: new Map(),
		imports: new Map(),
		uses: new Map(),
		forwards: new Map(),
	};

	const links = await ls.findDocumentLinks2(document, ast, buildDocumentContext(document.uri, workspaceRoot));

	const text = document.getText();
	const lines = getLinesFromText(text);

	for (const line of lines) {
		for (const link of links) {
			if (!link.target || link.target.endsWith(".css") || !reModuleAtRule.test(line)) {
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
				const { namespace } = matchUse.groups as { namespace?: string };
				result.uses.set(link.target, {
					link,
					namespace: namespace || getFilenameFromLink(link),
					isAliased: Boolean(namespace),
				});
				continue;
			}

			const matchForward = reForward.exec(line);
			if (matchForward) {
				const { prefix, hide } = matchForward.groups as { url: string; prefix?: string; hide?: string };
				result.forwards.set(link.target, {
					link,
					prefix,
					hide: hide ? hide.split(',').map(s => s.trim()) : []
				});
				continue;
			}

			result.imports.set(link.target, {
				link,
				dynamic: reDynamicPath.test(link.target),
				css: link.target.endsWith('.css')
			});
		}
	}

	let sassdoc: ParseResult[] = [];
	try {
		sassdoc = await parseString(text);
	} catch (e) {
		console.error(e);
	}
	const symbols = ls.findDocumentSymbols(document, ast);

	for (const symbol of symbols) {
		const position = symbol.location.range.start;
		const offset = document.offsetAt(symbol.location.range.start);
		if (symbol.kind === SymbolKind.Variable) {
			const dollarlessName = symbol.name.replace("$", "");
			const docs = sassdoc.find(v => v.context.name === dollarlessName && v.context.type === 'variable');
			result.variables.set(symbol.name, {
				name: symbol.name,
				kind: SymbolKind.Variable,
				offset,
				position,
				value: getVariableValue(ast, offset),
				sassdoc: docs,
			});
		} else if (symbol.kind === SymbolKind.Method) {
			const docs = sassdoc.find(v => v.context.name === symbol.name && v.context.type === 'mixin');
			result.mixins.set(symbol.name, {
				name: symbol.name,
				kind: SymbolKind.Method,
				offset,
				position,
				parameters: getMethodParameters(ast, offset),
				sassdoc: docs,
			});
		} else if (symbol.kind === SymbolKind.Function) {
			const docs = sassdoc.find(v => v.context.name === symbol.name && v.context.type === 'function');
			result.functions.set(symbol.name, {
				name: symbol.name,
				kind: SymbolKind.Function,
				offset,
				position,
				parameters: getMethodParameters(ast, offset),
				sassdoc: docs,
			});
		}
	}

	return result;
}

function getFilenameFromLink(link: DocumentLink): string | undefined {
	if (!link.target) {
		return undefined;
	}

	const lastSlash = link.target.lastIndexOf('/');
	const extension = link.target.lastIndexOf('.');
	return link.target.substring(lastSlash + 1, extension);
}

function ensureScssExtension(target: string): string {
	if (target.endsWith('.scss')) {
		return target;
	}
	return target + '.scss';
}

function ensurePartial(target: string): string {
	let lastSlash = target.lastIndexOf('/');
	const lastDot = target.lastIndexOf('.');
	const fileName = target.substring(lastSlash + 1, lastDot)

	if (fileName.startsWith("_")) {
		return target;
	}

	const path = target.substring(0, lastSlash + 1);
	const extension = target.substring(lastDot);
	return `${path}_${fileName}${extension}`;
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
		.map(child => {
			const defaultValueNode = child.getDefaultValue();

			const value = defaultValueNode === undefined ? null : defaultValueNode.getText();

			return {
				name: child.getName(),
				offset: child.offset,
				value,
				kind: SymbolKind.Variable,
			};
		});
}
