import { getDocUri, showFile, position, sleep } from '../util';
import { testHover } from './helper';

describe('SCSS Hover Test', () => {
	const docUri = getDocUri('hover/main.scss');
	const vueDocUri = getDocUri('hover/AppButton.vue');
	const svelteDocUri = getDocUri('hover/AppButton.svelte');

	before(async () => {
		await showFile(docUri);
		await showFile(vueDocUri);
		await showFile(svelteDocUri);
		await sleep(2000);
	});

	it('shows hover for variables', async () => {
		await testHover(docUri, position(6, 13), {
			contents: ['```scss\n$variable: \'value\';\n```\n____\nVariable declared in _variables.scss']
		});
	});

	it('shows hover for functions', async () => {
		await testHover(docUri, position(6, 24), {
			contents: ['```scss\n@function function()\n```\n____\nFunction declared in _functions.scss']
		});
	});

	it('shows hover for mixins', async () => {
		await testHover(docUri, position(8, 12), {
			contents: ['```scss\n@mixin mixin()\n```\n____\nMixin declared in _mixins.scss']
		});
	});

	it('shows hover for variables on vue file', async () => {
		await testHover(vueDocUri, position(15, 13), {
			contents: ['```scss\n$variable: \'value\';\n```\n____\nVariable declared in _variables.scss']
		});
	});

	it('shows hover for functions on vue file', async () => {
		await testHover(vueDocUri, position(15, 24), {
			contents: ['```scss\n@function function()\n```\n____\nFunction declared in _functions.scss']
		});
	});

	it('shows hover for mixins on vue file', async () => {
		await testHover(vueDocUri, position(17, 12), {
			contents: ['```scss\n@mixin mixin()\n```\n____\nMixin declared in _mixins.scss']
		});
	});

	it('shows hover for variables on svelte file', async () => {
		await testHover(svelteDocUri, position(9, 15), {
			contents: ['```scss\n$variable: \'value\';\n```\n____\nVariable declared in _variables.scss']
		});
	});

	it('shows hover for functions on svelte file', async () => {
		await testHover(svelteDocUri, position(9, 26), {
			contents: ['```scss\n@function function()\n```\n____\nFunction declared in _functions.scss']
		});
	});

	it('shows hover for mixins on svelte file', async () => {
		await testHover(svelteDocUri, position(11, 14), {
			contents: ['```scss\n@mixin mixin()\n```\n____\nMixin declared in _mixins.scss']
		});
	});
});
