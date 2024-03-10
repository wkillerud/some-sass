import {
	SassDocumentSymbol,
	SymbolKind,
	SyntaxNodeType,
	Diagnostic,
	TextDocument,
	DiagnosticTag,
	DiagnosticSeverity,
} from "@somesass/language-server-types";
import { getLanguageService } from "@somesass/language-services";
import { EXTENSION_NAME } from "../../constants";
import { useContext } from "../../context-provider";
import type { IScssDocument, ScssForward, ScssSymbol } from "../../parser";
import { asDollarlessVariable } from "../../utils/string";

export async function doDiagnostics(
	document: TextDocument,
): Promise<Diagnostic[]> {
	const diagnostics: Diagnostic[] = [];

	const { storage, fs, clientCapabilities } = useContext();
	const sassDocument = storage.get(document.uri);
	if (!sassDocument) {
		return diagnostics;
	}

	const ls = getLanguageService({ fileSystemProvider: fs, clientCapabilities });
	const references: SassDocumentSymbol[] = ls
		.findDocumentSymbols(sassDocument, sassDocument.ast)
		.filter(isReference(sassDocument));

	if (references.length === 0) {
		return diagnostics;
	}

	// Get all symbols in the module import tree
	const symbols: ScssSymbol[] = [];
	doSymbolHunting(sassDocument, symbols);
	if (symbols.length === 0) {
		return diagnostics;
	}

	// For each symbol referenced in the current document
	for (const sassDocumentSymbol of references) {
		// Look through the symbols in our import tree and match it to the
		// reference we found in the open document. Look for data on
		// the declaration such as a deprecation notice.
		for (const scssSymbol of symbols) {
			if (
				scssSymbol.kind === sassDocumentSymbol.kind &&
				scssSymbol.name === sassDocumentSymbol.name
			) {
				const diagnostic = createDiagnostic(sassDocumentSymbol, scssSymbol);
				if (diagnostic) {
					diagnostics.push(diagnostic);
				}
			}
		}
	}

	return diagnostics;
}

/**
 * @param sassDocument
 * @returns True if the symbol is a reference, as opposed to a declaration
 */
function isReference(
	sassDocument: IScssDocument,
): (
	value: SassDocumentSymbol,
	index: number,
	array: SassDocumentSymbol[],
) => unknown {
	return (symbol) => {
		if (symbol.kind === SymbolKind.Variable) {
			const variable = sassDocument.ast.resolve(
				sassDocument.offsetAt(symbol.selectionRange.start),
			);
			const variableParent = variable.parent;
			if (
				variableParent?.node.type.name !== SyntaxNodeType.Declaration &&
				variableParent?.node.type.name !== SyntaxNodeType.ArgList
			) {
				return true;
			}
		}

		if (symbol.type === SyntaxNodeType.IncludeStatement) {
			return true;
		}

		if (
			symbol.kind === SymbolKind.Function &&
			symbol.type !== SyntaxNodeType.MixinStatement // this indicates a declaration, rather than a reference
		) {
			return true;
		}

		if (symbol.type === SyntaxNodeType.PlaceholderSelector) {
			const placeholder = sassDocument.ast.resolve(
				sassDocument.offsetAt(symbol.selectionRange.start),
			);
			const placeholderParent = placeholder.parent;
			if (
				placeholderParent?.node.type.name === SyntaxNodeType.ExtendStatement
			) {
				return true;
			}
		}

		return false;
	};
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
	node: SassDocumentSymbol,
	symbol: ScssSymbol,
): Diagnostic | null {
	if (typeof symbol.sassdoc?.deprecated !== "undefined") {
		return {
			message: symbol.sassdoc.deprecated || `${symbol.name} is deprecated`,
			range: node.range,
			source: EXTENSION_NAME,
			tags: [DiagnosticTag.Deprecated],
			severity: DiagnosticSeverity.Hint,
		};
	}

	return null;
}
