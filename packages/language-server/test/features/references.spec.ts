import { strictEqual, deepStrictEqual, ok } from "assert";
import { provideReferences } from "../../src/features/references";
import * as helpers from "../helpers";

describe("Providers/References", () => {
	beforeEach(() => {
		helpers.createTestContext();
	});

	it("provideReferences - Variables", async () => {
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

		ok(actual, "provideReferences returned null for a variable");
		strictEqual(
			actual?.references.length,
			3,
			"Expected three references to $day: two usage and one declaration",
		);

		const [ki, helen, gato] = actual.references;

		ok(ki?.location.uri.endsWith("ki.scss"));
		deepStrictEqual(ki?.location.range, {
			start: {
				line: 0,
				character: 0,
			},
			end: {
				line: 0,
				character: 4,
			},
		});

		ok(helen?.location.uri.endsWith("helen.scss"));
		deepStrictEqual(helen?.location.range, {
			start: {
				line: 3,
				character: 13,
			},
			end: {
				line: 3,
				character: 17,
			},
		});

		ok(gato?.location.uri.endsWith("gato.scss"));
		deepStrictEqual(gato?.location.range, {
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

	it("provideReferences - @forward variable with prefix", async () => {
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

		ok(actual, "provideReferences returned null for a prefixed variable");
		strictEqual(
			actual?.references.length,
			3,
			"Expected three references to $day: one prefixed usage and one not, plus the declaration",
		);

		const [ki, coast, winter] = actual.references;

		ok(ki?.location.uri.endsWith("ki.scss"));
		deepStrictEqual(ki?.location.range, {
			start: {
				line: 0,
				character: 0,
			},
			end: {
				line: 0,
				character: 4,
			},
		});

		ok(coast?.location.uri.endsWith("coast.scss"));
		deepStrictEqual(coast?.location.range, {
			start: {
				line: 3,
				character: 14,
			},
			end: {
				line: 3,
				character: 21,
			},
		});

		ok(winter?.location.uri.endsWith("winter.scss"));
		deepStrictEqual(winter?.location.range, {
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

	it("provideReferences - @forward visibility for variable", async () => {
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

		ok(
			actual,
			"provideReferences returned null for a variable referenced in an @forward hide",
		);
		strictEqual(
			actual?.references.length,
			2,
			"Expected two references to `secret`: one declaration and one as part of a @forward statement (in hide).",
		);

		const [variable, dev] = actual.references;

		ok(variable?.location.uri.endsWith("var.scss"));
		deepStrictEqual(variable?.location.range, {
			start: {
				line: 0,
				character: 0,
			},
			end: {
				line: 0,
				character: 7,
			},
		});

		ok(dev?.location.uri.endsWith("dev.scss"));
		deepStrictEqual(dev?.location.range, {
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

	it("provideReferences - Functions", async () => {
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

		ok(actual, "provideReferences returned null for a function");
		strictEqual(
			actual?.references.length,
			3,
			"Expected three references to hello: two usages and one declaration",
		);

		const [func, one, two] = actual.references;

		ok(func?.location.uri.endsWith("func.scss"));
		deepStrictEqual(func?.location.range, {
			start: {
				line: 0,
				character: 10,
			},
			end: {
				line: 0,
				character: 15,
			},
		});

		ok(one?.location.uri.endsWith("one.scss"));
		deepStrictEqual(one?.location.range, {
			start: {
				line: 3,
				character: 19,
			},
			end: {
				line: 3,
				character: 24,
			},
		});

		ok(two?.location.uri.endsWith("two.scss"));
		deepStrictEqual(two?.location.range, {
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

	it("provideReferences - @forward function with prefix", async () => {
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

		ok(actual, "provideReferences returned null for a prefixed function");
		strictEqual(
			actual?.references.length,
			3,
			"Expected three references to hello: one prefixed usage and one not, plus the declaration",
		);

		const [func, one, two] = actual.references;

		ok(func?.location.uri.endsWith("func.scss"));
		deepStrictEqual(func?.location.range, {
			start: {
				line: 0,
				character: 10,
			},
			end: {
				line: 0,
				character: 15,
			},
		});

		ok(one?.location.uri.endsWith("one.scss"));
		deepStrictEqual(one?.location.range, {
			start: {
				line: 3,
				character: 18,
			},
			end: {
				line: 3,
				character: 27,
			},
		});

		ok(two?.location.uri.endsWith("two.scss"));
		deepStrictEqual(two?.location.range, {
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

	it("provideReferences - @forward visibility with function", async () => {
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

		ok(
			actual,
			"provideReferences returned null for a function referenced in an @forward hide",
		);
		strictEqual(
			actual?.references.length,
			2,
			"Expected two references to `secret`: one declaration and one as part of a @forward statement (in hide).",
		);

		const [func, dev] = actual.references;

		ok(func?.location.uri.endsWith("func.scss"));
		deepStrictEqual(func?.location.range, {
			start: {
				line: 0,
				character: 10,
			},
			end: {
				line: 0,
				character: 16,
			},
		});

		ok(dev?.location.uri.endsWith("dev.scss"));
		deepStrictEqual(dev?.location.range, {
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

	it("provideReferences - Mixins", async () => {
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

		ok(actual, "provideReferences returned null for a mixin");
		strictEqual(
			actual?.references.length,
			3,
			"Expected three references to hello: two usages and one declaration",
		);

		const [mix, one, two] = actual.references;

		ok(mix?.location.uri.endsWith("mix.scss"));
		deepStrictEqual(mix?.location.range, {
			start: {
				line: 0,
				character: 7,
			},
			end: {
				line: 0,
				character: 12,
			},
		});

		ok(one?.location.uri.endsWith("one.scss"));
		deepStrictEqual(one?.location.range, {
			start: {
				line: 3,
				character: 14,
			},
			end: {
				line: 3,
				character: 19,
			},
		});

		ok(two?.location.uri.endsWith("two.scss"));
		deepStrictEqual(two?.location.range, {
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

	it("provideReferences - @forward mixin with prefix", async () => {
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

		ok(actual, "provideReferences returned null for a mixin");
		strictEqual(
			actual?.references.length,
			3,
			"Expected three references to hello: one prefixed usage and one not, plus the declaration",
		);

		const [mix, one, two] = actual.references;

		ok(mix?.location.uri.endsWith("mix.scss"));
		deepStrictEqual(mix?.location.range, {
			start: {
				line: 0,
				character: 7,
			},
			end: {
				line: 0,
				character: 12,
			},
		});

		ok(one?.location.uri.endsWith("one.scss"));
		deepStrictEqual(one?.location.range, {
			start: {
				line: 3,
				character: 14,
			},
			end: {
				line: 3,
				character: 23,
			},
		});

		ok(two?.location.uri.endsWith("two.scss"));
		deepStrictEqual(two?.location.range, {
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

	it("provideReferences - @forward visibility for mixin", async () => {
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

		ok(
			actual,
			"provideReferences returned null for a mixin referenced in an @forward hide",
		);
		strictEqual(
			actual?.references.length,
			2,
			"Expected two references to `secret`: one declaration and one as part of a @forward statement (in hide).",
		);

		const [mix, dev] = actual.references;

		ok(mix?.location.uri.endsWith("mix.scss"));
		deepStrictEqual(mix?.location.range, {
			start: {
				line: 0,
				character: 7,
			},
			end: {
				line: 0,
				character: 13,
			},
		});

		ok(dev?.location.uri.endsWith("dev.scss"));
		deepStrictEqual(dev?.location.range, {
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

	it("providesReference - @forward function parameter with prefix", async () => {
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
		ok(
			name,
			"provideReferences returned null for a prefixed variable as a function parameter",
		);
		strictEqual(
			name?.references.length,
			2,
			"Expected two references to $fun-name",
		);

		const [, one] = name.references;

		ok(one?.location.uri.endsWith("one.scss"));
		deepStrictEqual(one?.location.range, {
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

	it("providesReference - @forward in map with prefix", async () => {
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

		ok(
			funDay,
			"provideReferences returned null for a prefixed variable in a map",
		);
		strictEqual(
			funDay?.references.length,
			2,
			"Expected two references to $day",
		);

		const [, one] = funDay.references;

		ok(one?.location.uri.endsWith("one.scss"));
		deepStrictEqual(one?.location.range, {
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
		ok(
			hello,
			"provideReferences returned null for a prefixed function in a map",
		);
		strictEqual(
			hello?.references.length,
			2,
			"Expected two references to hello",
		);
	});

	it("provideReferences - excludes declaration if context says so", async () => {
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

		ok(
			funDay,
			"provideReferences returned null for a variable excluding declarations",
		);
		strictEqual(funDay?.references.length, 1, "Expected one reference to $day");

		const hello = await provideReferences(usage, 64, {
			includeDeclaration: false,
		});
		ok(
			hello,
			"provideReferences returned null for a function excluding declarations",
		);
		strictEqual(hello?.references.length, 1, "Expected one reference to hello");
	});

	it("provideReferences - Sass built-in", async () => {
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
		ok(references, "provideReferences returned null for Sass built-in");

		strictEqual(
			references?.references.length,
			2,
			"Expected two references to scale",
		);

		const [one, two] = references.references;

		ok(one?.location.uri.endsWith("one.scss"));
		deepStrictEqual(one?.location.range, {
			start: {
				line: 1,
				character: 15,
			},
			end: {
				line: 1,
				character: 20,
			},
		});

		ok(two?.location.uri.endsWith("two.scss"));
		deepStrictEqual(two?.location.range, {
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

	it("provideReferences - placeholders", async () => {
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

		ok(actual, "provideReferences returned null for a placeholder");
		strictEqual(
			actual?.references.length,
			3,
			"Expected three references to alert: two usages and one declaration",
		);

		const [place, one, two] = actual.references;

		ok(place?.location.uri.endsWith("place.scss"));
		deepStrictEqual(place?.location.range, {
			start: {
				line: 0,
				character: 0,
			},
			end: {
				line: 0,
				character: 6,
			},
		});

		ok(one?.location.uri.endsWith("one.scss"));
		deepStrictEqual(one?.location.range, {
			start: {
				line: 3,
				character: 9,
			},
			end: {
				line: 3,
				character: 15,
			},
		});

		ok(two?.location.uri.endsWith("two.scss"));
		deepStrictEqual(two?.location.range, {
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
