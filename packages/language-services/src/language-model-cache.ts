/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {
	LanguageService,
	TextDocument,
	Stylesheet,
	LanguageServiceOptions,
	LanguageModelCacheOptions,
	INode,
} from "@somesass/language-server-types";
import { LanguageFeature, LanguageFeatureInternal } from "./language-feature";

type LanguageModels = {
	[uri: string]: {
		version: number;
		languageId: string;
		cTime: number;
		languageModel: Stylesheet;
	};
};

export class LanguageModelCache extends LanguageFeature {
	#languageModels: LanguageModels = {};
	#nModels = 0;
	#options: LanguageModelCacheOptions;
	#cleanupInterval: NodeJS.Timeout | undefined = undefined;

	constructor(
		ls: LanguageService,
		options: LanguageServiceOptions,
		_internal: LanguageFeatureInternal,
	) {
		super(ls, options, _internal);

		this.#options = {
			maxEntries: Number.MAX_SAFE_INTEGER,
			cleanupIntervalTimeInSeconds: 0,
			...options.languageModelCache,
		};

		const intervalTime = this.#options.cleanupIntervalTimeInSeconds || 0;
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
		const languageModel = this._internal.scssLs.parseStylesheet(
			document,
		) as INode;
		this.#languageModels[document.uri] = {
			languageModel,
			version,
			languageId,
			cTime: Date.now(),
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

	has(document: TextDocument) {
		return typeof this.#languageModels[document.uri] !== "undefined";
	}

	onDocumentChanged(document: TextDocument) {
		const version = document.version;
		const languageId = document.languageId;
		const languageModel = this._internal.scssLs.parseStylesheet(
			document,
		) as INode;
		this.#languageModels[document.uri] = {
			languageModel,
			version,
			languageId,
			cTime: Date.now(),
		};
	}

	onDocumentRemoved(document: TextDocument) {
		const uri = document.uri;
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
