import { LanguageServerConfiguration } from "./language-services-types";

export const defaultConfiguration: LanguageServerConfiguration = {
	workspace: {
		exclude: ["**/.git/**", "**/node_modules/**"],
		importAliases: {},
		loadPaths: [],
		logLevel: "info",
	},
	editor: {
		colorDecoratorsLimit: 500,
		insertSpaces: false,
		indentSize: 2,
		tabSize: 2,
	},
	css: {
		codeAction: {
			enabled: true,
		},
		completion: {
			enabled: true,
			includeFromCurrentDocument: true,
			completePropertyWithSemicolon: true,
			triggerPropertyValueCompletion: true,
		},
		colors: {
			enabled: true,
			includeFromCurrentDocument: true,
		},
		definition: {
			enabled: true,
		},
		diagnostics: {
			enabled: true,
			deprecation: {
				enabled: true,
			},
			lint: {
				enabled: true,
				compatibleVendorPrefixes: "ignore",
				vendorPrefix: "warning",
				duplicateProperties: "ignore",
				emptyRules: "warning",
				importStatement: "ignore",
				boxModel: "ignore",
				universalSelector: "ignore",
				zeroUnits: "ignore",
				fontFaceProperties: "warning",
				hexColorLength: "error",
				argumentsInColorFunction: "error",
				unknownProperties: "warning",
				validProperties: [],
				ieHack: "ignore",
				unknownVendorSpecificProperties: "ignore",
				propertyIgnoredDueToDisplay: "warning",
				important: "ignore",
				float: "ignore",
				idSelector: "ignore",
				unknownAtRules: "warning",
			},
		},
		foldingRanges: {
			enabled: true,
		},
		highlights: {
			enabled: true,
		},
		hover: {
			enabled: true,
			documentation: true,
			references: true,
		},
		links: {
			enabled: true,
		},
		references: {
			enabled: true,
		},
		rename: {
			enabled: true,
		},
		selectionRanges: {
			enabled: true,
		},
		semanticTokens: {
			enabled: true,
		},
		signatureHelp: {
			enabled: true,
		},
		workspaceSymbol: {
			enabled: true,
		},
	},
	scss: {
		codeAction: {
			enabled: true,
		},
		completion: {
			enabled: true,
			mixinStyle: "all",
			includeFromCurrentDocument: true,
			suggestFromUseOnly: false,
			triggerPropertyValueCompletion: true,
		},
		colors: {
			enabled: true,
			includeFromCurrentDocument: true,
		},
		definition: {
			enabled: true,
		},
		diagnostics: {
			enabled: true,
			deprecation: {
				enabled: true,
			},
			lint: {
				enabled: true,
				compatibleVendorPrefixes: "ignore",
				vendorPrefix: "warning",
				duplicateProperties: "ignore",
				emptyRules: "warning",
				importStatement: "ignore",
				boxModel: "ignore",
				universalSelector: "ignore",
				zeroUnits: "ignore",
				fontFaceProperties: "warning",
				hexColorLength: "error",
				argumentsInColorFunction: "error",
				unknownProperties: "warning",
				validProperties: [],
				ieHack: "ignore",
				unknownVendorSpecificProperties: "ignore",
				propertyIgnoredDueToDisplay: "warning",
				important: "ignore",
				float: "ignore",
				idSelector: "ignore",
				unknownAtRules: "warning",
			},
		},
		foldingRanges: {
			enabled: true,
		},
		highlights: {
			enabled: true,
		},
		hover: {
			enabled: true,
			documentation: true,
			references: true,
		},
		links: {
			enabled: true,
		},
		references: {
			enabled: true,
		},
		rename: {
			enabled: true,
		},
		selectionRanges: {
			enabled: true,
		},
		semanticTokens: {
			enabled: true,
		},
		signatureHelp: {
			enabled: true,
		},
		workspaceSymbol: {
			enabled: true,
		},
	},
	sass: {
		codeAction: {
			enabled: true,
		},
		completion: {
			enabled: true,
			mixinStyle: "all",
			includeFromCurrentDocument: true,
			suggestFromUseOnly: false,
			triggerPropertyValueCompletion: true,
		},
		colors: {
			enabled: true,
			includeFromCurrentDocument: true,
		},
		definition: {
			enabled: true,
		},
		diagnostics: {
			enabled: true,
			deprecation: {
				enabled: true,
			},
			lint: {
				enabled: true,
				compatibleVendorPrefixes: "ignore",
				vendorPrefix: "warning",
				duplicateProperties: "ignore",
				emptyRules: "warning",
				importStatement: "ignore",
				boxModel: "ignore",
				universalSelector: "ignore",
				zeroUnits: "ignore",
				fontFaceProperties: "warning",
				hexColorLength: "error",
				argumentsInColorFunction: "error",
				unknownProperties: "warning",
				validProperties: [],
				ieHack: "ignore",
				unknownVendorSpecificProperties: "ignore",
				propertyIgnoredDueToDisplay: "warning",
				important: "ignore",
				float: "ignore",
				idSelector: "ignore",
				unknownAtRules: "warning",
			},
		},
		foldingRanges: {
			enabled: true,
		},
		highlights: {
			enabled: true,
		},
		hover: {
			enabled: true,
			documentation: true,
			references: true,
		},
		links: {
			enabled: true,
		},
		references: {
			enabled: true,
		},
		rename: {
			enabled: true,
		},
		selectionRanges: {
			enabled: true,
		},
		semanticTokens: {
			enabled: true,
		},
		signatureHelp: {
			enabled: true,
		},
		workspaceSymbol: {
			enabled: true,
		},
	},
};
