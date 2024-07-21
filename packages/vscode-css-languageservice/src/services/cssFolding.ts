/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
"use strict";

import { TextDocument, FoldingRange, FoldingRangeKind } from "../cssLanguageTypes";
import { TokenType, Scanner, IToken } from "../parser/cssScanner";
import { SassScanner, InterpolationFunction } from "../parser/sassScanner";

type DelimiterType = "brace" | "comment";
type Delimiter = { line: number; type: DelimiterType; isStart: boolean };

export function getFoldingRanges(document: TextDocument, context: { rangeLimit?: number }): FoldingRange[] {
	const ranges = computeFoldingRanges(document);
	return limitFoldingRanges(ranges, context);
}

function computeFoldingRanges(document: TextDocument): FoldingRange[] {
	function getStartLine(t: IToken) {
		return document.positionAt(t.offset).line;
	}
	function getEndLine(t: IToken) {
		return document.positionAt(t.offset + t.len).line;
	}
	function getScanner() {
		switch (document.languageId) {
			case "scss":
				return new SassScanner();
			case "sass":
				return new SassScanner({ syntax: "indented" });
			default:
				return new Scanner();
		}
	}
	function tokenToRange(t: IToken, kind?: FoldingRangeKind | string): FoldingRange | null {
		const startLine = getStartLine(t);
		const endLine = getEndLine(t);

		if (startLine !== endLine) {
			return {
				startLine,
				endLine,
				kind,
			};
		} else {
			return null;
		}
	}

	const ranges: FoldingRange[] = [];

	const delimiterStack: Delimiter[] = [];

	const scanner = getScanner();
	scanner.ignoreComment = false;
	scanner.setSource(document.getText());

	let token = scanner.scan();
	let prevToken: IToken | null = null;
	done: while (true) {
		switch (token.type) {
			case TokenType.CurlyL:
			case TokenType.Indent:
			case InterpolationFunction: {
				delimiterStack.push({ line: getStartLine(token), type: "brace", isStart: true });
				break;
			}
			case TokenType.EOF:
			case TokenType.Dedent:
			case TokenType.CurlyR: {
				// for indented EOF can fill the same role as CurlyR, but we don't want that to be the case for (S)CSS
				if (token.type === TokenType.EOF && scanner.syntax !== "indented") {
					break done;
				}

				if (delimiterStack.length !== 0) {
					const prevDelimiter = popPrevStartDelimiterOfType(delimiterStack, "brace");
					if (!prevDelimiter) {
						if (token.type === TokenType.EOF) {
							break done;
						}
						break;
					}

					let endLine = getEndLine(token);

					if (prevDelimiter.type === "brace") {
						/**
						 * Other than the case when curly brace is not on a new line by itself, for example
						 * .foo {
						 *   color: red; }
						 * Use endLine minus one to show ending curly brace
						 */
						if (prevToken && getEndLine(prevToken) !== endLine) {
							endLine--;
						}

						if (prevDelimiter.line !== endLine) {
							ranges.push({
								startLine: prevDelimiter.line,
								endLine,
								kind: undefined,
							});
						}
					}
				} else {
					// There might be several Indents we should create ranges from,
					// so only break out here if the stack is empty.
					if (token.type === TokenType.EOF) {
						break done;
					}
				}
				break;
			}
			/**
			 * In CSS, there is no single line comment prefixed with //
			 * All comments are marked as `Comment`
			 */
			case TokenType.Comment: {
				const commentRegionMarkerToDelimiter = (marker: string): Delimiter => {
					if (marker === "#region") {
						return { line: getStartLine(token), type: "comment", isStart: true };
					} else {
						return { line: getEndLine(token), type: "comment", isStart: false };
					}
				};

				const getCurrDelimiter = (token: IToken): Delimiter | null => {
					const matches = token.text.match(/^\s*\/\*\s*(#region|#endregion)\b\s*(.*?)\s*\*\//);
					if (matches) {
						return commentRegionMarkerToDelimiter(matches[1]);
					} else if (document.languageId === "scss" || document.languageId === "sass") {
						const matches = token.text.match(/^\s*\/\/\s*(#region|#endregion)\b\s*(.*?)\s*/);
						if (matches) {
							return commentRegionMarkerToDelimiter(matches[1]);
						}
					}

					return null;
				};

				const currDelimiter = getCurrDelimiter(token);

				// /* */ comment region folding
				// All #region and #endregion cases
				if (currDelimiter) {
					if (currDelimiter.isStart) {
						delimiterStack.push(currDelimiter);
					} else {
						const prevDelimiter = popPrevStartDelimiterOfType(delimiterStack, "comment");
						if (!prevDelimiter) {
							break;
						}

						if (prevDelimiter.type === "comment") {
							if (prevDelimiter.line !== currDelimiter.line) {
								ranges.push({
									startLine: prevDelimiter.line,
									endLine: currDelimiter.line,
									kind: "region",
								});
							}
						}
					}
				}
				// Multiline comment case
				else {
					const range = tokenToRange(token, "comment");
					if (range) {
						ranges.push(range);
					}
				}

				break;
			}
		}
		prevToken = token;
		token = scanner.scan();
	}

	return ranges;
}

function popPrevStartDelimiterOfType(stack: Delimiter[], type: DelimiterType): Delimiter | null {
	if (stack.length === 0) {
		return null;
	}

	for (let i = stack.length - 1; i >= 0; i--) {
		if (stack[i].type === type && stack[i].isStart) {
			return stack.splice(i, 1)[0];
		}
	}

	return null;
}

/**
 * - Sort regions
 * - Remove invalid regions (intersections)
 * - If limit exceeds, only return `rangeLimit` amount of ranges
 */
function limitFoldingRanges(ranges: FoldingRange[], context: { rangeLimit?: number }): FoldingRange[] {
	const maxRanges = (context && context.rangeLimit) || Number.MAX_VALUE;

	const sortedRanges = ranges.sort((r1, r2) => {
		let diff = r1.startLine - r2.startLine;
		if (diff === 0) {
			diff = r1.endLine - r2.endLine;
		}
		return diff;
	});

	const validRanges: FoldingRange[] = [];
	let prevEndLine = -1;
	sortedRanges.forEach((r) => {
		if (!(r.startLine < prevEndLine && prevEndLine < r.endLine)) {
			validRanges.push(r);
			prevEndLine = r.endLine;
		}
	});

	if (validRanges.length < maxRanges) {
		return validRanges;
	} else {
		return validRanges.slice(0, maxRanges);
	}
}
