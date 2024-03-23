import {
	NodeType,
	MarkupKind,
	SymbolKind,
	Hover,
	MarkupContent,
	TextDocument,
} from "@somesass/language-services";
import { useContext } from "../../context-provider";
import {
	IScssDocument,
	ScssSymbol,
	ScssVariable,
	ScssMixin,
	ScssFunction,
	ScssForward,
	tokenizer,
	Token,
	ScssPlaceholder,
} from "../../parser";
import { applySassDoc } from "../../utils/sassdoc";
import { getBaseValueFrom, isReferencingVariable } from "../../utils/scss";
import { asDollarlessVariable } from "../../utils/string";
import {
	makeFunctionDocumentation,
	makeMixinDocumentation,
} from "../completion/completion-utils";
import { sassBuiltInModules } from "../sass-built-in-modules";
import { sassDocAnnotations } from "../sassdoc-annotations";

interface Identifier {
	kind: SymbolKind;
	name: string;
}

function formatVariableMarkupContent(
	variable: ScssVariable,
	sourceDocument: IScssDocument,
): MarkupContent {
	let value = variable.value;
	if (isReferencingVariable(variable)) {
		value = getBaseValueFrom(variable, sourceDocument).value;
	}

	value = value || "";

	const result = {
		kind: MarkupKind.Markdown,
		value: [
			"```scss",
			`${variable.name}: ${value};${
				value !== variable.value ? ` // via ${variable.value}` : ""
			}`,
			"```",
		].join("\n"),
	};

	const sassdoc = applySassDoc(variable);
	if (sassdoc) {
		result.value += `\n____\n${sassdoc}`;
	}

	result.value += `\n____\nVariable declared in ${sourceDocument.fileName}`;

	return result;
}

function formatPlaceholderMarkupContent(
	placeholder: ScssPlaceholder,
	sourceDocument: IScssDocument,
): MarkupContent {
	const result = {
		kind: MarkupKind.Markdown,
		value: ["```scss", placeholder.name, "```"].join("\n"),
	};

	const sassdoc = applySassDoc(placeholder);
	if (sassdoc) {
		result.value += `\n____\n${sassdoc}`;
	}

	result.value += `\n____\nPlaceholder declared in ${sourceDocument.fileName}`;

	return result;
}

