import { LanguageFeature } from "../language-feature";
import {
	TextDocument,
	StylesheetDocumentLink,
	URI,
} from "../language-services-types";

export class FindDocumentLinks extends LanguageFeature {
	async findDocumentLinks(
		document: TextDocument,
	): Promise<StylesheetDocumentLink[]> {
		const cached = this.cache.getResolvedLinks(document);
		if (cached) return cached;

		const stylesheet = this.ls.parseStylesheet(document);
		const links = await this.getUpstreamLanguageServer().findDocumentLinks2(
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

		this.cache.putResolvedLinks(document, links);

		return links;
	}
}
