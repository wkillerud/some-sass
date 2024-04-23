import { getNodeAtOffset } from "@somesass/vscode-css-languageservice";
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
	): Promise<SignatureHelp> {
		const stylesheet = this.ls.parseStylesheet(document);
		let node = getNodeAtOffset(stylesheet, document.offsetAt(position)) as
			| Function
			| MixinReference
			| null;

		const result: SignatureHelp = {
			activeSignature: 0,
			activeParameter: 0,
			signatures: [],
		};

		if (!node) {
			return result;
		}

		if (
			node.type !== NodeType.Function &&
			node.type !== NodeType.MixinReference
		) {
			if (
				!node.parent ||
				(node.parent.type !== NodeType.Function &&
					node.parent.type !== NodeType.MixinReference)
			) {
				return result;
			}

			node = node.parent as Function | MixinReference;
		}

		const identifier = node.getIdentifier()!.getText();
		const parameters = node.getArguments().getChildren();
		result.activeParameter = parameters.length;

		const definition = await this.ls.findDefinition(
			document,
			document.positionAt(node.offset + identifier.length),
		);

		if (definition) {
			const symbol = await this.findDefinitionSymbol(definition, identifier);
			if (!symbol) return result;

			const allParameters = getParametersFromDetail(symbol.detail);
			if (allParameters.length >= (result.activeParameter || 0)) {
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
								.replace(/:.+[$)]/g, "") // Remove default values
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
