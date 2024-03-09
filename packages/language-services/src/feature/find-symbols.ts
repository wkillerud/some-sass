import {
	Range,
	SassDocumentSymbol,
	Stylesheet,
	SymbolKind,
	SyntaxNode,
	SyntaxNodeType,
	TextDocument,
	TreeCursor,
} from "@somesass/language-server-types";
import { SymbolTag } from "vscode";
import { typeToKind } from "./find-symbols/type-to-kind";

export class SassSymbolFinder {
	findDocumentSymbols(
		document: TextDocument,
		stylesheet: Stylesheet,
	): SassDocumentSymbol[] {
		const source = document.getText();
		const symbols = findTreeSymbols(document, source, stylesheet.cursor());

		return symbols;
	}
}

function findTreeSymbols(
	document: TextDocument,
	source: string,
	tree: TreeCursor,
): SassDocumentSymbol[] {
	const symbols: SassDocumentSymbol[] = [];
	do {
		const type = tree.type.name as SyntaxNodeType;
		const kind = typeToKind(type);
		if (!kind) {
			continue;
		}

		switch (type) {
			case SyntaxNodeType.PseudoClassSelector: {
				const symbol = findPseudoClassSelector(document, source, tree);
				symbols.push(symbol);
				break;
			}
			case SyntaxNodeType.MixinStatement: {
				const symbol = findMixinStatement(document, source, tree);
				symbols.push(symbol);
				break;
			}
			case SyntaxNodeType.CallExpression: {
				const symbol = findCallExpression(document, source, tree);
				symbols.push(symbol);
				break;
			}
			case SyntaxNodeType.Callee:
			case SyntaxNodeType.ArgList:
				// only interested in these as a children of other symbols
				break;
			case SyntaxNodeType.VariableName:
			case SyntaxNodeType.ClassSelector:
			default: {
				const symbol = findSymbol(document, source, tree);
				symbols.push(symbol);
				break;
			}
		}
	} while (tree.next());

	return symbols;
}

function findSymbol(
	document: TextDocument,
	source: string,
	tree: TreeCursor,
): SassDocumentSymbol {
	const type = tree.type.name as SyntaxNodeType;
	const kind = typeToKind(type) as SymbolKind;
	const from = tree.from;
	const to = tree.to;
	const parent = tree.node.parent;

	const range = Range.create(
		document.positionAt(parent ? parent.from : from),
		document.positionAt(parent ? parent.to : to),
	);

	const selectionRange = Range.create(
		document.positionAt(from),
		document.positionAt(to),
	);

	const name: string = source.substring(from, to);
	const detail: string | undefined = undefined;
	const tags: SymbolTag[] | undefined = undefined;

	const symbol: SassDocumentSymbol = {
		children: undefined,
		detail,
		kind,
		name,
		range,
		selectionRange,
		tags,
		type,
	};

	return symbol;
}

function findPseudoClassSelector(
	document: TextDocument,
	source: string,
	tree: TreeCursor,
): SassDocumentSymbol {
	const pseudoRoot = tree.node;
	const type = pseudoRoot.type.name as SyntaxNodeType;
	const kind = typeToKind(type) as SymbolKind;
	const from = pseudoRoot.from;
	const to = pseudoRoot.to;
	const parent = pseudoRoot.parent;

	const range = Range.create(
		document.positionAt(parent ? parent.from : from),
		document.positionAt(parent ? parent.to : to),
	);

	const selectionRange = Range.create(
		document.positionAt(from),
		document.positionAt(to),
	);

	const name: string = source.substring(from, to);
	const detail: string | undefined = undefined;
	const tags: SymbolTag[] | undefined = undefined;

	const children: SassDocumentSymbol[] = findPseudoClassSelectorChildren(
		pseudoRoot,
		tree,
		source,
		document,
	);

	const symbol: SassDocumentSymbol = {
		children,
		detail,
		kind,
		name,
		range,
		selectionRange,
		tags,
		type,
	};
	return symbol;
}