export function doHover(document: TextDocument, offset: number): Hover | null {
	const { storage } = useContext();
	const scssDocument = storage.get(document.uri);
	if (!scssDocument) {
		return null;
	}

	const hoverNode = scssDocument.getNodeAt(offset);
	if (!hoverNode || !hoverNode.type) {
		return null;
	}

	let identifier: Identifier | null = null;
	switch (hoverNode.type) {
		case NodeType.VariableName: {
			const parent = hoverNode.getParent();

			if (
				parent.type !== NodeType.VariableDeclaration &&
				parent.type !== NodeType.FunctionParameter
			) {
				identifier = {
					name: hoverNode.getName(),
					kind: SymbolKind.Variable,
				};
			}

			break;
		}

		case NodeType.Identifier: {
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
					kind: type,
				};
			}

			break;
		}

		case NodeType.MixinReference: {
			identifier = {
				name: hoverNode.getName(),
				kind: SymbolKind.Method,
			};

			break;
		}

		case NodeType.SelectorPlaceholder: {
			identifier = {
				name: hoverNode.getText(),
				kind: SymbolKind.Class,
			};
			break;
		}

		case NodeType.Stylesheet: {
			// Hover information for SassDoc.
			// SassDoc is considered a comment, which doesn't have its own NodeType.
			// Tokenize the document and look for the closest non-space token to offset.
			// If it's a comment, look for SassDoc annotations under the cursor.

			const tokens = tokenizer(document.getText());

			let hoverToken: Token | null = null;
			for (const token of tokens) {
				const [type, text, tokenOffset] = token;
				if (typeof tokenOffset !== "number") {
					continue;
				}

				if (tokenOffset > offset) {
					break;
				}

				hoverToken = [type, text, tokenOffset];
			}

			if (hoverToken && hoverToken[0] === "comment") {
				const commentText = hoverToken[1];
				const candidate = sassDocAnnotations.find(({ annotation, aliases }) => {
					return (
						commentText.includes(annotation) ||
						aliases?.some((alias) => commentText.includes(alias))
					);
				});

				if (candidate) {
					const annotationPosition = commentText.indexOf(candidate.annotation);
					const annotationOffset = (hoverToken[2] || 0) + annotationPosition;
					if (offset < annotationOffset) {
						// If offset is under the result of the above, we're hovering right before the annotation.
						return null;
					}

					const annotationEnd =
						annotationOffset + candidate.annotation.length - 1;
					if (annotationEnd < offset) {
						// If offset is over the result of the above, we're hovering past the token.
						return null;
					}

					return {
						contents: {
							kind: MarkupKind.Markdown,
							value: [
								candidate.annotation,
								"____",
								`[SassDoc reference](http://sassdoc.com/annotations/#${candidate.annotation.slice(
									1,
								)})`,
							].join("\n"),
						},
					};
				}
			}

			break;
		}
		// No default
	}

	if (!identifier) {
		return null;
	}

	const [symbol, sourceDocument] = doSymbolHunting(document, identifier);

	// Content for Hover popup
	let contents: MarkupContent | undefined;
	if (symbol && sourceDocument) {
		switch (identifier.kind) {
			case SymbolKind.Variable: {
				contents = formatVariableMarkupContent(
					symbol as ScssVariable,
					sourceDocument,
				);
				break;
			}

			case SymbolKind.Method: {
				contents = makeMixinDocumentation(symbol as ScssMixin, sourceDocument);
				break;
			}

			case SymbolKind.Function: {
				contents = makeFunctionDocumentation(
					symbol as ScssFunction,
					sourceDocument,
				);
				break;
			}

			case SymbolKind.Class: {
				contents = formatPlaceholderMarkupContent(
					symbol as ScssPlaceholder,
					sourceDocument,
				);
				break;
			}
			// No default
		}
	}

	if (contents === undefined) {
		// Look to see if this is a built-in, but only if we have no other content.
		// Folks may use the same names as built-ins in their modules.

		for (const { reference, exports } of Object.values(sassBuiltInModules)) {
			for (const [name, { description }] of Object.entries(exports)) {
				if (name === identifier.name) {
					// Make sure we're not just hovering over a CSS function.
					// Confirm we are looking at something that is the child of a module.
					const isModule =
						hoverNode.getParent().type === NodeType.Module ||
						hoverNode.getParent().getParent().type === NodeType.Module;
					if (isModule) {
						return {
							contents: {
								kind: MarkupKind.Markdown,
								value: [
									description,
									"",
									`[Sass reference](${reference}#${name})`,
								].join("\n"),
							},
						};
					}
				}
			}
		}

		return null;
	}

	return {
		contents,
	};
}

function doSymbolHunting(
	document: TextDocument,
	identifier: Identifier,
): [null, null] | [ScssSymbol, IScssDocument] {
	const { storage } = useContext();
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

		const [symbol, sourceDocument] = traverseTree(scssDocument, identifier);
		if (symbol) {
			return [symbol, sourceDocument];
		}
	}

	// Fall back to the old way of doing things if we can't find the symbol via `@use`
	for (const document of storage.values()) {
		switch (identifier.kind) {
			case SymbolKind.Variable: {
				const variable = document.variables.get(identifier.name);
				if (variable) {
					return [variable, document];
				}

				break;
			}

			case SymbolKind.Method: {
				const mixin = document.mixins.get(identifier.name);
				if (mixin) {
					return [mixin, document];
				}

				break;
			}

			case SymbolKind.Function: {
				const func = document.functions.get(identifier.name);
				if (func) {
					return [func, document];
				}

				break;
			}

			case SymbolKind.Class: {
				const placeholder = document.placeholders.get(identifier.name);
				if (placeholder) {
					return [placeholder, document];
				}
			}

			// No default
		}
	}

	return [null, null];
}

function traverseTree(
	document: IScssDocument,
	identifier: Identifier,
	accumulatedPrefix = "",
): [null, null] | [ScssSymbol, IScssDocument] {
	const { storage } = useContext();
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

		const [symbol, document] = traverseTree(childDocument, identifier, prefix);
		if (symbol) {
			return [symbol, document];
		}
	}

	return [null, null];
}
