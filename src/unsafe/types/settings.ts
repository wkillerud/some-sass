'use strict';

export interface ISettings {
	// Scanner
	scannerDepth: number;
	scannerExclude: string[];
	scanImportedFiles: boolean;

	// Display
	showErrors: boolean;

	// Suggestions
	suggestVariables: boolean;
	suggestMixins: boolean;
	suggestFunctions: boolean;
	suggestFunctionsInStringContextAfterSymbols: string;
}
