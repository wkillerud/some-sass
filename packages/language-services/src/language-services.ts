import type {
	LanguageService,
	LanguageServiceOptions,
} from "@somesass/language-server-types";
import { SassNavigation } from "./feature/navigation";
import { parseStylesheet } from "./parser";

export function getLanguageService(
	options: LanguageServiceOptions = {},
): LanguageService {
	const navigation = new SassNavigation(options);

	return {
		configure: (settings) => {
			navigation.configure(settings?.importAliases);
		},
		parseStylesheet,
		findDocumentLinks: navigation.findDocumentLinks.bind(navigation),
	};
}
