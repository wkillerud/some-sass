import { SyntaxNodeType } from "@somesass/language-server-types";
import { getDefinition } from "../features/go-definition";
import { IScssDocument, ScssVariable } from "../parser";

export function isReferencingVariable(variable: ScssVariable): boolean {
	if (!variable.value) {
		return false;
	}
	return variable.value.startsWith("$") || variable.value.includes(".$");
}

export function getBaseValueFrom(
	variable: ScssVariable,
	scssDocument: IScssDocument,
	depth = 0,
): ScssVariable {
	if (depth > 10) {
		// Break out of what I assume is a circular reference at this point
		return variable;
	}

	const node = scssDocument.getNodeAt(variable.offset);
	if (!node) {
		return variable;
	}

	let isDeclaration = false;
	const cursor = node.cursor();
	do {
		if (cursor.type.name === SyntaxNodeType.StyleSheet) {
			break;
		}
		if (cursor.type.name === SyntaxNodeType.Declaration) {
			isDeclaration = true;
			break;
		}
	} while (cursor.parent());

	if (!isDeclaration) {
		return variable;
	}

	const value = variable.value;
	if (!value) {
		return variable;
	}

	const referenceOffset =
		variable.offset + variable.name.length + value.indexOf("$") + 2;

	const referenceNode = scssDocument.getNodeAt(referenceOffset);
	if (!referenceNode) {
		return variable;
	}

	const result = getDefinition(scssDocument.textDocument, referenceOffset);
	if (!result) {
		return variable;
	}

	const [definition, definitionDocument] = result;
	if (isReferencingVariable(definition as ScssVariable)) {
		return getBaseValueFrom(
			definition as ScssVariable,
			definitionDocument,
			(depth += 1),
		);
	}

	return definition as ScssVariable;
}
