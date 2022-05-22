'use strict';

import { Hover, MarkupContent, MarkupKind, SymbolKind } from 'vscode-languageserver';
import type { TextDocument } from 'vscode-languageserver-textdocument';

import { NodeType } from '../types/nodes';
import type { IScssDocument, ScssSymbol, ScssVariable, ScssMixin, ScssFunction } from '../types/symbols';
import type StorageService from '../services/storage';

import { getLimitedString } from '../utils/string';
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

	let symbol: ScssSymbol | null = null;
	let sourceDocument: IScssDocument | null = null;
	for (const document of storage.values()) {
		if (identifier.kind === SymbolKind.Variable) {
			const variable = document.variables.get(identifier.name);
			if (variable) {
				symbol = variable;
				sourceDocument = document;
				break;
			}
		} else if (identifier.kind === SymbolKind.Method) {
			const mixin = document.mixins.get(identifier.name);
			if (mixin) {
				symbol = mixin;
				sourceDocument = document;
				break;
			}
		} else if (identifier.kind === SymbolKind.Function) {
			const func = document.functions.get(identifier.name);
			if (func) {
				symbol = func;
				sourceDocument = document;
				break;
			}
		}
	}

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
