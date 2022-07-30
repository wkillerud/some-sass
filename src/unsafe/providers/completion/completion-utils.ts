import type { ScssMixin, ScssParameter } from '../../types/symbols';
import { asDollarlessVariable } from '../../utils/string';

export const rePrivate = /^\$?[_-].*$/;

/**
 * Return Mixin as string.
 */
export function makeMixinDocumentation(symbol: ScssMixin): string {
	const args = symbol.parameters.map(item => `${item.name}: ${item.value}`).join(', ');
	return `${symbol.name}(${args})`;
}

/**
 * Use the SnippetString syntax to provide smart completions of parameter names.
 */
export function mapParameterSnippet(p: ScssParameter, index: number): string {
	if (p.sassdoc?.type?.length) {
		const choices = parseStringLiteralChoices(p.sassdoc.type)
		if (choices.length) {
			return "${" + (index + 1) + "|" + choices.join(",") + "|}"
		}
	}

	return "${" + (index + 1) + ":" + asDollarlessVariable(p.name) + "}";
}

export function mapParameterSignature(p: ScssParameter): string {
	return p.value ? `${p.name}: ${p.value}` : p.name;
}

const reStringLiteral = /^["'].+["']$/; // yes, this will match 'foo", but let the parser deal with yelling about that.

/**
 * @param docstring A TypeScript-like string of accepted string literal values, for example `"standard" | "entrance" | "exit"`.
 */
export function parseStringLiteralChoices(docstring: string | string[]): string[] {
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
