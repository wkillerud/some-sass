import type { TextDocument } from "vscode-languageserver-textdocument";
import type { ISettings } from "../../settings";
import { getCurrentWord, getTextBeforePosition } from "../../utils/string";

type SupportedExtensions = "astro" | "scss" | "svelte" | "vue";

export interface CompletionContext {
	word: string;
	textBeforeWord: string;
	comment: boolean;
	sassDoc: boolean;
	namespace: string | null;
	import: boolean;
	variable: boolean;
	function: boolean;
	mixin: boolean;
	originalExtension: SupportedExtensions;
}

const rePropertyValue = /.*:\s*/;
const reEmptyPropertyValue = /.*:\s*$/;
const reQuotedValueInString = /["'](?:[^"'\\]|\\.)*["']/g;
const reMixinReference = /.*@include\s+(.*)/;
const reComment = /^.*(\/(\/|\*)|\*)/;
const reSassDoc = /^[\\s]*\/{3}.*$/;
const reQuotes = /["']/;
const rePartialModuleAtRule = /@(?:use|forward|import) ["']/;

/**
 * Check context for Variables suggestions.
 */
function checkVariableContext(
	word: string,
	isInterpolation: boolean,
	isPropertyValue: boolean,
	isEmptyValue: boolean,
	isQuotes: boolean,
	isNamespace: boolean,
): boolean {
	if (isPropertyValue && !isEmptyValue && !isQuotes) {
		if (isNamespace && word.endsWith(".")) {
			return true;
		}

		return word.includes("$");
	}

	if (isQuotes) {
		return isInterpolation;
	}

	return word.startsWith("$") || isInterpolation || isEmptyValue;
}

/**
 * Check context for Mixins suggestions.
 */
function checkMixinContext(
	textBeforeWord: string,
	isPropertyValue: boolean,
): boolean {
	return !isPropertyValue && reMixinReference.test(textBeforeWord);
}

/**
 * Check context for Function suggestions.
 */
function checkFunctionContext(
	textBeforeWord: string,
	isInterpolation: boolean,
	isPropertyValue: boolean,
	isEmptyValue: boolean,
	isQuotes: boolean,
	isNamespace: boolean,
	settings: ISettings,
): boolean {
	if (isPropertyValue && !isEmptyValue && !isQuotes) {
		if (isNamespace) {
			return true;
		}

		const lastChar = textBeforeWord.slice(-2, -2 + 1);
		return settings.suggestFunctionsInStringContextAfterSymbols.includes(
			lastChar,
		);
	}

	if (isQuotes) {
		return isInterpolation;
	}

	return false;
}

function isCommentContext(text: string): boolean {
	return reComment.test(text.trim());
}

function isSassDocContext(text: string): boolean {
	return reSassDoc.test(text);
}

function isInterpolationContext(text: string): boolean {
	return text.includes("#{");
}

function checkNamespaceContext(
	currentWord: string,
	isInterpolation: boolean,
): string | null {
	if (currentWord.length === 0 || !currentWord.includes(".")) {
		return null;
	}

	// Skip #{ if this is interpolation
	return currentWord.substring(
		isInterpolation ? 2 : 0,
		currentWord.indexOf("."),
	);
}

export function createCompletionContext(
	document: TextDocument,
	text: string,
	offset: number,
	settings: ISettings,
): CompletionContext {
	const currentWord = getCurrentWord(text, offset);
	const textBeforeWord = getTextBeforePosition(text, offset);

	const isImport = rePartialModuleAtRule.test(textBeforeWord);

	// Is "#{INTERPOLATION}"
	const isInterpolation = isInterpolationContext(currentWord);

	// Information about current position
	const isPropertyValue = rePropertyValue.test(textBeforeWord);
	const isEmptyValue = reEmptyPropertyValue.test(textBeforeWord);
	const isQuotes = reQuotes.test(
		textBeforeWord.replace(reQuotedValueInString, ""),
	);

	// Is namespace, e.g. `namespace.$var` or `@include namespace.mixin` or `namespace.func()`
	const namespace = checkNamespaceContext(currentWord, isInterpolation);

	const lastDot = document.uri.lastIndexOf(".");
	const originalExtension = document.uri.slice(
		Math.max(0, lastDot + 1),
	) as SupportedExtensions;

	return {
		word: currentWord,
		textBeforeWord,
		comment: isCommentContext(textBeforeWord),
		sassDoc: isSassDocContext(textBeforeWord),
		namespace,
		import: isImport,
		variable: checkVariableContext(
			currentWord,
			isInterpolation,
			isPropertyValue,
			isEmptyValue,
			isQuotes,
			Boolean(namespace),
		),
		function: checkFunctionContext(
			textBeforeWord,
			isInterpolation,
			isPropertyValue,
			isEmptyValue,
			isQuotes,
			Boolean(namespace),
			settings,
		),
		mixin: checkMixinContext(textBeforeWord, isPropertyValue),
		originalExtension,
	};
}
