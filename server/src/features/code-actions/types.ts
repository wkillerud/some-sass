import type { TextDocument } from "vscode-languageserver-textdocument";
import type {
	CodeAction,
	CodeActionContext,
	Range,
} from "vscode-languageserver-types";

export interface CodeActionProvider {
	provideCodeActions: (
		document: TextDocument,
		range: Range,
		context: CodeActionContext,
	) => Promise<CodeAction[]>;
	resolveCodeAction?: (codeAction: CodeAction) => Promise<CodeAction>;
}
