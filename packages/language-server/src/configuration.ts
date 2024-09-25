import {
	defaultConfiguration,
	type LanguageServiceConfiguration,
} from "@somesass/language-services";

export function toNewConfiguration(
	v1: Partial<ConfigurationV1>,
): LanguageServiceConfiguration {
	const newSettings = Object.assign({}, defaultConfiguration, v1);
	if (v1.loadPaths) newSettings.workspace.loadPaths = v1.loadPaths;
	if (v1.scannerExclude) newSettings.workspace.exclude = v1.scannerExclude;

	if (typeof v1.suggestAllFromOpenDocument !== "undefined") {
		newSettings.css.completion.includeFromCurrentDocument =
			v1.suggestAllFromOpenDocument;
	}
	if (typeof v1.suggestionStyle !== "undefined") {
		newSettings.css.completion.mixinStyle = v1.suggestionStyle;
	}
	if (typeof v1.suggestFromUseOnly !== "undefined") {
		newSettings.css.completion.suggestFromUseOnly = v1.suggestFromUseOnly;
	}
	if (typeof v1.triggerPropertyValueCompletion !== "undefined") {
		newSettings.css.completion.triggerPropertyValueCompletion =
			v1.triggerPropertyValueCompletion;
	}

	if (typeof v1.suggestAllFromOpenDocument !== "undefined") {
		newSettings.sass.completion.includeFromCurrentDocument =
			v1.suggestAllFromOpenDocument;
	}
	if (typeof v1.suggestionStyle !== "undefined") {
		newSettings.sass.completion.mixinStyle = v1.suggestionStyle;
	}
	if (typeof v1.suggestFromUseOnly !== "undefined") {
		newSettings.sass.completion.suggestFromUseOnly = v1.suggestFromUseOnly;
	}
	if (typeof v1.triggerPropertyValueCompletion !== "undefined") {
		newSettings.sass.completion.triggerPropertyValueCompletion =
			v1.triggerPropertyValueCompletion;
	}

	if (typeof v1.suggestAllFromOpenDocument !== "undefined") {
		newSettings.scss.completion.includeFromCurrentDocument =
			v1.suggestAllFromOpenDocument;
	}
	if (typeof v1.suggestionStyle !== "undefined") {
		newSettings.scss.completion.mixinStyle = v1.suggestionStyle;
	}
	if (typeof v1.suggestFromUseOnly !== "undefined") {
		newSettings.scss.completion.suggestFromUseOnly = v1.suggestFromUseOnly;
	}
	if (typeof v1.triggerPropertyValueCompletion !== "undefined") {
		newSettings.scss.completion.triggerPropertyValueCompletion =
			v1.triggerPropertyValueCompletion;
	}

	return newSettings;
}

export function isOldConfiguration(
	maybeV1: Partial<LanguageServiceConfiguration | ConfigurationV1>,
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
