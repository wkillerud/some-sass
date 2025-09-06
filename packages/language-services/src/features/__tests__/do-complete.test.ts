import { test, assert, beforeEach } from "vitest";
import { getLanguageService } from "../../language-services";
import { Position } from "../../language-services-types";
import { getOptions } from "../../utils/test-helpers";

const { fileSystemProvider, ...rest } = getOptions();
const ls = getLanguageService({ fileSystemProvider, ...rest });

ls.configure({
	scss: {
		completion: {
			includeFromCurrentDocument: true,
			suggestFromUseOnly: false,
			css: false,
		},
	},
});

beforeEach(() => {
	ls.clearCache();
});

test("should not suggest mixin or placeholder as a property value", async () => {
	const one = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"@function compare($a: 1, $b) {}",
		"%placeholder { color: blue; }",
		".a { color: ",
	]);

	ls.parseStylesheet(one);

	const { items } = await ls.doComplete(one, Position.create(4, 12));

	assert.ok(items.find((item) => item.label === "$name"));
	assert.ok(items.find((item) => item.label === "compare"));
	assert.isUndefined(items.find((item) => item.label === "mixin"));
	assert.isUndefined(items.find((item) => item.label === "%placeholder"));
});

test("should not suggest mixin or placeholder as a variable value", async () => {
	const one = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"@function compare($a: 1, $b) {}",
		"%placeholder { color: blue; }",
		"$my_color: ",
	]);

	ls.parseStylesheet(one);

	const { items } = await ls.doComplete(one, Position.create(4, 11));

	assert.ok(items.find((item) => item.label === "$name"));
	assert.ok(items.find((item) => item.label === "compare"));
	assert.isUndefined(items.find((item) => item.label === "mixin"));
	assert.isUndefined(items.find((item) => item.label === "%placeholder"));
});

test("should not suggest function, variable or placeholder after an @include", async () => {
	const one = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"@function compare($a: 1, $b) {}",
		"%placeholder { color: blue; }",
		".a { @include ",
	]);

	ls.parseStylesheet(one);

	const { items } = await ls.doComplete(one, Position.create(4, 14));

	assert.ok(items.find((item) => item.label === "mixin"));
	assert.isUndefined(items.find((item) => item.label === "%placeholder"));
	assert.isUndefined(items.find((item) => item.label === "$name"));
	assert.isUndefined(items.find((item) => item.label === "compare"));
});

test("should not suggest function, variable or mixin after an @extend", async () => {
	const one = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"@function compare($a: 1, $b) {}",
		"%placeholder { color: blue; }",
		".a { @extend ",
	]);

	ls.parseStylesheet(one);

	const { items } = await ls.doComplete(one, Position.create(4, 14));

	assert.ok(items.find((item) => item.label === "%placeholder"));
	assert.isUndefined(items.find((item) => item.label === "mixin"));
	assert.isUndefined(items.find((item) => item.label === "$name"));
	assert.isUndefined(items.find((item) => item.label === "compare"));
});

test("should suggest variable in @return", async () => {
	const one = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"%placeholder { color: blue; }",
		"@function compare($a: 1, $b) { @return $",
	]);

	ls.parseStylesheet(one);

	const { items } = await ls.doComplete(one, Position.create(3, 40));

	assert.ok(items.find((item) => item.label === "$name"));
	assert.ok(items.find((item) => item.label === "compare")); // allow for recursion
	assert.isUndefined(items.find((item) => item.label === "mixin"));
	assert.isUndefined(items.find((item) => item.label === "%placeholder"));
});

test("should suggest function in @return", async () => {
	const one = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"%placeholder { color: blue; }",
		"@function compare($a: 1, $b) { @return ",
	]);

	ls.parseStylesheet(one);

	const { items } = await ls.doComplete(one, Position.create(3, 39));

	assert.ok(items.find((item) => item.label === "compare")); // allow for recursion
	assert.ok(items.find((item) => item.label === "$name"));
	assert.isUndefined(items.find((item) => item.label === "mixin"));
	assert.isUndefined(items.find((item) => item.label === "%placeholder"));
});

test("should suggest variable in @if", async () => {
	const one = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"%placeholder { color: blue; }",
		"@function compare($a: 1, $b) { @return $a * $b; }",
		"@if $",
	]);

	ls.parseStylesheet(one);

	const { items } = await ls.doComplete(one, Position.create(4, 5));

	assert.ok(items.find((item) => item.label === "$name"));
	assert.ok(items.find((item) => item.label === "compare"));
	assert.isUndefined(items.find((item) => item.label === "mixin"));
	assert.isUndefined(items.find((item) => item.label === "%placeholder"));
});

