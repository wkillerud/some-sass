import type {
	LanguageService,
	LanguageServiceOptions,
} from "@somesass/language-server-types";
import { SassLinkFinder } from "./feature/find-links";
import { parseStylesheet } from "./parser";

export function getLanguageService(
	options: LanguageServiceOptions = {},
): LanguageService {
	const linkFinder = new SassLinkFinder(options);

	return {
		configure: (settings) => {
			linkFinder.configure(settings?.importAliases);
		},
		parseStylesheet,
		findDocumentLinks: linkFinder.findDocumentLinks.bind(linkFinder),
	};
}
