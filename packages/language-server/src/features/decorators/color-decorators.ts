import {
	NodeType,
	TextDocument,
	SymbolKind,
	ColorInformation,
	FunctionParameter,
	VariableDeclaration,
} from "@somesass/language-services";
import ColorDotJS from "colorjs.io";
import { useContext } from "../../context-provider";
import { ScssVariable } from "../../parser";
import { getBaseValueFrom, isReferencingVariable } from "../../utils/scss";
import { isColor } from "../completion/color-completion";
import { getDefinitionSymbol } from "../go-definition";

export function findDocumentColors(document: TextDocument): ColorInformation[] {
	const colorInformation: ColorInformation[] = [];

	const { storage } = useContext();
	const scssDocument = storage.get(document.uri);
	if (!scssDocument) {
		return colorInformation;
	}

	scssDocument.ast.accept((node) => {
		if (node.type !== NodeType.VariableName) {
			// continue
			return true;
		}

		const parent = node.getParent();
		if (
			parent &&
			parent.type !== NodeType.VariableDeclaration &&
			parent.type !== NodeType.FunctionParameter
		) {
			const identifier = {
				name: (node as FunctionParameter | VariableDeclaration).getName(),
				position: document.positionAt(node.offset),
				kind: SymbolKind.Variable,
			};

			const [symbol, sourceDocument] = getDefinitionSymbol(
				document,
				identifier,
			);
			// Symbol is null if current node _is_ the definition. In that case, we
			// defer color decoration to the VS Code language server.
			if (!symbol) {
				// continue
				return true;
			}

			const variable = symbol as ScssVariable;

			let value = variable.value;
			if (!value) {
				// continue
				return true;
			}

			if (isReferencingVariable(variable)) {
				value = getBaseValueFrom(variable, sourceDocument).value;
			}

			if (!value || !isColor(value)) {
				// continue
				return true;
			}

			const srgbaColor = ColorDotJS.to(ColorDotJS.parse(value), "srgb");
			const color: ColorInformation = {
				color: {
					alpha: srgbaColor.alpha || 1,
					red: srgbaColor.coords[0],
					green: srgbaColor.coords[1],
					blue: srgbaColor.coords[2],
				},
				range: {
					start: document.positionAt(node.offset),
					end: document.positionAt(
						node.offset +
							(node as FunctionParameter | VariableDeclaration).getName()
								.length,
					),
				},
			};
			colorInformation.push(color);
		}

		return true;
	});

	return colorInformation;
}

// Maybe we just don't provide any options?
// Clicking to see the other non-rgb options replaces the variable reference.
// The below works, but is less helpful than I'd like. Keep for reference, in case of user feedback.
// export function getColorPresentations(
// 	document: TextDocument,
// 	color: Color,
// 	range: Range,
// ): ColorPresentation[] {
// 	const ls = getLanguageService();
// 	const stylesheet = ls.parseStylesheet(document);
// 	return ls.getColorPresentations(document, stylesheet, color, range);
// }
