export interface ISettings {
	readonly loadPaths: string[];
	readonly scannerDepth: number;
	readonly scannerExclude: string[];
	readonly scanImportedFiles: boolean;
	readonly suggestionStyle: "all" | "nobracket" | "bracket";
	readonly suggestAllFromOpenDocument: boolean;
	readonly suggestFromUseOnly: boolean;
	readonly suggestFunctionsInStringContextAfterSymbols: string;
	readonly triggerPropertyValueCompletion: boolean;
}

export interface IEditorSettings {
	insertSpaces: boolean;
	/** Introduced in 1.74 */
	indentSize: number | undefined;
	tabSize: number;
}

export const defaultSettings: ISettings = Object.freeze({
	loadPaths: [],
	scannerDepth: 30,
	scannerExclude: [
		"**/.git/**",
		"**/node_modules/**",
		"**/bower_components/**",
	],
	scanImportedFiles: true,
	suggestionStyle: "all",
	suggestAllFromOpenDocument: true,
	suggestFromUseOnly: true,
	suggestFunctionsInStringContextAfterSymbols: " (+-*%",
	triggerPropertyValueCompletion: true,
});
