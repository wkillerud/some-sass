import { Diagnostic, DiagnosticSeverity, DiagnosticTag, VersionedTextDocumentIdentifier } from 'vscode-languageserver-types';
import { EXTENSION_NAME } from '../../constants';
import type StorageService from '../services/storage';
import { INode, NodeType } from '../types/nodes';
import type { ScssFunction, ScssMixin, ScssVariable } from '../types/symbols';

export async function doDiagnostics(
  document: VersionedTextDocumentIdentifier,
  storage: StorageService
): Promise<Diagnostic[]> {
  const diagnostics: Diagnostic[] = [];

  const currentScssDocument = storage.get(document.uri);
  if (!currentScssDocument) {
    console.error("Tried to do diagnostics on a document that has not been scanned. This should never happen.");
    return diagnostics;
  }

  const references: INode[] = getVariableFunctionMixinReferences(currentScssDocument.ast);
  if (references.length === 0) {
    return diagnostics;
  }


  for (const node of references) {
    const identifier = {
      type: node.type,
      name: node.getName(),
    };

    const scssDocuments = storage.values();
    for (const scssDocument of scssDocuments) {
      if (identifier.type === NodeType.VariableName && scssDocument.variables.has(identifier.name)) {
        const variable = scssDocument.variables.get(identifier.name) as ScssVariable;
        if (typeof variable.sassdoc?.deprecated !== 'undefined') {
          diagnostics.push({
            message: variable.sassdoc.deprecated || `${identifier.name} is deprecated`,
            range: currentScssDocument.getNodeRange(node),
            source: EXTENSION_NAME,
            tags: [DiagnosticTag.Deprecated],
            severity: DiagnosticSeverity.Hint,
          })
        }
      } else if (identifier.type === NodeType.MixinReference && scssDocument.mixins.has(identifier.name)) {
        const mixin = scssDocument.mixins.get(identifier.name) as ScssMixin;
        if (typeof mixin.sassdoc?.deprecated !== 'undefined') {
          diagnostics.push({
            message: mixin.sassdoc.deprecated || `${identifier.name} is deprecated`,
            range: currentScssDocument.getNodeRange(node),
            source: EXTENSION_NAME,
            tags: [DiagnosticTag.Deprecated],
            severity: DiagnosticSeverity.Hint,
          })
        }
      } else if (identifier.type === NodeType.Function && scssDocument.functions.has(identifier.name)) {
        const func = scssDocument.functions.get(identifier.name) as ScssFunction;
        if (typeof func.sassdoc?.deprecated !== 'undefined') {
          diagnostics.push({
            message: func.sassdoc.deprecated || `${identifier.name} is deprecated`,
            range: currentScssDocument.getNodeRange(node),
            source: EXTENSION_NAME,
            tags: [DiagnosticTag.Deprecated],
            severity: DiagnosticSeverity.Hint,
          })
        }
      }
    }
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