test("should suggest function in @if", async () => {
	const one = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"%placeholder { color: blue; }",
		"@function compare($a: 1, $b) { @return $a * $b; }",
		"@if ",
	]);

	ls.parseStylesheet(one);

	const { items } = await ls.doComplete(one, Position.create(4, 4));

	assert.ok(items.find((item) => item.label === "compare"));
	assert.ok(items.find((item) => item.label === "$name"));
	assert.isUndefined(items.find((item) => item.label === "mixin"));
	assert.isUndefined(items.find((item) => item.label === "%placeholder"));
});

test("should suggest variable in @else if", async () => {
	const one = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"%placeholder { color: blue; }",
		"@function compare($a: 1, $b) { @return $a * $b; }",
		"@if $name {",
		"} @else if $",
	]);

	ls.parseStylesheet(one);

	const { items } = await ls.doComplete(one, Position.create(5, 12));

	assert.ok(items.find((item) => item.label === "$name"));
	assert.ok(items.find((item) => item.label === "compare"));
	assert.isUndefined(items.find((item) => item.label === "mixin"));
	assert.isUndefined(items.find((item) => item.label === "%placeholder"));
});

test("should suggest function in @else if", async () => {
	const one = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"%placeholder { color: blue; }",
		"@function compare($a: 1, $b) { @return $a * $b; }",
		"@if $name {",
		"} @else if ",
	]);

	ls.parseStylesheet(one);

	const { items } = await ls.doComplete(one, Position.create(5, 12));

	assert.ok(items.find((item) => item.label === "compare"));
	assert.ok(items.find((item) => item.label === "$name"));
	assert.isUndefined(items.find((item) => item.label === "mixin"));
	assert.isUndefined(items.find((item) => item.label === "%placeholder"));
});

test("should not suggest anything for @each before in", async () => {
	const one = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"%placeholder { color: blue; }",
		"@function compare($a: 1, $b) { @return $a * $b; }",
		"@each ",
	]);

	ls.parseStylesheet(one);

	const { items } = await ls.doComplete(one, Position.create(4, 6));

	assert.equal(items.length, 0);
});

test("should suggest variable in for @each $foo in", async () => {
	const one = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"%placeholder { color: blue; }",
		"@function compare($a: 1, $b) { @return $a * $b; }",
		"@each $foo in $",
	]);

	ls.parseStylesheet(one);

	const { items } = await ls.doComplete(one, Position.create(4, 15));

	assert.ok(items.find((item) => item.label === "$name"));
	assert.ok(items.find((item) => item.label === "compare"));
	assert.isUndefined(items.find((item) => item.label === "mixin"));
	assert.isUndefined(items.find((item) => item.label === "%placeholder"));
});

test("should suggest function in for @each $foo in", async () => {
	const one = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"%placeholder { color: blue; }",
		"@function compare($a: 1, $b) { @return $a * $b; }",
		"@each $foo in ",
	]);

	ls.parseStylesheet(one);

	const { items } = await ls.doComplete(one, Position.create(4, 15));

	assert.ok(items.find((item) => item.label === "compare"));
	assert.ok(items.find((item) => item.label === "$name"));
	assert.isUndefined(items.find((item) => item.label === "mixin"));
	assert.isUndefined(items.find((item) => item.label === "%placeholder"));
});

test("should not suggest anything in @for before from", async () => {
	const one = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"%placeholder { color: blue; }",
		"@function compare($a: 1, $b) { @return $a * $b; }",
		"@for ",
	]);

	ls.parseStylesheet(one);

	const { items } = await ls.doComplete(one, Position.create(4, 5));

	assert.equal(items.length, 0);
});

test("should suggest variable in @for $i from ", async () => {
	const one = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"%placeholder { color: blue; }",
		"@function compare($a: 1, $b) { @return $a * $b; }",
		"@for $i from $",
	]);

	ls.parseStylesheet(one);

	const { items } = await ls.doComplete(one, Position.create(4, 15));

	assert.ok(items.find((item) => item.label === "$name"));
	assert.ok(items.find((item) => item.label === "compare"));
	assert.isUndefined(items.find((item) => item.label === "mixin"));
	assert.isUndefined(items.find((item) => item.label === "%placeholder"));
});

