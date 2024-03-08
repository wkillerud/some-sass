import type {
	LanguageService,
	LanguageServiceOptions,
} from "@somesass/language-server-types";
import { SassLinkFinder } from "./feature/find-links";
import { SassSymbolFinder } from "./feature/find-symbols";
import { parseStylesheet } from "./parser";

export function getLanguageService(
	options: LanguageServiceOptions = {},
): LanguageService {
	const linkFinder = new SassLinkFinder(options);
	const symbolFinder = new SassSymbolFinder();

	return {
		configure: (settings) => {
			linkFinder.configure(settings?.importAliases);
		},
		parseStylesheet,
		findDocumentLinks: linkFinder.findDocumentLinks.bind(linkFinder),
		findDocumentSymbols: symbolFinder.findDocumentSymbols.bind(symbolFinder),
	};
}
