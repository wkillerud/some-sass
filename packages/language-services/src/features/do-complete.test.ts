import { test, assert, beforeEach } from "vitest";
import { Position, getLanguageService } from "../language-services";
import { getOptions } from "../utils/test-helpers";

const { fileSystemProvider, ...rest } = getOptions();
const ls = getLanguageService({ fileSystemProvider, ...rest });

beforeEach(() => {
	ls.clearCache();
	ls.configure({}); // Reset any configuration to default
});

test("should not suggest mixin or placeholder as a property value", async () => {
	ls.configure({
		completionSettings: {
			suggestAllFromOpenDocument: true,
			suggestFromUseOnly: false,
		},
	});

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
	ls.configure({
		completionSettings: {
			suggestAllFromOpenDocument: true,
			suggestFromUseOnly: false,
		},
	});

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
	ls.configure({
		completionSettings: {
			suggestAllFromOpenDocument: true,
			suggestFromUseOnly: false,
		},
	});

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
	ls.configure({
		completionSettings: {
			suggestAllFromOpenDocument: true,
			suggestFromUseOnly: false,
		},
	});

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

test("should not suggest mixin or placeholder in string interpolation", async () => {
	ls.configure({
		completionSettings: {
			suggestAllFromOpenDocument: true,
			suggestFromUseOnly: false,
		},
	});

	const one = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"@function compare($a: 1, $b) {}",
		"%placeholder { color: blue; }",
		'$interpolation: "/some/#{',
	]);

	ls.parseStylesheet(one);

	const { items } = await ls.doComplete(one, Position.create(4, 25));

	assert.ok(items.find((item) => item.label === "$name"));
	assert.ok(items.find((item) => item.label === "compare"));
	assert.isUndefined(items.find((item) => item.label === "mixin"));
	assert.isUndefined(items.find((item) => item.label === "%placeholder"));
});

test("should not suggest mixin or placeholder in @return", async () => {
	ls.configure({
		completionSettings: {
			suggestAllFromOpenDocument: true,
			suggestFromUseOnly: false,
		},
	});

	const one = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"%placeholder { color: blue; }",
		"@function compare($a: 1, $b) { @return ",
	]);

	ls.parseStylesheet(one);

	const { items } = await ls.doComplete(one, Position.create(3, 39));

	assert.ok(items.find((item) => item.label === "$name"));
	assert.ok(items.find((item) => item.label === "compare")); // allow for recursion
	assert.isUndefined(items.find((item) => item.label === "mixin"));
	assert.isUndefined(items.find((item) => item.label === "%placeholder"));
});

test("should not suggest mixin or placeholder in @if", async () => {
	ls.configure({
		completionSettings: {
			suggestAllFromOpenDocument: true,
			suggestFromUseOnly: false,
		},
	});

	const one = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"%placeholder { color: blue; }",
		"@function compare($a: 1, $b) { @return $a * $b; }",
		"@if ",
	]);

	ls.parseStylesheet(one);

	const { items } = await ls.doComplete(one, Position.create(4, 4));

	assert.ok(items.find((item) => item.label === "$name"));
	assert.ok(items.find((item) => item.label === "compare"));
	assert.isUndefined(items.find((item) => item.label === "mixin"));
	assert.isUndefined(items.find((item) => item.label === "%placeholder"));
});

test("should not suggest mixin or placeholder in @else if", async () => {
	ls.configure({
		completionSettings: {
			suggestAllFromOpenDocument: true,
			suggestFromUseOnly: false,
		},
	});

	const one = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"%placeholder { color: blue; }",
		"@function compare($a: 1, $b) { @return $a * $b; }",
		"@if $name {",
		"} @else if ",
	]);

	ls.parseStylesheet(one);

	const { items } = await ls.doComplete(one, Position.create(5, 11));

	assert.ok(items.find((item) => item.label === "$name"));
	assert.ok(items.find((item) => item.label === "compare"));
	assert.isUndefined(items.find((item) => item.label === "mixin"));
	assert.isUndefined(items.find((item) => item.label === "%placeholder"));
});

