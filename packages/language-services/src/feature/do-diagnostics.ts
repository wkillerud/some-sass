import {
	SassDocumentSymbol,
	SymbolKind,
	SyntaxNodeType,
	Diagnostic,
	TextDocument,
	DiagnosticTag,
	DiagnosticSeverity,
	LanguageServiceOptions,
	Stylesheet,
} from "@somesass/language-server-types";
import { getLanguageService } from "@somesass/language-services";
import { asDollarlessVariable } from "../utils/string";
import { LanguageFeature } from "./workspace-feature";

export class SassDiagnostics extends LanguageFeature {
	#languageServerOptions: LanguageServiceOptions;

	constructor(options: LanguageServiceOptions) {
		super(options);
		this.#languageServerOptions = options;
	}

	async doDiagnostics(
		document: TextDocument,
		stylesheet: Stylesheet,
	): Promise<Diagnostic[]> {
		const diagnostics: Diagnostic[] = [];
		const ls = getLanguageService(this.#languageServerOptions);

		const references: SassDocumentSymbol[] = ls
			.findDocumentSymbols(document)
			.filter(isReference(document, stylesheet));

		if (references.length === 0) {
			return diagnostics;
		}

		// Get all symbols in the module import tree
		const symbols = await this.traverseDocuments<SassDocumentSymbol>(
			(document, prefix) => {
				const symbols = ls.findDocumentSymbols(document);
				const result: SassDocumentSymbol[] = [];
				for (const symbol of symbols) {
					if (symbol.kind === SymbolKind.Class) {
						// Placeholders are not namespaced the same way other symbols are
						result.push(symbol);
						continue;
					}

					// The symbol may have a prefix in the open document, so we need to add it here
					// so we can compare apples to apples later on.
					let symbolName = `${prefix}${asDollarlessVariable(symbol.name)}`;
					if (symbol.kind === SymbolKind.Variable) {
						symbolName = `$${symbolName}`;
					}

					result.push({
						...symbol,
						name: symbolName,
					});
				}
				return result;
			},
			document,
		);

		if (symbols.length === 0) {
			return diagnostics;
		}

		// For each symbol referenced in the current document
		for (const reference of references) {
			// Look through the symbols in our import tree and match it to the
			// reference we found in the open document. Look for data on
			// the declaration such as a deprecation notice.
			for (const symbol of symbols) {
				if (symbol.kind === reference.kind && symbol.name === reference.name) {
					const diagnostic = createDiagnostic(reference);
					if (diagnostic) {
						diagnostics.push(diagnostic);
					}
				}
			}
		}

		return diagnostics;
	}
}

/**
 * @param sassDocument
 * @returns True if the symbol is a reference, as opposed to a declaration
 */
function isReference(
	document: TextDocument,
	ast: Stylesheet,
): (
	value: SassDocumentSymbol,
	index: number,
	array: SassDocumentSymbol[],
) => unknown {
	return (symbol) => {
		if (symbol.kind === SymbolKind.Variable) {
			const variable = ast.resolve(
				document.offsetAt(symbol.selectionRange.start),
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
			const placeholder = ast.resolve(
				document.offsetAt(symbol.selectionRange.start),
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

function createDiagnostic(symbol: SassDocumentSymbol): Diagnostic | null {
	// TODO: actually parse sassdoc somewhere. findDocumentSymbols?
	if (typeof symbol.sassdoc?.deprecated !== "undefined") {
		return {
			message: symbol.sassdoc.deprecated || `${symbol.name} is deprecated`,
			range: symbol.range,
			source: "Some Sass",
			tags: [DiagnosticTag.Deprecated],
			severity: DiagnosticSeverity.Hint,
		};
	}

	return null;
}
