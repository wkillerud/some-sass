import {
	LanguageServiceOptions,
	TextDocument,
	LanguageService,
	LanguageServiceConfiguration,
	NodeType,
} from "@somesass/language-server-types";
import { LanguageService as VSCodeLanguageService } from "vscode-css-languageservice";

export type LanguageFeatureInternal = {
	scssLs: VSCodeLanguageService;
};

/**
 * Base class for features. Provides helpers to do the navigation
 * between modules.
 */
export abstract class LanguageFeature {
	ls;
	options;
	configuration: LanguageServiceConfiguration = {};

	/** @private */
	_internal: LanguageFeatureInternal;

	constructor(
		ls: LanguageService,
		options: LanguageServiceOptions,
		_internal: LanguageFeatureInternal,
	) {
		this.ls = ls;
		this.options = options;
		this._internal = _internal;
	}

	configure(configuration: LanguageServiceConfiguration): void {
		this.configuration = configuration;
		this._internal.scssLs.configure(configuration);
	}

	/**
	 * Helper to do some kind of lookup for the import tree of a document. Usually used to find the declaration of a symbol in the currently open document, but the callback can do whatever it likes.
	 *
	 * @param callback Gets called for each node in the import tree (may happen more than once for the same document).
	 * @param initialDocument The starting point, typically the document that gets passed to the language feature function.
	 * @param currentDocument The document that will be passed to the callback.
	 * @param accumulatedPrefix In case of prefixes in `@forward` statements, this field gathers up all prefixes.
	 * @param depth
	 * @returns The aggregated results of {@link callback}
	 */
	async traverseDocuments<T>(
		callback: (document: TextDocument, prefix?: string) => T[],
		initialDocument: TextDocument,
		currentDocument: TextDocument = initialDocument,
		accumulatedPrefix = "",
		depth = 0,
	): Promise<T[]> {
		const currentDocumentResult = callback(
			currentDocument,
			accumulatedPrefix ? accumulatedPrefix : undefined,
		);

		const allLinks = await this.ls.findDocumentLinks(currentDocument);

		// Filter out links we want to follow
		const links = allLinks.filter((link) => {
			if (link.kind === NodeType.Use) {
				// Don't follow uses beyond the first, since symbols from those aren't available to us anyway
				return depth === 0;
			}
			if (link.kind === NodeType.Import) {
				// Don't follow imports, since the whole point here is to use the new module system
				return false;
			}
			return true;
		});

		if (links.length === 0) {
			return currentDocumentResult;
		}

		const result = await Promise.all(
			links.map((link): Promise<T[]> => {
				if (!link.target || link.target === currentDocument.uri) {
					return Promise.resolve([]);
				}

				let prefix = accumulatedPrefix;
				if (link.as) {
					prefix += link.as;
				}

				return this.traverseDocuments(
					callback,
					initialDocument,
					currentDocument,
					prefix,
					depth + 1,
				);
			}),
		);

		return result.flat();
	}
}
