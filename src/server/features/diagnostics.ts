import {
	DiagnosticSeverity,
	DiagnosticTag,
	SymbolKind,
} from "vscode-languageserver-types";
import type {
	Diagnostic,
	VersionedTextDocumentIdentifier,
} from "vscode-languageserver-types";
import { EXTENSION_NAME } from "../../shared/constants";
import { NodeType } from "../nodes";
import type { INode } from "../nodes";
import type StorageService from "../storage";
import type {
	IScssDocument,
	ScssForward,
	ScssImport,
	ScssSymbol,
} from "../symbols";
import { asDollarlessVariable } from "../utils/string";

export async function doDiagnostics(
	document: VersionedTextDocumentIdentifier,
	storage: StorageService,
): Promise<Diagnostic[]> {
	const diagnostics: Diagnostic[] = [];

	const openDocument = storage.get(document.uri);
	if (!openDocument) {
		console.error(
			"Tried to do diagnostics on a document that has not been scanned. This should never happen.",
		);
		return diagnostics;
	}

	const references: INode[] = getVariableFunctionMixinReferences(
		openDocument.ast,
	);
	if (references.length === 0) {
		return diagnostics;
	}

	// Do traversal once, and then do diagnostics on the symbols for each reference
	const symbols: ScssSymbol[] = [];
	doSymbolHunting(openDocument, storage, symbols);

	for (const node of references) {
		for (const symbol of symbols) {
			const nodeKind: SymbolKind =
				node.type === NodeType.Function
					? SymbolKind.Function
					: node.type === NodeType.MixinReference
					? SymbolKind.Method
					: SymbolKind.Variable;

			if (symbol.kind === nodeKind && node.getName() === symbol.name) {
				const diagnostic = createDiagnostic(openDocument, node, symbol);
				if (diagnostic) {
					diagnostics.push(diagnostic);
				}
			}
		}
	}

	return diagnostics;
}

function getVariableFunctionMixinReferences(fromNode: INode): INode[] {
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
		}

		return getVariableFunctionMixinReferences(child);
	});
}

function doSymbolHunting(
	openDocument: IScssDocument,
	storage: StorageService,
	result: ScssSymbol[],
): ScssSymbol[] {
	traverseTree(openDocument, openDocument, storage, result);
	return result;
}

function traverseTree(
	openDocument: IScssDocument,
	childDocument: IScssDocument,
	storage: StorageService,
	result: ScssSymbol[],
	accumulatedPrefix = "",
): ScssSymbol[] {
	const scssDocument = storage.get(childDocument.uri);
	if (!scssDocument) {
		return result;
	}

	for (const symbol of scssDocument.getSymbols()) {
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
	for (const child of scssDocument.getLinks()) {
		if (
			!child.link.target ||
			(child as ScssImport).dynamic ||
			(child as ScssImport).css
		) {
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

		traverseTree(openDocument, childDocument, storage, result, prefix);
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
