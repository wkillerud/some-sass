/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
"use strict";

import { Parser } from "./parser/cssParser";
import { CSSCompletion } from "./services/cssCompletion";
import { CSSHover } from "./services/cssHover";
import { CSSNavigation } from "./services/cssNavigation";
import { CSSCodeActions } from "./services/cssCodeActions";
import { CSSValidation } from "./services/cssValidation";

import { SassParser } from "./parser/sassParser";
import { SassCompletion } from "./services/sassCompletion";
import { getFoldingRanges } from "./services/cssFolding";

import {
	LanguageSettings,
	ICompletionParticipant,
	DocumentContext,
	LanguageServiceOptions,
	Diagnostic,
	Position,
	CompletionList,
	Hover,
	Location,
	DocumentHighlight,
	SymbolInformation,
	Range,
	CodeActionContext,
	Command,
	CodeAction,
	ColorInformation,
	Color,
	ColorPresentation,
	WorkspaceEdit,
	FoldingRange,
	SelectionRange,
	TextDocument,
	ICSSDataProvider,
	CSSDataV1,
	HoverSettings,
	CompletionSettings,
	DocumentSymbol,
	StylesheetDocumentLink,
} from "./cssLanguageTypes";

import { CSSDataManager } from "./languageFacts/dataManager";
import { CSSDataProvider } from "./languageFacts/dataProvider";
import { getSelectionRanges } from "./services/cssSelectionRange";
import { SassNavigation } from "./services/sassNavigation";
import { cssData } from "./data/webCustomData";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type Stylesheet = {};

export { TokenType, IToken, Scanner } from "./parser/cssScanner";
export { SassScanner as SCSSScanner } from "./parser/sassScanner";
export * from "./parser/cssNodes";
export * from "./cssLanguageTypes";

export interface LanguageService {
	configure(raw?: LanguageSettings): void;
	setDataProviders(useDefaultDataProvider: boolean, customDataProviders: ICSSDataProvider[]): void;
	doValidation(document: TextDocument, stylesheet: Stylesheet, documentSettings?: LanguageSettings): Diagnostic[];
	parseStylesheet(document: TextDocument): Stylesheet;
	doComplete(
		document: TextDocument,
		position: Position,
		stylesheet: Stylesheet,
		settings?: CompletionSettings,
	): CompletionList;
	doComplete2(
		document: TextDocument,
		position: Position,
		stylesheet: Stylesheet,
		documentContext: DocumentContext,
		settings?: CompletionSettings,
	): Promise<CompletionList>;
	setCompletionParticipants(registeredCompletionParticipants: ICompletionParticipant[]): void;
	doHover(document: TextDocument, position: Position, stylesheet: Stylesheet, settings?: HoverSettings): Hover | null;
	findDefinition(document: TextDocument, position: Position, stylesheet: Stylesheet): Location | null;
	findReferences(document: TextDocument, position: Position, stylesheet: Stylesheet): Location[];
	findDocumentHighlights(document: TextDocument, position: Position, stylesheet: Stylesheet): DocumentHighlight[];
	findDocumentLinks(
		document: TextDocument,
		stylesheet: Stylesheet,
		documentContext: DocumentContext,
	): StylesheetDocumentLink[];
	/**
	 * Return statically resolved links, and dynamically resolved links if `fsProvider` is proved.
	 */
	findDocumentLinks2(
		document: TextDocument,
		stylesheet: Stylesheet,
		documentContext: DocumentContext,
	): Promise<StylesheetDocumentLink[]>;
	findDocumentSymbols(document: TextDocument, stylesheet: Stylesheet): SymbolInformation[];
	findDocumentSymbols2(document: TextDocument, stylesheet: Stylesheet): DocumentSymbol[];
	doCodeActions(document: TextDocument, range: Range, context: CodeActionContext, stylesheet: Stylesheet): Command[];
	doCodeActions2(
		document: TextDocument,
		range: Range,
		context: CodeActionContext,
		stylesheet: Stylesheet,
	): CodeAction[];
	findDocumentColors(document: TextDocument, stylesheet: Stylesheet): ColorInformation[];
	getColorPresentations(
		document: TextDocument,
		stylesheet: Stylesheet,
		color: Color,
		range: Range,
	): ColorPresentation[];
	prepareRename(document: TextDocument, position: Position, stylesheet: Stylesheet): Range | undefined;
	doRename(document: TextDocument, position: Position, newName: string, stylesheet: Stylesheet): WorkspaceEdit;
	getFoldingRanges(document: TextDocument, context?: { rangeLimit?: number }): FoldingRange[];
	getSelectionRanges(document: TextDocument, positions: Position[], stylesheet: Stylesheet): SelectionRange[];
}

