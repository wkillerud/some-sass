import { SassNavigation } from "./feature/navigation";
import type {
	LanguageService,
	LanguageServiceOptions,
} from "./language-services-types";
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
