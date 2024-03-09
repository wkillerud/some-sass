import { SymbolKind, SyntaxNodeType } from "@somesass/language-server-types";

/**
 * Translate  @lezer/sass SyntaxNodeType to vscode-languageserver-types SymbolKind
 */
export function typeToKind(type: SyntaxNodeType): SymbolKind | null {
	switch (type) {
		case SyntaxNodeType.MixinStatement:
			return SymbolKind.Method;

		case SyntaxNodeType.SassVariableName:
			return SymbolKind.Variable;

		case SyntaxNodeType.MediaStatement:
			return SymbolKind.Module;

		case SyntaxNodeType.ArgList:
		case SyntaxNodeType.CallExpression:
		case SyntaxNodeType.CallLiteral:
		case SyntaxNodeType.Callee:
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
