import type { Stylesheet, TextDocument } from "@somesass/language-server-types";
import { parser } from "@somesass/parser";

export function parseStylesheet(document: TextDocument): Stylesheet {
	return parser
		.configure({
			dialect: document.languageId === "sass" ? "indented" : undefined,
		})
		.parse(document.getText());
}
