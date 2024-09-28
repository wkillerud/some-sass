import { LanguageFeature } from "../language-feature";
import { TextDocument, FoldingRange } from "../language-services-types";

export type FoldingRangeContext = {
	rangeLimit?: number;
};

export class FoldingRanges extends LanguageFeature {
	async getFoldingRanges(
		document: TextDocument,
		context?: FoldingRangeContext,
	): Promise<FoldingRange[]> {
		const result = this.getUpstreamLanguageServer(document).getFoldingRanges(
			document,
			context,
		);
		return result;
	}
}
