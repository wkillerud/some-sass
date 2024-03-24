import {
	Node,
	NodeType,
	TextDocument,
	URI,
	Position,
	SymbolKind,
	FileSystemProvider,
	LanguageService,
	getLanguageService,
	VariableDeclaration,
	MixinDeclaration,
	FunctionDeclaration,
	FunctionParameter,
} from "@somesass/language-services";
import { useContext } from "../context-provider";
import { getLinesFromText } from "../utils/string";
import { getNodeAtOffset, getParentNodeByType } from "./ast";
import { ScssDocument } from "./scss-document";
import type { IScssSymbols, ScssParameter } from "./scss-symbol";

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
	// ls.clearCache(); // tmp for test, because of course...
	const ast = await ls.parseStylesheet(document);
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
	ast: Node,
	workspaceRoot: URI,
	fs: FileSystemProvider,
	ls: LanguageService,
): Promise<IScssSymbols> {
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
				if (!link.target?.includes("sass:")) {
					link.target = await toRealPath(link.target, fs);
				}
				result.uses.set(link.target, {
					link,
					namespace: link.namespace || link.as, // Legacy since ScssUse does not have `as`, refactor in progress
					isAliased: Boolean(link.as),
				});
				break;
			}
			case NodeType.Forward: {
				link.target = await toRealPath(link.target, fs);
				result.forwards.set(link.target, {
					link,
					prefix: link.as,
					hide: link.hide || [],
					show: link.show || [],
				});
				break;
			}
			case NodeType.Import: {
				link.target = await toRealPath(link.target, fs);
				result.imports.set(link.target, {
					link,
					dynamic: reDynamicPath.test(link.target),
					css: link.target.endsWith(".css"),
				});
				break;
			}
		}
	}

	const text = document.getText();
	const lines = getLinesFromText(text);
	for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
		const line = lines.at(lineNumber);
		if (typeof line === "undefined") {
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

async function toRealPath(
	target: string,
	fs: FileSystemProvider,
): Promise<string> {
	const linkUri = URI.parse(target);
	const realPathUri = await fs.realPath(linkUri);
	return realPathUri.toString();
}

function getVariableValue(ast: Node, offset: number): string | null {
	const node = getNodeAtOffset(ast, offset);

	if (node === null) {
		return null;
	}

	const parent = getParentNodeByType<VariableDeclaration>(
		node,
		NodeType.VariableDeclaration,
	);
	return parent?.getValue()?.getText() || null;
}

function getMethodParameters(ast: Node, offset: number) {
	const node = getNodeAtOffset<MixinDeclaration | FunctionDeclaration>(
		ast,
		offset,
	);

	if (node === null || typeof node.getParameters === "undefined") {
		return [];
	}

	const result = node
		.getParameters()
		.getChildren()
		.map((child) => {
			if (child instanceof FunctionParameter) {
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
			} else {
				return null;
			}
		})
		.filter((c) => c !== null);
	return result as ScssParameter[];
}
