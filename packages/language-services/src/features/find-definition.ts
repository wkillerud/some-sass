import { getNodeAtOffset } from "@somesass/vscode-css-languageservice";
import { LanguageFeature } from "../language-feature";
import {
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
	Variable,
} from "../language-services-types";
import { asDollarlessVariable } from "../utils/sass";

export class FindDefinition extends LanguageFeature {
	async findDefinition(
		document: TextDocument,
		position: Position,
	): Promise<Location | null> {
		const stylesheet = this.ls.parseStylesheet(document);
		const offset = document.offsetAt(position);
		const node = getNodeAtOffset(stylesheet, offset);
		if (!node) {
			return this.getUpstreamLanguageServer(document).findDefinition(
				document,
				position,
				stylesheet,
			);
		}

		// Sometimes we can't tell at position whether an identifier is a Method or a Function
		// so we'll need to look for more than one SymbolKind.
		let kinds: SymbolKind[] | undefined;
		let name: string | undefined;
		switch (node.type) {
			case NodeType.VariableName: {
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
				break;
			}
			case NodeType.SelectorPlaceholder: {
				name = node.getText();
				kinds = [SymbolKind.Class];
				break;
			}
			case NodeType.Function: {
				const identifier = (node as Function).getIdentifier();
				if (!identifier) break;

				name = identifier.getText();
				kinds = [SymbolKind.Function];
				break;
			}
			case NodeType.MixinReference: {
				const identifier = (node as MixinReference).getIdentifier();
				if (!identifier) break;

				name = identifier.getText();
				kinds = [SymbolKind.Method];
				break;
			}
			case NodeType.Identifier: {
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
				break;
			}
		}

		if (!name || !kinds) {
			return this.getUpstreamLanguageServer(document).findDefinition(
				document,
				position,
				stylesheet,
			);
		}

		// Traverse the workspace looking for a symbol of kinds.includes(symbol.kind) && name === symbol.name
		const result = await this.findInWorkspace<Location>(
			(document, prefix) => {
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
			},
			document,
			{ lazy: true },
		);

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

		return this.getUpstreamLanguageServer(document).findDefinition(
			document,
			position,
			stylesheet,
		);
	}
}
