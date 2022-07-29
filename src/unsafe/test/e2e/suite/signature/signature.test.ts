import { getDocUri, showFile, position } from '../util';
import { testSignature } from './helper';

describe('SCSS Signature Help Test', () => {
	const docUri = getDocUri('signature/main.scss');
	const vueDocUri = getDocUri('signature/AppButton.vue');
	const svelteDocUri = getDocUri('signature/AppButton.svelte');
	const astroDocUri = getDocUri('signature/AppButton.astro');

	before(async () => {
		await showFile(docUri);
		await showFile(vueDocUri);
		await showFile(svelteDocUri);
		await showFile(astroDocUri);
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
			await testSignature(astroDocUri, position(11, 19), expected);
		});

		it('should suggest all parameters of mixin behind namespace and prefix', async () => {
			const expected = {
				activeParameter: 0,
				activeSignature: 0,
				signatures: [
					{
						label: 'mix-square ($size: null, $radius: 0)',
						parameters: [{ label: '$size' }, { label: '$radius' }]
					}
				]
			};

			await testSignature(docUri, position(14, 30), expected);
			await testSignature(vueDocUri, position(23, 30), expected);
			await testSignature(svelteDocUri, position(17, 30), expected);
			await testSignature(astroDocUri, position(20, 30), expected);
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
			await testSignature(astroDocUri, position(12, 21), expected);
		});

		it('should suggest the second parameter of mixin behind namespace and prefix', async () => {
			const expected = {
				activeParameter: 1,
				activeSignature: 0,
				signatures: [
					{
						label: 'mix-square ($size: null, $radius: 0)',
						parameters: [{ label: '$size' }, { label: '$radius' }]
					}
				]
			};

			await testSignature(docUri, position(15, 32), expected);
			await testSignature(vueDocUri, position(24, 32), expected);
			await testSignature(svelteDocUri, position(18, 32), expected);
			await testSignature(astroDocUri, position(21, 32), expected);
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
			await testSignature(astroDocUri, position(14, 16), expected);
		});

		it('should suggest all parameters of function behind namespace and prefix', async () => {
			const expected = {
				activeParameter: 0,
				activeSignature: 0,
				signatures: [
					{
						label: 'fun-pow ($base: null, $exponent: null)',
						parameters: [{ label: '$base' }, { label: '$exponent' }]
					}
				]
			};

			await testSignature(docUri, position(17, 27), expected);
			await testSignature(vueDocUri, position(26, 27), expected);
			await testSignature(svelteDocUri, position(20, 27), expected);
			await testSignature(astroDocUri, position(23, 27), expected);
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
			await testSignature(astroDocUri, position(14, 26), expected);
		});

		it('should suggest the second parameter of function behind namespace and prefix', async () => {
			const expected = {
				activeParameter: 1,
				activeSignature: 0,
				signatures: [
					{
						label: 'fun-pow ($base: null, $exponent: null)',
						parameters: [{ label: '$base' }, { label: '$exponent' }]
					}
				]
			};

			await testSignature(docUri, position(17, 48), expected);
			await testSignature(vueDocUri, position(26, 48), expected);
			await testSignature(svelteDocUri, position(20, 48), expected);
			await testSignature(astroDocUri, position(23, 48), expected);
		});

		it('should suggest all parameters of function from Sass built-in', async () => {
			const expected = {
				activeParameter: 0,
				activeSignature: 0,
				signatures: [
					{
						label: 'clamp ($min, $number, $max)',
						parameters: [{ label: '$min' }, { label: '$number' }, { label: '$max' }]
					}
				]
			};

			await testSignature(docUri, position(23, 26), expected);
		});

		it('should suggest second and third parameters of function from Sass built-in', async () => {
			const expected = {
				activeParameter: 1,
				activeSignature: 0,
				signatures: [
					{
						label: 'clamp ($min, $number, $max)',
						parameters: [{ label: '$min' }, { label: '$number' }, { label: '$max' }]
					}
				]
			};

			await testSignature(docUri, position(24, 28), expected);
		});

		it('should suggest third parameters of function from Sass built-in', async () => {
			const expected = {
				activeParameter: 2,
				activeSignature: 0,
				signatures: [
					{
						label: 'clamp ($min, $number, $max)',
						parameters: [{ label: '$min' }, { label: '$number' }, { label: '$max' }]
					}
				]
			};

			await testSignature(docUri, position(25, 30), expected);
		});
	});
});
