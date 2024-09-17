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
	Position,
} from "../language-services-types";

const TAB = "	";
const SPACE = " ";

export class DoDiagnostics extends LanguageFeature {
	async doDiagnostics(document: TextDocument): Promise<Diagnostic[]> {
		return Promise.all([
			this.doDeprecationDiagnostics(document),
			this.doUpstreamDiagnostics(document),
			this.doConsistentIndentationDiagnostics(document),
		]).then((diagnostics) => diagnostics.flatMap((diagnostic) => diagnostic));
	}

	private async doConsistentIndentationDiagnostics(
		document: TextDocument,
	): Promise<Diagnostic[]> {
		if (document.languageId !== "sass") {
			return [];
		}

		const lines = document.getText().split("\n");
		let firstIndentation;

		const diagnostics: Diagnostic[] = [];
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			if (!firstIndentation) {
				if (line.startsWith(TAB)) {
					firstIndentation = TAB;
				} else if (line.startsWith(SPACE)) {
					firstIndentation = SPACE;
				}
			}
			if (firstIndentation === TAB && line.startsWith(SPACE)) {
				diagnostics.push({
					message: "Got space for indentation when tab was expected",
					range: Range.create(Position.create(i, 0), Position.create(i, 1)),
					source: "Some Sass",
					severity: DiagnosticSeverity.Error,
				});
			} else if (firstIndentation === SPACE && line.startsWith(TAB)) {
				diagnostics.push({
					message: "Got tab for indentation when space was expected",
					range: Range.create(Position.create(i, 0), Position.create(i, 1)),
					source: "Some Sass",
					severity: DiagnosticSeverity.Error,
				});
			}
		}
		return diagnostics;
	}

	private async doUpstreamDiagnostics(document: TextDocument) {
		if (
			document.uri.endsWith(".vue") ||
			document.uri.endsWith(".astro") ||
			document.uri.endsWith(".svelte")
		) {
			return [];
		}

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