function findPseudoClassSelectorChildren(
	parent: SyntaxNode,
	tree: TreeCursor,
	source: string,
	document: TextDocument,
) {
	const children = [];
	const pseudoClassName = parent.getChild(SyntaxNodeType.PseudoClassName);
	if (pseudoClassName) {
		// Advance the cursor so we avoid duplicating the children as root-level symbols
		while (tree.type.name !== SyntaxNodeType.PseudoClassName) {
			tree.next();
		}
		const type = pseudoClassName.type.name as SyntaxNodeType;
		const kind = typeToKind(type) as SymbolKind;
		const from = pseudoClassName.from;
		const to = pseudoClassName.to;
		const pseudoParent = pseudoClassName.parent;

		const range = Range.create(
			document.positionAt(pseudoParent ? pseudoParent.from : from),
			document.positionAt(pseudoParent ? pseudoParent.to : to),
		);

		const selectionRange = Range.create(
			document.positionAt(from),
			document.positionAt(to),
		);

		const name: string = source.substring(from, to);
		const detail: string | undefined = undefined;
		const tags: SymbolTag[] | undefined = undefined;

		const symbol: SassDocumentSymbol = {
			children: undefined,
			detail,
			kind,
			name,
			range,
			selectionRange,
			tags,
			type,
		};
		children.push(symbol);
	}
	const argsList = parent.getChild(SyntaxNodeType.ArgList);
	if (argsList) {
		// Advance the cursor so we avoid duplicating the children as root-level symbols
		while (tree.type.name !== SyntaxNodeType.ArgList) {
			tree.next();
		}
		const value = argsList.getChild(SyntaxNodeType.ClassSelector);
		let args: SassDocumentSymbol[] | undefined = undefined;
		if (value) {
			// Advance the cursor so we avoid duplicating the children as root-level symbols
			// @ts-expect-error We've moved on, TS
			while (tree.type.name !== SyntaxNodeType.ClassSelector) {
				tree.next();
			}
			const type = value.type.name as SyntaxNodeType;
			const kind = typeToKind(type) as SymbolKind;
			const from = value.from;
			const to = value.to;
			const valueParent = value.parent;

			const range = Range.create(
				document.positionAt(valueParent ? valueParent.from : from),
				document.positionAt(valueParent ? valueParent.to : to),
			);

			const selectionRange = Range.create(
				document.positionAt(from),
				document.positionAt(to),
			);

			const name: string = source.substring(from, to);
			const detail: string | undefined = undefined;
			const tags: SymbolTag[] | undefined = undefined;

			const symbol: SassDocumentSymbol = {
				children: undefined,
				detail,
				kind,
				name,
				range,
				selectionRange,
				tags,
				type,
			};
			args = [symbol];
		}
		const type = argsList.type.name as SyntaxNodeType;
		const kind = typeToKind(type) as SymbolKind;
		const from = argsList.from;
		const to = argsList.to;
		const argsParent = argsList.parent;

		const range = Range.create(
			document.positionAt(argsParent ? argsParent.from : from),
			document.positionAt(argsParent ? argsParent.to : to),
		);

		const selectionRange = Range.create(
			document.positionAt(from),
			document.positionAt(to),
		);

		const name: string = source.substring(from, to);
		const detail: string | undefined = undefined;
		const tags: SymbolTag[] | undefined = undefined;

		const symbol: SassDocumentSymbol = {
			children: args,
			detail,
			kind,
			name,
			range,
			selectionRange,
			tags,
			type,
		};
		children.push(symbol);
	}
	return children;
}

/**
 * Handles both `@mixin` and `@function` statements, as the parser treats them both as MixinStatement.
 */
function findMixinStatement(
	document: TextDocument,
	source: string,
	tree: TreeCursor,
): SassDocumentSymbol {
	const type = tree.type.name as SyntaxNodeType;
	let kind = typeToKind(type) as SymbolKind;

	const from = tree.from;
	const to = tree.to;
	const node = tree.node;
	const parent = node.parent;

	const range = Range.create(
		document.positionAt(parent ? parent.from : from),
		document.positionAt(parent ? parent.to : to),
	);

	let selectionRange: Range;
	let name: string = source.substring(from, to);
	const detail: string | undefined = undefined;
	const tags: SymbolTag[] | undefined = undefined;

	const mixin = node.cursor();
	mixin.next(); // mixin

	const isFunction = source.substring(mixin.from, mixin.to) === "@function";
	if (isFunction) {
		kind = SymbolKind.Function;
	}

	mixin.next();

	let children: SassDocumentSymbol[] | undefined = undefined;
	if (mixin.type.name === SyntaxNodeType.CallExpression) {
		const pseudoRoot = mixin.node;
		children = findCallExpressionChildren(
			pseudoRoot,
			pseudoRoot.cursor(),
			source,
			document,
		);
	}

	if (
		mixin.type.name === SyntaxNodeType.ValueName ||
		mixin.type.name === SyntaxNodeType.CallExpression
	) {
		name = source.substring(mixin.from, mixin.to);
		selectionRange = Range.create(
			document.positionAt(mixin.from),
			document.positionAt(mixin.to),
		);
	} else {
		name = "<undefined>";
		selectionRange = {
			end: {
				character: 0,
				line: 0,
			},
			start: {
				character: 0,
				line: 0,
			},
		};
	}

	const symbol: SassDocumentSymbol = {
		children,
		detail,
		kind,
		name,
		range,
		selectionRange,
		tags,
		type,
	};
	return symbol;
}

