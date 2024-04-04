import { LanguageFeature } from "../language-feature";
import {
	TextDocument,
	Position,
	VariableDeclaration,
	getNodeAtOffset,
	Variable,
} from "../language-services-types";

// To avoid infinite loop for circular references
const MAX_VARIABLE_REFERENCE_LOOKUPS = 20;

export class FindValue extends LanguageFeature {
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
		if (depth > MAX_VARIABLE_REFERENCE_LOOKUPS) {
			return null;
		}
		const offset = document.offsetAt(position);
		const stylesheet = this.ls.parseStylesheet(document);

		const variable = getNodeAtOffset(stylesheet, offset);
		if (!(variable instanceof Variable)) {
			return null;
		}

		const parent = variable.getParent();
		if (parent instanceof VariableDeclaration) {
			return parent.getValue()?.getText() || null;
		}

		const valueString = variable.getText();
		const dollarIndex = valueString.indexOf("$");
		if (dollarIndex !== -1) {
			// If the variable at position references another variable,
			// find that variable's definition and look for the real value
			// there instead.
			const definition = await this.ls.findDefinition(document, position);
			if (definition) {
				const newDocument = this._internal.cache.getDocument(definition.uri);
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
