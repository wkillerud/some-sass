import { LanguageFeature } from "../language-feature";
import {
	TextDocument,
	Function,
	MixinReference,
	Variable,
	Diagnostic,
	Node,
	NodeType,
	Range,
	DiagnosticTag,
	DiagnosticSeverity,
} from "../language-services-types";

export class DoDiagnostics extends LanguageFeature {
	async doDiagnostics(document: TextDocument): Promise<Diagnostic[]> {
		return this.doDeprecationDiagnostics(document);
	}

	private async doDeprecationDiagnostics(
		document: TextDocument,
	): Promise<Diagnostic[]> {
		const references = this.getReferences(document);

		const diagnostics: Diagnostic[] = [];
		for (const node of references) {
			const definition = await this.ls.findDefinition(
				document,
				document.positionAt(node.offset),
			);
			if (!definition) continue;

			const name =
				node.type === NodeType.SelectorPlaceholder
					? node.getText()
					: (node as Function | MixinReference | Variable).getName();

			const symbol = await this.findDefinitionSymbol(definition, name);

			if (!symbol) continue;
			if (typeof symbol.sassdoc?.deprecated === "undefined") continue;

			diagnostics.push({
				message: symbol.sassdoc.deprecated || `${symbol.name} is deprecated`,
				// TODO: check if we should maybe do the identifier range here, or at least exclude @include and @extend
				range: Range.create(
					document.positionAt(node.offset),
					document.positionAt(node.end),
				),
				source: "Some Sass",
				tags: [DiagnosticTag.Deprecated],
				severity: DiagnosticSeverity.Hint,
			});
		}
		return diagnostics;
	}

	private getReferences(document: TextDocument): Node[] {
		const references: Node[] = [];
		const stylesheet = this.ls.parseStylesheet(document);
		stylesheet.accept((node) => {
			switch (node.type) {
				case NodeType.VariableName: {
					if (
						node.parent &&
						node.parent.type !== NodeType.FunctionParameter &&
						node.parent.type !== NodeType.VariableDeclaration
					) {
						references.push(node);
					}
					break;
				}
				case NodeType.MixinReference:
				case NodeType.Function:
					references.push(node);
					break;
				case NodeType.SelectorPlaceholder: {
					if (node.parent && node.parent.type === NodeType.ExtendsReference) {
						references.push(node);
					}
					break;
				}
			}
			return true;
		});
		return references;
	}
}
