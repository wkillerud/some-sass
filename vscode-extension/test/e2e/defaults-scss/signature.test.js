const { getDocUri, showFile, position, sleepCI } = require("./util");
const { testSignature } = require("./signature-helper");

describe("SCSS Signature Help Test", function () {
	const docUri = getDocUri("signature/main.scss");

	before(async () => {
		await showFile(docUri);
		await sleepCI();
	});

	describe("Mixin", () => {
		it("should suggest all parameters of mixin", async () => {
			const expected = {
				activeParameter: 0,
				activeSignature: 0,
				signatures: [
					{
						label: "square($size, $radius: 0)",
						parameters: [{ label: "$size" }, { label: "$radius" }],
					},
				],
			};

			await testSignature(docUri, position(5, 19), expected);
		});

		it("should suggest all parameters of mixin behind namespace and prefix", async () => {
			const expected = {
				activeParameter: 0,
				activeSignature: 0,
				signatures: [
					{
						label: "mix-mix-square($size, $radius: 0)",
						parameters: [{ label: "$size" }, { label: "$radius" }],
					},
				],
			};

			await testSignature(docUri, position(14, 30), expected);
		});

		it("should suggest the second parameter of mixin", async () => {
			const expected = {
				activeParameter: 1,
				activeSignature: 0,
				signatures: [
					{
						label: "square($size, $radius: 0)",
						parameters: [{ label: "$size" }, { label: "$radius" }],
					},
				],
			};

			await testSignature(docUri, position(6, 21), expected);
		});

		it("should suggest the second parameter of mixin behind namespace and prefix", async () => {
			const expected = {
				activeParameter: 1,
				activeSignature: 0,
				signatures: [
					{
						label: "mix-mix-square($size, $radius: 0)",
						parameters: [{ label: "$size" }, { label: "$radius" }],
					},
				],
			};

			await testSignature(docUri, position(15, 32), expected);
		});
	});

	describe("Function", () => {
		it("should suggest all parameters of function", async () => {
			const expected = {
				activeParameter: 0,
				activeSignature: 0,
				signatures: [
					{
						label: "pow($base, $exponent)",
						parameters: [{ label: "$base" }, { label: "$exponent" }],
					},
				],
			};

			await testSignature(docUri, position(8, 16), expected);
		});

		it("should suggest all parameters of function behind namespace and prefix", async () => {
			const expected = {
				activeParameter: 0,
				activeSignature: 0,
				signatures: [
					{
						label: "fun-fun-pow($base, $exponent)",
						parameters: [{ label: "$base" }, { label: "$exponent" }],
					},
				],
			};

			await testSignature(docUri, position(17, 27), expected);
		});

		it("should suggest the second parameter of function", async () => {
			const expected = {
				activeParameter: 1,
				activeSignature: 0,
				signatures: [
					{
						label: "pow($base, $exponent)",
						parameters: [{ label: "$base" }, { label: "$exponent" }],
					},
				],
			};

			await testSignature(docUri, position(8, 26), expected);
		});

		it("should suggest the second parameter of function behind namespace and prefix", async () => {
			const expected = {
				activeParameter: 1,
				activeSignature: 0,
				signatures: [
					{
						label: "fun-fun-pow($base, $exponent)",
						parameters: [{ label: "$base" }, { label: "$exponent" }],
					},
				],
			};

			await testSignature(docUri, position(17, 48), expected);
		});

		it("should suggest all parameters of function from Sass built-in", async () => {
			const expected = {
				activeParameter: 0,
				activeSignature: 0,
				signatures: [
					{
						label: "clamp($min, $number, $max)",
						parameters: [
							{ label: "$min" },
							{ label: "$number" },
							{ label: "$max" },
						],
					},
				],
			};

			await testSignature(docUri, position(23, 26), expected);
		});

		it("should suggest second and third parameters of function from Sass built-in", async () => {
			const expected = {
				activeParameter: 1,
				activeSignature: 0,
				signatures: [
					{
						label: "clamp($min, $number, $max)",
						parameters: [
							{ label: "$min" },
							{ label: "$number" },
							{ label: "$max" },
						],
					},
				],
			};

			await testSignature(docUri, position(24, 28), expected);
		});

		it("should suggest third parameters of function from Sass built-in", async () => {
			const expected = {
				activeParameter: 2,
				activeSignature: 0,
				signatures: [
					{
						label: "clamp($min, $number, $max)",
						parameters: [
							{ label: "$min" },
							{ label: "$number" },
							{ label: "$max" },
						],
					},
				],
			};

			await testSignature(docUri, position(25, 30), expected);
		});
	});
});
