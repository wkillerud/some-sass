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
	return "${" + (index + 1) + ":" + asDollarlessVariable(p.name) + "}";
}

export function mapParameterSignature(p: ScssParameter): string {
	return p.value ? `${p.name}: ${p.value}` : p.name;
}