test("should not suggest mixin or placeholder in @else if", async () => {
	ls.configure({
		completionSettings: {
			suggestAllFromOpenDocument: true,
			suggestFromUseOnly: false,
		},
	});

	const one = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"%placeholder { color: blue; }",
		"@function compare($a: 1, $b) { @return $a * $b; }",
		"@if $name {",
		"} @else if ",
	]);

	ls.parseStylesheet(one);

	const { items } = await ls.doComplete(one, Position.create(5, 11));

	assert.ok(items.find((item) => item.label === "$name"));
	assert.ok(items.find((item) => item.label === "compare"));
	assert.isUndefined(items.find((item) => item.label === "mixin"));
	assert.isUndefined(items.find((item) => item.label === "%placeholder"));
});

test("should not suggest anything for @each before in", async () => {
	ls.configure({
		completionSettings: {
			suggestAllFromOpenDocument: true,
			suggestFromUseOnly: false,
		},
	});

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

test("should not suggest mixin or placeholder for @each $foo in", async () => {
	ls.configure({
		completionSettings: {
			suggestAllFromOpenDocument: true,
			suggestFromUseOnly: false,
		},
	});

	const one = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"%placeholder { color: blue; }",
		"@function compare($a: 1, $b) { @return $a * $b; }",
		"@each $foo in ",
	]);

	ls.parseStylesheet(one);

	const { items } = await ls.doComplete(one, Position.create(4, 14));

	assert.ok(items.find((item) => item.label === "$name"));
	assert.ok(items.find((item) => item.label === "compare"));
	assert.isUndefined(items.find((item) => item.label === "mixin"));
	assert.isUndefined(items.find((item) => item.label === "%placeholder"));
});

test("should not suggest anything in @for before from", async () => {
	ls.configure({
		completionSettings: {
			suggestAllFromOpenDocument: true,
			suggestFromUseOnly: false,
		},
	});

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

test("should not suggest mixin or placeholder in @for $i from ", async () => {
	ls.configure({
		completionSettings: {
			suggestAllFromOpenDocument: true,
			suggestFromUseOnly: false,
		},
	});

	const one = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"%placeholder { color: blue; }",
		"@function compare($a: 1, $b) { @return $a * $b; }",
		"@for $i from ",
	]);

	ls.parseStylesheet(one);

	const { items } = await ls.doComplete(one, Position.create(4, 14));

	assert.ok(items.find((item) => item.label === "$name"));
	assert.ok(items.find((item) => item.label === "compare"));
	assert.isUndefined(items.find((item) => item.label === "mixin"));
	assert.isUndefined(items.find((item) => item.label === "%placeholder"));
});

test("should not suggest mixin or placeholder in @for $i from 1 to ", async () => {
	ls.configure({
		completionSettings: {
			suggestAllFromOpenDocument: true,
			suggestFromUseOnly: false,
		},
	});

	const one = fileSystemProvider.createDocument([
		'$name: "value";',
		"@mixin mixin($a: 1, $b) {}",
		"%placeholder { color: blue; }",
		"@function compare($a: 1, $b) { @return $a * $b; }",
		"@for $i from 1 to ",
	]);

	ls.parseStylesheet(one);

	const { items } = await ls.doComplete(one, Position.create(4, 23));

	assert.ok(items.find((item) => item.label === "$name"));
	assert.ok(items.find((item) => item.label === "compare"));
	assert.isUndefined(items.find((item) => item.label === "mixin"));
	assert.isUndefined(items.find((item) => item.label === "%placeholder"));
});

test("should suggest variable in @for $i from 1 through ", async () => {
	ls.configure({
		completionSettings: {
			suggestAllFromOpenDocument: true,
			suggestFromUseOnly: false,
		},
	});

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
	assert.isUndefined(items.find((item) => item.label === "compare"));
	assert.isUndefined(items.find((item) => item.label === "mixin"));
	assert.isUndefined(items.find((item) => item.label === "%placeholder"));
});

test("should suggest function in @for $i from 1 through ", async () => {
	ls.configure({
		completionSettings: {
			suggestAllFromOpenDocument: true,
			suggestFromUseOnly: false,
		},
	});

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
	assert.isUndefined(items.find((item) => item.label === "$name"));
	assert.isUndefined(items.find((item) => item.label === "mixin"));
	assert.isUndefined(items.find((item) => item.label === "%placeholder"));
});
