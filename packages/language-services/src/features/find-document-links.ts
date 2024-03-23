import { resolve } from "url";
import {
	LanguageServiceOptions,
	TextDocument,
	LanguageService,
	SassDocumentLink,
} from "@somesass/language-server-types";
import { LanguageFeature, LanguageFeatureInternal } from "../language-feature";
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

	findDocumentLinks(document: TextDocument): Promise<SassDocumentLink[]> {
		const stylesheet = this.ls.parseStylesheet(document);
		// TODO: extend with AST traversal to find stuff like "as", "show", and "hide"
		return this._internal.scssLs.findDocumentLinks2(
			document,
			stylesheet,
			this.#getDocumentContext(),
		);
	}
}
