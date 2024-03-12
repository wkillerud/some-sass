import { TextDocument } from "@somesass/language-server-types";

// Workspace traversal must take place in the server, which is the only one
// who knows where everything is.
// TODO: This should probably take a function, a la reduce
export function traverseWorkspace<T extends []>(
	openDocument: TextDocument,
	childDocument: TextDocument = openDocument,
	result: T,
	accumulatedPrefix = "",
	depth = 0,
): T[] {
	// const { storage } = useContext();
	// const scssDocument = storage.get(childDocument.uri);
	// if (!scssDocument) {
		// return result;
	// }

	const symbols =

	for (const symbol of scssDocument.getSymbols()) {
		// Placeholders are not namespaced the same way other symbols are
		if (symbol.kind === SymbolKind.Class) {
			result.push({
				...symbol,
				name: symbol.name,
			});
			continue;
		}

		// The symbol may have a prefix in the open document, so we need to add it here
		// so we can compare apples to apples later on.
		let symbolName = `${accumulatedPrefix}${asDollarlessVariable(symbol.name)}`;
		if (symbol.kind === SymbolKind.Variable) {
			symbolName = `$${symbolName}`;
		}

		result.push({
			...symbol,
			name: symbolName,
		});
	}

	// Check to see if we have to go deeper
	// Don't follow uses beyond the first, since symbols from those aren't available to us anyway
	// Don't follow imports, since the whole point here is to use the new module system
	for (const child of scssDocument.getLinks({
		uses: depth === 0,
		imports: false,
	})) {
		if (!child.link.target || child.link.target === scssDocument.uri) {
			continue;
		}

		const childDocument = storage.get(child.link.target);
		if (!childDocument) {
			continue;
		}

		let prefix = accumulatedPrefix;
		if ((child as ScssForward).prefix) {
			prefix += (child as ScssForward).prefix;
		}

		traverseTree(openDocument, childDocument, result, prefix, depth + 1);
	}

	return result;
}
