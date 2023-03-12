import type { SymbolInformation } from "vscode-languageserver";
import { useContext } from "../../context-provider";

export async function searchWorkspaceSymbol(
	query: string,
	root: string,
): Promise<SymbolInformation[]> {
	const workspaceSymbols: SymbolInformation[] = [];
	const { storage } = useContext();
	for (const scssDocument of storage.values()) {
		if (!scssDocument.uri.includes(root)) {
			continue;
		}

		for (const symbol of scssDocument.getSymbols()) {
			if (symbol.position === undefined || !symbol.name.includes(query)) {
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
							character: symbol.position.character + symbol.name.length,
						},
					},
				},
			});
		}
	}

	return workspaceSymbols;
}
