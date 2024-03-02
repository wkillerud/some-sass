import { MarkupContent, MarkupKind } from "vscode-languageserver";
import type {
	IScssDocument,
	ScssFunction,
	ScssMixin,
	ScssParameter,
} from "../../parser";
import { applySassDoc } from "../../utils/sassdoc";
import { asDollarlessVariable } from "../../utils/string";

export const rePrivate = /^\$?[_-].*$/;

export function makeMixinDocumentation(
	mixin: ScssMixin,
	sourceDocument: IScssDocument,
): MarkupContent {
	const args = mixin.parameters
		.map((item) => `${item.name}: ${item.value}`)
		.join(", ");

	const result = {
		kind: MarkupKind.Markdown,
		value: ["```scss", `@mixin ${mixin.name}(${args})`, "```"].join("\n"),
	};

	const sassdoc = applySassDoc(mixin);
	if (sassdoc) {
		result.value += `\n____\n${sassdoc}`;
	}

	result.value += `\n____\nMixin declared in ${sourceDocument.fileName}`;

	return result;
}

export function makeFunctionDocumentation(
	func: ScssFunction,
	sourceDocument: IScssDocument,
): MarkupContent {
	const args = func.parameters
		.map((item) => `${item.name}: ${item.value}`)
		.join(", ");

	const result = {
		kind: MarkupKind.Markdown,
		value: ["```scss", `@function ${func.name}(${args})`, "```"].join("\n"),
	};

	const sassdoc = applySassDoc(func);
	if (sassdoc) {
		result.value += `\n____\n${sassdoc}`;
	}

	result.value += `\n____\nFunction declared in ${sourceDocument.fileName}`;

	return result;
}

/**
 * Use the SnippetString syntax to provide smart completions of parameter names.
 */
export function mapParameterSnippet(p: ScssParameter, index: number): string {
	if (p.sassdoc?.type?.length) {
		const choices = parseStringLiteralChoices(p.sassdoc.type);
		if (choices.length > 0) {
			return `\${${index + 1}|${choices.join(",")}|}`;
		}
	}

	return `\${${index + 1}:${asDollarlessVariable(p.name)}}`;
}

export function mapParameterSignature(p: ScssParameter): string {
	return p.value ? `${p.name}: ${p.value}` : p.name;
}

const reStringLiteral = /^["'].+["']$/; // Yes, this will match 'foo", but let the parser deal with yelling about that.

/**
 * @param docstring A TypeScript-like string of accepted string literal values, for example `"standard" | "entrance" | "exit"`.
 */
export function parseStringLiteralChoices(
	docstring: string[] | string,
): string[] {
	const docstrings = typeof docstring === "string" ? [docstring] : docstring;
	const result: string[] = [];

	for (const doc of docstrings) {
		const parts = doc.split("|");
		if (parts.length === 1) {
			// This may be a docstring to indicate only a single valid string literal option.
			const trimmed = doc.trim();
			if (reStringLiteral.test(trimmed)) {
				result.push(trimmed);
			}
		} else {
			for (const part of parts) {
				const trimmed = part.trim();
				if (reStringLiteral.test(trimmed)) {
					result.push(trimmed);
				}
			}
		}
	}

	return result;
}
