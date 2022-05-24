'use strict';

import assert from 'assert';
import fs from 'fs';

import sinon from 'sinon';
import { Stats } from '@nodelib/fs.macchiato';
import { URI } from 'vscode-uri';

import { parseDocument, reForward, reModuleAtRule, reUse } from '../../services/parser';
import StorageService from '../../services/storage';
import * as helpers from '../helpers';

const storage = new StorageService();

describe('Services/Parser', () => {
	describe('.parseDocument', () => {
		let statStub: sinon.SinonStub;

		beforeEach(() => {
			statStub = sinon.stub(fs, 'stat').yields(null, new Stats());
		});

		afterEach(() => {
			statStub.restore();
		});

		it('should return symbols', async () => {
			const document = await helpers.makeDocument(storage, [
				'$name: "value";',
				'@mixin mixin($a: 1, $b) {}',
				'@function function($a: 1, $b) {}'
			]);

			const symbols = await parseDocument(document, URI.parse(''));

			// Variables
			const variables = [...symbols.variables.values()];
			assert.strictEqual(variables.length, 1);

			assert.strictEqual(variables[0]?.name, '$name');
			assert.strictEqual(variables[0]?.value, '"value"');

			// Mixins
			const mixins = [...symbols.mixins.values()];
			assert.strictEqual(mixins.length, 1);

			assert.strictEqual(mixins[0]?.name, 'mixin');
			assert.strictEqual(mixins[0]?.parameters.length, 2);

			assert.strictEqual(mixins[0]?.parameters[0]?.name, '$a');
			assert.strictEqual(mixins[0]?.parameters[0]?.value, '1');

			assert.strictEqual(mixins[0]?.parameters[1]?.name, '$b');
			assert.strictEqual(mixins[0]?.parameters[1]?.value, null);

			// Functions
			const functions = [...symbols.functions.values()];
			assert.strictEqual(functions.length, 1);

			assert.strictEqual(functions[0]?.name, 'function');
			assert.strictEqual(functions[0]?.parameters.length, 2);

			assert.strictEqual(functions[0]?.parameters[0]?.name, '$a');
			assert.strictEqual(functions[0]?.parameters[0]?.value, '1');

			assert.strictEqual(functions[0]?.parameters[1]?.name, '$b');
			assert.strictEqual(functions[0]?.parameters[1]?.value, null);
		});
	});

	describe("regular expressions", () => {
		it("for detecting module at rules", () => {
			assert.ok(reModuleAtRule.test('@use "file";'), "should match a basic @use");
			assert.ok(reModuleAtRule.test('  @use "file";'), "should match an indented @use");
			assert.ok(reModuleAtRule.test('@use "~file";'), "should match @use from node_modules");
			assert.ok(reModuleAtRule.test("@use 'file';"), "should match @use with single quotes");
			assert.ok(reModuleAtRule.test('@use "../file";'), "should match relative @use one level up");
			assert.ok(reModuleAtRule.test('@use "../../../file";'), "should match relative @use several levels up");
			assert.ok(reModuleAtRule.test('@use "./file/other";'), "should match relative @use one level down");
			assert.ok(reModuleAtRule.test('@use "./file/yet/another";'), "should match relative @use several levels down");

			assert.ok(reModuleAtRule.test('@forward "file";'), "should match a basic @forward");
			assert.ok(reModuleAtRule.test('  @forward "file";'), "should match an indented @forward");
			assert.ok(reModuleAtRule.test('@forward "~file";'), "should match @forward from node_modules");
			assert.ok(reModuleAtRule.test("@forward 'file';"), "should match @forward with single quotes");
			assert.ok(reModuleAtRule.test('@forward "../file";'), "should match relative @forward one level up");
			assert.ok(reModuleAtRule.test('@forward "../../../file";'), "should match relative @forward several levels up");
			assert.ok(reModuleAtRule.test('@forward "./file/other";'), "should match relative @forward one level down");
			assert.ok(reModuleAtRule.test('@forward "./file/yet/another";'), "should match relative @forward several levels down");

			assert.ok(reModuleAtRule.test('@import "file";'), "should match a basic @import");
			assert.ok(reModuleAtRule.test('  @import "file";'), "should match an indented @import");
			assert.ok(reModuleAtRule.test('@import "~file";'), "should match @import from node_modules");
			assert.ok(reModuleAtRule.test("@import 'file';"), "should match @import with single quotes");
			assert.ok(reModuleAtRule.test('@import "../file";'), "should match relative @import one level up");
			assert.ok(reModuleAtRule.test('@import "../../../file";'), "should match relative @import several levels up");
			assert.ok(reModuleAtRule.test('@import "./file/other";'), "should match relative @import one level down");
			assert.ok(reModuleAtRule.test('@import "./file/yet/another";'), "should match relative @import several levels down");
		})

		it("for use", () => {
			assert.ok(reUse.test('@use "file";'), "should match a basic @use");
			assert.ok(reUse.test('  @use "file";'), "should match an indented @use");
			assert.ok(reUse.test('@use "~file";'), "should match @use from node_modules");
			assert.ok(reUse.test("@use 'file';"), "should match @use with single quotes");
			assert.ok(reUse.test('@use "../file";'), "should match relative @use one level up");
			assert.ok(reUse.test('@use "../../../file";'), "should match relative @use several levels up");
			assert.ok(reUse.test('@use "./file/other";'), "should match relative @use one level down");
			assert.ok(reUse.test('@use "./file/yet/another";'), "should match relative @use several levels down");

			assert.ok(reUse.test('@use "variables" as vars;'), "should match a @use with an alias");
			assert.ok(reUse.test('@use "src/corners" as *;'), "should match a @use with a wildcard as alias");

			const match = reUse.exec('@use "variables" as vars;');
			assert.strictEqual(match!.groups!["url"] as string, "variables");
			assert.strictEqual(match!.groups!["namespace"] as string, "vars");
		});

		it ("for forward", () => {
			assert.ok(reForward.test('@forward "file";'), "should match a basic @forward");
			assert.ok(reForward.test('  @forward "file";'), "should match an indented @forward");
			assert.ok(reForward.test('@forward "~file";'), "should match @forward from node_modules");
			assert.ok(reForward.test("@forward 'file';"), "should match @forward with single quotes");
			assert.ok(reForward.test('@forward "../file";'), "should match relative @forward one level up");
			assert.ok(reForward.test('@forward "../../../file";'), "should match relative @forward several levels up");
			assert.ok(reForward.test('@forward "./file/other";'), "should match relative @forward one level down");
			assert.ok(reForward.test('@forward "./file/yet/another";'), "should match relative @forward several levels down");

			assert.ok(reForward.test('@forward "colors" as color-* hide $varslingsfarger, varslingsfarge;'), "should match a @forward with an alias and several hide");
			assert.ok(reForward.test('@forward "shadow";'), "should match a @forward with no alias and no hide");
			assert.ok(reForward.test('@forward "spacing" hide $spacing-new;'), "should match a @forward with no alias and a hide");

			const match = reForward.exec('@forward "colors" as color-* hide $varslingsfarger, varslingsfarge;');
			assert.strictEqual(match!.groups!["url"] as string, "colors");
			assert.strictEqual(match!.groups!["prefix"] as string, "color-");
			assert.strictEqual(match!.groups!["hide"] as string, "$varslingsfarger, varslingsfarge");
		});
	});
});
