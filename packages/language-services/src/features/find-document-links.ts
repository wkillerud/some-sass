import { resolve } from "url";
import { LanguageFeature, LanguageFeatureInternal } from "../language-feature";
import {
	LanguageServiceOptions,
	TextDocument,
	LanguageService,
	SassDocumentLink,
	URI,
} from "../language-services-types";
import { joinPath } from "../utils/resources";

export class FindLinks extends LanguageFeature {
	constructor(
		ls: LanguageService,
		options: LanguageServiceOptions,
		_internal: LanguageFeatureInternal,
	) {
		super(ls, options, _internal);
	}

	#getDocumentContext() {
		return {
			/**
			 * @param ref Resolve this path from the context of the document
			 * @returns The resolved path
			 */
			resolveReference: (ref: string, base: string) => {
				if (ref.startsWith("/") && this.configuration.workspaceRoot) {
					return joinPath(this.configuration.workspaceRoot.toString(), ref);
				}
				try {
					return resolve(base, ref);
				} catch (e) {
					return undefined;
				}
			},
		};
	}

	async findDocumentLinks(document: TextDocument): Promise<SassDocumentLink[]> {
		const stylesheet = this.ls.parseStylesheet(document);
		const links = await this._internal.scssLs.findDocumentLinks2(
			document,
			stylesheet,
			this.#getDocumentContext(),
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
