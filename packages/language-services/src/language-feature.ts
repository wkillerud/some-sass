import { LanguageService as VSCodeLanguageService } from "@somesass/vscode-css-languageservice";
import { LanguageModelCache } from "./language-model-cache";
import {
	LanguageServiceOptions,
	TextDocument,
	LanguageService,
	LanguageServiceConfiguration,
	NodeType,
} from "./language-services-types";

export type LanguageFeatureInternal = {
	cache: LanguageModelCache;
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
	protected _internal: LanguageFeatureInternal;

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
	 * Helper to do some kind of lookup for the import tree of a document.
	 * Usually used to find the declaration of a symbol in the currently open document, but the callback can do whatever it likes.
	 *
	 * @param callback Gets called for each node in the import tree (may happen more than once for the same document). Return undefined if the callback should not add to the results.
	 * @param initialDocument The starting point, typically the document that gets passed to the language feature function.
	 * @returns The aggregated results of {@link callback}
	 */
	async findInWorkspace<T>(
		callback: (document: TextDocument, prefix: string) => T | T[] | undefined,
		initialDocument: TextDocument,
	): Promise<T[]> {
		return this.internalFindInWorkspace(callback, initialDocument);
	}

	private async internalFindInWorkspace<T>(
		callback: (document: TextDocument, prefix: string) => T | T[] | undefined,
		initialDocument: TextDocument,
		currentDocument: TextDocument = initialDocument,
		accumulatedPrefix = "",
		depth = 0,
	): Promise<T[]> {
		const callbackResult = callback(currentDocument, accumulatedPrefix);

		const allLinks = await this.ls.findDocumentLinks(currentDocument);

		// Filter out links we want to follow
		const links = allLinks.filter((link) => {
			if (link.type === NodeType.Use) {
				// Don't follow uses beyond the first, since symbols from those aren't available to us anyway
				return depth === 0;
			}
			if (link.type === NodeType.Import) {
				// Don't follow imports, since the whole point here is to use the new module system
				return false;
			}
			return true;
		});

		if (links.length === 0) {
			if (typeof callbackResult === "undefined") {
				return [];
			}
			return Array.isArray(callbackResult) ? callbackResult : [callbackResult];
		}

		const result: T[] = [];
		for (const link of links) {
			if (!link.target || link.target === currentDocument.uri) {
				continue;
			}

			const next = this._internal.cache.document(link.target!);
			if (!next) {
				continue;
			}

			let prefix = accumulatedPrefix;
			if (link.as) {
				prefix += link.as;
			}

			return this.internalFindInWorkspace(
				callback,
				initialDocument,
				next,
				prefix,
				depth + 1,
			);
		}

		return result;
	}
}
