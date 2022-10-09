import { TextDocument } from "vscode-languageserver-textdocument";
import {
	CodeAction,
	CodeActionKind,
	Position,
	Range,
	TextDocumentEdit,
	TextEdit,
	VersionedTextDocumentIdentifier,
	WorkspaceEdit,
} from "vscode-languageserver-types";
import { IEditorSettings } from "../../settings";
import { getEOL, getLinesFromText, indentText } from "../../utils/string";
import { CodeActionProvider } from "./types";

export class ExtractProvider implements CodeActionProvider {
	private _settings: IEditorSettings;

	constructor(settings: IEditorSettings) {
		this._settings = settings;
	}

	public async provideCodeActions(
		document: TextDocument,
		range: Range,
	): Promise<CodeAction[]> {
		if (!this.hasSelection(range)) {
			return [];
		}

		return [
			this.provideExtractVariableAction(document, range),
			this.provideExtractMixinAction(document, range),
			this.provideExtractFunctionAction(document, range),
		];
	}

	private hasSelection(range: Range): boolean {
		const lineDiff = range.start.line - range.end.line;
		const charDiff = range.start.character - range.end.character;
		return lineDiff !== 0 || charDiff !== 0;
	}

	private provideExtractFunctionAction(
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
						index === 0 ? line : indentText(line, this._settings),
					)
					.join(eol)}`,
				this._settings,
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

	private provideExtractMixinAction(
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
					? indentText(index === 0 ? `${indent}${line}` : line, this._settings)
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

	private provideExtractVariableAction(
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
