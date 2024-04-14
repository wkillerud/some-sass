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
	URI,
	ReferenceContext,
	Node,
	MixinDeclaration,
} from "../language-services-types";
import { asDollarlessVariable } from "../utils/sass";

type Declaration = {
	symbol: SassDocumentSymbol;
	document: TextDocument;
};

type References = {
	declaration: Declaration | null;
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
		context: ReferenceContext = { includeDeclaration: true },
	): Promise<Location[]> {
		const references = await this.internalFindReferences(
			document,
			position,
			context,
		);
		return references.references.map((r) => r.location);
	}

	protected async internalFindReferences(
		document: TextDocument,
		position: Position,
		context: ReferenceContext,
	): Promise<References> {
		const references: References = {
			declaration: null,
			references: [],
		};

		const { declaration, name } = await this.getDeclaration(
			document,
			position,
			context,
		);

		references.declaration = declaration;

		let builtin: [string, string] | null = null;
		if (!references.declaration) {
			// If we don't have a declaration anywhere we might be dealing with a built-in.
			// Check to see if that's the case.

			for (const [module, { exports }] of Object.entries(sassBuiltInModules)) {
				for (const [builtinName] of Object.entries(exports)) {
					if (builtinName === name) {
						builtin = [module.split(":")[1] as string, builtinName];
					}
				}
			}
		}

		// If we have neither a declaration nor a built-in, return an empty result
		if (!references.declaration && !builtin) {
			return references;
		}

		for (const doc of this._internal.cache.documents()) {
			const stylesheet = this.ls.parseStylesheet(doc);
			const candidates: Reference[] = [];

			stylesheet.accept((node) => {
				switch (node.type) {
					case NodeType.VariableName: {
						const parent = node?.getParent();
						if (!parent) break;

						if (
							(parent.type !== NodeType.VariableDeclaration ||
								context.includeDeclaration) &&
							parent.type !== NodeType.FunctionParameter
						) {
							const candidateName = (node as Variable).getName();
							candidates.push({
								location: {
									uri: doc.uri,
									range: Range.create(
										doc.positionAt(node.offset),
										doc.positionAt(node.end),
									),
								},
								name: candidateName,
								kind: SymbolKind.Variable,
								defaultBehavior: false,
							});
						}
						break;
					}

					case NodeType.Function: {
						const identifier = (node as Function).getIdentifier();
						if (!identifier) break;

						// To avoid collisions with CSS functions, only support built-ins in the module system
						if (builtin && node.parent?.type !== NodeType.Module) break;

						candidates.push({
							location: {
								uri: doc.uri,
								range: Range.create(
									doc.positionAt(identifier.offset),
									doc.positionAt(identifier.end),
								),
							},
							name: identifier.getText(),
							kind: SymbolKind.Function,
							defaultBehavior: false,
						});
						break;
					}

					case NodeType.FunctionDeclaration: {
						if (!context.includeDeclaration) break;
						const identifier = (node as MixinDeclaration).getIdentifier();
						if (!identifier) break;

						candidates.push({
							location: {
								uri: doc.uri,
								range: Range.create(
									doc.positionAt(identifier.offset),
									doc.positionAt(identifier.end),
								),
							},
							name: identifier.getText(),
							kind: SymbolKind.Function,
							defaultBehavior: false,
						});
						break;
					}

					case NodeType.MixinReference: {
						const identifier = (node as MixinReference).getIdentifier();
						if (!identifier) break;

						candidates.push({
							location: {
								uri: doc.uri,
								range: Range.create(
									doc.positionAt(identifier.offset),
									doc.positionAt(identifier.end),
								),
							},
							name: identifier.getText(),
							kind: SymbolKind.Method,
							defaultBehavior: false,
						});
						break;
					}

					case NodeType.MixinDeclaration: {
						if (!context.includeDeclaration) break;
						const identifier = (node as MixinDeclaration).getIdentifier();
						if (!identifier) break;

						candidates.push({
							location: {
								uri: doc.uri,
								range: Range.create(
									doc.positionAt(identifier.offset),
									doc.positionAt(identifier.end),
								),
							},
							name: identifier.getText(),
							kind: SymbolKind.Method,
							defaultBehavior: false,
						});
						break;
					}

					case NodeType.SelectorPlaceholder: {
						const candidateName = node?.getText();
						candidates.push({
							location: {
								uri: doc.uri,
								range: Range.create(
									doc.positionAt(node.offset),
									doc.positionAt(node.end),
								),
							},
							name: candidateName,
							kind: SymbolKind.Class,
							defaultBehavior: false,
						});
						break;
					}

					case NodeType.Identifier: {
						const parent = node?.getParent();
						if (!parent) break;

						if (parent.type === NodeType.ForwardVisibility) {
							// if parent is ForwardVisibility, we can't tell between functions or mixins, so look for both.
							const candidateKinds = [SymbolKind.Function, SymbolKind.Method];
							const candidateName = node.getText();
							for (const kind of candidateKinds) {
								candidates.push({
									location: {
										uri: doc.uri,
										range: Range.create(
											doc.positionAt(node.offset),
											doc.positionAt(node.end),
										),
									},
									name: candidateName,
									kind,
									defaultBehavior: false,
								});
							}
						}
						break;
					}
				}

				return true;
			});

			for (const candidate of candidates) {
				if (references.declaration) {
					if (candidate.kind !== references.declaration.symbol.kind) continue;

					const candidateIsDeclaration =
						candidate.name === references.declaration.symbol.name &&
						candidate.kind === references.declaration.symbol.kind &&
						candidate.location.uri === references.declaration.document.uri &&
						// Only check the start position here, since
						// a VariableDeclaration's range is larger than
						// a Variable reference's range (which doesn't include the value).
						this.isSamePosition(
							candidate.location.range.start,
							references.declaration.symbol.selectionRange.start,
						);

					if (!context.includeDeclaration && candidateIsDeclaration) {
						continue;
					} else if (candidateIsDeclaration) {
						references.references.push(candidate);
						continue;
					}

					const candidateDeclaration = await this.ls.findDefinition(
						doc,
						candidate.location.range.start,
					);
					if (candidateDeclaration != null) {
						const isSameFile = await this.isSameRealPath(
							candidateDeclaration.uri,
							references.declaration.document.uri,
						);

						// Only check the start position here, since
						// a VariableDeclaration's range is larger than
						// a Variable reference's range (which doesn't include the value).
						const isSamePosition = this.isSamePosition(
							candidateDeclaration.range.start,
							references.declaration.symbol.selectionRange.start,
						);

						if (isSameFile && isSamePosition) {
							references.references.push(candidate);
							continue;
						}
					}
				}

				// If we don't have a reference.definition or candidateDefinition, we might be dealing with a built-in.
				// If that's the case, add the reference even without the definition.
				if (builtin) {
					const builtinName = builtin[1];
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

	async getDeclaration(
		document: TextDocument,
		position: Position,
		context: ReferenceContext,
	): Promise<{
		name: string | null;
		kind: SymbolKind | null;
		declaration: Declaration | null;
	}> {
		const result: {
			name: string | null;
			kind: SymbolKind | null;
			declaration: Declaration | null;
		} = {
			name: null,
			kind: null,
			declaration: null,
		};

		const stylesheet = this.ls.parseStylesheet(document);
		const refNode = getNodeAtOffset(stylesheet, document.offsetAt(position));
		if (!refNode) return result;

		switch (refNode.type) {
			case NodeType.VariableName: {
				const parent = refNode?.getParent();
				if (
					parent &&
					(parent.type !== NodeType.VariableDeclaration ||
						context.includeDeclaration) &&
					parent.type !== NodeType.FunctionParameter
				) {
					result.name = (refNode as Variable).getName();
					result.kind = SymbolKind.Variable;
				}
				break;
			}

			case NodeType.Function: {
				result.name = (refNode as Function).getName();
				result.kind = SymbolKind.Function;
				break;
			}

			case NodeType.FunctionDeclaration: {
				if (!context.includeDeclaration) break;
				result.name = (refNode as Function).getName();
				result.kind = SymbolKind.Function;
				break;
			}

			case NodeType.MixinReference: {
				result.name = (refNode as MixinReference)?.getName();
				result.kind = SymbolKind.Method;
				break;
			}

			case NodeType.MixinDeclaration: {
				if (!context.includeDeclaration) break;
				result.name = (refNode as MixinReference).getName();
				result.kind = SymbolKind.Method;
				break;
			}

			case NodeType.SelectorPlaceholder: {
				result.name = refNode?.getText();
				result.kind = SymbolKind.Class;
				break;
			}

			case NodeType.Identifier: {
				let node;
				let type: SymbolKind | null = null;
				let parent = refNode?.getParent();

				// For modules, the identifier and function/mixin are sibling nodes.
				if (parent && parent.type === NodeType.Module) {
					parent =
						parent
							.getChildren()
							.find(
								(c) =>
									c.type === NodeType.Function ||
									c.type === NodeType.MixinReference,
							) || null;
					if (parent) {
						node = (
							parent as Function | MixinReference
						).getIdentifier() as Node;
					}
				}

				if (parent && parent.type === NodeType.ForwardVisibility) {
					// At this point the identifier can be both a function and a mixin.
					// To figure it out we need to look for the original definition.
					const definition = await this.ls.findDefinition(document, position);
					if (!definition) break;

					result.name = refNode.getText();
					const definitionSymbol = await this.findDefinitionSymbol(
						definition,
						result.name,
					);

					if (!definitionSymbol) break;
					result.kind = definitionSymbol.kind;
					break;
				}

				if (
					parent &&
					(parent.type === NodeType.Function ||
						(parent.type === NodeType.FunctionDeclaration &&
							context.includeDeclaration))
				) {
					node = parent;
					type = SymbolKind.Function;
				} else if (
					parent &&
					(parent.type === NodeType.MixinReference ||
						(parent.type === NodeType.MixinDeclaration &&
							context.includeDeclaration))
				) {
					node = parent;
					type = SymbolKind.Method;
				}
				if (type === null) break;
				if (node) {
					result.name = (node as Function | MixinReference).getName();
					result.kind = type;
				}
				break;
			}
		}

		if (!result.name || !result.kind) return result;

		// Check to see if we have a symbol of name and kind in the current document
		const symbols = this.ls.findDocumentSymbols(document);
		const definition = symbols.find(
			(symbol) => symbol.name === result.name && symbol.kind === result.kind,
		);
		if (definition) {
			result.declaration = {
				symbol: definition,
				document,
			};
		} else {
			// If not, get the definition for the current position
			const definition = await this.ls.findDefinition(document, position);
			if (definition) {
				const document = this._internal.cache.getDocument(definition.uri);
				if (document) {
					const dollarlessName = asDollarlessVariable(result.name);
					const symbols = this.ls.findDocumentSymbols(document);
					const definitionSymbol = symbols.find(
						(symbol) =>
							// use includes because of @forward prefixing
							dollarlessName.includes(asDollarlessVariable(symbol.name)) &&
							symbol.kind === result.kind,
					);
					if (definitionSymbol) {
						result.declaration = {
							symbol: definitionSymbol,
							document,
						};
					}
				}
			}
		}

		return result;
	}

	async isSameRealPath(
		candidate: string,
		definition: string,
	): Promise<boolean> {
		// Checking the file system is expensive, so do the optimistic thing first.
		// If the URIs match, we're good.
		if (candidate === definition) {
			return true;
		}

		if (candidate.includes(this.getFileName(definition))) {
			try {
				const candidateDocument = this._internal.cache.getDocument(candidate);
				if (!candidateDocument) {
					return false;
				}

				const realCandidate = await this.options.fileSystemProvider.realPath(
					URI.parse(candidate),
				);
				if (!realCandidate) {
					return false;
				}

				const realDefinition = await this.options.fileSystemProvider.realPath(
					URI.parse(definition),
				);
				if (!realDefinition) {
					return false;
				}

				if (realCandidate === realDefinition) {
					return true;
				}
			} catch {
				// Guess it really doesn't exist
			}
		}

		return false;
	}

	isSamePosition(a: Position, b: Position): boolean {
		return a.line === b.line && a.character === b.character;
	}

	contains(outer: Range, inner: Range): boolean {
		return (
			outer.start.line >= inner.start.line &&
			outer.start.character >= inner.start.character &&
			outer.end.line >= inner.end.line &&
			outer.end.character >= inner.end.character
		);
	}

	async findDefinitionSymbol(
		definition: Location,
		name: string,
	): Promise<SassDocumentSymbol | null> {
		const definitionDocument = this._internal.cache.getDocument(definition.uri);
		if (definitionDocument) {
			const dollarlessName = asDollarlessVariable(name);
			const symbols = this.ls.findDocumentSymbols(definitionDocument);
			for (const symbol of symbols) {
				if (
					dollarlessName.includes(asDollarlessVariable(symbol.name)) &&
					this.contains(symbol.selectionRange, definition.range)
				) {
					return symbol;
				}
			}
		}

		return null;
	}
}
