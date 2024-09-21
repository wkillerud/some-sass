import { LanguageFeature } from "../language-feature";
import {
	TextDocument,
	Position,
	DocumentHighlight,
} from "../language-services-types";

export class FindDocumentHighlights extends LanguageFeature {
	findDocumentHighlights(
		document: TextDocument,
		position: Position,
	): DocumentHighlight[] {
		const stylesheet = this.ls.parseStylesheet(document);
		return this.getUpstreamLanguageServer(document).findDocumentHighlights(
			document,
			position,
			stylesheet,
		);
	}
}
