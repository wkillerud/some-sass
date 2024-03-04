import { parser } from "@lezer/sass";
import type { TextDocument } from "vscode-languageserver-textdocument";
import { Stylesheet } from "./language-services-types";

export function parseStylesheet(document: TextDocument): Stylesheet {
	return parser
		.configure({
			dialect: document.languageId === "sass" ? "indented" : undefined,
		})
		.parse(document.getText());
}
