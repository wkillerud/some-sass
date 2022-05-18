'use strict';

import type { SymbolInformation } from 'vscode-languageserver';
import type StorageService from '../services/storage';

export async function searchWorkspaceSymbol(
	query: string,
	storage: StorageService,
	root: string
): Promise<SymbolInformation[]> {
	const workspaceSymbols: SymbolInformation[] = [];

	for (const scssDocument of storage.values()) {
		if (!scssDocument.uri.includes(root)) {
			continue;
		}

		for (const symbol of scssDocument.getSymbols()) {
			if (!symbol.name.includes(query) || symbol.position === undefined) {
				continue;
			}

			workspaceSymbols.push({
				name: symbol.name,
				kind: symbol.kind,
				location: {
					uri: scssDocument.uri,
					range: {
						start: symbol.position,
						end: {
							line: symbol.position.line,
							character: symbol.position.character + symbol.name.length
						}
					}
				}
			});
		}
	}

	return workspaceSymbols;
}
