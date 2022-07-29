import { sassDocAnnotations } from '../../../../sassdocAnnotations';
import { getDocUri, showFile, position } from '../util';
import { testCompletion } from './helper';


describe('SCSS Completion Test', () => {
	const docUri = getDocUri('completion/main.scss');
	const vueDocUri = getDocUri('completion/AppButton.vue');
	const svelteDocUri = getDocUri('completion/AppButton.svelte');
	const astroDocUri = getDocUri('completion/AppButton.astro');

	before(async () => {
		await showFile(docUri);
		await showFile(vueDocUri);
		await showFile(svelteDocUri);
		await showFile(astroDocUri);
	});

	it('Offers completions from tilde imports', async () => {
		let expectedCompletions = [{ label: '$tilde', detail: 'Variable declared in bar.scss', insertText: '"$tilde"' }];
		await testCompletion(docUri, position(11, 11), expectedCompletions);

		// For Vue, Svelte and Astro, the existing $ is not replaced by VS Code, so omit it from insertText
		expectedCompletions = [{ label: '$tilde', detail: 'Variable declared in bar.scss', insertText: '"tilde"' }];
		await testCompletion(vueDocUri, position(22, 11), expectedCompletions);
		await testCompletion(svelteDocUri, position(14, 11), expectedCompletions);
		await testCompletion(astroDocUri, position(17, 11), expectedCompletions);
	});

	it('Offers completions from partial file', async () => {
		const expectedCompletions = [{ label: '$partial', detail: 'Variable declared in _partial.scss' }];

		await testCompletion(docUri, position(17, 11), expectedCompletions);
		await testCompletion(vueDocUri, position(28, 11), expectedCompletions);
		await testCompletion(svelteDocUri, position(20, 11), expectedCompletions);
		await testCompletion(astroDocUri, position(23, 11), expectedCompletions);
	});

	it('Offers namespaces completions including prefixes', async () => {
		let expectedCompletions = [
			{ label: '$var-var-variable', detail: 'Variable declared in _variables.scss', insertText: '".$var-var-variable"' },
			{ label: 'fun-fun-function', detail: 'Function declared in _functions.scss', insertText: '{"_tabstop":1,"value":".fun-fun-function"}' }
		];

		await testCompletion(docUri, position(23, 13), expectedCompletions);

		// For Vue, Svelte and Astro, the existing . from the namespace and $ from the variable is not replaced by VS Code, so omit them from insertText.
		expectedCompletions = [
			{ label: '$var-var-variable', detail: 'Variable declared in _variables.scss', insertText: '"var-var-variable"' },
			{ label: 'fun-fun-function', detail: 'Function declared in _functions.scss', insertText: '{"_tabstop":1,"value":"fun-fun-function"}' }
		]

		await testCompletion(vueDocUri, position(34, 13), expectedCompletions);
		await testCompletion(svelteDocUri, position(26, 13), expectedCompletions);
		await testCompletion(astroDocUri, position(29, 13), expectedCompletions);


		expectedCompletions = [
			{ label: 'mix-mix-mixin', detail: 'Mixin declared in _mixins.scss', insertText: '{"_tabstop":1,"value":".mix-mix-mixin"}' },
		];

		await testCompletion(docUri, position(24, 15), expectedCompletions);

		// Same as for functions with regards to the . from the namespace.
		expectedCompletions = [
			{ label: 'mix-mix-mixin', detail: 'Mixin declared in _mixins.scss', insertText: '{"_tabstop":1,"value":"mix-mix-mixin"}' },
		];

		await testCompletion(vueDocUri, position(35, 15), expectedCompletions);
		await testCompletion(svelteDocUri, position(27, 15), expectedCompletions);
		await testCompletion(astroDocUri, position(30, 15), expectedCompletions);
	});

	// We can't test this until somesass.suggestOnlyFromUse: true becomes the default setting
	it.skip('Offers no hidden items in namespace completions', async () => {
		let expectedCompletions = ['$secret'];

		await testCompletion(docUri, position(23, 13), expectedCompletions, { expectNoMatch: true });
		await testCompletion(vueDocUri, position(34, 13), expectedCompletions, { expectNoMatch: true });
		await testCompletion(svelteDocUri, position(26, 13), expectedCompletions, { expectNoMatch: true });
		await testCompletion(astroDocUri, position(29, 13), expectedCompletions, { expectNoMatch: true });

		expectedCompletions = ['secret', 'other-secret', 'mix-secret', 'mix-other-secret'];

		await testCompletion(docUri, position(24, 15), expectedCompletions, { expectNoMatch: true });
		await testCompletion(vueDocUri, position(35, 15), expectedCompletions, { expectNoMatch: true });
		await testCompletion(svelteDocUri, position(27, 15), expectedCompletions, { expectNoMatch: true });
		await testCompletion(astroDocUri, position(30, 15), expectedCompletions, { expectNoMatch: true });
	});

	it('Offers no completions on Vuelike file outside SCSS regions', async () => {
		await testCompletion(vueDocUri, position(2, 9), []);
		await testCompletion(vueDocUri, position(6, 8), []);
		await testCompletion(svelteDocUri, position(1, 16), []);
		await testCompletion(astroDocUri, position(4, 16), []);
	});

	it('Offers variable completions on Vuelike file', async () => {
		const expectedCompletions = ['$color', '$fonts'];

		await testCompletion(vueDocUri, position(16, 11), expectedCompletions);
		await testCompletion(svelteDocUri, position(8, 11), expectedCompletions);
		await testCompletion(astroDocUri, position(11, 11), expectedCompletions);
	});
});

