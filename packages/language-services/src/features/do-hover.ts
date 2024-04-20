import { getNodeAtOffset } from "@somesass/vscode-css-languageservice";
import { sassBuiltInModules } from "../facts/sass";
import { sassDocAnnotations } from "../facts/sassdoc";
import { LanguageFeature } from "../language-feature";
import {
	IToken,
	MarkupKind,
	Range,
	TokenType,
	TextDocument,
	Position,
	Hover,
	NodeType,
	Variable,
	SymbolKind,
	MixinReference,
	Function,
	SassDocumentSymbol,
} from "../language-services-types";
import { asDollarlessVariable } from "../utils/sass";
import { applySassDoc } from "../utils/sassdoc";

export class DoHover extends LanguageFeature {
	async doHover(
		document: TextDocument,
		position: Position,
	): Promise<Hover | null> {
		const stylesheet = this.ls.parseStylesheet(document);
		const offset = document.offsetAt(position);

		let nodeType: NodeType;
		const hoverNode = getNodeAtOffset(stylesheet, offset);
		if (hoverNode) {
			nodeType = hoverNode.type;
		} else {
			// If the document begins with a SassDoc comment the Stylesheet node does not begin at offset 0,
			// instead starting where the SassDoc block ends. To ensure we get down to the switch below to
			// look for Sassdoc annotations, set nodeType to Stylesheet here.
			nodeType = NodeType.Stylesheet;
		}

		let kind: SymbolKind | undefined;
		let name: string | undefined;
		let range: Range | undefined = undefined;
		switch (nodeType) {
			case NodeType.VariableName: {
				const parent = hoverNode?.getParent();
				if (
					parent &&
					parent.type !== NodeType.VariableDeclaration &&
					parent.type !== NodeType.FunctionParameter
				) {
					name = (hoverNode as Variable).getName();
					kind = SymbolKind.Variable;
				}
				break;
			}
			case NodeType.Identifier: {
				let node;
				let type: SymbolKind | null = null;
				const parent = hoverNode?.getParent();
				if (parent && parent.type === NodeType.Function) {
					node = parent;
					type = SymbolKind.Function;
				} else if (parent && parent.type === NodeType.MixinReference) {
					node = parent;
					type = SymbolKind.Method;
				}
				if (type === null) {
					return null;
				}
				if (node) {
					name = (node as Function | MixinReference).getName();
					kind = type;
				}
				break;
			}

			case NodeType.MixinReference: {
				name = (hoverNode as MixinReference)?.getName();
				kind = SymbolKind.Method;
				break;
			}

			case NodeType.Stylesheet: {
				// Hover information for SassDoc.
				// SassDoc is considered a comment, which are skipped by the regular parser (so we hit the Stylesheet node).
				// Use the base scanner to retokenize the document including comments,
				// and look a comment token at the hover position.
				const scanner = this.getScanner(document);
				let token: IToken = scanner.scan();
				while (token.type !== TokenType.EOF) {
					if (token.offset + token.len < offset) {
						token = scanner.scan();
						continue;
					}

					if (token.type === TokenType.Comment) {
						const commentText = token.text;
						const candidate = sassDocAnnotations.find(
							({ annotation, aliases }) => {
								return (
									commentText.includes(annotation) ||
									aliases?.some((alias) => commentText.includes(alias))
								);
							},
						);
						if (!candidate) {
							// No Sassdoc annotations in the comment
							break;
						}

						const annotationStart =
							token.offset + commentText.indexOf(candidate.annotation) - 1;
						const annotationEnd =
							annotationStart + candidate.annotation.length + 1;

						const hoveringAboveAnnotation =
							annotationEnd > offset && offset > annotationStart;

						if (!hoveringAboveAnnotation) {
							break;
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
					token = scanner.scan();
				}
				break;
			}

			case NodeType.SelectorPlaceholder: {
				name = hoverNode?.getText();
				kind = SymbolKind.Class;
				break;
			}
		}

		if (hoverNode && name && kind) {
			range = Range.create(
				document.positionAt(hoverNode.offset),
				document.positionAt(hoverNode.offset + name.length),
			);

			// Traverse the workspace looking for a symbol of kinds.includes(symbol.kind) && name === symbol.name
			const result = await this.findInWorkspace<
				[TextDocument, SassDocumentSymbol]
			>(
				(document, prefix) => {
					const symbols = this.ls.findDocumentSymbols(document);
					for (const symbol of symbols) {
						if (symbol.kind === kind) {
							const prefixedSymbol = `${prefix}${asDollarlessVariable(symbol.name)}`;
							const prefixedName = asDollarlessVariable(name!);
							if (prefixedSymbol === prefixedName) {
								return [[document, symbol]];
							}
						}
					}
				},
				document,
				{ lazy: true },
			);

			let symbolDocument: TextDocument | null = null;
			let symbol: SassDocumentSymbol | null = null;
			if (result.length !== 0) {
				[symbolDocument, symbol] = result[0];
			} else {
				// Fall back to looking through all the things, assuming folks use @import
				const documents = this.cache.documents();
				for (const document of documents) {
					const symbols = this.ls.findDocumentSymbols(document);
					for (const sym of symbols) {
						if (sym.kind === kind && sym.name === name) {
							symbolDocument = document;
							symbol = sym;
							break;
						}
					}
				}
			}

			if (symbol && symbolDocument) {
				switch (symbol.kind) {
					case SymbolKind.Variable: {
						const hover = await this.getVariableHoverContent(
							symbolDocument,
							symbol,
							name,
						);
						hover.range = range;
						return hover;
					}
					case SymbolKind.Method: {
						const hover = this.getMixinHoverContent(
							symbolDocument,
							symbol,
							name,
						);
						hover.range = range;
						return hover;
					}
					case SymbolKind.Function: {
						const hover = this.getFunctionHoverContent(
							symbolDocument,
							symbol,
							name,
						);
						hover.range = range;
						return hover;
					}
					case SymbolKind.Class: {
						const hover = this.getPlaceholderHoverContent(
							symbolDocument,
							symbol,
						);
						hover.range = range;
						return hover;
					}
				}
			}
		}

		if (hoverNode) {
			// Look to see if this is a built-in, but only if we have no other content.
			// Folks may use the same names as built-ins in their modules.
			for (const { reference, exports } of Object.values(sassBuiltInModules)) {
				for (const [builtinName, { description }] of Object.entries(exports)) {
					if (builtinName === name) {
						// Make sure we're not just hovering over a CSS function.
						// Confirm we are looking at something that is the child of a module.
						const isModule =
							hoverNode.getParent()?.type === NodeType.Module ||
							hoverNode.getParent()?.getParent()?.type === NodeType.Module;
						if (isModule) {
							return {
								contents: {
									kind: MarkupKind.Markdown,
									value: [
										description,
										"",
										`[Sass reference](${reference}#${builtinName})`,
									].join("\n"),
								},
							};
						}
					}
				}
			}
		}

		// Lastly, fall back to CSS hover information
		return this.getUpstreamLanguageServer().doHover(
			document,
			position,
			stylesheet,
		);
	}

	getFunctionHoverContent(
		document: TextDocument,
		symbol: SassDocumentSymbol,
		maybePrefixedName: string,
	): Hover {
		const result = {
			kind: MarkupKind.Markdown,
			value: [
				"```scss",
				`@function ${maybePrefixedName}${symbol.detail || "()"}`,
				"```",
			].join("\n"),
		};

		const sassdoc = applySassDoc(symbol);
		if (sassdoc) {
			result.value += `\n____\n${sassdoc}`;
		}

		const prefixInfo =
			maybePrefixedName !== symbol.name ? ` as ${symbol.name}` : "";
		result.value += `\n____\nFunction declared${prefixInfo} in ${this.getFileName(document.uri)}`;

		return {
			contents: result,
		};
	}

	getMixinHoverContent(
		document: TextDocument,
		symbol: SassDocumentSymbol,
		maybePrefixedName: string,
	): Hover {
		const result = {
			kind: MarkupKind.Markdown,
			value: [
				"```scss",
				`@mixin ${maybePrefixedName}${symbol.detail || "()"}`,
				"```",
			].join("\n"),
		};

		const sassdoc = applySassDoc(symbol);
		if (sassdoc) {
			result.value += `\n____\n${sassdoc}`;
		}

		const prefixInfo =
			maybePrefixedName !== symbol.name ? ` as ${symbol.name}` : "";
		result.value += `\n____\nMixin declared${prefixInfo} in ${this.getFileName(document.uri)}`;

		return {
			contents: result,
		};
	}

	getPlaceholderHoverContent(
		document: TextDocument,
		symbol: SassDocumentSymbol,
	): Hover {
		const result = {
			kind: MarkupKind.Markdown,
			value: ["```scss", symbol.name, "```"].join("\n"),
		};

		const sassdoc = applySassDoc(symbol);
		if (sassdoc) {
			result.value += `\n____\n${sassdoc}`;
		}

		result.value += `\n____\nPlaceholder declared in ${this.getFileName(document.uri)}`;

		return {
			contents: result,
		};
	}

	private async getVariableHoverContent(
		document: TextDocument,
		symbol: SassDocumentSymbol,
		maybePrefixedName: string,
	): Promise<Hover> {
		const rawValue = this.getVariableValue(document, symbol) || "";
		let value = await this.findValue(document, symbol.selectionRange.start);
		value = value || rawValue;

		const result = {
			kind: MarkupKind.Markdown,
			value: [
				"```scss",
				`${maybePrefixedName}: ${value};${
					value !== rawValue ? ` // via ${rawValue}` : ""
				}`,
				"```",
			].join("\n"),
		};

		const sassdoc = applySassDoc(symbol);
		if (sassdoc) {
			result.value += `\n____\n${sassdoc}`;
		}

		const prefixInfo =
			maybePrefixedName !== symbol.name ? ` as ${symbol.name}` : "";
		result.value += `\n____\nVariable declared${prefixInfo} in ${this.getFileName(document.uri)}`;

		return {
			contents: result,
		};
	}
}
