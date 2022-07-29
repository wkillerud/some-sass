import { getDocUri, showFile, position, sameLineLocation } from '../util';
import { testDefinition } from './helper';

describe('SCSS Definition Test', () => {
	const docUri = getDocUri('definition/main.scss');
	const vueDocUri = getDocUri('definition/AppButton.vue');
	const svelteDocUri = getDocUri('definition/AppButton.svelte');
	const astroDocUri = getDocUri('definition/AppButton.astro');

	before(async () => {
		await showFile(docUri);
		await showFile(vueDocUri);
		await showFile(svelteDocUri);
		await showFile(astroDocUri);
	});

	it('should find definition for variables', async () => {
		const expectedDocumentUri = getDocUri('_variables.scss');
		const expectedLocation = sameLineLocation(expectedDocumentUri, 1, 1, 10);

		await testDefinition(docUri, position(6, 13), expectedLocation);
		await testDefinition(vueDocUri, position(15, 13), expectedLocation);
		await testDefinition(svelteDocUri, position(9, 15), expectedLocation);
		await testDefinition(astroDocUri, position(12, 15), expectedLocation);
	});

	it('should find definition for functions', async () => {
		const expectedDocumentUri = getDocUri('_functions.scss');
		const expectedLocation = sameLineLocation(expectedDocumentUri, 1, 1, 9);

		await testDefinition(docUri, position(6, 24), expectedLocation);
		await testDefinition(vueDocUri, position(15, 24), expectedLocation);
		await testDefinition(svelteDocUri, position(9, 26), expectedLocation);
		await testDefinition(astroDocUri, position(12, 26), expectedLocation);
	});

	it('should find definition for mixins', async () => {
		const expectedDocumentUri = getDocUri('_mixins.scss');
		const expectedLocation = sameLineLocation(expectedDocumentUri, 1, 1, 6);

		await testDefinition(docUri, position(8, 12), expectedLocation);
		await testDefinition(vueDocUri, position(17, 12), expectedLocation);
		await testDefinition(svelteDocUri, position(11, 14), expectedLocation);
		await testDefinition(astroDocUri, position(14, 14), expectedLocation);
	});

	it('should find symbol definition behind namespace', async () => {
		const expectedDocumentUri = getDocUri('namespace/_variables.scss');
		const expectedLocation = sameLineLocation(expectedDocumentUri, 1, 1, 18);

		await testDefinition(docUri, position(14, 14), expectedLocation);
		await testDefinition(vueDocUri, position(23, 14), expectedLocation);
		await testDefinition(svelteDocUri, position(17, 14), expectedLocation);
		await testDefinition(astroDocUri, position(20, 14), expectedLocation);
	});

	it('should find symbol definition behind namespace and prefix', async () => {
		const expectedDocumentUri = getDocUri('namespace/_mixins.scss');
		const expectedLocation = sameLineLocation(expectedDocumentUri, 1, 1, 10);

		await testDefinition(docUri, position(15, 17), expectedLocation);
		await testDefinition(vueDocUri, position(24, 17), expectedLocation);
		await testDefinition(svelteDocUri, position(18, 17), expectedLocation);
		await testDefinition(astroDocUri, position(21, 17), expectedLocation);
	});
});
