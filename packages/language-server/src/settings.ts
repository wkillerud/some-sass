export interface ISettings {
	readonly loadPaths: string[];
	readonly scannerExclude: string[];
	readonly scannerDepth: number;
	readonly scanImportedFiles: boolean;
	readonly suggestionStyle: "all" | "nobracket" | "bracket";
	readonly suggestAllFromOpenDocument: boolean;
	readonly suggestFromUseOnly: boolean;
	readonly suggestFunctionsInStringContextAfterSymbols: " (+-*%";
	readonly triggerPropertyValueCompletion: boolean;
	readonly completion?: {
		afterModule?: string;
		beforeVariable?: string;
	};
	readonly scss?: {
		completion?: {
			afterModule?: string;
			beforeVariable?: string;
		};
	};
	readonly sass?: {
		completion?: {
			afterModule?: string;
			beforeVariable?: string;
		};
	};
	readonly astro?: {
		completion?: {
			afterModule?: string;
			beforeVariable?: string;
		};
	};
	readonly vue?: {
		completion?: {
			afterModule?: string;
			beforeVariable?: string;
		};
	};
	readonly svelte?: {
		completion?: {
			afterModule?: string;
			beforeVariable?: string;
		};
	};
}

export interface IEditorSettings {
	insertSpaces: boolean;
	/** Introduced in 1.74 */
	indentSize: number | undefined;
	tabSize: number;
}

export const defaultSettings: ISettings = Object.freeze({
	loadPaths: [],
	scannerExclude: [
		"**/.git/**",
		"**/node_modules/**",
		"**/bower_components/**",
	],
	scannerDepth: 30,
	scanImportedFiles: true,
	// This setting is essentially "VS Code Compat Mode" if set to false.
	suggestAllFromOpenDocument: true,
	suggestionStyle: "all",
	suggestFromUseOnly: false,
	suggestFunctionsInStringContextAfterSymbols: " (+-*%",
	triggerPropertyValueCompletion: true,
});
