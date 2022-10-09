export interface ISettings {
	// Scanner
	readonly scannerDepth: number;
	readonly scannerExclude: string[];
	readonly scanImportedFiles: boolean;

	// Display
	readonly showErrors: boolean;

	// Suggestions
	readonly suggestAllFromOpenDocument: boolean;
	readonly suggestFromUseOnly: boolean;
	readonly suggestVariables: boolean;
	readonly suggestMixins: boolean;
	readonly suggestFunctions: boolean;
	readonly suggestFunctionsInStringContextAfterSymbols: string;
}

export interface IEditorSettings {
	insertSpaces: boolean;
	tabSize: number;
}

export const defaultSettings: ISettings = Object.freeze({
	scannerDepth: 30,
	scannerExclude: [
		"**/.git/**",
		"**/node_modules/**",
		"**/bower_components/**",
	],
	scanImportedFiles: true,
	showErrors: false,
	suggestAllFromOpenDocument: true,
	suggestFromUseOnly: true,
	suggestVariables: true,
	suggestMixins: true,
	suggestFunctions: true,
	suggestFunctionsInStringContextAfterSymbols: " (+-*%",
});
