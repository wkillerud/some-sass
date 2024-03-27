import {
	Node,
	NodeType,
	TextDocument,
	SymbolKind,
	getLanguageService,
	VariableDeclaration,
	FunctionParameter,
	SassDocumentSymbol,
} from "@somesass/language-services";
import { Parameter } from "scss-sassdoc-parser";
import { useContext } from "../context-provider";
import { getNodeAtOffset, getParentNodeByType } from "./ast";
import { ScssDocument } from "./scss-document";
import type { IScssSymbols } from "./scss-symbol";

const reDynamicPath = /[#*{}]/;

export async function parseDocument(
	document: TextDocument,
): Promise<ScssDocument> {
	const { fs, clientCapabilities } = useContext();
	const ls = getLanguageService({
		fileSystemProvider: fs,
		clientCapabilities,
	});

	const ast = await ls.parseStylesheet(document);

	// Placeholder usages should probably be a find-method in LS?
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
	for (const link of links) {
		if (!link.target || link.target.endsWith(".css")) {
			continue;
		}

		switch (link.type) {
			case NodeType.Use: {
				result.uses.set(link.target, {
					link,
					namespace: link.namespace || link.as, // Legacy since ScssUse does not have `as`, refactor in progress
					isAliased: Boolean(link.as),
				});
				break;
			}
			case NodeType.Forward: {
				result.forwards.set(link.target, {
					link,
					prefix: link.as,
					hide: link.hide || [],
					show: link.show || [],
				});
				break;
			}
			case NodeType.Import: {
				result.imports.set(link.target, {
					link,
					dynamic: reDynamicPath.test(link.target),
					css: link.target.endsWith(".css"),
				});
				break;
			}
		}
	}

	const symbols = ls.findDocumentSymbols(document);
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
					parameters: symbol.children
						? symbol.children.map((param) => {
								const paramoffset = document.offsetAt(param.range.start);
								return {
									name: param.name,
									sassdoc: param.sassdoc as Parameter,
									position: param.range.start,
									value: getVariableValue(ast, paramoffset),
									offset: paramoffset,
								};
							})
						: [],
				});

				break;
			}

			case SymbolKind.Function: {
				result.functions.set(symbol.name, {
					...symbol,
					offset,
					position,
					parameters: symbol.children
						? symbol.children.map((param) => {
								const paramoffset = document.offsetAt(param.range.start);
								return {
									name: param.name,
									sassdoc: param.sassdoc as Parameter,
									position: param.range.start,
									value: getVariableValue(ast, paramoffset),
									offset: paramoffset,
								};
							})
						: [],
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

				const placeholderUsages = getPlaceholderUsagesInChildren(symbol);
				for (const usage of placeholderUsages) {
					result.placeholderUsages.set(usage.name, {
						...usage,
						position: usage.range.start,
						offset: document.offsetAt(symbol.range.start),
					});
				}
				break;
			}
		}
	}

	return new ScssDocument(fs, document, result, ast);
}

function getVariableValue(ast: Node, offset: number): string | null {
	const node = getNodeAtOffset(ast, offset);

	if (node === null) {
		return null;
	}

	const declaration = getParentNodeByType<VariableDeclaration>(
		node,
		NodeType.VariableDeclaration,
	);
	if (declaration) {
		return declaration.getValue()?.getText() || null;
	}

	const parameter = getParentNodeByType<FunctionParameter>(node, [
		NodeType.FunctionParameter,
		NodeType.FunctionArgument,
	]);
	if (parameter) {
		return parameter.getDefaultValue()?.getText() || null;
	}

	return null;
}

function getPlaceholderUsagesInChildren(
	symbol: SassDocumentSymbol,
): SassDocumentSymbol[] {
	if (!symbol.children) {
		return [];
	}

	const symbols: SassDocumentSymbol[] = [];
	for (const child of symbol.children) {
		if (child.kind === SymbolKind.Class && child.name.startsWith("%")) {
			symbols.push(child);
		}
		if (child.children) {
			symbols.push(...getPlaceholderUsagesInChildren(child));
		}
	}
	return symbols;
}
