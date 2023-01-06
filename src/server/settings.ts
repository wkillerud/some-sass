export interface ISettings {
	readonly scannerDepth: number;
	readonly scannerExclude: string[];
	readonly scanImportedFiles: boolean;
	readonly suggestAllFromOpenDocument: boolean;
	readonly suggestFromUseOnly: boolean;
	readonly suggestFunctionsInStringContextAfterSymbols: string;
}

export interface IEditorSettings {
	insertSpaces: boolean;
	/** Introduced in 1.74 */
	indentSize: number | undefined;
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
	suggestAllFromOpenDocument: true,
	suggestFromUseOnly: true,
	suggestFunctionsInStringContextAfterSymbols: " (+-*%",
});
