import { getDocUri, showFile, position, sleep } from '../util';
import { testSignature } from './helper';

describe('SCSS Signature Help Test', () => {
	const docUri = getDocUri('signature/main.scss');
	const vueDocUri = getDocUri('signature/AppButton.vue');
	const svelteDocUri = getDocUri('signature/AppButton.svelte');

	before(async () => {
		await showFile(docUri);
		await showFile(vueDocUri);
		await showFile(svelteDocUri);
		await sleep(2000);
	});

	describe('Mixin', () => {
		it('should suggest all parameters of mixin', async () => {
			const expected = {
				activeParameter: 0,
				activeSignature: 0,
				signatures: [
					{
						label: 'square ($size: null, $radius: 0)',
						parameters: [{ label: '$size' }, { label: '$radius' }]
					}
				]
			};

			await testSignature(docUri, position(5, 19), expected);
			await testSignature(vueDocUri, position(14, 19), expected);
			await testSignature(svelteDocUri, position(8, 19), expected);
		});

		it('should suggest the second parameter of mixin', async () => {
			const expected = {
				activeParameter: 1,
				activeSignature: 0,
				signatures: [
					{
						label: 'square ($size: null, $radius: 0)',
						parameters: [{ label: '$size' }, { label: '$radius' }]
					}
				]
			};

			await testSignature(docUri, position(6, 21), expected);
			await testSignature(vueDocUri, position(15, 21), expected);
			await testSignature(svelteDocUri, position(9, 21), expected);
		});
	});

	describe('Function', () => {
		it('should suggest all parameters of function', async () => {
			const expected = {
				activeParameter: 0,
				activeSignature: 0,
				signatures: [
					{
						label: 'pow ($base: null, $exponent: null)',
						parameters: [{ label: '$base' }, { label: '$exponent' }]
					}
				]
			};

			await testSignature(docUri, position(8, 16), expected);
			await testSignature(vueDocUri, position(17, 16), expected);
			await testSignature(svelteDocUri, position(11, 16), expected);
		});

		it('should suggest the second parameter of function', async () => {
			const expected = {
				activeParameter: 1,
				activeSignature: 0,
				signatures: [
					{
						label: 'pow ($base: null, $exponent: null)',
						parameters: [{ label: '$base' }, { label: '$exponent' }]
					}
				]
			};

			await testSignature(docUri, position(8, 26), expected);
			await testSignature(vueDocUri, position(17, 26), expected);
			await testSignature(svelteDocUri, position(11, 26), expected);
		});
	});
});
