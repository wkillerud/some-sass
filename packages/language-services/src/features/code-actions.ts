import { LanguageFeature } from "../language-feature";
import {
	CodeAction,
	CodeActionContext,
	CodeActionKind,
	LanguageServiceConfiguration,
	Position,
	Range,
	TextDocument,
	TextDocumentEdit,
	TextEdit,
	VersionedTextDocumentIdentifier,
	WorkspaceEdit,
} from "../language-services-types";

export class CodeActions extends LanguageFeature {
	async getCodeActions(
		document: TextDocument,
		range: Range,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		context: CodeActionContext = { diagnostics: [] },
	): Promise<CodeAction[]> {
		if (!this.hasSelection(range)) {
			return [];
		}

		return [
			this.getExtractVariableAction(document, range),
			this.getExtractMixinAction(document, range),
			this.getExtractFunctionAction(document, range),
		];
	}

	private hasSelection(range: Range): boolean {
		const lineDiff = range.start.line - range.end.line;
		const charDiff = range.start.character - range.end.character;
		return lineDiff !== 0 || charDiff !== 0;
	}

	private getExtractFunctionAction(
		document: TextDocument,
		range: Range,
	): CodeAction {
		const selectedText = document.getText(range);
		const preceedingOnLine = document.getText(
			Range.create(
				Position.create(range.start.line, 0),
				Position.create(range.start.line, range.start.character),
			),
		);

		const onlyNonWhitespace = preceedingOnLine.trimStart();
		const lastIndent = preceedingOnLine.length - onlyNonWhitespace.length;
		const indent = preceedingOnLine.substring(0, lastIndent);

		const lines = getLinesFromText(selectedText);
		const eol =
			lines.length > 1 ? getEOL(selectedText) : getEOL(document.getText());

		const newLines = [
			`${indent}@function _function() {`,
			`${indent}${indentText(
				`@return ${lines
					.map((line, index) =>
						index === 0 ? line : indentText(line, this.configuration),
					)
					.join(eol)}`,
				this.configuration,
			)}${selectedText.endsWith(";") ? "" : ";"}`,
			`${indent}}`,
			`${indent}${onlyNonWhitespace}_function()${
				selectedText.endsWith(";") ? ";" : ""
			}`,
		].join(eol);

		const workspaceEdit: WorkspaceEdit = {
			documentChanges: [
				TextDocumentEdit.create(
					VersionedTextDocumentIdentifier.create(
						document.uri,
						document.version,
					),
					[
						TextEdit.replace(
							Range.create(
								Position.create(range.start.line, 0),
								Position.create(range.end.line, range.end.character),
							),
							newLines,
						),
					],
				),
			],
		};

		const action = CodeAction.create(
			"Extract function",
			workspaceEdit,
			CodeActionKind.RefactorExtract + ".function",
		);

		return action;
	}

	private getExtractMixinAction(
		document: TextDocument,
		range: Range,
	): CodeAction {
		const selectedText = document.getText(range);
		const preceedingOnLine = document.getText(
			Range.create(
				Position.create(range.start.line, 0),
				Position.create(range.start.line, range.start.character),
			),
		);

		const onlyNonWhitespace = preceedingOnLine.trimStart();
		const lastIndent = preceedingOnLine.length - onlyNonWhitespace.length;
		const indent = preceedingOnLine.substring(0, lastIndent);

		const lines = getLinesFromText(selectedText);
		const eol =
			lines.length > 1 ? getEOL(selectedText) : getEOL(document.getText());

		const newLines = [
			"@mixin _mixin {",
			...lines.map((line, index) =>
				line
					? indentText(
							index === 0 ? `${indent}${line}` : line,
							this.configuration,
						)
					: line,
			),
			`${indent}}`,
			`${indent}@include _mixin;`,
		].join(eol);

		const workspaceEdit: WorkspaceEdit = {
			documentChanges: [
				TextDocumentEdit.create(
					VersionedTextDocumentIdentifier.create(
						document.uri,
						document.version,
					),
					[TextEdit.replace(range, newLines)],
				),
			],
		};

		const action = CodeAction.create(
			"Extract mixin",
			workspaceEdit,
			CodeActionKind.RefactorExtract,
		);

		return action;
	}

	private getExtractVariableAction(
		document: TextDocument,
		range: Range,
	): CodeAction {
		const selectedText = document.getText(range);
		const preceedingOnLine = document.getText(
			Range.create(
				Position.create(range.start.line, 0),
				Position.create(range.start.line, range.start.character),
			),
		);

		const onlyNonWhitespace = preceedingOnLine.trimStart();
		const lastIndent = preceedingOnLine.length - onlyNonWhitespace.length;
		const indent = preceedingOnLine.substring(0, lastIndent);

		const eol = getEOL(document.getText());

		const newLines = `${indent}$_variable: ${
			selectedText.endsWith(";") ? selectedText : `${selectedText};`
		}${eol}${indent}${onlyNonWhitespace}${
			selectedText.endsWith(";") ? "$_variable;" : "$_variable"
		}`;

		const workspaceEdit: WorkspaceEdit = {
			documentChanges: [
				TextDocumentEdit.create(
					VersionedTextDocumentIdentifier.create(
						document.uri,
						document.version,
					),
					[
						TextEdit.replace(
							Range.create(
								Position.create(range.start.line, 0),
								Position.create(range.end.line, range.end.character),
							),
							newLines,
						),
					],
				),
			],
		};

		const action = CodeAction.create(
			"Extract variable",
			workspaceEdit,
			CodeActionKind.RefactorExtract + ".constant",
		);

		return action;
	}
}

const reNewline = /\r\n|\r|\n/;

function getLinesFromText(text: string): string[] {
	return text.split(reNewline);
}

const space = " ";
const tab = "	";

function indentText(
	text: string,
	settings: LanguageServiceConfiguration,
): string {
	if (settings.editorSettings?.insertSpaces) {
		const numberOfSpaces: number =
			typeof settings.editorSettings?.indentSize === "number"
				? settings.editorSettings?.indentSize
				: typeof settings.editorSettings?.tabSize === "number"
					? settings.editorSettings?.tabSize
					: 2;
		return `${space.repeat(numberOfSpaces)}${text}`;
	}

	return `${tab}${text}`;
}

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * MIT License
 */
export function getEOL(text: string): string {
	for (let i = 0; i < text.length; i++) {
		const ch = text.charAt(i);
		if (ch === "\r") {
			if (i + 1 < text.length && text.charAt(i + 1) === "\n") {
				return "\r\n";
			}
			return "\r";
		} else if (ch === "\n") {
			return "\n";
		}
	}
	return "\n";
}