export function getDefaultCSSDataProvider(): ICSSDataProvider {
	return newCSSDataProvider(cssData);
}

export function newCSSDataProvider(data: CSSDataV1): ICSSDataProvider {
	return new CSSDataProvider(data);
}

function createFacade(
	parser: Parser,
	completion: CSSCompletion,
	hover: CSSHover,
	navigation: CSSNavigation,
	codeActions: CSSCodeActions,
	validation: CSSValidation,
	cssDataManager: CSSDataManager,
): LanguageService {
	return {
		configure: (settings) => {
			validation.configure(settings);
			completion.configure(settings?.completion);
			hover.configure(settings?.hover);
			navigation.configure(settings?.importAliases, settings?.loadPaths);
		},
		setDataProviders: cssDataManager.setDataProviders.bind(cssDataManager),
		doValidation: validation.doValidation.bind(validation),
		parseStylesheet: parser.parseStylesheet.bind(parser),
		doComplete: completion.doComplete.bind(completion),
		doComplete2: completion.doComplete2.bind(completion),
		setCompletionParticipants: completion.setCompletionParticipants.bind(completion),
		doHover: hover.doHover.bind(hover),
		findDefinition: navigation.findDefinition.bind(navigation),
		findReferences: navigation.findReferences.bind(navigation),
		findDocumentHighlights: navigation.findDocumentHighlights.bind(navigation),
		findDocumentLinks: navigation.findDocumentLinks.bind(navigation),
		findDocumentLinks2: navigation.findDocumentLinks2.bind(navigation),
		findDocumentSymbols: navigation.findSymbolInformations.bind(navigation),
		findDocumentSymbols2: navigation.findDocumentSymbols.bind(navigation),
		doCodeActions: codeActions.doCodeActions.bind(codeActions),
		doCodeActions2: codeActions.doCodeActions2.bind(codeActions),
		findDocumentColors: navigation.findDocumentColors.bind(navigation),
		getColorPresentations: navigation.getColorPresentations.bind(navigation),
		prepareRename: navigation.prepareRename.bind(navigation),
		doRename: navigation.doRename.bind(navigation),
		getFoldingRanges,
		getSelectionRanges,
	};
}

const defaultLanguageServiceOptions = {};

export function getCSSLanguageService(
	options: LanguageServiceOptions = defaultLanguageServiceOptions,
): LanguageService {
	const cssDataManager = new CSSDataManager(options);
	return createFacade(
		new Parser(),
		new CSSCompletion(null, options, cssDataManager),
		new CSSHover(options && options.clientCapabilities, cssDataManager),
		new CSSNavigation(options && options.fileSystemProvider, false),
		new CSSCodeActions(cssDataManager),
		new CSSValidation(cssDataManager),
		cssDataManager,
	);
}

export function getSassLanguageService(
	options: LanguageServiceOptions = defaultLanguageServiceOptions,
): LanguageService {
	const cssDataManager = new CSSDataManager(options);
	return createFacade(
		new SassParser(),
		new SassCompletion(options, cssDataManager),
		new CSSHover(options && options.clientCapabilities, cssDataManager),
		new SassNavigation(options && options.fileSystemProvider),
		new CSSCodeActions(cssDataManager),
		new CSSValidation(cssDataManager),
		cssDataManager,
	);
}
