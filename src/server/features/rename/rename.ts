import { TextDocument } from "vscode-languageserver-textdocument";
import {
	Range,
	SymbolKind,
	TextEdit,
	WorkspaceEdit,
} from "vscode-languageserver-types";
import { ISettings } from "../../settings";
import StorageService from "../../storage";
import { createCompletionContext } from "../completion/completion-context";
import { provideReferences } from "../references";

const defaultBehavior = { defaultBehavior: true };

export async function prepareRename(
	document: TextDocument,
	offset: number,
	storageService: StorageService,
	settings: ISettings,
): Promise<
	null | { defaultBehavior: boolean } | { range: Range; placeholder: string }
> {
	const scssDocument = storageService.get(document.uri);
	if (!scssDocument) {
		return defaultBehavior;
	}

	const context = createCompletionContext(
		scssDocument,
		scssDocument.getText(),
		offset,
		settings,
	);

	const referenceNode = scssDocument.getNodeAt(offset);
	if (!referenceNode || !referenceNode.type) {
		return defaultBehavior;
	}

	const range = scssDocument.getNodeRange(referenceNode);

	const references = await provideReferences(document, offset, storageService, {
		includeDeclaration: true,
	});

	if (!references) {
		if (context.import) {
			// No renaming prefixes since we can't find all the symbols.
			return null;
		}

		return defaultBehavior;
	}

	// Keep existing behavior for built-ins,
	// which is to rename each usage in the current document.
	if (references.references[0].isBuiltIn) {
		return defaultBehavior;
	}

	// Exclude the $ of the variable, since it's required.
	if (references.references[0].kind === SymbolKind.Variable) {
		range.start.character += 1;
	}

	// Exclude any forward-prefixes from the renaming.
	if (references.definition) {
		const renamingName = referenceNode.getText();
		const definitionName = references.definition.symbol.name;
		if (renamingName !== definitionName) {
			const diff = renamingName.length - definitionName.length;
			range.start.character += diff;
		}
	}

	return {
		range: range,
		placeholder: scssDocument.getText(range),
	};
}

export async function doRename(
	document: TextDocument,
	offset: number,
	storageService: StorageService,
	newName: string,
): Promise<null | WorkspaceEdit> {
	const references = await provideReferences(document, offset, storageService, {
		includeDeclaration: true,
	});
	if (!references) {
		return null;
	}

	const edits: WorkspaceEdit = {
		changes: {},
	};

	for (const { location, kind, name } of references.references) {
		/* eslint-disable @typescript-eslint/no-non-null-assertion */
		if (!edits.changes![location.uri]) {
			edits.changes![location.uri] = [];
		}
		/* eslint-enable @typescript-eslint/no-non-null-assertion */

		const range = location.range;

		// Exclude the $ of the variable, since it's required.
		if (kind === SymbolKind.Variable) {
			range.start.character = range.start.character + 1;
		}

		// Exclude any forward-prefixes from the renaming.
		if (references.definition) {
			const definitionName = references.definition.symbol.name;
			if (name !== definitionName) {
				const diff = name.length - definitionName.length;
				range.start.character += diff;
			}
		}

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		edits.changes![location.uri].push(TextEdit.replace(range, newName));
	}

	return edits;
}
