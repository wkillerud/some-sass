import { LanguageFeature, LanguageFeatureInternal } from "../language-feature";
import {
	LanguageServiceOptions,
	LanguageService,
	TextDocument,
	Location,
	Position,
	FunctionParameter,
	MixinReference,
	Function,
	Node,
	NodeType,
	SymbolKind,
	VariableDeclaration,
	getNodeAtOffset,
	Variable,
} from "../language-services-types";
import { asDollarlessVariable } from "../utils/sass";

export class FindDefinition extends LanguageFeature {
	constructor(
		ls: LanguageService,
		options: LanguageServiceOptions,
		_internal: LanguageFeatureInternal,
	) {
		super(ls, options, _internal);
	}

	async findDefinition(
		document: TextDocument,
		position: Position,
	): Promise<Location | null> {
		const stylesheet = this.ls.parseStylesheet(document);
		const location = this._internal.scssLs.findDefinition(
			document,
			position,
			stylesheet,
		);

		if (location) {
			return location;
		}

		// Symbol was not in the current document, go look for it in the workspace
		const offset = document.offsetAt(position);
		const node = getNodeAtOffset(stylesheet, offset);
		if (!node) {
			return location;
		}

		// Sometimes we can't tell at position whether an identifier is a Method or a Function
		// so we'll need to look for more than one SymbolKind.
		let kinds: SymbolKind[] | undefined;
		let name: string | undefined;

		if (node.type === NodeType.VariableName) {
			const parent = node.getParent();
			if (parent) {
				if (
					!(parent instanceof FunctionParameter) &&
					!(parent instanceof VariableDeclaration)
				) {
					name = (node as Variable).getName();
					kinds = [SymbolKind.Variable];
				}
			}
		} else if (node.type === NodeType.Identifier) {
			const parent = node.getParent();
			if (parent && parent.type === NodeType.ForwardVisibility) {
				name = node.getText();
				// At this point the identifier can be both a function and a mixin.
				kinds = [SymbolKind.Method, SymbolKind.Function];
			} else {
				let i = 0;
				let n: Node | null = node;
				let isMixin = false;
				let isFunction = false;
				while (n && !isMixin && !isFunction && i !== 2) {
					n = n.getParent();
					if (n) {
						isMixin = n.type === NodeType.MixinReference;
						isFunction = n.type === NodeType.Function;
					}
					i++;
				}
				if (n && (isMixin || isFunction)) {
					let kind: SymbolKind = SymbolKind.Method;
					if (isFunction) {
						kind = SymbolKind.Function;
					}
					name = (n as Function | MixinReference).getName();
					kinds = [kind];
				}
			}
		} else if (node.type === NodeType.SelectorPlaceholder) {
			name = node.getText();
			kinds = [SymbolKind.Class];
		}

		if (!name || !kinds) {
			return location;
		}

		// Traverse the workspace looking for a symbol of kinds.includes(symbol.kind) && name === symbol.name
		const result = await this.findInWorkspace<Location>((document, prefix) => {
			const symbols = this.ls.findDocumentSymbols(document);
			for (const symbol of symbols) {
				if (symbol.kind === SymbolKind.Class) {
					// Placeholders are not prefixed the same way other symbols are
					if (kinds!.includes(symbol.kind) && symbol.name === name) {
						return Location.create(document.uri, symbol.selectionRange);
					}
				}

				const prefixedSymbol = `${prefix}${asDollarlessVariable(symbol.name)}`;
				const prefixedName = asDollarlessVariable(name!);
				if (kinds!.includes(symbol.kind) && prefixedSymbol === prefixedName) {
					return Location.create(document.uri, symbol.selectionRange);
				}
			}
		}, document);

		if (result.length !== 0) {
			return result[0];
		}

		// If not found, go through the old fashioned way and assume everything is in scope via @import
		const symbols = this.ls.findWorkspaceSymbols(name);
		for (const symbol of symbols) {
			if (kinds.includes(symbol.kind)) {
				return symbol.location;
			}
		}

		return location;
	}
}
