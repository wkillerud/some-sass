import { getNodeAtOffset } from "@somesass/vscode-css-languageservice";
import ColorDotJS from "colorjs.io";
import { ParseResult } from "sassdoc-parser";
import { SassBuiltInModule, sassBuiltInModules } from "../facts/sass";
import { sassDocAnnotations } from "../facts/sassdoc";
import { LanguageFeature } from "../language-feature";
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
	Use,
	Forward,
	Node,
	Module,
	MarkupKind,
	SymbolKind,
	CompletionItemTag,
	MixinReference,
	ForStatement,
	EachStatement,
	Identifier,
	CompletionList,
	DocumentLink,
	FileType,
	Position,
	SassDocumentSymbol,
	TextDocument,
	URI,
	Utils,
} from "../language-services-types";
import { asDollarlessVariable } from "../utils/sass";
import { applySassDoc } from "../utils/sassdoc";

const reNewSassdocBlock = /\/\/\/\s?$/;
const reSassdocLine = /\/\/\/\s/;
const reSassDotExt = /\.s(a|c)ss$/;
const rePrivate = /^\$?[-_].*$/;

const reReturn = /^.*@return/;
const reEach = /^.*@each .+ in /;
const reFor = /^.*@for .+ from /;
const reIf = /^.*@if /;
const reElseIf = /^.*@else if /;
const reWhile = /^.*@while /;
const reDebug = /^.*@debug /;
const reWarn = /^.*@warn /;
const reError = /^.*@error /;
const rePropertyValue = /.*:\s*/;
const reEmptyPropertyValue = /.*:\s*$/;
const reQuotedValueInString = /["'](?:[^"'\\]|\\.)*["']/g;
const reMixinReference = /.*@include\s+(.*)/;
const reIndentedMixinReference = /.*(@include\s+|\+)(.*)/;
const reCompletedMixinWithParametersReference = /.*@include\s+(.*)\(/;
const reCompletedIndentedMixinWithParametersReference =
	/.*(@include\s+|\+)(.*)\(/;
const reComment = /^(.*\/\/|.*\/\*|\s*\*)/;
const reSassDoc = /^[\\s]*\/{3}.*$/;
const reQuotes = /["']/;
const rePlaceholder = /@extend\s+/;
const rePlaceholderDeclaration = /^\s*%/;
const rePartialModuleAtRule = /@(?:use|forward|import) ["']/;

type CompletionContext = {
	currentWord: string;
	namespace?: string;
	isMixinContext?: boolean;
	isFunctionContext?: boolean;
	isVariableContext?: boolean;
	isPlaceholderContext?: boolean;
	isPlaceholderDeclarationContext?: boolean;
	isCommentContext?: boolean;
	isSassdocContext?: boolean;
	isImportContext?: boolean;
};

export class DoComplete extends LanguageFeature {
	async doComplete(
		document: TextDocument,
		position: Position,
	): Promise<CompletionList> {
		const result = CompletionList.create([]);
		const upstreamLs = this.getUpstreamLanguageServer();
		const context = this.createCompletionContext(document, position);

		const stylesheet = this.ls.parseStylesheet(document);
		const offset = document.offsetAt(position);
		let node = getNodeAtOffset(stylesheet, offset);

		// In a handful of cases we don't get a node because our offset lands on a whitespace of
		// an incomplete declaration, for instance "@include ". Try to look back at offset - 1 and
		// see if we get a node there.
		if (!node && offset > 0) {
			node = getNodeAtOffset(stylesheet, offset - 1);
		}

		if (context.isSassdocContext) {
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

				if (token.type !== TokenType.Newline) {
					// ignore newlines in the logic
					prevToken = token;
				}
				token = scanner.scan();
			}

			if (result.items.length > 0) {
				return result;
			}
		}

		if (context.isCommentContext) {
			return result;
		}

		if (context.isImportContext) {
			// Upstream includes thing like suggestions based on relative paths
			// and imports of built-in sass modules like sass:color and sass:math
			const upstreamResult = await upstreamLs.doComplete2(
				document,
				position,
				stylesheet,
				this.getDocumentContext(),
				{
					...(document.languageId === "sass"
						? this.configuration.sass?.completion
						: this.configuration.scss?.completion),
					triggerPropertyValueCompletion:
						document.languageId === "sass"
							? this.configuration.sass?.completion
									?.triggerPropertyValueCompletion || true
							: false,
				},
			);
			if (upstreamResult.items.length > 0) {
				result.items.push(...upstreamResult.items);
			}

			if (
				node &&
				node.parent &&
				(node.parent instanceof Use || node.parent instanceof Forward)
			) {
				const items = await this.doModuleImportCompletion(document, node);
				if (items.length > 0) {
					result.items.push(...items);
				}
			}

			return result;
		}

		if (context.isPlaceholderDeclarationContext) {
			const items = await this.doPlaceholderDeclarationCompletion();
			if (items.length > 0) {
				result.items.push(...items);
			}
			return result;
		}

		if (context.isPlaceholderContext) {
			const items = await this.doPlaceholderUsageCompletion(document);
			if (items.length > 0) {
				result.items.push(...items);
			}
			return result;
		}

		/* Completions for variables, functions and mixins */

		// At this point we're at `@for ` and will declare a variable.
		// We don't need suggestions here.
		const forDeclaration = node instanceof ForStatement && !node.hasChildren();
		if (forDeclaration) {
			return result;
		}

		// At this point we're at `@each ` and will declare a variable.
		// We don't need suggestions here.
		const eachDeclaration =
			node instanceof EachStatement && !node.variables?.hasChildren();
		if (eachDeclaration) {
			return result;
		}

		if (context.namespace) {
			const items = await this.doNamespaceCompletion(document, context);
			if (items.length > 0) {
				result.items.push(...items);
				return result;
			}
		}

		// We might be looking at a wildcard alias (@use "./foo" as *), so check the links and see if we need to go looking
		const links = await this.ls.findDocumentLinks(document);
		const wildcards: DocumentLink[] = [];
		for (const link of links) {
			if (link.as === "*") {
				wildcards.push(link);
			}
		}
		if (wildcards.length > 0) {
			const items = await this.doWildcardCompletion(document, wildcards, {
				...context,
				namespace: "*",
			});
			if (items.length > 0) {
				result.items.push(...items);
			}
		}

		// Legacy @import style suggestions
		if (
			!(
				document.languageId === "sass"
					? this.configuration.sass?.completion
					: this.configuration.scss?.completion
			)?.suggestFromUseOnly
		) {
			const currentWord = context.currentWord;
			const documents = this.cache.documents();
			for (const currentDocument of documents) {
				if (
					document.languageId === "scss" &&
					this.configuration.scss?.completion?.suggestAllFromOpenDocument &&
					currentDocument.uri === document.uri
				) {
					continue;
				}

				const symbols = this.ls.findDocumentSymbols(currentDocument);
				for (const symbol of symbols) {
					const isPrivate = Boolean(symbol.name.match(rePrivate));
					if (isPrivate && currentDocument.uri !== document.uri) {
						continue;
					}

					switch (symbol.kind) {
						case SymbolKind.Variable: {
							if (!context.isVariableContext) break;

							const items = await this.doVariableCompletion(
								document,
								currentDocument,
								currentWord,
								symbol,
								isPrivate,
							);
							if (items.length > 0) {
								result.items.push(...items);
							}
							break;
						}
						case SymbolKind.Method: {
							if (!context.isMixinContext) break;

							const items = await this.doMixinCompletion(
								document,
								currentDocument,
								currentWord,
								symbol,
								isPrivate,
							);
							if (items.length > 0) {
								result.items.push(...items);
							}
							break;
						}
						case SymbolKind.Function: {
							if (!context.isFunctionContext) break;

							const items = await this.doFunctionCompletion(
								document,
								currentDocument,
								currentWord,
								symbol,
								isPrivate,
							);
							if (items.length > 0) {
								result.items.push(...items);
							}
							break;
						}
					}
				}
			}
		}

		if (
			document.languageId === "sass" ||
			this.configuration.scss?.completion?.suggestAllFromOpenDocument
		) {
			const upstreamResult = await upstreamLs.doComplete2(
				document,
				position,
				stylesheet,
				this.getDocumentContext(),
				this.configuration.sass?.completion,
			);
			if (upstreamResult.items.length > 0) {
				result.items.push(...upstreamResult.items);
			}
		}

		// give suggestions for all @use in case the user is typing one of those
		for (const link of links) {
			if (link.namespace) {
				result.items.push({
					label: link.namespace,
					kind: CompletionItemKind.Module,
				});
			}
		}

		return result;
	}

	createCompletionContext(
		document: TextDocument,
		position: Position,
	): CompletionContext {
		const text = document.getText();
		const offset = document.offsetAt(position);
		let i = offset - 1;
		while (!"\n\r".includes(text.charAt(i))) {
			i--;
		}
		const lineBeforePosition = text.substring(i + 1, offset);

		i = offset - 1;
		while (i >= 0 && !' \t\n\r":[()]}/,'.includes(text.charAt(i))) {
			i--;
		}
		const currentWord = text.substring(i + 1, offset);

		if (rePartialModuleAtRule.test(lineBeforePosition)) {
			return {
				currentWord,
				isImportContext: true,
			};
		}

		if (reSassDoc.test(lineBeforePosition)) {
			return {
				currentWord,
				isSassdocContext: true,
			};
		}

		if (reComment.test(lineBeforePosition)) {
			return {
				currentWord,
				isCommentContext: true,
			};
		}

		if (rePlaceholder.test(lineBeforePosition)) {
			return {
				currentWord,
				isPlaceholderContext: true,
			};
		}

		if (rePlaceholderDeclaration.test(lineBeforePosition)) {
			return {
				currentWord,
				isPlaceholderDeclarationContext: true,
			};
		}

		const isInterpolation =
			currentWord.includes("#{") || lineBeforePosition.includes("#{");

		const context: CompletionContext = {
			currentWord,
		};

		if (isInterpolation) {
			context.isFunctionContext = true;
			context.isVariableContext = true;
		}

		// Is namespace, e.g. `namespace.$var` or `@include namespace.mixin` or `namespace.func()`
		context.namespace =
			currentWord.length === 0 || !currentWord.includes(".")
				? undefined
				: currentWord.substring(
						// Skip #{ if this is interpolation
						isInterpolation ? currentWord.indexOf("{") + 1 : 0,
						currentWord.indexOf(".", currentWord.indexOf("{") + 1),
					);

		const isPropertyValue = rePropertyValue.test(lineBeforePosition);
		const isEmptyValue = reEmptyPropertyValue.test(lineBeforePosition);
		const isQuotes = reQuotes.test(
			lineBeforePosition.replace(reQuotedValueInString, ""),
		);

		const isControlFlow =
			reReturn.test(lineBeforePosition) ||
			reIf.test(lineBeforePosition) ||
			reElseIf.test(lineBeforePosition) ||
			reEach.test(lineBeforePosition) ||
			reFor.test(lineBeforePosition) ||
			reWhile.test(lineBeforePosition) ||
			reDebug.test(lineBeforePosition) ||
			reError.test(lineBeforePosition) ||
			reWarn.test(lineBeforePosition);

		if ((isControlFlow || isPropertyValue) && !isEmptyValue && !isQuotes) {
			if (context.namespace && currentWord.endsWith(".")) {
				context.isVariableContext = true;
			} else {
				context.isVariableContext = currentWord.includes("$");
			}
		} else if (isQuotes) {
			context.isVariableContext = isInterpolation;
		} else {
			context.isVariableContext =
				currentWord.startsWith("$") || isInterpolation || isEmptyValue;
		}

		if ((isControlFlow || isPropertyValue) && !isEmptyValue && !isQuotes) {
			if (context.namespace) {
				context.isFunctionContext = true;
			} else {
				const lastChar = lineBeforePosition.charAt(
					lineBeforePosition.length - 1,
				);
				const triggers =
					document.languageId === "sass"
						? this.configuration.sass?.completion
								?.suggestFunctionsInStringContextAfterSymbols
						: this.configuration.scss?.completion
								?.suggestFunctionsInStringContextAfterSymbols;
				if (triggers) {
					context.isFunctionContext = triggers.includes(lastChar);
				}
			}
		} else if (isQuotes) {
			context.isFunctionContext = isInterpolation;
		} else if (isPropertyValue && isEmptyValue) {
			context.isFunctionContext = true;
		}

		if (!isPropertyValue && reMixinReference.test(lineBeforePosition)) {
			context.isMixinContext = true;
			if (reCompletedMixinWithParametersReference.test(lineBeforePosition)) {
				context.isMixinContext = false;
				context.isVariableContext = true;
				context.isFunctionContext = true;
			}
		} else if (document.languageId === "sass") {
			// do the same test for the shorthand + to include mixins in this syntax
			if (
				!isPropertyValue &&
				reIndentedMixinReference.test(lineBeforePosition)
			) {
				context.isMixinContext = true;
				if (
					reCompletedIndentedMixinWithParametersReference.test(
						lineBeforePosition,
					)
				) {
					context.isMixinContext = false;
					context.isVariableContext = true;
					context.isFunctionContext = true;
				}
			}
		}

		return context;
	}

	async doPlaceholderUsageCompletion(
		initialDocument: TextDocument,
	): Promise<CompletionItem[]> {
		const items: CompletionItem[] = [];
		const result = await this.findInWorkspace<CompletionItem>((document) => {
			const symbols = this.ls.findDocumentSymbols(document);
			const items: CompletionItem[] = [];
			for (const symbol of symbols) {
				if (symbol.kind === SymbolKind.Class && symbol.name.startsWith("%")) {
					const item: CompletionItem = this.toCompletionItem(document, symbol);
					items.push(item);
				}
			}
			return items;
		}, initialDocument);

		if (result.length > 0) {
			items.push(...result);
		}

		if (
			initialDocument.languageId === "sass"
				? this.configuration.sass?.completion?.suggestFromUseOnly
				: this.configuration.scss?.completion?.suggestFromUseOnly
		) {
			const documents = this.cache.documents();
			for (const current of documents) {
				const symbols = this.ls.findDocumentSymbols(current);
				for (const symbol of symbols) {
					if (symbol.kind === SymbolKind.Class && symbol.name.startsWith("%")) {
						const item: CompletionItem = this.toCompletionItem(current, symbol);
						items.push(item);
					}
				}
			}
		}

		return items;
	}

	private toCompletionItem(document: TextDocument, symbol: SassDocumentSymbol) {
		const filterText = symbol.name.substring(1);

		let documentation = symbol.name;
		const sassdoc = applySassDoc(symbol);
		if (sassdoc) {
			documentation += `\n____\n${sassdoc}`;
		}

		const detail = `Placeholder declared in ${this.getFileName(document.uri)}`;

		const item: CompletionItem = {
			detail,
			documentation,
			filterText,
			insertText: filterText,
			insertTextFormat: InsertTextFormat.PlainText,
			kind: CompletionItemKind.Class,
			label: symbol.name,
			tags: symbol.sassdoc?.deprecated
				? [CompletionItemTag.Deprecated]
				: undefined,
		};
		return item;
	}

	/**
	 * Make completion items for each `%placeholder` used in an `@extend` statement.
	 * This is useful for workflows where the selectors often change, but the semantics
	 * are stable.
	 *
	 * @see https://github.com/wkillerud/some-sass/issues/49
	 */
	async doPlaceholderDeclarationCompletion(): Promise<CompletionItem[]> {
		const items: CompletionItem[] = [];
		const documents = this.cache.documents();
		for (const currentDocument of documents) {
			const symbols = this.ls.findDocumentSymbols(currentDocument);
			for (const symbol of symbols) {
				if (symbol.kind === SymbolKind.Class) {
					if (!symbol.children) continue;

					// cssNavigation should only add these placeholder symbols as children
					// if the node parent is an @extend reference, meaning a placeholder usage.
					for (const child of symbol.children) {
						if (child.kind === SymbolKind.Class && child.name.startsWith("%")) {
							const filterText = child.name.substring(1);
							items.push({
								filterText,
								insertText: filterText,
								insertTextFormat: InsertTextFormat.PlainText,
								kind: CompletionItemKind.Class,
								label: child.name,
							});
						}
					}
				}
			}
		}
		return items;
	}

	async doNamespaceCompletion(
		document: TextDocument,
		context: CompletionContext,
	): Promise<CompletionItem[]> {
		const items: CompletionItem[] = [];

		const namespace: string | undefined = context.namespace;
		if (!namespace) {
			return items;
		}

		const links = await this.ls.findDocumentLinks(document);
		let start: TextDocument | undefined = undefined;
		for (const link of links) {
			if (
				link.target &&
				link.type === NodeType.Use &&
				link.namespace === namespace
			) {
				if (link.target.includes("sass:")) {
					// Look for matches in built-in namespaces, which do not appear in storage
					for (const [builtIn, docs] of Object.entries(sassBuiltInModules)) {
						if (builtIn === link.target) {
							const items = this.doSassBuiltInCompletion(
								document,
								context,
								docs,
							);
							return items;
						}
					}
				} else {
					start = this.cache.getDocument(link.target);
				}
				break;
			}
		}

		if (!start) {
			return items;
		}

		const result = await this.findCompletionsInWorkspace(
			document,
			context,
			start,
		);
		return result;
	}

	async doWildcardCompletion(
		document: TextDocument,
		wildcards: DocumentLink[],
		context: CompletionContext,
	): Promise<CompletionItem[]> {
		const items: CompletionItem[] = [];
		for (const link of wildcards) {
			const start = this.cache.getDocument(link.target!);
			if (!start) continue;

			const result = await this.findCompletionsInWorkspace(
				document,
				context,
				start,
			);

			if (result.length > 0) {
				items.push(...result);
			}
		}
		return items;
	}

	private async findCompletionsInWorkspace(
		document: TextDocument,
		context: CompletionContext,
		start: TextDocument,
	) {
		const result = await this.findInWorkspace<CompletionItem>(
			async (currentDocument, prefix, hide, show) => {
				const items: CompletionItem[] = [];
				const symbols = this.ls.findDocumentSymbols(currentDocument);
				for (const symbol of symbols) {
					if (show.length > 0 && !show.includes(symbol.name)) {
						continue;
					}
					if (hide.includes(symbol.name)) {
						continue;
					}
					const isPrivate = Boolean(symbol.name.match(rePrivate));
					if (isPrivate && currentDocument.uri !== document.uri) {
						continue;
					}

					switch (symbol.kind) {
						case SymbolKind.Variable: {
							if (!context.isVariableContext) break;

							const vars = await this.doVariableCompletion(
								document,
								currentDocument,
								context.currentWord,
								symbol,
								isPrivate,
								context.namespace,
								prefix,
							);
							if (vars.length > 0) {
								items.push(...vars);
							}
							break;
						}
						case SymbolKind.Method: {
							if (!context.isMixinContext) break;

							const mixs = await this.doMixinCompletion(
								document,
								currentDocument,
								context.currentWord,
								symbol,
								isPrivate,
								context.namespace,
								prefix,
							);
							if (mixs.length > 0) {
								items.push(...mixs);
							}
							break;
						}
						case SymbolKind.Function: {
							if (!context.isFunctionContext) break;

							const funcs = await this.doFunctionCompletion(
								document,
								currentDocument,
								context.currentWord,
								symbol,
								isPrivate,
								context.namespace,
								prefix,
							);
							if (funcs.length > 0) {
								items.push(...funcs);
							}
							break;
						}
					}
				}
				return items;
			},
			start,
			{ lazy: false, depth: 1 },
		);
		return result;
	}

	private async doVariableCompletion(
		initialDocument: TextDocument,
		currentDocument: TextDocument,
		currentWord: string,
		symbol: SassDocumentSymbol,
		isPrivate: boolean,
		namespace = "",
		prefix = "",
	): Promise<CompletionItem[]> {
		// Avoid ending up with namespace.prefix-$variable
		const label = `$${prefix}${asDollarlessVariable(symbol.name)}`;
		const rawValue = this.getVariableValue(currentDocument, symbol);
		let value = await this.findValue(
			currentDocument,
			symbol.selectionRange.start,
		);
		value = value || rawValue;
		const color = value ? getColorValue(value) : null;
		const completionKind = color
			? CompletionItemKind.Color
			: CompletionItemKind.Variable;

		let documentation =
			color ||
			[
				"```scss",
				`${label}: ${value};${value !== rawValue ? ` // via ${rawValue}` : ""}`,
				"```",
			].join("\n") ||
			"";
		const sassdoc = applySassDoc(symbol);
		if (sassdoc) {
			documentation += `\n____\n${sassdoc}`;
		}
		documentation += `\n____\nVariable declared in ${this.getFileName(currentDocument.uri)}`;

		const sortText = isPrivate ? label.replace(/^$[_]/, "") : undefined;

		const dotExt = initialDocument.uri.slice(
			Math.max(0, initialDocument.uri.lastIndexOf(".")),
		);
		const isEmbedded = !dotExt.match(reSassDotExt);
		let insertText: string | undefined;
		let filterText: string | undefined;

		if (namespace && namespace !== "*") {
			insertText = currentWord.endsWith(".")
				? `${isEmbedded || dotExt === ".sass" ? "" : "."}${label}`
				: isEmbedded
					? asDollarlessVariable(label)
					: label;

			filterText = currentWord.endsWith(".") ? `${namespace}.${label}` : label;
		} else if (dotExt === ".vue" || dotExt === ".astro" || dotExt === ".sass") {
			// In these languages the $ does not get replaced by the suggestion,
			// so exclude it from the insertText.
			insertText = asDollarlessVariable(label);
		}

		const item: CompletionItem = {
			commitCharacters: [";", ","],
			documentation:
				completionKind === CompletionItemKind.Color
					? documentation
					: {
							kind: MarkupKind.Markdown,
							value: documentation,
						},
			filterText,
			kind: completionKind,
			label,
			insertText,
			sortText,
			tags: symbol.sassdoc?.deprecated ? [CompletionItemTag.Deprecated] : [],
		};
		return [item];
	}

	private isEmbedded(initialDocument: TextDocument) {
		const dotExt = initialDocument.uri.slice(
			Math.max(0, initialDocument.uri.lastIndexOf(".")),
		);
		const isEmbedded = !dotExt.match(reSassDotExt);
		return isEmbedded;
	}

	private async doMixinCompletion(
		initialDocument: TextDocument,
		currentDocument: TextDocument,
		currentWord: string,
		symbol: SassDocumentSymbol,
		isPrivate: boolean,
		namespace = "",
		prefix = "",
	): Promise<CompletionItem[]> {
		const items: CompletionItem[] = [];

		const label = `${prefix}${symbol.name}`;
		const filterText = namespace
			? namespace !== "*"
				? `${namespace}.${prefix}${symbol.name}`
				: `${prefix}${symbol.name}`
			: symbol.name;

		const isEmbedded = this.isEmbedded(initialDocument);
		const includeDot =
			namespace !== "*" && !isEmbedded && initialDocument.languageId !== "sass";
		const insertText = namespace
			? includeDot
				? `.${prefix}${symbol.name}`
				: `${prefix}${symbol.name}`
			: symbol.name;

		const sortText = isPrivate ? label.replace(/^$[_]/, "") : undefined;

		const documentation = {
			kind: MarkupKind.Markdown,
			value: `\`\`\`scss\n@mixin ${symbol.name}${symbol.detail || "()"}\n\`\`\``,
		};
		const sassdoc = applySassDoc(symbol);
		if (sassdoc) {
			documentation.value += `\n____\n${sassdoc}`;
		}
		documentation.value += `\n____\nMixin declared in ${this.getFileName(currentDocument.uri)}`;

		const getCompletionVariants = (
			insertText: string,
			detail?: string,
		): CompletionItem[] => {
			const variants: CompletionItem[] = [];
			// Not all mixins have @content, but when they do, be smart about adding brackets
			// and move the cursor to be ready to add said contents.
			// Include as separate suggestion since content may not always be needed or wanted.

			if (
				initialDocument.languageId === "sass"
					? this.configuration.sass?.completion?.suggestionStyle !== "bracket"
					: this.configuration.scss?.completion?.suggestionStyle !== "bracket"
			) {
				variants.push({
					documentation,
					filterText,
					kind: CompletionItemKind.Method,
					label,
					labelDetails: detail ? { detail: `(${detail})` } : undefined,
					insertText,
					insertTextFormat: InsertTextFormat.Snippet,
					sortText,
					tags: symbol.sassdoc?.deprecated
						? [CompletionItemTag.Deprecated]
						: [],
				});
			}

			if (
				initialDocument.languageId === "sass"
					? this.configuration.sass?.completion?.suggestionStyle !== "nobracket"
					: this.configuration.scss?.completion?.suggestionStyle !== "nobracket"
			) {
				variants.push({
					documentation,
					filterText,
					kind: CompletionItemKind.Method,
					label,
					labelDetails: { detail: detail ? `(${detail}) { }` : " { }" },
					insertText: (insertText += " {\n\t$0\n}"),
					insertTextFormat: InsertTextFormat.Snippet,
					sortText,
					tags: symbol.sassdoc?.deprecated
						? [CompletionItemTag.Deprecated]
						: [],
				});
			}

			return variants;
		};

		// In the case of no required parameters, skip details.
		// If there are required parameters, add a suggestion with only them.
		// If there are optional parameters, add a suggestion with all parameters.
		if (symbol.detail) {
			const parameters = getParametersFromDetail(symbol.detail);
			const requiredParameters = parameters.filter((p) => !p.defaultValue);
			if (requiredParameters.length > 0) {
				const parametersSnippet = requiredParameters
					.map((p, i) => mapParameterSnippet(p, i, symbol.sassdoc))
					.join(", ");
				const insert = insertText + `(${parametersSnippet})`;

				const detail = requiredParameters
					.map((p) => mapParameterSignature(p))
					.join(", ");

				items.push(...getCompletionVariants(insert, detail));
			}
			if (requiredParameters.length !== parameters.length) {
				const parametersSnippet = parameters
					.map((p, i) => mapParameterSnippet(p, i, symbol.sassdoc))
					.join(", ");
				const insert = insertText + `(${parametersSnippet})`;

				const detail = parameters
					.map((p) => mapParameterSignature(p))
					.join(", ");

				items.push(...getCompletionVariants(insert, detail));
			}
		} else {
			items.push(...getCompletionVariants(insertText));
		}
		return items;
	}

	private async doFunctionCompletion(
		initialDocument: TextDocument,
		currentDocument: TextDocument,
		currentWord: string,
		symbol: SassDocumentSymbol,
		isPrivate: boolean,
		namespace = "",
		prefix = "",
	): Promise<CompletionItem[]> {
		const items: CompletionItem[] = [];

		const label = `${prefix}${symbol.name}`;
		let filterText = symbol.name;
		if (namespace) {
			if (namespace === "*") {
				filterText = `${prefix}${symbol.name}`;
			} else {
				filterText = `${namespace}.${prefix}${symbol.name}`;
			}
		}

		const isEmbedded = this.isEmbedded(initialDocument);
		const includeDot =
			namespace !== "*" && !isEmbedded && initialDocument.languageId !== "sass";
		const insertText = namespace
			? includeDot
				? `.${prefix}${symbol.name}`
				: `${prefix}${symbol.name}`
			: symbol.name;

		const sortText = isPrivate ? label.replace(/^$[_]/, "") : undefined;

		const documentation = {
			kind: MarkupKind.Markdown,
			value: `\`\`\`scss\n@function ${symbol.name}${symbol.detail || "()"}\n\`\`\``,
		};
		const sassdoc = applySassDoc(symbol);
		if (sassdoc) {
			documentation.value += `\n____\n${sassdoc}`;
		}
		documentation.value += `\n____\nFunction declared in ${this.getFileName(currentDocument.uri)}`;

		// If there are required parameters, add a suggestion with only them.
		// If there are optional parameters, add a suggestion with all parameters.
		const parameters = getParametersFromDetail(symbol.detail);
		const requiredParameters = parameters.filter((p) => !p.defaultValue);
		const parametersSnippet = requiredParameters
			.map((p, i) => mapParameterSnippet(p, i, symbol.sassdoc))
			.join(", ");
		const detail = requiredParameters
			.map((p) => mapParameterSignature(p))
			.join(", ");

		const item: CompletionItem = {
			documentation,
			filterText,
			kind: CompletionItemKind.Function,
			label,
			labelDetails: { detail: `(${detail})` },
			insertText: `${insertText}(${parametersSnippet})`,
			insertTextFormat: InsertTextFormat.Snippet,
			sortText,
			tags: symbol.sassdoc?.deprecated ? [CompletionItemTag.Deprecated] : [],
		};
		items.push(item);

		if (requiredParameters.length !== parameters.length) {
			const parametersSnippet = parameters
				.map((p, i) => mapParameterSnippet(p, i, symbol.sassdoc))
				.join(", ");
			const detail = parameters.map((p) => mapParameterSignature(p)).join(", ");

			const item: CompletionItem = {
				documentation,
				filterText,
				kind: CompletionItemKind.Function,
				label,
				labelDetails: { detail: `(${detail})` },
				insertText: `${insertText}(${parametersSnippet})`,
				insertTextFormat: InsertTextFormat.Snippet,
				sortText,
				tags: symbol.sassdoc?.deprecated ? [CompletionItemTag.Deprecated] : [],
			};
			items.push(item);
		}

		return items;
	}

	doSassBuiltInCompletion(
		document: TextDocument,
		context: CompletionContext,
		moduleDocs: SassBuiltInModule,
	): CompletionItem[] {
		const items: CompletionItem[] = [];
		for (const [name, docs] of Object.entries(moduleDocs.exports)) {
			const { description, signature, parameterSnippet, returns } = docs;
			// Client needs the namespace as part of the text that is matched,
			const filterText = `${context.namespace}.${name}`;

			// Inserted text needs to include the `.` which will otherwise
			// be replaced (except when we're embedded in Vue, Svelte or Astro).
			// Example result: .floor(${1:number})
			const isEmbedded = this.isEmbedded(document);
			const includeDot = isEmbedded && document.languageId !== "sass";
			const insertText = context.currentWord.includes(".")
				? `${includeDot ? "" : "."}${name}${
						signature ? `(${parameterSnippet})` : ""
					}`
				: name;

			items.push({
				documentation: {
					kind: MarkupKind.Markdown,
					value: `${description}\n\n[Sass documentation](${moduleDocs.reference}#${name})`,
				},
				filterText,
				insertText,
				insertTextFormat: parameterSnippet
					? InsertTextFormat.Snippet
					: InsertTextFormat.PlainText,
				kind: signature
					? CompletionItemKind.Function
					: CompletionItemKind.Variable,
				label: name,
				labelDetails: {
					detail:
						signature && returns ? `${signature} => ${returns}` : signature,
				},
			});
		}

		return items;
	}

	async doModuleImportCompletion(
		document: TextDocument,
		node: Node,
	): Promise<CompletionItem[]> {
		const items: CompletionItem[] = [];
		const url = node.getText().replace(/["']/g, "");
		const moduleName = getModuleNameFromPath(url);

		const rootFolderUri = this.configuration.workspaceRoot
			? Utils.joinPath(this.configuration.workspaceRoot, "/").toString(true)
			: "";
		const documentFolderUri = Utils.dirname(URI.parse(document.uri)).toString(
			true,
		);

		if (moduleName && moduleName !== "." && moduleName !== "..") {
			const modulePath = await this.resolvePathToModule(
				moduleName,
				documentFolderUri,
				rootFolderUri,
			);
			if (modulePath) {
				const pathWithinModule = url.substring(moduleName.length + 1);
				const pathInsideModule = Utils.joinPath(
					URI.parse(modulePath),
					pathWithinModule,
				);
				const filesInModulePath =
					await this.options.fileSystemProvider.readDirectory(pathInsideModule);
				for (const [name, fileType] of filesInModulePath) {
					const file = name;
					if (fileType === FileType.File && file.match(reSassDotExt)) {
						const filename = file.startsWith("/") ? file.slice(1) : file;
						// Prefer to insert without file extension
						let insertText = filename.slice(0, -5);
						if (insertText.startsWith("/")) {
							insertText = insertText.slice(1);
						}
						if (insertText.startsWith("_")) {
							insertText = insertText.slice(1);
						}
						items.push({
							label: escapePath(filename),
							insertText: escapePath(insertText),
							kind: CompletionItemKind.File,
						});
					} else if (fileType === FileType.Directory) {
						let insertText = escapePath(file);
						if (insertText.startsWith("/")) {
							insertText = insertText.slice(1);
						}
						insertText = `${insertText}/`;
						items.push({
							label: insertText,
							kind: CompletionItemKind.Folder,
							insertText,
							command: {
								title: "Suggest",
								command: "editor.action.triggerSuggest",
							},
						});
					}
				}
			}
		}

		if (!moduleName && url === "pkg:") {
			// Find the way to the nearest node_modules and list entries.
			// This won't cover all scenarios (like workspaces) or package managers, but
			// is better than nothing.
			const nodeModules = await this.resolvePathToNodeModules(
				documentFolderUri,
				rootFolderUri,
			);
			if (nodeModules) {
				const folders =
					await this.options.fileSystemProvider.readDirectory(nodeModules);
				for (const [name, fileType] of folders) {
					if (name.startsWith(".")) continue;

					if (fileType === FileType.Directory) {
						let insertText = escapePath(name);
						if (insertText.startsWith("/")) {
							insertText = insertText.slice(1);
						}
						insertText = `${insertText}`;
						items.push({
							label: insertText,
							kind: CompletionItemKind.Folder,
							insertText,
							command: {
								title: "Suggest",
								command: "editor.action.triggerSuggest",
							},
						});
					}
				}
			}
		}

		return items;
	}

	async resolvePathToModule(
		_moduleName: string,
		documentFolderUri: string,
		rootFolderUri: string | undefined,
	): Promise<string | undefined> {
		// resolve the module relative to the document. We can't use `require` here as the code is webpacked.

		const packPath = Utils.joinPath(
			URI.parse(documentFolderUri),
			"node_modules",
			_moduleName,
			"package.json",
		);
		if (await this.options.fileSystemProvider.exists(packPath)) {
			return Utils.dirname(packPath).toString(true);
		} else if (
			rootFolderUri &&
			documentFolderUri.startsWith(rootFolderUri) &&
			documentFolderUri.length !== rootFolderUri.length
		) {
			return this.resolvePathToModule(
				_moduleName,
				Utils.dirname(URI.parse(documentFolderUri)).toString(true),
				rootFolderUri,
			);
		}
		return undefined;
	}

	async resolvePathToNodeModules(
		documentFolderUri: string,
		rootFolderUri: string | undefined,
	): Promise<URI | undefined> {
		// resolve the module relative to the document. We can't use `require` here as the code is webpacked.

		const dirPath = Utils.joinPath(
			URI.parse(documentFolderUri),
			"node_modules",
		);
		if (await this.options.fileSystemProvider.exists(dirPath)) {
			return dirPath;
		} else if (
			rootFolderUri &&
			documentFolderUri.startsWith(rootFolderUri) &&
			documentFolderUri.length !== rootFolderUri.length
		) {
			return this.resolvePathToNodeModules(
				Utils.dirname(URI.parse(documentFolderUri)).toString(true),
				rootFolderUri,
			);
		}
		return undefined;
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
			snippet += `\n/// @return {\${${position++}:type}} \${${position++}:-}`;
		}

		return {
			label: "SassDoc Block",
			insertText: snippet,
			insertTextFormat: InsertTextFormat.Snippet,
			sortText: "-", // Give highest priority
		};
	}

	getModuleNode(document: TextDocument, node: Node | null): Module | null {
		if (!node) return null;

		switch (node.type) {
			case NodeType.MixinReference: {
				const identifier = (node as MixinReference).getIdentifier();
				if (
					identifier &&
					identifier.parent &&
					identifier.parent.type === NodeType.Module
				) {
					return identifier.parent as Module;
				}
				return null;
			}
			case NodeType.Module: {
				return node as Module;
			}
			case NodeType.Identifier: {
				if (node.parent && node.parent.type === NodeType.Module) {
					return node.parent as Module;
				}
				return null;
			}
			default: {
				const text = node.getText();
				const interpolationStart = text.indexOf("#{");
				if (interpolationStart !== -1) {
					const dotDelim = text.indexOf(".", interpolationStart + 2);
					if (dotDelim !== -1) {
						const maybeNamespace = text.substring(
							interpolationStart + 2,
							dotDelim + 1,
						);
						const module = new Module(
							node.offset + interpolationStart + 2,
							maybeNamespace.length,
							NodeType.Module,
						);
						const identifier = new Identifier(
							node.offset + interpolationStart + 2,
							maybeNamespace.length - 1,
						);
						module.setIdentifier(identifier);
						module.parent = node; // to get access to textProvider
						return module;
					}
				} else if (this.isEmbedded(document)) {
					const dotIndex = text.indexOf(".");
					if (dotIndex !== -1) {
						let startOffset = dotIndex;
						const endOffset = dotIndex;
						while (startOffset > 0) {
							const char = text.charAt(startOffset - 1);
							if (char.match(/\s/)) {
								break;
							}
							startOffset -= 1;
						}

						const module = new Module(
							node.offset + startOffset,
							endOffset - startOffset,
							NodeType.Module,
						);
						const identifier = new Identifier(
							node.offset + startOffset,
							endOffset - startOffset,
						);
						module.setIdentifier(identifier);
						module.parent = node; // to get access to textProvider
						return module;
					}
				}
				return null;
			}
		}
	}
}

function getModuleNameFromPath(modulePath: string) {
	let path = modulePath;

	// Slice away deprecated tilde import
	if (path.startsWith("~")) {
		path = path.slice(1);
	}

	const firstSlash = path.indexOf("/");
	if (firstSlash === -1) {
		return "";
	}

	// If a scoped module (starts with @) then get up until second instance of '/', or to the end of the string for root-level imports.
	if (path[0] === "@") {
		const secondSlash = path.indexOf("/", firstSlash + 1);
		if (secondSlash === -1) {
			return path;
		}
		return path.substring(0, secondSlash);
	}
	// Otherwise get until first instance of '/'
	return path.substring(0, firstSlash);
}

// Escape https://www.w3.org/TR/CSS1/#url
function escapePath(p: string) {
	return p.replace(/(\s|\(|\)|,|"|')/g, "\\$1");
}

function getColorValue(from: string): string | null {
	try {
		ColorDotJS.parse(from);
		return from;
	} catch {
		return null;
	}
}

type Parameter = {
	name: string;
	defaultValue?: string;
};

function getParametersFromDetail(detail?: string): Array<Parameter> {
	const result: Parameter[] = [];
	if (!detail) {
		return result;
	}

	const parameters = detail.replace(/[()]/g, "").split(",");
	for (const param of parameters) {
		let name = param;
		let defaultValue: string | undefined = undefined;
		const defaultValueStart = param.indexOf(":");
		if (defaultValueStart !== -1) {
			name = param.substring(0, defaultValueStart);
			defaultValue = param.substring(defaultValueStart + 1);
		}

		const parameter: Parameter = {
			name: name.trim(),
			defaultValue: defaultValue?.trim(),
		};

		result.push(parameter);
	}
	return result;
}

/**
 * Use the SnippetString syntax to provide smart completions of parameter names.
 */
function mapParameterSnippet(
	p: Parameter,
	index: number,
	sassdoc?: ParseResult,
): string {
	const dollarlessVariable = asDollarlessVariable(p.name);

	const parameterDocs =
		sassdoc && sassdoc.parameter
			? sassdoc.parameter.find((p) => p.name === dollarlessVariable)
			: undefined;

	if (parameterDocs?.type?.length) {
		const choices = parseStringLiteralChoices(parameterDocs.type);
		if (choices.length > 0) {
			return `\${${index + 1}|${choices.join(",")}|}`;
		}
	}

	return `\${${index + 1}:${dollarlessVariable}}`;
}

function mapParameterSignature(p: Parameter): string {
	return p.defaultValue ? `${p.name}: ${p.defaultValue}` : p.name;
}

const reStringLiteral = /^["'].+["']$/; // Yes, this will match 'foo", but let the parser deal with yelling about that.

/**
 * @param docstring A TypeScript-like string of accepted string literal values, for example `"standard" | "entrance" | "exit"`.
 */
function parseStringLiteralChoices(docstring: string[] | string): string[] {
	const docstrings = typeof docstring === "string" ? [docstring] : docstring;
	const result: string[] = [];

	for (const doc of docstrings) {
		const parts = doc.split("|");
		if (parts.length === 1) {
			// This may be a docstring to indicate only a single valid string literal option.
			const trimmed = doc.trim();
			if (reStringLiteral.test(trimmed)) {
				result.push(trimmed);
			}
		} else {
			for (const part of parts) {
				const trimmed = part.trim();
				if (reStringLiteral.test(trimmed)) {
					result.push(trimmed);
				}
			}
		}
	}

	return result;
}
