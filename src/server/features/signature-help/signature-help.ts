import { tokenizer } from "scss-symbols-parser";
import { MarkupKind, SignatureInformation } from "vscode-languageserver";
import type { SignatureHelp } from "vscode-languageserver";
import type { TextDocument } from "vscode-languageserver-textdocument";
import type {
	IScssDocument,
	ScssForward,
	ScssFunction,
	ScssImport,
	ScssMixin,
} from "../../parser";
import type StorageService from "../../storage";
import { applySassDoc } from "../../utils/sassdoc";
import {
	asDollarlessVariable,
	getTextBeforePosition,
} from "../../utils/string";
import { sassBuiltInModules } from "../sass-built-in-modules";
import { hasInFacts } from "./facts";

// RegExp's
const reNestedParenthesis = /\(([\w-]+)\(/;
const reSymbolName = /[\w-]+$/;

interface IMixinEntry {
	name: string | null;
	parameters: number;
}

/**
 * Returns name of last Mixin or Function in the string.
 */
function getSymbolName(text: string): string | null | undefined {
	const tokens = tokenizer(text);
	let pos = tokens.length;
	let token: [string, string, string];
	let parenthesisCount = 0;

	while (pos !== 0) {
		pos--;
		token = tokens[pos];

		// Return first `word` token before `(` because it's Symbols name
		if (token[0] === "(") {
			// Skip nested parenthesis
			parenthesisCount--;
			if (parenthesisCount > -1) {
				continue;
			}

			// String can be contains built-in Functions such as `rgba` or `map`
			while (pos !== 0) {
				pos--;
				token = tokens[pos];

				if (token[0] === "word" && !hasInFacts(token[1])) {
					const match = reSymbolName.exec(token[1]);
					return match ? match[0] : null;
				}
			}
		} else if (token[0] === ")") {
			parenthesisCount++;
		} else if (token[0] === "brackets" && reNestedParenthesis.test(token[1])) {
			// Tokens for nested string with correct positions
			const nestedTokens = tokenizer(token[1]).map((x) => {
				if (x.length === 3) {
					x[2] += token[2];
				}

				return x;
			});

			// Replace the current token on a new collection
			tokens.splice(pos, 1, ...nestedTokens);
			// Revert position back on length of nested tokens
			pos += nestedTokens.length;
		}
	}

	return null;
}

/**
 * Returns Mixin name and its parameters from line.
 */
function parseArgumentsAtLine(text: string): IMixinEntry {
	const indexOfOpenCurly = text.indexOf("{");
	if (indexOfOpenCurly !== -1) {
		text = text.slice(indexOfOpenCurly + 1, text.length);
	}

	text = text.trim();

	// Try to find name of Mixin or Function
	const name = getSymbolName(text);

	let paramsString = "";
	if (name) {
		const start = text.lastIndexOf(`${name}(`) + name.length;
		paramsString = text.slice(start, text.length);
	}

	let parameters = 0;
	if (paramsString.slice(1).length > 0) {
		const tokens = tokenizer(paramsString);

		if (tokens.length === 1 && tokens[0][0] === "brackets") {
			return {
				name: null,
				parameters,
			};
		}

		let pos = 0;
		let token;
		let parenthesis = -1;

		while (pos < tokens.length) {
			token = tokens[pos];

			if (token[1] === "," || token[1] === ";") {
				parameters++;
			} else if (
				token[0] === "word" &&
				token[1] !== "," &&
				token[1].includes(",") &&
				parenthesis === 0
			) {
				const words: string[] = token[1].split(/(,)/);

				let index = pos;
				words.forEach((word) => {
					if (word === "") {
						return;
					}

					tokens.splice(
						index,
						1,
						word === "," ? [",", ",", 0] : ["word", word, 0],
					);
					index++;
				});
			} else if (token[0] === "(") {
				parenthesis++;
			} else if (token[0] === ")") {
				parenthesis--;
			}

			pos++;
		}
	}

	return {
		name: name ? name : null,
		parameters,
	};
}

export async function doSignatureHelp(
	document: TextDocument,
	offset: number,
	storage: StorageService,
): Promise<SignatureHelp> {
	const ret: SignatureHelp = {
		activeSignature: 0,
		activeParameter: 0,
		signatures: [],
	};

	// Skip suggestions if the text not include `(` or include `);`
	const textBeforeWord = getTextBeforePosition(document.getText(), offset);
	if (textBeforeWord.endsWith(");") || !textBeforeWord.includes("(")) {
		return ret;
	}

	const entry = parseArgumentsAtLine(textBeforeWord);
	if (!entry.name) {
		return ret;
	}

	ret.activeParameter = Math.max(0, entry.parameters);

	const symbolType = textBeforeWord.includes("@include") ? "mixin" : "function";

	const suggestions: Array<ScssFunction | ScssMixin> = doSymbolHunting(
		document,
		storage,
		entry,
		symbolType,
	);

	if (suggestions.length === 0) {
		// Look for built-ins
		for (const { reference, exports } of Object.values(sassBuiltInModules)) {
			for (const [name, { signature, description }] of Object.entries(
				exports,
			)) {
				if (name === entry.name) {
					// Make sure we don't accidentaly match with CSS functions by checking
					// for hints of a module name before the entry. Essentially look for ".".
					// We could look for the module names, but that may be aliased away.
					// Do an includes-check in case signature har more than one parameter.
					const isNamespaced = textBeforeWord.includes(`.${name}(`);
					if (!isNamespaced) {
						continue;
					}

					const signatureInfo = SignatureInformation.create(
						`${name} ${signature}`,
					);

					signatureInfo.documentation = {
						kind: MarkupKind.Markdown,
						value: [
							description,
							"",
							`[Sass reference](${reference}#${name})`,
						].join("\n"),
					};

					if (signature) {
						const params = signature
							.replace(/:.+[$)]/g, "") // Remove default values
							.replace(/[().]/g, "") // Remove parentheses and ... list indicator
							.split(",");

						signatureInfo.parameters = params.map((p) => ({ label: p }));
					}

					ret.signatures.push(signatureInfo);
					break;
				}
			}
		}

		return ret;
	}

	for (const symbol of suggestions) {
		const paramsString = symbol.parameters
			.map((x) => `${x.name}: ${x.value}`)
			.join(", ");
		const signatureInfo = SignatureInformation.create(
			`${symbol.name} (${paramsString})`,
		);

		const sassdoc = applySassDoc(symbol, {
			displayOptions: { description: true, deprecated: true, return: true },
		});

		signatureInfo.documentation = {
			kind: MarkupKind.Markdown,
			value: sassdoc,
		};

		symbol.parameters.forEach((param) => {
			signatureInfo.parameters?.push({
				label: param.name,
				documentation: "",
			});
		});

		ret.signatures.push(signatureInfo);
	}

	return ret;
}

function doSymbolHunting(
	document: TextDocument,
	storage: StorageService,
	entry: IMixinEntry,
	entryType: "function" | "mixin",
): Array<ScssFunction | ScssMixin> {
	const result: Array<ScssFunction | ScssMixin> = [];

	const scssDocument = storage.get(document.uri);
	if (!scssDocument) {
		return result;
	}

	// Don't follow forwards from the current document, since the current doc doesn't have access to its symbols
	for (const { link } of scssDocument.getLinks({ forwards: false })) {
		const scssDocument = storage.get(link.target as string);
		if (!scssDocument) {
			continue;
		}

		traverseTree(scssDocument, storage, result, entry, entryType);
	}

	if (result.length === 0) {
		// If we didn't find any symbols with the modern method, fall back to the old way of searching
		for (const scssDocument of storage.values()) {
			const symbols =
				entryType === "mixin"
					? scssDocument.mixins.values()
					: scssDocument.functions.values();
			for (const symbol of symbols) {
				if (
					entry.name === symbol.name &&
					symbol.parameters.length >= entry.parameters
				) {
					result.push(symbol);
				}
			}
		}
	}

	return result;
}

function traverseTree(
	document: IScssDocument,
	storage: StorageService,
	result: Array<ScssFunction | ScssMixin>,
	entry: IMixinEntry,
	entryType: "function" | "mixin",
	accumulatedPrefix = "",
): Array<ScssFunction | ScssMixin> {
	const scssDocument = storage.get(document.uri);
	if (!scssDocument) {
		return result;
	}

	const entryName = asDollarlessVariable(entry.name as string);
	const symbols =
		entryType === "mixin"
			? scssDocument.mixins.values()
			: scssDocument.functions.values();
	for (const symbol of symbols) {
		const symbolName = `${accumulatedPrefix}${asDollarlessVariable(
			symbol.name,
		)}`;
		if (
			symbolName === entryName &&
			symbol.parameters.length >= entry.parameters &&
			!result.find((x) => x.name === symbol.name)
		) {
			result.push(symbol);
		}
	}

	// Check to see if we have to go deeper
	for (const child of scssDocument.getLinks()) {
		if (
			!child.link.target ||
			(child as ScssImport).dynamic ||
			(child as ScssImport).css
		) {
			continue;
		}

		const childDocument = storage.get(child.link.target);
		if (!childDocument) {
			continue;
		}

		let prefix = accumulatedPrefix;
		if ((child as ScssForward).prefix) {
			prefix += (child as ScssForward).prefix;
		}

		traverseTree(childDocument, storage, result, entry, entryType, prefix);
	}

	return result;
}
