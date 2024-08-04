import { LanguageServiceConfiguration } from "@somesass/language-services";

export interface ISettings extends LanguageServiceConfiguration {
	scannerExclude: string[];
}

export interface IEditorSettings {
	insertSpaces: boolean;
	/** Introduced in 1.74 */
	indentSize: number | undefined;
	tabSize: number;
}

export const defaultSettings: Readonly<ISettings> = {
	scannerExclude: [
		"**/.git/**",
		"**/node_modules/**",
		"**/bower_components/**",
	],
	loadPaths: [],
	scss: {
		completion: {
			suggestAllFromOpenDocument: true,
			suggestionStyle: "all",
			suggestFromUseOnly: false,
			suggestFunctionsInStringContextAfterSymbols: " (+-*%",
		},
	},
	sass: {
		completion: {
			suggestionStyle: "all",
			suggestFromUseOnly: false,
			suggestFunctionsInStringContextAfterSymbols: " (+-*%",
			triggerPropertyValueCompletion: true,
		},
	},
};
