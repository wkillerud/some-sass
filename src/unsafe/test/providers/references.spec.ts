'use strict';

import assert from 'assert';
import fs, { Stats } from 'fs';
import sinon from 'sinon';

import StorageService from '../../services/storage';
import { provideReferences } from '../../providers/references';
import * as fsUtils from '../../utils/fs';
import * as helpers from '../helpers';


describe('Providers/References', () => {
	let statStub: sinon.SinonStub;
	let fileExistsStub: sinon.SinonStub;
	let storage: StorageService;

	beforeEach(() => {
		storage = new StorageService();
		fileExistsStub = sinon.stub(fsUtils, 'fileExists').resolves(true);
		statStub = sinon.stub(fs, 'stat').yields(null, new Stats());
	});

	afterEach(() => {
		fileExistsStub.restore();
		statStub.restore();
	});

	it('provideReferences - Variables', async () => {
		await helpers.makeDocument(storage, '$day: "monday";', {
			uri: 'ki.scss',
		});

		const firstUsage = await helpers.makeDocument(storage, [
			'@use "ki";',
			'',
			'.a::after {',
			' content: ki.$day;',
			'}',
		], {
			uri: 'helen.scss',
		});

		await helpers.makeDocument(storage, [
			'@use "ki";',
			'',
			'.a::before {',
			' // Here it comes!',
			' content: ki.$day;',
			'}',
		], {
			uri: 'gato.scss',
		});

		const actual = await provideReferences(firstUsage, 38, storage, { includeDeclaration: true });

		assert.ok(actual, 'provideReferences returned null for a variable');
		assert.strictEqual(actual?.length, 3, 'Expected three references to $day: two usage and one declaration');

		const [ki, helen, gato] = actual;

		assert.ok(ki?.uri.endsWith('ki.scss'));
		assert.deepStrictEqual(ki?.range, {
			start: {
				line: 0,
				character: 0,
			},
			end: {
				line: 0,
				character: 4,
			},
		});

		assert.ok(helen?.uri.endsWith('helen.scss'));
		assert.deepStrictEqual(helen?.range, {
			start: {
				line: 3,
				character: 13,
			},
			end: {
				line: 3,
				character: 17,
			},
		});

		assert.ok(gato?.uri.endsWith('gato.scss'));
		assert.deepStrictEqual(gato?.range, {
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

	it('provideReferences - @forward variable with prefix', async () => {
		await helpers.makeDocument(storage, '$day: "monday";', {
			uri: 'ki.scss',
		});

		await helpers.makeDocument(storage, '@forward "ki" as ki-*;', {
			uri: 'dev.scss',
		});

		const firstUsage = await helpers.makeDocument(storage, [
			'@use "dev";',
			'',
			'.a::after {',
			' content: dev.$ki-day;',
			'}',
		], {
			uri: 'coast.scss',
		});

		await helpers.makeDocument(storage, [
			'@use "ki";',
			'',
			'.a::before {',
			' // Here it comes!',
			' content: ki.$day;',
			'}',
		], {
			uri: 'winter.scss',
		});

		const actual = await provideReferences(firstUsage, 42, storage, { includeDeclaration: true });

		assert.ok(actual, 'provideReferences returned null for a prefixed variable');
		assert.strictEqual(actual?.length, 3, 'Expected three references to $day: one prefixed usage and one not, plus the declaration');

		const [ki, coast, winter] = actual;

		assert.ok(ki?.uri.endsWith('ki.scss'));
		assert.deepStrictEqual(ki?.range, {
			start: {
				line: 0,
				character: 0,
			},
			end: {
				line: 0,
				character: 4,
			},
		});

		assert.ok(coast?.uri.endsWith('coast.scss'));
		assert.deepStrictEqual(coast?.range, {
			start: {
				line: 3,
				character: 14,
			},
			end: {
				line: 3,
				character: 21,
			},
		});

		assert.ok(winter?.uri.endsWith('winter.scss'));
		assert.deepStrictEqual(winter?.range, {
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

	it('provideReferences - Functions', async () => {
		await helpers.makeDocument(storage, '@function hello() { @return 1; }', {
			uri: 'func.scss',
		});

		const firstUsage = await helpers.makeDocument(storage, [
			'@use "func";',
			'',
			'.a {',
			' line-height: func.hello();',
			'}',
		], {
			uri: 'one.scss',
		});

		await helpers.makeDocument(storage, [
			'@use "func";',
			'',
			'.a {',
			'	// Here it comes!',
			' line-height: func.hello();',
			'}',
		], {
			uri: 'two.scss',
		});

		const actual = await provideReferences(firstUsage, 42, storage, { includeDeclaration: true });

		assert.ok(actual, 'provideReferences returned null for a function');
		assert.strictEqual(actual?.length, 3, 'Expected three references to hello: two usages and one declaration');

		const [func, one, two] = actual;

		assert.ok(func?.uri.endsWith('func.scss'));
		assert.deepStrictEqual(func?.range, {
			start: {
				line: 0,
				character: 10,
			},
			end: {
				line: 0,
				character: 15,
			},
		});

		assert.ok(one?.uri.endsWith('one.scss'));
		assert.deepStrictEqual(one?.range, {
			start: {
				line: 3,
				character: 19,
			},
			end: {
				line: 3,
				character: 24,
			},
		});

		assert.ok(two?.uri.endsWith('two.scss'));
		assert.deepStrictEqual(two?.range, {
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

	it('provideReferences - @forward function with prefix', async () => {
		await helpers.makeDocument(storage, '@function hello() { @return 1; }', {
			uri: 'func.scss',
		});

		await helpers.makeDocument(storage, '@forward "func" as fun-*;', {
			uri: 'dev.scss',
		});

		const firstUsage = await helpers.makeDocument(storage, [
			'@use "dev";',
			'',
			'.a {',
			' line-height: dev.fun-hello();',
			'}',
		], {
			uri: 'one.scss',
		});

		await helpers.makeDocument(storage, [
			'@use "func";',
			'',
			'.a {',
			'	// Here it comes!',
			' line-height: func.hello();',
			'}',
		], {
			uri: 'two.scss',
		});

		const actual = await provideReferences(firstUsage, 40, storage, { includeDeclaration: true });

		assert.ok(actual, 'provideReferences returned null for a prefixed function');
		assert.strictEqual(actual?.length, 3, 'Expected three references to hello: one prefixed usage and one not, plus the declaration');

		const [func, one, two] = actual;

		assert.ok(func?.uri.endsWith('func.scss'));
		assert.deepStrictEqual(func?.range, {
			start: {
				line: 0,
				character: 10,
			},
			end: {
				line: 0,
				character: 15,
			},
		});

		assert.ok(one?.uri.endsWith('one.scss'));
		assert.deepStrictEqual(one?.range, {
			start: {
				line: 3,
				character: 18,
			},
			end: {
				line: 3,
				character: 27,
			},
		});

		assert.ok(two?.uri.endsWith('two.scss'));
		assert.deepStrictEqual(two?.range, {
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

	it('provideReferences - Mixins', async () => {
		await helpers.makeDocument(storage, [
			'@mixin hello() {',
			'	line-height: 1;',
			'}'
		], {
			uri: 'mix.scss',
		});

		const firstUsage = await helpers.makeDocument(storage, [
			'@use "mix";',
			'',
			'.a {',
			' @include mix.hello();',
			'}',
		], {
			uri: 'one.scss',
		});

		await helpers.makeDocument(storage, [
			'@use "mix";',
			'',
			'.a {',
			'	// Here it comes!',
			' @include mix.hello;',
			'}',
		], {
			uri: 'two.scss',
		});

		const actual = await provideReferences(firstUsage, 33, storage, { includeDeclaration: true });

		assert.ok(actual, 'provideReferences returned null for a mixin');
		assert.strictEqual(actual?.length, 3, 'Expected three references to hello: two usages and one declaration');

		const [mix, one, two] = actual;

		assert.ok(mix?.uri.endsWith('mix.scss'));
		assert.deepStrictEqual(mix?.range, {
			start: {
				line: 0,
				character: 7,
			},
			end: {
				line: 0,
				character: 12,
			},
		});

		assert.ok(one?.uri.endsWith('one.scss'));
		assert.deepStrictEqual(one?.range, {
			start: {
				line: 3,
				character: 14,
			},
			end: {
				line: 3,
				character: 19,
			},
		});

		assert.ok(two?.uri.endsWith('two.scss'));
		assert.deepStrictEqual(two?.range, {
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

	it('provideReferences - @forward mixin with prefix', async () => {
		await helpers.makeDocument(storage, [
			'@mixin hello() {',
			'	line-height: 1;',
			'}'
		], {
			uri: 'mix.scss',
		});

		await helpers.makeDocument(storage, '@forward "mix" as mix-*;', {
			uri: 'dev.scss',
		});

		const firstUsage = await helpers.makeDocument(storage, [
			'@use "dev";',
			'',
			'.a {',
			' @include dev.mix-hello();',
			'}',
		], {
			uri: 'one.scss',
		});

		await helpers.makeDocument(storage, [
			'@use "mix";',
			'',
			'.a {',
			'	// Here it comes!',
			' @include mix.hello();',
			'}',
		], {
			uri: 'two.scss',
		});

		const actual = await provideReferences(firstUsage, 33, storage, { includeDeclaration: true });

		assert.ok(actual, 'provideReferences returned null for a mixin');
		assert.strictEqual(actual?.length, 3, 'Expected three references to hello: one prefixed usage and one not, plus the declaration');

		const [mix, one, two] = actual;

		assert.ok(mix?.uri.endsWith('mix.scss'));
		assert.deepStrictEqual(mix?.range, {
			start: {
				line: 0,
				character: 7,
			},
			end: {
				line: 0,
				character: 12,
			},
		});

		assert.ok(one?.uri.endsWith('one.scss'));
		assert.deepStrictEqual(one?.range, {
			start: {
				line: 3,
				character: 14,
			},
			end: {
				line: 3,
				character: 23,
			},
		});

		assert.ok(two?.uri.endsWith('two.scss'));
		assert.deepStrictEqual(two?.range, {
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

	it('providesReference - @forward function parameter with prefix', async () => {
		await helpers.makeDocument(storage, [
			'@function hello($var) { @return $var; }',
			'$name: "there";',
			'$reply: "general";',
		], {
			uri: 'fun.scss',
		});

		await helpers.makeDocument(storage, '@forward "fun" as fun-*;', {
			uri: 'dev.scss',
		});

		const usage = await helpers.makeDocument(storage, [
			'@use "dev";',
			'',
			'.a {',
			'	// Here it comes!',
			' content: dev.fun-hello(dev.$fun-name);',
			'}',
		], {
			uri: 'one.scss',
		});


		const name = await provideReferences(usage, 66, storage, { includeDeclaration: true });
		assert.ok(name, 'provideReferences returned null for a prefixed variable as a function parameter');
		assert.strictEqual(name?.length, 2, 'Expected two references to $fun-name');

		const [_, one] = name;

		assert.ok(one?.uri.endsWith('one.scss'));
		assert.deepStrictEqual(one?.range, {
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

	it('providesReference - @forward in map with prefix', async () => {
		await helpers.makeDocument(storage, [
			'@function hello() { @return 1; }',
			'$day: "monday";',
		], {
			uri: 'fun.scss',
		});

		await helpers.makeDocument(storage, '@forward "fun" as fun-*;', {
			uri: 'dev.scss',
		});

		const usage = await helpers.makeDocument(storage, [
			'@use "dev";',
			'',
			'$map: (',
			' "gloomy": dev.$fun-day,',
			' "goodbye": dev.fun-hello(),',
			');',
		], {
			uri: 'one.scss',
		});

		const funDay = await provideReferences(usage, 36, storage, { includeDeclaration: true });

		assert.ok(funDay, 'provideReferences returned null for a prefixed variable in a map');
		assert.strictEqual(funDay?.length, 2, 'Expected two references to $day');

		const [_, one] = funDay;

		assert.ok(one?.uri.endsWith('one.scss'));
		assert.deepStrictEqual(one?.range, {
			start: {
				line: 3,
				character: 15,
			},
			end: {
				line: 3,
				character: 23,
			},
		});

		const hello = await provideReferences(usage, 64, storage, { includeDeclaration: true });
		assert.ok(hello, 'provideReferences returned null for a prefixed function in a map');
		assert.strictEqual(hello?.length, 2, 'Expected two references to hello');
	});

	it('provideReferences - excludes declaration if context says so', async () => {
		await helpers.makeDocument(storage, [
			'@function hello() { @return 1; }',
			'$day: "monday";',
		], {
			uri: 'fun.scss',
		});

		await helpers.makeDocument(storage, '@forward "fun" as fun-*;', {
			uri: 'dev.scss',
		});

		const usage = await helpers.makeDocument(storage, [
			'@use "dev";',
			'',
			'$map: (',
			' "gloomy": dev.$fun-day,',
			' "goodbye": dev.fun-hello(),',
			');',
		], {
			uri: 'one.scss',
		});

		const funDay = await provideReferences(usage, 36, storage, { includeDeclaration: false });

		assert.ok(funDay, 'provideReferences returned null for a variable excluding declarations');
		assert.strictEqual(funDay?.length, 1, 'Expected one reference to $day');

		const hello = await provideReferences(usage, 64, storage, { includeDeclaration: false });
		assert.ok(hello, 'provideReferences returned null for a function excluding declarations');
		assert.strictEqual(hello?.length, 1, 'Expected one reference to hello');
	});
});
