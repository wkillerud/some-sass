/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LanguageService as VSCodeLanguageService } from "@somesass/vscode-css-languageservice";
import { ParseResult, parseSync } from "scss-sassdoc-parser";
import {
	TextDocument,
	Stylesheet,
	LanguageModelCacheOptions,
	Node,
	StylesheetDocumentLink,
	SassDocumentSymbol,
} from "./language-services-types";

type LanguageModels = {
	[uri: string]: {
		version: number;
		languageId: string;
		cTime: number;
		languageModel: Stylesheet;
		document: TextDocument;
		sassdoc?: ParseResult[];
		symbols?: SassDocumentSymbol[];
		links?: StylesheetDocumentLink[];
	};
};

const defaultCacheEvictInterval = 0; // default off to not leave an interval running in case of unit tests

export class LanguageModelCache {
	#languageModels: LanguageModels = {};
	#nModels = 0;
	#options: LanguageModelCacheOptions & { sassLs: VSCodeLanguageService };
	#cleanupInterval: NodeJS.Timeout | undefined = undefined;

	constructor(
		options: LanguageModelCacheOptions & { sassLs: VSCodeLanguageService },
	) {
		this.#options = {
			maxEntries: 10_000,
			cleanupIntervalTimeInSeconds: defaultCacheEvictInterval,
			...options,
		};

		const intervalTime =
			typeof this.#options.cleanupIntervalTimeInSeconds === "undefined"
				? defaultCacheEvictInterval
				: this.#options.cleanupIntervalTimeInSeconds;
		if (intervalTime > 0) {
			this.#cleanupInterval = setInterval(() => {
				const cutoffTime = Date.now() - intervalTime * 1000;
				const uris = Object.keys(this.#languageModels);
				for (const uri of uris) {
					const languageModelInfo = this.#languageModels[uri];
					if (languageModelInfo.cTime < cutoffTime) {
						delete this.#languageModels[uri];
						this.#nModels--;
					}
				}
			}, intervalTime * 1000);
		}
	}

	get(document: TextDocument): Stylesheet {
		const version = document.version;
		const languageId = document.languageId;
		const languageModelInfo = this.#languageModels[document.uri];
		if (
			languageModelInfo &&
			languageModelInfo.version === version &&
			languageModelInfo.languageId === languageId
		) {
			languageModelInfo.cTime = Date.now();
			return languageModelInfo.languageModel;
		}
		const languageModel = this.#options.sassLs.parseStylesheet(
			document,
		) as Node;
		let sassdoc: ParseResult[] = [];
		try {
			const text = document.getText();
			sassdoc = parseSync(text);
		} catch {
			// do nothing
		}
		this.#languageModels[document.uri] = {
			languageModel,
			version,
			languageId,
			cTime: Date.now(),
			document,
			sassdoc,
			links: undefined,
		};
		if (!languageModelInfo) {
			this.#nModels++;
		}

		if (this.#nModels === this.#options.maxEntries) {
			let oldestTime = Number.MAX_VALUE;
			let oldestUri: string | null = null;
			for (const uri in this.#languageModels) {
				const languageModelInfo = this.#languageModels[uri];
				if (languageModelInfo.cTime < oldestTime) {
					oldestUri = uri;
					oldestTime = languageModelInfo.cTime;
				}
			}
			if (oldestUri) {
				delete this.#languageModels[oldestUri];
				this.#nModels--;
			}
		}
		return languageModel;
	}

	getDocument(uri: string): TextDocument | undefined {
		return this.#languageModels[uri]?.document;
	}

	getSassdoc(document: TextDocument): ParseResult[] {
		return this.#languageModels[document.uri]?.sassdoc || [];
	}

	documents(): TextDocument[] {
		return Object.values(this.#languageModels).map((cached) => cached.document);
	}

	has(uri: string) {
		return typeof this.#languageModels[uri] !== "undefined";
	}

	putResolvedLinks(
		document: TextDocument,
		links: StylesheetDocumentLink[],
	): void {
		if (this.has(document.uri)) {
			this.#languageModels[document.uri].links = links;
		}
	}

	getResolvedLinks(
		document: TextDocument,
	): StylesheetDocumentLink[] | undefined {
		if (this.has(document.uri)) {
			return this.#languageModels[document.uri].links;
		}
	}

	putCachedSymbols(
		document: TextDocument,
		symbols: SassDocumentSymbol[],
	): void {
		if (this.has(document.uri)) {
			this.#languageModels[document.uri].symbols = symbols;
		}
	}

	getCachedSymbols(document: TextDocument): SassDocumentSymbol[] | undefined {
		if (this.has(document.uri)) {
			return this.#languageModels[document.uri].symbols;
		}
	}

	onDocumentChanged(document: TextDocument) {
		const version = document.version;
		const languageId = document.languageId;
		const languageModel = this.#options.sassLs.parseStylesheet(
			document,
		) as Node;
		let sassdoc: ParseResult[] = [];
		try {
			const text = document.getText();
			sassdoc = parseSync(text);
		} catch {
			// do nothing
		}
		this.#languageModels[document.uri] = {
			languageModel,
			version,
			languageId,
			cTime: Date.now(),
			document,
			sassdoc,
			symbols: undefined,
			links: undefined,
		};
	}

	onDocumentRemoved(document: TextDocument | string) {
		// @ts-expect-error That's what I'm counting on
		const uri = document.uri || document;
		if (this.#languageModels[uri]) {
			delete this.#languageModels[uri];
			this.#nModels--;
		}
	}

	clearCache() {
		if (typeof this.#cleanupInterval !== "undefined") {
			clearInterval(this.#cleanupInterval);
			this.#cleanupInterval = undefined;
		}
		this.#languageModels = {};
		this.#nModels = 0;
	}
}
