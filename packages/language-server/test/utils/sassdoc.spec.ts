import { SymbolKind } from "@somesass/language-server-types";
import { describe, assert, test } from "vitest";
import { ScssSymbol } from "../../src/parser";
import { applySassDoc } from "../../src/utils/sassdoc";

describe("Utils/SassDoc", () => {
	test("applySassDoc empty state", () => {
		const noDoc: ScssSymbol = {
			name: "test",
			kind: SymbolKind.Property,
			offset: 0,
			position: {
				character: 0,
				line: 0,
			},
		};
		assert.strictEqual(applySassDoc(noDoc), "");
	});

	test("omits name if identical to symbol name", () => {
		const allDocs: ScssSymbol = {
			name: "test",
			kind: SymbolKind.Method,
			offset: 0,
			position: {
				character: 0,
				line: 0,
			},
			sassdoc: {
				commentRange: {
					start: 0,
					end: 0,
				},
				context: {
					code: "test",
					line: {
						start: 0,
						end: 0,
					},
					type: "mixin",
					name: "test",
					scope: "global",
				},
				description: "This is a description",
				name: "test",
			},
		};
		assert.strictEqual(applySassDoc(allDocs), `This is a description`);
	});

	test("omits access if public, even if defined", () => {
		const allDocs: ScssSymbol = {
			name: "test",
			kind: SymbolKind.Method,
			offset: 0,
			position: {
				character: 0,
				line: 0,
			},
			sassdoc: {
				commentRange: {
					start: 0,
					end: 0,
				},
				context: {
					code: "test",
					line: {
						start: 0,
						end: 0,
					},
					type: "mixin",
					name: "test",
					scope: "global",
				},
				description: "This is a description",
				access: "public",
			},
		};
		assert.strictEqual(applySassDoc(allDocs), `This is a description`);
	});

	test("applySassDoc maximal state", () => {
		const allDocs: ScssSymbol = {
			name: "test",
			kind: SymbolKind.Method,
			offset: 0,
			position: {
				character: 0,
				line: 0,
			},
			sassdoc: {
				commentRange: {
					start: 0,
					end: 0,
				},
				context: {
					code: "test",
					line: {
						start: 0,
						end: 0,
					},
					type: "mixin",
					name: "test",
					scope: "global",
				},
				description: "This is a description",
				access: "private",
				alias: "alias",
				aliased: ["test", "other-test"],
				author: ["Johnny Appleseed", "Foo Bar"],
				content: "Overrides for test defaults",
				deprecated: "No, but yes for testing",
				example: [
					{
						code: "@include test;",
						description: "Very helpful example",
						type: "scss",
					},
				],
				group: ["mixins", "helpers"],
				ignore: ["this", "that"],
				link: [
					{
						url: "http://localhost:8080",
						caption: "listen!",
					},
				],
				name: "Test name",
				output: "Things",
				parameter: [
					{
						name: "parameter",
						default: "yes",
						description: "helpful description",
						type: "string",
					},
				],
				property: [
					{
						path: "foo/bar",
						default: "yes",
						description: "what",
						name: "no",
						type: "number",
					},
				],
				require: [
					{
						name: "other-test",
						type: "string",
						autofill: true,
						description: "helpful description",
						external: true,
						url: "http://localhost:1337",
					},
				],
				return: { type: "string", description: "helpful result" },
				see: [
					{
						name: "other-thing",
						commentRange: {
							start: 0,
							end: 0,
						},
						context: {
							code: "test",
							line: {
								start: 0,
								end: 0,
							},
							type: "mixin",
							name: "test",
							scope: "global",
						},
						description: "This is a description",
					},
				],
				since: [
					{
						version: "0.0.1",
						description: "The beginning of time",
					},
				],
				throws: ["a fit"],
				todo: ["nothing"],
				type: ["color", "string"],
				usedBy: [
					{
						name: "other-thing",
						commentRange: {
							start: 0,
							end: 0,
						},
						context: {
							code: "test",
							line: {
								start: 0,
								end: 0,
							},
							type: "mixin",
							name: "test",
							scope: "global",
						},
						description: "This is a description",
					},
				],
			},
		};

		assert.strictEqual(
			applySassDoc(allDocs),
			`This is a description

@deprecated No, but yes for testing

@name Test name

@param string\`parameter\` [yes] - helpful description

@type color,string

@prop {number}\`foo/bar\` [yes] - what

@content Overrides for test defaults

@output Things

@return string - helpful result

@throw a fit

@require {string}\`other-test\` - helpful description http://localhost:1337

@alias \`alias\`

@see \`other-thing\`

@since 0.0.1 - The beginning of time

@author Johnny Appleseed

@author Foo Bar

[listen!](http://localhost:8080)

@example Very helpful example

\`\`\`scss
@include test;
\`\`\`

@access private

@group mixins, helpers

@todo nothing`,
		);
	});
});
