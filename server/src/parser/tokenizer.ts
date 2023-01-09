import { tokenizer as scssSymbolsTokenizer } from "scss-symbols-parser";

type TokenType =
	| ";"
	| ":"
	| "("
	| ")"
	| "["
	| "]"
	| "{"
	| "}"
	| "at-word"
	| "brackets"
	| "comment"
	| "space"
	| "string"
	| "word";
type TokenText = string;
type TokenTextOffset = number;

/**
 * The result from the tokenizer function in scss-symbols-parser is an array of these Tokens.
 */
export type Token = [TokenType, TokenText, TokenTextOffset | undefined];

export function tokenizer(string: string): Token[] {
	return scssSymbolsTokenizer(string);
}
