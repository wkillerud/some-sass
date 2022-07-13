'use strict';

import { tokenizer } from 'scss-symbols-parser';
import { Location, Position, Range, ReferenceContext, SymbolKind } from 'vscode-languageserver-types';
import type { TextDocument } from 'vscode-languageserver-textdocument';

import type StorageService from '../../services/storage';
import { getDefinitionSymbol } from '../goDefinition';
import type { IScssDocument, ScssSymbol } from '../../types/symbols';
import type { Token } from '../../types/tokens';
import { asDollarlessVariable, stripTrailingComma, stripParentheses } from '../../utils/string';
import { INode, NodeType } from '../../types/nodes';

export async function provideReferences(document: TextDocument, offset: number, storage: StorageService, context: ReferenceContext): Promise<Location[] | null> {
	const scssDocument = storage.get(document.uri);
	if (!scssDocument) {
		return null;
	}

	const referenceNode = scssDocument.getNodeAt(offset);
	if (!referenceNode || !referenceNode.type) {
		return null;
	}

	const referenceIdentifier = getIdentifier(document, referenceNode, context);
	if (!referenceIdentifier) {
		return null;
	}

	let definitionSymbol: ScssSymbol | null = null;
	let definitionDocument: IScssDocument | null = null;

	// Check to see if the current document is the one declaring the symbol before we go looking through the project
	for (const symbol of scssDocument.getSymbols()) {
		const symbolName = asDollarlessVariable(symbol.name);
		const identifierName = asDollarlessVariable(referenceIdentifier.name);
		if (symbolName === identifierName && symbol.kind === referenceIdentifier.kind) {
			definitionSymbol = symbol;
			definitionDocument = scssDocument;
		}
	}

	if (!definitionSymbol || !definitionDocument) {
		[definitionSymbol, definitionDocument] = getDefinitionSymbol(document, storage, referenceIdentifier);
	}

	if (!definitionSymbol || !definitionDocument) {
		return null;
	}

	const references: Location[] = [];

	for (const scssDocument of storage.values()) {
		const text = scssDocument.getText();
		const tokens: Token[] = tokenizer(text);

		for (const [tokenType, text, offset] of tokens) {
			if (tokenType !== 'word' && tokenType !== 'brackets') {
				continue;
			}

			// Tokens from maps include their trailing comma.
			// Tokens of function parameters include the function parentheses.
			// Strip them before comparing.
			const trailingCommalessText = stripTrailingComma(text);
			const parentheseslessText = stripParentheses(text);
			const dollarlessDefinition = stripTrailingComma(asDollarlessVariable(definitionSymbol.name));

			const isWordMatch = tokenType === 'word' && trailingCommalessText.endsWith(dollarlessDefinition);
			const isParameterMatch = tokenType === 'brackets' && text.includes(dollarlessDefinition);
			if (isWordMatch || isParameterMatch) {
				// For type 'word' offset should always be defined, but default to 0 just in case
				let adjustedOffset = offset || 0;
				let adjustedText = isParameterMatch ? parentheseslessText : trailingCommalessText;

				// The tokenizer treats the namespace and variable name as a single word.
				// We need the offset for the actual variable, so find its position in the word.
				if (trailingCommalessText !== referenceIdentifier.name) {
					adjustedText = adjustedText.split('.')[1] || adjustedText;
					adjustedOffset = adjustedOffset + text.indexOf(adjustedText);
				}

				// Make sure we use the correct one.
				// We do this in case the same identifier name is used in more than one namespace.
				// foo.$var is not the same as bar.$var.
				const definition = getDefinition(scssDocument, adjustedOffset, storage, context);
				if (!definition) {
					continue;
				}

				// If the files and position matches between the definition of the current token
				// and the definition we found to begin with, we have a reference to report.
				const isSameFile = await isSameRealPath(definition.uri, definitionDocument, storage);
				if (isSameFile && isSamePosition(definitionSymbol.position, definition.range.start)) {
					const start = scssDocument.positionAt(adjustedOffset);
					const end = scssDocument.positionAt(adjustedOffset + adjustedText.length);
					const range = Range.create(start, end);
					const location = Location.create(scssDocument.uri, range);
					references.push(location);
				}
			}
		}
	}

	return references;
}


interface Identifier {
	kind: SymbolKind;
	position: Position;
	name: string;
}

function getIdentifier(document: TextDocument, hoverNode: INode, context: ReferenceContext): Identifier | null {
	let identifier: Identifier | null = null;

	if (hoverNode.type === NodeType.VariableName) {
		if (!context.includeDeclaration) {
			const parent = hoverNode.getParent();
			if (parent.type === NodeType.VariableDeclaration) {
				return null;
			}
		}

		identifier = {
			name: hoverNode.getName(),
			position: document.positionAt(hoverNode.offset),
			kind: SymbolKind.Variable,
		};
	} else if (hoverNode.type === NodeType.Identifier) {
		let i = 0;
		let node = hoverNode;
		let isMixin = false;
		let isFunction = false;

		while (!isMixin && !isFunction && i !== 2) {
			node = node.getParent();

			isMixin = node.type === NodeType.MixinReference;
			isFunction = node.type === NodeType.Function;

			if (context.includeDeclaration) {
				isMixin = isMixin || node.type === NodeType.MixinDeclaration;
				isFunction = isFunction || node.type === NodeType.FunctionDeclaration;
			}

			i++;
		}

		if (node && (isMixin || isFunction)) {
			let kind: SymbolKind = SymbolKind.Method;

			if (isFunction) {
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

	return identifier;
}

function getDefinition(scssDocument: IScssDocument, offset: number, storage: StorageService, context: ReferenceContext): Location | null {
	const definitionNode = scssDocument.getNodeAt(offset);
	if (!definitionNode || !definitionNode.type) {
		return null;
	}
	const definitionIdentifier = getIdentifier(scssDocument, definitionNode, context);
	if (!definitionIdentifier) {
		return null;
	}
	const [definitionSymbol, definitionDocument] = getDefinitionSymbol(scssDocument, storage, definitionIdentifier);
	if (!definitionSymbol || !definitionDocument) {
		return null;
	}

	const definitionSymbolLocation = Location.create(definitionDocument.uri, {
		start: definitionSymbol.position,
		end: {
			line: definitionSymbol.position.line,
			character: definitionSymbol.position.character + definitionSymbol.name.length
		}
	});

	return definitionSymbolLocation;
}

/**
 * In certain workpaces, like monorepos, you may have a local file symlinked
 * and referenced via node_modules. In those cases we want to compare the
 * original non-symlinked files on disk. If the filename is the same, try
 * to look up the _real_ path and compare that.
 *
 * @param link
 * @param referenced
 * @returns
 */
async function isSameRealPath(link: string, referenced: IScssDocument, storage: StorageService): Promise<boolean> {
	if (!link) {
		return false;
	}

	// Checking the file system is expensive, so do the optimistic thing first.
	// If the URIs match, we're good.
	if (link === referenced.uri) {
		return true;
	} else if (link.includes(referenced.fileName)) {
		try {
			const linkedDocument = storage.get(link);
			if (!linkedDocument) {
				return false;
			}
			const realLinkFsPath = await linkedDocument.getRealPath();
			if (!realLinkFsPath) {
				return false;
			}
			const realReferencedPath = await referenced.getRealPath();
			if (!realReferencedPath) {
				return false;
			}

			if (realLinkFsPath === realReferencedPath) {
				return true;
			}
		} catch (e) {
			// Guess it really doesn't exist
		}
	}

	return false;
}

function isSamePosition(a: Position, b: Position): boolean {
	return a.character === b.character && a.line === b.line;
}
