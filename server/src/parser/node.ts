/**
 * Must be synced with https://github.com/microsoft/vscode-css-languageservice/blob/main/src/parser/cssNodes.ts
 * when upgrading vscode-css-languageservice.
 */
export enum NodeType {
	Undefined,
	Identifier,
	Stylesheet,
	Ruleset,
	Selector,
	SimpleSelector,
	SelectorInterpolation,
	SelectorCombinator,
	SelectorCombinatorParent,
	SelectorCombinatorSibling,
	SelectorCombinatorAllSiblings,
	SelectorCombinatorShadowPiercingDescendant,
	Page,
	PageBoxMarginBox,
	ClassSelector,
	IdentifierSelector,
	ElementNameSelector,
	PseudoSelector,
	AttributeSelector,
	Declaration,
	Declarations,
	Property,
	Expression,
	BinaryExpression,
	Term,
	Operator,
	Value,
	StringLiteral,
	URILiteral,
	EscapedValue,
	Function,
	NumericValue,
	HexColorValue,
	RatioValue,
	MixinDeclaration,
	MixinReference,
	VariableName,
	VariableDeclaration,
	Prio,
	Interpolation,
	NestedProperties,
	ExtendsReference,
	SelectorPlaceholder,
	Debug,
	If,
	Else,
	For,
	Each,
	While,
	MixinContentReference,
	MixinContentDeclaration,
	Media,
	Keyframe,
	FontFace,
	Import,
	Namespace,
	Invocation,
	FunctionDeclaration,
	ReturnStatement,
	MediaQuery,
	MediaCondition,
	MediaFeature,
	FunctionParameter,
	FunctionArgument,
	KeyframeSelector,
	ViewPort,
	Document,
	AtApplyRule,
	CustomPropertyDeclaration,
	CustomPropertySet,
	ListEntry,
	Supports,
	SupportsCondition,
	NamespacePrefix,
	GridLine,
	Plugin,
	UnknownAtRule,
	Use,
	ModuleConfiguration,
	Forward,
	ForwardVisibility,
	Module,
	UnicodeRange,
	Layer,
	LayerNameList,
	LayerName,
	PropertyAtRule,
	Container,
}

export interface INode {
	type: NodeType;
	offset: number;
	length: number;
	end: number;
	accept: (node: (node: INode) => boolean) => boolean;
	getName: () => string;
	getValue: () => INode;
	getDefaultValue: () => INode;
	getText: () => string;
	getParameters: () => INode;
	getIdentifier: () => INode;
	getParent: () => INode;
	getChildren: () => INode[];
	getChild: (index: number) => INode;
	getSelectors: () => INode;
}