describe('SassDoc Completion Test', () => {
	const docUri = getDocUri('completion/sassdoc.scss');

	before(async () => {
		await showFile(docUri);
	});

	it('Offers completions for SassDoc block on mixin without parameters or @content', async () => {
		const expectedCompletions = [{ label: 'SassDoc block', insertText: '{"_tabstop":1,"value":" ${0}\\n/// @output ${2}"}' }]

		await testCompletion(docUri, position(3, 4), expectedCompletions);
	});

	it('Offers completions for SassDoc block on mixin with @content', async () => {
		const expectedCompletions = [{ label: 'SassDoc block', insertText: '{"_tabstop":1,"value":" ${0}\\n/// @content ${1}\\n/// @output ${2}"}' }]

		await testCompletion(docUri, position(8, 4), expectedCompletions);
	});

	it('Offers completions for SassDoc block on mixin with parameters', async () => {
		const expectedCompletions = [{ label: 'SassDoc block', insertText: '{"_tabstop":1,"value":" ${0}\\n/// @param {${1:Number}} \\\\$a [1px] ${2:-}\\n/// @param {${3:Number}} \\\\$b [2px] ${4:-}\\n/// @output ${6:-}"}' }]

		await testCompletion(docUri, position(13, 4), expectedCompletions);
	});

	it('Offers completions for SassDoc block on mixin with parameters and @content', async () => {
		const expectedCompletions = [{ label: 'SassDoc block', insertText: '{"_tabstop":1,"value":" ${0}\\n/// @param {${1:type}} \\\\$a ${2:-}\\n/// @param {${3:type}} \\\\$b ${4:-}\\n/// @output ${6:-}"}' }]

		await testCompletion(docUri, position(18, 4), expectedCompletions);
	});

	it('Offers completions for SassDoc block on parameterless function', async () => {
		const expectedCompletions = [{ label: 'SassDoc block', insertText: '{"_tabstop":1,"value":" ${0}\\n/// @param {${1:type}} \\\\ ${2:-}\\n/// @return {${3:type}} ${4:-}"}' }]

		await testCompletion(docUri, position(25, 4), expectedCompletions);
	});

	it('Offers completions for SassDoc block on parameterfull function', async () => {
		const expectedCompletions = [{ label: 'SassDoc block', insertText: '{"_tabstop":1,"value":" ${0}\\n/// @param {${1:Number}} \\\\$a [1px] ${2:-}\\n/// @param {${3:Number}} \\\\$b [2px] ${4:-}\\n/// @return {${5:type}} ${6:-}"}' }]

		await testCompletion(docUri, position(30, 4), expectedCompletions);
	});

	it('Offers completions for SassDoc annotations on variable', async () => {
		const expectedCompletions = sassDocAnnotations.map(a => a.annotation);

		await testCompletion(docUri, position(35, 4), expectedCompletions);
	});
});
