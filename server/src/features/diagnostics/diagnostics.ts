import {
	DiagnosticSeverity,
	DiagnosticTag,
	SymbolKind,
} from "vscode-languageserver-types";
import type {
	Diagnostic,
	VersionedTextDocumentIdentifier,
} from "vscode-languageserver-types";
import { EXTENSION_NAME } from "../../constants";
import { useContext } from "../../context-provider";
import { NodeType } from "../../parser";
import type {
	INode,
	IScssDocument,
	ScssForward,
	ScssSymbol,
} from "../../parser";
import { asDollarlessVariable } from "../../utils/string";

export async function doDiagnostics(
	document: VersionedTextDocumentIdentifier,
): Promise<Diagnostic[]> {
	const diagnostics: Diagnostic[] = [];
	const { storage } = useContext();
	const openDocument = storage.get(document.uri);
	if (!openDocument) {
		console.error(
			"Tried to do diagnostics on a document that has not been scanned. This should never happen.",
		);
		return diagnostics;
	}

	const references: INode[] = getReferences(openDocument.ast);
	if (references.length === 0) {
		return diagnostics;
	}

	// Do traversal once, and then do diagnostics on the symbols for each reference
	const symbols: ScssSymbol[] = [];
	doSymbolHunting(openDocument, symbols);

	for (const node of references) {
		for (const symbol of symbols) {
			let nodeKind: SymbolKind | null = null;

			switch (node.type) {
				case NodeType.Function:
					nodeKind = SymbolKind.Function;
					break;
				case NodeType.MixinReference:
					nodeKind = SymbolKind.Method;
					break;
				case NodeType.VariableName:
					nodeKind = SymbolKind.Variable;
					break;
				case NodeType.SimpleSelector:
					nodeKind = SymbolKind.Class;
					break;
			}

			if (nodeKind === null) {
				continue;
			}

			const name =
				nodeKind === SymbolKind.Class ? node.getText() : node.getName();
			if (symbol.kind === nodeKind && name === symbol.name) {
				const diagnostic = createDiagnostic(openDocument, node, symbol);
				if (diagnostic) {
					diagnostics.push(diagnostic);
				}
			}
		}
	}

	return diagnostics;
}

function getReferences(fromNode: INode): INode[] {
	return fromNode.getChildren().flatMap((child) => {
		if (child.type === NodeType.VariableName) {
			const parent = child.getParent();
			if (
				parent.type !== NodeType.FunctionParameter &&
				parent.type !== NodeType.VariableDeclaration
			) {
				return [child];
			}
		} else if (child.type === NodeType.Identifier) {
			let i = 0;
			let node = child;
			while (
				node.type !== NodeType.MixinReference &&
				node.type !== NodeType.Function &&
				i !== 2
			) {
				node = node.getParent();
				i++;
			}

			if (
				node.type === NodeType.MixinReference ||
				node.type === NodeType.Function
			) {
				return [node];
			}
		} else if (child.type === NodeType.SimpleSelector) {
			let node = child;
			let i = 0;
			while (node.type !== NodeType.ExtendsReference && i !== 2) {
				node = node.getParent();
				i++;
			}
			if (node.type === NodeType.ExtendsReference) {
				return [child];
			}
		}

		return getReferences(child);
	});
}

function doSymbolHunting(
	openDocument: IScssDocument,
	result: ScssSymbol[],
): ScssSymbol[] {
	traverseTree(openDocument, openDocument, result);
	return result;
}

function traverseTree(
	openDocument: IScssDocument,
	childDocument: IScssDocument,
	result: ScssSymbol[],
	accumulatedPrefix = "",
	depth = 0,
): ScssSymbol[] {
	const { storage } = useContext();
	const scssDocument = storage.get(childDocument.uri);
	if (!scssDocument) {
		return result;
	}

	for (const symbol of scssDocument.getSymbols()) {
		// Placeholders are not namespaced the same way other symbols are
		if (symbol.kind === SymbolKind.Class) {
			result.push({
				...symbol,
				name: symbol.name,
			});
			continue;
		}

		// The symbol may have a prefix in the open document, so we need to add it here
		// so we can compare apples to apples later on.
		let symbolName = `${accumulatedPrefix}${asDollarlessVariable(symbol.name)}`;
		if (symbol.kind === SymbolKind.Variable) {
			symbolName = `$${symbolName}`;
		}

		result.push({
			...symbol,
			name: symbolName,
		});
	}

	// Check to see if we have to go deeper
	// Don't follow uses beyond the first, since symbols from those aren't available to us anyway
	// Don't follow imports, since the whole point here is to use the new module system
	for (const child of scssDocument.getLinks({
		uses: depth === 0,
		imports: false,
	})) {
		if (!child.link.target || child.link.target === scssDocument.uri) {
			continue;
		}

		const childDocument = storage.get(child.link.target);
		if (!childDocument) {
			continue;
		}

		let prefix = accumulatedPrefix;
		if ((child as ScssForward).prefix) {
			prefix += (child as ScssForward).prefix;
		}

		traverseTree(openDocument, childDocument, result, prefix, depth + 1);
	}

	return result;
}

function createDiagnostic(
	openDocument: IScssDocument,
	node: INode,
	symbol: ScssSymbol,
): Diagnostic | null {
	if (typeof symbol.sassdoc?.deprecated !== "undefined") {
		return {
			message: symbol.sassdoc.deprecated || `${symbol.name} is deprecated`,
			range: openDocument.getNodeRange(node),
			source: EXTENSION_NAME,
			tags: [DiagnosticTag.Deprecated],
			severity: DiagnosticSeverity.Hint,
		};
	}

	return null;
}
