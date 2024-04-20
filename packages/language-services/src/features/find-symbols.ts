import { ParseResult } from "scss-sassdoc-parser";
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
		// While not IO-costly like findDocumentLinks, findDocumentSymbols is such a
		// hot path that the CPU time it takes to call findDocumentSymbols2 adds up.
		const cachedSymbols = this.cache.getCachedSymbols(document);
		if (cachedSymbols) return cachedSymbols;

		const stylesheet = this.ls.parseStylesheet(document);
		const symbols = this.getUpstreamLanguageServer().findDocumentSymbols2(
			document,
			stylesheet,
		) as SassDocumentSymbol[];

		const sassdoc: ParseResult[] = this.cache.getSassdoc(document);
		for (const doc of sassdoc) {
			switch (doc.context.type) {
				case "variable": {
					const symbol = symbols.find(
						(s) =>
							s.kind === SymbolKind.Variable &&
							s.name.replace("$", "") === doc.context.name,
					);
					if (symbol) symbol.sassdoc = doc;
					break;
				}
				case "mixin": {
					const symbol = symbols.find(
						(s) => s.kind === SymbolKind.Method && s.name === doc.context.name,
					);
					if (symbol) symbol.sassdoc = doc;
					break;
				}
				case "function": {
					const symbol = symbols.find(
						(s) =>
							s.kind === SymbolKind.Function && s.name === doc.context.name,
					);
					if (symbol) symbol.sassdoc = doc;
					break;
				}
				case "placeholder": {
					const symbol = symbols.find(
						(s) =>
							s.kind === SymbolKind.Class &&
							s.name.startsWith("%") &&
							s.name.substring(1) === doc.context.name,
					);
					if (symbol) symbol.sassdoc = doc;
					break;
				}
			}
		}

		this.cache.putCachedSymbols(document, symbols);

		return symbols;
	}

	findWorkspaceSymbols(query?: string): SymbolInformation[] {
		const documents = this.cache.documents();
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