test("should suggest function in @for $i from ", async () => {
	const one = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"%placeholder { color: blue; }",
		"@function compare($a: 1, $b) { @return $a * $b; }",
		"@for $i from ",
	]);

	ls.parseStylesheet(one);

	const { items } = await ls.doComplete(one, Position.create(4, 15));

	assert.ok(items.find((item) => item.label === "compare"));
	assert.ok(items.find((item) => item.label === "$name"));
	assert.isUndefined(items.find((item) => item.label === "mixin"));
	assert.isUndefined(items.find((item) => item.label === "%placeholder"));
});

test("should suggest variable @for $i from 1 to ", async () => {
	const one = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"%placeholder { color: blue; }",
		"@function compare($a: 1, $b) { @return $a * $b; }",
		"@for $i from 1 to $",
	]);

	ls.parseStylesheet(one);

	const { items } = await ls.doComplete(one, Position.create(4, 19));

	assert.ok(items.find((item) => item.label === "$name"));
	assert.ok(items.find((item) => item.label === "compare"));
	assert.isUndefined(items.find((item) => item.label === "mixin"));
	assert.isUndefined(items.find((item) => item.label === "%placeholder"));
});

test("should suggest function @for $i from 1 to ", async () => {
	const one = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"%placeholder { color: blue; }",
		"@function compare($a: 1, $b) { @return $a * $b; }",
		"@for $i from 1 to ",
	]);

	ls.parseStylesheet(one);

	const { items } = await ls.doComplete(one, Position.create(4, 23));

	assert.ok(items.find((item) => item.label === "compare"));
	assert.ok(items.find((item) => item.label === "$name"));
	assert.isUndefined(items.find((item) => item.label === "mixin"));
	assert.isUndefined(items.find((item) => item.label === "%placeholder"));
});

test("should suggest variable in @for $i from 1 through ", async () => {
	const one = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"%placeholder { color: blue; }",
		"@function compare($a: 1, $b) { @return $a * $b; }",
		"@for $i from 1 through $",
	]);

	ls.parseStylesheet(one);

	const { items } = await ls.doComplete(one, Position.create(4, 24));

	assert.ok(items.find((item) => item.label === "$name"));
	assert.ok(items.find((item) => item.label === "compare"));
	assert.isUndefined(items.find((item) => item.label === "mixin"));
	assert.isUndefined(items.find((item) => item.label === "%placeholder"));
});

test("should suggest function in @for $i from 1 through ", async () => {
	const one = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"%placeholder { color: blue; }",
		"@function compare($a: 1, $b) { @return $a * $b; }",
		"@for $i from 1 through ",
	]);

	ls.parseStylesheet(one);

	const { items } = await ls.doComplete(one, Position.create(4, 24));

	assert.ok(items.find((item) => item.label === "compare"));
	assert.ok(items.find((item) => item.label === "$name"));
	assert.isUndefined(items.find((item) => item.label === "mixin"));
	assert.isUndefined(items.find((item) => item.label === "%placeholder"));
});

test("should suggest variable and function as parameter to mixin, not mixin or placeholder", async () => {
	const one = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"@function compare($a: 1, $b) {}",
		"%placeholder { color: blue; }",
		".a { @include mixin(",
	]);

	ls.parseStylesheet(one);

	const { items } = await ls.doComplete(one, Position.create(4, 20));

	assert.ok(items.find((item) => item.label === "$name"));
	assert.ok(items.find((item) => item.label === "compare"));
	assert.isUndefined(items.find((item) => item.label === "mixin"));
	assert.isUndefined(items.find((item) => item.label === "%placeholder"));
});

test("", async () => {
	const one = fileSystemProvider.createDocument(
		"@function hello() { @return 1; }",
		{
			uri: "func.scss",
		},
	);
	const two = fileSystemProvider.createDocument(
		['@forward "func" as fun-* show fun-hello;'],
		{
			uri: "dev.scss",
		},
	);
	const three = fileSystemProvider.createDocument([
		'@use "dev" as d;',
		":host { --var: d.; }",
	]);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);
	ls.parseStylesheet(three);

	const { items } = await ls.doComplete(three, Position.create(1, 17));

	assert.equal(items.length, 1);
	assert.equal(items[0].label, "fun-hello");
});
