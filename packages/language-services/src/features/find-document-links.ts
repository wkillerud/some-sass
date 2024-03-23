import { resolve } from "url";
import { LanguageFeature, LanguageFeatureInternal } from "../language-feature";
import {
	LanguageServiceOptions,
	TextDocument,
	LanguageService,
	SassDocumentLink,
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
		const stylesheet = await this.ls.parseStylesheet(document);
		return this._internal.scssLs.findDocumentLinks2(
			document,
			stylesheet,
			this.#getDocumentContext(),
		);
	}
}
