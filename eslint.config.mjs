// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	eslintConfigPrettier,
	{
		ignores: [
			"vscode-extension/.vscode-test/",
			"vscode-extension/.vscode-test-web/",
			"vscode-extension/test/e2e/",
			"vscode-extension/test/web/",
			"**/dist/**",
			"**/lib/**",
		],
	},
	{
		rules: {
			"prefer-const": "off",
			"prefer-spread": "off",
			"no-empty": "off",
			"no-useless-escape": "off",
			"no-prototype-builtins": "off",
			"no-case-declarations": "off",
			"@typescript-eslint/ban-types": "off",
			"@typescript-eslint/no-namespace": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-this-alias": "off",
			"@typescript-eslint/no-unused-vars": "warn",
		},
	},
);
