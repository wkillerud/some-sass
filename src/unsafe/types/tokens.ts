type TokenType = 'word' | 'comment' | 'at-word' | 'string' | ')' | '(' | 'brackets' | ';' | ':' | '}' | '{' | ']' | '[' | 'space';
type TokenText = string;
type TokenTextOffset = number;

/**
 * The result from the tokenizer function in scss-symbols-parser is an array of these Tokens.
 */
export type Token = [TokenType, TokenText, TokenTextOffset | undefined];
