import {
	Range,
	SassDocumentSymbol,
	Stylesheet,
	SymbolKind,
	SyntaxNodeType,
	TextDocument,
	TreeCursor,
} from "@somesass/language-server-types";

// export interface DocumentSymbol {
// 	/**
// 	 * The name of this symbol. Will be displayed in the user interface and therefore must not be
// 	 * an empty string or a string only consisting of white spaces.
// 	 */
// 	name: string;
// 	/**
// 	 * More detail for this symbol, e.g the signature of a function.
// 	 */
// 	detail?: string;
// 	/**
// 	 * The kind of this symbol.
// 	 */
// 	kind: SymbolKind;
// 	/**
// 	 * Tags for this document symbol.
// 	 *
// 	 * @since 3.16.0
// 	 */
// 	tags?: SymbolTag[];
// 	/**
// 	 * The range enclosing this symbol not including leading/trailing whitespace but everything else
// 	 * like comments. This information is typically used to determine if the clients cursor is
// 	 * inside the symbol to reveal in the symbol in the UI.
// 	 */
// 	range: Range;
// 	/**
// 	 * The range that should be selected and revealed when this symbol is being picked, e.g the name of a function.
// 	 * Must be contained by the `range`.
// 	 */
// 	selectionRange: Range;
// 	/**
// 	 * Children of this symbol, e.g. properties of a class.
// 	 */
// 	children?: DocumentSymbol[];
// }

export class SassSymbolFinder {
	findDocumentSymbols(
		document: TextDocument,
		stylesheet: Stylesheet,
	): SassDocumentSymbol[] {
		const source = document.getText();
		const symbols = findTreeSymbols(document, source, stylesheet.cursor());
		return symbols;
	}
}

function findTreeSymbols(
	document: TextDocument,
	source: string,
	tree: TreeCursor,
): SassDocumentSymbol[] {
	const symbols: SassDocumentSymbol[] = [];
	while (tree.next()) {
		let children: SassDocumentSymbol[] | undefined = undefined;
		if (tree.node.firstChild) {
			children = findTreeSymbols(
				document,
				source,
				tree.node.firstChild.cursor(),
			);
		}
		const from = tree.node.from;
		const to = tree.node.to;
		const type = tree.node.type.name as SyntaxNodeType;
		symbols.push({
			name: source.substring(from, to),
			type,
			kind: typeToKind(type),
			range: Range.create(document.positionAt(from), document.positionAt(to)),
			selectionRange: Range.create(
				document.positionAt(from),
				document.positionAt(to),
			),
			children,
		});
	}
	return symbols;
}

/**
 * // TODO: flesh this one out once you know which SyntaxNodeType are relevant
 * Returns one of these SymbolKind, defaulting to SymbolKind.String. Match the expected SymbolKind from vscode-css-languageservice
 * - SymbolKind.Module,
 * - SymbolKind.Namespace,
 * - SymbolKind.Class,
 * - SymbolKind.Method,
 * - SymbolKind.Property,
 * - SymbolKind.Field,
 * - SymbolKind.Constructor,
 * - SymbolKind.Enum,
 * - SymbolKind.Function,
 * - SymbolKind.Variable,
 * - SymbolKind.Constant,
 * - SymbolKind.String,
 * - SymbolKind.Number,
 * - SymbolKind.Boolean,
 * - SymbolKind.Array,
 * - SymbolKind.Object,
 * - SymbolKind.Key,
 * - SymbolKind.Null,
 * - SymbolKind.Operator
 *
 * @param type
 * @returns
 */
function typeToKind(type: SyntaxNodeType): SymbolKind {
	switch (type) {
		case SyntaxNodeType.MediaStatement:
			return SymbolKind.Module;
		case SyntaxNodeType.CallExpression:
			return SymbolKind.Method;
		case SyntaxNodeType.ClassName:
			return SymbolKind.Class;
		case SyntaxNodeType.StringLiteral:
		default:
			return SymbolKind.String;
	}
}
