import { LanguageFeature } from "../language-feature";
import {
	IToken,
	Position,
	Range,
	TextDocument,
	TokenType,
} from "../language-services-types";

const enum SemanticTokenType {
	namespace = 0,
	parameter = 1,
	variable = 2,
	function = 3,
	method = 4,
	comment = 5,
	string = 6,
	keyword = 7,
	number = 8,
	operator = 9,
	_ = 10,
}

const enum SemanticTokenModifier {
	declaration = 0,
	deprecated = 1,
	documentation = 2,
	defaultLibrary = 3,
	_ = 4,
}

export const legend: { tokenTypes: string[]; tokenModifiers: string[] } = {
	tokenTypes: [],
	tokenModifiers: [],
};

legend.tokenTypes[SemanticTokenType.namespace] = "namespace";
legend.tokenTypes[SemanticTokenType.parameter] = "parameter";
legend.tokenTypes[SemanticTokenType.variable] = "variable";
legend.tokenTypes[SemanticTokenType.function] = "function";
legend.tokenTypes[SemanticTokenType.method] = "method";
legend.tokenTypes[SemanticTokenType.comment] = "comment";
legend.tokenTypes[SemanticTokenType.string] = "string";
legend.tokenTypes[SemanticTokenType.keyword] = "keyword";
legend.tokenTypes[SemanticTokenType.number] = "number";
legend.tokenTypes[SemanticTokenType.operator] = "operator";

legend.tokenModifiers[SemanticTokenModifier.declaration] = "declaration";
legend.tokenModifiers[SemanticTokenModifier.deprecated] = "deprecated";
legend.tokenModifiers[SemanticTokenModifier.documentation] = "documentation";
legend.tokenModifiers[SemanticTokenModifier.defaultLibrary] = "defaultLibrary";

type SemanticTokenData = {
	start: Position;
	length: number;
	typeIdx: number;
	modifierSet: number;
};

export class SemanticTokens extends LanguageFeature {
	async getSemanticTokens(
		document: TextDocument,
		ranges?: Range[],
	): Promise<number[]> {
		const allTokens: SemanticTokenData[] = [];

		switch (document.languageId) {
			case "css": {
				break;
			}
			case "scss": {
				break;
			}
			case "sass": {
				const scanner = this.getScanner(document);
				let token: IToken = scanner.scan();
				while (token.type !== TokenType.EOF) {
					if (token.type === TokenType.Comment) {
						allTokens.push({
							start: document.positionAt(token.offset),
							length: token.len,
							typeIdx: SemanticTokenType.comment,
							modifierSet: SemanticTokenModifier.declaration,
						});
					}
					token = scanner.scan();
				}
				break;
			}
			default:
				throw new Error(`Unsupported language ID ${document.languageId}`);
		}

		return encodeTokens(allTokens, ranges, document);
	}
}

function encodeTokens(
	tokens: SemanticTokenData[],
	ranges: Range[] | undefined,
	document: TextDocument,
): number[] {
	const resultTokens = tokens.sort(
		(d1, d2) =>
			d1.start.line - d2.start.line || d1.start.character - d2.start.character,
	);
	if (ranges) {
		ranges = ranges.sort(
			(d1, d2) =>
				d1.start.line - d2.start.line ||
				d1.start.character - d2.start.character,
		);
	} else {
		ranges = [
			Range.create(
				Position.create(0, 0),
				Position.create(document.lineCount, 0),
			),
		];
	}

	let rangeIndex = 0;
	let currRange = ranges[rangeIndex++];

	let prefLine = 0;
	let prevChar = 0;

	const encodedResult: number[] = [];

	for (let k = 0; k < resultTokens.length && currRange; k++) {
		const curr = resultTokens[k];
		const start = curr.start;
		while (currRange && beforeOrSame(currRange.end, start)) {
			currRange = ranges[rangeIndex++];
		}
		if (
			currRange &&
			beforeOrSame(currRange.start, start) &&
			beforeOrSame(
				{ line: start.line, character: start.character + curr.length },
				currRange.end,
			)
		) {
			// token inside a range

			if (prefLine !== start.line) {
				prevChar = 0;
			}
			encodedResult.push(start.line - prefLine); // line delta
			encodedResult.push(start.character - prevChar); // character delta
			encodedResult.push(curr.length); // length
			encodedResult.push(curr.typeIdx); // tokenType
			encodedResult.push(curr.modifierSet); // tokenModifier

			prefLine = start.line;
			prevChar = start.character;
		}
	}
	return encodedResult;
}

function beforeOrSame(p1: Position, p2: Position) {
	return (
		p1.line < p2.line || (p1.line === p2.line && p1.character <= p2.character)
	);
}
