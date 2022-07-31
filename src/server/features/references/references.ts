import { tokenizer } from "scss-symbols-parser";
import type { TextDocument } from "vscode-languageserver-textdocument";
import type { Position, ReferenceContext } from "vscode-languageserver-types";
import { Location, Range, SymbolKind } from "vscode-languageserver-types";
import { NodeType } from "../../nodes";
import type { INode } from "../../nodes";
import { sassBuiltInModules } from "../../sass-built-in-modules";
import type StorageService from "../../storage";
import type { IScssDocument, ScssSymbol } from "../../symbols";
import type { Token } from "../../tokens";
import {
	asDollarlessVariable,
	stripTrailingComma,
	stripParentheses,
} from "../../utils/string";
import { getDefinitionSymbol } from "../go-definition";

export async function provideReferences(
	document: TextDocument,
	offset: number,
	storage: StorageService,
	context: ReferenceContext,
): Promise<Location[] | null> {
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
		if (
			symbolName === identifierName &&
			symbol.kind === referenceIdentifier.kind
		) {
			definitionSymbol = symbol;
			definitionDocument = scssDocument;
		}
	}

	if (!definitionSymbol || !definitionDocument) {
		[definitionSymbol, definitionDocument] = getDefinitionSymbol(
			document,
			storage,
			referenceIdentifier,
		);
	}

	let builtin: [string, string] | null = null;
	if (!definitionSymbol || !definitionDocument) {
		// If we don't have a definition anywhere we might be dealing with a built-in.
		// Check to see if that's the case.

		for (const [module, { exports }] of Object.entries(sassBuiltInModules)) {
			for (const [name] of Object.entries(exports)) {
				if (name === referenceIdentifier.name) {
					builtin = [module.split(":")[1] as string, name];
				}
			}
		}

		if (!builtin) {
			return null;
		}
	}

	if (!builtin && !definitionDocument && !definitionSymbol) {
		return null;
	}

	const references: Location[] = [];
	for (const scssDocument of storage.values()) {
		const text = scssDocument.getText();
		const tokens: Token[] = tokenizer(text);

		for (const [tokenType, text, offset] of tokens) {
			if (tokenType !== "word" && tokenType !== "brackets") {
				continue;
			}

			// Tokens from maps include their trailing comma.
			// Tokens of function parameters include the function parentheses.
			// Strip them before comparing.
			const trailingCommalessText = stripTrailingComma(text);
			const parentheseslessText = stripParentheses(text);
			const dollarlessDefinition = stripTrailingComma(
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				asDollarlessVariable(builtin ? builtin[1] : definitionSymbol!.name),
			);

			const isWordMatch =
				tokenType === "word" &&
				trailingCommalessText.endsWith(dollarlessDefinition);
			const isParameterMatch =
				tokenType === "brackets" && text.includes(dollarlessDefinition);
			if (isWordMatch || isParameterMatch) {
				// For type 'word' offset should always be defined, but default to 0 just in case
				let adjustedOffset = offset || 0;
				let adjustedText = isParameterMatch
					? parentheseslessText
					: trailingCommalessText;

				// The tokenizer treats the namespace and variable name as a single word.
				// We need the offset for the actual variable, so find its position in the word.
				if (trailingCommalessText !== referenceIdentifier.name) {
					adjustedText = adjustedText.split(".")[1] || adjustedText;
					adjustedOffset += text.indexOf(adjustedText);
				}

				// Make sure we use the correct one.
				// We do this in case the same identifier name is used in more than one namespace.
				// foo.$var is not the same as bar.$var.
				const definition = getDefinition(
					scssDocument,
					adjustedOffset,
					storage,
					context,
				);
				if (!definition || !definitionDocument || !definitionSymbol) {
					// If we don't have a definition anywhere we might be dealing with a built-in.
					// If that's the case, add the reference even without the definition.
					if (builtin) {
						const [module, exports] = builtin;
						// Only support modern modules with this feature as well.
						if (text === `${module}.${exports}`) {
							const reference = createReference(
								scssDocument,
								adjustedOffset,
								adjustedText,
							);
							references.push(reference);
						}
					}

					continue;
				}

				// If the files and position matches between the definition of the current token
				// and the definition we found to begin with, we have a reference to report.
				const isSameFile = await isSameRealPath(
					definition.uri,
					definitionDocument,
					storage,
				);
				if (
					isSameFile &&
					isSamePosition(definitionSymbol.position, definition.range.start)
				) {
					const reference = createReference(
						scssDocument,
						adjustedOffset,
						adjustedText,
					);
					references.push(reference);
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

function createReference(
	scssDocument: IScssDocument,
	adjustedOffset: number,
	adjustedText: string,
): Location {
	const start = scssDocument.positionAt(adjustedOffset);
	const end = scssDocument.positionAt(adjustedOffset + adjustedText.length);
	const range = Range.create(start, end);
	const location = Location.create(scssDocument.uri, range);
	return location;
}

function getIdentifier(
	document: TextDocument,
	hoverNode: INode,
	context: ReferenceContext,
): Identifier | null {
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
				kind,
			};
		}
	}

	if (!identifier) {
		return null;
	}

	return identifier;
}

function getDefinition(
	scssDocument: IScssDocument,
	offset: number,
	storage: StorageService,
	context: ReferenceContext,
): Location | null {
	const definitionNode = scssDocument.getNodeAt(offset);
	if (!definitionNode || !definitionNode.type) {
		return null;
	}

	const definitionIdentifier = getIdentifier(
		scssDocument,
		definitionNode,
		context,
	);
	if (!definitionIdentifier) {
		return null;
	}

	const [definitionSymbol, definitionDocument] = getDefinitionSymbol(
		scssDocument,
		storage,
		definitionIdentifier,
	);
	if (!definitionSymbol || !definitionDocument) {
		return null;
	}

	const definitionSymbolLocation = Location.create(definitionDocument.uri, {
		start: definitionSymbol.position,
		end: {
			line: definitionSymbol.position.line,
			character:
				definitionSymbol.position.character + definitionSymbol.name.length,
		},
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
async function isSameRealPath(
	link: string,
	referenced: IScssDocument,
	storage: StorageService,
): Promise<boolean> {
	if (!link) {
		return false;
	}

	// Checking the file system is expensive, so do the optimistic thing first.
	// If the URIs match, we're good.
	if (link === referenced.uri) {
		return true;
	}

	if (link.includes(referenced.fileName)) {
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
		} catch {
			// Guess it really doesn't exist
		}
	}

	return false;
}

function isSamePosition(a: Position, b: Position): boolean {
	return a.character === b.character && a.line === b.line;
}
