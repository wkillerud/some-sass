import { LanguageFeature } from "../language-feature";
import {
	TextDocument,
	SelectionRange,
	Position,
} from "../language-services-types";

export class SelectionRanges extends LanguageFeature {
	async getSelectionRanges(
		document: TextDocument,
		positions: Position[],
	): Promise<SelectionRange[]> {
		const stylesheet = this.ls.parseStylesheet(document);
		const result = this.getUpstreamLanguageServer(document).getSelectionRanges(
			document,
			positions,
			stylesheet,
		);
		return result;
	}
}
