import {
	Position,
	SymbolKind,
	TextDocument,
	URI,
	SyntaxNodeType,
	Stylesheet,
	LanguageService,
} from "@somesass/language-server-types";
import {
	getLanguageService,
	getLanguageService as getSomeSassLanguageService,
} from "@somesass/language-services";
import { parse, type ParseResult } from "scss-sassdoc-parser";
import { useContext } from "../context-provider";
import { asDollarlessVariable, getLinesFromText } from "../utils/string";
import { getNodeAtOffset, getParentNodeByType } from "./ast";
import { buildDocumentContext } from "./document";
import { INode, NodeType } from "./node";
import { ScssDocument } from "./scss-document";
import type { IScssSymbols } from "./scss-symbol";

export const rePlaceholder = /^\s*%(?<name>\w+)/;
export const rePlaceholderUsage = /\s*@extend\s+(?<name>%[\w\d-_]+)/;

const reDynamicPath = /[#*{}]/;

export async function parseDocument(
	document: TextDocument,
	workspaceRoot: URI,
): Promise<ScssDocument> {
	const { fs } = useContext();
	const ls = getLanguageService({ fileSystemProvider: fs });
	const ast = ls.parseStylesheet(document);
	const symbols = await findDocumentSymbols(document, ast, workspaceRoot, ls);
	return new ScssDocument(fs, document, symbols, ast);
}

async function findDocumentSymbols(
	document: TextDocument,
	ast: Stylesheet,
	workspaceRoot: URI,
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

	const { fs, clientCapabilities } = useContext();
	const sls = getSomeSassLanguageService({
		fileSystemProvider: fs,
		clientCapabilities,
	});
	const stylesheet = sls.parseStylesheet(document);
	const links = await sls.findDocumentLinks(
		document,
		stylesheet,
		buildDocumentContext(document.uri, workspaceRoot),
	);

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
				link.target === document.uri
			) {
				continue;
			}

			switch (link.type) {
				case SyntaxNodeType.UseStatement: {
					result.uses.set(link.target, {
						link,
						namespace: link.namespace,
						isAliased: Boolean(link.namespace),
					});
					break;
				}
				case SyntaxNodeType.ForwardStatement: {
					result.forwards.set(link.target, {
						link,
						prefix: link.as,
						show: link.show || [],
						hide: link.hide || [],
					});
					break;
				}
				case SyntaxNodeType.ImportStatement: {
					result.imports.set(link.target, {
						link,
						dynamic: reDynamicPath.test(link.target), // TODO: do I even use this?
						css: link.target.endsWith(".css"),
					});
					break;
				}
			}
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

	let sassdoc: ParseResult[] = [];
	try {
		sassdoc = await parse(text);
	} catch {
		// do nothing
	}

	// TODO: you are here. Things are broken. Same procedure as for links.
	// Gradually migrate over to logic in language-service, make tests pass in the server/e2e.
	const symbols = ls.findDocumentSymbols(document, ast);

	for (const symbol of symbols) {
		const position = symbol.range.start;
		const offset = document.offsetAt(symbol.range.start);
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

			case SymbolKind.Class: {
				if (symbol.name.startsWith("%")) {
					const sansPercent = symbol.name.substring(1);
					const docs = sassdoc.find(
						(v) =>
							v.context.name === sansPercent &&
							v.context.type === "placeholder",
					);
					result.placeholders.set(symbol.name, {
						name: symbol.name,
						kind: SymbolKind.Class,
						offset,
						position,
						sassdoc: docs,
					});
				}
				break;
			}
			// No default
		}
	}

	return result;
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
