import { test, assert, beforeEach } from "vitest";
import { Position, getLanguageService } from "../../language-services";
import { getOptions } from "../../utils/test-helpers";

const { fileSystemProvider, ...rest } = getOptions();
const ls = getLanguageService({ fileSystemProvider, ...rest });

beforeEach(() => {
	ls.clearCache();
});

test("should find variable definition", async () => {
	const one = fileSystemProvider.createDocument(
		["$a: 1;", "@mixin mixin() { @content; }", "@function make() { @return; }"],
		{ uri: "one.scss" },
	);
	const two = fileSystemProvider.createDocument(".a { content: $a; }");

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const variablePosition = Position.create(0, 14);
	const location = await ls.findDefinition(two, variablePosition);

	assert.isNotNull(location);
	assert.match(location!.uri, /one\.scss$/);
	assert.deepStrictEqual(location!.range, {
		end: {
			character: 2,
			line: 0,
		},
		start: {
			character: 0,
			line: 0,
		},
	});
});

test("should find mixin definition", async () => {
	const one = fileSystemProvider.createDocument(
		["$a: 1;", "@mixin mixin() { @content; }", "@function make() { @return; }"],
		{ uri: "one.scss" },
	);
	const two = fileSystemProvider.createDocument(".a { @include mixin(); }");

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const mixinPosition = Position.create(0, 16);
	const location = await ls.findDefinition(two, mixinPosition);

	assert.isNotNull(location);
	assert.match(location!.uri, /one\.scss$/);
	assert.deepStrictEqual(location!.range, {
		end: {
			character: 12,
			line: 1,
		},
		start: {
			character: 7,
			line: 1,
		},
	});
});

test("should find function definition", async () => {
	const one = fileSystemProvider.createDocument(
		["$a: 1;", "@mixin mixin() { @content; }", "@function make() { @return; }"],
		{ uri: "one.scss" },
	);
	const two = fileSystemProvider.createDocument(".a { content: make(1); }");

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const functionPosition = Position.create(0, 16);
	const location = await ls.findDefinition(two, functionPosition);

	assert.isNotNull(location);
	assert.match(location!.uri, /one\.scss$/);
	assert.deepStrictEqual(location!.range, {
		end: {
			character: 14,
			line: 2,
		},
		start: {
			character: 10,
			line: 2,
		},
	});
});

test("should find variable definition via the module link", async () => {
	const one = fileSystemProvider.createDocument(
		["$a: 1;", "@mixin mixin() { @content; }", "@function make() { @return; }"],
		{ uri: "one.scss" },
	);
	const two = fileSystemProvider.createDocument([
		'@use "./one";',
		".a { content: one.$a; }",
	]);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const variablePosition = Position.create(1, 19);
	const location = await ls.findDefinition(two, variablePosition);

	assert.isNotNull(location);
	assert.match(location!.uri, /one\.scss$/);
	assert.deepStrictEqual(location!.range, {
		end: {
			character: 2,
			line: 0,
		},
		start: {
			character: 0,
			line: 0,
		},
	});
});

test("should find mixin definition via the module link", async () => {
	const one = fileSystemProvider.createDocument(
		["$a: 1;", "@mixin mixin() { @content; }", "@function make() { @return; }"],
		{ uri: "one.scss" },
	);
	const two = fileSystemProvider.createDocument([
		'@use "./one";',
		".a { @include one.mixin(); }",
	]);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const mixinPosition = Position.create(1, 19);
	const location = await ls.findDefinition(two, mixinPosition);

	assert.isNotNull(location);
	assert.match(location!.uri, /one\.scss$/);
	assert.deepStrictEqual(location!.range, {
		end: {
			character: 12,
			line: 1,
		},
		start: {
			character: 7,
			line: 1,
		},
	});
});

test("should find function definition via the module link", async () => {
	const one = fileSystemProvider.createDocument(
		["$a: 1;", "@mixin mixin() { @content; }", "@function make() { @return; }"],
		{ uri: "one.scss" },
	);
	const two = fileSystemProvider.createDocument([
		'@use "./one";',
		".a { content: one.make(1); }",
	]);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const functionPosition = Position.create(1, 20);
	const location = await ls.findDefinition(two, functionPosition);

	assert.isNotNull(location);
	assert.match(location!.uri, /one\.scss$/);
	assert.deepStrictEqual(location!.range, {
		end: {
			character: 14,
			line: 2,
		},
		start: {
			character: 10,
			line: 2,
		},
	});
});

test("should find placeholder definition", async () => {
	const one = fileSystemProvider.createDocument(
		"%alert { background-color: red }",
		{ uri: "one.scss" },
	);
	const two = fileSystemProvider.createDocument(".a { @extend %alert; }");

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);

	const placeholderPosition = Position.create(0, 16);
	const location = await ls.findDefinition(two, placeholderPosition);

	assert.isNotNull(location);
	assert.match(location!.uri, /one\.scss$/);
	assert.deepStrictEqual(location!.range, {
		end: {
			character: 6,
			line: 0,
		},
		start: {
			character: 0,
			line: 0,
		},
	});
});

test("should find prefixed symbols", async () => {
	const one = fileSystemProvider.createDocument(
		["$a: 1;", "@mixin mixin() { @content; }", "@function make() { @return; }"],
		{ uri: "one.scss" },
	);
	const two = fileSystemProvider.createDocument('@forward "./one" as foo-*;', {
		uri: "two.scss",
	});
	const three = fileSystemProvider.createDocument([
		'@use "./two";',
		".a { content: two.foo-make(1); }",
		".a { @include two.foo-mixin(); }",
		".a { content: two.$foo-a; }",
	]);

	// emulate scanner of language service which adds workspace documents to the cache
	ls.parseStylesheet(one);
	ls.parseStylesheet(two);
	ls.parseStylesheet(three);

	let position = Position.create(1, 20);
	let location = await ls.findDefinition(three, position);

	assert.isNotNull(location);
	assert.match(location!.uri, /one\.scss$/);
	assert.deepStrictEqual(location!.range, {
		end: {
			character: 14,
			line: 2,
		},
		start: {
			character: 10,
			line: 2,
		},
	});

	position = Position.create(2, 20);
	location = await ls.findDefinition(three, position);

	assert.isNotNull(location);
	assert.match(location!.uri, /one\.scss$/);
	assert.deepStrictEqual(location!.range, {
		end: {
			character: 12,
			line: 1,
		},
		start: {
			character: 7,
			line: 1,
		},
	});

	position = Position.create(3, 21);
	location = await ls.findDefinition(three, position);

	assert.isNotNull(location);
	assert.match(location!.uri, /one\.scss$/);
	assert.deepStrictEqual(location!.range, {
		end: {
			character: 2,
			line: 0,
		},
		start: {
			character: 0,
			line: 0,
		},
	});
});
