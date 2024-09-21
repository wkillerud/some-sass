import {
	defaultConfiguration,
	type LanguageServerConfiguration,
} from "@somesass/language-services";

export function toNewConfiguration(
	v1: Partial<ConfigurationV1>,
): LanguageServerConfiguration {
	const newSettings = Object.assign({}, defaultConfiguration);
	if (v1.loadPaths) newSettings.workspace.loadPaths = v1.loadPaths;
	if (v1.scannerExclude) newSettings.workspace.exclude = v1.scannerExclude;

	if (typeof v1.suggestAllFromOpenDocument !== "undefined") {
		newSettings.css.completions.includeFromCurrentDocument =
			v1.suggestAllFromOpenDocument;
	}
	if (typeof v1.suggestionStyle !== "undefined") {
		newSettings.css.completions.mixinStyle = v1.suggestionStyle;
	}
	if (typeof v1.suggestFromUseOnly !== "undefined") {
		newSettings.css.completions.suggestFromUseOnly = v1.suggestFromUseOnly;
	}
	if (typeof v1.triggerPropertyValueCompletion !== "undefined") {
		newSettings.css.completions.triggerPropertyValueCompletion =
			v1.triggerPropertyValueCompletion;
	}

	if (typeof v1.suggestAllFromOpenDocument !== "undefined") {
		newSettings.sass.completions.includeFromCurrentDocument =
			v1.suggestAllFromOpenDocument;
	}
	if (typeof v1.suggestionStyle !== "undefined") {
		newSettings.sass.completions.mixinStyle = v1.suggestionStyle;
	}
	if (typeof v1.suggestFromUseOnly !== "undefined") {
		newSettings.sass.completions.suggestFromUseOnly = v1.suggestFromUseOnly;
	}
	if (typeof v1.triggerPropertyValueCompletion !== "undefined") {
		newSettings.sass.completions.triggerPropertyValueCompletion =
			v1.triggerPropertyValueCompletion;
	}

	if (typeof v1.suggestAllFromOpenDocument !== "undefined") {
		newSettings.scss.completions.includeFromCurrentDocument =
			v1.suggestAllFromOpenDocument;
	}
	if (typeof v1.suggestionStyle !== "undefined") {
		newSettings.scss.completions.mixinStyle = v1.suggestionStyle;
	}
	if (typeof v1.suggestFromUseOnly !== "undefined") {
		newSettings.scss.completions.suggestFromUseOnly = v1.suggestFromUseOnly;
	}
	if (typeof v1.triggerPropertyValueCompletion !== "undefined") {
		newSettings.scss.completions.triggerPropertyValueCompletion =
			v1.triggerPropertyValueCompletion;
	}

	return newSettings;
}

export function isOldConfiguration(
	maybeV1: Partial<LanguageServerConfiguration | ConfigurationV1>,
) {
	const asV1 = maybeV1 as Partial<ConfigurationV1>;
	if (typeof asV1.loadPaths !== "undefined") return true;
	if (typeof asV1.scannerExclude !== "undefined") return true;
	if (typeof asV1.scannerDepth !== "undefined") return true;
	if (typeof asV1.scanImportedFiles !== "undefined") return true;
	if (typeof asV1.suggestionStyle !== "undefined") return true;
	if (typeof asV1.suggestAllFromOpenDocument !== "undefined") return true;
	if (typeof asV1.suggestFromUseOnly !== "undefined") return true;
	if (typeof asV1.suggestFunctionsInStringContextAfterSymbols !== "undefined")
		return true;
	if (typeof asV1.triggerPropertyValueCompletion !== "undefined") return true;
	return false;
}

export interface ConfigurationV1 {
	readonly loadPaths: string[];
	readonly scannerExclude: string[];
	readonly scannerDepth: number;
	readonly scanImportedFiles: boolean;
	readonly suggestionStyle: "all" | "nobracket" | "bracket";
	readonly suggestAllFromOpenDocument: boolean;
	readonly suggestFromUseOnly: boolean;
	readonly suggestFunctionsInStringContextAfterSymbols: " (+-*%";
	readonly triggerPropertyValueCompletion: boolean;
}
