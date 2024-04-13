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
} from "../language-services-types";
import { asDollarlessVariable } from "../utils/sass";

type References = {
	declaration: {
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
						context.includeDeclaration) &&
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
				let parent = refNode?.getParent();
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
					if (!definition) return references;

					name = refNode.getText();
					const definitionSymbol = await this.findDefinitionSymbol(
						definition,
						name,
					);

					if (!definitionSymbol) return references;
					kind = definitionSymbol.kind;
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

		if (!name || !kind) {
			return references;
		}

		// Check to see if we have a symbol of name and kind in the current document
		const symbols = this.ls.findDocumentSymbols(document);
		const definition = symbols.find(
			(symbol) => symbol.name === name && symbol.kind === kind,
		);
		if (definition) {
			references.declaration = {
				symbol: definition,
				document,
			};
		} else {
			// If not, get the definition for the current position
			const definition = await this.ls.findDefinition(document, position);
			if (definition) {
				const document = this._internal.cache.getDocument(definition.uri);
				if (document) {
					const dollarlessName = asDollarlessVariable(name);
					const symbols = this.ls.findDocumentSymbols(document);
					const definitionSymbol = symbols.find(
						(symbol) =>
							dollarlessName.includes(asDollarlessVariable(symbol.name)) && // use includes because of @forward prefixing
							symbol.kind === kind,
					);
					if (definitionSymbol) {
						// The symbol includes @function and @mixin in the case of declarations, which is what we're looking for here.
						// Those extra characters makes the range comparison later tricky, so overwrite using the range
						// without those keywords.
						definitionSymbol.range = definition.range;

						references.declaration = {
							symbol: definitionSymbol,
							document,
						};
					}
				}
			}
		}

		// If we don't have a definition, we might be dealing with a Sass built-in
		let builtin: [string, string] | null = null;
		if (!references.declaration) {
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
		if (!references.declaration && !builtin) {
			return references;
		}

		const dollarlessDefinitionName = asDollarlessVariable(
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			builtin ? builtin[1] : references.declaration!.symbol.name,
		);
		for (const doc of this._internal.cache.documents()) {
			const stylesheet = this.ls.parseStylesheet(doc);
			const candidates: Reference[] = [];

			stylesheet.accept((node) => {
				let candidateName: string | undefined;
				let candidateKinds: SymbolKind[] = [];

				switch (node.type) {
					case NodeType.VariableName: {
						const parent = node?.getParent();
						if (
							parent &&
							(parent.type !== NodeType.VariableDeclaration ||
								context.includeDeclaration) &&
							parent.type !== NodeType.FunctionParameter
						) {
							candidateName = (node as Variable).getName();
							candidateKinds = [SymbolKind.Variable];
						}
						break;
					}
					case NodeType.Identifier: {
						let n;
						let type: SymbolKind | null = null;
						const parent = node?.getParent();
						// if parent is ForwardVisibility, we can't tell between functions or mixins, same as find-definition
						if (parent && parent.type === NodeType.ForwardVisibility) {
							candidateName = node.getText();
							candidateKinds = [SymbolKind.Function, SymbolKind.Method];
						} else {
							if (
								parent &&
								(parent.type === NodeType.Function ||
									(parent.type === NodeType.FunctionDeclaration &&
										context.includeDeclaration))
							) {
								n = parent;
								type = SymbolKind.Function;
							} else if (
								parent &&
								(parent.type === NodeType.MixinReference ||
									(parent.type === NodeType.MixinDeclaration &&
										context.includeDeclaration))
							) {
								n = parent;
								type = SymbolKind.Method;
							}
							if (type === null) {
								return true;
							}
							if (n) {
								candidateName = (n as Function | MixinReference).getName();
								candidateKinds = [type];
							}
						}
						break;
					}
					case NodeType.MixinReference: {
						candidateName = (node as MixinReference)?.getName();
						candidateKinds = [SymbolKind.Method];
						break;
					}

					case NodeType.SelectorPlaceholder: {
						candidateName = node?.getText();
						candidateKinds = [SymbolKind.Class];
						break;
					}
				}

				if (!candidateName || !candidateKinds.length) {
					return true;
				}

				if (candidateName.includes(dollarlessDefinitionName)) {
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

				return true;
			});

			for (const candidate of candidates) {
				if (references.declaration) {
					const candidateIsDeclaration =
						candidate.name === references.declaration.symbol.name &&
						candidate.kind === references.declaration.symbol.kind &&
						candidate.location.uri === references.declaration.document.uri &&
						// Only check the start position here, since
						// a VariableDeclaration's range is larger than
						// a Variable reference's range (which doesn't include the value).
						this.isSamePosition(
							candidate.location.range.start,
							references.declaration.symbol.range.start,
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
						const candidateDeclarationSymbol = await this.findDefinitionSymbol(
							candidateDeclaration,
							name,
						);
						if (candidateDeclarationSymbol != null) {
							// The symbol includes @function and @mixin in the case of declarations, which is what we're looking for here.
							// Those extra characters makes the range comparison later tricky, so overwrite using the range
							// without those keywords.
							candidateDeclaration.range = candidateDeclarationSymbol.range;

							const isSameFile = await this.isSameRealPath(
								candidateDeclaration.uri,
								references.declaration.document.uri,
							);

							// Only check the start position here, since
							// a VariableDeclaration's range is larger than
							// a Variable reference's range (which doesn't include the value).
							const isSamePosition = this.isSamePosition(
								candidateDeclaration.range.start,
								references.declaration.symbol.range.start,
							);

							if (isSameFile && isSamePosition) {
								references.references.push(candidate);
								continue;
							}
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
					this.contains(symbol.range, definition.range)
				) {
					return symbol;
				}
			}
		}

		return null;
	}
}
