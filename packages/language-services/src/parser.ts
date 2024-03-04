import { parser } from "@lezer/sass";
import type { Stylesheet, TextDocument } from "@somesass/language-server-types";

export function parseStylesheet(document: TextDocument): Stylesheet {
	return parser
		.configure({
			dialect: document.languageId === "sass" ? "indented" : undefined,
		})
		.parse(document.getText());
}
