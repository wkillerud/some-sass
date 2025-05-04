// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-plugin-prettier/recommended";
import depend from "eslint-plugin-depend";

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	eslintConfigPrettier,
	{
		files: ["**/*.ts"],
		plugins: {
			depend,
		},
		rules: {
			"depend/ban-dependencies": "error",
		},
	},
	{
		ignores: [
			"vscode-extension/.vscode-test/",
			"vscode-extension/.vscode-test-web/",
			"vscode-extension/test/",
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
