import { LanguageFeature } from "../language-feature";
import {
	TextDocument,
	Position,
	VariableDeclaration,
	getNodeAtOffset,
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

		const node = getNodeAtOffset(stylesheet, offset);
		if (!node) {
			return null;
		}
		if (!(node instanceof VariableDeclaration)) {
			return null;
		}
		const value = node.getValue();
		if (typeof value === "undefined") {
			return null;
		}

		const valueString = value.getText();
		const dollarIndex = valueString.indexOf("$");
		if (dollarIndex !== -1) {
			// If the variable at position references another variable,
			// find that variable's definition and look for the real value
			// there instead.
			const newPosition = document.positionAt(value.offset + dollarIndex + 1);
			const definition = await this.ls.findDefinition(document, newPosition);
			if (definition) {
				const newDocument = this._internal.cache.document(definition.uri);
				if (!newDocument) {
					return null;
				}
				return await this.internalFindValue(
					newDocument,
					newPosition,
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
