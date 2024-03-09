import {
	Range,
	SassDocumentSymbol,
	Stylesheet,
	SymbolKind,
	SyntaxNodeType,
	TextDocument,
	TreeCursor,
} from "@somesass/language-server-types";
import { SymbolTag } from "vscode";

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
		const kind = typeToKind(type);

		// TODO:
		// These are the ones in use by the language server _today_
		// - [/] Sass variable. SymbolKind.Variable.
		// - [/] Sass mixin. SymbolKind.Method.
		// - [/] Sass function. SymbolKind.Function.
		// - [/] CSS Selector. SymbolKind.Class.
		// These are the ones in use by vscode-css-languageservice for feature parity
		// - [/] Keyframe at rule. SymbolKind.Class.
		// - [/] Fontface at rule. SymbolKind.Class.
		// - [/] Media at rule. SymbolKind.Module.

		/**
		 * The name of this symbol. Will be displayed in the user interface and therefore must not be
		 * an empty string or a string only consisting of white spaces.
		 */
		const name: string = "<undefined>";

		/**
		 * More detail for this symbol, e.g the signature of a function.
		 */
		const detail: string | undefined = undefined;

		/**
		 * Tags such as deprecated.
		 */
		const tags: SymbolTag[] = [];

		/**
		 * The range enclosing this symbol not including leading/trailing whitespace but everything else
		 * like comments. This information is typically used to determine if the clients cursor is
		 * inside the symbol to reveal in the symbol in the UI.
		 */
		const range = Range.create(
			document.positionAt(from),
			document.positionAt(to),
		);

		/**
		 * The range that should be selected and revealed when this symbol is being picked, e.g the name of a function.
		 * Must be contained by the `range`.
		 */
		const selectionRange = range;

		symbols.push({
			name,
			detail,
			kind,
			type,
			tags,
			range,
			selectionRange,
			children,
		});
	}
	return symbols;
}

/**
 * Translate  @lezer/sass SyntaxNodeType to vscode-languageserver-types SymbolKind
 */
function typeToKind(type: SyntaxNodeType): SymbolKind {
	switch (type) {
		case SyntaxNodeType.mixin:
			return SymbolKind.Method;

		case SyntaxNodeType.SassVariableName:
			return SymbolKind.Variable;

		case SyntaxNodeType.MediaStatement:
			return SymbolKind.Module;

		case SyntaxNodeType.CallExpression:
		case SyntaxNodeType.CallLiteral:
			return SymbolKind.Method;

		case SyntaxNodeType.selector:
		case SyntaxNodeType.AtRule:
		case SyntaxNodeType.KeyframesStatement:
			return SymbolKind.Class;

		case SyntaxNodeType.StringLiteral:
		default:
			return SymbolKind.String;
	}
}
