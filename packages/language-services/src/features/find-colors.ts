import { getNodeAtOffset } from "@somesass/vscode-css-languageservice";
import ColorDotJS from "colorjs.io";
import { LanguageFeature } from "../language-feature";
import {
	Color,
	ColorInformation,
	ColorPresentation,
	NodeType,
	Range,
	TextDocument,
	Variable,
} from "../language-services-types";

export class FindColors extends LanguageFeature {
	async findColors(document: TextDocument): Promise<ColorInformation[]> {
		const variables: Variable[] = [];
		const stylesheet = this.ls.parseStylesheet(document);
		stylesheet.accept((node) => {
			if (node.type !== NodeType.VariableName) {
				return true;
			}

			const parent = node.getParent();
			if (
				parent &&
				parent.type !== NodeType.VariableDeclaration &&
				parent.type !== NodeType.FunctionParameter
			) {
				variables.push(node as Variable);
			}
			return true;
		});

		if (
			variables.length >
			(this.configuration.editorSettings?.colorDecoratorsLimit || 500)
		) {
			// skip color decorators for large documents
			return [];
		}

		const result: (ColorInformation | null)[] = await Promise.all(
			variables.map(async (variable) => {
				const value = await this.findValue(
					document,
					document.positionAt(variable.offset),
				);
				if (value) {
					try {
						const color = ColorDotJS.parse(value);
						const srgba = ColorDotJS.to(color, "srgb");
						const colorInformation: ColorInformation = {
							color: {
								alpha: srgba.alpha || 1,
								red: srgba.coords[0],
								green: srgba.coords[1],
								blue: srgba.coords[2],
							},
							range: {
								start: document.positionAt(variable.offset),
								end: document.positionAt(
									variable.offset + (variable as Variable).getName().length,
								),
							},
						};

						return colorInformation;
					} catch (e) {
						// do nothing
					}
				}
				return null;
			}),
		);

		if (
			document.languageId === "sass" ||
			this.configuration.completionSettings?.suggestAllFromOpenDocument
		) {
			const upstream = this.getUpstreamLanguageServer().findDocumentColors(
				document,
				stylesheet,
			);
			result.push(...upstream);
		}

		return result.filter((c) => c !== null);
	}

	getColorPresentations(
		document: TextDocument,
		color: Color,
		range: Range,
	): ColorPresentation[] {
		const stylesheet = this.ls.parseStylesheet(document);
		const node = getNodeAtOffset(stylesheet, document.offsetAt(range.start));

		// Only suggest alternate presentations for the declaration
		// so we don't suggest replacing ex. color: $variable; with color: #ffffff;
		if (node && node.type === NodeType.VariableName) {
			const parent = node.getParent();
			if (parent && parent.type === NodeType.VariableDeclaration) {
				return this.getUpstreamLanguageServer().getColorPresentations(
					document,
					stylesheet,
					color,
					range,
				);
			}
		} else if (
			document.languageId === "sass" ||
			this.configuration.completionSettings?.suggestAllFromOpenDocument
		) {
			return this.getUpstreamLanguageServer().getColorPresentations(
				document,
				stylesheet,
				color,
				range,
			);
		}

		return [];
	}
}
