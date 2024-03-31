import {
	TokenType,
	IToken,
	NodeType,
	CompletionItem,
	FunctionDeclaration,
	MixinDeclaration,
	InsertTextFormat,
	FunctionParameter,
	CompletionItemKind,
} from "@somesass/vscode-css-languageservice";
import { sassDocAnnotations } from "../facts/sassdoc";
import { LanguageFeature } from "../language-feature";
import {
	CompletionList,
	Position,
	TextDocument,
	getNodeAtOffset,
} from "../language-services-types";

const reNewSassdocBlock = /\/\/\/\s?$/;
const reSassdocLine = /\/\/\/\s/;

export class DoComplete extends LanguageFeature {
	async doComplete(
		document: TextDocument,
		position: Position,
	): Promise<CompletionList> {
		const result = CompletionList.create([]);

		const stylesheet = this.ls.parseStylesheet(document);
		const offset = document.offsetAt(position);
		const node = getNodeAtOffset(stylesheet, offset);

		// If the document begins with a comment, the Stylesheet node does not begin at offset 0,
		// instead starting where the comment block ends. In that case node may be null. Otherwise
		// if we get NodeType.Stylesheet, it's likely we're in a comment context and want to check
		// if it's Sassdoc.
		const isMaybeSassdocContext =
			(!node && stylesheet.offset !== 0) ||
			(node && node.type === NodeType.Stylesheet);
		if (isMaybeSassdocContext) {
			const scanner = this.getScanner(document);
			let token: IToken = scanner.scan();
			let prevToken: IToken | null = null;
			while (token.type !== TokenType.EOF) {
				// Lookback is needed to figure out if we should do Sassdoc block completion.
				// It should happen if we hit a function or mixin declaration with `///`
				// (and an optional space) as the previous token. If we overshoot offset
				// and that has not happened we don't really care about the rest of the
				// document and break out of the loop.
				if (prevToken && prevToken.offset + prevToken.len > offset) {
					break;
				}

				// Don't start processing the token until we've reached the token under the cursor
				if (token.offset + token.len < offset) {
					prevToken = token;
					token = scanner.scan();
					continue;
				}

				if (token.type === TokenType.AtKeyword) {
					const keyword = token.text.toLowerCase();
					const isFunction = keyword === "@function";
					const isMixin = keyword === "@mixin";
					if (isFunction || isMixin) {
						if (prevToken && prevToken.text.match(reNewSassdocBlock)) {
							const node = getNodeAtOffset(stylesheet, token.offset);
							if (
								node &&
								(node instanceof MixinDeclaration ||
									node instanceof FunctionDeclaration)
							) {
								const item = this.doSassdocBlockCompletion(document, node);
								result.items.push(item);
							}
						}
					}
				}

				if (
					token.type === TokenType.Comment &&
					token.text.match(reSassdocLine)
				) {
					const beforeCursor = token.text.substring(0, offset - token.offset);
					const items = this.doSassdocAnnotationCompletion(beforeCursor);
					result.items.push(...items);
				}

				prevToken = token;
				token = scanner.scan();
			}

			if (result.items.length > 0) {
				return result;
			}
		}

		// Same as for Sassdoc, but if we reach this point we can assume it's a regular comment block
		// where we don't want to provide any suggestions.
		const isCommentContext = !node || node.type === NodeType.Stylesheet;
		if (isCommentContext) {
			return result;
		}

		// TODO: isImportContext, doImportComplete
		// TODO: isNamespaceContext, doNamespacedComplete
		// TODO: isPlaceholderDeclarationContext, doPlaceholderDeclarationComplete
		// TODO: hasWildcardNamespace, this.findInWorkspace (extended with a "links" parameter limited to wildcard links) completionItems
		// TODO: look up extension settings re suggestfromuseonly && not placeholder context (needs same global style lookup as for @import), return if true
		// TODO: placeholder complete and @import-style fallback complete

		return result;
	}

	doSassdocAnnotationCompletion(beforeCursor: string): CompletionItem[] {
		if (beforeCursor.includes("@example")) {
			return [
				{
					label: "scss",
					sortText: "-", // Give highest priority
					kind: CompletionItemKind.Value,
				},
				{
					label: "css",
					kind: CompletionItemKind.Value,
				},
				{
					label: "markup",
					kind: CompletionItemKind.Value,
				},
				{
					label: "javascript",
					sortText: "y", // Give lowest priority
					kind: CompletionItemKind.Value,
				},
			];
		}

		const items: CompletionItem[] = [];
		for (const {
			annotation,
			aliases,
			insertText,
			insertTextFormat,
		} of sassDocAnnotations) {
			const item = {
				label: annotation,
				kind: CompletionItemKind.Keyword,
				insertText,
				insertTextFormat,
				sortText: "-", // Give highest priority
			};

			items.push(item);

			if (aliases) {
				for (const alias of aliases) {
					items.push({
						...item,
						label: alias,
						insertText: insertText
							? insertText.replace(annotation, alias)
							: insertText,
					});
				}
			}
		}

		return items;
	}

	/**
	 * Generates a suggestion for a Sassdoc block above a mixin or function that includes its parameters.
	 */
	doSassdocBlockCompletion(
		document: TextDocument,
		node: FunctionDeclaration | MixinDeclaration,
	): CompletionItem {
		const isMixin = node.type === NodeType.MixinDeclaration;

		// Incremented when used, starting at position zero below.
		// This ensures each snippet gets a unique tab position, ending at
		// position 0 which is the description for the block itself.
		let position = 0;
		let snippet = ` \${${position++}}`; // " ${0}"

		const parameters = node
			.getParameters()
			.getChildren() as FunctionParameter[];

		for (const parameter of parameters) {
			const name = parameter.getName();
			const defaultValue = parameter.getDefaultValue()?.getText();
			let typeSnippet = "type";
			let defaultValueSnippet = "";
			if (defaultValue) {
				defaultValueSnippet = ` [${defaultValue}]`;

				// Try to give a sensible default type if we can
				if (defaultValue === "true" || defaultValue === "false") {
					typeSnippet = "Boolean";
				} else if (/^["']/.exec(defaultValue)) {
					typeSnippet = "String";
				} else if (
					defaultValue.startsWith("#") ||
					defaultValue.startsWith("rgb") ||
					defaultValue.startsWith("hsl")
				) {
					typeSnippet = "Color";
				} else {
					const maybeNumber = Number.parseFloat(defaultValue);
					if (!Number.isNaN(maybeNumber)) {
						typeSnippet = "Number";
					}
				}
			}

			// A parameter snippet such as the one below. The escape sequence "\\${name}" is needed to get the $ of variable names as part of the snippet output.
			// "/// @param {$1:Number} \$start [0] ${2:-}"
			snippet += `\n/// @param {\${${position++}:${typeSnippet}}} \\${name}${defaultValueSnippet} \${${position++}:-}`;
		}

		if (isMixin) {
			const text = node.getText();
			const hasContentAtKeyword = text.includes("@content");
			if (hasContentAtKeyword) {
				snippet += `\n/// @content \${${position++}}`;
			}
			snippet += `\n/// @output \${${position++}}`;
		} else {
			snippet += `\n/// @return \${${position++}}`;
		}

		return {
			label: "SassDoc Block",
			insertText: snippet,
			insertTextFormat: InsertTextFormat.Snippet,
			sortText: "-", // Give highest priority
		};
	}
}
