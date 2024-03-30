import {
	NodeType,
	Node,
	SymbolKind,
	TextDocument,
	Position,
	FunctionParameter,
	VariableDeclaration,
	Function,
	MixinReference,
} from "@somesass/language-services";
import { useContext } from "../../context-provider";
import type { IScssDocument, ScssForward, ScssSymbol } from "../../parser";
import type StorageService from "../../storage";
import { asDollarlessVariable } from "../../utils/string";

interface Identifier {
	kind: SymbolKind;
	position: Position;
	name: string;
}

function samePosition(a: Position | undefined, b: Position): boolean {
	if (a === undefined) {
		return false;
	}

	return a.line === b.line && a.character === b.character;
}

export function getDefinition(
	document: TextDocument,
	offset: number,
): [ScssSymbol, IScssDocument] | null {
	const { storage } = useContext();
	const currentScssDocument = storage.get(document.uri);
	if (!currentScssDocument) {
		return null;
	}

	const hoverNode = currentScssDocument.getNodeAt(offset);
	if (!hoverNode || !hoverNode.type) {
		return null;
	}

	const identifier: Identifier | null = getIdentifier(document, hoverNode);
	if (!identifier) {
		return null;
	}

	const [definition, sourceDocument] = getDefinitionSymbol(
		document,
		identifier,
	);

	if (!definition || !sourceDocument) {
		return null;
	}

	return [definition, sourceDocument];
}

function getIdentifier(
	document: TextDocument,
	hoverNode: Node,
): Identifier | null {
	if (hoverNode.type === NodeType.VariableName) {
		const parent = hoverNode.getParent();
		if (parent) {
			const isFunctionParameter = parent.type === NodeType.FunctionParameter;
			const isDeclaration = parent.type === NodeType.VariableDeclaration;

			if (!isFunctionParameter && !isDeclaration) {
				return {
					name: (
						hoverNode as FunctionParameter | VariableDeclaration
					).getName(),
					position: document.positionAt(hoverNode.offset),
					kind: SymbolKind.Variable,
				};
			}
		}
	} else if (hoverNode.type === NodeType.Identifier) {
		if (hoverNode.getParent()?.type === NodeType.ForwardVisibility) {
			// At this point the identifier can be both a function and a mixin.
			// To figure it out we need to look for the original definition as
			// both a function and a mixin.

			const candidateIdentifier: Identifier = {
				name: hoverNode.getText(),
				position: document.positionAt(hoverNode.offset),
				kind: SymbolKind.Method,
			};

			const [asMixin] = getDefinitionSymbol(document, candidateIdentifier);

			if (asMixin) {
				return candidateIdentifier;
			}

			candidateIdentifier.kind = SymbolKind.Function;

			const [asFunction] = getDefinitionSymbol(document, candidateIdentifier);

			if (asFunction) {
				return candidateIdentifier;
			}

			return null;
		}

		let i = 0;
		let node: Node | null = hoverNode;
		let isMixin = false;
		let isFunction = false;

		while (node && !isMixin && !isFunction && i !== 2) {
			node = node.getParent();
			if (node) {
				isMixin = node.type === NodeType.MixinReference;
				isFunction = node.type === NodeType.Function;
			}

			i++;
		}

		if (node && (isMixin || isFunction)) {
			let kind: SymbolKind = SymbolKind.Method;

			if (isFunction) {
				kind = SymbolKind.Function;
			}

			return {
				name: (node as Function | MixinReference).getName(),
				position: document.positionAt(node.offset),
				kind,
			};
		}
	} else if (hoverNode.type === NodeType.SelectorPlaceholder) {
		return {
			name: hoverNode.getText(),
			position: document.positionAt(hoverNode.offset),
			kind: SymbolKind.Class,
		};
	}

	return null;
}

export function getDefinitionSymbol(
	document: TextDocument,
	identifier: Identifier,
): [null, null] | [ScssSymbol, IScssDocument] {
	const { storage } = useContext();
	const scssDocument = storage.get(document.uri);
	if (!scssDocument) {
		return [null, null];
	}

	for (const symbol of scssDocument.getSymbols()) {
		const symbolName = asDollarlessVariable(symbol.name);
		const identifierName = asDollarlessVariable(identifier.name);
		if (symbolName === identifierName && symbol.kind === identifier.kind) {
			return [symbol, scssDocument];
		}
	}

	// Don't follow forwards from the current document, since the current doc doesn't have access to its symbols
	for (const { link } of scssDocument.getLinks({ forwards: false })) {
		const scssDocument = storage.get(link.target as string);
		if (!scssDocument) {
			continue;
		}

		const [symbol, sourceDocument] = traverseTree(
			scssDocument,
			identifier,
			storage,
		);
		if (symbol) {
			return [symbol, sourceDocument];
		}
	}

	// Fall back to the old way of doing things if we can't find the symbol via `@use`
	for (const scssDocument of storage.values()) {
		let symbols: IterableIterator<ScssSymbol>;

		if (identifier.kind === SymbolKind.Variable) {
			symbols = scssDocument.variables.values();
		} else if (identifier.kind === SymbolKind.Class) {
			symbols = scssDocument.placeholders.values();
		} else if (identifier.kind === SymbolKind.Function) {
			symbols = scssDocument.functions.values();
		} else {
			symbols = scssDocument.mixins.values();
		}

		for (const symbol of symbols) {
			if (
				symbol.name === identifier.name &&
				!samePosition(symbol.position, identifier.position)
			) {
				return [symbol, scssDocument];
			}
		}
	}

	return [null, null];
}

function traverseTree(
	document: IScssDocument,
	identifier: Identifier,
	storage: StorageService,
	accumulatedPrefix = "",
): [null, null] | [ScssSymbol, IScssDocument] {
	const scssDocument = storage.get(document.uri);
	if (!scssDocument) {
		return [null, null];
	}

	for (const symbol of scssDocument.getSymbols()) {
		if (symbol.kind === SymbolKind.Class) {
			// Placeholders are not namespaced the same way other symbols are
			if (symbol.name === identifier.name && symbol.kind === identifier.kind) {
				return [symbol, scssDocument];
			}
			continue;
		}

		const symbolName = `${accumulatedPrefix}${asDollarlessVariable(
			symbol.name,
		)}`;
		const identifierName = asDollarlessVariable(identifier.name);
		if (symbolName === identifierName && symbol.kind === identifier.kind) {
			return [symbol, scssDocument];
		}
	}

	// Check to see if we have to go deeper
	// Don't follow uses, since we start with the document behind the first use, and symbols from further uses aren't available to us
	// Don't follow imports, since the whole point here is to use the new module system
	for (const child of scssDocument.getLinks({
		uses: false,
		imports: false,
	})) {
		if (!child.link.target || child.link.target === scssDocument.uri) {
			continue;
		}

		const childDocument = storage.get(child.link.target);
		if (!childDocument) {
			continue;
		}

		let prefix = accumulatedPrefix;
		if ((child as ScssForward).prefix) {
			prefix += (child as ScssForward).prefix;
		}

		const [symbol, document] = traverseTree(
			childDocument,
			identifier,
			storage,
			prefix,
		);
		if (symbol) {
			return [symbol, document];
		}
	}

	return [null, null];
}
