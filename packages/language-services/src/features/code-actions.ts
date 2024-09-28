import { LanguageFeature } from "../language-feature";
import {
	CodeAction,
	CodeActionContext,
	CodeActionKind,
	LanguageServerConfiguration,
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
		context: CodeActionContext = { diagnostics: [] },
	): Promise<CodeAction[]> {
		if (!this.hasSelection(range)) {
			return [];
		}

		let upstream: CodeAction[] = [];
		const stylesheet = this.ls.parseStylesheet(document);
		upstream = this.getUpstreamLanguageServer(document).doCodeActions2(
			document,
			range,
			context,
			stylesheet,
		);

		return [
			this.getExtractVariableAction(document, range),
			this.getExtractMixinAction(document, range),
			this.getExtractFunctionAction(document, range),
			...upstream,
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

		const preceeding = preceedingOnLine.trimStart();
		const lastIndent = preceedingOnLine.length - preceeding.length;
		const indent = preceedingOnLine.substring(0, lastIndent);

		const lines = getLinesFromText(selectedText);
		const eol =
			lines.length > 1 ? getEOL(selectedText) : getEOL(document.getText());

		let newLines: string;
		if (document.languageId === "sass") {
			newLines = [
				`${indent}@function _function()`,
				`${indent}${indentText(
					`@return ${lines
						.map((line, index) =>
							index === 0 ? line : indentText(line, this.configuration),
						)
						.join(eol)}`,
					this.configuration,
				)}`,
				`${indent}${preceeding}_function()`,
			].join(eol);
		} else {
			const semi = selectedText.endsWith(";");
			newLines = [
				`${indent}@function _function() {`,
				`${indent}${indentText(
					`@return ${lines
						.map((line, index) =>
							index === 0 ? line : indentText(line, this.configuration),
						)
						.join(eol)}`,
					this.configuration,
				)}${semi ? "" : ";"}`,
				`${indent}}`,
				`${indent}${preceeding}_function()${semi ? ";" : ""}`,
			].join(eol);
		}

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

		let newLines: string;
		if (document.languageId === "sass") {
			newLines = [
				"@mixin _mixin",
				...lines.map((line, index) =>
					line
						? indentText(
								index === 0 ? `${indent}${line}` : line,
								this.configuration,
							)
						: line,
				),
				`${indent}@include _mixin`,
			].join(eol);
		} else {
			newLines = [
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
		}

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
		const selected = document.getText(range);
		const preceedingOnLine = document.getText(
			Range.create(
				Position.create(range.start.line, 0),
				Position.create(range.start.line, range.start.character),
			),
		);

		const preceeding = preceedingOnLine.trimStart();
		const lastIndent = preceedingOnLine.length - preceeding.length;
		const indent = preceedingOnLine.substring(0, lastIndent);

		const eol = getEOL(document.getText());

		let newLines: string;
		if (document.languageId === "sass") {
			newLines = `${indent}$_variable: ${selected}${eol}${indent}${preceeding}$_variable`;
		} else {
			const semi = selected.endsWith(";");
			newLines = `${indent}$_variable: ${selected}${semi ? "" : ";"}${eol}${indent}${preceeding}$_variable${
				semi ? ";" : ""
			}`;
		}

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
	settings: LanguageServerConfiguration,
): string {
	if (settings.editor?.insertSpaces) {
		const numberOfSpaces: number =
			typeof settings.editor?.indentSize === "number"
				? settings.editor?.indentSize
				: typeof settings.editor?.tabSize === "number"
					? settings.editor?.tabSize
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
