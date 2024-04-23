import { getNodeAtOffset } from "@somesass/vscode-css-languageservice";
import {
	TextDocument,
	Position,
	WorkspaceEdit,
	NodeType,
	Range,
	SymbolKind,
	TextEdit,
} from "../language-services-types";
import { FindReferences } from "./find-references";

const defaultBehavior = { defaultBehavior: true };

export class DoRename extends FindReferences {
	async prepareRename(
		document: TextDocument,
		position: Position,
	): Promise<
		null | { defaultBehavior: boolean } | { range: Range; placeholder: string }
	> {
		const stylesheet = this.ls.parseStylesheet(document);
		const node = getNodeAtOffset(stylesheet, document.offsetAt(position));
		if (!node) return defaultBehavior;

		const references = await this.internalFindReferences(document, position, {
			includeDeclaration: true,
		});

		if (!references.references.length) {
			if (
				node.type === NodeType.Import ||
				node.type === NodeType.Forward ||
				node.type === NodeType.Use
			) {
				// No renaming prefixes since we can't find all the symbols
				return null;
			}

			return defaultBehavior;
		}

		// Keep existing behavior for built-ins,
		// which is to rename each usage in the current document.
		if (references.references[0].defaultBehavior) {
			return defaultBehavior;
		}

		const renameRange = Range.create(
			document.positionAt(node.offset),
			document.positionAt(node.end),
		);

		// Exclude the $ of the variable and % of the placeholder,
		// since they're required.
		if (
			references.references[0].kind === SymbolKind.Variable ||
			references.references[0].kind === SymbolKind.Class
		) {
			renameRange.start.character += 1;
		}

		// Exclude any forward-prefixes from the renaming.
		if (references.declaration) {
			const renamingName = node.getText();
			const definitionName = references.declaration.symbol.name;
			if (renamingName !== definitionName) {
				const diff = renamingName.length - definitionName.length;
				renameRange.start.character += diff;
			}
		}

		return {
			range: renameRange,
			placeholder: document.getText(renameRange),
		};
	}

	async doRename(
		document: TextDocument,
		position: Position,
		newName: string,
	): Promise<WorkspaceEdit | null> {
		const references = await this.internalFindReferences(document, position, {
			includeDeclaration: true,
		});

		if (!references.references.length) {
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

			// Exclude the $ of the variable and % of the placeholder,
			// since they're required.
			if (kind === SymbolKind.Variable || kind === SymbolKind.Class) {
				range.start.character = range.start.character + 1;
			}

			// Exclude any forward-prefixes from the renaming.
			if (references.declaration) {
				const definitionName = references.declaration.symbol.name;
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
}
