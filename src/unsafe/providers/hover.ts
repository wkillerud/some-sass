'use strict';

import { Hover, MarkupContent, MarkupKind, SymbolKind } from 'vscode-languageserver';
import type { TextDocument } from 'vscode-languageserver-textdocument';

import { NodeType } from '../types/nodes';
import type { IScssDocument, ScssSymbol, ScssVariable, ScssMixin, ScssFunction, ScssImport, ScssForward } from '../types/symbols';
import type StorageService from '../services/storage';

import { asDollarlessVariable, getLimitedString } from '../utils/string';
import { applySassDoc} from '../utils/sassdoc';

type Identifier = { kind: SymbolKind; name: string };


async function formatVariableMarkupContent(variable: ScssVariable, sourceDocument: IScssDocument): Promise<MarkupContent> {
	const value = getLimitedString(variable.value || '');

	const result = {
		kind: MarkupKind.Markdown,
		value: [
			'```scss',
			`${variable.name}: ${value};`,
			'```',
		].join('\n')
	};

	const sassdoc = applySassDoc(variable);
	if (sassdoc) {
		result.value += `\n____\n${sassdoc}`;
	}

	result.value += `\n____\nVariable declared in ${sourceDocument.fileName}`;

	return result;
}

async function formatMixinMarkupContent(mixin: ScssMixin, sourceDocument: IScssDocument): Promise<MarkupContent> {
	const args = mixin.parameters.map(item => `${item.name}: ${item.value}`).join(', ');

	const result = {
		kind: MarkupKind.Markdown,
		value: [
			'```scss',
			`@mixin ${mixin.name}(${args})`,
			'```',
		].join('\n')
	}

	const sassdoc = applySassDoc(mixin);
	if (sassdoc) {
		result.value += `\n____\n${sassdoc}`;
	}

	result.value += `\n____\nMixin declared in ${sourceDocument.fileName}`;

	return result;
}

async function formatFunctionMarkupContent(func: ScssFunction, sourceDocument: IScssDocument): Promise<MarkupContent> {
	const args = func.parameters.map(item => `${item.name}: ${item.value}`).join(', ');

	const result = {
		kind: MarkupKind.Markdown,
		value: [
			'```scss',
			`@function ${func.name}(${args})`,
			'```',
		].join('\n')
	};

	const sassdoc = applySassDoc(func);
	if (sassdoc) {
		result.value += `\n____\n${sassdoc}`;
	}

	result.value += `\n____\nFunction declared in ${sourceDocument.fileName}`;

	return result;
}

export async function doHover(document: TextDocument, offset: number, storage: StorageService): Promise<Hover | null> {
	const scssDocument = storage.get(document.uri);
	if (!scssDocument) {
		return null;
	}

	const hoverNode = scssDocument.getNodeAt(offset);
	if (!hoverNode || !hoverNode.type) {
		return null;
	}

	let identifier: Identifier | null = null;
	if (hoverNode.type === NodeType.VariableName) {
		const parent = hoverNode.getParent();

		if (parent.type !== NodeType.VariableDeclaration && parent.type !== NodeType.FunctionParameter) {
			identifier = {
				name: hoverNode.getName(),
				kind: SymbolKind.Variable,
			};
		}
	} else if (hoverNode.type === NodeType.Identifier) {
		let node;
		let type: SymbolKind | null = null;

		const parent = hoverNode.getParent();
		if (parent.type === NodeType.Function) {
			node = parent;
			type = SymbolKind.Function;
		} else if (parent.type === NodeType.MixinReference) {
			node = parent;
			type = SymbolKind.Method;
		}

		if (type === null) {
			return null;
		}

		if (node) {
			identifier = {
				name: node.getName(),
				kind: type
			};
		}
	} else if (hoverNode.type === NodeType.MixinReference) {
		identifier = {
			name: hoverNode.getName(),
			kind: SymbolKind.Method,
		};
	}

	if (!identifier) {
		return null;
	}

	const [symbol, sourceDocument] = doSymbolHunting(document, storage, identifier);

	// Content for Hover popup
	let contents: MarkupContent | undefined;
	if (symbol && sourceDocument) {
		if (identifier.kind === SymbolKind.Variable) {
			contents = await formatVariableMarkupContent(symbol as ScssVariable, sourceDocument);
		} else if (identifier.kind === SymbolKind.Method) {
			contents = await formatMixinMarkupContent(symbol as ScssMixin, sourceDocument);
		} else if (identifier.kind === SymbolKind.Function) {
			contents = await formatFunctionMarkupContent(symbol as ScssFunction, sourceDocument);
		}
	}

	if (contents === undefined) {
		return null;
	}

	return {
		contents
	};
}

function doSymbolHunting(document: TextDocument, storage: StorageService, identifier: Identifier): ([ScssSymbol, IScssDocument] | [null, null]) {
	const scssDocument = storage.get(document.uri);
	if (!scssDocument) {
		return [null, null];
	}

	// Don't follow forwards from the current document, since the current doc doesn't have access to its symbols
	for (const { link } of scssDocument.getLinks({ forwards: false })) {
		const scssDocument = storage.get(link.target as string);
		if (!scssDocument) {
			continue;
		}

		const [symbol, sourceDocument] = traverseTree(scssDocument, identifier, storage);
		if (symbol) {
			return [symbol, sourceDocument];
		}
	}

	// Fall back to the old way of doing things if we can't find the symbol via `@use`
	for (const document of storage.values()) {
		if (identifier.kind === SymbolKind.Variable) {
			const variable = document.variables.get(identifier.name);
			if (variable) {
				return [variable, document];
			}
		} else if (identifier.kind === SymbolKind.Method) {
			const mixin = document.mixins.get(identifier.name);
			if (mixin) {
				return [mixin, document];
			}
		} else if (identifier.kind === SymbolKind.Function) {
			const func = document.functions.get(identifier.name);
			if (func) {
				return [func, document];
			}
		}
	}

	return [null, null]
}

function traverseTree(document: IScssDocument, identifier: Identifier, storage: StorageService, accumulatedPrefix = ""): ([ScssSymbol, IScssDocument] | [null, null]) {
	const scssDocument = storage.get(document.uri);
	if (!scssDocument) {
		return [null, null];
	}

	for (const symbol of scssDocument.getSymbols()) {
		const symbolName = `${accumulatedPrefix}${asDollarlessVariable(symbol.name)}`;
		const identifierName = asDollarlessVariable(identifier.name);
		if (symbolName === identifierName && symbol.kind === identifier.kind) {
			return [symbol, scssDocument];
		}
	}

	// Check to see if we have to go deeper
	for (const child of scssDocument.getLinks()) {
		if (!child.link.target || (child as ScssImport).dynamic || (child as ScssImport).css) {
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

		const [symbol, document] =  traverseTree(childDocument, identifier, storage, prefix);
		if (symbol) {
			return [symbol, document];
		}
	}

	return [null, null];
}
