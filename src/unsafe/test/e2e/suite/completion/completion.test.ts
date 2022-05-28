import { getDocUri, showFile, position, sleep } from '../util';
import { testCompletion } from './helper';


describe('SCSS Completion Test', () => {
	const docUri = getDocUri('completion/main.scss');
	const vueDocUri = getDocUri('completion/AppButton.vue');
	const svelteDocUri = getDocUri('completion/AppButton.svelte');

	before(async () => {
		await showFile(docUri);
		await showFile(vueDocUri);
		await showFile(svelteDocUri);
		await sleep(2000);
	});

	it('Offers completions from tilde imports', async () => {
		const expectedCompletions = [{ label: '$tilde', detail: 'Variable declared in bar.scss' }];

		await testCompletion(docUri, position(11, 11), expectedCompletions);
		await testCompletion(vueDocUri, position(22, 11), expectedCompletions);
		await testCompletion(svelteDocUri, position(14, 11), expectedCompletions);
	});

	it('Offers completions from partial file', async () => {
		const expectedCompletions = [{ label: '$partial', detail: 'Variable declared in _partial.scss' }];

		await testCompletion(docUri, position(17, 11), expectedCompletions);
		await testCompletion(vueDocUri, position(28, 11), expectedCompletions);
		await testCompletion(svelteDocUri, position(20, 11), expectedCompletions);
	});

	it('Offers namespaces completions', async () => {
		const expectedCompletions = [{ label: '$variable', detail: 'Variable declared in _variables.scss' }];

		await testCompletion(docUri, position(23, 14), expectedCompletions);
		await testCompletion(vueDocUri, position(34, 14), expectedCompletions);
		await testCompletion(svelteDocUri, position(26, 14), expectedCompletions);
	});

	it('Offers no completions on Vuelike file outside SCSS regions', async () => {
		await testCompletion(vueDocUri, position(2, 9), []);
		await testCompletion(vueDocUri, position(6, 8), []);
		await testCompletion(svelteDocUri, position(1, 16), []);
	});

	it('Offers variable completions on Vuelike file', async () => {
		const expectedCompletions = ['$color', '$fonts'];

		await testCompletion(vueDocUri, position(16, 11), expectedCompletions);
		await testCompletion(svelteDocUri, position(8, 11), expectedCompletions);
	});
});
