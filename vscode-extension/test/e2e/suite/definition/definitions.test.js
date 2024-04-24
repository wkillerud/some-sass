const {
	getDocUri,
	showFile,
	position,
	sameLineLocation,
	sleepCI,
} = require("../util");
const { testDefinition } = require("./helper");

describe("SCSS Definition Test", function () {
	const docUri = getDocUri("definition/main.scss");
	const pkgImportUri = getDocUri("pkg-import/src/styles.scss");
	const scopedPkgImportUri = getDocUri("pkg-import/src/scoped.scss");

	before(async () => {
		await showFile(docUri);
		await showFile(pkgImportUri);
		await showFile(scopedPkgImportUri);
		await sleepCI();
	});

	it("should find definition for variables", async () => {
		const expectedDocumentUri = getDocUri("_variables.scss");
		const expectedLocation = sameLineLocation(expectedDocumentUri, 1, 1, 10);

		await testDefinition(docUri, position(7, 13), expectedLocation);
	});

	it("should find definition for functions", async () => {
		const expectedDocumentUri = getDocUri("_functions.scss");
		const expectedLocation = sameLineLocation(expectedDocumentUri, 1, 11, 19);

		await testDefinition(docUri, position(7, 24), expectedLocation);
	});

	it("should find definition for mixins", async () => {
		const expectedDocumentUri = getDocUri("_mixins.scss");
		const expectedLocation = sameLineLocation(expectedDocumentUri, 1, 8, 13);

		await testDefinition(docUri, position(9, 12), expectedLocation);
	});

	it("should find definition for placeholder", async () => {
		const expectedDocumentUri = getDocUri("_placeholders.scss");
		const expectedLocation = sameLineLocation(expectedDocumentUri, 1, 1, 7);

		await testDefinition(docUri, position(20, 14), expectedLocation);
	});

	it("should find symbol definition behind namespace", async () => {
		const expectedDocumentUri = getDocUri("namespace/_variables.scss");
		const expectedLocation = sameLineLocation(expectedDocumentUri, 1, 1, 18);

		await testDefinition(docUri, position(15, 14), expectedLocation);
	});

	it("should find symbol definition behind namespace and prefix", async () => {
		const expectedDocumentUri = getDocUri("namespace/_mixins.scss");
		const expectedLocation = sameLineLocation(expectedDocumentUri, 1, 8, 17);

		await testDefinition(docUri, position(16, 17), expectedLocation);
	});

	it("finds symbol from pkg: import", async () => {
		const expectedDocumentUri = getDocUri(
			"pkg-import/node_modules/my-components/styles/colors.scss",
		);
		const expectedLocation = sameLineLocation(expectedDocumentUri, 3, 1, 15);
		await testDefinition(pkgImportUri, position(4, 19), expectedLocation);
	});

	it("finds symbol from scoped pkg: import", async () => {
		const expectedDocumentUri = getDocUri(
			"pkg-import/node_modules/@my-scope/my-components/styles/colors.scss",
		);
		const expectedLocation = sameLineLocation(expectedDocumentUri, 3, 1, 15);
		await testDefinition(scopedPkgImportUri, position(4, 19), expectedLocation);
	});
});
