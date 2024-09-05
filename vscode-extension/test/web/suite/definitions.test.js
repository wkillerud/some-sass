const { testDefinition } = require("./definitions-helper");
const {
	getDocUri,
	showFile,
	position,
	sameLineLocation,
	sleep,
} = require("./util");


const docUri = getDocUri("definition/main.scss");

before(async () => {
	await showFile(docUri);
	await sleep(1000);
});

test("should find definition for variables", async () => {
	const expectedDocumentUri = getDocUri("_variables.scss");
	const expectedLocation = sameLineLocation(expectedDocumentUri, 1, 1, 10);
	await testDefinition(docUri, position(7, 13), expectedLocation);
});

test("should find definition for functions", async () => {
	const expectedDocumentUri = getDocUri("_functions.scss");
	const expectedLocation = sameLineLocation(expectedDocumentUri, 1, 11, 19);
	await testDefinition(docUri, position(7, 24), expectedLocation);
});

test("should find definition for mixins", async () => {
	const expectedDocumentUri = getDocUri("_mixins.scss");
	const expectedLocation = sameLineLocation(expectedDocumentUri, 1, 8, 13);
	await testDefinition(docUri, position(9, 12), expectedLocation);
});

test("should find definition for placeholder", async () => {
	const expectedDocumentUri = getDocUri("_placeholders.scss");
	const expectedLocation = sameLineLocation(expectedDocumentUri, 1, 1, 7);
	await testDefinition(docUri, position(20, 14), expectedLocation);
});

test("should find symbol definition behind namespace", async () => {
	const expectedDocumentUri = getDocUri("namespace/_variables.scss");
	const expectedLocation = sameLineLocation(expectedDocumentUri, 1, 1, 18);
	await testDefinition(docUri, position(15, 15), expectedLocation);
});

test("should find symbol definition behind namespace and prefix", async () => {
	const expectedDocumentUri = getDocUri("namespace/_mixins.scss");
	const expectedLocation = sameLineLocation(expectedDocumentUri, 1, 8, 17);
	await testDefinition(docUri, position(16, 18), expectedLocation);
});
