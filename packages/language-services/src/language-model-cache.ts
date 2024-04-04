/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LanguageService as VSCodeLanguageService } from "@somesass/vscode-css-languageservice";
import {
	TextDocument,
	Stylesheet,
	LanguageModelCacheOptions,
	Node,
	SassDocumentLink,
} from "./language-services-types";

type LanguageModels = {
	[uri: string]: {
		version: number;
		languageId: string;
		cTime: number;
		languageModel: Stylesheet;
		document: TextDocument;
		links?: SassDocumentLink[];
	};
};

const defaultCacheEvictInterval = 360; // five minutes

export class LanguageModelCache {
	#languageModels: LanguageModels = {};
	#nModels = 0;
	#options: LanguageModelCacheOptions & { scssLs: VSCodeLanguageService };
	#cleanupInterval: NodeJS.Timeout | undefined = undefined;

	constructor(
		options: LanguageModelCacheOptions & { scssLs: VSCodeLanguageService },
	) {
		this.#options = {
			maxEntries: 10_000,
			cleanupIntervalTimeInSeconds: defaultCacheEvictInterval,
			...options,
		};

		const intervalTime =
			this.#options.cleanupIntervalTimeInSeconds || defaultCacheEvictInterval;
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
		const languageModel = this.#options.scssLs.parseStylesheet(
			document,
		) as Node;
		this.#languageModels[document.uri] = {
			languageModel,
			version,
			languageId,
			cTime: Date.now(),
			document,
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

	documents(): TextDocument[] {
		return Object.values(this.#languageModels).map((cached) => cached.document);
	}

	has(document: TextDocument) {
		return typeof this.#languageModels[document.uri] !== "undefined";
	}

	putResolvedLinks(document: TextDocument, links: SassDocumentLink[]): void {
		if (this.has(document)) {
			this.#languageModels[document.uri].links = links;
		}
	}

	getResolvedLinks(document: TextDocument): SassDocumentLink[] | undefined {
		if (this.has(document)) {
			return this.#languageModels[document.uri].links;
		}
	}

	onDocumentChanged(document: TextDocument) {
		const version = document.version;
		const languageId = document.languageId;
		const languageModel = this.#options.scssLs.parseStylesheet(
			document,
		) as Node;
		this.#languageModels[document.uri] = {
			languageModel,
			version,
			languageId,
			cTime: Date.now(),
			document,
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
