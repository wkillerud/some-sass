import { strictEqual, deepStrictEqual, ok } from "assert";
import { provideReferences } from "../../server/features/references";
import StorageService from "../../server/storage";
import * as helpers from "../helpers";
import { TestFileSystem } from "../test-file-system";

describe("Providers/References", () => {
	let storage: StorageService;
	let fs: TestFileSystem;

	beforeEach(() => {
		storage = new StorageService();
		fs = new TestFileSystem(storage);
	});

	it("provideReferences - Variables", async () => {
		await helpers.makeDocument(storage, '$day: "monday";', fs, {
			uri: "ki.scss",
		});

		const firstUsage = await helpers.makeDocument(
			storage,
			['@use "ki";', "", ".a::after {", " content: ki.$day;", "}"],
			fs,
			{
				uri: "helen.scss",
			},
		);

		await helpers.makeDocument(
			storage,
			[
				'@use "ki";',
				"",
				".a::before {",
				" // Here it comes!",
				" content: ki.$day;",
				"}",
			],
			fs,
			{
				uri: "gato.scss",
			},
		);

		const actual = await provideReferences(firstUsage, 38, storage, {
			includeDeclaration: true,
		});

		ok(actual, "provideReferences returned null for a variable");
		strictEqual(
			actual?.length,
			3,
			"Expected three references to $day: two usage and one declaration",
		);

		const [ki, helen, gato] = actual;

		ok(ki?.uri.endsWith("ki.scss"));
		deepStrictEqual(ki?.range, {
			start: {
				line: 0,
				character: 0,
			},
			end: {
				line: 0,
				character: 4,
			},
		});

		ok(helen?.uri.endsWith("helen.scss"));
		deepStrictEqual(helen?.range, {
			start: {
				line: 3,
				character: 13,
			},
			end: {
				line: 3,
				character: 17,
			},
		});

		ok(gato?.uri.endsWith("gato.scss"));
		deepStrictEqual(gato?.range, {
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
		await helpers.makeDocument(storage, '$day: "monday";', fs, {
			uri: "ki.scss",
		});

		await helpers.makeDocument(storage, '@forward "ki" as ki-*;', fs, {
			uri: "dev.scss",
		});

		const firstUsage = await helpers.makeDocument(
			storage,
			['@use "dev";', "", ".a::after {", " content: dev.$ki-day;", "}"],
			fs,
			{
				uri: "coast.scss",
			},
		);

		await helpers.makeDocument(
			storage,
			[
				'@use "ki";',
				"",
				".a::before {",
				" // Here it comes!",
				" content: ki.$day;",
				"}",
			],
			fs,
			{
				uri: "winter.scss",
			},
		);

		const actual = await provideReferences(firstUsage, 42, storage, {
			includeDeclaration: true,
		});

		ok(actual, "provideReferences returned null for a prefixed variable");
		strictEqual(
			actual?.length,
			3,
			"Expected three references to $day: one prefixed usage and one not, plus the declaration",
		);

		const [ki, coast, winter] = actual;

		ok(ki?.uri.endsWith("ki.scss"));
		deepStrictEqual(ki?.range, {
			start: {
				line: 0,
				character: 0,
			},
			end: {
				line: 0,
				character: 4,
			},
		});

		ok(coast?.uri.endsWith("coast.scss"));
		deepStrictEqual(coast?.range, {
			start: {
				line: 3,
				character: 14,
			},
			end: {
				line: 3,
				character: 21,
			},
		});

		ok(winter?.uri.endsWith("winter.scss"));
		deepStrictEqual(winter?.range, {
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

	it("provideReferences - Functions", async () => {
		await helpers.makeDocument(
			storage,
			"@function hello() { @return 1; }",
			fs,
			{
				uri: "func.scss",
			},
		);

		const firstUsage = await helpers.makeDocument(
			storage,
			['@use "func";', "", ".a {", " line-height: func.hello();", "}"],
			fs,
			{
				uri: "one.scss",
			},
		);

		await helpers.makeDocument(
			storage,
			[
				'@use "func";',
				"",
				".a {",
				"	// Here it comes!",
				" line-height: func.hello();",
				"}",
			],
			fs,
			{
				uri: "two.scss",
			},
		);

		const actual = await provideReferences(firstUsage, 42, storage, {
			includeDeclaration: true,
		});

		ok(actual, "provideReferences returned null for a function");
		strictEqual(
			actual?.length,
			3,
			"Expected three references to hello: two usages and one declaration",
		);

		const [func, one, two] = actual;

		ok(func?.uri.endsWith("func.scss"));
		deepStrictEqual(func?.range, {
			start: {
				line: 0,
				character: 10,
			},
			end: {
				line: 0,
				character: 15,
			},
		});

		ok(one?.uri.endsWith("one.scss"));
		deepStrictEqual(one?.range, {
			start: {
				line: 3,
				character: 19,
			},
			end: {
				line: 3,
				character: 24,
			},
		});

		ok(two?.uri.endsWith("two.scss"));
		deepStrictEqual(two?.range, {
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
			storage,
			"@function hello() { @return 1; }",
			fs,
			{
				uri: "func.scss",
			},
		);

		await helpers.makeDocument(storage, '@forward "func" as fun-*;', fs, {
			uri: "dev.scss",
		});

		const firstUsage = await helpers.makeDocument(
			storage,
			['@use "dev";', "", ".a {", " line-height: dev.fun-hello();", "}"],
			fs,
			{
				uri: "one.scss",
			},
		);

		await helpers.makeDocument(
			storage,
			[
				'@use "func";',
				"",
				".a {",
				"	// Here it comes!",
				" line-height: func.hello();",
				"}",
			],
			fs,
			{
				uri: "two.scss",
			},
		);

		const actual = await provideReferences(firstUsage, 40, storage, {
			includeDeclaration: true,
		});

		ok(actual, "provideReferences returned null for a prefixed function");
		strictEqual(
			actual?.length,
			3,
			"Expected three references to hello: one prefixed usage and one not, plus the declaration",
		);

		const [func, one, two] = actual;

		ok(func?.uri.endsWith("func.scss"));
		deepStrictEqual(func?.range, {
			start: {
				line: 0,
				character: 10,
			},
			end: {
				line: 0,
				character: 15,
			},
		});

		ok(one?.uri.endsWith("one.scss"));
		deepStrictEqual(one?.range, {
			start: {
				line: 3,
				character: 18,
			},
			end: {
				line: 3,
				character: 27,
			},
		});

		ok(two?.uri.endsWith("two.scss"));
		deepStrictEqual(two?.range, {
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

	it("provideReferences - Mixins", async () => {
		await helpers.makeDocument(
			storage,
			["@mixin hello() {", "	line-height: 1;", "}"],
			fs,
			{
				uri: "mix.scss",
			},
		);

		const firstUsage = await helpers.makeDocument(
			storage,
			['@use "mix";', "", ".a {", " @include mix.hello();", "}"],
			fs,
			{
				uri: "one.scss",
			},
		);

		await helpers.makeDocument(
			storage,
			[
				'@use "mix";',
				"",
				".a {",
				"	// Here it comes!",
				" @include mix.hello;",
				"}",
			],
			fs,
			{
				uri: "two.scss",
			},
		);

		const actual = await provideReferences(firstUsage, 33, storage, {
			includeDeclaration: true,
		});

		ok(actual, "provideReferences returned null for a mixin");
		strictEqual(
			actual?.length,
			3,
			"Expected three references to hello: two usages and one declaration",
		);

		const [mix, one, two] = actual;

		ok(mix?.uri.endsWith("mix.scss"));
		deepStrictEqual(mix?.range, {
			start: {
				line: 0,
				character: 7,
			},
			end: {
				line: 0,
				character: 12,
			},
		});

		ok(one?.uri.endsWith("one.scss"));
		deepStrictEqual(one?.range, {
			start: {
				line: 3,
				character: 14,
			},
			end: {
				line: 3,
				character: 19,
			},
		});

		ok(two?.uri.endsWith("two.scss"));
		deepStrictEqual(two?.range, {
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
			storage,
			["@mixin hello() {", "	line-height: 1;", "}"],
			fs,
			{
				uri: "mix.scss",
			},
		);

		await helpers.makeDocument(storage, '@forward "mix" as mix-*;', fs, {
			uri: "dev.scss",
		});

		const firstUsage = await helpers.makeDocument(
			storage,
			['@use "dev";', "", ".a {", " @include dev.mix-hello();", "}"],
			fs,
			{
				uri: "one.scss",
			},
		);

		await helpers.makeDocument(
			storage,
			[
				'@use "mix";',
				"",
				".a {",
				"	// Here it comes!",
				" @include mix.hello();",
				"}",
			],
			fs,
			{
				uri: "two.scss",
			},
		);

		const actual = await provideReferences(firstUsage, 33, storage, {
			includeDeclaration: true,
		});

		ok(actual, "provideReferences returned null for a mixin");
		strictEqual(
			actual?.length,
			3,
			"Expected three references to hello: one prefixed usage and one not, plus the declaration",
		);

		const [mix, one, two] = actual;

		ok(mix?.uri.endsWith("mix.scss"));
		deepStrictEqual(mix?.range, {
			start: {
				line: 0,
				character: 7,
			},
			end: {
				line: 0,
				character: 12,
			},
		});

		ok(one?.uri.endsWith("one.scss"));
		deepStrictEqual(one?.range, {
			start: {
				line: 3,
				character: 14,
			},
			end: {
				line: 3,
				character: 23,
			},
		});

		ok(two?.uri.endsWith("two.scss"));
		deepStrictEqual(two?.range, {
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

	it("providesReference - @forward function parameter with prefix", async () => {
		await helpers.makeDocument(
			storage,
			[
				"@function hello($var) { @return $var; }",
				'$name: "there";',
				'$reply: "general";',
			],
			fs,
			{
				uri: "fun.scss",
			},
		);

		await helpers.makeDocument(storage, '@forward "fun" as fun-*;', fs, {
			uri: "dev.scss",
		});

		const usage = await helpers.makeDocument(
			storage,
			[
				'@use "dev";',
				"",
				".a {",
				"	// Here it comes!",
				" content: dev.fun-hello(dev.$fun-name);",
				"}",
			],
			fs,
			{
				uri: "one.scss",
			},
		);

		const name = await provideReferences(usage, 66, storage, {
			includeDeclaration: true,
		});
		ok(
			name,
			"provideReferences returned null for a prefixed variable as a function parameter",
		);
		strictEqual(name?.length, 2, "Expected two references to $fun-name");

		const [, one] = name;

		ok(one?.uri.endsWith("one.scss"));
		deepStrictEqual(one?.range, {
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
			storage,
			["@function hello() { @return 1; }", '$day: "monday";'],
			fs,
			{
				uri: "fun.scss",
			},
		);

		await helpers.makeDocument(storage, '@forward "fun" as fun-*;', fs, {
			uri: "dev.scss",
		});

		const usage = await helpers.makeDocument(
			storage,
			[
				'@use "dev";',
				"",
				"$map: (",
				' "gloomy": dev.$fun-day,',
				' "goodbye": dev.fun-hello(),',
				");",
			],
			fs,
			{
				uri: "one.scss",
			},
		);

		const funDay = await provideReferences(usage, 36, storage, {
			includeDeclaration: true,
		});

		ok(
			funDay,
			"provideReferences returned null for a prefixed variable in a map",
		);
		strictEqual(funDay?.length, 2, "Expected two references to $day");

		const [, one] = funDay;

		ok(one?.uri.endsWith("one.scss"));
		deepStrictEqual(one?.range, {
			start: {
				line: 3,
				character: 15,
			},
			end: {
				line: 3,
				character: 23,
			},
		});

		const hello = await provideReferences(usage, 64, storage, {
			includeDeclaration: true,
		});
		ok(
			hello,
			"provideReferences returned null for a prefixed function in a map",
		);
		strictEqual(hello?.length, 2, "Expected two references to hello");
	});

	it("provideReferences - excludes declaration if context says so", async () => {
		await helpers.makeDocument(
			storage,
			["@function hello() { @return 1; }", '$day: "monday";'],
			fs,
			{
				uri: "fun.scss",
			},
		);

		await helpers.makeDocument(storage, '@forward "fun" as fun-*;', fs, {
			uri: "dev.scss",
		});

		const usage = await helpers.makeDocument(
			storage,
			[
				'@use "dev";',
				"",
				"$map: (",
				' "gloomy": dev.$fun-day,',
				' "goodbye": dev.fun-hello(),',
				");",
			],
			fs,
			{
				uri: "one.scss",
			},
		);

		const funDay = await provideReferences(usage, 36, storage, {
			includeDeclaration: false,
		});

		ok(
			funDay,
			"provideReferences returned null for a variable excluding declarations",
		);
		strictEqual(funDay?.length, 1, "Expected one reference to $day");

		const hello = await provideReferences(usage, 64, storage, {
			includeDeclaration: false,
		});
		ok(
			hello,
			"provideReferences returned null for a function excluding declarations",
		);
		strictEqual(hello?.length, 1, "Expected one reference to hello");
	});

	it("provideReferences - Sass built-in", async () => {
		const usage = await helpers.makeDocument(
			storage,
			[
				'@use "sass:color";',
				'$_color: color.scale($color: "#1b1917", $alpha: -75%);',
				".a {",
				"	color: $_color;",
				"	transform: scale(1.1);",
				"}",
			],
			fs,
			{
				uri: "one.scss",
			},
		);

		await helpers.makeDocument(
			storage,
			[
				'@use "sass:color";',
				'$_other-color: color.scale($color: "#1b1917", $alpha: -75%);',
			],
			fs,
			{
				uri: "two.scss",
			},
		);

		const references = await provideReferences(usage, 34, storage, {
			includeDeclaration: true,
		});
		ok(references, "provideReferences returned null for Sass built-in");

		strictEqual(references?.length, 2, "Expected two references to scale");

		const [one, two] = references;

		ok(one?.uri.endsWith("one.scss"));
		deepStrictEqual(one?.range, {
			start: {
				line: 1,
				character: 15,
			},
			end: {
				line: 1,
				character: 20,
			},
		});

		ok(two?.uri.endsWith("two.scss"));
		deepStrictEqual(two?.range, {
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
});
