import { ParseResult, parseSync } from "scss-sassdoc-parser";
import { LanguageFeature } from "../language-feature";
import {
	TextDocument,
	SassDocumentSymbol,
	SymbolKind,
	SymbolInformation,
	Location,
} from "../language-services-types";

export class FindSymbols extends LanguageFeature {
	findDocumentSymbols(document: TextDocument): SassDocumentSymbol[] {
		const stylesheet = this.ls.parseStylesheet(document);
		const symbols = this._internal.scssLs.findDocumentSymbols2(
			document,
			stylesheet,
		) as SassDocumentSymbol[];

		if (symbols.length === 0) {
			return symbols;
		}

		let sassdoc: ParseResult[] = [];
		try {
			const text = document.getText();
			sassdoc = parseSync(text);
		} catch {
			// do nothing
		}

		if (sassdoc.length === 0) {
			return symbols;
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
					const docs = sassdoc.find(
						(v) => v.context.name === symbol.name && v.context.type === "mixin",
					);
					symbol.sassdoc = docs;
					break;
				}

				case SymbolKind.Function: {
					const docs = sassdoc.find(
						(v) =>
							v.context.name === symbol.name && v.context.type === "function",
					);
					symbol.sassdoc = docs;
					break;
				}

				case SymbolKind.Class: {
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

	findWorkspaceSymbols(query?: string): SymbolInformation[] {
		const documents = this._internal.cache.documents();
		const result: SymbolInformation[] = [];
		for (const document of documents) {
			const symbols = this.findDocumentSymbols(document);
			for (const symbol of symbols) {
				if (query && !symbol.name.includes(query)) {
					continue;
				}
				result.push({
					name: symbol.name,
					kind: symbol.kind,
					location: Location.create(document.uri, symbol.selectionRange),
				});
			}
		}
		return result;
	}
}
