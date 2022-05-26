import { Diagnostic, DiagnosticSeverity, DiagnosticTag, VersionedTextDocumentIdentifier } from 'vscode-languageserver-types';
import { EXTENSION_NAME } from '../../constants';
import type StorageService from '../services/storage';
import { INode, NodeType } from '../types/nodes';
import type { IScssDocument, ScssForward, ScssImport, ScssSymbol } from '../types/symbols';

export async function doDiagnostics(
  document: VersionedTextDocumentIdentifier,
  storage: StorageService
): Promise<Diagnostic[]> {
  const diagnostics: Diagnostic[] = [];

  const openDocument = storage.get(document.uri);
  if (!openDocument) {
    console.error("Tried to do diagnostics on a document that has not been scanned. This should never happen.");
    return diagnostics;
  }

  const references: INode[] = getVariableFunctionMixinReferences(openDocument.ast);
  if (references.length === 0) {
    return diagnostics;
  }

  for (const node of references) {
    doSymbolHunting(openDocument, storage, diagnostics, node);
  }

  return diagnostics;
}

function getVariableFunctionMixinReferences(fromNode: INode): INode[] {
  return fromNode.getChildren()
    .flatMap(child => {
      if (child.type === NodeType.VariableName) {
        const parent = child.getParent();
        if (parent.type !== NodeType.FunctionParameter && parent.type !== NodeType.VariableDeclaration) {
          return [child];
        }
      } else if (child.type === NodeType.Identifier) {
        let i = 0;
        let node = child;
        while (node.type !== NodeType.MixinReference && node.type !== NodeType.Function && i !== 2) {
          node = node.getParent();
          i++;
        }
        if (node.type === NodeType.MixinReference || node.type === NodeType.Function) {
          return [node];
        }
      }
      return getVariableFunctionMixinReferences(child);
    });
}

function doSymbolHunting(openDocument: IScssDocument, storage: StorageService, result: Diagnostic[], node: INode): Diagnostic[] {
  traverseTree(openDocument, openDocument, storage, result, node);
	return result;
}

function traverseTree(openDocument: IScssDocument, childDocument: IScssDocument, storage: StorageService, result: Diagnostic[], node: INode, accumulatedPrefix = ""): Diagnostic[] {
	const scssDocument = storage.get(childDocument.uri);
	if (!scssDocument) {
		return result;
	}

  const map = node.type === NodeType.Function
    ? scssDocument.functions
    : node.type === NodeType.MixinReference
      ? scssDocument.mixins
      : scssDocument.variables;


  // Entry has prefix, so we need to strip that prefix away from entry
  // before looking for a symbol as it has been named in the original document.
  const symbolName = node.getName().replace(accumulatedPrefix, "");
  if (map.has(symbolName)) {
    const diagnostic = createDiagnostic(openDocument, node, map.get(symbolName)!);
    if (diagnostic) {
      result.push(diagnostic);
    }
  }

	// Check to see if we have to go deeper
	for (const child of scssDocument.getLinks()) {
		if (!child.link.target || (child as ScssImport).dynamic || (child as ScssImport).css) {
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

		traverseTree(openDocument, childDocument, storage, result, node, prefix);
	}

	return result;
}

function createDiagnostic(openDocument: IScssDocument, node: INode, symbol: ScssSymbol): Diagnostic | null {
  if (typeof symbol.sassdoc?.deprecated !== 'undefined') {
    return {
      message: symbol.sassdoc.deprecated || `${symbol.name} is deprecated`,
      range: openDocument.getNodeRange(node),
      source: EXTENSION_NAME,
      tags: [DiagnosticTag.Deprecated],
      severity: DiagnosticSeverity.Hint,
    }
  }
  return null;
}
