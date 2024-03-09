import { assert, beforeEach, describe, test } from "vitest";
import { provideReferences } from "../../src/features/references";
import * as helpers from "../helpers";

describe("Providers/References", () => {
	beforeEach(() => {
		helpers.createTestContext();
	});

	test("provideReferences - Variables", async () => {
		await helpers.makeDocument('$day: "monday";', {
			uri: "ki.scss",
		});

		const firstUsage = await helpers.makeDocument(
			['@use "ki";', "", ".a::after {", " content: ki.$day;", "}"],
			{
				uri: "helen.scss",
			},
		);

		await helpers.makeDocument(
			[
				'@use "ki";',
				"",
				".a::before {",
				" // Here it comes!",
				" content: ki.$day;",
				"}",
			],

			{
				uri: "gato.scss",
			},
		);

		const actual = await provideReferences(firstUsage, 38, {
			includeDeclaration: true,
		});

		assert.ok(actual, "provideReferences returned null for a variable");
		assert.strictEqual(
			actual?.references.length,
			3,
			"Expected three references to $day: two usage and one declaration",
		);

		const [ki, helen, gato] = actual!.references;

		assert.ok(ki?.location.uri.endsWith("ki.scss"));
		assert.deepStrictEqual(ki?.location.range, {
			start: {
				line: 0,
				character: 0,
			},
			end: {
				line: 0,
				character: 4,
			},
		});

		assert.ok(helen?.location.uri.endsWith("helen.scss"));
		assert.deepStrictEqual(helen?.location.range, {
			start: {
				line: 3,
				character: 13,
			},
			end: {
				line: 3,
				character: 17,
			},
		});

		assert.ok(gato?.location.uri.endsWith("gato.scss"));
		assert.deepStrictEqual(gato?.location.range, {
			start: {
				line: 4,
				character: 13,
			},
			end: {
				line: 4,
				character: 17,
			},
		});
	});

	test("provideReferences - @forward variable with prefix", async () => {
		await helpers.makeDocument('$day: "monday";', {
			uri: "ki.scss",
		});

		await helpers.makeDocument('@forward "ki" as ki-*;', {
			uri: "dev.scss",
		});

		const firstUsage = await helpers.makeDocument(
			['@use "dev";', "", ".a::after {", " content: dev.$ki-day;", "}"],

			{
				uri: "coast.scss",
			},
		);

		await helpers.makeDocument(
			[
				'@use "ki";',
				"",
				".a::before {",
				" // Here it comes!",
				" content: ki.$day;",
				"}",
			],

			{
				uri: "winter.scss",
			},
		);

		const actual = await provideReferences(firstUsage, 42, {
			includeDeclaration: true,
		});

		assert.ok(
			actual,
			"provideReferences returned null for a prefixed variable",
		);
		assert.strictEqual(
			actual?.references.length,
			3,
			"Expected three references to $day: one prefixed usage and one not, plus the declaration",
		);

		const [ki, coast, winter] = actual!.references;

		assert.ok(ki?.location.uri.endsWith("ki.scss"));
		assert.deepStrictEqual(ki?.location.range, {
			start: {
				line: 0,
				character: 0,
			},
			end: {
				line: 0,
				character: 4,
			},
		});

		assert.ok(coast?.location.uri.endsWith("coast.scss"));
		assert.deepStrictEqual(coast?.location.range, {
			start: {
				line: 3,
				character: 14,
			},
			end: {
				line: 3,
				character: 21,
			},
		});

		assert.ok(winter?.location.uri.endsWith("winter.scss"));
		assert.deepStrictEqual(winter?.location.range, {
			start: {
				line: 4,
				character: 13,
			},
			end: {
				line: 4,
				character: 17,
			},
		});
	});

	test("provideReferences - @forward visibility for variable", async () => {
		await helpers.makeDocument(["$secret: 1;"], {
			uri: "var.scss",
		});

		const forward = await helpers.makeDocument(
			'@forward "var" as var-* hide $secret;',

			{
				uri: "dev.scss",
			},
		);

		const actual = await provideReferences(forward, 33, {
			includeDeclaration: true,
		});

		assert.ok(
			actual,
			"provideReferences returned null for a variable referenced in an @forward hide",
		);
		assert.strictEqual(
			actual?.references.length,
			2,
			"Expected two references to `secret`: one declaration and one as part of a @forward statement (in hide).",
		);

		const [variable, dev] = actual!.references;

		assert.ok(variable?.location.uri.endsWith("var.scss"));
		assert.deepStrictEqual(variable?.location.range, {
			start: {
				line: 0,
				character: 0,
			},
			end: {
				line: 0,
				character: 7,
			},
		});

		assert.ok(dev?.location.uri.endsWith("dev.scss"));
		assert.deepStrictEqual(dev?.location.range, {
			start: {
				line: 0,
				character: 29,
			},
			end: {
				line: 0,
				character: 36,
			},
		});
	});

	test("provideReferences - Functions", async () => {
		await helpers.makeDocument(
			"@function hello() { @return 1; }",

			{
				uri: "func.scss",
			},
		);

		const firstUsage = await helpers.makeDocument(
			['@use "func";', "", ".a {", " line-height: func.hello();", "}"],

			{
				uri: "one.scss",
			},
		);

		await helpers.makeDocument(
			[
				'@use "func";',
				"",
				".a {",
				"	// Here it comes!",
				" line-height: func.hello();",
				"}",
			],

			{
				uri: "two.scss",
			},
		);

		const actual = await provideReferences(firstUsage, 42, {
			includeDeclaration: true,
		});

		assert.ok(actual, "provideReferences returned null for a function");
		assert.strictEqual(
			actual?.references.length,
			3,
			"Expected three references to hello: two usages and one declaration",
		);

		const [func, one, two] = actual!.references;

		assert.ok(func?.location.uri.endsWith("func.scss"));
		assert.deepStrictEqual(func?.location.range, {
			start: {
				line: 0,
				character: 10,
			},
			end: {
				line: 0,
				character: 15,
			},
		});

		assert.ok(one?.location.uri.endsWith("one.scss"));
		assert.deepStrictEqual(one?.location.range, {
			start: {
				line: 3,
				character: 19,
			},
			end: {
				line: 3,
				character: 24,
			},
		});

		assert.ok(two?.location.uri.endsWith("two.scss"));
		assert.deepStrictEqual(two?.location.range, {
			start: {
				line: 4,
				character: 19,
			},
			end: {
				line: 4,
				character: 24,
			},
		});
	});

	test("provideReferences - @forward function with prefix", async () => {
		await helpers.makeDocument(
			"@function hello() { @return 1; }",

			{
				uri: "func.scss",
			},
		);

		await helpers.makeDocument('@forward "func" as fun-*;', {
			uri: "dev.scss",
		});

		const firstUsage = await helpers.makeDocument(
			['@use "dev";', "", ".a {", " line-height: dev.fun-hello();", "}"],

			{
				uri: "one.scss",
			},
		);

		await helpers.makeDocument(
			[
				'@use "func";',
				"",
				".a {",
				"	// Here it comes!",
				" line-height: func.hello();",
				"}",
			],

			{
				uri: "two.scss",
			},
		);

		const actual = await provideReferences(firstUsage, 40, {
			includeDeclaration: true,
		});

		assert.ok(
			actual,
			"provideReferences returned null for a prefixed function",
		);
		assert.strictEqual(
			actual?.references.length,
			3,
			"Expected three references to hello: one prefixed usage and one not, plus the declaration",
		);

		const [func, one, two] = actual!.references;

		assert.ok(func?.location.uri.endsWith("func.scss"));
		assert.deepStrictEqual(func?.location.range, {
			start: {
				line: 0,
				character: 10,
			},
			end: {
				line: 0,
				character: 15,
			},
		});

		assert.ok(one?.location.uri.endsWith("one.scss"));
		assert.deepStrictEqual(one?.location.range, {
			start: {
				line: 3,
				character: 18,
			},
			end: {
				line: 3,
				character: 27,
			},
		});

		assert.ok(two?.location.uri.endsWith("two.scss"));
		assert.deepStrictEqual(two?.location.range, {
			start: {
				line: 4,
				character: 19,
			},
			end: {
				line: 4,
				character: 24,
			},
		});
	});

	test("provideReferences - @forward visibility with function", async () => {
		await helpers.makeDocument(
			"@function secret() { @return 1; }",

			{
				uri: "func.scss",
			},
		);

		const forward = await helpers.makeDocument(
			'@forward "func" as fun-* hide secret;',

			{
				uri: "dev.scss",
			},
		);

		const actual = await provideReferences(forward, 33, {
			includeDeclaration: true,
		});

		assert.ok(
			actual,
			"provideReferences returned null for a function referenced in an @forward hide",
		);
		assert.strictEqual(
			actual?.references.length,
			2,
			"Expected two references to `secret`: one declaration and one as part of a @forward statement (in hide).",
		);

		const [func, dev] = actual!.references;

		assert.ok(func?.location.uri.endsWith("func.scss"));
		assert.deepStrictEqual(func?.location.range, {
			start: {
				line: 0,
				character: 10,
			},
			end: {
				line: 0,
				character: 16,
			},
		});

		assert.ok(dev?.location.uri.endsWith("dev.scss"));
		assert.deepStrictEqual(dev?.location.range, {
			start: {
				line: 0,
				character: 30,
			},
			end: {
				line: 0,
				character: 36,
			},
		});
	});

	test("provideReferences - Mixins", async () => {
		await helpers.makeDocument(
			["@mixin hello() {", "	line-height: 1;", "}"],

			{
				uri: "mix.scss",
			},
		);

		const firstUsage = await helpers.makeDocument(
			['@use "mix";', "", ".a {", " @include mix.hello();", "}"],

			{
				uri: "one.scss",
			},
		);

		await helpers.makeDocument(
			[
				'@use "mix";',
				"",
				".a {",
				"	// Here it comes!",
				" @include mix.hello;",
				"}",
			],

			{
				uri: "two.scss",
			},
		);

		const actual = await provideReferences(firstUsage, 33, {
			includeDeclaration: true,
		});

		assert.ok(actual, "provideReferences returned null for a mixin");
		assert.strictEqual(
			actual?.references.length,
			3,
			"Expected three references to hello: two usages and one declaration",
		);

		const [mix, one, two] = actual!.references;

		assert.ok(mix?.location.uri.endsWith("mix.scss"));
		assert.deepStrictEqual(mix?.location.range, {
			start: {
				line: 0,
				character: 7,
			},
			end: {
				line: 0,
				character: 12,
			},
		});

		assert.ok(one?.location.uri.endsWith("one.scss"));
		assert.deepStrictEqual(one?.location.range, {
			start: {
				line: 3,
				character: 14,
			},
			end: {
				line: 3,
				character: 19,
			},
		});

		assert.ok(two?.location.uri.endsWith("two.scss"));
		assert.deepStrictEqual(two?.location.range, {
			start: {
				line: 4,
				character: 14,
			},
			end: {
				line: 4,
				character: 19,
			},
		});
	});

	test("provideReferences - @forward mixin with prefix", async () => {
		await helpers.makeDocument(
			["@mixin hello() {", "	line-height: 1;", "}"],

			{
				uri: "mix.scss",
			},
		);

		await helpers.makeDocument('@forward "mix" as mix-*;', {
			uri: "dev.scss",
		});

		const firstUsage = await helpers.makeDocument(
			['@use "dev";', "", ".a {", " @include dev.mix-hello();", "}"],

			{
				uri: "one.scss",
			},
		);

		await helpers.makeDocument(
			[
				'@use "mix";',
				"",
				".a {",
				"	// Here it comes!",
				" @include mix.hello();",
				"}",
			],

			{
				uri: "two.scss",
			},
		);

		const actual = await provideReferences(firstUsage, 33, {
			includeDeclaration: true,
		});

		assert.ok(actual, "provideReferences returned null for a mixin");
		assert.strictEqual(
			actual?.references.length,
			3,
			"Expected three references to hello: one prefixed usage and one not, plus the declaration",
		);

		const [mix, one, two] = actual!.references;

		assert.ok(mix?.location.uri.endsWith("mix.scss"));
		assert.deepStrictEqual(mix?.location.range, {
			start: {
				line: 0,
				character: 7,
			},
			end: {
				line: 0,
				character: 12,
			},
		});

		assert.ok(one?.location.uri.endsWith("one.scss"));
		assert.deepStrictEqual(one?.location.range, {
			start: {
				line: 3,
				character: 14,
			},
			end: {
				line: 3,
				character: 23,
			},
		});

		assert.ok(two?.location.uri.endsWith("two.scss"));
		assert.deepStrictEqual(two?.location.range, {
			start: {
				line: 4,
				character: 14,
			},
			end: {
				line: 4,
				character: 19,
			},
		});
	});

	test("provideReferences - @forward visibility for mixin", async () => {
		await helpers.makeDocument(
			["@mixin secret() {", "	line-height: 1;", "}"],

			{
				uri: "mix.scss",
			},
		);

		const forward = await helpers.makeDocument(
			'@forward "mix" as mix-* hide secret;',

			{
				uri: "dev.scss",
			},
		);

		const actual = await provideReferences(forward, 33, {
			includeDeclaration: true,
		});

		assert.ok(
			actual,
			"provideReferences returned null for a mixin referenced in an @forward hide",
		);
		assert.strictEqual(
			actual?.references.length,
			2,
			"Expected two references to `secret`: one declaration and one as part of a @forward statement (in hide).",
		);

		const [mix, dev] = actual!.references;

		assert.ok(mix?.location.uri.endsWith("mix.scss"));
		assert.deepStrictEqual(mix?.location.range, {
			start: {
				line: 0,
				character: 7,
			},
			end: {
				line: 0,
				character: 13,
			},
		});

		assert.ok(dev?.location.uri.endsWith("dev.scss"));
		assert.deepStrictEqual(dev?.location.range, {
			start: {
				line: 0,
				character: 29,
			},
			end: {
				line: 0,
				character: 35,
			},
		});
	});

	test("providesReference - @forward function parameter with prefix", async () => {
		await helpers.makeDocument(
			[
				"@function hello($var) { @return $var; }",
				'$name: "there";',
				'$reply: "general";',
			],

			{
				uri: "fun.scss",
			},
		);

		await helpers.makeDocument('@forward "fun" as fun-*;', {
			uri: "dev.scss",
		});

		const usage = await helpers.makeDocument(
			[
				'@use "dev";',
				"$_b: 1;",
				".a {",
				"	// Here it comes!",
				" content: dev.fun-hello(dev.$fun-name, $_b);",
				"}",
			],

			{
				uri: "one.scss",
			},
		);

		const name = await provideReferences(usage, 73, {
			includeDeclaration: true,
		});
		assert.ok(
			name,
			"provideReferences returned null for a prefixed variable as a function parameter",
		);
		assert.strictEqual(
			name?.references.length,
			2,
			"Expected two references to $fun-name",
		);

		const [, one] = name!.references;

		assert.ok(one?.location.uri.endsWith("one.scss"));
		assert.deepStrictEqual(one?.location.range, {
			start: {
				line: 4,
				character: 28,
			},
			end: {
				line: 4,
				character: 37,
			},
		});
	});

	test("providesReference - @forward in map with prefix", async () => {
		await helpers.makeDocument(
			["@function hello() { @return 1; }", '$day: "monday";'],

			{
				uri: "fun.scss",
			},
		);

		await helpers.makeDocument('@forward "fun" as fun-*;', {
			uri: "dev.scss",
		});

		const usage = await helpers.makeDocument(
			[
				'@use "dev";',
				"",
				"$map: (",
				' "gloomy": dev.$fun-day,',
				' "goodbye": dev.fun-hello(),',
				");",
			],

			{
				uri: "one.scss",
			},
		);

		const funDay = await provideReferences(usage, 36, {
			includeDeclaration: true,
		});

		assert.ok(
			funDay,
			"provideReferences returned null for a prefixed variable in a map",
		);
		assert.strictEqual(
			funDay?.references.length,
			2,
			"Expected two references to $day",
		);

		const [, one] = funDay!.references;

		assert.ok(one?.location.uri.endsWith("one.scss"));
		assert.deepStrictEqual(one?.location.range, {
			start: {
				line: 3,
				character: 15,
			},
			end: {
				line: 3,
				character: 23,
			},
		});

		const hello = await provideReferences(usage, 64, {
			includeDeclaration: true,
		});
		assert.ok(
			hello,
			"provideReferences returned null for a prefixed function in a map",
		);
		assert.strictEqual(
			hello?.references.length,
			2,
			"Expected two references to hello",
		);
	});

	test("provideReferences - excludes declaration if context says so", async () => {
		await helpers.makeDocument(
			["@function hello() { @return 1; }", '$day: "monday";'],

			{
				uri: "fun.scss",
			},
		);

		await helpers.makeDocument('@forward "fun" as fun-*;', {
			uri: "dev.scss",
		});

		const usage = await helpers.makeDocument(
			[
				'@use "dev";',
				"",
				"$map: (",
				' "gloomy": dev.$fun-day,',
				' "goodbye": dev.fun-hello(),',
				");",
			],

			{
				uri: "one.scss",
			},
		);

		const funDay = await provideReferences(usage, 36, {
			includeDeclaration: false,
		});

		assert.ok(
			funDay,
			"provideReferences returned null for a variable excluding declarations",
		);
		assert.strictEqual(
			funDay?.references.length,
			1,
			"Expected one reference to $day",
		);

		const hello = await provideReferences(usage, 64, {
			includeDeclaration: false,
		});
		assert.ok(
			hello,
			"provideReferences returned null for a function excluding declarations",
		);
		assert.strictEqual(
			hello?.references.length,
			1,
			"Expected one reference to hello",
		);
	});

	test("provideReferences - Sass built-in", async () => {
		const usage = await helpers.makeDocument(
			[
				'@use "sass:color";',
				'$_color: color.scale($color: "#1b1917", $alpha: -75%);',
				".a {",
				"	color: $_color;",
				"	transform: scale(1.1);",
				"}",
			],

			{
				uri: "one.scss",
			},
		);

		await helpers.makeDocument(
			[
				'@use "sass:color";',
				'$_other-color: color.scale($color: "#1b1917", $alpha: -75%);',
			],

			{
				uri: "two.scss",
			},
		);

		const references = await provideReferences(usage, 34, {
			includeDeclaration: true,
		});
		assert.ok(references, "provideReferences returned null for Sass built-in");

		assert.strictEqual(
			references?.references.length,
			2,
			"Expected two references to scale",
		);

		const [one, two] = references!.references;

		assert.ok(one?.location.uri.endsWith("one.scss"));
		assert.deepStrictEqual(one?.location.range, {
			start: {
				line: 1,
				character: 15,
			},
			end: {
				line: 1,
				character: 20,
			},
		});

		assert.ok(two?.location.uri.endsWith("two.scss"));
		assert.deepStrictEqual(two?.location.range, {
			start: {
				line: 1,
				character: 21,
			},
			end: {
				line: 1,
				character: 26,
			},
		});
	});

	test("provideReferences - placeholders", async () => {
		await helpers.makeDocument(
			["%alert {", "	color: blue;", "}"],

			{
				uri: "place.scss",
			},
		);

		const firstUsage = await helpers.makeDocument(
			['@use "place";', "", ".a {", " @extend %alert;", "}"],

			{
				uri: "one.scss",
			},
		);

		await helpers.makeDocument(
			[
				'@use "place";',
				"",
				".a {",
				"	// Here it comes!",
				" @extend %alert;",
				"}",
			],

			{
				uri: "two.scss",
			},
		);

		const actual = await provideReferences(firstUsage, 33, {
			includeDeclaration: true,
		});

		assert.ok(actual, "provideReferences returned null for a placeholder");
		assert.strictEqual(
			actual?.references.length,
			3,
			"Expected three references to alert: two usages and one declaration",
		);

		const [place, one, two] = actual!.references;

		assert.ok(place?.location.uri.endsWith("place.scss"));
		assert.deepStrictEqual(place?.location.range, {
			start: {
				line: 0,
				character: 0,
			},
			end: {
				line: 0,
				character: 6,
			},
		});

		assert.ok(one?.location.uri.endsWith("one.scss"));
		assert.deepStrictEqual(one?.location.range, {
			start: {
				line: 3,
				character: 9,
			},
			end: {
				line: 3,
				character: 15,
			},
		});

		assert.ok(two?.location.uri.endsWith("two.scss"));
		assert.deepStrictEqual(two?.location.range, {
			start: {
				line: 4,
				character: 9,
			},
			end: {
				line: 4,
				character: 15,
			},
		});
	});
});
