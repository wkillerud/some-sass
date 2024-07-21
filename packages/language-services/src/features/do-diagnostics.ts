import { LanguageFeature } from "../language-feature";
import {
	TextDocument,
	MixinReference,
	Variable,
	Diagnostic,
	Node,
	NodeType,
	Function,
	Range,
	DiagnosticTag,
	DiagnosticSeverity,
} from "../language-services-types";

export class DoDiagnostics extends LanguageFeature {
	async doDiagnostics(document: TextDocument): Promise<Diagnostic[]> {
		return Promise.all([
			this.doDeprecationDiagnostics(document),
			this.doUpstreamDiagnostics(document),
		]).then((diagnostics) => diagnostics.flatMap((diagnostic) => diagnostic));
	}

	private async doUpstreamDiagnostics(document: TextDocument) {
		const stylesheet = this.ls.parseStylesheet(document);
		const diagnostics = this.getUpstreamLanguageServer().doValidation(
			document,
			stylesheet,
			{ validate: true },
		);
		return diagnostics;
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
					: (node as Variable | Function | MixinReference).getName();

			const symbol = await this.findDefinitionSymbol(definition, name);

			if (!symbol) continue;
			if (typeof symbol.sassdoc?.deprecated === "undefined") continue;

			let range: Range | null = null;
			if (
				node.type === NodeType.MixinReference ||
				node.type === NodeType.Function
			) {
				const ident = (node as Function | MixinReference).getIdentifier();
				if (ident) {
					range = Range.create(
						document.positionAt(ident.offset),
						document.positionAt(ident.end),
					);
				}
			}

			diagnostics.push({
				message: symbol.sassdoc.deprecated || `${symbol.name} is deprecated`,
				range:
					range ||
					Range.create(
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
				case NodeType.Function: {
					references.push(node);
					break;
				}
				case NodeType.SelectorPlaceholder: {
					const nodeList = node.parent;
					if (!nodeList) break;

					const atExtend = nodeList.parent;
					if (atExtend && atExtend.type === NodeType.ExtendsReference) {
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
