import { resolve } from "url";
import {
	getNodeAtOffset,
	LanguageService as VSCodeLanguageService,
	Scanner,
	SCSSScanner,
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
	Location,
	Position,
	Variable,
	VariableDeclaration,
	URI,
} from "./language-services-types";
import { joinPath } from "./utils/resources";
import { asDollarlessVariable } from "./utils/sass";

export type LanguageFeatureInternal = {
	cache: LanguageModelCache;
	sassLs: VSCodeLanguageService;
};

type FindOptions = {
	/**
	 * Whether to stop searching if the callback returns a truthy response.
	 * @default false
	 */
	lazy: boolean;
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

	private _internal: LanguageFeatureInternal;

	protected get cache(): LanguageModelCache {
		return this._internal.cache;
	}

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
			...configuration,
			completionSettings: {
				...defaultConfiguration.completionSettings,
				...configuration.completionSettings,
				triggerPropertyValueCompletion:
					configuration.completionSettings?.triggerPropertyValueCompletion ||
					false,
			},
		};
		this._internal.sassLs.configure(configuration);
	}

	protected getUpstreamLanguageServer(): VSCodeLanguageService {
		return this._internal.sassLs;
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
		const scanner = new SCSSScanner({
			syntax: document.languageId === "sass" ? "indented" : "scss",
		});
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
		options: FindOptions = { lazy: false },
	): Promise<T[]> {
		return this.internalFindInWorkspace(callback, initialDocument, options);
	}

	private async internalFindInWorkspace<T>(
		callback: (
			document: TextDocument,
			prefix: string,
			hide: string[],
			show: string[],
		) => T | T[] | undefined | Promise<T | T[] | undefined>,
		initialDocument: TextDocument,
		options: FindOptions,
		currentDocument: TextDocument = initialDocument,
		accumulatedPrefix = "",
		hide: string[] = [],
		show: string[] = [],
		visited = new Set<string>(),
		depth = 0,
	): Promise<T[]> {
		if (visited.has(currentDocument.uri)) return [];

		const callbackResult = await callback(
			currentDocument,
			accumulatedPrefix,
			hide,
			show,
		);

		visited.add(currentDocument.uri);

		if (options.lazy && callbackResult)
			return Array.isArray(callbackResult) ? callbackResult : [callbackResult];

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

			let next = this.cache.getDocument(link.target!);
			if (!next) {
				try {
					// If the linked document hasn't been parsed yet, create a TextDocument
					const content = await this.options.fileSystemProvider.readFile(
						URI.parse(link.target),
					);
					const originalExt = link.target.slice(
						Math.max(0, link.target.lastIndexOf(".") + 1),
					);
					next = TextDocument.create(link.target, originalExt, 1, content);
					this.ls.parseStylesheet(next); // add it to the cache
				} catch {
					continue;
				}
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
				options,
				next,
				prefix,
				hide,
				show,
				visited,
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

	protected isSamePosition(a: Position, b: Position): boolean {
		return a.line === b.line && a.character === b.character;
	}

	protected async findDefinitionSymbol(
		definition: Location,
		name: string,
	): Promise<SassDocumentSymbol | null> {
		const definitionDocument = this.cache.getDocument(definition.uri);
		if (definitionDocument) {
			const dollarlessName = asDollarlessVariable(name);
			const symbols = this.ls.findDocumentSymbols(definitionDocument);
			for (const symbol of symbols) {
				if (
					dollarlessName.includes(asDollarlessVariable(symbol.name)) &&
					this.isSamePosition(
						definition.range.start,
						symbol.selectionRange.start,
					)
				) {
					return symbol;
				}
			}
		}

		return null;
	}

	protected getFileName(uri: string): string {
		const lastSlash = uri.lastIndexOf("/");
		return lastSlash === -1 ? uri : uri.slice(Math.max(0, lastSlash + 1));
	}

	/**
	 * Looks at {@link position} for a {@link VariableDeclaration} and returns its value as a string (or null if no value was found).
	 * If the value is a reference to another variable this method will find that variable's definition and look for the value there instead.
	 *
	 * If the value is not found in 10 lookups, assumes a circular reference and returns null.
	 */
	async findValue(
		document: TextDocument,
		position: Position,
	): Promise<string | null> {
		return this.internalFindValue(document, position);
	}

	private async internalFindValue(
		document: TextDocument,
		position: Position,
		depth = 0,
	): Promise<string | null> {
		const MAX_VARIABLE_REFERENCE_LOOKUPS = 10;
		if (depth > MAX_VARIABLE_REFERENCE_LOOKUPS) {
			return null;
		}
		const stylesheet = this.ls.parseStylesheet(document);

		const offset = document.offsetAt(position);
		const variable = getNodeAtOffset(stylesheet, offset);
		if (!(variable instanceof Variable)) {
			return null;
		}

		const parent = variable.getParent();
		if (parent instanceof VariableDeclaration) {
			return parent.getValue()?.getText() || null;
		}

		const valueString = variable.getText();
		const dollarIndex = valueString.indexOf("$"); // is this always true in indented?
		if (dollarIndex !== -1) {
			// If the variable at position references another variable,
			// find that variable's definition and look for the real value
			// there instead.
			const definition = await this.ls.findDefinition(document, position);
			if (definition) {
				const newDocument = this.cache.getDocument(definition.uri);
				if (!newDocument) {
					return null;
				}
				return await this.internalFindValue(
					newDocument,
					definition.range.start,
					depth + 1,
				);
			} else {
				return null;
			}
		} else {
			return valueString;
		}
	}
}
