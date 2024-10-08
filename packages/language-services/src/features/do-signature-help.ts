import { getNodeAtOffset, Range } from "@somesass/vscode-css-languageservice";
import { sassBuiltInModules } from "../facts/sass";
import { LanguageFeature } from "../language-feature";
import {
	TextDocument,
	Position,
	SignatureHelp,
	SignatureInformation,
	MarkupKind,
	NodeType,
	MixinReference,
	Function,
} from "../language-services-types";
import { asDollarlessVariable } from "../utils/sass";
import { applySassDoc } from "../utils/sassdoc";

export class DoSignatureHelp extends LanguageFeature {
	async doSignatureHelp(
		document: TextDocument,
		position: Position,
	): Promise<SignatureHelp | null> {
		const stylesheet = this.ls.parseStylesheet(document);
		let node = getNodeAtOffset(stylesheet, document.offsetAt(position)) as
			| Function
			| MixinReference
			| null;

		if (!node) {
			return null;
		}

		if (
			node.type !== NodeType.Function &&
			node.type !== NodeType.MixinReference
		) {
			const parent = node.findAParent(
				NodeType.Function,
				NodeType.MixinReference,
			);
			if (!parent) {
				return null;
			}
			node = parent as Function | MixinReference;
		}

		const result: Required<SignatureHelp> = {
			activeSignature: 0,
			activeParameter: 0,
			signatures: [],
		};
		const identifier = node.getIdentifier()!.getText();
		const parameters = node.getArguments().getChildren();
		if (parameters.length) {
			result.activeParameter = parameters.length - 1;

			// Figure out how to se if we have a , after the last parameter. If so, add one to result.activeParameter.
			const lastParamEndOffset = parameters[parameters.length - 1].end;
			const lastParamEndPosition = document.positionAt(lastParamEndOffset);
			const characterAfterLastParam = document.getText(
				Range.create(lastParamEndPosition, {
					line: lastParamEndPosition.line,
					character: lastParamEndPosition.character + 1,
				}),
			);
			if (characterAfterLastParam === ",") {
				result.activeParameter = result.activeParameter + 1;
			}
		}

		const definition = await this.ls.findDefinition(
			document,
			document.positionAt(node.offset + identifier.length),
		);

		if (definition) {
			const symbol = await this.findDefinitionSymbol(definition, identifier);
			if (!symbol) return result;

			const allParameters = getParametersFromDetail(symbol.detail);
			// activeParameter is 0 index
			if (
				allParameters.length === 0 ||
				allParameters.length > result.activeParameter
			) {
				const signatureInfo = SignatureInformation.create(
					`${identifier}${symbol.detail || "()"}`,
				);

				const sassdoc = applySassDoc(symbol);

				signatureInfo.documentation = {
					kind: MarkupKind.Markdown,
					value: sassdoc,
				};

				if (symbol.detail) {
					signatureInfo.parameters = [];
					const parameters = getParametersFromDetail(symbol.detail);
					for (const { name } of parameters) {
						let documentation;
						if (symbol.sassdoc) {
							const dollarless = asDollarlessVariable(name);
							const paramDoc = symbol.sassdoc.parameter?.find(
								(pdoc) => pdoc.name === dollarless,
							);
							if (paramDoc) {
								documentation = paramDoc.description;
							}
						}
						signatureInfo.parameters.push({
							label: name.trim(),
							documentation,
						});
					}
				}

				result.signatures.push(signatureInfo);
			}
		} else if (result.signatures.length === 0) {
			// if no suggestion, look for built-in
			for (const { reference, exports } of Object.values(sassBuiltInModules)) {
				for (const [name, { signature, description }] of Object.entries(
					exports,
				)) {
					if (name === identifier) {
						// Make sure we don't accidentaly match with CSS functions by checking
						// for hints of a module name before the entry. Essentially look for ".".
						// We could look for the module names, but that may be aliased away.
						// Do an includes-check in case signature har more than one parameter.
						const isNamespaced = node.parent?.type === NodeType.Module;
						if (!isNamespaced) {
							continue;
						}

						const signatureInfo = SignatureInformation.create(
							`${name}${signature}`,
						);

						signatureInfo.documentation = {
							kind: MarkupKind.Markdown,
							value: `${description}\n\n[Sass reference](${reference}#${name})`,
						};

						if (signature) {
							const params = signature
								.replace(/:.+?(?=[,)])/g, "") // Remove default values in a non-greedy way
								.replace(/[().]/g, "") // Remove parentheses and ... list indicator
								.split(",");

							signatureInfo.parameters = params.map((p) => ({
								label: p.trim(),
							}));
						}

						result.signatures.push(signatureInfo);
						break;
					}
				}
			}
		}

		return result;
	}
}

type Parameter = {
	name: string;
	defaultValue?: string;
};

function getParametersFromDetail(detail?: string): Array<Parameter> {
	const result: Parameter[] = [];
	if (!detail) {
		return result;
	}

	const parameters = detail.replace(/[()]/g, "").split(",");
	for (const param of parameters) {
		let name = param;
		let defaultValue: string | undefined = undefined;
		const defaultValueStart = param.indexOf(":");
		if (defaultValueStart !== -1) {
			name = param.substring(0, defaultValueStart);
			defaultValue = param.substring(defaultValueStart + 1);
		}

		const parameter: Parameter = {
			name: name.trim(),
			defaultValue: defaultValue?.trim(),
		};

		result.push(parameter);
	}
	return result;
}
