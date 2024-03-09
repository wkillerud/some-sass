import {
	Range,
	SassDocumentSymbol,
	Stylesheet,
	SymbolKind,
	SyntaxNode,
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
		if (!stylesheet.topNode.firstChild) {
			return [];
		}

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
	do {
		const type = tree.node.type.name as SyntaxNodeType;
		const kind = typeToKind(type);
		if (kind === null) {
			// AST node is not of interest
			continue;
		}

		let children: SassDocumentSymbol[] | undefined = undefined;

		if (type === SyntaxNodeType.PseudoClassSelector) {
			children = [];

			const pseudoClassName = tree.node.getChild(
				SyntaxNodeType.PseudoClassName,
			);

			if (pseudoClassName) {
				children.push(toDocumentSymbol(pseudoClassName, source, document));
			}
			const argsList = tree.node.getChild(SyntaxNodeType.ArgList);
			if (argsList) {
				const value = argsList.getChild(SyntaxNodeType.ClassSelector);
				let args: SassDocumentSymbol[] | undefined = undefined;
				if (value) {
					args = [toDocumentSymbol(value, source, document)];
				}
				children.push(toDocumentSymbol(argsList, source, document, args));
			}
		}

		const symbol: SassDocumentSymbol = toDocumentSymbol(
			tree.node,
			source,
			document,
			children,
		);
		symbols.push(symbol);
	} while (tree.next());

	return symbols;
}

function toDocumentSymbol(
	node: SyntaxNode,
	source: string,
	document: TextDocument,
	children: SassDocumentSymbol[] | undefined = undefined,
) {
	const type = node.type.name as SyntaxNodeType;
	const kind = typeToKind(type) as SymbolKind;

	const from = node.from;
	const to = node.to;

	/**
	 * The name of this symbol. Will be displayed in the user interface and therefore must not be
	 * an empty string or a string only consisting of white spaces.
	 */
	const name: string = source.substring(from, to);

	/**
	 * More detail for this symbol, e.g the signature of a function.
	 */
	const detail: string | undefined = undefined;

	/**
	 * Tags such as deprecated.
	 */
	const tags: SymbolTag[] | undefined = undefined;

	/**
	 * The range enclosing this symbol not including leading/trailing whitespace but everything else
	 * like comments. This information is typically used to determine if the clients cursor is
	 * inside the symbol to reveal in the symbol in the UI.
	 */
	const range = Range.create(
		document.positionAt(
			children?.length && node.parent ? node.parent.from : from,
		),
		document.positionAt(children?.length && node.parent ? node.parent.to : to),
	);

	/**
	 * The range that should be selected and revealed when this symbol is being picked, e.g the name of a function.
	 * Must be contained by the `range`.
	 */
	const selectionRange = Range.create(
		document.positionAt(from),
		document.positionAt(to),
	);

	return { name, detail, tags, range, selectionRange, type, kind, children };
}

/**
 * Translate  @lezer/sass SyntaxNodeType to vscode-languageserver-types SymbolKind
 */
function typeToKind(type: SyntaxNodeType): SymbolKind | null {
	switch (type) {
		case SyntaxNodeType.mixin:
			return SymbolKind.Method;

		case SyntaxNodeType.SassVariableName:
			return SymbolKind.Variable;

		case SyntaxNodeType.MediaStatement:
			return SymbolKind.Module;

		case SyntaxNodeType.ArgList:
		case SyntaxNodeType.CallExpression:
		case SyntaxNodeType.CallLiteral:
			return SymbolKind.Method;

		case SyntaxNodeType.UniversalSelector:
		case SyntaxNodeType.TagSelector:
		case SyntaxNodeType.NestingSelector:
		case SyntaxNodeType.SuffixedSelector:
		case SyntaxNodeType.Interpolation:
		case SyntaxNodeType.ClassSelector:
		case SyntaxNodeType.PseudoClassSelector:
		case SyntaxNodeType.PseudoClassName:
		case SyntaxNodeType.IdSelector:
		case SyntaxNodeType.AttributeSelector:
		case SyntaxNodeType.ChildSelector:
		case SyntaxNodeType.DescendantSelector:
		case SyntaxNodeType.SiblingSelector:
		case SyntaxNodeType.AtRule:
		case SyntaxNodeType.KeyframesStatement:
			return SymbolKind.Class;

		case SyntaxNodeType.StringLiteral:
			return SymbolKind.String;

		default:
			return null;
	}
}
