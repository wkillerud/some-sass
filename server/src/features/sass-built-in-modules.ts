/**
 * Copyright (c) 2006-2018 Hampton Catlin, Natalie Weizenbaum, Chris Eppstein, and Jina Anne
 * 2022 William Killerud
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

export interface SassBuiltInExport {
	description: string;
	signature?: string;
	returns?:
		| "boolean"
		| "color"
		| "function"
		| "list"
		| "map"
		| "number"
		| "selector"
		| "string";
}

export interface SassBuiltInModule {
	summary: string;
	reference: string;
	exports: Record<string, SassBuiltInExport>;
}

export const sassBuiltInModules: Record<string, SassBuiltInModule> =
	Object.freeze({
		"sass:color": {
			summary: "Generate new colors based on existing ones",
			reference: "https://sass-lang.com/documentation/modules/color",
			exports: {
				adjust: {
					description:
						"Increases or decreases one or more properties of `$color` by fixed amounts. All optional arguments must be numbers.\n\nIt's an error to specify an RGB property at the same time as an HSL property, or either of those at the same time as an HWB property.",
					signature:
						"($color, $red: null, $green: null, $blue: null, $hue: null, $saturation: null, $lightness: null, $whiteness: null, $blackness: null, $alpha: null)",
					returns: "color",
				},
				alpha: {
					description:
						"Returns the alpha channel of `$color` as a number between **0** and **1**.",
					signature: "($color)",
					returns: "number",
				},
				blackness: {
					description:
						"Returns the HWB blackness of `$color` as a number between **0%** and **100%**.",
					signature: "($color)",
					returns: "number",
				},
				blue: {
					description:
						"Returns the blue channel of `$color` as a number between **0** and **255**.",
					signature: "($color)",
					returns: "number",
				},
				change: {
					description:
						"Sets one or more properties of `$color` to new values.\n\nIt's an error to specify an RGB property at the same time as an HSL property, or either of those at the same time as an HWB property.",
					signature:
						"($color, $red: null, $green: null, $blue: null, $hue: null, $saturation: null, $lightness: null, $whiteness: null, $blackness: null, $alpha: null)",
					returns: "color",
				},
				complement: {
					description: "Returns the RGB complement of $color",
				},
				grayscale: {
					description:
						"Returns a gray color with the same lightness as `$color`.",
					signature: "($color)",
					returns: "color",
				},
				green: {
					description:
						"Returns the green channel of `$color` as a number between **0** and **255**.",
					signature: "($color)",
					returns: "number",
				},
				hue: {
					description:
						"Returns the hue of `$color` as a number between **0deg** and **360deg**.",
					signature: "($color)",
					return: "number",
				},
				hwb: {
					description:
						"Returns a color with the given hue, whiteness, and blackness and the given alpha channel.",
					signature: "($hue, $whiteness, $blackness, $alpha: 1)",
					returns: "color",
				},
				"ie-hex-str": {
					description:
						"Returns a string that represents `$color` in the #AARRGGBB format expected by -ms-filter.",
					signature: "($color)",
					returns: "string",
				},
				invert: {
					description: "Returns the inverse of `$color`.",
					signature: "($color, $weight: 100)",
					returns: "color",
				},
				lightness: {
					description:
						"Returns the HSL lightness of `$color` as a number between **0%** and **100%**.",
					signature: "($color)",
					returns: "number",
				},
				mix: {
					description:
						"Returns a color that's a mixture of `$color1` and `$color2`.",
					signature: "($color1, $color2, $weight: 50%)",
					returns: "color",
				},
				red: {
					description:
						"Returns the red channel of `$color` as a number between **0** and **255**.",
					signature: "($color)",
					returns: "number",
				},
				saturation: {
					description:
						"Returns the HSL saturation of `$color` as a number between **0%** and **100%**.",
					signature: "($color)",
					returns: "number",
				},
				scale: {
					description:
						"Fluidly scales one or more properties of `$color`. Each keyword argument must be a number between **-100%** and **100%**.\n\nIt's an error to specify an RGB property at the same time as an HSL property, or either of those at the same time as an HWB property.",
					signature:
						"($color, $red: null, $green: null, $blue: null, $saturation: null, $lightness: null, $whiteness: null, $blackness: null, $alpha: null)",
					returns: "color",
				},
				whiteness: {
					description:
						"Returns the HWB whiteness of `$color` as a number between **0%** and **100%**.",
					signature: "($color)",
					returns: "number",
				},
			},
		},
		"sass:list": {
			summary: "Modifiy or read lists",
			reference: "https://sass-lang.com/documentation/modules/list",
			exports: {
				append: {
					description:
						"Returns a copy of `$list` with `$val` added to the end.",
					signature: "($list, $val, $separator: auto)",
					returns: "list",
				},
				index: {
					description:
						"Returns the index of `$value` in `$list`.\n\nNote that the index **1** indicates the first element of the list in Sass.",
					signature: "($list, $value)",
					returns: "number",
				},
				"is-bracketed": {
					description: "Returns whether `$list` has square brackets (`[]`).",
					signature: "($list)",
					returns: "boolean",
				},
				join: {
					description:
						"Returns a new list containing the elements of `$list1` followed by the elements of `$list2`.",
					signature: "($list1, $list2, $separator: auto, $bracketed: auto)",
					returns: "list",
				},
				length: {
					description:
						"Returns the number of elements in `$list`. Can also return the number of pairs in a map.",
					signature: "($list, $value)",
					returns: "number",
				},
				separator: {
					description:
						"Returns the name of the separator used by `$list`, either **space**, **comma**, or **slash**. Returns **space** if `$list` doesn't have a separator.",
					signature: "($list)",
					returns: "string",
				},
				nth: {
					description:
						"Returns the element of `$list` at index `$n`.\n\nIf `$n` is negative, it counts from the end of `$list`. Throws an error if there is no element at index `$n`.\n\nNote that the index **1** indicates the first element of the list in Sass.",
					signature: "($list, $n)",
				},
				"set-nth": {
					description:
						"Returns a copy of `$list` with the element at index `$n` replaced with `$value`.\n\nIf `$n` is negative, it counts from the end of `$list`. Throws an error if there is no existing element at index `$n`.\n\nNote that the index **1** indicates the first element of the list in Sass.",
					signature: "($list, $n, $value)",
					returns: "list",
				},
				slash: {
					description:
						"Returns a slash-separated list that contains `$elements`.",
					signature: "($elements...)",
					returns: "list",
				},
				zip: {
					description:
						"Combines every list in $lists into a single list of sub-lists.\n\nEach element in the returned list contains all the elements at that position in $lists. The returned list is as long as the shortest list in $lists.\n\nThe returned list is always comma-separated and the sub-lists are always space-separated.",
					signature: "($lists...)",
					returns: "list",
				},
			},
		},
		"sass:map": {
			summary: "Modifiy or read maps",
			reference: "https://sass-lang.com/documentation/modules/map",
			exports: {
				"deep-merge": {
					description:
						"Identical to map.merge(), except that nested map values are also recursively merged.",
					signature: "($map1, $map2)",
					returns: "map",
				},
				"deep-remove": {
					description:
						"Returns a map without the right-most `$key`. Any keys to the left are treated as a path through the nested map, from left to right.",
					signature: "($map, $key, $keys...)",
					returns: "map",
				},
				get: {
					description:
						"Returns the value in `$map` associated with the right-most `$key`. Any keys to the left are treated as a path through the nested map, from left to right. Returns `null` if there is no `$key` in `$map`.",
					signature: "($map, $key, $keys...)",
				},
				"has-key": {
					description:
						"Returns true if `$map` has a value with the right-most `$key`. Any keys to the left are treated as a path through the nested map, from left to right.",
					signature: "($map, $key, $keys...)",
					returns: "boolean",
				},
				keys: {
					description:
						"Returns a comma-separated list of all the keys in `$map`.",
					signature: "($map)",
					returns: "list",
				},
				merge: {
					description:
						"Merges the two maps at either side of the `$args` list. Between the two maps is an optional path to a nested map in `$map1` which will be merged, instead of the root map. The value from `$map2` will be used if both maps have the same key.",
					signature: "($map1, $args...)",
					returns: "map",
				},
				remove: {
					description:
						"Removes values in `$map` associated with any of the `$keys`.",
					signature: "($map, $keys...)",
				},
				set: {
					description:
						"Sets `$value` in `$map` at the location of the right-most `$key`. Any keys to the left are treated as a path through the nested map, from left to right. Creates nested maps at `$keys` if none exists.",
					signature: "($map, $keys..., $key, $value)",
				},
				values: {
					description:
						"Returns a comma-separated list of all the values in `$map`.",
					signature: "($map)",
					returns: "list",
				},
			},
		},
		"sass:math": {
			summary: "Work on numbers with functions like `calc` and `ceil`",
			reference: "https://sass-lang.com/documentation/modules/math",
			exports: {
				$e: {
					description: "The value of the mathematical constant **e**.",
				},
				$pi: {
					description: "The value of the mathematical constant **π**.",
				},
				ceil: {
					description: "Rounds up to the nearest whole number.",
					signature: "($number)",
					returns: "number",
				},
				clamp: {
					description:
						"Restricts $number to the range between `$min` and `$max`. If `$number` is less than `$min` this returns `$min`, and if it's greater than `$max` this returns `$max`.",
					signature: "($min, $number, $max)",
					returns: "number",
				},
				floor: {
					description: "Rounds down to the nearest whole number.",
					signature: "($number)",
					returns: "number",
				},
				max: {
					description: "Returns the highest of two or more numbers.",
					signature: "($number...)",
					returns: "number",
				},
				min: {
					description: "Returns the lowest of two or more numbers.",
					signature: "($number...)",
					returns: "number",
				},
				round: {
					description: "Rounds to the nearest whole number.",
					signature: "($number)",
					returns: "number",
				},
				abs: {
					description: "Returns the absolute value of `$number`.",
					signature: "($number)",
					returns: "number",
				},
				hypot: {
					description:
						"Returns the length of the n-dimensional vector that has components equal to each $number. For example, for three numbers a, b, and c, this returns the square root of a² + b² + c².",
					signature: "($number...)",
					returns: "number",
				},
				log: {
					description:
						"Returns the logarithm of `$number` with respect to `$base`. If `$base` is `null`, the natural log is calculated.",
					signature: "($number, $base: null)",
					returns: "number",
				},
				pow: {
					description:
						"Raises `$base` to the power of `$exponent`. Both values must be unitless.",
					signature: "($base, $exponent)",
					returns: "number",
				},
				sqrt: {
					description:
						"Returns the square root of `$number`. `$number` must be unitless.",
					signature: "($number)",
					returns: "number",
				},
				cos: {
					description:
						"Returns the cosine of `$number`. `$number` must be an angle or unitless.",
					signature: "($number)",
					returns: "number",
				},
				sin: {
					description:
						"Returns the sine of `$number`. `$number` must be an angle or unitless.",
					signature: "($number)",
					returns: "number",
				},
				tan: {
					description:
						"Returns the tangent of `$number`. `$number` must be an angle or unitless.",
					signature: "($number)",
					returns: "number",
				},
				acos: {
					description:
						"Returns the arccosine of `$number` in deg. `$number` must be unitless.",
					signature: "($number)",
					returns: "number",
				},
				asin: {
					description:
						"Returns the arcsine of `$number` in deg. `$number` must be unitless.",
					signature: "($number)",
					returns: "number",
				},
				atan: {
					description:
						"Returns the arctangent of `$number` in deg. `$number` must be unitless.",
					signature: "($number)",
					returns: "number",
				},
				atan2: {
					description:
						"Returns the 2-argument arctangent of `$y` and `$x` in deg. `$y` and `$x` must have compatible units or be unitless.",
					signature: "($y, $x)",
					returns: "number",
				},
				compatible: {
					description:
						"Returns whether `$number1` and `$number2` have compatible units.",
					signature: "($number1, $number2)",
					returns: "boolean",
				},
				"is-unitless": {
					description: "Returns true if `$number` has no units.",
					signature: "($number)",
					returns: "boolean",
				},
				unit: {
					description: "Returns a string representation of `$number`'s units.",
					signature: "($number)",
					returns: "string",
				},
				div: {
					description: "Divides `$number1` by `$number2`.",
					signature: "($number1, $number2)",
					returns: "number",
				},
				percentage: {
					description: "Converts a unitless `$number` to a percentage.",
					signature: "($number)",
					returns: "number",
				},
				random: {
					description:
						"Returns a random decimal number between **0** and **1**, or a random whole number between **1** and `$limit`.",
					signature: "($limit: null)",
					returns: "number",
				},
			},
		},
		"sass:meta": {
			summary: "Access to the inner workings of Sass",
			reference: "https://sass-lang.com/documentation/modules/meta",
			exports: {
				"load-css": {
					signature: "($url, $with: null)",
					description:
						"Load the module at $url and include its CSS as if it were written as the contents of this mixin. The optional $with parameter configures the modules. It must be a map from variable names (without $) to the values of those variables.",
				},
				"calc-args": {
					signature: "($calc)",
					description: "Returns the arguments for the given calculation.",
					returns: "list",
				},
				"calc-name": {
					signature: "($calc)",
					description: "Returns the name of the given calculation.",
					returns: "string",
				},
				call: {
					signature: "($function, $args...)",
					description:
						"Invokes $function with $args and returns the result.\n\nThe $function should be a function returned by meta.get-function().",
				},
				"content-exists": {
					signature: "()",
					description:
						"Returns whether the current mixin was passed a @content block.\n\nThrows if called outside of a mixin.",
					returns: "boolean",
				},
				"feature-exists": {
					signature: "($feature)",
					description:
						"Returns whether the current Sass implementation supports the given feature.",
					returns: "boolean",
				},
				"function-exists": {
					signature: "($name)",
					description:
						"Returns whether a function named $name is defined, either as a built-in function or a user-defined function.",
					returns: "boolean",
				},
				"get-function": {
					signature: "($name, $css: false, $module: null)",
					description:
						"Returns the function named $name.\n\nIf $module is null, this returns the function named $name without a namespace. Otherwise, $module must be a string matching the namespace of a @use rule in the current file.\n\nBy default, this throws an error if $name doesn't refer to a Sass function. However, if $css is true, it instead returns a plain CSS function.\n\nThe returned function can be called using meta.call().",
					returns: "function",
				},
				"global-variable-exists": {
					signature: "($name, $module: null)",
					description:
						"Returns whether a global variable named $name (without the $) exists.\n\nIf $module is null, this returns whether a variable named $name without a namespace exists. Otherwise, $module must be a string matching the namespace of a @use rule in the current file, in which case this returns whether that module has a variable named $name.",
					returns: "boolean",
				},
				inspect: {
					signature: "($value)",
					description:
						"Returns a string representation of $value.\n\nThis function is intended for debugging.",
				},
				keywords: {
					signature: "($args)",
					description:
						"Returns the keywords passed to a mixin or function that takes arbitrary arguments. The $args argument must be an argument list.\n\nThe keywords are returned as a map from argument names as unquoted strings (not including $) to the values of those arguments.",
					returns: "map",
				},
				"mixin-exists": {
					signature: "($name, $module: null)",
					description:
						"Returns whether a mixin named $name exists.\n\nIf $module is null, this returns whether a mixin named $name without a namespace exists. Otherwise, $module must be a string matching the namespace of a @use rule in the current file, in which case this returns whether that module has a mixin named $name.",
					returns: "boolean",
				},
				"module-functions": {
					signature: "($module)",
					description:
						"Returns all the functions defined in a module, as a map from function names to function values.\n\nThe $module parameter must be a string matching the namespace of a @use rule in the current file.",
					returns: "map",
				},
				"module-variables": {
					signature: "($module)",
					description:
						"Returns all the variables defined in a module, as a map from variable names (without $) to the values of those variables.\n\nThe $module parameter must be a string matching the namespace of a @use rule in the current file.",
					returns: "map",
				},
				"type-of": {
					signature: "($value)",
					description: "Returns the type of $value.",
					returns: "string",
				},
				"variable-exists": {
					signature: "($name)",
					description:
						"Returns whether a variable named $name (without the $) exists in the current scope.",
					returns: "string",
				},
			},
		},
		"sass:selector": {
			summary: "Access to the Sass selector engine",
			reference: "https://sass-lang.com/documentation/modules/selector",
			exports: {
				"is-superselector": {
					description:
						"Returns whether the selector `$super` matches all the elements that the selector `$sub` matches.",
					signature: "($super, $sub)",
					returns: "boolean",
				},
				append: {
					description:
						"Combines `$selectors` without descendant combinators — that is, without whitespace between them.\n\nIf any selector in `$selectors` is a selector list, each complex selector is combined separately.\n\nThe `$selectors` may contain placeholder selectors, but not parent selectors.",
					signature: "($selectors...)",
					returns: "selector",
				},
				extend: {
					description: "Extends `$selector` as with the `@extend` rule.",
					signature: "($selector, $extendee, $extender)",
					returns: "selector",
				},
				nest: {
					description:
						"Combines `$selectors` as though they were nested within one another in the stylesheet.",
					signature: "($selectors...)",
					returns: "selector",
				},
				parse: {
					description: "Returns `$selector` in the selector value format.",
					signature: "($selector)",
					returns: "selector",
				},
				replace: {
					description:
						"Returns a copy of `$selector` with all instances of $original replaced by `$replacement`. Uses the same intelligent unification as `@extend`.",
					signature: "($selector, $original, $replacement)",
					returns: "selector",
				},
				unify: {
					description:
						"Returns a selector that matches only elements matched by both `$selector1` and `$selector2`, or `null` if there is no overlap.",
					signature: "($selector1, $selector2)",
					returns: "selector",
				},
				"simple-selectors": {
					description:
						"Returns a list of simple selectors in `$selector`.\n\n`$selector` must be a single string that contains a compound selector. This means it may not contain combinators (including spaces) or commas.\n\nThe returned list is comma-separated, and the simple selectors are unquoted strings.",
					signature: "($selector)",
					returns: "list",
				},
			},
		},
		"sass:string": {
			summary: "Combine, split and search strings",
			reference: "https://sass-lang.com/documentation/modules/string",
			exports: {
				quote: {
					description: "Returns `$string` as a quoted string.",
					signature: "($string)",
					returns: "string",
				},
				index: {
					description:
						"Returns the first index of `$substring` in `$string`, or `null` if the substring is not found.\n\nNote that the index **1** indicates the first character of `$string` in Sass.",
					signature: "($string, $substring)",
					returns: "number",
				},
				insert: {
					description:
						"Returns a copy of `$string` with `$insert` inserted at `$index`.\n\nNote that the index **1** indicates the first character of `$string` in Sass.",
					signature: "($string, $insert, $index)",
					returns: "string",
				},
				length: {
					description: "Returns the number of characters in `$string`.",
					signature: "($string)",
					returns: "number",
				},
				slice: {
					description:
						"Returns the slice of `$string` starting at index `$start-at` and ending at index `$end-at` (both inclusive).\n\nNote that the index **1** indicates the first character of `$string` in Sass.",
					signature: "($string, $start-at, $end-at: -1)",
					returns: "string",
				},
				"to-upper-case": {
					description:
						"Returns a copy of `$string` with the ASCII letters converted to upper case.",
					signature: "($string)",
					returns: "string",
				},
				"to-lower-case": {
					description:
						"Returns a copy of `$string` with the ASCII letters converted to lower case.",
					signature: "($string)",
					returns: "string",
				},
				"unique-id": {
					description:
						"Returns a randomly-generated unquoted string that's guaranteed to be a valid CSS identifier and to be unique within the current Sass compilation.",
					signature: "()",
					returns: "string",
				},
				unquote: {
					description:
						"Returns `$string` as an unquoted string. This can produce strings that are _not_ valid CSS, so use with caution.",
					signature: "($string)",
					returns: "string",
				},
			},
		},
	});

export const sassBuiltInModuleNames: string[] = Object.keys(sassBuiltInModules);