function findCallExpressionChildren(
	parent: SyntaxNode,
	tree: TreeCursor,
	source: string,
	document: TextDocument,
) {
	const children = [];

	const callee = parent.getChild(SyntaxNodeType.Callee);
	if (callee) {
		// Advance the cursor so we avoid duplicating the children as root-level symbols
		while (tree.type.name !== SyntaxNodeType.Callee) {
			tree.next();
		}

		const type = callee.type.name as SyntaxNodeType;
		const kind = typeToKind(type) as SymbolKind;
		const from = callee.from;
		const to = callee.to;

		const calleeParent = callee.parent;
		const range = Range.create(
			document.positionAt(calleeParent ? calleeParent.from : from),
			document.positionAt(calleeParent ? calleeParent.to : to),
		);

		const selectionRange = Range.create(
			document.positionAt(from),
			document.positionAt(to),
		);

		const name: string = source.substring(from, to);
		const detail: string | undefined = undefined;
		const tags: SymbolTag[] | undefined = undefined;

		const symbol: SassDocumentSymbol = {
			children: undefined,
			detail,
			kind,
			name,
			range,
			selectionRange,
			tags,
			type,
		};
		children.push(symbol);
	}

	const argsList = parent.getChild(SyntaxNodeType.ArgList);
	if (argsList) {
		// Advance the cursor so we avoid duplicating the children as root-level symbols
		while (tree.type.name !== SyntaxNodeType.ArgList) {
			tree.next();
		}
		const sassVariables = argsList.getChildren(SyntaxNodeType.SassVariableName);
		let args: SassDocumentSymbol[] | undefined = undefined;
		if (sassVariables) {
			// Advance the cursor so we avoid duplicating the children as root-level symbols
			// @ts-expect-error We've moved on, TS
			while (tree.type.name !== SyntaxNodeType.SassVariableName) {
				tree.next();
			}
			const symbol = findSymbol(document, source, tree);
			args = [symbol];
		}
		const type = argsList.type.name as SyntaxNodeType;
		const kind = typeToKind(type) as SymbolKind;
		const from = argsList.from;
		const to = argsList.to;
		const argsParent = argsList.parent;

		const range = Range.create(
			document.positionAt(argsParent ? argsParent.from : from),
			document.positionAt(argsParent ? argsParent.to : to),
		);

		const selectionRange = Range.create(
			document.positionAt(from),
			document.positionAt(to),
		);

		const name: string = source.substring(from, to);
		const detail: string | undefined = undefined;
		const tags: SymbolTag[] | undefined = undefined;

		const symbol: SassDocumentSymbol = {
			children: args,
			detail,
			kind,
			name,
			range,
			selectionRange,
			tags,
			type,
		};
		children.push(symbol);
	}

	if (children.length === 0) {
		return undefined;
	}

	return children;
}
function findCallExpression(
	document: TextDocument,
	source: string,
	tree: TreeCursor,
) {
	const pseudoRoot = tree.node;
	const type = tree.type.name as SyntaxNodeType;
	const kind = typeToKind(type) as SymbolKind;
	const from = tree.from;
	const to = tree.to;
	const parent = tree.node.parent;

	const range = Range.create(
		document.positionAt(parent ? parent.from : from),
		document.positionAt(parent ? parent.to : to),
	);

	const selectionRange = Range.create(
		document.positionAt(from),
		document.positionAt(to),
	);

	const name: string = source.substring(from, to);
	const detail: string | undefined = undefined;
	const tags: SymbolTag[] | undefined = undefined;

	const children = findCallExpressionChildren(
		pseudoRoot,
		pseudoRoot.cursor(),
		source,
		document,
	);

	const symbol: SassDocumentSymbol = {
		children,
		detail,
		kind,
		name,
		range,
		selectionRange,
		tags,
		type,
	};

	return symbol;
}
