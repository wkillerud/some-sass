import { NodeType } from "@somesass/language-services";
import { getDefinition } from "../features/go-definition";
import { IScssDocument, ScssVariable } from "../parser";
import { getParentNodeByType } from "../parser/ast";

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
		// Really?
		return variable;
	}

	const node = scssDocument.getNodeAt(variable.offset);
	if (!node) {
		return variable;
	}

	const declaration = getParentNodeByType(node, NodeType.VariableDeclaration);
	if (!declaration) {
		return variable;
	}

	const value = declaration.getValue()?.getText();
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
