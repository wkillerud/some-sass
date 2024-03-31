import { LanguageFeature, LanguageFeatureInternal } from "../language-feature";
import {
	LanguageServiceOptions,
	TextDocument,
	LanguageService,
	SassDocumentLink,
	URI,
} from "../language-services-types";

export class FindDocumentLinks extends LanguageFeature {
	constructor(
		ls: LanguageService,
		options: LanguageServiceOptions,
		_internal: LanguageFeatureInternal,
	) {
		super(ls, options, _internal);
	}

	async findDocumentLinks(document: TextDocument): Promise<SassDocumentLink[]> {
		const stylesheet = this.ls.parseStylesheet(document);
		// TODO: this IO stuff really ought to be cached similarly to the parsed stylesheet
		const links = await this._internal.scssLs.findDocumentLinks2(
			document,
			stylesheet,
			this.getDocumentContext(),
		);
		for (const link of links) {
			if (link.target && !link.target.includes("sass:")) {
				// For monorepos, resolve the real path behind a symlink, since multiple links in `node_modules/` can point to the same file.
				// Take this initial performance hit to maximise cache hits and provide better results for projects using symlinks.
				const realpath = await this.options.fileSystemProvider.realPath(
					URI.parse(link.target),
				);
				link.target = realpath.toString();
			}
		}
		return links;
	}
}
