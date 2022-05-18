'use strict';

import { Location, SymbolKind } from 'vscode-languageserver';
import type { TextDocument, Position } from 'vscode-languageserver-textdocument';

import { NodeType } from '../types/nodes';
import type StorageService from '../services/storage';

import type { IScssDocument, ScssSymbol } from '../types/symbols';

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

export async function goDefinition(document: TextDocument, offset: number, storage: StorageService): Promise<Location | null> {
	const currentScssDocument = storage.get(document.uri);
	if (!currentScssDocument) {
		return null;
	}

	const hoverNode = currentScssDocument.getNodeAt(offset);
	if (!hoverNode || !hoverNode.type) {
		return null;
	}

	let identifier: Identifier | null = null;
	if (hoverNode.type === NodeType.VariableName) {
		const parent = hoverNode.getParent();
		if (parent.type !== NodeType.FunctionParameter && parent.type !== NodeType.VariableDeclaration) {
			identifier = {
				name: hoverNode.getName(),
				position: document.positionAt(hoverNode.offset),
				kind: SymbolKind.Variable,
			};
		}
	} else if (hoverNode.type === NodeType.Identifier) {
		let i = 0;
		let node = hoverNode;
		while (node.type !== NodeType.MixinReference && node.type !== NodeType.Function && i !== 2) {
			node = node.getParent();
			i++;
		}

		if (node && (node.type === NodeType.MixinReference || node.type === NodeType.Function)) {
			let kind: SymbolKind = SymbolKind.Method;
			if (node.type === NodeType.Function) {
				kind = SymbolKind.Function;
			}

			identifier = {
				name: node.getName(),
				position: document.positionAt(node.offset),
				kind
			};
		}
	}

	if (!identifier) {
		return null;
	}

	let definition: ScssSymbol | null = null;
	let sourceDocument: IScssDocument | null = null;
	for (const scssDocument of storage.values()) {
		let symbols: IterableIterator<ScssSymbol>;

		if (identifier.kind === SymbolKind.Variable) {
			symbols = scssDocument.variables.values();
		} else if (identifier.kind === SymbolKind.Function) {
			symbols = scssDocument.functions.values();
		} else {
			symbols = scssDocument.mixins.values();
		}

		for (const symbol of symbols) {
			if (symbol.name === identifier.name && !samePosition(symbol.position, identifier.position)) {
				definition = symbol;
				sourceDocument = scssDocument;
			}
		}
	}

	if (!definition || !sourceDocument) {
		return null;
	}

	const symbol = Location.create(sourceDocument.uri, {
		start: definition.position,
		end: {
			line: definition.position.line,
			character: definition.position.character + definition.name.length
		}
	});

	return symbol;
}
