import { test, assert, beforeEach } from "vitest";
import {
	DiagnosticSeverity,
	DiagnosticTag,
	getLanguageService,
} from "../../language-services";
import { getOptions } from "../../utils/test-helpers";

const { fileSystemProvider, ...rest } = getOptions();
const ls = getLanguageService({ fileSystemProvider, ...rest });

beforeEach(() => {
	ls.clearCache();
});

test("reports a deprecated variable declared in the same document", async () => {
	const document = fileSystemProvider.createDocument([
		"/// @deprecated",
		"$a: 1;",
		".a { content: $a; }",
	]);

	const result = await ls.doDiagnostics(document);

	assert.deepStrictEqual(result, [
		{
			message: "$a is deprecated",
			range: {
				start: {
					line: 2,
					character: 14,
				},
				end: {
					line: 2,
					character: 16,
				},
			},
			severity: DiagnosticSeverity.Hint,
			source: "Some Sass",
			tags: [DiagnosticTag.Deprecated],
		},
	]);
});

test("includes the deprecation message if one is given", async () => {
	const document = fileSystemProvider.createDocument([
		"/// @deprecated Use something else",
		"$a: 1;",
		".a { content: $a; }",
	]);

	const result = await ls.doDiagnostics(document);

	assert.deepStrictEqual(result, [
		{
			message: "Use something else",
			range: {
				start: {
					line: 2,
					character: 14,
				},
				end: {
					line: 2,
					character: 16,
				},
			},
			severity: DiagnosticSeverity.Hint,
			source: "Some Sass",
			tags: [DiagnosticTag.Deprecated],
		},
	]);
});

test("reports a deprecated function declared in the same document", async () => {
	const document = fileSystemProvider.createDocument([
		"/// @deprecated",
		"@function old-function() {",
		"  @return 1;",
		"}",
		".a { content: old-function(); }",
	]);

	const result = await ls.doDiagnostics(document);

	assert.deepStrictEqual(result, [
		{
			message: "old-function is deprecated",
			range: {
				start: {
					line: 4,
					character: 14,
				},
				end: {
					line: 4,
					character: 26,
				},
			},
			severity: DiagnosticSeverity.Hint,
			source: "Some Sass",
			tags: [DiagnosticTag.Deprecated],
		},
	]);
});

test("reports a deprecated mixin declared in the same document", async () => {
	const document = fileSystemProvider.createDocument([
		"/// @deprecated",
		"@mixin old-mixin {",
		"  content: 'mixin';",
		"}",
		".a { @include old-mixin(); }",
	]);

	const result = await ls.doDiagnostics(document);

	assert.deepStrictEqual(result, [
		{
			message: "old-mixin is deprecated",
			range: {
				start: {
					line: 4,
					character: 14,
				},
				end: {
					line: 4,
					character: 23,
				},
			},
			severity: DiagnosticSeverity.Hint,
			source: "Some Sass",
			tags: [DiagnosticTag.Deprecated],
		},
	]);
});

test("reports a deprecated variable with prefix", async () => {
	const variables = fileSystemProvider.createDocument(
		["/// @deprecated", "$old-a: 1;"],
		{ uri: "variables.scss" },
	);
	const forward = fileSystemProvider.createDocument(
		"@forward './variables' as var-*;",
		{ uri: "namespace.scss" },
	);
	const document = fileSystemProvider.createDocument([
		"@use 'namespace' as ns;",
		".foo {",
		"  color: ns.$var-old-a;",
		"}",
	]);

	ls.parseStylesheet(variables);
	ls.parseStylesheet(forward);

	const result = await ls.doDiagnostics(document);

	assert.deepStrictEqual(result, [
		{
			message: "$old-a is deprecated",
			range: {
				start: {
					line: 2,
					character: 12,
				},
				end: {
					line: 2,
					character: 22,
				},
			},
			severity: DiagnosticSeverity.Hint,
			source: "Some Sass",
			tags: [DiagnosticTag.Deprecated],
		},
	]);
});

test("reports a deprecated function with prefix", async () => {
	const functions = fileSystemProvider.createDocument(
		["/// @deprecated", "@function old-function() { @return 1; }"],
		{ uri: "functions.scss" },
	);
	const forward = fileSystemProvider.createDocument(
		"@forward './functions' as fun-*;",
		{ uri: "namespace.scss" },
	);
	const document = fileSystemProvider.createDocument([
		"@use 'namespace' as ns;",
		".foo {",
		"  line-height: ns.fun-old-function();",
		"}",
	]);

	ls.parseStylesheet(functions);
	ls.parseStylesheet(forward);

	const result = await ls.doDiagnostics(document);

	assert.deepStrictEqual(result, [
		{
			message: "old-function is deprecated",
			range: {
				start: {
					line: 2,
					character: 18,
				},
				end: {
					line: 2,
					character: 34,
				},
			},
			severity: DiagnosticSeverity.Hint,
			source: "Some Sass",
			tags: [DiagnosticTag.Deprecated],
		},
	]);
});

test("reports a deprecated mixin with prefix", async () => {
	const mixins = fileSystemProvider.createDocument(
		["/// @deprecated", "@mixin old-mixin { content: 'mixin'; }"],
		{ uri: "mixins.scss" },
	);
	const forward = fileSystemProvider.createDocument(
		"@forward './mixins' as mix-*;",
		{ uri: "namespace.scss" },
	);
	const document = fileSystemProvider.createDocument([
		"@use 'namespace' as ns;",
		".foo {",
		"  @include ns.mix-old-mixin;",
		"}",
	]);

	ls.parseStylesheet(mixins);
	ls.parseStylesheet(forward);

	const result = await ls.doDiagnostics(document);

	assert.deepStrictEqual(result, [
		{
			message: "old-mixin is deprecated",
			range: {
				start: {
					line: 2,
					character: 14,
				},
				end: {
					line: 2,
					character: 27,
				},
			},
			severity: DiagnosticSeverity.Hint,
			source: "Some Sass",
			tags: [DiagnosticTag.Deprecated],
		},
	]);
});

test("reports a deprecated placeholder", async () => {
	const document = fileSystemProvider.createDocument([
		"/// @deprecated Use something else",
		"%oldPlaceholder {",
		"  content: 'placeholder';",
		"}",
		".a { @extend %oldPlaceholder; }",
	]);

	const result = await ls.doDiagnostics(document);

	assert.deepStrictEqual(result, [
		{
			message: "Use something else",
			range: {
				start: {
					line: 4,
					character: 13,
				},
				end: {
					line: 4,
					character: 28,
				},
			},
			severity: DiagnosticSeverity.Hint,
			source: "Some Sass",
			tags: [DiagnosticTag.Deprecated],
		},
	]);
});
