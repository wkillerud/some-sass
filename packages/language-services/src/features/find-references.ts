import { sassBuiltInModules } from "../facts/sass";
import { LanguageFeature } from "../language-feature";
import {
	TextDocument,
	SassDocumentSymbol,
	Location,
	SymbolKind,
	Position,
	getNodeAtOffset,
	NodeType,
	Variable,
	MixinReference,
	Function,
	Range,
} from "../language-services-types";
import { asDollarlessVariable } from "../utils/sass";

type References = {
	definition: {
		symbol: SassDocumentSymbol;
		document: TextDocument; // could probably do with only the URI here?
	} | null;
	references: Reference[];
};

type Reference = {
	location: Location;
	name: string;
	kind: SymbolKind | null;
	defaultBehavior: boolean;
};

export class FindReferences extends LanguageFeature {
	async findReferences(
		document: TextDocument,
		position: Position,
	): Promise<Location[]> {
		const references = await this.internalFindReferences(document, position);
		return references.references.map((r) => r.location);
	}

	protected async internalFindReferences(
		document: TextDocument,
		position: Position,
		includeDeclaration = false,
	): Promise<References> {
		const references: References = {
			definition: null,
			references: [],
		};

		const stylesheet = this.ls.parseStylesheet(document);
		const refNode = getNodeAtOffset(stylesheet, document.offsetAt(position));
		if (!refNode) return references;

		let kind: SymbolKind | undefined;
		let name: string | undefined;
		switch (refNode.type) {
			case NodeType.VariableName: {
				const parent = refNode?.getParent();
				if (
					parent &&
					(parent.type !== NodeType.VariableDeclaration ||
						includeDeclaration) &&
					parent.type !== NodeType.FunctionParameter
				) {
					name = (refNode as Variable).getName();
					kind = SymbolKind.Variable;
				}
				break;
			}
			case NodeType.Identifier: {
				let node;
				let type: SymbolKind | null = null;
				const parent = refNode?.getParent();
				if (
					parent &&
					(parent.type === NodeType.Function ||
						(parent.type === NodeType.FunctionDeclaration &&
							includeDeclaration))
				) {
					node = parent;
					type = SymbolKind.Function;
				} else if (
					parent &&
					(parent.type === NodeType.MixinReference ||
						(parent.type === NodeType.MixinDeclaration && includeDeclaration))
				) {
					node = parent;
					type = SymbolKind.Method;
				}
				if (type === null) {
					return references;
				}
				if (node) {
					name = (node as Function | MixinReference).getName();
					kind = type;
				}
				break;
			}

			case NodeType.MixinReference: {
				name = (refNode as MixinReference)?.getName();
				kind = SymbolKind.Method;
				break;
			}

			case NodeType.SelectorPlaceholder: {
				name = refNode?.getText();
				kind = SymbolKind.Class;
				break;
			}
		}

		// Check to see if we have a symbol of name and kind in the current document
		const symbols = this.ls.findDocumentSymbols(document);
		const definition = symbols.find(
			(symbol) => symbol.name === name && symbol.kind === kind,
		);
		if (definition) {
			references.definition = {
				symbol: definition,
				document,
			};
		} else {
			// If not, get the definition for the current position
			const definition = await this.ls.findDefinition(document, position);
			if (definition) {
				const document = this._internal.cache.getDocument(definition.uri);
				if (document) {
					const symbols = this.ls.findDocumentSymbols(document);
					const definition = symbols.find(
						(symbol) => symbol.name === name && symbol.kind === kind,
					);
					if (definition) {
						references.definition = {
							symbol: definition,
							document,
						};
					}
				}
			}
		}

		// If we don't have a definition, we might be dealing with a Sass built-in
		let builtin: [string, string] | null = null;
		if (!references.definition) {
			// If we don't have a definition anywhere we might be dealing with a built-in.
			// Check to see if that's the case.

			for (const [module, { exports }] of Object.entries(sassBuiltInModules)) {
				for (const [builtinName] of Object.entries(exports)) {
					if (builtinName === name) {
						builtin = [module.split(":")[1] as string, builtinName];
					}
				}
			}
		}

		// If we have neither a definition nor a built-in, return an empty result
		if (!builtin) {
			return references;
		}

		const dollarlessDefinitionName = asDollarlessVariable(
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			builtin ? builtin[1] : references.definition!.symbol.name,
		);
		for (const doc of this._internal.cache.documents()) {
			const stylesheet = this.ls.parseStylesheet(doc);
			const candidates: Reference[] = [];

			// TODO: you are here
			// Look for all the stuff you do in references.ts,
			// but try to do it with the AST instead of the scanner.
			stylesheet.accept((node) => {
				let name: string | undefined;
				let kind: SymbolKind | undefined;

				switch (node.type) {
					case NodeType.VariableName: {
						const parent = refNode?.getParent();
						if (
							parent &&
							(parent.type !== NodeType.VariableDeclaration ||
								includeDeclaration) &&
							parent.type !== NodeType.FunctionParameter
						) {
							name = (refNode as Variable).getName();
							kind = SymbolKind.Variable;
						}
						break;
					}
					case NodeType.Identifier: {
						let node;
						let type: SymbolKind | null = null;
						const parent = refNode?.getParent();
						if (
							parent &&
							(parent.type === NodeType.Function ||
								(parent.type === NodeType.FunctionDeclaration &&
									includeDeclaration))
						) {
							node = parent;
							type = SymbolKind.Function;
						} else if (
							parent &&
							(parent.type === NodeType.MixinReference ||
								(parent.type === NodeType.MixinDeclaration &&
									includeDeclaration))
						) {
							node = parent;
							type = SymbolKind.Method;
						}
						if (type === null) {
							return true;
						}
						if (node) {
							name = (node as Function | MixinReference).getName();
							kind = type;
						}
						break;
					}

					case NodeType.MixinReference: {
						name = (refNode as MixinReference)?.getName();
						kind = SymbolKind.Method;
						break;
					}

					case NodeType.SelectorPlaceholder: {
						name = refNode?.getText();
						kind = SymbolKind.Class;
						break;
					}
				}

				if (!name || !kind) {
					return true;
				}

				if (name.includes(dollarlessDefinitionName)) {
					candidates.push({
						location: {
							uri: doc.uri,
							range: Range.create(
								doc.positionAt(node.offset),
								doc.positionAt(node.end),
							),
						},
						name,
						kind,
						defaultBehavior: false,
					});
				}

				return true;
			});

			for (const candidate of candidates) {
				if (references.definition) {
					const candidateDefinition = await this.ls.findDefinition(
						doc,
						candidate.location.range.start,
					);
					if (candidateDefinition != null) {
						const isSameFile =
							candidateDefinition.uri === references.definition.document.uri;

						const isSameRange =
							candidateDefinition.range.start.line ===
								references.definition.symbol.range.start.line &&
							candidateDefinition.range.start.character ===
								references.definition.symbol.range.start.character;

						if (isSameFile && isSameRange) {
							references.references.push(candidate);
							continue;
						}
					}
				}

				// If we don't have a reference.definition or candidateDefinition, we might be dealing with a built-in.
				// If that's the case, add the reference even without the definition.
				if (builtin) {
					const builtinName = builtin[1];
					// Only support modern modules with this feature as well.
					if (builtinName.includes(candidate.name)) {
						references.references.push({
							...candidate,
							defaultBehavior: true,
						});
					}
				}
			}
		}

		return references;
	}
}
