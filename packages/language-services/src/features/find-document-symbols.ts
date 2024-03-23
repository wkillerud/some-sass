import {
	LanguageServiceOptions,
	LanguageService,
	TextDocument,
	SassDocumentSymbol,
	SymbolKind,
} from "@somesass/language-server-types";
import { ParseResult, parse } from "scss-sassdoc-parser";
import { LanguageFeature, LanguageFeatureInternal } from "../language-feature";

export class FindSymbols extends LanguageFeature {
	constructor(
		ls: LanguageService,
		options: LanguageServiceOptions,
		_internal: LanguageFeatureInternal,
	) {
		super(ls, options, _internal);
	}

	async findDocumentSymbols(
		document: TextDocument,
	): Promise<SassDocumentSymbol[]> {
		const symbols = this._internal.scssLs.findDocumentSymbols2(
			document,
			this.ls.parseStylesheet(document),
		) as SassDocumentSymbol[];

		if (symbols.length === 0) {
			return symbols;
		}

		let sassdoc: ParseResult[] = [];
		try {
			const text = document.getText();
			sassdoc = await parse(text);
		} catch {
			// do nothing
		}
		for (const symbol of symbols) {
			switch (symbol.kind) {
				case SymbolKind.Variable: {
					const dollarlessName = symbol.name.replace("$", "");
					const docs = sassdoc.find(
						(v) =>
							v.context.name === dollarlessName &&
							v.context.type === "variable",
					);
					symbol.sassdoc = docs;
					break;
				}

				case SymbolKind.Method: {
					// TODO: add AST traversal to add parameters as children if not already there, add sassdoc to parameters
					const docs = sassdoc.find(
						(v) => v.context.name === symbol.name && v.context.type === "mixin",
					);
					symbol.sassdoc = docs;
					break;
				}

				case SymbolKind.Function: {
					// TODO: add AST traversal to add parameters as children if not already there, add sassdoc to parameters
					const docs = sassdoc.find(
						(v) =>
							v.context.name === symbol.name && v.context.type === "function",
					);
					symbol.sassdoc = docs;
					break;
				}

				case SymbolKind.Class: {
					// TODO: AST traversal as indication whether it's a declaration or a usage, for placeholderUsages replacement
					if (symbol.name.startsWith("%")) {
						const sansPercent = symbol.name.substring(1);
						const docs = sassdoc.find(
							(v) =>
								v.context.name === sansPercent &&
								v.context.type === "placeholder",
						);
						symbol.sassdoc = docs;
					}
					break;
				}
			}
		}

		return symbols;
	}
}
