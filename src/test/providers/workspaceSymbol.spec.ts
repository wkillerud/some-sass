'use strict';

import * as assert from 'assert';

import StorageService from '../../services/storage';
import { searchWorkspaceSymbol } from '../../providers/workspaceSymbol';

const storage = new StorageService();

storage.set('one.less', {
	document: 'one.less',
	variables: [
		{ name: '$a', value: '1', offset: 0, position: { line: 1, character: 1 } }
	],
	mixins: [
		{ name: 'mixin', parameters: [], offset: 0, position: { line: 1, character: 1 } }
	],
	functions: [
		{ name: 'make', parameters: [], offset: 0, position: { line: 1, character: 1 } }
	],
	imports: []
});

describe('Providers/WorkspaceSymbol', () => {
	it('searchWorkspaceSymbol - Empty query', () => {
		assert.equal(searchWorkspaceSymbol('', storage, '').length, 3);
	});

	it('searchWorkspaceSymbol - Non-empty query', () => {
		assert.equal(searchWorkspaceSymbol('$', storage, '').length, 1);
	});
});
