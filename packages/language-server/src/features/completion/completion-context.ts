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
	placeholder: boolean;
	placeholderDeclaration: boolean;
}

const reReturn = /^.*@return/;
const rePropertyValue = /.*:\s*/;
const reEmptyPropertyValue = /.*:\s*$/;
const reQuotedValueInString = /["'](?:[^"'\\]|\\.)*["']/g;
const reMixinReference = /.*@include\s+(.*)/;
const reComment = /^(.*\/\/|.*\/\*|\s*\*)/;
const reSassDoc = /^[\\s]*\/{3}.*$/;
const reQuotes = /["']/;
const rePlaceholder = /@extend\s+%/;
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
	isReturn: boolean,
	isNamespace: boolean,
): boolean {
	if ((isReturn || isPropertyValue) && !isEmptyValue && !isQuotes) {
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
	isReturn: boolean,
	isNamespace: boolean,
	settings: ISettings,
): boolean {
	if ((isReturn || isPropertyValue) && !isEmptyValue && !isQuotes) {
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
		isInterpolation ? currentWord.indexOf("{") + 1 : 0,
		currentWord.indexOf("."),
	);
}

export function createCompletionContext(
	document: TextDocument,
	text: string,
	offset: number,
	settings: ISettings,
): CompletionContext {
	const word = getCurrentWord(text, offset);
	const textBeforeWord = getTextBeforePosition(text, offset);
	const lastDot = document.uri.lastIndexOf(".");
	const originalExtension = document.uri.slice(
		Math.max(0, lastDot + 1),
	) as SupportedExtensions;

	const result: CompletionContext = {
		word,
		textBeforeWord,
		originalExtension,
		comment: false,
		sassDoc: false,
		namespace: null,
		import: false,
		variable: false,
		function: false,
		mixin: false,
		placeholder: false,
		placeholderDeclaration: false,
	};

	result.import = rePartialModuleAtRule.test(textBeforeWord);
	if (result.import) {
		return result;
	}

	result.comment = isCommentContext(textBeforeWord);
	result.sassDoc = isSassDocContext(textBeforeWord);
	if (result.comment || result.sassDoc) {
		return result;
	}

	// Is "#{INTERPOLATION}"
	const isInterpolation = isInterpolationContext(word);
	// Is namespace, e.g. `namespace.$var` or `@include namespace.mixin` or `namespace.func()`
	result.namespace = checkNamespaceContext(word, isInterpolation);

	// Information about current position
	const isReturn = reReturn.test(textBeforeWord);
	const isPropertyValue = rePropertyValue.test(textBeforeWord);
	const isEmptyValue = reEmptyPropertyValue.test(textBeforeWord);
	const isQuotes = reQuotes.test(
		textBeforeWord.replace(reQuotedValueInString, ""),
	);

	result.variable = checkVariableContext(
		word,
		isInterpolation,
		isPropertyValue,
		isEmptyValue,
		isQuotes,
		isReturn,
		Boolean(result.namespace),
	);
	result.function = checkFunctionContext(
		textBeforeWord,
		isInterpolation,
		isPropertyValue,
		isEmptyValue,
		isQuotes,
		isReturn,
		Boolean(result.namespace),
		settings,
	);
	result.mixin = checkMixinContext(textBeforeWord, isPropertyValue);

	if (result.variable || result.function || result.mixin) {
		return result;
	}

	// Is placeholder, e.g. `@extend %placeholder`
	result.placeholder = rePlaceholder.test(textBeforeWord);
	if (result.placeholder) {
		return result;
	}

	result.placeholderDeclaration =
		!result.placeholder &&
		(/\s+%/.test(textBeforeWord) || /^%/.test(textBeforeWord));

	if (result.placeholderDeclaration) {
		return result;
	}

	return result;
}
