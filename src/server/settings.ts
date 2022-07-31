export interface ISettings {
	// Scanner
	scannerDepth: number;
	scannerExclude: string[];
	scanImportedFiles: boolean;

	// Display
	showErrors: boolean;

	// Suggestions
	suggestAllFromOpenDocument: boolean;
	suggestFromUseOnly: boolean;
	suggestVariables: boolean;
	suggestMixins: boolean;
	suggestFunctions: boolean;
	suggestFunctionsInStringContextAfterSymbols: string;
}
