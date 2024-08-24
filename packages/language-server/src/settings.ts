export interface ISettings {
	loadPaths?: string[];
	scannerExclude: string[];
	scannerDepth?: number;
	scanImportedFiles?: boolean;
	suggestionStyle?: "all" | "nobracket" | "bracket";
	suggestAllFromOpenDocument?: boolean;
	suggestFromUseOnly?: boolean;
	suggestFunctionsInStringContextAfterSymbols?: " (+-*%";
	triggerPropertyValueCompletion?: boolean;
}

export interface IEditorSettings {
	insertSpaces: boolean;
	/** Introduced in 1.74 */
	indentSize: number | undefined;
	tabSize: number;
}

export const defaultSettings: Readonly<Required<ISettings>> = {
	loadPaths: [],
	scannerExclude: [
		"**/.git/**",
		"**/node_modules/**",
		"**/bower_components/**",
	],
	scannerDepth: 30,
	scanImportedFiles: true,
	suggestAllFromOpenDocument: true,
	suggestionStyle: "all",
	suggestFromUseOnly: false,
	suggestFunctionsInStringContextAfterSymbols: " (+-*%",
	triggerPropertyValueCompletion: true,
};
