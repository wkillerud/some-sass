import {
	IToken,
	MarkupKind,
	SCSSScanner,
	TokenType,
	VariableDeclaration,
} from "@somesass/vscode-css-languageservice";
import { sassBuiltInModules } from "../facts/sass";
import { sassDocAnnotations } from "../facts/sassdoc";
import { LanguageFeature } from "../language-feature";
import {
	TextDocument,
	Position,
	Hover,
	getNodeAtOffset,
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
		const hoverNode = getNodeAtOffset(stylesheet, offset);
		if (!hoverNode) {
			return null;
		}

		let kind: SymbolKind | undefined;
		let name: string | undefined;
		switch (hoverNode.type) {
			case NodeType.VariableName: {
				const parent = hoverNode.getParent();
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
				const parent = hoverNode.getParent();
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
				name = (hoverNode as MixinReference).getName();
				kind = SymbolKind.Method;
				break;
			}

			case NodeType.Stylesheet: {
				// Hover information for SassDoc.
				// SassDoc is considered a comment, which are skipped by the regular parser (so we hit the Stylesheet node).
				// Use the base scanner to retokenize the document including comments,
				// and look a comment token at the hover position.
				const scanner = new SCSSScanner();
				scanner.ignoreComment = false;
				scanner.setSource(document.getText());
				let token: IToken = scanner.scan();
				while (token.type !== TokenType.EOF) {
					if (token.offset < offset) {
						continue;
					}

					if (token.type === TokenType.Comment) {
						const commentText = token.text;
						// TODO: test that we get a comment token per line, otherwise this needs to be a filter not a find
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
							token.offset + commentText.indexOf(candidate.annotation);
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
				name = hoverNode.getText();
				kind = SymbolKind.Class;
				break;
			}
		}

		if (name && kind) {
			// Traverse the workspace looking for a symbol of kinds.includes(symbol.kind) && name === symbol.name
			const result = await this.findInWorkspace<
				[TextDocument, SassDocumentSymbol]
			>((document, prefix) => {
				const symbols = this.ls.findDocumentSymbols(document);
				for (const symbol of symbols) {
					if (symbol.kind === kind) {
						const prefixedSymbol = `${prefix}${asDollarlessVariable(symbol.name)}`;
						const prefixedName = asDollarlessVariable(name!);
						if (prefixedSymbol === prefixedName) {
							return [document, symbol];
						}
					}
				}
			}, document);

			if (result.length !== 0) {
				const [document, symbol] = result[0];
				switch (symbol.kind) {
					case SymbolKind.Variable: {
						return await this.getVariableHoverContent(document, symbol);
					}
					case SymbolKind.Method: {
						return this.getMixinHoverContent(document, symbol);
					}
					case SymbolKind.Function: {
						return this.getFunctionHoverContent(document, symbol);
					}
					case SymbolKind.Class: {
						return this.getPlaceholderHoverContent(document, symbol);
					}
				}
			}
		}

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

		// Lastly, fall back to CSS hover information
		return this._internal.scssLs.doHover(document, position, stylesheet);
	}

	getFunctionHoverContent(
		document: TextDocument,
		symbol: SassDocumentSymbol,
	): Hover | PromiseLike<Hover | null> | null {
		const result = {
			kind: MarkupKind.Markdown,
			value: [
				"```scss",
				`@function ${symbol.name}${symbol.detail || "()"}`,
				"```",
			].join("\n"),
		};

		const sassdoc = applySassDoc(symbol);
		if (sassdoc) {
			result.value += `\n____\n${sassdoc}`;
		}

		result.value += `\n____\nFunction declared in ${this.getFileName(document)}`;

		return {
			range: symbol.selectionRange,
			contents: result,
		};
	}

	getMixinHoverContent(
		document: TextDocument,
		symbol: SassDocumentSymbol,
	): Hover {
		const result = {
			kind: MarkupKind.Markdown,
			value: [
				"```scss",
				`@mixin ${symbol.name}${symbol.detail || "()"}`,
				"```",
			].join("\n"),
		};

		const sassdoc = applySassDoc(symbol);
		if (sassdoc) {
			result.value += `\n____\n${sassdoc}`;
		}

		result.value += `\n____\nMixin declared in ${this.getFileName(document)}`;

		return {
			range: symbol.selectionRange,
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

		result.value += `\n____\nPlaceholder declared in ${this.getFileName(document)}`;

		return {
			range: symbol.selectionRange,
			contents: result,
		};
	}

	private async getVariableHoverContent(
		document: TextDocument,
		symbol: SassDocumentSymbol,
	): Promise<Hover> {
		const rawValue = this.getVariableValue(document, symbol) || "";
		let value = await this.ls.findValue(document, symbol.selectionRange.start);
		value = value || "";

		const result = {
			kind: MarkupKind.Markdown,
			value: [
				"```scss",
				`${symbol.name}: ${value};${
					value !== rawValue ? ` // via ${rawValue}` : ""
				}`,
				"```",
			].join("\n"),
		};

		const sassdoc = applySassDoc(symbol);
		if (sassdoc) {
			result.value += `\n____\n${sassdoc}`;
		}

		result.value += `\n____\nVariable declared in ${this.getFileName(document)}`;

		return {
			range: symbol.selectionRange,
			contents: result,
		};
	}

	private getVariableValue(
		document: TextDocument,
		variable: SassDocumentSymbol,
	): string | null {
		const offset = document.offsetAt(variable.selectionRange.start);
		const stylesheet = this.ls.parseStylesheet(document);
		const node = getNodeAtOffset(stylesheet, offset);
		if (node === null) {
			return null;
		}
		const parent = node.getParent();
		if (!parent) {
			return null;
		}
		if (parent instanceof VariableDeclaration) {
			return parent.getValue()?.getText() || null;
		}
		return null;
	}

	private getFileName(document: TextDocument): string {
		const uri = document.uri;
		const lastSlash = uri.lastIndexOf("/");
		return lastSlash === -1 ? uri : uri.slice(Math.max(0, lastSlash + 1));
	}
}
