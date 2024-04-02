import { resolve } from "url";
import {
	SCSSScanner,
	Scanner,
	LanguageService as VSCodeLanguageService,
	VariableDeclaration,
	getNodeAtOffset,
} from "@somesass/vscode-css-languageservice";
import { LanguageModelCache } from "./language-model-cache";
import {
	LanguageServiceOptions,
	TextDocument,
	LanguageService,
	LanguageServiceConfiguration,
	NodeType,
	Range,
	SassDocumentSymbol,
} from "./language-services-types";
import { joinPath } from "./utils/resources";

export type LanguageFeatureInternal = {
	cache: LanguageModelCache;
	scssLs: VSCodeLanguageService;
};

const defaultConfiguration: LanguageServiceConfiguration = {
	completionSettings: {
		triggerPropertyValueCompletion: false,
		completePropertyWithSemicolon: false,
		suggestAllFromOpenDocument: false,
		suggestFromUseOnly: false,
		suggestFunctionsInStringContextAfterSymbols: " (+-*%",
		suggestionStyle: "all",
	},
};

/**
 * Base class for features. Provides helpers to do the navigation
 * between modules.
 */
export abstract class LanguageFeature {
	protected ls;
	protected options;
	protected configuration: LanguageServiceConfiguration = {};

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
		this.configuration = {
			...defaultConfiguration,
			completionSettings: {
				...defaultConfiguration.completionSettings,
				...configuration.completionSettings,
				triggerPropertyValueCompletion:
					configuration.completionSettings?.triggerPropertyValueCompletion ||
					false,
			},
		};
		this._internal.scssLs.configure(configuration);
	}

	protected getDocumentContext() {
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

	/**
	 * Get the scanner implementation for the document's syntax.
	 * @param document This document's text will be set as the scanner source
	 * @param range Optional range passed to {@link TextDocument.getText}
	 */
	protected getScanner(document: TextDocument, range?: Range): Scanner {
		const scanner = new SCSSScanner();
		scanner.ignoreComment = false;
		scanner.setSource(document.getText(range));
		return scanner;
	}

	/**
	 * Helper to do some kind of lookup for the import tree of a document.
	 * Usually used to find the declaration of a symbol in the currently open document, but the callback can do whatever it likes.
	 *
	 * @param callback Gets called for each node in the import tree (may happen more than once for the same document). Return undefined if the callback should not add to the results.
	 * @param initialDocument The starting point, typically the document that gets passed to the language feature function.
	 * @returns The aggregated results of {@link callback}
	 */
	protected async findInWorkspace<T>(
		callback: (
			document: TextDocument,
			prefix: string,
			hide: string[],
			show: string[],
		) => T | T[] | undefined | Promise<T | T[] | undefined>,
		initialDocument: TextDocument,
	): Promise<T[]> {
		// TODO: keep track of visits and skip processing the same document multiple times
		// one, it's good sense. two, it avoids duplicate suggestions in do-complete.
		return this.internalFindInWorkspace(callback, initialDocument);
	}

	private async internalFindInWorkspace<T>(
		callback: (
			document: TextDocument,
			prefix: string,
			hide: string[],
			show: string[],
		) => T | T[] | undefined | Promise<T | T[] | undefined>,
		initialDocument: TextDocument,
		currentDocument: TextDocument = initialDocument,
		accumulatedPrefix = "",
		hide: string[] = [],
		show: string[] = [],
		depth = 0,
	): Promise<T[]> {
		const callbackResult = await callback(
			currentDocument,
			accumulatedPrefix,
			hide,
			show,
		);

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

		let result: T[] = [];
		for (const link of links) {
			if (!link.target || link.target === currentDocument.uri) {
				continue;
			}

			const next = this._internal.cache.document(link.target!);
			if (!next) {
				continue;
			}

			let prefix = accumulatedPrefix;
			if (link.type === NodeType.Forward) {
				if (link.as) {
					prefix += link.as;
				}
				if (link.hide) {
					hide.push(...link.hide);
				}
				if (link.show) {
					show.push(...link.show);
				}
			}

			const linkResult = await this.internalFindInWorkspace(
				callback,
				initialDocument,
				next,
				prefix,
				hide,
				show,
				depth + 1,
			);
			result = result.concat(linkResult);
		}

		return result;
	}

	protected getVariableValue(
		document: TextDocument,
		variable: SassDocumentSymbol,
	): string | null {
		const offset = document.offsetAt(variable.selectionRange.start);
		const stylesheet = this.ls.parseStylesheet(document);
		const node = getNodeAtOffset(stylesheet, offset);
		if (node === null) {
			return null;
		}
		const parent = node.getParent();
		if (!parent) {
			return null;
		}
		if (parent instanceof VariableDeclaration) {
			return parent.getValue()?.getText() || null;
		}
		return null;
	}

	protected getFileName(document: TextDocument): string {
		const uri = document.uri;
		const lastSlash = uri.lastIndexOf("/");
		return lastSlash === -1 ? uri : uri.slice(Math.max(0, lastSlash + 1));
	}
}
