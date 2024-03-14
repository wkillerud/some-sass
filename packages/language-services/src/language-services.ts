import type {
	LanguageService,
	LanguageServiceOptions,
	TextDocument,
} from "@somesass/language-server-types";
import { SassLinkFinder } from "./feature/find-links";
import { SassSymbolFinder } from "./feature/find-symbols";
import { getLanguageModelCache } from "./language-model-cache";

export { getLanguageModelCache };

export function getLanguageService(
	options: LanguageServiceOptions,
): LanguageService {
	const linkFinder = new SassLinkFinder(options);
	const symbolFinder = new SassSymbolFinder(options);

	return {
		configure: (settings) => {
			linkFinder.configure(settings);
		},
		parseStylesheet: (document: TextDocument) =>
			options.languageModelCache.get(document),
		findDocumentLinks: linkFinder.findDocumentLinks.bind(linkFinder),
		findDocumentSymbols: symbolFinder.findDocumentSymbols.bind(symbolFinder),
	};
}
