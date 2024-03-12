/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {
	TextDocument,
	LanguageModelCache,
	Stylesheet,
} from "@somesass/language-server-types";
import { parseStylesheet } from "./parser";

export function getLanguageModelCache(
	maxEntries: number = Number.MAX_SAFE_INTEGER,
	cleanupIntervalTimeInSec: number = 0,
): LanguageModelCache {
	let languageModels: {
		[uri: string]: {
			version: number;
			languageId: string;
			cTime: number;
			languageModel: Stylesheet;
		};
	} = {};
	let nModels = 0;

	let cleanupInterval: NodeJS.Timeout | undefined = undefined;
	if (cleanupIntervalTimeInSec > 0) {
		cleanupInterval = setInterval(() => {
			const cutoffTime = Date.now() - cleanupIntervalTimeInSec * 1000;
			const uris = Object.keys(languageModels);
			for (const uri of uris) {
				const languageModelInfo = languageModels[uri];
				if (languageModelInfo.cTime < cutoffTime) {
					delete languageModels[uri];
					nModels--;
				}
			}
		}, cleanupIntervalTimeInSec * 1000);
	}

	return {
		get(document: TextDocument): Stylesheet {
			const version = document.version;
			const languageId = document.languageId;
			const languageModelInfo = languageModels[document.uri];
			if (
				languageModelInfo &&
				languageModelInfo.version === version &&
				languageModelInfo.languageId === languageId
			) {
				languageModelInfo.cTime = Date.now();
				return languageModelInfo.languageModel;
			}
			const languageModel = parseStylesheet(document);
			languageModels[document.uri] = {
				languageModel,
				version,
				languageId,
				cTime: Date.now(),
			};
			if (!languageModelInfo) {
				nModels++;
			}

			if (nModels === maxEntries) {
				let oldestTime = Number.MAX_VALUE;
				let oldestUri = null;
				for (const uri in languageModels) {
					const languageModelInfo = languageModels[uri];
					if (languageModelInfo.cTime < oldestTime) {
						oldestUri = uri;
						oldestTime = languageModelInfo.cTime;
					}
				}
				if (oldestUri) {
					delete languageModels[oldestUri];
					nModels--;
				}
			}
			return languageModel;
		},
		has(document: TextDocument) {
			return typeof languageModels[document.uri] !== "undefined";
		},
		onDocumentChanged(document: TextDocument) {
			const version = document.version;
			const languageId = document.languageId;
			const languageModel = parse(document);
			languageModels[document.uri] = {
				languageModel,
				version,
				languageId,
				cTime: Date.now(),
			};
		},
		onDocumentRemoved(document: TextDocument) {
			const uri = document.uri;
			if (languageModels[uri]) {
				delete languageModels[uri];
				nModels--;
			}
		},
		entries() {
			return Object.entries(languageModels).map(([key, { languageModel }]) => [
				key,
				languageModel,
			]);
		},
		clear() {
			if (typeof cleanupInterval !== "undefined") {
				clearInterval(cleanupInterval);
				cleanupInterval = undefined;
			}
			languageModels = {};
			nModels = 0;
		},
	};
}
