/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// file generated from @vscode/web-custom-data NPM package

import { CSSDataV1 } from "../cssLanguageTypes";

export const cssData: CSSDataV1 = {
	version: 1.1,
	properties: [
		{
			name: "additive-symbols",
			browsers: ["FF33"],
			atRule: "@counter-style",
			syntax: "[ <integer [0,∞]> && <symbol> ]#",
			relevance: 50,
			description:
				"@counter-style descriptor. Specifies the symbols used by the marker-construction algorithm specified by the system descriptor. Needs to be specified if the counter system is 'additive'.",
			restrictions: ["integer", "string", "image", "identifier"],
		},
		{
			name: "align-content",
			browsers: ["E12", "FF28", "FFA28", "S9", "SM9", "C29", "CA29", "IE11", "O16"],
			values: [
				{
					name: "center",
					description: "Lines are packed toward the center of the flex container.",
				},
				{
					name: "flex-end",
					description: "Lines are packed toward the end of the flex container.",
				},
				{
					name: "flex-start",
					description: "Lines are packed toward the start of the flex container.",
				},
				{
					name: "space-around",
					description: "Lines are evenly distributed in the flex container, with half-size spaces on either end.",
				},
				{
					name: "space-between",
					description: "Lines are evenly distributed in the flex container.",
				},
				{
					name: "stretch",
					description: "Lines stretch to take up the remaining space.",
				},
				{
					name: "start",
				},
				{
					name: "end",
				},
				{
					name: "normal",
				},
				{
					name: "baseline",
				},
				{
					name: "first baseline",
				},
				{
					name: "last baseline",
				},
				{
					name: "space-around",
				},
				{
					name: "space-between",
				},
				{
					name: "space-evenly",
				},
				{
					name: "stretch",
				},
				{
					name: "safe",
				},
				{
					name: "unsafe",
				},
			],
			syntax: "normal | <baseline-position> | <content-distribution> | <overflow-position>? <content-position>",
			relevance: 68,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/align-content",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description:
				"Aligns a flex container's lines within the flex container when there is extra space in the cross-axis, similar to how 'justify-content' aligns individual items within the main-axis.",
			restrictions: ["enum"],
		},
		{
			name: "align-items",
			browsers: ["E12", "FF20", "FFA20", "S9", "SM9", "C29", "CA29", "IE11", "O16"],
			values: [
				{
					name: "baseline",
					description:
						"If the flex item's inline axis is the same as the cross axis, this value is identical to 'flex-start'. Otherwise, it participates in baseline alignment.",
				},
				{
					name: "center",
					description: "The flex item's margin box is centered in the cross axis within the line.",
				},
				{
					name: "flex-end",
					description:
						"The cross-end margin edge of the flex item is placed flush with the cross-end edge of the line.",
				},
				{
					name: "flex-start",
					description:
						"The cross-start margin edge of the flex item is placed flush with the cross-start edge of the line.",
				},
				{
					name: "stretch",
					description:
						"If the cross size property of the flex item computes to auto, and neither of the cross-axis margins are auto, the flex item is stretched.",
				},
				{
					name: "normal",
				},
				{
					name: "start",
				},
				{
					name: "end",
				},
				{
					name: "self-start",
				},
				{
					name: "self-end",
				},
				{
					name: "first baseline",
				},
				{
					name: "last baseline",
				},
				{
					name: "stretch",
				},
				{
					name: "safe",
				},
				{
					name: "unsafe",
				},
			],
			syntax: "normal | stretch | <baseline-position> | [ <overflow-position>? <self-position> ]",
			relevance: 89,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/align-items",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description: "Aligns flex items along the cross axis of the current line of the flex container.",
			restrictions: ["enum"],
		},
		{
			name: "justify-items",
			browsers: ["E12", "FF20", "FFA20", "S9", "SM9", "C52", "CA52", "IE11", "O12.1"],
			values: [
				{
					name: "auto",
				},
				{
					name: "normal",
				},
				{
					name: "end",
				},
				{
					name: "start",
				},
				{
					name: "flex-end",
					description: '"Flex items are packed toward the end of the line."',
				},
				{
					name: "flex-start",
					description: '"Flex items are packed toward the start of the line."',
				},
				{
					name: "self-end",
					description:
						"The item is packed flush to the edge of the alignment container of the end side of the item, in the appropriate axis.",
				},
				{
					name: "self-start",
					description:
						"The item is packed flush to the edge of the alignment container of the start side of the item, in the appropriate axis..",
				},
				{
					name: "center",
					description: "The items are packed flush to each other toward the center of the of the alignment container.",
				},
				{
					name: "left",
				},
				{
					name: "right",
				},
				{
					name: "baseline",
				},
				{
					name: "first baseline",
				},
				{
					name: "last baseline",
				},
				{
					name: "stretch",
					description:
						"If the cross size property of the flex item computes to auto, and neither of the cross-axis margins are auto, the flex item is stretched.",
				},
				{
					name: "safe",
				},
				{
					name: "unsafe",
				},
				{
					name: "legacy",
				},
			],
			syntax:
				"normal | stretch | <baseline-position> | <overflow-position>? [ <self-position> | left | right ] | legacy | legacy && [ left | right | center ]",
			relevance: 57,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/justify-items",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2016-07-27",
				baseline_high_date: "2019-01-27",
			},
			description:
				"Defines the default justify-self for all items of the box, giving them the default way of justifying each box along the appropriate axis",
			restrictions: ["enum"],
		},
		{
			name: "justify-self",
			browsers: ["E16", "FF45", "FFA45", "S10.1", "SM10.3", "C57", "CA57", "IE10", "O44"],
			values: [
				{
					name: "auto",
				},
				{
					name: "normal",
				},
				{
					name: "end",
				},
				{
					name: "start",
				},
				{
					name: "flex-end",
					description: '"Flex items are packed toward the end of the line."',
				},
				{
					name: "flex-start",
					description: '"Flex items are packed toward the start of the line."',
				},
				{
					name: "self-end",
					description:
						"The item is packed flush to the edge of the alignment container of the end side of the item, in the appropriate axis.",
				},
				{
					name: "self-start",
					description:
						"The item is packed flush to the edge of the alignment container of the start side of the item, in the appropriate axis..",
				},
				{
					name: "center",
					description: "The items are packed flush to each other toward the center of the of the alignment container.",
				},
				{
					name: "left",
				},
				{
					name: "right",
				},
				{
					name: "baseline",
				},
				{
					name: "first baseline",
				},
				{
					name: "last baseline",
				},
				{
					name: "stretch",
					description:
						"If the cross size property of the flex item computes to auto, and neither of the cross-axis margins are auto, the flex item is stretched.",
				},
				{
					name: "save",
				},
				{
					name: "unsave",
				},
			],
			syntax: "auto | normal | stretch | <baseline-position> | <overflow-position>? [ <self-position> | left | right ]",
			relevance: 56,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/justify-self",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-10-17",
				baseline_high_date: "2020-04-17",
			},
			description: "Defines the way of justifying a box inside its container along the appropriate axis.",
			restrictions: ["enum"],
		},
		{
			name: "align-self",
			browsers: ["E12", "FF20", "FFA20", "S9", "SM9", "C29", "CA29", "IE10", "O12.1"],
			values: [
				{
					name: "auto",
					description:
						"Computes to the value of 'align-items' on the element's parent, or 'stretch' if the element has no parent. On absolutely positioned elements, it computes to itself.",
				},
				{
					name: "normal",
				},
				{
					name: "self-end",
				},
				{
					name: "self-start",
				},
				{
					name: "baseline",
					description:
						"If the flex item's inline axis is the same as the cross axis, this value is identical to 'flex-start'. Otherwise, it participates in baseline alignment.",
				},
				{
					name: "center",
					description: "The flex item's margin box is centered in the cross axis within the line.",
				},
				{
					name: "flex-end",
					description:
						"The cross-end margin edge of the flex item is placed flush with the cross-end edge of the line.",
				},
				{
					name: "flex-start",
					description:
						"The cross-start margin edge of the flex item is placed flush with the cross-start edge of the line.",
				},
				{
					name: "stretch",
					description:
						"If the cross size property of the flex item computes to auto, and neither of the cross-axis margins are auto, the flex item is stretched.",
				},
				{
					name: "baseline",
				},
				{
					name: "first baseline",
				},
				{
					name: "last baseline",
				},
				{
					name: "safe",
				},
				{
					name: "unsafe",
				},
			],
			syntax: "auto | normal | stretch | <baseline-position> | <overflow-position>? <self-position>",
			relevance: 74,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/align-self",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description: "Allows the default alignment along the cross axis to be overridden for individual flex items.",
			restrictions: ["enum"],
		},
		{
			name: "all",
			browsers: ["E79", "FF27", "FFA27", "S9.1", "SM9.3", "C37", "CA37", "O24"],
			values: [],
			syntax: "initial | inherit | unset | revert | revert-layer",
			relevance: 55,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/all",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description: "Shorthand that resets all properties except 'direction' and 'unicode-bidi'.",
			restrictions: ["enum"],
		},
		{
			name: "alt",
			values: [],
			relevance: 50,
			baseline: {
				status: "false",
			},
			description:
				"Provides alternative text for assistive technology to replace the generated content of a ::before or ::after element.",
			restrictions: ["string", "enum"],
		},
		{
			name: "animation",
			browsers: ["E12", "FF16", "FFA16", "S9", "SM9", "C43", "CA43", "IE10", "O30"],
			values: [
				{
					name: "alternate",
					description:
						"The animation cycle iterations that are odd counts are played in the normal direction, and the animation cycle iterations that are even counts are played in a reverse direction.",
				},
				{
					name: "alternate-reverse",
					description:
						"The animation cycle iterations that are odd counts are played in the reverse direction, and the animation cycle iterations that are even counts are played in a normal direction.",
				},
				{
					name: "backwards",
					description:
						"The beginning property value (as defined in the first @keyframes at-rule) is applied before the animation is displayed, during the period defined by 'animation-delay'.",
				},
				{
					name: "both",
					description: "Both forwards and backwards fill modes are applied.",
				},
				{
					name: "forwards",
					description:
						"The final property value (as defined in the last @keyframes at-rule) is maintained after the animation completes.",
				},
				{
					name: "infinite",
					description: "Causes the animation to repeat forever.",
				},
				{
					name: "none",
					description: "No animation is performed",
				},
				{
					name: "normal",
					description: "Normal playback.",
				},
				{
					name: "reverse",
					description:
						"All iterations of the animation are played in the reverse direction from the way they were specified.",
				},
			],
			syntax: "<single-animation>#",
			relevance: 83,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/animation",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description: "Shorthand property combines six of the animation properties into a single property.",
			restrictions: ["time", "timing-function", "enum", "identifier", "number"],
		},
		{
			name: "animation-delay",
			browsers: ["E12", "FF16", "FFA16", "S9", "SM9", "C43", "CA43", "IE10", "O30"],
			syntax: "<time>#",
			relevance: 66,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/animation-delay",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description: "Defines when the animation will start.",
			restrictions: ["time"],
		},
		{
			name: "animation-direction",
			browsers: ["E12", "FF16", "FFA16", "S9", "SM9", "C43", "CA43", "IE10", "O30"],
			values: [
				{
					name: "alternate",
					description:
						"The animation cycle iterations that are odd counts are played in the normal direction, and the animation cycle iterations that are even counts are played in a reverse direction.",
				},
				{
					name: "alternate-reverse",
					description:
						"The animation cycle iterations that are odd counts are played in the reverse direction, and the animation cycle iterations that are even counts are played in a normal direction.",
				},
				{
					name: "normal",
					description: "Normal playback.",
				},
				{
					name: "reverse",
					description:
						"All iterations of the animation are played in the reverse direction from the way they were specified.",
				},
			],
			syntax: "<single-animation-direction>#",
			relevance: 56,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/animation-direction",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description: "Defines whether or not the animation should play in reverse on alternate cycles.",
			restrictions: ["enum"],
		},
		{
			name: "animation-duration",
			browsers: ["E12", "FF16", "FFA16", "S9", "SM9", "C43", "CA43", "IE10", "O30"],
			syntax: "<time>#",
			relevance: 71,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/animation-duration",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description: "Defines the length of time that an animation takes to complete one cycle.",
			restrictions: ["time"],
		},
		{
			name: "animation-fill-mode",
			browsers: ["E12", "FF16", "FFA16", "S9", "SM9", "C43", "CA43", "IE10", "O30"],
			values: [
				{
					name: "backwards",
					description:
						"The beginning property value (as defined in the first @keyframes at-rule) is applied before the animation is displayed, during the period defined by 'animation-delay'.",
				},
				{
					name: "both",
					description: "Both forwards and backwards fill modes are applied.",
				},
				{
					name: "forwards",
					description:
						"The final property value (as defined in the last @keyframes at-rule) is maintained after the animation completes.",
				},
				{
					name: "none",
					description:
						"There is no change to the property value between the time the animation is applied and the time the animation begins playing or after the animation completes.",
				},
			],
			syntax: "<single-animation-fill-mode>#",
			relevance: 64,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/animation-fill-mode",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description: "Defines what values are applied by the animation outside the time it is executing.",
			restrictions: ["enum"],
		},
		{
			name: "animation-iteration-count",
			browsers: ["E12", "FF16", "FFA16", "S9", "SM9", "C43", "CA43", "IE10", "O30"],
			values: [
				{
					name: "infinite",
					description: "Causes the animation to repeat forever.",
				},
			],
			syntax: "<single-animation-iteration-count>#",
			relevance: 65,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/animation-iteration-count",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description:
				"Defines the number of times an animation cycle is played. The default value is one, meaning the animation will play from beginning to end once.",
			restrictions: ["number", "enum"],
		},
		{
			name: "animation-name",
			browsers: ["E12", "FF16", "FFA16", "S9", "SM9", "C43", "CA43", "IE10", "O30"],
			values: [
				{
					name: "none",
					description: "No animation is performed",
				},
			],
			syntax: "[ none | <keyframes-name> ]#",
			relevance: 71,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/animation-name",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description:
				"Defines a list of animations that apply. Each name is used to select the keyframe at-rule that provides the property values for the animation.",
			restrictions: ["identifier", "enum"],
		},
		{
			name: "animation-play-state",
			browsers: ["E12", "FF16", "FFA16", "S9", "SM9", "C43", "CA43", "IE10", "O30"],
			values: [
				{
					name: "paused",
					description: "A running animation will be paused.",
				},
				{
					name: "running",
					description: "Resume playback of a paused animation.",
				},
			],
			syntax: "<single-animation-play-state>#",
			relevance: 55,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/animation-play-state",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description: "Defines whether the animation is running or paused.",
			restrictions: ["enum"],
		},
		{
			name: "animation-timing-function",
			browsers: ["E12", "FF16", "FFA16", "S9", "SM9", "C43", "CA43", "IE10", "O30"],
			syntax: "<easing-function>#",
			relevance: 72,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/animation-timing-function",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description: "Describes how the animation will progress over one cycle of its duration.",
			restrictions: ["timing-function"],
		},
		{
			name: "backface-visibility",
			browsers: ["E12", "FF16", "FFA16", "S15.4", "SM15.4", "C36", "CA36", "IE10", "O23"],
			values: [
				{
					name: "hidden",
					description: "Back side is hidden.",
				},
				{
					name: "visible",
					description: "Back side is visible.",
				},
			],
			syntax: "visible | hidden",
			relevance: 60,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/backface-visibility",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-03-14",
				baseline_high_date: "2024-09-14",
			},
			description:
				"Determines whether or not the 'back' side of a transformed element is visible when facing the viewer. With an identity transform, the front side of an element faces the viewer.",
			restrictions: ["enum"],
		},
		{
			name: "background",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			values: [
				{
					name: "fixed",
					description:
						"The background is fixed with regard to the viewport. In paged media where there is no viewport, a 'fixed' background is fixed with respect to the page box and therefore replicated on every page.",
				},
				{
					name: "local",
					description:
						"The background is fixed with regard to the element's contents: if the element has a scrolling mechanism, the background scrolls with the element's contents.",
				},
				{
					name: "none",
					description: "A value of 'none' counts as an image layer but draws nothing.",
				},
				{
					name: "scroll",
					description:
						"The background is fixed with regard to the element itself and does not scroll with its contents. (It is effectively attached to the element's border.)",
				},
			],
			syntax: "[ <bg-layer> , ]* <final-bg-layer>",
			relevance: 93,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/background",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Shorthand property for setting most background properties at the same place in the style sheet.",
			restrictions: ["enum", "image", "color", "position", "length", "repeat", "percentage", "box"],
		},
		{
			name: "background-attachment",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM3.2", "C1", "CA18", "IE4", "O3.5"],
			values: [
				{
					name: "fixed",
					description:
						"The background is fixed with regard to the viewport. In paged media where there is no viewport, a 'fixed' background is fixed with respect to the page box and therefore replicated on every page.",
				},
				{
					name: "local",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM3.2", "C1", "CA18", "IE4", "O3.5"],
					description:
						"The background is fixed with regard to the element's contents: if the element has a scrolling mechanism, the background scrolls with the element's contents.",
				},
				{
					name: "scroll",
					description:
						"The background is fixed with regard to the element itself and does not scroll with its contents. (It is effectively attached to the element's border.)",
				},
			],
			syntax: "<attachment>#",
			relevance: 54,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/background-attachment",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Specifies whether the background images are fixed with regard to the viewport ('fixed') or scroll along with the element ('scroll') or its contents ('local').",
			restrictions: ["enum"],
		},
		{
			name: "background-blend-mode",
			browsers: ["E79", "FF30", "FFA30", "S8", "SM8", "C35", "CA35", "O22"],
			values: [
				{
					name: "normal",
					description: "Default attribute which specifies no blending",
				},
				{
					name: "multiply",
					description: "The source color is multiplied by the destination color and replaces the destination.",
				},
				{
					name: "screen",
					description:
						"Multiplies the complements of the backdrop and source color values, then complements the result.",
				},
				{
					name: "overlay",
					description: "Multiplies or screens the colors, depending on the backdrop color value.",
				},
				{
					name: "darken",
					description: "Selects the darker of the backdrop and source colors.",
				},
				{
					name: "lighten",
					description: "Selects the lighter of the backdrop and source colors.",
				},
				{
					name: "color-dodge",
					description: "Brightens the backdrop color to reflect the source color.",
				},
				{
					name: "color-burn",
					description: "Darkens the backdrop color to reflect the source color.",
				},
				{
					name: "hard-light",
					description: "Multiplies or screens the colors, depending on the source color value.",
				},
				{
					name: "soft-light",
					description: "Darkens or lightens the colors, depending on the source color value.",
				},
				{
					name: "difference",
					description: "Subtracts the darker of the two constituent colors from the lighter color..",
				},
				{
					name: "exclusion",
					description: "Produces an effect similar to that of the Difference mode but lower in contrast.",
				},
				{
					name: "hue",
					browsers: ["E79", "FF30", "FFA30", "S8", "SM8", "C35", "CA35", "O22"],
					description:
						"Creates a color with the hue of the source color and the saturation and luminosity of the backdrop color.",
				},
				{
					name: "saturation",
					browsers: ["E79", "FF30", "FFA30", "S8", "SM8", "C35", "CA35", "O22"],
					description:
						"Creates a color with the saturation of the source color and the hue and luminosity of the backdrop color.",
				},
				{
					name: "color",
					browsers: ["E79", "FF30", "FFA30", "S8", "SM8", "C35", "CA35", "O22"],
					description:
						"Creates a color with the hue and saturation of the source color and the luminosity of the backdrop color.",
				},
				{
					name: "luminosity",
					browsers: ["E79", "FF30", "FFA30", "S8", "SM8", "C35", "CA35", "O22"],
					description:
						"Creates a color with the luminosity of the source color and the hue and saturation of the backdrop color.",
				},
			],
			syntax: "<blend-mode>#",
			relevance: 54,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/background-blend-mode",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description: "Defines the blending mode of each background layer.",
			restrictions: ["enum"],
		},
		{
			name: "background-clip",
			browsers: ["E12", "FF4", "FFA4", "S5", "SM5", "C1", "CA18", "IE9", "O10.5"],
			syntax: "<bg-clip>#",
			relevance: 69,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/background-clip",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Determines the background painting area.",
			restrictions: ["box"],
		},
		{
			name: "background-color",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			syntax: "<color>",
			relevance: 94,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/background-color",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Sets the background color of an element.",
			restrictions: ["color"],
		},
		{
			name: "background-image",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			values: [
				{
					name: "none",
					description: "Counts as an image layer but draws nothing.",
				},
			],
			syntax: "<bg-image>#",
			relevance: 88,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/background-image",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Sets the background image(s) of an element.",
			restrictions: ["image", "enum"],
		},
		{
			name: "background-origin",
			browsers: ["E12", "FF4", "FFA4", "S3", "SM1", "C1", "CA18", "IE9", "O10.5"],
			syntax: "<visual-box>#",
			relevance: 53,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/background-origin",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"For elements rendered as a single box, specifies the background positioning area. For elements rendered as multiple boxes (e.g., inline boxes on several lines, boxes on several pages) specifies which boxes 'box-decoration-break' operates on to determine the background positioning area(s).",
			restrictions: ["box"],
		},
		{
			name: "background-position",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			syntax: "<bg-position>#",
			relevance: 87,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/background-position",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Specifies the initial position of the background image(s) (after any resizing) within their corresponding background positioning area.",
			restrictions: ["position", "length", "percentage"],
		},
		{
			name: "background-position-x",
			browsers: ["E12", "FF49", "FFA49", "S1", "SM1", "C1", "CA18", "IE6", "O15"],
			values: [
				{
					name: "center",
					description:
						"Equivalent to '50%' ('left 50%') for the horizontal position if the horizontal position is not otherwise specified, or '50%' ('top 50%') for the vertical position if it is.",
				},
				{
					name: "left",
					description:
						"Equivalent to '0%' for the horizontal position if one or two values are given, otherwise specifies the left edge as the origin for the next offset.",
				},
				{
					name: "right",
					description:
						"Equivalent to '100%' for the horizontal position if one or two values are given, otherwise specifies the right edge as the origin for the next offset.",
				},
			],
			syntax: "[ center | [ [ left | right | x-start | x-end ]? <length-percentage>? ]! ]#",
			relevance: 56,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/background-position-x",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2016-09-20",
				baseline_high_date: "2019-03-20",
			},
			description:
				"If background images have been specified, this property specifies their initial position (after any resizing) within their corresponding background positioning area.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "background-position-y",
			browsers: ["E12", "FF49", "FFA49", "S1", "SM1", "C1", "CA18", "IE6", "O15"],
			values: [
				{
					name: "bottom",
					description:
						"Equivalent to '100%' for the vertical position if one or two values are given, otherwise specifies the bottom edge as the origin for the next offset.",
				},
				{
					name: "center",
					description:
						"Equivalent to '50%' ('left 50%') for the horizontal position if the horizontal position is not otherwise specified, or '50%' ('top 50%') for the vertical position if it is.",
				},
				{
					name: "top",
					description:
						"Equivalent to '0%' for the vertical position if one or two values are given, otherwise specifies the top edge as the origin for the next offset.",
				},
			],
			syntax: "[ center | [ [ top | bottom | y-start | y-end ]? <length-percentage>? ]! ]#",
			relevance: 54,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/background-position-y",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2016-09-20",
				baseline_high_date: "2019-03-20",
			},
			description:
				"If background images have been specified, this property specifies their initial position (after any resizing) within their corresponding background positioning area.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "background-repeat",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			values: [],
			syntax: "<repeat-style>#",
			relevance: 86,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/background-repeat",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Specifies how background images are tiled after they have been sized and positioned.",
			restrictions: ["repeat"],
		},
		{
			name: "background-size",
			browsers: ["E12", "FF4", "FFA4", "S5", "SM4.2", "C3", "CA18", "IE9", "O10"],
			values: [
				{
					name: "auto",
					description:
						"Resolved by using the image's intrinsic ratio and the size of the other dimension, or failing that, using the image's intrinsic size, or failing that, treating it as 100%.",
				},
				{
					name: "contain",
					description:
						"Scale the image, while preserving its intrinsic aspect ratio (if any), to the largest size such that both its width and its height can fit inside the background positioning area.",
				},
				{
					name: "cover",
					description:
						"Scale the image, while preserving its intrinsic aspect ratio (if any), to the smallest size such that both its width and its height can completely cover the background positioning area.",
				},
			],
			syntax: "<bg-size>#",
			relevance: 86,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/background-size",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Specifies the size of the background images.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "behavior",
			browsers: ["IE6"],
			relevance: 50,
			description: "IE only. Used to extend behaviors of the browser.",
			restrictions: ["url"],
		},
		{
			name: "block-size",
			browsers: ["E79", "FF41", "FFA41", "S12.1", "SM12.2", "C57", "CA57", "O44"],
			values: [
				{
					name: "auto",
					description: "Depends on the values of other properties.",
				},
			],
			syntax: "<'width'>",
			relevance: 54,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/block-size",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description: "Size of an element in the direction opposite that of the direction specified by 'writing-mode'.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "border",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			syntax: "<line-width> || <line-style> || <color>",
			relevance: 95,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Shorthand property for setting border width, style, and color.",
			restrictions: ["length", "line-width", "line-style", "color"],
		},
		{
			name: "border-block-end",
			browsers: ["E79", "FF41", "FFA41", "S12.1", "SM12.2", "C69", "CA69", "O56"],
			syntax: "<'border-top-width'> || <'border-top-style'> || <color>",
			relevance: 53,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-block-end",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Logical 'border-bottom'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
			restrictions: ["length", "line-width", "line-style", "color"],
		},
		{
			name: "border-block-start",
			browsers: ["E79", "FF41", "FFA41", "S12.1", "SM12.2", "C69", "CA69", "O56"],
			syntax: "<'border-top-width'> || <'border-top-style'> || <color>",
			relevance: 53,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-block-start",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Logical 'border-top'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
			restrictions: ["length", "line-width", "line-style", "color"],
		},
		{
			name: "border-block-end-color",
			browsers: ["E79", "FF41", "FFA41", "S12.1", "SM12.2", "C69", "CA69", "O56"],
			syntax: "<'border-top-color'>",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-block-end-color",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Logical 'border-bottom-color'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
			restrictions: ["color"],
		},
		{
			name: "border-block-start-color",
			browsers: ["E79", "FF41", "FFA41", "S12.1", "SM12.2", "C69", "CA69", "O56"],
			syntax: "<'border-top-color'>",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-block-start-color",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Logical 'border-top-color'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
			restrictions: ["color"],
		},
		{
			name: "border-block-end-style",
			browsers: ["E79", "FF41", "FFA41", "S12.1", "SM12.2", "C69", "CA69", "O56"],
			syntax: "<'border-top-style'>",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-block-end-style",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Logical 'border-bottom-style'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
			restrictions: ["line-style"],
		},
		{
			name: "border-block-start-style",
			browsers: ["E79", "FF41", "FFA41", "S12.1", "SM12.2", "C69", "CA69", "O56"],
			syntax: "<'border-top-style'>",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-block-start-style",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Logical 'border-top-style'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
			restrictions: ["line-style"],
		},
		{
			name: "border-block-end-width",
			browsers: ["E79", "FF41", "FFA41", "S12.1", "SM12.2", "C69", "CA69", "O56"],
			syntax: "<'border-top-width'>",
			relevance: 51,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-block-end-width",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Logical 'border-bottom-width'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
			restrictions: ["length", "line-width"],
		},
		{
			name: "border-block-start-width",
			browsers: ["E79", "FF41", "FFA41", "S12.1", "SM12.2", "C69", "CA69", "O56"],
			syntax: "<'border-top-width'>",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-block-start-width",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Logical 'border-top-width'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
			restrictions: ["length", "line-width"],
		},
		{
			name: "border-bottom",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			syntax: "<line-width> || <line-style> || <color>",
			relevance: 87,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-bottom",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Shorthand property for setting border width, style and color.",
			restrictions: ["length", "line-width", "line-style", "color"],
		},
		{
			name: "border-bottom-color",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			syntax: "<'border-top-color'>",
			relevance: 69,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-bottom-color",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Sets the color of the bottom border.",
			restrictions: ["color"],
		},
		{
			name: "border-bottom-left-radius",
			browsers: ["E12", "FF4", "FFA4", "S5", "SM4.2", "C4", "CA18", "IE9", "O10.5"],
			syntax: "<length-percentage>{1,2}",
			relevance: 75,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-bottom-left-radius",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Defines the radii of the bottom left outer border edge.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "border-bottom-right-radius",
			browsers: ["E12", "FF4", "FFA4", "S5", "SM4.2", "C4", "CA18", "IE9", "O10.5"],
			syntax: "<length-percentage>{1,2}",
			relevance: 75,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-bottom-right-radius",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Defines the radii of the bottom right outer border edge.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "border-bottom-style",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE5.5", "O9.2"],
			syntax: "<line-style>",
			relevance: 58,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-bottom-style",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Sets the style of the bottom border.",
			restrictions: ["line-style"],
		},
		{
			name: "border-bottom-width",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			syntax: "<line-width>",
			relevance: 62,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-bottom-width",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Sets the thickness of the bottom border.",
			restrictions: ["length", "line-width"],
		},
		{
			name: "border-collapse",
			browsers: ["E12", "FF1", "FFA4", "S1.1", "SM1", "C1", "CA18", "IE5", "O4"],
			values: [
				{
					name: "collapse",
					description: "Selects the collapsing borders model.",
				},
				{
					name: "separate",
					description: "Selects the separated borders border model.",
				},
			],
			syntax: "collapse | separate",
			relevance: 72,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-collapse",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Selects a table's border model.",
			restrictions: ["enum"],
		},
		{
			name: "border-color",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			values: [],
			syntax: "<color>{1,4}",
			relevance: 87,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-color",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "The color of the border around all four edges of an element.",
			restrictions: ["color"],
		},
		{
			name: "border-image",
			browsers: ["E12", "FF15", "FFA15", "S6", "SM6", "C16", "CA18", "IE11", "O11"],
			values: [
				{
					name: "auto",
					description:
						"If 'auto' is specified then the border image width is the intrinsic width or height (whichever is applicable) of the corresponding image slice. If the image does not have the required intrinsic dimension then the corresponding border-width is used instead.",
				},
				{
					name: "fill",
					description: "Causes the middle part of the border-image to be preserved.",
				},
				{
					name: "none",
					description: "Use the border styles.",
				},
				{
					name: "repeat",
					description: "The image is tiled (repeated) to fill the area.",
				},
				{
					name: "round",
					description:
						"The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the image is rescaled so that it does.",
				},
				{
					name: "space",
					description:
						"The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the extra space is distributed around the tiles.",
				},
				{
					name: "stretch",
					description: "The image is stretched to fill the area.",
				},
				{
					name: "url()",
				},
			],
			syntax:
				"<'border-image-source'> || <'border-image-slice'> [ / <'border-image-width'> | / <'border-image-width'>? / <'border-image-outset'> ]? || <'border-image-repeat'>",
			relevance: 52,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-image",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Shorthand property for setting 'border-image-source', 'border-image-slice', 'border-image-width', 'border-image-outset' and 'border-image-repeat'. Omitted values are set to their initial values.",
			restrictions: ["length", "percentage", "number", "url", "enum"],
		},
		{
			name: "border-image-outset",
			browsers: ["E12", "FF15", "FFA15", "S6", "SM6", "C15", "CA18", "IE11", "O15"],
			syntax: "[ <length> | <number> ]{1,4}",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-image-outset",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"The values specify the amount by which the border image area extends beyond the border box on the top, right, bottom, and left sides respectively. If the fourth value is absent, it is the same as the second. If the third one is also absent, it is the same as the first. If the second one is also absent, it is the same as the first. Numbers represent multiples of the corresponding border-width.",
			restrictions: ["length", "number"],
		},
		{
			name: "border-image-repeat",
			browsers: ["E12", "FF15", "FFA15", "S6", "SM9.3", "C15", "CA18", "IE11", "O15"],
			values: [
				{
					name: "repeat",
					description: "The image is tiled (repeated) to fill the area.",
				},
				{
					name: "round",
					description:
						"The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the image is rescaled so that it does.",
				},
				{
					name: "space",
					description:
						"The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the extra space is distributed around the tiles.",
				},
				{
					name: "stretch",
					description: "The image is stretched to fill the area.",
				},
			],
			syntax: "[ stretch | repeat | round | space ]{1,2}",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-image-repeat",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2016-03-21",
				baseline_high_date: "2018-09-21",
			},
			description:
				"Specifies how the images for the sides and the middle part of the border image are scaled and tiled. If the second keyword is absent, it is assumed to be the same as the first.",
			restrictions: ["enum"],
		},
		{
			name: "border-image-slice",
			browsers: ["E12", "FF15", "FFA15", "S6", "SM6", "C15", "CA18", "IE11", "O15"],
			values: [
				{
					name: "fill",
					description: "Causes the middle part of the border-image to be preserved.",
				},
			],
			syntax: "<number-percentage>{1,4} && fill?",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-image-slice",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Specifies inward offsets from the top, right, bottom, and left edges of the image, dividing it into nine regions: four corners, four edges and a middle.",
			restrictions: ["number", "percentage"],
		},
		{
			name: "border-image-source",
			browsers: ["E12", "FF15", "FFA15", "S6", "SM6", "C15", "CA18", "IE11", "O15"],
			values: [
				{
					name: "none",
					description: "Use the border styles.",
				},
			],
			syntax: "none | <image>",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-image-source",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Specifies an image to use instead of the border styles given by the 'border-style' properties and as an additional background layer for the element. If the value is 'none' or if the image cannot be displayed, the border styles will be used.",
			restrictions: ["image"],
		},
		{
			name: "border-image-width",
			browsers: ["E12", "FF13", "FFA14", "S6", "SM6", "C16", "CA18", "IE11", "O15"],
			values: [
				{
					name: "auto",
					description:
						"The border image width is the intrinsic width or height (whichever is applicable) of the corresponding image slice. If the image does not have the required intrinsic dimension then the corresponding border-width is used instead.",
				},
			],
			syntax: "[ <length-percentage> | <number> | auto ]{1,4}",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-image-width",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"The four values of 'border-image-width' specify offsets that are used to divide the border image area into nine parts. They represent inward distances from the top, right, bottom, and left sides of the area, respectively.",
			restrictions: ["length", "percentage", "number"],
		},
		{
			name: "border-inline-end",
			browsers: ["E79", "FF41", "FFA41", "S12.1", "SM12.2", "C69", "CA69", "O56"],
			syntax: "<'border-top-width'> || <'border-top-style'> || <color>",
			relevance: 53,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-inline-end",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Logical 'border-right'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
			restrictions: ["length", "line-width", "line-style", "color"],
		},
		{
			name: "border-inline-start",
			browsers: ["E79", "FF41", "FFA41", "S12.1", "SM12.2", "C69", "CA69", "O56"],
			syntax: "<'border-top-width'> || <'border-top-style'> || <color>",
			relevance: 53,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-inline-start",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Logical 'border-left'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
			restrictions: ["length", "line-width", "line-style", "color"],
		},
		{
			name: "border-inline-end-color",
			browsers: ["E79", "FF41", "FFA41", "S12.1", "SM12.2", "C69", "CA69", "O56"],
			syntax: "<'border-top-color'>",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-inline-end-color",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Logical 'border-right-color'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
			restrictions: ["color"],
		},
		{
			name: "border-inline-start-color",
			browsers: ["E79", "FF41", "FFA41", "S12.1", "SM12.2", "C69", "CA69", "O56"],
			syntax: "<'border-top-color'>",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-inline-start-color",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Logical 'border-left-color'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
			restrictions: ["color"],
		},
		{
			name: "border-inline-end-style",
			browsers: ["E79", "FF41", "FFA41", "S12.1", "SM12.2", "C69", "CA69", "O56"],
			syntax: "<'border-top-style'>",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-inline-end-style",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Logical 'border-right-style'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
			restrictions: ["line-style"],
		},
		{
			name: "border-inline-start-style",
			browsers: ["E79", "FF41", "FFA41", "S12.1", "SM12.2", "C69", "CA69", "O56"],
			syntax: "<'border-top-style'>",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-inline-start-style",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Logical 'border-left-style'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
			restrictions: ["line-style"],
		},
		{
			name: "border-inline-end-width",
			browsers: ["E79", "FF41", "FFA41", "S12.1", "SM12.2", "C69", "CA69", "O56"],
			syntax: "<'border-top-width'>",
			relevance: 51,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-inline-end-width",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Logical 'border-right-width'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
			restrictions: ["length", "line-width"],
		},
		{
			name: "border-inline-start-width",
			browsers: ["E79", "FF41", "FFA41", "S12.1", "SM12.2", "C69", "CA69", "O56"],
			syntax: "<'border-top-width'>",
			relevance: 51,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-inline-start-width",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Logical 'border-left-width'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
			restrictions: ["length", "line-width"],
		},
		{
			name: "border-left",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			syntax: "<line-width> || <line-style> || <color>",
			relevance: 81,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-left",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Shorthand property for setting border width, style and color",
			restrictions: ["length", "line-width", "line-style", "color"],
		},
		{
			name: "border-left-color",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			syntax: "<color>",
			relevance: 66,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-left-color",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Sets the color of the left border.",
			restrictions: ["color"],
		},
		{
			name: "border-left-style",
			browsers: ["E12", "FF1", "FFA14", "S1", "SM1", "C1", "CA18", "IE5.5", "O9.2"],
			syntax: "<line-style>",
			relevance: 54,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-left-style",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Sets the style of the left border.",
			restrictions: ["line-style"],
		},
		{
			name: "border-left-width",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			syntax: "<line-width>",
			relevance: 64,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-left-width",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Sets the thickness of the left border.",
			restrictions: ["length", "line-width"],
		},
		{
			name: "border-radius",
			browsers: ["E12", "FF4", "FFA4", "S5", "SM4.2", "C4", "CA18", "IE9", "O10.5"],
			syntax: "<length-percentage>{1,4} [ / <length-percentage>{1,4} ]?",
			relevance: 92,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-radius",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Defines the radii of the outer border edge.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "border-right",
			browsers: ["E12", "FF1", "FFA14", "S1", "SM1", "C1", "CA18", "IE5.5", "O9.2"],
			syntax: "<line-width> || <line-style> || <color>",
			relevance: 80,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-right",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Shorthand property for setting border width, style and color",
			restrictions: ["length", "line-width", "line-style", "color"],
		},
		{
			name: "border-right-color",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			syntax: "<color>",
			relevance: 65,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-right-color",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Sets the color of the right border.",
			restrictions: ["color"],
		},
		{
			name: "border-right-style",
			browsers: ["E12", "FF1", "FFA14", "S1", "SM1", "C1", "CA18", "IE5.5", "O9.2"],
			syntax: "<line-style>",
			relevance: 53,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-right-style",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Sets the style of the right border.",
			restrictions: ["line-style"],
		},
		{
			name: "border-right-width",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			syntax: "<line-width>",
			relevance: 63,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-right-width",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Sets the thickness of the right border.",
			restrictions: ["length", "line-width"],
		},
		{
			name: "border-spacing",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE8", "O4"],
			syntax: "<length> <length>?",
			relevance: 65,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-spacing",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"The lengths specify the distance that separates adjoining cell borders. If one length is specified, it gives both the horizontal and vertical spacing. If two are specified, the first gives the horizontal spacing and the second the vertical spacing. Lengths may not be negative.",
			restrictions: ["length"],
		},
		{
			name: "border-style",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			values: [],
			syntax: "<line-style>{1,4}",
			relevance: 79,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-style",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "The style of the border around edges of an element.",
			restrictions: ["line-style"],
		},
		{
			name: "border-top",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			syntax: "<line-width> || <line-style> || <color>",
			relevance: 85,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-top",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Shorthand property for setting border width, style and color",
			restrictions: ["length", "line-width", "line-style", "color"],
		},
		{
			name: "border-top-color",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			syntax: "<color>",
			relevance: 70,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-top-color",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Sets the color of the top border.",
			restrictions: ["color"],
		},
		{
			name: "border-top-left-radius",
			browsers: ["E12", "FF4", "FFA4", "S5", "SM4.2", "C4", "CA18", "IE9", "O10.5"],
			syntax: "<length-percentage>{1,2}",
			relevance: 75,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-top-left-radius",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Defines the radii of the top left outer border edge.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "border-top-right-radius",
			browsers: ["E12", "FF4", "FFA4", "S5", "SM4.2", "C4", "CA18", "IE9", "O10.5"],
			syntax: "<length-percentage>{1,2}",
			relevance: 75,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-top-right-radius",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Defines the radii of the top right outer border edge.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "border-top-style",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE5.5", "O9.2"],
			syntax: "<line-style>",
			relevance: 55,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-top-style",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Sets the style of the top border.",
			restrictions: ["line-style"],
		},
		{
			name: "border-top-width",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			syntax: "<line-width>",
			relevance: 61,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-top-width",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Sets the thickness of the top border.",
			restrictions: ["length", "line-width"],
		},
		{
			name: "border-width",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM3", "C1", "CA18", "IE4", "O3.5"],
			values: [],
			syntax: "<line-width>{1,4}",
			relevance: 82,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-width",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Shorthand that sets the four 'border-*-width' properties. If it has four values, they set top, right, bottom and left in that order. If left is missing, it is the same as right; if bottom is missing, it is the same as top; if right is missing, it is the same as top.",
			restrictions: ["length", "line-width"],
		},
		{
			name: "bottom",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE5", "O6"],
			values: [
				{
					name: "auto",
					description:
						"For non-replaced elements, the effect of this value depends on which of related properties have the value 'auto' as well",
				},
			],
			syntax: "<length> | <percentage> | auto",
			relevance: 90,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/bottom",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Specifies how far an absolutely positioned box's bottom margin edge is offset above the bottom edge of the box's 'containing block'.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "box-decoration-break",
			browsers: ["E130", "FF32", "FFA32", "C130", "CA130", "O115"],
			values: [
				{
					name: "clone",
					description: "Each box is independently wrapped with the border and padding.",
				},
				{
					name: "slice",
					description:
						"The effect is as though the element were rendered with no breaks present, and then sliced by the breaks afterward.",
				},
			],
			syntax: "slice | clone",
			relevance: 51,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/box-decoration-break",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"Specifies whether individual boxes are treated as broken pieces of one continuous box, or whether each box is individually wrapped with the border and padding.",
			restrictions: ["enum"],
		},
		{
			name: "box-shadow",
			browsers: ["E12", "FF4", "FFA4", "S5.1", "SM5", "C10", "CA18", "IE9", "O10.5"],
			values: [
				{
					name: "inset",
					description:
						"Changes the drop shadow from an outer shadow (one that shadows the box onto the canvas, as if it were lifted above the canvas) to an inner shadow (one that shadows the canvas onto the box, as if the box were cut out of the canvas and shifted behind it).",
				},
				{
					name: "none",
					description: "No shadow.",
				},
			],
			syntax: "none | <shadow>#",
			relevance: 90,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/box-shadow",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Attaches one or more drop-shadows to the box. The property is a comma-separated list of shadows, each specified by 2-4 length values, an optional color, and an optional 'inset' keyword. Omitted lengths are 0; omitted colors are a user agent chosen color.",
			restrictions: ["length", "color", "enum"],
		},
		{
			name: "box-sizing",
			browsers: ["E12", "FF29", "FFA29", "S5.1", "SM6", "C10", "CA18", "IE8", "O7"],
			values: [
				{
					name: "border-box",
					description:
						"The specified width and height (and respective min/max properties) on this element determine the border box of the element.",
				},
				{
					name: "content-box",
					description:
						"Behavior of width and height as specified by CSS2.1. The specified width and height (and respective min/max properties) apply to the width and height respectively of the content box of the element.",
				},
			],
			syntax: "content-box | border-box",
			relevance: 92,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/box-sizing",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Specifies the behavior of the 'width' and 'height' properties.",
			restrictions: ["enum"],
		},
		{
			name: "break-after",
			browsers: ["E12", "FF65", "FFA65", "S10", "SM10", "C50", "CA50", "IE10", "O37"],
			values: [
				{
					name: "always",
					description: "Always force a page break before/after the generated box.",
				},
				{
					name: "auto",
					description: "Neither force nor forbid a page/column break before/after the principal box.",
				},
				{
					name: "avoid",
					description: "Avoid a break before/after the principal box.",
				},
				{
					name: "avoid-column",
					description: "Avoid a column break before/after the principal box.",
				},
				{
					name: "avoid-page",
					description: "Avoid a page break before/after the principal box.",
				},
				{
					name: "column",
					description: "Always force a column break before/after the principal box.",
				},
				{
					name: "left",
					description:
						"Force one or two page breaks before/after the generated box so that the next page is formatted as a left page.",
				},
				{
					name: "page",
					description: "Always force a page break before/after the principal box.",
				},
				{
					name: "right",
					description:
						"Force one or two page breaks before/after the generated box so that the next page is formatted as a right page.",
				},
			],
			syntax:
				"auto | avoid | always | all | avoid-page | page | left | right | recto | verso | avoid-column | column | avoid-region | region",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/break-after",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2019-01-29",
				baseline_high_date: "2021-07-29",
			},
			description: "Describes the page/column/region break behavior after the generated box.",
			restrictions: ["enum"],
		},
		{
			name: "break-before",
			browsers: ["E12", "FF65", "FFA65", "S10", "SM10", "C50", "CA50", "IE10", "O37"],
			values: [
				{
					name: "always",
					description: "Always force a page break before/after the generated box.",
				},
				{
					name: "auto",
					description: "Neither force nor forbid a page/column break before/after the principal box.",
				},
				{
					name: "avoid",
					description: "Avoid a break before/after the principal box.",
				},
				{
					name: "avoid-column",
					description: "Avoid a column break before/after the principal box.",
				},
				{
					name: "avoid-page",
					description: "Avoid a page break before/after the principal box.",
				},
				{
					name: "column",
					description: "Always force a column break before/after the principal box.",
				},
				{
					name: "left",
					description:
						"Force one or two page breaks before/after the generated box so that the next page is formatted as a left page.",
				},
				{
					name: "page",
					description: "Always force a page break before/after the principal box.",
				},
				{
					name: "right",
					description:
						"Force one or two page breaks before/after the generated box so that the next page is formatted as a right page.",
				},
			],
			syntax:
				"auto | avoid | always | all | avoid-page | page | left | right | recto | verso | avoid-column | column | avoid-region | region",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/break-before",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2019-01-29",
				baseline_high_date: "2021-07-29",
			},
			description: "Describes the page/column/region break behavior before the generated box.",
			restrictions: ["enum"],
		},
		{
			name: "break-inside",
			browsers: ["E12", "FF65", "FFA65", "S10", "SM10", "C50", "CA50", "IE10", "O37"],
			values: [
				{
					name: "auto",
					description: "Impose no additional breaking constraints within the box.",
				},
				{
					name: "avoid",
					description: "Avoid breaks within the box.",
				},
				{
					name: "avoid-column",
					description: "Avoid a column break within the box.",
				},
				{
					name: "avoid-page",
					description: "Avoid a page break within the box.",
				},
			],
			syntax: "auto | avoid | avoid-page | avoid-column | avoid-region",
			relevance: 51,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/break-inside",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2019-01-29",
				baseline_high_date: "2021-07-29",
			},
			description: "Describes the page/column/region break behavior inside the principal box.",
			restrictions: ["enum"],
		},
		{
			name: "caption-side",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE8", "O4"],
			values: [
				{
					name: "bottom",
					description: "Positions the caption box below the table box.",
				},
				{
					name: "top",
					description: "Positions the caption box above the table box.",
				},
			],
			syntax: "top | bottom",
			relevance: 52,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/caption-side",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Specifies the position of the caption box with respect to the table box.",
			restrictions: ["enum"],
		},
		{
			name: "caret-color",
			browsers: ["E79", "FF53", "FFA53", "S11.1", "SM11.3", "C57", "CA57", "O44"],
			values: [
				{
					name: "auto",
					description:
						"The user agent selects an appropriate color for the caret. This is generally currentcolor, but the user agent may choose a different color to ensure good visibility and contrast with the surrounding content, taking into account the value of currentcolor, the background, shadows, and other factors.",
				},
			],
			syntax: "auto | <color>",
			relevance: 55,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/caret-color",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description: "Controls the color of the text insertion indicator.",
			restrictions: ["color", "enum"],
		},
		{
			name: "clear",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			values: [
				{
					name: "both",
					description:
						"The clearance of the generated box is set to the amount necessary to place the top border edge below the bottom outer edge of any right-floating and left-floating boxes that resulted from elements earlier in the source document.",
				},
				{
					name: "left",
					description:
						"The clearance of the generated box is set to the amount necessary to place the top border edge below the bottom outer edge of any left-floating boxes that resulted from elements earlier in the source document.",
				},
				{
					name: "none",
					description: "No constraint on the box's position with respect to floats.",
				},
				{
					name: "right",
					description:
						"The clearance of the generated box is set to the amount necessary to place the top border edge below the bottom outer edge of any right-floating boxes that resulted from elements earlier in the source document.",
				},
			],
			syntax: "none | left | right | both | inline-start | inline-end",
			relevance: 81,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/clear",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Indicates which sides of an element's box(es) may not be adjacent to an earlier floating box. The 'clear' property does not consider floats inside the element itself or in other block formatting contexts.",
			restrictions: ["enum"],
		},
		{
			name: "clip",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
			values: [
				{
					name: "auto",
					description: "The element does not clip.",
				},
				{
					name: "rect()",
					description: "Specifies offsets from the edges of the border box.",
				},
			],
			status: "obsolete",
			syntax: "<shape> | auto",
			relevance: 24,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/clip",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"Deprecated. Use the 'clip-path' property when support allows. Defines the visible portion of an element's box.",
			restrictions: ["enum"],
		},
		{
			name: "clip-path",
			browsers: ["E79", "FF3.5", "FFA4", "S9.1", "SM9.3", "C55", "CA55", "IE10", "O42"],
			values: [
				{
					name: "none",
					description: "No clipping path gets created.",
				},
				{
					name: "url()",
					description: "References a <clipPath> element to create a clipping path.",
				},
			],
			syntax: "<clip-source> | [ <basic-shape> || <geometry-box> ] | none",
			relevance: 67,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/clip-path",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Specifies a clipping path where everything inside the path is visible and everything outside is clipped out.",
			restrictions: ["url", "shape", "geometry-box", "enum"],
		},
		{
			name: "clip-rule",
			browsers: ["E79", "FF3.5", "FFA4", "S5", "SM4.2", "C15", "CA18", "O15"],
			values: [
				{
					name: "evenodd",
					description:
						"Determines the 'insideness' of a point on the canvas by drawing a ray from that point to infinity in any direction and counting the number of path segments from the given shape that the ray crosses.",
				},
				{
					name: "nonzero",
					description:
						"Determines the 'insideness' of a point on the canvas by drawing a ray from that point to infinity in any direction and then examining the places where a segment of the shape crosses the ray.",
				},
			],
			syntax: "nonzero | evenodd",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/clip-rule",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Indicates the algorithm which is to be used to determine what parts of the canvas are included inside the shape.",
			restrictions: ["enum"],
		},
		{
			name: "color",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE3", "O3.5"],
			syntax: "<color>",
			relevance: 94,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/color",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Sets the color of an element's text",
			restrictions: ["color"],
		},
		{
			name: "color-interpolation-filters",
			browsers: ["E79", "FF3", "FFA4", "S3", "SM2", "C1", "CA18", "O15"],
			values: [
				{
					name: "auto",
					description: "Color operations are not required to occur in a particular color space.",
				},
				{
					name: "linearRGB",
					description: "Color operations should occur in the linearized RGB color space.",
				},
				{
					name: "sRGB",
					description: "Color operations should occur in the sRGB color space.",
				},
			],
			syntax: "auto | sRGB | linearRGB",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/color-interpolation-filters",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description: "Specifies the color space for imaging operations performed via filter effects.",
			restrictions: ["enum"],
		},
		{
			name: "column-count",
			browsers: ["E12", "FF52", "FFA52", "S9", "SM9", "C50", "CA50", "IE10", "O37"],
			values: [
				{
					name: "auto",
					description: "Determines the number of columns by the 'column-width' property and the element width.",
				},
			],
			syntax: "<integer> | auto",
			relevance: 53,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/column-count",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-03-07",
				baseline_high_date: "2019-09-07",
			},
			description: "Describes the optimal number of columns into which the content of the element will be flowed.",
			restrictions: ["integer", "enum"],
		},
		{
			name: "column-fill",
			browsers: ["E12", "FF52", "FFA52", "S9", "SM9", "C50", "CA50", "IE10", "O37"],
			values: [
				{
					name: "auto",
					description: "Fills columns sequentially.",
				},
				{
					name: "balance",
					description: "Balance content equally between columns, if possible.",
				},
			],
			syntax: "auto | balance",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/column-fill",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-03-07",
				baseline_high_date: "2019-09-07",
			},
			description:
				"In continuous media, this property will only be consulted if the length of columns has been constrained. Otherwise, columns will automatically be balanced.",
			restrictions: ["enum"],
		},
		{
			name: "column-gap",
			browsers: ["E12", "FF1.5", "FFA4", "S3", "SM2", "C1", "CA18", "IE10", "O11.1"],
			values: [
				{
					name: "normal",
					description: "User agent specific and typically equivalent to 1em.",
				},
			],
			syntax: "normal | <length-percentage>",
			relevance: 65,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/column-gap",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Sets the gap between columns. If there is a column rule between columns, it will appear in the middle of the gap.",
			restrictions: ["length", "enum"],
		},
		{
			name: "column-rule",
			browsers: ["E12", "FF52", "FFA52", "S9", "SM9", "C50", "CA50", "IE10", "O11.1"],
			syntax: "<'column-rule-width'> || <'column-rule-style'> || <'column-rule-color'>",
			relevance: 51,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/column-rule",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-03-07",
				baseline_high_date: "2019-09-07",
			},
			description:
				"Shorthand for setting 'column-rule-width', 'column-rule-style', and 'column-rule-color' at the same place in the style sheet. Omitted values are set to their initial values.",
			restrictions: ["length", "line-width", "line-style", "color"],
		},
		{
			name: "column-rule-color",
			browsers: ["E12", "FF52", "FFA52", "S9", "SM9", "C50", "CA50", "IE10", "O11.1"],
			syntax: "<color>",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/column-rule-color",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-03-07",
				baseline_high_date: "2019-09-07",
			},
			description: "Sets the color of the column rule",
			restrictions: ["color"],
		},
		{
			name: "column-rule-style",
			browsers: ["E12", "FF52", "FFA52", "S9", "SM9", "C50", "CA50", "IE10", "O11.1"],
			syntax: "<'border-style'>",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/column-rule-style",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-03-07",
				baseline_high_date: "2019-09-07",
			},
			description: "Sets the style of the rule between columns of an element.",
			restrictions: ["line-style"],
		},
		{
			name: "column-rule-width",
			browsers: ["E12", "FF52", "FFA52", "S9", "SM9", "C50", "CA50", "IE10", "O11.1"],
			syntax: "<'border-width'>",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/column-rule-width",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-03-07",
				baseline_high_date: "2019-09-07",
			},
			description: "Sets the width of the rule between columns. Negative values are not allowed.",
			restrictions: ["length", "line-width"],
		},
		{
			name: "columns",
			browsers: ["E12", "FF52", "FFA52", "S9", "SM9", "C50", "CA50", "IE10", "O11.1"],
			values: [
				{
					name: "auto",
					description: "The width depends on the values of other properties.",
				},
			],
			syntax: "<'column-width'> || <'column-count'>",
			relevance: 51,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/columns",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-03-07",
				baseline_high_date: "2019-09-07",
			},
			description: "A shorthand property which sets both 'column-width' and 'column-count'.",
			restrictions: ["length", "integer", "enum"],
		},
		{
			name: "column-span",
			browsers: ["E12", "FF71", "FFA79", "S9", "SM9", "C50", "CA50", "IE10", "O37"],
			values: [
				{
					name: "all",
					description:
						"The element spans across all columns. Content in the normal flow that appears before the element is automatically balanced across all columns before the element appear.",
				},
				{
					name: "none",
					description: "The element does not span multiple columns.",
				},
			],
			syntax: "none | all",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/column-span",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-07-28",
				baseline_high_date: "2023-01-28",
			},
			description: "Describes the page/column break behavior after the generated box.",
			restrictions: ["enum"],
		},
		{
			name: "column-width",
			browsers: ["E12", "FF50", "FFA50", "S9", "SM9", "C50", "CA50", "IE10", "O11.1"],
			values: [
				{
					name: "auto",
					description: "The width depends on the values of other properties.",
				},
			],
			syntax: "<length> | auto",
			relevance: 51,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/column-width",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2016-11-15",
				baseline_high_date: "2019-05-15",
			},
			description: "Describes the width of columns in multicol elements.",
			restrictions: ["length", "enum"],
		},
		{
			name: "contain",
			browsers: ["E79", "FF69", "FFA79", "S15.4", "SM15.4", "C52", "CA52", "O39"],
			values: [
				{
					name: "none",
					description: "Indicates that the property has no effect.",
				},
				{
					name: "strict",
					description: "Turns on all forms of containment for the element.",
				},
				{
					name: "content",
					description: "All containment rules except size are applied to the element.",
				},
				{
					name: "size",
					description:
						"For properties that can have effects on more than just an element and its descendants, those effects don't escape the containing element.",
				},
				{
					name: "layout",
					description: "Turns on layout containment for the element.",
				},
				{
					name: "style",
					description: "Turns on style containment for the element.",
				},
				{
					name: "paint",
					description: "Turns on paint containment for the element.",
				},
			],
			syntax: "none | strict | content | [ [ size || inline-size ] || layout || style || paint ]",
			relevance: 59,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/contain",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-03-14",
				baseline_high_date: "2024-09-14",
			},
			description:
				"Indicates that an element and its contents are, as much as possible, independent of the rest of the document tree.",
			restrictions: ["enum"],
		},
		{
			name: "content",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE8", "O4"],
			values: [
				{
					name: "attr()",
					description:
						"The attr(n) function returns as a string the value of attribute n for the subject of the selector.",
				},
				{
					name: "counter(name)",
					description:
						"Counters are denoted by identifiers (see the 'counter-increment' and 'counter-reset' properties).",
				},
				{
					name: "icon",
					description:
						"The (pseudo-)element is replaced in its entirety by the resource referenced by its 'icon' property, and treated as a replaced element.",
				},
				{
					name: "none",
					description:
						"On elements, this inhibits the children of the element from being rendered as children of this element, as if the element was empty. On pseudo-elements it causes the pseudo-element to have no content.",
				},
				{
					name: "normal",
					description: "See http://www.w3.org/TR/css3-content/#content for computation rules.",
				},
				{
					name: "url()",
				},
			],
			syntax: "normal | none | [ <content-replacement> | <content-list> ] [/ [ <string> | <counter> ]+ ]?",
			relevance: 90,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/content",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Determines which page-based occurrence of a given element is applied to a counter or string value.",
			restrictions: ["string", "url"],
		},
		{
			name: "counter-increment",
			browsers: ["E12", "FF1", "FFA25", "S3", "SM1", "C2", "CA18", "IE8", "O9.2"],
			values: [
				{
					name: "none",
					description: "This element does not alter the value of any counters.",
				},
			],
			syntax: "[ <counter-name> <integer>? ]+ | none",
			relevance: 55,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/counter-increment",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Manipulate the value of existing counters.",
			restrictions: ["identifier", "integer"],
		},
		{
			name: "counter-reset",
			browsers: ["E12", "FF1", "FFA25", "S3", "SM1", "C2", "CA18", "IE8", "O9.2"],
			values: [
				{
					name: "none",
					description: "The counter is not modified.",
				},
			],
			syntax: "[ <counter-name> <integer>? | <reversed-counter-name> <integer>? ]+ | none",
			relevance: 54,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/counter-reset",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Property accepts one or more names of counters (identifiers), each one optionally followed by an integer. The integer gives the value that the counter is set to on each occurrence of the element.",
			restrictions: ["identifier", "integer"],
		},
		{
			name: "cursor",
			browsers: ["E12", "FF1", "FFA95", "S1.2", "SM13.4", "C1", "CA18", "IE4", "O7"],
			values: [
				{
					name: "alias",
					description:
						"Indicates an alias of/shortcut to something is to be created. Often rendered as an arrow with a small curved arrow next to it.",
				},
				{
					name: "all-scroll",
					description:
						"Indicates that the something can be scrolled in any direction. Often rendered as arrows pointing up, down, left, and right with a dot in the middle.",
				},
				{
					name: "auto",
					description: "The UA determines the cursor to display based on the current context.",
				},
				{
					name: "cell",
					description:
						"Indicates that a cell or set of cells may be selected. Often rendered as a thick plus-sign with a dot in the middle.",
				},
				{
					name: "col-resize",
					description:
						"Indicates that the item/column can be resized horizontally. Often rendered as arrows pointing left and right with a vertical bar separating them.",
				},
				{
					name: "context-menu",
					description:
						"A context menu is available for the object under the cursor. Often rendered as an arrow with a small menu-like graphic next to it.",
				},
				{
					name: "copy",
					description:
						"Indicates something is to be copied. Often rendered as an arrow with a small plus sign next to it.",
				},
				{
					name: "crosshair",
					description:
						"A simple crosshair (e.g., short line segments resembling a '+' sign). Often used to indicate a two dimensional bitmap selection mode.",
				},
				{
					name: "default",
					description: "The platform-dependent default cursor. Often rendered as an arrow.",
				},
				{
					name: "e-resize",
					description: "Indicates that east edge is to be moved.",
				},
				{
					name: "ew-resize",
					description: "Indicates a bidirectional east-west resize cursor.",
				},
				{
					name: "grab",
					browsers: ["E12", "FF1", "FFA95", "S1.2", "SM13.4", "C1", "CA18", "IE4", "O7"],
					description: "Indicates that something can be grabbed.",
				},
				{
					name: "grabbing",
					browsers: ["E12", "FF1", "FFA95", "S1.2", "SM13.4", "C1", "CA18", "IE4", "O7"],
					description: "Indicates that something is being grabbed.",
				},
				{
					name: "help",
					description:
						"Help is available for the object under the cursor. Often rendered as a question mark or a balloon.",
				},
				{
					name: "move",
					description: "Indicates something is to be moved.",
				},
				{
					name: "-moz-grab",
					browsers: ["E12", "FF1", "FFA95", "S1.2", "SM13.4", "C1", "CA18", "IE4", "O7"],
					description: "Indicates that something can be grabbed.",
				},
				{
					name: "-moz-grabbing",
					browsers: ["E12", "FF1", "FFA95", "S1.2", "SM13.4", "C1", "CA18", "IE4", "O7"],
					description: "Indicates that something is being grabbed.",
				},
				{
					name: "-moz-zoom-in",
					browsers: ["E12", "FF1", "FFA95", "S1.2", "SM13.4", "C1", "CA18", "IE4", "O7"],
					description: "Indicates that something can be zoomed (magnified) in.",
				},
				{
					name: "-moz-zoom-out",
					browsers: ["E12", "FF1", "FFA95", "S1.2", "SM13.4", "C1", "CA18", "IE4", "O7"],
					description: "Indicates that something can be zoomed (magnified) out.",
				},
				{
					name: "ne-resize",
					description: "Indicates that movement starts from north-east corner.",
				},
				{
					name: "nesw-resize",
					description: "Indicates a bidirectional north-east/south-west cursor.",
				},
				{
					name: "no-drop",
					description:
						"Indicates that the dragged item cannot be dropped at the current cursor location. Often rendered as a hand or pointer with a small circle with a line through it.",
				},
				{
					name: "none",
					description: "No cursor is rendered for the element.",
				},
				{
					name: "not-allowed",
					description:
						"Indicates that the requested action will not be carried out. Often rendered as a circle with a line through it.",
				},
				{
					name: "n-resize",
					description: "Indicates that north edge is to be moved.",
				},
				{
					name: "ns-resize",
					description: "Indicates a bidirectional north-south cursor.",
				},
				{
					name: "nw-resize",
					description: "Indicates that movement starts from north-west corner.",
				},
				{
					name: "nwse-resize",
					description: "Indicates a bidirectional north-west/south-east cursor.",
				},
				{
					name: "pointer",
					description: "The cursor is a pointer that indicates a link.",
				},
				{
					name: "progress",
					description:
						"A progress indicator. The program is performing some processing, but is different from 'wait' in that the user may still interact with the program. Often rendered as a spinning beach ball, or an arrow with a watch or hourglass.",
				},
				{
					name: "row-resize",
					description:
						"Indicates that the item/row can be resized vertically. Often rendered as arrows pointing up and down with a horizontal bar separating them.",
				},
				{
					name: "se-resize",
					description: "Indicates that movement starts from south-east corner.",
				},
				{
					name: "s-resize",
					description: "Indicates that south edge is to be moved.",
				},
				{
					name: "sw-resize",
					description: "Indicates that movement starts from south-west corner.",
				},
				{
					name: "text",
					description: "Indicates text that may be selected. Often rendered as a vertical I-beam.",
				},
				{
					name: "vertical-text",
					description: "Indicates vertical-text that may be selected. Often rendered as a horizontal I-beam.",
				},
				{
					name: "wait",
					description:
						"Indicates that the program is busy and the user should wait. Often rendered as a watch or hourglass.",
				},
				{
					name: "-webkit-grab",
					browsers: ["E12", "FF1", "FFA95", "S1.2", "SM13.4", "C1", "CA18", "IE4", "O7"],
					description: "Indicates that something can be grabbed.",
				},
				{
					name: "-webkit-grabbing",
					browsers: ["E12", "FF1", "FFA95", "S1.2", "SM13.4", "C1", "CA18", "IE4", "O7"],
					description: "Indicates that something is being grabbed.",
				},
				{
					name: "-webkit-zoom-in",
					browsers: ["E12", "FF1", "FFA95", "S1.2", "SM13.4", "C1", "CA18", "IE4", "O7"],
					description: "Indicates that something can be zoomed (magnified) in.",
				},
				{
					name: "-webkit-zoom-out",
					browsers: ["E12", "FF1", "FFA95", "S1.2", "SM13.4", "C1", "CA18", "IE4", "O7"],
					description: "Indicates that something can be zoomed (magnified) out.",
				},
				{
					name: "w-resize",
					description: "Indicates that west edge is to be moved.",
				},
				{
					name: "zoom-in",
					browsers: ["E12", "FF1", "FFA95", "S1.2", "SM13.4", "C1", "CA18", "IE4", "O7"],
					description: "Indicates that something can be zoomed (magnified) in.",
				},
				{
					name: "zoom-out",
					browsers: ["E12", "FF1", "FFA95", "S1.2", "SM13.4", "C1", "CA18", "IE4", "O7"],
					description: "Indicates that something can be zoomed (magnified) out.",
				},
			],
			syntax:
				"[ [ <url> [ <x> <y> ]? , ]* [ auto | default | none | context-menu | help | pointer | progress | wait | cell | crosshair | text | vertical-text | alias | copy | move | no-drop | not-allowed | e-resize | n-resize | ne-resize | nw-resize | s-resize | se-resize | sw-resize | w-resize | ew-resize | ns-resize | nesw-resize | nwse-resize | col-resize | row-resize | all-scroll | zoom-in | zoom-out | grab | grabbing ] ]",
			relevance: 91,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/cursor",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-12-07",
				baseline_high_date: "2024-06-07",
			},
			description: "Allows control over cursor appearance in an element",
			restrictions: ["url", "number", "enum"],
		},
		{
			name: "direction",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C2", "CA18", "IE5.5", "O9.2"],
			values: [
				{
					name: "ltr",
					description: "Left-to-right direction.",
				},
				{
					name: "rtl",
					description: "Right-to-left direction.",
				},
			],
			syntax: "ltr | rtl",
			relevance: 72,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/direction",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Specifies the inline base direction or directionality of any bidi paragraph, embedding, isolate, or override established by the box. Note: for HTML content use the 'dir' attribute and 'bdo' element rather than this property.",
			restrictions: ["enum"],
		},
		{
			name: "display",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
			values: [
				{
					name: "block",
					description: "The element generates a block-level box",
				},
				{
					name: "contents",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
					description:
						"The element itself does not generate any boxes, but its children and pseudo-elements still generate boxes as normal.",
				},
				{
					name: "flex",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
					description:
						"The element generates a principal flex container box and establishes a flex formatting context.",
				},
				{
					name: "flexbox",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
					description:
						"The element lays out its contents using flow layout (block-and-inline layout). Standardized as 'flex'.",
				},
				{
					name: "flow-root",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
					description: "The element generates a block container box, and lays out its contents using flow layout.",
				},
				{
					name: "grid",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
					description:
						"The element generates a principal grid container box, and establishes a grid formatting context.",
				},
				{
					name: "inline",
					description: "The element generates an inline-level box.",
				},
				{
					name: "inline-block",
					description:
						"A block box, which itself is flowed as a single inline box, similar to a replaced element. The inside of an inline-block is formatted as a block box, and the box itself is formatted as an inline box.",
				},
				{
					name: "inline-flex",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
					description: "Inline-level flex container.",
				},
				{
					name: "inline-flexbox",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
					description: "Inline-level flex container. Standardized as 'inline-flex'",
				},
				{
					name: "inline-table",
					description: "Inline-level table wrapper box containing table box.",
				},
				{
					name: "list-item",
					description: "One or more block boxes and one marker box.",
				},
				{
					name: "-moz-box",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
					description:
						"The element lays out its contents using flow layout (block-and-inline layout). Standardized as 'flex'.",
				},
				{
					name: "-moz-deck",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
				},
				{
					name: "-moz-grid",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
				},
				{
					name: "-moz-grid-group",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
				},
				{
					name: "-moz-grid-line",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
				},
				{
					name: "-moz-groupbox",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
				},
				{
					name: "-moz-inline-box",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
					description: "Inline-level flex container. Standardized as 'inline-flex'",
				},
				{
					name: "-moz-inline-grid",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
				},
				{
					name: "-moz-inline-stack",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
				},
				{
					name: "-moz-marker",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
				},
				{
					name: "-moz-popup",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
				},
				{
					name: "-moz-stack",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
				},
				{
					name: "-ms-flexbox",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
					description:
						"The element lays out its contents using flow layout (block-and-inline layout). Standardized as 'flex'.",
				},
				{
					name: "-ms-grid",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
					description:
						"The element generates a principal grid container box, and establishes a grid formatting context.",
				},
				{
					name: "-ms-inline-flexbox",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
					description: "Inline-level flex container. Standardized as 'inline-flex'",
				},
				{
					name: "-ms-inline-grid",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
					description: "Inline-level grid container.",
				},
				{
					name: "none",
					description: "The element and its descendants generates no boxes.",
				},
				{
					name: "ruby",
					description:
						"The element generates a principal ruby container box, and establishes a ruby formatting context.",
				},
				{
					name: "ruby-base",
				},
				{
					name: "ruby-base-container",
				},
				{
					name: "ruby-text",
				},
				{
					name: "ruby-text-container",
				},
				{
					name: "run-in",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
					description:
						"The element generates a run-in box. Run-in elements act like inlines or blocks, depending on the surrounding elements.",
				},
				{
					name: "table",
					description:
						"The element generates a principal table wrapper box containing an additionally-generated table box, and establishes a table formatting context.",
				},
				{
					name: "table-caption",
				},
				{
					name: "table-cell",
				},
				{
					name: "table-column",
				},
				{
					name: "table-column-group",
				},
				{
					name: "table-footer-group",
				},
				{
					name: "table-header-group",
				},
				{
					name: "table-row",
				},
				{
					name: "table-row-group",
				},
				{
					name: "-webkit-box",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
					description:
						"The element lays out its contents using flow layout (block-and-inline layout). Standardized as 'flex'.",
				},
				{
					name: "-webkit-flex",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
					description: "The element lays out its contents using flow layout (block-and-inline layout).",
				},
				{
					name: "-webkit-inline-box",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
					description: "Inline-level flex container. Standardized as 'inline-flex'",
				},
				{
					name: "-webkit-inline-flex",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
					description: "Inline-level flex container.",
				},
			],
			syntax:
				"[ <display-outside> || <display-inside> ] | <display-listitem> | <display-internal> | <display-box> | <display-legacy>",
			relevance: 95,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/display",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"In combination with 'float' and 'position', determines the type of box or boxes that are generated for an element.",
			restrictions: ["enum"],
		},
		{
			name: "empty-cells",
			browsers: ["E12", "FF1", "FFA4", "S1.2", "SM1", "C1", "CA18", "IE8", "O4"],
			values: [
				{
					name: "hide",
					description: "No borders or backgrounds are drawn around/behind empty cells.",
				},
				{
					name: "-moz-show-background",
					browsers: ["E12", "FF1", "FFA4", "S1.2", "SM1", "C1", "CA18", "IE8", "O4"],
				},
				{
					name: "show",
					description: "Borders and backgrounds are drawn around/behind empty cells (like normal cells).",
				},
			],
			syntax: "show | hide",
			relevance: 51,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/empty-cells",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"In the separated borders model, this property controls the rendering of borders and backgrounds around cells that have no visible content.",
			restrictions: ["enum"],
		},
		{
			name: "enable-background",
			values: [
				{
					name: "accumulate",
					description:
						"If the ancestor container element has a property of new, then all graphics elements within the current container are rendered both on the parent's background image and onto the target.",
				},
				{
					name: "new",
					description:
						"Create a new background image canvas. All children of the current container element can access the background, and they will be rendered onto both the parent's background image canvas in addition to the target device.",
				},
			],
			relevance: 50,
			description:
				"Deprecated. Use 'isolation' property instead when support allows. Specifies how the accumulation of the background image is managed.",
			restrictions: ["integer", "length", "percentage", "enum"],
		},
		{
			name: "fallback",
			browsers: ["FF33"],
			atRule: "@counter-style",
			syntax: "<counter-style-name>",
			relevance: 50,
			description:
				"@counter-style descriptor. Specifies a fallback counter style to be used when the current counter style can't create a representation for a given counter value.",
			restrictions: ["identifier"],
		},
		{
			name: "fill",
			browsers: ["E15", "FF3", "FFA4", "S4", "SM3.2", "C1", "CA18", "O15"],
			values: [
				{
					name: "url()",
					description:
						"A URL reference to a paint server element, which is an element that defines a paint server: 'hatch', 'linearGradient', 'mesh', 'pattern', 'radialGradient' and 'solidcolor'.",
				},
				{
					name: "none",
					description: "No paint is applied in this layer.",
				},
			],
			syntax: "<paint>",
			relevance: 80,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/fill",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-04-05",
				baseline_high_date: "2019-10-05",
			},
			description: "Paints the interior of the given graphical element.",
			restrictions: ["color", "enum", "url"],
		},
		{
			name: "fill-opacity",
			browsers: ["E15", "FF1", "FFA4", "S4", "SM3.2", "C1", "CA18", "O15"],
			syntax: "<'opacity'>",
			relevance: 55,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/fill-opacity",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-04-05",
				baseline_high_date: "2019-10-05",
			},
			description: "Specifies the opacity of the painting operation used to paint the interior the current object.",
			restrictions: ["number(0-1)"],
		},
		{
			name: "fill-rule",
			browsers: ["E15", "FF3", "FFA4", "S4", "SM3.2", "C1", "CA18", "O15"],
			values: [
				{
					name: "evenodd",
					description:
						"Determines the 'insideness' of a point on the canvas by drawing a ray from that point to infinity in any direction and counting the number of path segments from the given shape that the ray crosses.",
				},
				{
					name: "nonzero",
					description:
						"Determines the 'insideness' of a point on the canvas by drawing a ray from that point to infinity in any direction and then examining the places where a segment of the shape crosses the ray.",
				},
			],
			syntax: "nonzero | evenodd",
			relevance: 51,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/fill-rule",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-04-05",
				baseline_high_date: "2019-10-05",
			},
			description:
				"Indicates the algorithm (or winding rule) which is to be used to determine what parts of the canvas are included inside the shape.",
			restrictions: ["enum"],
		},
		{
			name: "filter",
			browsers: ["E12", "FF35", "FFA35", "S9.1", "SM9.3", "C53", "CA53", "O40"],
			values: [
				{
					name: "none",
					description: "No filter effects are applied.",
				},
				{
					name: "blur()",
					description: "Applies a Gaussian blur to the input image.",
				},
				{
					name: "brightness()",
					description: "Applies a linear multiplier to input image, making it appear more or less bright.",
				},
				{
					name: "contrast()",
					description: "Adjusts the contrast of the input.",
				},
				{
					name: "drop-shadow()",
					description: "Applies a drop shadow effect to the input image.",
				},
				{
					name: "grayscale()",
					description: "Converts the input image to grayscale.",
				},
				{
					name: "hue-rotate()",
					description: "Applies a hue rotation on the input image. ",
				},
				{
					name: "invert()",
					description: "Inverts the samples in the input image.",
				},
				{
					name: "opacity()",
					description: "Applies transparency to the samples in the input image.",
				},
				{
					name: "saturate()",
					description: "Saturates the input image.",
				},
				{
					name: "sepia()",
					description: "Converts the input image to sepia.",
				},
				{
					name: "url()",
					browsers: ["E12", "FF35", "FFA35", "S9.1", "SM9.3", "C53", "CA53", "O40"],
					description: "A filter reference to a <filter> element.",
				},
			],
			syntax: "none | <filter-value-list>",
			relevance: 73,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/filter",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2016-09-07",
				baseline_high_date: "2019-03-07",
			},
			description:
				"Processes an element's rendering before it is displayed in the document, by applying one or more filter effects.",
			restrictions: ["enum", "url"],
		},
		{
			name: "flex",
			browsers: ["E12", "FF20", "FFA20", "S9", "SM9", "C29", "CA29", "IE11", "O12.1"],
			values: [
				{
					name: "auto",
					description: "Retrieves the value of the main size property as the used 'flex-basis'.",
				},
				{
					name: "content",
					browsers: ["E12", "FF20", "FFA20", "S9", "SM9", "C29", "CA29", "IE11", "O12.1"],
					description: "Indicates automatic sizing, based on the flex item's content.",
				},
				{
					name: "none",
					description: "Expands to '0 0 auto'.",
				},
			],
			syntax: "none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]",
			relevance: 82,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/flex",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description:
				"Specifies the components of a flexible length: the flex grow factor and flex shrink factor, and the flex basis.",
			restrictions: ["length", "number", "percentage"],
		},
		{
			name: "flex-basis",
			browsers: ["E12", "FF22", "FFA22", "S9", "SM9", "C29", "CA29", "IE11", "O12.1"],
			values: [
				{
					name: "auto",
					description: "Retrieves the value of the main size property as the used 'flex-basis'.",
				},
				{
					name: "content",
					browsers: ["E12", "FF22", "FFA22", "S9", "SM9", "C29", "CA29", "IE11", "O12.1"],
					description: "Indicates automatic sizing, based on the flex item's content.",
				},
			],
			syntax: "content | <'width'>",
			relevance: 70,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/flex-basis",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description: "Sets the flex basis.",
			restrictions: ["length", "number", "percentage"],
		},
		{
			name: "flex-direction",
			browsers: ["E12", "FF20", "FFA20", "S9", "SM9", "C29", "CA29", "IE11", "O12.1"],
			values: [
				{
					name: "column",
					description:
						"The flex container's main axis has the same orientation as the block axis of the current writing mode.",
				},
				{
					name: "column-reverse",
					description: "Same as 'column', except the main-start and main-end directions are swapped.",
				},
				{
					name: "row",
					description:
						"The flex container's main axis has the same orientation as the inline axis of the current writing mode.",
				},
				{
					name: "row-reverse",
					description: "Same as 'row', except the main-start and main-end directions are swapped.",
				},
			],
			syntax: "row | row-reverse | column | column-reverse",
			relevance: 86,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/flex-direction",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description:
				"Specifies how flex items are placed in the flex container, by setting the direction of the flex container's main axis.",
			restrictions: ["enum"],
		},
		{
			name: "flex-flow",
			browsers: ["E12", "FF28", "FFA28", "S9", "SM9", "C29", "CA29", "IE11", "O12.1"],
			values: [
				{
					name: "column",
					description:
						"The flex container's main axis has the same orientation as the block axis of the current writing mode.",
				},
				{
					name: "column-reverse",
					description: "Same as 'column', except the main-start and main-end directions are swapped.",
				},
				{
					name: "nowrap",
					description: "The flex container is single-line.",
				},
				{
					name: "row",
					description:
						"The flex container's main axis has the same orientation as the inline axis of the current writing mode.",
				},
				{
					name: "row-reverse",
					description: "Same as 'row', except the main-start and main-end directions are swapped.",
				},
				{
					name: "wrap",
					description: "The flexbox is multi-line.",
				},
				{
					name: "wrap-reverse",
					description: "Same as 'wrap', except the cross-start and cross-end directions are swapped.",
				},
			],
			syntax: "<'flex-direction'> || <'flex-wrap'>",
			relevance: 64,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/flex-flow",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description: "Specifies how flexbox items are placed in the flexbox.",
			restrictions: ["enum"],
		},
		{
			name: "flex-grow",
			browsers: ["E12", "FF20", "FFA20", "S9", "SM9", "C29", "CA29", "IE11", "O12.1"],
			syntax: "<number>",
			relevance: 78,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/flex-grow",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description: "Sets the flex grow factor. Negative numbers are invalid.",
			restrictions: ["number"],
		},
		{
			name: "flex-shrink",
			browsers: ["E12", "FF20", "FFA20", "S9", "SM9", "C29", "CA29", "IE10", "O12.1"],
			syntax: "<number>",
			relevance: 78,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/flex-shrink",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description: "Sets the flex shrink factor. Negative numbers are invalid.",
			restrictions: ["number"],
		},
		{
			name: "flex-wrap",
			browsers: ["E12", "FF28", "FFA28", "S9", "SM9", "C29", "CA29", "IE11", "O16"],
			values: [
				{
					name: "nowrap",
					description: "The flex container is single-line.",
				},
				{
					name: "wrap",
					description: "The flexbox is multi-line.",
				},
				{
					name: "wrap-reverse",
					description: "Same as 'wrap', except the cross-start and cross-end directions are swapped.",
				},
			],
			syntax: "nowrap | wrap | wrap-reverse",
			relevance: 83,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/flex-wrap",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description:
				"Controls whether the flex container is single-line or multi-line, and the direction of the cross-axis, which determines the direction new lines are stacked in.",
			restrictions: ["enum"],
		},
		{
			name: "float",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
			values: [
				{
					name: "inline-end",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
					description:
						"A keyword indicating that the element must float on the end side of its containing block. That is the right side with ltr scripts, and the left side with rtl scripts.",
				},
				{
					name: "inline-start",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
					description:
						"A keyword indicating that the element must float on the start side of its containing block. That is the left side with ltr scripts, and the right side with rtl scripts.",
				},
				{
					name: "left",
					description:
						"The element generates a block box that is floated to the left. Content flows on the right side of the box, starting at the top (subject to the 'clear' property).",
				},
				{
					name: "none",
					description: "The box is not floated.",
				},
				{
					name: "right",
					description:
						"Similar to 'left', except the box is floated to the right, and content flows on the left side of the box, starting at the top.",
				},
			],
			syntax: "left | right | none | inline-start | inline-end",
			relevance: 87,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/float",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Specifies how a box should be floated. It may be set for any element, but only applies to elements that generate boxes that are not absolutely positioned.",
			restrictions: ["enum"],
		},
		{
			name: "flood-color",
			browsers: ["E12", "FF3", "FFA4", "S6", "SM6", "C5", "CA18", "IE11", "O15"],
			syntax: "<color>",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/flood-color",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Indicates what color to use to flood the current filter primitive subregion.",
			restrictions: ["color"],
		},
		{
			name: "flood-opacity",
			browsers: ["E12", "FF3", "FFA4", "S6", "SM6", "C5", "CA18", "IE11", "O15"],
			syntax: "<'opacity'>",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/flood-opacity",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Indicates what opacity to use to flood the current filter primitive subregion.",
			restrictions: ["number(0-1)", "percentage"],
		},
		{
			name: "font",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE3", "O3.5"],
			values: [
				{
					name: "100",
					description: "Thin",
				},
				{
					name: "200",
					description: "Extra Light (Ultra Light)",
				},
				{
					name: "300",
					description: "Light",
				},
				{
					name: "400",
					description: "Normal",
				},
				{
					name: "500",
					description: "Medium",
				},
				{
					name: "600",
					description: "Semi Bold (Demi Bold)",
				},
				{
					name: "700",
					description: "Bold",
				},
				{
					name: "800",
					description: "Extra Bold (Ultra Bold)",
				},
				{
					name: "900",
					description: "Black (Heavy)",
				},
				{
					name: "bold",
					description: "Same as 700",
				},
				{
					name: "bolder",
					description: "Specifies the weight of the face bolder than the inherited value.",
				},
				{
					name: "caption",
					description: "The font used for captioned controls (e.g., buttons, drop-downs, etc.).",
				},
				{
					name: "icon",
					description: "The font used to label icons.",
				},
				{
					name: "italic",
					description: "Selects a font that is labeled 'italic', or, if that is not available, one labeled 'oblique'.",
				},
				{
					name: "large",
				},
				{
					name: "larger",
				},
				{
					name: "lighter",
					description: "Specifies the weight of the face lighter than the inherited value.",
				},
				{
					name: "medium",
				},
				{
					name: "menu",
					description: "The font used in menus (e.g., dropdown menus and menu lists).",
				},
				{
					name: "message-box",
					description: "The font used in dialog boxes.",
				},
				{
					name: "normal",
					description: "Specifies a face that is not labeled as a small-caps font.",
				},
				{
					name: "oblique",
					description: "Selects a font that is labeled 'oblique'.",
				},
				{
					name: "small",
				},
				{
					name: "small-caps",
					description:
						"Specifies a font that is labeled as a small-caps font. If a genuine small-caps font is not available, user agents should simulate a small-caps font.",
				},
				{
					name: "small-caption",
					description: "The font used for labeling small controls.",
				},
				{
					name: "smaller",
				},
				{
					name: "status-bar",
					description: "The font used in window status bars.",
				},
				{
					name: "x-large",
				},
				{
					name: "x-small",
				},
				{
					name: "xx-large",
				},
				{
					name: "xx-small",
				},
			],
			syntax:
				"[ [ <'font-style'> || <font-variant-css21> || <'font-weight'> || <'font-stretch'> ]? <'font-size'> [ / <'line-height'> ]? <'font-family'> ] | caption | icon | menu | message-box | small-caption | status-bar",
			relevance: 82,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/font",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Shorthand property for setting 'font-style', 'font-variant', 'font-weight', 'font-size', 'line-height', and 'font-family', at the same place in the style sheet. The syntax of this property is based on a traditional typographical shorthand notation to set multiple properties related to fonts.",
			restrictions: ["font"],
		},
		{
			name: "font-family",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE3", "O3.5"],
			values: [
				{
					name: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
				},
				{
					name: "Arial, Helvetica, sans-serif",
				},
				{
					name: "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif",
				},
				{
					name: "'Courier New', Courier, monospace",
				},
				{
					name: "cursive",
				},
				{
					name: "fantasy",
				},
				{
					name: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif",
				},
				{
					name: "Georgia, 'Times New Roman', Times, serif",
				},
				{
					name: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
				},
				{
					name: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
				},
				{
					name: "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif",
				},
				{
					name: "monospace",
				},
				{
					name: "sans-serif",
				},
				{
					name: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
				},
				{
					name: "serif",
				},
				{
					name: "'Times New Roman', Times, serif",
				},
				{
					name: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
				},
				{
					name: "Verdana, Geneva, Tahoma, sans-serif",
				},
			],
			atRule: "@font-palette-values",
			syntax: "<family-name>#",
			relevance: 93,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/font-family",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Specifies a prioritized list of font family names or generic family names. A user agent iterates through the list of family names until it matches an available font that contains a glyph for the character to be rendered.",
			restrictions: ["font"],
		},
		{
			name: "font-feature-settings",
			browsers: ["E15", "FF34", "FFA34", "S9.1", "SM9.3", "C48", "CA48", "IE10", "O35"],
			values: [
				{
					name: '"aalt"',
					description: "Access All Alternates.",
				},
				{
					name: '"abvf"',
					description: "Above-base Forms. Required in Khmer script.",
				},
				{
					name: '"abvm"',
					description: "Above-base Mark Positioning. Required in Indic scripts.",
				},
				{
					name: '"abvs"',
					description: "Above-base Substitutions. Required in Indic scripts.",
				},
				{
					name: '"afrc"',
					description: "Alternative Fractions.",
				},
				{
					name: '"akhn"',
					description: "Akhand. Required in most Indic scripts.",
				},
				{
					name: '"blwf"',
					description: "Below-base Form. Required in a number of Indic scripts.",
				},
				{
					name: '"blwm"',
					description: "Below-base Mark Positioning. Required in Indic scripts.",
				},
				{
					name: '"blws"',
					description: "Below-base Substitutions. Required in Indic scripts.",
				},
				{
					name: '"calt"',
					description: "Contextual Alternates.",
				},
				{
					name: '"case"',
					description:
						"Case-Sensitive Forms. Applies only to European scripts; particularly prominent in Spanish-language setting.",
				},
				{
					name: '"ccmp"',
					description: "Glyph Composition/Decomposition.",
				},
				{
					name: '"cfar"',
					description: "Conjunct Form After Ro. Required in Khmer scripts.",
				},
				{
					name: '"cjct"',
					description: "Conjunct Forms. Required in Indic scripts that show similarity to Devanagari.",
				},
				{
					name: '"clig"',
					description: "Contextual Ligatures.",
				},
				{
					name: '"cpct"',
					description: "Centered CJK Punctuation. Used primarily in Chinese fonts.",
				},
				{
					name: '"cpsp"',
					description: "Capital Spacing. Should not be used in connecting scripts (e.g. most Arabic).",
				},
				{
					name: '"cswh"',
					description: "Contextual Swash.",
				},
				{
					name: '"curs"',
					description: "Cursive Positioning. Can be used in any cursive script.",
				},
				{
					name: '"c2pc"',
					description: "Petite Capitals From Capitals. Applies only to bicameral scripts.",
				},
				{
					name: '"c2sc"',
					description: "Small Capitals From Capitals. Applies only to bicameral scripts.",
				},
				{
					name: '"dist"',
					description: "Distances. Required in Indic scripts.",
				},
				{
					name: '"dlig"',
					description: "Discretionary ligatures.",
				},
				{
					name: '"dnom"',
					description: "Denominators.",
				},
				{
					name: '"dtls"',
					description: "Dotless Forms. Applied to math formula layout.",
				},
				{
					name: '"expt"',
					description: "Expert Forms. Applies only to Japanese.",
				},
				{
					name: '"falt"',
					description: "Final Glyph on Line Alternates. Can be used in any cursive script.",
				},
				{
					name: '"fin2"',
					description: "Terminal Form #2. Used only with the Syriac script.",
				},
				{
					name: '"fin3"',
					description: "Terminal Form #3. Used only with the Syriac script.",
				},
				{
					name: '"fina"',
					description: "Terminal Forms. Can be used in any alphabetic script.",
				},
				{
					name: '"flac"',
					description: "Flattened ascent forms. Applied to math formula layout.",
				},
				{
					name: '"frac"',
					description: "Fractions.",
				},
				{
					name: '"fwid"',
					description: "Full Widths. Applies to any script which can use monospaced forms.",
				},
				{
					name: '"half"',
					description: "Half Forms. Required in Indic scripts that show similarity to Devanagari.",
				},
				{
					name: '"haln"',
					description: "Halant Forms. Required in Indic scripts.",
				},
				{
					name: '"halt"',
					description: "Alternate Half Widths. Used only in CJKV fonts.",
				},
				{
					name: '"hist"',
					description: "Historical Forms.",
				},
				{
					name: '"hkna"',
					description: "Horizontal Kana Alternates. Applies only to fonts that support kana (hiragana and katakana).",
				},
				{
					name: '"hlig"',
					description: "Historical Ligatures.",
				},
				{
					name: '"hngl"',
					description: "Hangul. Korean only.",
				},
				{
					name: '"hojo"',
					description: "Hojo Kanji Forms (JIS X 0212-1990 Kanji Forms). Used only with Kanji script.",
				},
				{
					name: '"hwid"',
					description: "Half Widths. Generally used only in CJKV fonts.",
				},
				{
					name: '"init"',
					description: "Initial Forms. Can be used in any alphabetic script.",
				},
				{
					name: '"isol"',
					description: "Isolated Forms. Can be used in any cursive script.",
				},
				{
					name: '"ital"',
					description: "Italics. Applies mostly to Latin; note that many non-Latin fonts contain Latin as well.",
				},
				{
					name: '"jalt"',
					description: "Justification Alternates. Can be used in any cursive script.",
				},
				{
					name: '"jp78"',
					description: "JIS78 Forms. Applies only to Japanese.",
				},
				{
					name: '"jp83"',
					description: "JIS83 Forms. Applies only to Japanese.",
				},
				{
					name: '"jp90"',
					description: "JIS90 Forms. Applies only to Japanese.",
				},
				{
					name: '"jp04"',
					description: "JIS2004 Forms. Applies only to Japanese.",
				},
				{
					name: '"kern"',
					description: "Kerning.",
				},
				{
					name: '"lfbd"',
					description: "Left Bounds.",
				},
				{
					name: '"liga"',
					description: "Standard Ligatures.",
				},
				{
					name: '"ljmo"',
					description:
						"Leading Jamo Forms. Required for Hangul script when Ancient Hangul writing system is supported.",
				},
				{
					name: '"lnum"',
					description: "Lining Figures.",
				},
				{
					name: '"locl"',
					description: "Localized Forms.",
				},
				{
					name: '"ltra"',
					description: "Left-to-right glyph alternates.",
				},
				{
					name: '"ltrm"',
					description: "Left-to-right mirrored forms.",
				},
				{
					name: '"mark"',
					description: "Mark Positioning.",
				},
				{
					name: '"med2"',
					description: "Medial Form #2. Used only with the Syriac script.",
				},
				{
					name: '"medi"',
					description: "Medial Forms.",
				},
				{
					name: '"mgrk"',
					description: "Mathematical Greek.",
				},
				{
					name: '"mkmk"',
					description: "Mark to Mark Positioning.",
				},
				{
					name: '"nalt"',
					description: "Alternate Annotation Forms.",
				},
				{
					name: '"nlck"',
					description: "NLC Kanji Forms. Used only with Kanji script.",
				},
				{
					name: '"nukt"',
					description: "Nukta Forms. Required in Indic scripts..",
				},
				{
					name: '"numr"',
					description: "Numerators.",
				},
				{
					name: '"onum"',
					description: "Oldstyle Figures.",
				},
				{
					name: '"opbd"',
					description: "Optical Bounds.",
				},
				{
					name: '"ordn"',
					description: "Ordinals. Applies mostly to Latin script.",
				},
				{
					name: '"ornm"',
					description: "Ornaments.",
				},
				{
					name: '"palt"',
					description: "Proportional Alternate Widths. Used mostly in CJKV fonts.",
				},
				{
					name: '"pcap"',
					description: "Petite Capitals.",
				},
				{
					name: '"pkna"',
					description: "Proportional Kana. Generally used only in Japanese fonts.",
				},
				{
					name: '"pnum"',
					description: "Proportional Figures.",
				},
				{
					name: '"pref"',
					description:
						"Pre-base Forms. Required in Khmer and Myanmar (Burmese) scripts and southern Indic scripts that may display a pre-base form of Ra.",
				},
				{
					name: '"pres"',
					description: "Pre-base Substitutions. Required in Indic scripts.",
				},
				{
					name: '"pstf"',
					description:
						"Post-base Forms. Required in scripts of south and southeast Asia that have post-base forms for consonants eg: Gurmukhi, Malayalam, Khmer.",
				},
				{
					name: '"psts"',
					description: "Post-base Substitutions.",
				},
				{
					name: '"pwid"',
					description: "Proportional Widths.",
				},
				{
					name: '"qwid"',
					description: "Quarter Widths. Generally used only in CJKV fonts.",
				},
				{
					name: '"rand"',
					description: "Randomize.",
				},
				{
					name: '"rclt"',
					description:
						"Required Contextual Alternates. May apply to any script, but is especially important for many styles of Arabic.",
				},
				{
					name: '"rlig"',
					description: "Required Ligatures. Applies to Arabic and Syriac. May apply to some other scripts.",
				},
				{
					name: '"rkrf"',
					description: "Rakar Forms. Required in Devanagari and Gujarati scripts.",
				},
				{
					name: '"rphf"',
					description: "Reph Form. Required in Indic scripts. E.g. Devanagari, Kannada.",
				},
				{
					name: '"rtbd"',
					description: "Right Bounds.",
				},
				{
					name: '"rtla"',
					description: "Right-to-left alternates.",
				},
				{
					name: '"rtlm"',
					description: "Right-to-left mirrored forms.",
				},
				{
					name: '"ruby"',
					description: "Ruby Notation Forms. Applies only to Japanese.",
				},
				{
					name: '"salt"',
					description: "Stylistic Alternates.",
				},
				{
					name: '"sinf"',
					description: "Scientific Inferiors.",
				},
				{
					name: '"size"',
					description: "Optical size.",
				},
				{
					name: '"smcp"',
					description: "Small Capitals. Applies only to bicameral scripts.",
				},
				{
					name: '"smpl"',
					description: "Simplified Forms. Applies only to Chinese and Japanese.",
				},
				{
					name: '"ssty"',
					description: "Math script style alternates.",
				},
				{
					name: '"stch"',
					description: "Stretching Glyph Decomposition.",
				},
				{
					name: '"subs"',
					description: "Subscript.",
				},
				{
					name: '"sups"',
					description: "Superscript.",
				},
				{
					name: '"swsh"',
					description: "Swash. Does not apply to ideographic scripts.",
				},
				{
					name: '"titl"',
					description: "Titling.",
				},
				{
					name: '"tjmo"',
					description:
						"Trailing Jamo Forms. Required for Hangul script when Ancient Hangul writing system is supported.",
				},
				{
					name: '"tnam"',
					description: "Traditional Name Forms. Applies only to Japanese.",
				},
				{
					name: '"tnum"',
					description: "Tabular Figures.",
				},
				{
					name: '"trad"',
					description: "Traditional Forms. Applies only to Chinese and Japanese.",
				},
				{
					name: '"twid"',
					description: "Third Widths. Generally used only in CJKV fonts.",
				},
				{
					name: '"unic"',
					description: "Unicase.",
				},
				{
					name: '"valt"',
					description: "Alternate Vertical Metrics. Applies only to scripts with vertical writing modes.",
				},
				{
					name: '"vatu"',
					description: "Vattu Variants. Used for Indic scripts. E.g. Devanagari.",
				},
				{
					name: '"vert"',
					description: "Vertical Alternates. Applies only to scripts with vertical writing modes.",
				},
				{
					name: '"vhal"',
					description: "Alternate Vertical Half Metrics. Used only in CJKV fonts.",
				},
				{
					name: '"vjmo"',
					description: "Vowel Jamo Forms. Required for Hangul script when Ancient Hangul writing system is supported.",
				},
				{
					name: '"vkna"',
					description: "Vertical Kana Alternates. Applies only to fonts that support kana (hiragana and katakana).",
				},
				{
					name: '"vkrn"',
					description: "Vertical Kerning.",
				},
				{
					name: '"vpal"',
					description: "Proportional Alternate Vertical Metrics. Used mostly in CJKV fonts.",
				},
				{
					name: '"vrt2"',
					description: "Vertical Alternates and Rotation. Applies only to scripts with vertical writing modes.",
				},
				{
					name: '"zero"',
					description: "Slashed Zero.",
				},
				{
					name: "normal",
					description: "No change in glyph substitution or positioning occurs.",
				},
				{
					name: "off",
					description: "Disable feature.",
				},
				{
					name: "on",
					description: "Enable feature.",
				},
			],
			atRule: "@font-face",
			syntax: "normal | <feature-tag-value>#",
			relevance: 59,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/font-feature-settings",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-04-05",
				baseline_high_date: "2019-10-05",
			},
			description:
				"Provides low-level control over OpenType font features. It is intended as a way of providing access to font features that are not widely used but are needed for a particular use case.",
			restrictions: ["string", "integer"],
		},
		{
			name: "font-kerning",
			browsers: ["E79", "FF32", "FFA32", "S9", "SM9", "C33", "CA33", "O20"],
			values: [
				{
					name: "auto",
					description: "Specifies that kerning is applied at the discretion of the user agent.",
				},
				{
					name: "none",
					description: "Specifies that kerning is not applied.",
				},
				{
					name: "normal",
					description: "Specifies that kerning is applied.",
				},
			],
			syntax: "auto | normal | none",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/font-kerning",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Kerning is the contextual adjustment of inter-glyph spacing. This property controls metric kerning, kerning that utilizes adjustment data contained in the font.",
			restrictions: ["enum"],
		},
		{
			name: "font-language-override",
			browsers: ["FF34", "FFA34"],
			values: [
				{
					name: "normal",
					description:
						"Implies that when rendering with OpenType fonts the language of the document is used to infer the OpenType language system, used to select language specific features when rendering.",
				},
			],
			syntax: "normal | <string>",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/font-language-override",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The value of 'normal' implies that when rendering with OpenType fonts the language of the document is used to infer the OpenType language system, used to select language specific features when rendering.",
			restrictions: ["string"],
		},
		{
			name: "font-size",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE5.5", "O7"],
			values: [
				{
					name: "large",
				},
				{
					name: "larger",
				},
				{
					name: "medium",
				},
				{
					name: "small",
				},
				{
					name: "smaller",
				},
				{
					name: "x-large",
				},
				{
					name: "x-small",
				},
				{
					name: "xx-large",
				},
				{
					name: "xx-small",
				},
			],
			syntax: "<absolute-size> | <relative-size> | <length-percentage [0,∞]> | math",
			relevance: 94,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/font-size",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Indicates the desired height of glyphs from the font. For scalable fonts, the font-size is a scale factor applied to the EM unit of the font. (Note that certain glyphs may bleed outside their EM box.) For non-scalable fonts, the font-size is converted into absolute units and matched against the declared font-size of the font, using the same absolute coordinate space for both of the matched values.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "font-size-adjust",
			browsers: ["E127", "FF3", "FFA4", "S16.4", "SM16.4", "C127", "CA127", "O113"],
			values: [
				{
					name: "none",
					description: "Do not preserve the font's x-height.",
				},
			],
			syntax: "none | [ ex-height | cap-height | ch-width | ic-width | ic-height ]? [ from-font | <number> ]",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/font-size-adjust",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2024-07-25",
			},
			description:
				"Preserves the readability of text when font fallback occurs by adjusting the font-size so that the x-height is the same regardless of the font used.",
			restrictions: ["number"],
		},
		{
			name: "font-stretch",
			browsers: ["E12", "FF9", "FFA9", "S11", "SM11", "C60", "CA60", "IE9", "O47"],
			values: [
				{
					name: "condensed",
				},
				{
					name: "expanded",
				},
				{
					name: "extra-condensed",
				},
				{
					name: "extra-expanded",
				},
				{
					name: "narrower",
					browsers: ["E12", "FF9", "FFA9", "S11", "SM11", "C60", "CA60", "IE9", "O47"],
					description: "Indicates a narrower value relative to the width of the parent element.",
				},
				{
					name: "normal",
				},
				{
					name: "semi-condensed",
				},
				{
					name: "semi-expanded",
				},
				{
					name: "ultra-condensed",
				},
				{
					name: "ultra-expanded",
				},
				{
					name: "wider",
					browsers: ["E12", "FF9", "FFA9", "S11", "SM11", "C60", "CA60", "IE9", "O47"],
					description: "Indicates a wider value relative to the width of the parent element.",
				},
			],
			atRule: "@font-face",
			status: "obsolete",
			syntax: "<font-stretch-absolute>{1,2}",
			relevance: 10,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/font-stretch",
				},
			],
			baseline: {
				status: "false",
			},
			description: "Selects a normal, condensed, or expanded face from a font family.",
			restrictions: ["enum"],
		},
		{
			name: "font-style",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
			values: [
				{
					name: "italic",
					description: "Selects a font that is labeled as an 'italic' face, or an 'oblique' face if one is not",
				},
				{
					name: "normal",
					description: "Selects a face that is classified as 'normal'.",
				},
				{
					name: "oblique",
					description: "Selects a font that is labeled as an 'oblique' face, or an 'italic' face if one is not.",
				},
			],
			atRule: "@font-face",
			syntax: "normal | italic | oblique <angle>{0,2}",
			relevance: 89,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/font-style",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Allows italic or oblique faces to be selected. Italic forms are generally cursive in nature while oblique faces are typically sloped versions of the regular face.",
			restrictions: ["enum"],
		},
		{
			name: "font-synthesis",
			browsers: ["E97", "FF34", "FFA34", "S9", "SM9", "C97", "CA97", "O83"],
			values: [
				{
					name: "none",
					description: "Disallow all synthetic faces.",
				},
				{
					name: "style",
					description: "Allow synthetic italic faces.",
				},
				{
					name: "weight",
					description: "Allow synthetic bold faces.",
				},
			],
			syntax: "none | [ weight || style || small-caps || position]",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/font-synthesis",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-01-06",
				baseline_high_date: "2024-07-06",
			},
			description:
				"Controls whether user agents are allowed to synthesize bold or oblique font faces when a font family lacks bold or italic faces.",
			restrictions: ["enum"],
		},
		{
			name: "font-variant",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			values: [
				{
					name: "normal",
					description: "Specifies a face that is not labeled as a small-caps font.",
				},
				{
					name: "small-caps",
					description:
						"Specifies a font that is labeled as a small-caps font. If a genuine small-caps font is not available, user agents should simulate a small-caps font.",
				},
			],
			syntax:
				"normal | none | [ <common-lig-values> || <discretionary-lig-values> || <historical-lig-values> || <contextual-alt-values> || stylistic( <feature-value-name> ) || historical-forms || styleset( <feature-value-name># ) || character-variant( <feature-value-name># ) || swash( <feature-value-name> ) || ornaments( <feature-value-name> ) || annotation( <feature-value-name> ) || [ small-caps | all-small-caps | petite-caps | all-petite-caps | unicase | titling-caps ] || <numeric-figure-values> || <numeric-spacing-values> || <numeric-fraction-values> || ordinal || slashed-zero || <east-asian-variant-values> || <east-asian-width-values> || ruby ]",
			relevance: 64,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/font-variant",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Specifies variant representations of the font",
			restrictions: ["enum"],
		},
		{
			name: "font-variant-alternates",
			browsers: ["E111", "FF34", "FFA34", "S9.1", "SM9.3", "C111", "CA111", "O97"],
			values: [
				{
					name: "annotation()",
					description: "Enables display of alternate annotation forms.",
				},
				{
					name: "character-variant()",
					description: "Enables display of specific character variants.",
				},
				{
					name: "historical-forms",
					description: "Enables display of historical forms.",
				},
				{
					name: "normal",
					description: "None of the features are enabled.",
				},
				{
					name: "ornaments()",
					description: "Enables replacement of default glyphs with ornaments, if provided in the font.",
				},
				{
					name: "styleset()",
					description: "Enables display with stylistic sets.",
				},
				{
					name: "stylistic()",
					description: "Enables display of stylistic alternates.",
				},
				{
					name: "swash()",
					description: "Enables display of swash glyphs.",
				},
			],
			syntax:
				"normal | [ stylistic( <feature-value-name> ) || historical-forms || styleset( <feature-value-name># ) || character-variant( <feature-value-name># ) || swash( <feature-value-name> ) || ornaments( <feature-value-name> ) || annotation( <feature-value-name> ) ]",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/font-variant-alternates",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-03-13",
			},
			description:
				"For any given character, fonts can provide a variety of alternate glyphs in addition to the default glyph for that character. This property provides control over the selection of these alternate glyphs.",
			restrictions: ["enum"],
		},
		{
			name: "font-variant-caps",
			browsers: ["E79", "FF34", "FFA34", "S9.1", "SM9.3", "C52", "CA52", "O39"],
			values: [
				{
					name: "all-petite-caps",
					description: "Enables display of petite capitals for both upper and lowercase letters.",
				},
				{
					name: "all-small-caps",
					description: "Enables display of small capitals for both upper and lowercase letters.",
				},
				{
					name: "normal",
					description: "None of the features are enabled.",
				},
				{
					name: "petite-caps",
					description: "Enables display of petite capitals.",
				},
				{
					name: "small-caps",
					description:
						"Enables display of small capitals. Small-caps glyphs typically use the form of uppercase letters but are reduced to the size of lowercase letters.",
				},
				{
					name: "titling-caps",
					description: "Enables display of titling capitals.",
				},
				{
					name: "unicase",
					description:
						"Enables display of mixture of small capitals for uppercase letters with normal lowercase letters.",
				},
			],
			syntax: "normal | small-caps | all-small-caps | petite-caps | all-petite-caps | unicase | titling-caps",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/font-variant-caps",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description: "Specifies control over capitalized forms.",
			restrictions: ["enum"],
		},
		{
			name: "font-variant-east-asian",
			browsers: ["E79", "FF34", "FFA34", "S9.1", "SM9.3", "C63", "CA63", "O50"],
			values: [
				{
					name: "full-width",
					description: "Enables rendering of full-width variants.",
				},
				{
					name: "jis04",
					description: "Enables rendering of JIS04 forms.",
				},
				{
					name: "jis78",
					description: "Enables rendering of JIS78 forms.",
				},
				{
					name: "jis83",
					description: "Enables rendering of JIS83 forms.",
				},
				{
					name: "jis90",
					description: "Enables rendering of JIS90 forms.",
				},
				{
					name: "normal",
					description: "None of the features are enabled.",
				},
				{
					name: "proportional-width",
					description: "Enables rendering of proportionally-spaced variants.",
				},
				{
					name: "ruby",
					description: "Enables display of ruby variant glyphs.",
				},
				{
					name: "simplified",
					description: "Enables rendering of simplified forms.",
				},
				{
					name: "traditional",
					description: "Enables rendering of traditional forms.",
				},
			],
			syntax: "normal | [ <east-asian-variant-values> || <east-asian-width-values> || ruby ]",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/font-variant-east-asian",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description: "Allows control of glyph substitute and positioning in East Asian text.",
			restrictions: ["enum"],
		},
		{
			name: "font-variant-ligatures",
			browsers: ["E79", "FF34", "FFA34", "S9.1", "SM9.3", "C34", "CA34", "O21"],
			values: [
				{
					name: "additional-ligatures",
					description: "Enables display of additional ligatures.",
				},
				{
					name: "common-ligatures",
					description: "Enables display of common ligatures.",
				},
				{
					name: "contextual",
					browsers: ["E79", "FF34", "FFA34", "S9.1", "SM9.3", "C34", "CA34", "O21"],
					description: "Enables display of contextual alternates.",
				},
				{
					name: "discretionary-ligatures",
					description: "Enables display of discretionary ligatures.",
				},
				{
					name: "historical-ligatures",
					description: "Enables display of historical ligatures.",
				},
				{
					name: "no-additional-ligatures",
					description: "Disables display of additional ligatures.",
				},
				{
					name: "no-common-ligatures",
					description: "Disables display of common ligatures.",
				},
				{
					name: "no-contextual",
					browsers: ["E79", "FF34", "FFA34", "S9.1", "SM9.3", "C34", "CA34", "O21"],
					description: "Disables display of contextual alternates.",
				},
				{
					name: "no-discretionary-ligatures",
					description: "Disables display of discretionary ligatures.",
				},
				{
					name: "no-historical-ligatures",
					description: "Disables display of historical ligatures.",
				},
				{
					name: "none",
					browsers: ["E79", "FF34", "FFA34", "S9.1", "SM9.3", "C34", "CA34", "O21"],
					description: "Disables all ligatures.",
				},
				{
					name: "normal",
					description: "Implies that the defaults set by the font are used.",
				},
			],
			syntax:
				"normal | none | [ <common-lig-values> || <discretionary-lig-values> || <historical-lig-values> || <contextual-alt-values> ]",
			relevance: 52,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/font-variant-ligatures",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Specifies control over which ligatures are enabled or disabled. A value of 'normal' implies that the defaults set by the font are used.",
			restrictions: ["enum"],
		},
		{
			name: "font-variant-numeric",
			browsers: ["E79", "FF34", "FFA34", "S9.1", "SM9.3", "C52", "CA52", "O39"],
			values: [
				{
					name: "diagonal-fractions",
					description: "Enables display of lining diagonal fractions.",
				},
				{
					name: "lining-nums",
					description: "Enables display of lining numerals.",
				},
				{
					name: "normal",
					description: "None of the features are enabled.",
				},
				{
					name: "oldstyle-nums",
					description: "Enables display of old-style numerals.",
				},
				{
					name: "ordinal",
					description: "Enables display of letter forms used with ordinal numbers.",
				},
				{
					name: "proportional-nums",
					description: "Enables display of proportional numerals.",
				},
				{
					name: "slashed-zero",
					description: "Enables display of slashed zeros.",
				},
				{
					name: "stacked-fractions",
					description: "Enables display of lining stacked fractions.",
				},
				{
					name: "tabular-nums",
					description: "Enables display of tabular numerals.",
				},
			],
			syntax:
				"normal | [ <numeric-figure-values> || <numeric-spacing-values> || <numeric-fraction-values> || ordinal || slashed-zero ]",
			relevance: 52,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/font-variant-numeric",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description: "Specifies control over numerical forms.",
			restrictions: ["enum"],
		},
		{
			name: "font-variant-position",
			browsers: ["FF34", "FFA34", "S9.1", "SM9.3"],
			values: [
				{
					name: "normal",
					description: "None of the features are enabled.",
				},
				{
					name: "sub",
					description: "Enables display of subscript variants (OpenType feature: subs).",
				},
				{
					name: "super",
					description: "Enables display of superscript variants (OpenType feature: sups).",
				},
			],
			syntax: "normal | sub | super",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/font-variant-position",
				},
			],
			baseline: {
				status: "false",
			},
			description: "Specifies the vertical position",
			restrictions: ["enum"],
		},
		{
			name: "font-weight",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C2", "CA18", "IE3", "O3.5"],
			values: [
				{
					name: "100",
					description: "Thin",
				},
				{
					name: "200",
					description: "Extra Light (Ultra Light)",
				},
				{
					name: "300",
					description: "Light",
				},
				{
					name: "400",
					description: "Normal",
				},
				{
					name: "500",
					description: "Medium",
				},
				{
					name: "600",
					description: "Semi Bold (Demi Bold)",
				},
				{
					name: "700",
					description: "Bold",
				},
				{
					name: "800",
					description: "Extra Bold (Ultra Bold)",
				},
				{
					name: "900",
					description: "Black (Heavy)",
				},
				{
					name: "bold",
					description: "Same as 700",
				},
				{
					name: "bolder",
					description: "Specifies the weight of the face bolder than the inherited value.",
				},
				{
					name: "lighter",
					description: "Specifies the weight of the face lighter than the inherited value.",
				},
				{
					name: "normal",
					description: "Same as 400",
				},
			],
			atRule: "@font-face",
			syntax: "<font-weight-absolute>{1,2}",
			relevance: 93,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/font-weight",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Specifies weight of glyphs in the font, their degree of blackness or stroke thickness.",
			restrictions: ["enum"],
		},
		{
			name: "glyph-orientation-horizontal",
			relevance: 50,
			description: "Controls glyph orientation when the inline-progression-direction is horizontal.",
			restrictions: ["angle", "number"],
		},
		{
			name: "glyph-orientation-vertical",
			browsers: ["S4", "SM3.2"],
			values: [
				{
					name: "auto",
					description:
						"Sets the orientation based on the fullwidth or non-fullwidth characters and the most common orientation.",
				},
			],
			relevance: 50,
			baseline: {
				status: "false",
			},
			description: "Controls glyph orientation when the inline-progression-direction is vertical.",
			restrictions: ["angle", "number", "enum"],
		},
		{
			name: "grid-area",
			browsers: ["E16", "FF52", "FFA52", "S10.1", "SM10.3", "C57", "CA57", "O44"],
			values: [
				{
					name: "auto",
					description:
						"The property contributes nothing to the grid item's placement, indicating auto-placement, an automatic span, or a default span of one.",
				},
				{
					name: "span",
					description:
						"Contributes a grid span to the grid item's placement such that the corresponding edge of the grid item's grid area is N lines from its opposite edge.",
				},
			],
			syntax: "<grid-line> [ / <grid-line> ]{0,3}",
			relevance: 59,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/grid-area",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-10-17",
				baseline_high_date: "2020-04-17",
			},
			description:
				"Determine a grid item's size and location within the grid by contributing a line, a span, or nothing (automatic) to its grid placement. Shorthand for 'grid-row-start', 'grid-column-start', 'grid-row-end', and 'grid-column-end'.",
			restrictions: ["identifier", "integer"],
		},
		{
			name: "grid",
			browsers: ["E16", "FF52", "FFA52", "S10.1", "SM10.3", "C57", "CA57", "O44"],
			syntax:
				"<'grid-template'> | <'grid-template-rows'> / [ auto-flow && dense? ] <'grid-auto-columns'>? | [ auto-flow && dense? ] <'grid-auto-rows'>? / <'grid-template-columns'>",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/grid",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-10-17",
				baseline_high_date: "2020-04-17",
			},
			description:
				"The grid CSS property is a shorthand property that sets all of the explicit grid properties ('grid-template-rows', 'grid-template-columns', and 'grid-template-areas'), and all the implicit grid properties ('grid-auto-rows', 'grid-auto-columns', and 'grid-auto-flow'), in a single declaration.",
			restrictions: ["identifier", "length", "percentage", "string", "enum"],
		},
		{
			name: "grid-auto-columns",
			browsers: ["E16", "FF70", "FFA79", "S10.1", "SM10.3", "C57", "CA57", "IE10", "O44"],
			values: [
				{
					name: "min-content",
					description: "Represents the largest min-content contribution of the grid items occupying the grid track.",
				},
				{
					name: "max-content",
					description: "Represents the largest max-content contribution of the grid items occupying the grid track.",
				},
				{
					name: "auto",
					description:
						"As a maximum, identical to 'max-content'. As a minimum, represents the largest minimum size (as specified by min-width/min-height) of the grid items occupying the grid track.",
				},
				{
					name: "minmax()",
					description: "Defines a size range greater than or equal to min and less than or equal to max.",
				},
			],
			syntax: "<track-size>+",
			relevance: 52,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/grid-auto-columns",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-07-28",
				baseline_high_date: "2023-01-28",
			},
			description: "Specifies the size of implicitly created columns.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "grid-auto-flow",
			browsers: ["E16", "FF52", "FFA52", "S10.1", "SM10.3", "C57", "CA57", "O44"],
			values: [
				{
					name: "row",
					description:
						"The auto-placement algorithm places items by filling each row in turn, adding new rows as necessary.",
				},
				{
					name: "column",
					description:
						"The auto-placement algorithm places items by filling each column in turn, adding new columns as necessary.",
				},
				{
					name: "dense",
					description:
						'If specified, the auto-placement algorithm uses a "dense" packing algorithm, which attempts to fill in holes earlier in the grid if smaller items come up later.',
				},
			],
			syntax: "[ row | column ] || dense",
			relevance: 55,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/grid-auto-flow",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-10-17",
				baseline_high_date: "2020-04-17",
			},
			description:
				"Controls how the auto-placement algorithm works, specifying exactly how auto-placed items get flowed into the grid.",
			restrictions: ["enum"],
		},
		{
			name: "grid-auto-rows",
			browsers: ["E16", "FF70", "FFA79", "S10.1", "SM10.3", "C57", "CA57", "IE10", "O44"],
			values: [
				{
					name: "min-content",
					description: "Represents the largest min-content contribution of the grid items occupying the grid track.",
				},
				{
					name: "max-content",
					description: "Represents the largest max-content contribution of the grid items occupying the grid track.",
				},
				{
					name: "auto",
					description:
						"As a maximum, identical to 'max-content'. As a minimum, represents the largest minimum size (as specified by min-width/min-height) of the grid items occupying the grid track.",
				},
				{
					name: "minmax()",
					description: "Defines a size range greater than or equal to min and less than or equal to max.",
				},
			],
			syntax: "<track-size>+",
			relevance: 53,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/grid-auto-rows",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-07-28",
				baseline_high_date: "2023-01-28",
			},
			description: "Specifies the size of implicitly created rows.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "grid-column",
			browsers: ["E16", "FF52", "FFA52", "S10.1", "SM10.3", "C57", "CA57", "O44"],
			values: [
				{
					name: "auto",
					description:
						"The property contributes nothing to the grid item's placement, indicating auto-placement, an automatic span, or a default span of one.",
				},
				{
					name: "span",
					description:
						"Contributes a grid span to the grid item's placement such that the corresponding edge of the grid item's grid area is N lines from its opposite edge.",
				},
			],
			syntax: "<grid-line> [ / <grid-line> ]?",
			relevance: 61,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/grid-column",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-10-17",
				baseline_high_date: "2020-04-17",
			},
			description: "Shorthand for 'grid-column-start' and 'grid-column-end'.",
			restrictions: ["identifier", "integer", "enum"],
		},
		{
			name: "grid-column-end",
			browsers: ["E16", "FF52", "FFA52", "S10.1", "SM10.3", "C57", "CA57", "O44"],
			values: [
				{
					name: "auto",
					description:
						"The property contributes nothing to the grid item's placement, indicating auto-placement, an automatic span, or a default span of one.",
				},
				{
					name: "span",
					description:
						"Contributes a grid span to the grid item's placement such that the corresponding edge of the grid item's grid area is N lines from its opposite edge.",
				},
			],
			syntax: "<grid-line>",
			relevance: 52,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/grid-column-end",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-10-17",
				baseline_high_date: "2020-04-17",
			},
			description:
				"Determine a grid item's size and location within the grid by contributing a line, a span, or nothing (automatic) to its grid placement.",
			restrictions: ["identifier", "integer", "enum"],
		},
		{
			name: "grid-column-gap",
			browsers: ["FF52", "C57", "S10.1", "O44"],
			status: "obsolete",
			syntax: "<length-percentage>",
			relevance: 4,
			description: "Specifies the gutters between grid columns. Replaced by 'column-gap' property.",
			restrictions: ["length"],
		},
		{
			name: "grid-column-start",
			browsers: ["E16", "FF52", "FFA52", "S10.1", "SM10.3", "C57", "CA57", "O44"],
			values: [
				{
					name: "auto",
					description:
						"The property contributes nothing to the grid item's placement, indicating auto-placement, an automatic span, or a default span of one.",
				},
				{
					name: "span",
					description:
						"Contributes a grid span to the grid item's placement such that the corresponding edge of the grid item's grid area is N lines from its opposite edge.",
				},
			],
			syntax: "<grid-line>",
			relevance: 53,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/grid-column-start",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-10-17",
				baseline_high_date: "2020-04-17",
			},
			description:
				"Determine a grid item's size and location within the grid by contributing a line, a span, or nothing (automatic) to its grid placement.",
			restrictions: ["identifier", "integer", "enum"],
		},
		{
			name: "grid-gap",
			browsers: ["FF52", "C57", "S10.1", "O44"],
			status: "obsolete",
			syntax: "<'grid-row-gap'> <'grid-column-gap'>?",
			relevance: 9,
			description:
				"Shorthand that specifies the gutters between grid columns and grid rows in one declaration. Replaced by 'gap' property.",
			restrictions: ["length"],
		},
		{
			name: "grid-row",
			browsers: ["E16", "FF52", "FFA52", "S10.1", "SM10.3", "C57", "CA57", "O44"],
			values: [
				{
					name: "auto",
					description:
						"The property contributes nothing to the grid item's placement, indicating auto-placement, an automatic span, or a default span of one.",
				},
				{
					name: "span",
					description:
						"Contributes a grid span to the grid item's placement such that the corresponding edge of the grid item's grid area is N lines from its opposite edge.",
				},
			],
			syntax: "<grid-line> [ / <grid-line> ]?",
			relevance: 58,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/grid-row",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-10-17",
				baseline_high_date: "2020-04-17",
			},
			description: "Shorthand for 'grid-row-start' and 'grid-row-end'.",
			restrictions: ["identifier", "integer", "enum"],
		},
		{
			name: "grid-row-end",
			browsers: ["E16", "FF52", "FFA52", "S10.1", "SM10.3", "C57", "CA57", "O44"],
			values: [
				{
					name: "auto",
					description:
						"The property contributes nothing to the grid item's placement, indicating auto-placement, an automatic span, or a default span of one.",
				},
				{
					name: "span",
					description:
						"Contributes a grid span to the grid item's placement such that the corresponding edge of the grid item's grid area is N lines from its opposite edge.",
				},
			],
			syntax: "<grid-line>",
			relevance: 52,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/grid-row-end",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-10-17",
				baseline_high_date: "2020-04-17",
			},
			description:
				"Determine a grid item's size and location within the grid by contributing a line, a span, or nothing (automatic) to its grid placement.",
			restrictions: ["identifier", "integer", "enum"],
		},
		{
			name: "grid-row-gap",
			browsers: ["FF52", "C57", "S10.1", "O44"],
			status: "obsolete",
			syntax: "<length-percentage>",
			relevance: 2,
			description: "Specifies the gutters between grid rows. Replaced by 'row-gap' property.",
			restrictions: ["length"],
		},
		{
			name: "grid-row-start",
			browsers: ["E16", "FF52", "FFA52", "S10.1", "SM10.3", "C57", "CA57", "O44"],
			values: [
				{
					name: "auto",
					description:
						"The property contributes nothing to the grid item's placement, indicating auto-placement, an automatic span, or a default span of one.",
				},
				{
					name: "span",
					description:
						"Contributes a grid span to the grid item's placement such that the corresponding edge of the grid item's grid area is N lines from its opposite edge.",
				},
			],
			syntax: "<grid-line>",
			relevance: 53,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/grid-row-start",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-10-17",
				baseline_high_date: "2020-04-17",
			},
			description:
				"Determine a grid item's size and location within the grid by contributing a line, a span, or nothing (automatic) to its grid placement.",
			restrictions: ["identifier", "integer", "enum"],
		},
		{
			name: "grid-template",
			browsers: ["E16", "FF52", "FFA52", "S10.1", "SM10.3", "C57", "CA57", "O44"],
			values: [
				{
					name: "none",
					description: "Sets all three properties to their initial values.",
				},
				{
					name: "min-content",
					description: "Represents the largest min-content contribution of the grid items occupying the grid track.",
				},
				{
					name: "max-content",
					description: "Represents the largest max-content contribution of the grid items occupying the grid track.",
				},
				{
					name: "auto",
					description:
						"As a maximum, identical to 'max-content'. As a minimum, represents the largest minimum size (as specified by min-width/min-height) of the grid items occupying the grid track.",
				},
				{
					name: "subgrid",
					description:
						"Sets 'grid-template-rows' and 'grid-template-columns' to 'subgrid', and 'grid-template-areas' to its initial value.",
				},
				{
					name: "minmax()",
					description: "Defines a size range greater than or equal to min and less than or equal to max.",
				},
				{
					name: "repeat()",
					description:
						"Represents a repeated fragment of the track list, allowing a large number of columns or rows that exhibit a recurring pattern to be written in a more compact form.",
				},
			],
			syntax:
				"none | [ <'grid-template-rows'> / <'grid-template-columns'> ] | [ <line-names>? <string> <track-size>? <line-names>? ]+ [ / <explicit-track-list> ]?",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/grid-template",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-10-17",
				baseline_high_date: "2020-04-17",
			},
			description:
				"Shorthand for setting grid-template-columns, grid-template-rows, and grid-template-areas in a single declaration.",
			restrictions: ["identifier", "length", "percentage", "string", "enum"],
		},
		{
			name: "grid-template-areas",
			browsers: ["E16", "FF52", "FFA52", "S10.1", "SM10.3", "C57", "CA57", "O44"],
			values: [
				{
					name: "none",
					description: "The grid container doesn't define any named grid areas.",
				},
			],
			syntax: "none | <string>+",
			relevance: 55,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/grid-template-areas",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-10-17",
				baseline_high_date: "2020-04-17",
			},
			description:
				"Specifies named grid areas, which are not associated with any particular grid item, but can be referenced from the grid-placement properties.",
			restrictions: ["string"],
		},
		{
			name: "grid-template-columns",
			browsers: ["E16", "FF52", "FFA52", "S10.1", "SM10.3", "C57", "CA57", "IE10", "O44"],
			values: [
				{
					name: "none",
					description: "There is no explicit grid; any rows/columns will be implicitly generated.",
				},
				{
					name: "min-content",
					description: "Represents the largest min-content contribution of the grid items occupying the grid track.",
				},
				{
					name: "max-content",
					description: "Represents the largest max-content contribution of the grid items occupying the grid track.",
				},
				{
					name: "auto",
					description:
						"As a maximum, identical to 'max-content'. As a minimum, represents the largest minimum size (as specified by min-width/min-height) of the grid items occupying the grid track.",
				},
				{
					name: "subgrid",
					description: "Indicates that the grid will align to its parent grid in that axis.",
				},
				{
					name: "minmax()",
					description: "Defines a size range greater than or equal to min and less than or equal to max.",
				},
				{
					name: "repeat()",
					description:
						"Represents a repeated fragment of the track list, allowing a large number of columns or rows that exhibit a recurring pattern to be written in a more compact form.",
				},
			],
			syntax: "none | <track-list> | <auto-track-list> | subgrid <line-name-list>?",
			relevance: 70,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/grid-template-columns",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-10-17",
				baseline_high_date: "2020-04-17",
			},
			description: "specifies, as a space-separated track list, the line names and track sizing functions of the grid.",
			restrictions: ["identifier", "length", "percentage", "enum"],
		},
		{
			name: "grid-template-rows",
			browsers: ["E16", "FF52", "FFA52", "S10.1", "SM10.3", "C57", "CA57", "IE10", "O44"],
			values: [
				{
					name: "none",
					description: "There is no explicit grid; any rows/columns will be implicitly generated.",
				},
				{
					name: "min-content",
					description: "Represents the largest min-content contribution of the grid items occupying the grid track.",
				},
				{
					name: "max-content",
					description: "Represents the largest max-content contribution of the grid items occupying the grid track.",
				},
				{
					name: "auto",
					description:
						"As a maximum, identical to 'max-content'. As a minimum, represents the largest minimum size (as specified by min-width/min-height) of the grid items occupying the grid track.",
				},
				{
					name: "subgrid",
					description: "Indicates that the grid will align to its parent grid in that axis.",
				},
				{
					name: "minmax()",
					description: "Defines a size range greater than or equal to min and less than or equal to max.",
				},
				{
					name: "repeat()",
					description:
						"Represents a repeated fragment of the track list, allowing a large number of columns or rows that exhibit a recurring pattern to be written in a more compact form.",
				},
			],
			syntax: "none | <track-list> | <auto-track-list> | subgrid <line-name-list>?",
			relevance: 61,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/grid-template-rows",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-10-17",
				baseline_high_date: "2020-04-17",
			},
			description: "specifies, as a space-separated track list, the line names and track sizing functions of the grid.",
			restrictions: ["identifier", "length", "percentage", "string", "enum"],
		},
		{
			name: "height",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
			values: [
				{
					name: "auto",
					description: "The height depends on the values of other properties.",
				},
				{
					name: "fit-content",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
					description: "Use the fit-content inline size or fit-content block size, as appropriate to the writing mode.",
				},
				{
					name: "max-content",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
					description: "Use the max-content inline size or max-content block size, as appropriate to the writing mode.",
				},
				{
					name: "min-content",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
					description: "Use the min-content inline size or min-content block size, as appropriate to the writing mode.",
				},
			],
			syntax:
				"auto | <length-percentage [0,∞]> | min-content | max-content | fit-content | fit-content(<length-percentage [0,∞]>) | <calc-size()> | <anchor-size()>",
			relevance: 95,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/height",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Specifies the height of the content area, padding area or border area (depending on 'box-sizing') of certain boxes.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "hyphens",
			browsers: ["E79", "FF43", "FFA43", "S17", "SM17", "C55", "CA55", "IE10", "O42"],
			values: [
				{
					name: "auto",
					description:
						"Conditional hyphenation characters inside a word, if present, take priority over automatic resources when determining hyphenation points within the word.",
				},
				{
					name: "manual",
					description:
						"Words are only broken at line breaks where there are characters inside the word that suggest line break opportunities",
				},
				{
					name: "none",
					description:
						"Words are not broken at line breaks, even if characters inside the word suggest line break points.",
				},
			],
			syntax: "none | manual | auto",
			relevance: 55,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/hyphens",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-09-18",
			},
			description: "Controls whether hyphenation is allowed to create more break opportunities within a line of text.",
			restrictions: ["enum"],
		},
		{
			name: "image-orientation",
			browsers: ["E81", "FF26", "FFA26", "S13.1", "SM13.4", "C81", "CA81", "O67"],
			values: [
				{
					name: "flip",
					description:
						"After rotating by the precededing angle, the image is flipped horizontally. Defaults to 0deg if the angle is ommitted.",
				},
				{
					name: "from-image",
					description:
						"If the image has an orientation specified in its metadata, such as EXIF, this value computes to the angle that the metadata specifies is necessary to correctly orient the image.",
				},
			],
			syntax: "from-image | <angle> | [ <angle>? flip ]",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/image-orientation",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-04-13",
				baseline_high_date: "2022-10-13",
			},
			description: "Specifies an orthogonal rotation to be applied to an image before it is laid out.",
			restrictions: ["angle"],
		},
		{
			name: "image-rendering",
			browsers: ["E79", "FF3.6", "FFA4", "S6", "SM6", "C13", "CA18", "O15"],
			values: [
				{
					name: "auto",
					description: "The image should be scaled with an algorithm that maximizes the appearance of the image.",
				},
				{
					name: "crisp-edges",
					description:
						"The image must be scaled with an algorithm that preserves contrast and edges in the image, and which does not smooth colors or introduce blur to the image in the process.",
				},
				{
					name: "-moz-crisp-edges",
					browsers: ["E79", "FF3.6", "FFA4", "S6", "SM6", "C13", "CA18", "O15"],
				},
				{
					name: "optimizeQuality",
					description: "Deprecated.",
				},
				{
					name: "optimizeSpeed",
					description: "Deprecated.",
				},
				{
					name: "pixelated",
					description:
						"When scaling the image up, the 'nearest neighbor' or similar algorithm must be used, so that the image appears to be simply composed of very large pixels.",
				},
			],
			syntax: "auto | crisp-edges | pixelated | smooth",
			relevance: 53,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/image-rendering",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Provides a hint to the user-agent about what aspects of an image are most important to preserve when the image is scaled, to aid the user-agent in the choice of an appropriate scaling algorithm.",
			restrictions: ["enum"],
		},
		{
			name: "ime-mode",
			browsers: ["FF3", "FFA4", "IE5"],
			values: [
				{
					name: "active",
					description:
						"The input method editor is initially active; text entry is performed using it unless the user specifically dismisses it.",
				},
				{
					name: "auto",
					description: "No change is made to the current input method editor state. This is the default.",
				},
				{
					name: "disabled",
					description: "The input method editor is disabled and may not be activated by the user.",
				},
				{
					name: "inactive",
					description: "The input method editor is initially inactive, but the user may activate it if they wish.",
				},
				{
					name: "normal",
					description:
						"The IME state should be normal; this value can be used in a user style sheet to override the page setting.",
				},
			],
			status: "obsolete",
			syntax: "auto | normal | active | inactive | disabled",
			relevance: 0,
			baseline: {
				status: "false",
			},
			description: "Controls the state of the input method editor for text fields.",
			restrictions: ["enum"],
		},
		{
			name: "inline-size",
			browsers: ["E79", "FF41", "FFA41", "S12.1", "SM12.2", "C57", "CA57", "O44"],
			values: [
				{
					name: "auto",
					description: "Depends on the values of other properties.",
				},
			],
			syntax: "<'width'>",
			relevance: 54,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/inline-size",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description: "Size of an element in the direction specified by 'writing-mode'.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "isolation",
			browsers: ["E79", "FF36", "FFA36", "S8", "SM8", "C41", "CA41", "O30"],
			values: [
				{
					name: "auto",
					description:
						"Elements are not isolated unless an operation is applied that causes the creation of a stacking context.",
				},
				{
					name: "isolate",
					description: "In CSS will turn the element into a stacking context.",
				},
			],
			syntax: "auto | isolate",
			relevance: 55,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/isolation",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"In CSS setting to 'isolate' will turn the element into a stacking context. In SVG, it defines whether an element is isolated or not.",
			restrictions: ["enum"],
		},
		{
			name: "justify-content",
			browsers: ["E12", "FF20", "FFA20", "S9", "SM9", "C29", "CA29", "IE11", "O12.1"],
			values: [
				{
					name: "center",
					description: "Flex items are packed toward the center of the line.",
				},
				{
					name: "start",
					description:
						"The items are packed flush to each other toward the start edge of the alignment container in the main axis.",
				},
				{
					name: "end",
					description:
						"The items are packed flush to each other toward the end edge of the alignment container in the main axis.",
				},
				{
					name: "left",
					description:
						"The items are packed flush to each other toward the left edge of the alignment container in the main axis.",
				},
				{
					name: "right",
					description:
						"The items are packed flush to each other toward the right edge of the alignment container in the main axis.",
				},
				{
					name: "safe",
					description:
						"If the size of the item overflows the alignment container, the item is instead aligned as if the alignment mode were start.",
				},
				{
					name: "unsafe",
					description:
						"Regardless of the relative sizes of the item and alignment container, the given alignment value is honored.",
				},
				{
					name: "stretch",
					description:
						"If the combined size of the alignment subjects is less than the size of the alignment container, any auto-sized alignment subjects have their size increased equally (not proportionally), while still respecting the constraints imposed by max-height/max-width (or equivalent functionality), so that the combined size exactly fills the alignment container.",
				},
				{
					name: "space-evenly",
					description: "The items are evenly distributed within the alignment container along the main axis.",
				},
				{
					name: "flex-end",
					description: "Flex items are packed toward the end of the line.",
				},
				{
					name: "flex-start",
					description: "Flex items are packed toward the start of the line.",
				},
				{
					name: "space-around",
					description: "Flex items are evenly distributed in the line, with half-size spaces on either end.",
				},
				{
					name: "space-between",
					description: "Flex items are evenly distributed in the line.",
				},
				{
					name: "baseline",
					description: "Specifies participation in first-baseline alignment.",
				},
				{
					name: "first baseline",
					description: "Specifies participation in first-baseline alignment.",
				},
				{
					name: "last baseline",
					description: "Specifies participation in last-baseline alignment.",
				},
			],
			syntax: "normal | <content-distribution> | <overflow-position>? [ <content-position> | left | right ]",
			relevance: 89,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/justify-content",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description: "Aligns flex items along the main axis of the current line of the flex container.",
			restrictions: ["enum"],
		},
		{
			name: "kerning",
			values: [
				{
					name: "auto",
					description:
						"Indicates that the user agent should adjust inter-glyph spacing based on kerning tables that are included in the font that will be used.",
				},
			],
			relevance: 50,
			description:
				"Indicates whether the user agent should adjust inter-glyph spacing based on kerning tables that are included in the relevant font or instead disable auto-kerning and set inter-character spacing to a specific length.",
			restrictions: ["length", "enum"],
		},
		{
			name: "left",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE5.5", "O5"],
			values: [
				{
					name: "auto",
					description:
						"For non-replaced elements, the effect of this value depends on which of related properties have the value 'auto' as well",
				},
			],
			syntax: "<length> | <percentage> | auto",
			relevance: 94,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/left",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Specifies how far an absolutely positioned box's left margin edge is offset to the right of the left edge of the box's 'containing block'.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "letter-spacing",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			values: [
				{
					name: "normal",
					description: "The spacing is the normal spacing for the current font. It is typically zero-length.",
				},
			],
			syntax: "normal | <length>",
			relevance: 82,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/letter-spacing",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Specifies the minimum, maximum, and optimal spacing between grapheme clusters.",
			restrictions: ["length"],
		},
		{
			name: "lighting-color",
			browsers: ["E12", "FF3", "FFA4", "S6", "SM6", "C5", "CA18", "IE11", "O15"],
			syntax: "<color>",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/lighting-color",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Defines the color of the light source for filter primitives 'feDiffuseLighting' and 'feSpecularLighting'.",
			restrictions: ["color"],
		},
		{
			name: "line-break",
			browsers: ["E14", "FF69", "FFA79", "S11", "SM11", "C58", "CA58", "IE5.5", "O45"],
			values: [
				{
					name: "auto",
					description:
						"The UA determines the set of line-breaking restrictions to use for CJK scripts, and it may vary the restrictions based on the length of the line; e.g., use a less restrictive set of line-break rules for short lines.",
				},
				{
					name: "loose",
					description:
						"Breaks text using the least restrictive set of line-breaking rules. Typically used for short lines, such as in newspapers.",
				},
				{
					name: "normal",
					description: "Breaks text using the most common set of line-breaking rules.",
				},
				{
					name: "strict",
					description: "Breaks CJK scripts using a more restrictive set of line-breaking rules than 'normal'.",
				},
				{
					name: "anywhere",
					description:
						"There is a soft wrap opportunity around every typographic character unit, including around any punctuation character or preserved white spaces, or in the middle of words, disregarding any prohibition against line breaks, even those introduced by characters with the GL, WJ, or ZWJ line breaking classes or mandated by the word-break property.",
				},
			],
			syntax: "auto | loose | normal | strict | anywhere",
			relevance: 52,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/line-break",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-07-28",
				baseline_high_date: "2023-01-28",
			},
			description: "Specifies what set of line breaking restrictions are in effect within the element.",
			restrictions: ["enum"],
		},
		{
			name: "line-height",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
			values: [
				{
					name: "normal",
					description:
						"Tells user agents to set the computed value to a 'reasonable' value based on the font size of the element.",
				},
			],
			syntax: "normal | <number> | <length> | <percentage>",
			relevance: 92,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/line-height",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Determines the block-progression dimension of the text content area of an inline box.",
			restrictions: ["number", "length", "percentage"],
		},
		{
			name: "list-style",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
			values: [
				{
					name: "armenian",
				},
				{
					name: "circle",
					description: "A hollow circle.",
				},
				{
					name: "decimal",
				},
				{
					name: "decimal-leading-zero",
				},
				{
					name: "disc",
					description: "A filled circle.",
				},
				{
					name: "georgian",
				},
				{
					name: "inside",
					description:
						"The marker box is outside the principal block box, as described in the section on the ::marker pseudo-element below.",
				},
				{
					name: "lower-alpha",
				},
				{
					name: "lower-greek",
				},
				{
					name: "lower-latin",
				},
				{
					name: "lower-roman",
				},
				{
					name: "none",
				},
				{
					name: "outside",
					description:
						"The ::marker pseudo-element is an inline element placed immediately before all ::before pseudo-elements in the principal block box, after which the element's content flows.",
				},
				{
					name: "square",
					description: "A filled square.",
				},
				{
					name: "symbols()",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
					description: "Allows a counter style to be defined inline.",
				},
				{
					name: "upper-alpha",
				},
				{
					name: "upper-latin",
				},
				{
					name: "upper-roman",
				},
				{
					name: "url()",
				},
			],
			syntax: "<'list-style-type'> || <'list-style-position'> || <'list-style-image'>",
			relevance: 83,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/list-style",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Shorthand for setting 'list-style-type', 'list-style-position' and 'list-style-image'",
			restrictions: ["image", "enum", "url"],
		},
		{
			name: "list-style-image",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
			values: [
				{
					name: "none",
					description: "The default contents of the of the list item's marker are given by 'list-style-type' instead.",
				},
			],
			syntax: "<image> | none",
			relevance: 52,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/list-style-image",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Sets the image that will be used as the list item marker. When the image is available, it will replace the marker set with the 'list-style-type' marker.",
			restrictions: ["image"],
		},
		{
			name: "list-style-position",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			values: [
				{
					name: "inside",
					description:
						"The marker box is outside the principal block box, as described in the section on the ::marker pseudo-element below.",
				},
				{
					name: "outside",
					description:
						"The ::marker pseudo-element is an inline element placed immediately before all ::before pseudo-elements in the principal block box, after which the element's content flows.",
				},
			],
			syntax: "inside | outside",
			relevance: 55,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/list-style-position",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Specifies the position of the '::marker' pseudo-element's box in the list item.",
			restrictions: ["enum"],
		},
		{
			name: "list-style-type",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			values: [
				{
					name: "armenian",
					description: "Traditional uppercase Armenian numbering.",
				},
				{
					name: "circle",
					description: "A hollow circle.",
				},
				{
					name: "decimal",
					description: "Western decimal numbers.",
				},
				{
					name: "decimal-leading-zero",
					description: "Decimal numbers padded by initial zeros.",
				},
				{
					name: "disc",
					description: "A filled circle.",
				},
				{
					name: "georgian",
					description: "Traditional Georgian numbering.",
				},
				{
					name: "lower-alpha",
					description: "Lowercase ASCII letters.",
				},
				{
					name: "lower-greek",
					description: "Lowercase classical Greek.",
				},
				{
					name: "lower-latin",
					description: "Lowercase ASCII letters.",
				},
				{
					name: "lower-roman",
					description: "Lowercase ASCII Roman numerals.",
				},
				{
					name: "none",
					description: "No marker",
				},
				{
					name: "square",
					description: "A filled square.",
				},
				{
					name: "symbols()",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
					description: "Allows a counter style to be defined inline.",
				},
				{
					name: "upper-alpha",
					description: "Uppercase ASCII letters.",
				},
				{
					name: "upper-latin",
					description: "Uppercase ASCII letters.",
				},
				{
					name: "upper-roman",
					description: "Uppercase ASCII Roman numerals.",
				},
			],
			syntax: "<counter-style> | <string> | none",
			relevance: 72,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/list-style-type",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Used to construct the default contents of a list item's marker",
			restrictions: ["enum", "string"],
		},
		{
			name: "margin",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE3", "O3.5"],
			values: [
				{
					name: "auto",
				},
			],
			syntax: "<'margin-top'>{1,4}",
			relevance: 95,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/margin",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Shorthand property to set values for the thickness of the margin area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. Negative values for margin properties are allowed, but there may be implementation-specific limits.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "margin-block-end",
			browsers: ["E79", "FF41", "FFA41", "S12.1", "SM12.2", "C69", "CA69", "O56"],
			values: [
				{
					name: "auto",
				},
			],
			syntax: "<'margin-top'>",
			relevance: 55,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/margin-block-end",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Logical 'margin-bottom'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "margin-block-start",
			browsers: ["E79", "FF41", "FFA41", "S12.1", "SM12.2", "C69", "CA69", "O56"],
			values: [
				{
					name: "auto",
				},
			],
			syntax: "<'margin-top'>",
			relevance: 53,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/margin-block-start",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Logical 'margin-top'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "margin-bottom",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE3", "O3.5"],
			values: [
				{
					name: "auto",
				},
			],
			syntax: "<length-percentage> | auto",
			relevance: 91,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/margin-bottom",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Shorthand property to set values for the thickness of the margin area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. Negative values for margin properties are allowed, but there may be implementation-specific limits..",
			restrictions: ["length", "percentage"],
		},
		{
			name: "margin-inline-end",
			browsers: ["E79", "FF41", "FFA41", "S12.1", "SM12.2", "C69", "CA69", "O56"],
			values: [
				{
					name: "auto",
				},
			],
			syntax: "<'margin-top'>",
			relevance: 58,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/margin-inline-end",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Logical 'margin-right'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "margin-inline-start",
			browsers: ["E79", "FF41", "FFA41", "S12.1", "SM12.2", "C69", "CA69", "O56"],
			values: [
				{
					name: "auto",
				},
			],
			syntax: "<'margin-top'>",
			relevance: 59,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/margin-inline-start",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Logical 'margin-left'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "margin-left",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE3", "O3.5"],
			values: [
				{
					name: "auto",
				},
			],
			syntax: "<length-percentage> | auto",
			relevance: 91,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/margin-left",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Shorthand property to set values for the thickness of the margin area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. Negative values for margin properties are allowed, but there may be implementation-specific limits..",
			restrictions: ["length", "percentage"],
		},
		{
			name: "margin-right",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE3", "O3.5"],
			values: [
				{
					name: "auto",
				},
			],
			syntax: "<length-percentage> | auto",
			relevance: 91,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/margin-right",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Shorthand property to set values for the thickness of the margin area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. Negative values for margin properties are allowed, but there may be implementation-specific limits..",
			restrictions: ["length", "percentage"],
		},
		{
			name: "margin-top",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE3", "O3.5"],
			values: [
				{
					name: "auto",
				},
			],
			syntax: "<length-percentage> | auto",
			relevance: 93,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/margin-top",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Shorthand property to set values for the thickness of the margin area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. Negative values for margin properties are allowed, but there may be implementation-specific limits..",
			restrictions: ["length", "percentage"],
		},
		{
			name: "marker",
			browsers: ["E15", "FF3", "FFA4", "S4", "SM3.2", "C1", "CA18", "O15"],
			values: [
				{
					name: "none",
					description: "Indicates that no marker symbol will be drawn at the given vertex or vertices.",
				},
				{
					name: "url()",
					description: "Indicates that the <marker> element referenced will be used.",
				},
			],
			syntax: "none | <url>",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/marker",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-04-05",
				baseline_high_date: "2019-10-05",
			},
			description:
				"Specifies the marker symbol that shall be used for all points on the sets the value for all vertices on the given 'path' element or basic shape.",
			restrictions: ["url"],
		},
		{
			name: "marker-end",
			browsers: ["E15", "FF3", "FFA4", "S4", "SM3.2", "C1", "CA18", "O15"],
			values: [
				{
					name: "none",
					description: "Indicates that no marker symbol will be drawn at the given vertex or vertices.",
				},
				{
					name: "url()",
					description: "Indicates that the <marker> element referenced will be used.",
				},
			],
			syntax: "none | <url>",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/marker-end",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-04-05",
				baseline_high_date: "2019-10-05",
			},
			description: "Specifies the marker that will be drawn at the last vertices of the given markable element.",
			restrictions: ["url"],
		},
		{
			name: "marker-mid",
			browsers: ["E15", "FF3", "FFA4", "S4", "SM3.2", "C1", "CA18", "O15"],
			values: [
				{
					name: "none",
					description: "Indicates that no marker symbol will be drawn at the given vertex or vertices.",
				},
				{
					name: "url()",
					description: "Indicates that the <marker> element referenced will be used.",
				},
			],
			syntax: "none | <url>",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/marker-mid",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-04-05",
				baseline_high_date: "2019-10-05",
			},
			description: "Specifies the marker that will be drawn at all vertices except the first and last.",
			restrictions: ["url"],
		},
		{
			name: "marker-start",
			browsers: ["E15", "FF3", "FFA4", "S4", "SM3.2", "C1", "CA18", "O15"],
			values: [
				{
					name: "none",
					description: "Indicates that no marker symbol will be drawn at the given vertex or vertices.",
				},
				{
					name: "url()",
					description: "Indicates that the <marker> element referenced will be used.",
				},
			],
			syntax: "none | <url>",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/marker-start",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-04-05",
				baseline_high_date: "2019-10-05",
			},
			description: "Specifies the marker that will be drawn at the first vertices of the given markable element.",
			restrictions: ["url"],
		},
		{
			name: "mask-image",
			browsers: ["E120", "FF53", "FFA53", "S15.4", "SM15.4", "C120", "CA120", "O15"],
			values: [
				{
					name: "none",
					description: "Counts as a transparent black image layer.",
				},
				{
					name: "url()",
					description: "Reference to a <mask element or to a CSS image.",
				},
			],
			syntax: "<mask-reference>#",
			relevance: 59,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/mask-image",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-12-07",
			},
			description: "Sets the mask layer image of an element.",
			restrictions: ["url", "image", "enum"],
		},
		{
			name: "mask-mode",
			browsers: ["E120", "FF53", "FFA53", "S15.4", "SM15.4", "C120", "CA120", "O106"],
			values: [
				{
					name: "alpha",
					description: "Alpha values of the mask layer image should be used as the mask values.",
				},
				{
					name: "auto",
					description: "Use alpha values if 'mask-image' is an image, luminance if a <mask> element or a CSS image.",
				},
				{
					name: "luminance",
					description: "Luminance values of the mask layer image should be used as the mask values.",
				},
			],
			syntax: "<masking-mode>#",
			relevance: 51,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/mask-mode",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-12-07",
			},
			description: "Indicates whether the mask layer image is treated as luminance mask or alpha mask.",
			restrictions: ["url", "image", "enum"],
		},
		{
			name: "mask-origin",
			browsers: ["E120", "FF53", "FFA53", "S15.4", "SM15.4", "C120", "CA120", "O106"],
			syntax: "<coord-box>#",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/mask-origin",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-12-07",
			},
			description: "Specifies the mask positioning area.",
			restrictions: ["geometry-box", "enum"],
		},
		{
			name: "mask-position",
			browsers: ["E120", "FF53", "FFA53", "S15.4", "SM15.4", "C120", "CA120", "O106"],
			syntax: "<position>#",
			relevance: 55,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/mask-position",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-12-07",
			},
			description: "Specifies how mask layer images are positioned.",
			restrictions: ["position", "length", "percentage"],
		},
		{
			name: "mask-repeat",
			browsers: ["E120", "FF53", "FFA53", "S15.4", "SM15.4", "C120", "CA120", "O106"],
			syntax: "<repeat-style>#",
			relevance: 54,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/mask-repeat",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-12-07",
			},
			description: "Specifies how mask layer images are tiled after they have been sized and positioned.",
			restrictions: ["repeat"],
		},
		{
			name: "mask-size",
			browsers: ["E120", "FF53", "FFA53", "S15.4", "SM15.4", "C120", "CA120", "O106"],
			values: [
				{
					name: "auto",
					description:
						"Resolved by using the image's intrinsic ratio and the size of the other dimension, or failing that, using the image's intrinsic size, or failing that, treating it as 100%.",
				},
				{
					name: "contain",
					description:
						"Scale the image, while preserving its intrinsic aspect ratio (if any), to the largest size such that both its width and its height can fit inside the background positioning area.",
				},
				{
					name: "cover",
					description:
						"Scale the image, while preserving its intrinsic aspect ratio (if any), to the smallest size such that both its width and its height can completely cover the background positioning area.",
				},
			],
			syntax: "<bg-size>#",
			relevance: 55,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/mask-size",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-12-07",
			},
			description: "Specifies the size of the mask layer images.",
			restrictions: ["length", "percentage", "enum"],
		},
		{
			name: "mask-type",
			browsers: ["E79", "FF35", "FFA35", "S7", "SM7", "C24", "CA25", "O15"],
			values: [
				{
					name: "alpha",
					description: "Indicates that the alpha values of the mask should be used.",
				},
				{
					name: "luminance",
					description: "Indicates that the luminance values of the mask should be used.",
				},
			],
			syntax: "luminance | alpha",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/mask-type",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description: "Defines whether the content of the <mask> element is treated as as luminance mask or alpha mask.",
			restrictions: ["enum"],
		},
		{
			name: "max-block-size",
			browsers: ["E79", "FF41", "FFA41", "S12.1", "SM12.2", "C57", "CA57", "O44"],
			values: [
				{
					name: "none",
					description: "No limit on the width of the box.",
				},
			],
			syntax: "<'max-width'>",
			relevance: 53,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/max-block-size",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Maximum size of an element in the direction opposite that of the direction specified by 'writing-mode'.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "max-height",
			browsers: ["E12", "FF1", "FFA4", "S1.3", "SM1", "C1", "CA18", "IE7", "O7"],
			values: [
				{
					name: "none",
					description: "No limit on the height of the box.",
				},
				{
					name: "fit-content",
					browsers: ["E12", "FF1", "FFA4", "S1.3", "SM1", "C1", "CA18", "IE7", "O7"],
					description: "Use the fit-content inline size or fit-content block size, as appropriate to the writing mode.",
				},
				{
					name: "max-content",
					browsers: ["E12", "FF1", "FFA4", "S1.3", "SM1", "C1", "CA18", "IE7", "O7"],
					description: "Use the max-content inline size or max-content block size, as appropriate to the writing mode.",
				},
				{
					name: "min-content",
					browsers: ["E12", "FF1", "FFA4", "S1.3", "SM1", "C1", "CA18", "IE7", "O7"],
					description: "Use the min-content inline size or min-content block size, as appropriate to the writing mode.",
				},
			],
			syntax:
				"none | <length-percentage [0,∞]> | min-content | max-content | fit-content | fit-content(<length-percentage [0,∞]>) | <calc-size()> | <anchor-size()>",
			relevance: 86,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/max-height",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Allows authors to constrain content height to a certain range.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "max-inline-size",
			browsers: ["E79", "FF41", "FFA41", "S12.1", "SM12.2", "C57", "CA57", "O44"],
			values: [
				{
					name: "none",
					description: "No limit on the height of the box.",
				},
			],
			syntax: "<'max-width'>",
			relevance: 53,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/max-inline-size",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description: "Maximum size of an element in the direction specified by 'writing-mode'.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "max-width",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE7", "O4"],
			values: [
				{
					name: "none",
					description: "No limit on the width of the box.",
				},
				{
					name: "fit-content",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE7", "O4"],
					description: "Use the fit-content inline size or fit-content block size, as appropriate to the writing mode.",
				},
				{
					name: "max-content",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE7", "O4"],
					description: "Use the max-content inline size or max-content block size, as appropriate to the writing mode.",
				},
				{
					name: "min-content",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE7", "O4"],
					description: "Use the min-content inline size or min-content block size, as appropriate to the writing mode.",
				},
			],
			syntax:
				"none | <length-percentage [0,∞]> | min-content | max-content | fit-content | fit-content(<length-percentage [0,∞]>) | <calc-size()> | <anchor-size()>",
			relevance: 91,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/max-width",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Allows authors to constrain content width to a certain range.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "min-block-size",
			browsers: ["E79", "FF41", "FFA41", "S12.1", "SM12.2", "C57", "CA57", "O44"],
			syntax: "<'min-width'>",
			relevance: 53,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/min-block-size",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Minimal size of an element in the direction opposite that of the direction specified by 'writing-mode'.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "min-height",
			browsers: ["E12", "FF3", "FFA4", "S1.3", "SM1", "C1", "CA18", "IE7", "O4"],
			values: [
				{
					name: "auto",
					browsers: ["E12", "FF3", "FFA4", "S1.3", "SM1", "C1", "CA18", "IE7", "O4"],
				},
				{
					name: "fit-content",
					browsers: ["E12", "FF3", "FFA4", "S1.3", "SM1", "C1", "CA18", "IE7", "O4"],
					description: "Use the fit-content inline size or fit-content block size, as appropriate to the writing mode.",
				},
				{
					name: "max-content",
					browsers: ["E12", "FF3", "FFA4", "S1.3", "SM1", "C1", "CA18", "IE7", "O4"],
					description: "Use the max-content inline size or max-content block size, as appropriate to the writing mode.",
				},
				{
					name: "min-content",
					browsers: ["E12", "FF3", "FFA4", "S1.3", "SM1", "C1", "CA18", "IE7", "O4"],
					description: "Use the min-content inline size or min-content block size, as appropriate to the writing mode.",
				},
			],
			syntax:
				"auto | <length-percentage [0,∞]> | min-content | max-content | fit-content | fit-content(<length-percentage [0,∞]>) | <calc-size()> | <anchor-size()>",
			relevance: 89,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/min-height",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Allows authors to constrain content height to a certain range.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "min-inline-size",
			browsers: ["E79", "FF41", "FFA41", "S12.1", "SM12.2", "C57", "CA57", "O44"],
			syntax: "<'min-width'>",
			relevance: 53,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/min-inline-size",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description: "Minimal size of an element in the direction specified by 'writing-mode'.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "min-width",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE7", "O4"],
			values: [
				{
					name: "auto",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE7", "O4"],
				},
				{
					name: "fit-content",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE7", "O4"],
					description: "Use the fit-content inline size or fit-content block size, as appropriate to the writing mode.",
				},
				{
					name: "max-content",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE7", "O4"],
					description: "Use the max-content inline size or max-content block size, as appropriate to the writing mode.",
				},
				{
					name: "min-content",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE7", "O4"],
					description: "Use the min-content inline size or min-content block size, as appropriate to the writing mode.",
				},
			],
			syntax:
				"auto | <length-percentage [0,∞]> | min-content | max-content | fit-content | fit-content(<length-percentage [0,∞]>) | <calc-size()> | <anchor-size()>",
			relevance: 88,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/min-width",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Allows authors to constrain content width to a certain range.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "mix-blend-mode",
			browsers: ["E79", "FF32", "FFA32", "S8", "SM8", "C41", "CA41", "O28"],
			values: [
				{
					name: "normal",
					description: "Default attribute which specifies no blending",
				},
				{
					name: "multiply",
					description: "The source color is multiplied by the destination color and replaces the destination.",
				},
				{
					name: "screen",
					description:
						"Multiplies the complements of the backdrop and source color values, then complements the result.",
				},
				{
					name: "overlay",
					description: "Multiplies or screens the colors, depending on the backdrop color value.",
				},
				{
					name: "darken",
					description: "Selects the darker of the backdrop and source colors.",
				},
				{
					name: "lighten",
					description: "Selects the lighter of the backdrop and source colors.",
				},
				{
					name: "color-dodge",
					description: "Brightens the backdrop color to reflect the source color.",
				},
				{
					name: "color-burn",
					description: "Darkens the backdrop color to reflect the source color.",
				},
				{
					name: "hard-light",
					description: "Multiplies or screens the colors, depending on the source color value.",
				},
				{
					name: "soft-light",
					description: "Darkens or lightens the colors, depending on the source color value.",
				},
				{
					name: "difference",
					description: "Subtracts the darker of the two constituent colors from the lighter color..",
				},
				{
					name: "exclusion",
					description: "Produces an effect similar to that of the Difference mode but lower in contrast.",
				},
				{
					name: "hue",
					browsers: ["E79", "FF32", "FFA32", "S8", "SM8", "C41", "CA41", "O28"],
					description:
						"Creates a color with the hue of the source color and the saturation and luminosity of the backdrop color.",
				},
				{
					name: "saturation",
					browsers: ["E79", "FF32", "FFA32", "S8", "SM8", "C41", "CA41", "O28"],
					description:
						"Creates a color with the saturation of the source color and the hue and luminosity of the backdrop color.",
				},
				{
					name: "color",
					browsers: ["E79", "FF32", "FFA32", "S8", "SM8", "C41", "CA41", "O28"],
					description:
						"Creates a color with the hue and saturation of the source color and the luminosity of the backdrop color.",
				},
				{
					name: "luminosity",
					browsers: ["E79", "FF32", "FFA32", "S8", "SM8", "C41", "CA41", "O28"],
					description:
						"Creates a color with the luminosity of the source color and the hue and saturation of the backdrop color.",
				},
			],
			syntax: "<blend-mode> | plus-lighter",
			relevance: 54,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/mix-blend-mode",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description: "Defines the formula that must be used to mix the colors with the backdrop.",
			restrictions: ["enum"],
		},
		{
			name: "motion",
			browsers: ["C46", "O33"],
			values: [
				{
					name: "none",
					description: "No motion path gets created.",
				},
				{
					name: "path()",
					description: "Defines an SVG path as a string, with optional 'fill-rule' as the first argument.",
				},
				{
					name: "auto",
					description: "Indicates that the object is rotated by the angle of the direction of the motion path.",
				},
				{
					name: "reverse",
					description:
						"Indicates that the object is rotated by the angle of the direction of the motion path plus 180 degrees.",
				},
			],
			relevance: 50,
			description: "Shorthand property for setting 'motion-path', 'motion-offset' and 'motion-rotation'.",
			restrictions: ["url", "length", "percentage", "angle", "shape", "geometry-box", "enum"],
		},
		{
			name: "motion-offset",
			browsers: ["C46", "O33"],
			relevance: 50,
			description: "A distance that describes the position along the specified motion path.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "motion-path",
			browsers: ["C46", "O33"],
			values: [
				{
					name: "none",
					description: "No motion path gets created.",
				},
				{
					name: "path()",
					description: "Defines an SVG path as a string, with optional 'fill-rule' as the first argument.",
				},
			],
			relevance: 50,
			description: "Specifies the motion path the element gets positioned at.",
			restrictions: ["url", "shape", "geometry-box", "enum"],
		},
		{
			name: "motion-rotation",
			browsers: ["C46", "O33"],
			values: [
				{
					name: "auto",
					description: "Indicates that the object is rotated by the angle of the direction of the motion path.",
				},
				{
					name: "reverse",
					description:
						"Indicates that the object is rotated by the angle of the direction of the motion path plus 180 degrees.",
				},
			],
			relevance: 50,
			description: "Defines the direction of the element while positioning along the motion path.",
			restrictions: ["angle"],
		},
		{
			name: "-moz-animation",
			browsers: ["FF9"],
			values: [
				{
					name: "alternate",
					description:
						"The animation cycle iterations that are odd counts are played in the normal direction, and the animation cycle iterations that are even counts are played in a reverse direction.",
				},
				{
					name: "alternate-reverse",
					description:
						"The animation cycle iterations that are odd counts are played in the reverse direction, and the animation cycle iterations that are even counts are played in a normal direction.",
				},
				{
					name: "backwards",
					description:
						"The beginning property value (as defined in the first @keyframes at-rule) is applied before the animation is displayed, during the period defined by 'animation-delay'.",
				},
				{
					name: "both",
					description: "Both forwards and backwards fill modes are applied.",
				},
				{
					name: "forwards",
					description:
						"The final property value (as defined in the last @keyframes at-rule) is maintained after the animation completes.",
				},
				{
					name: "infinite",
					description: "Causes the animation to repeat forever.",
				},
				{
					name: "none",
					description: "No animation is performed",
				},
				{
					name: "normal",
					description: "Normal playback.",
				},
				{
					name: "reverse",
					description:
						"All iterations of the animation are played in the reverse direction from the way they were specified.",
				},
			],
			relevance: 50,
			description: "Shorthand property combines six of the animation properties into a single property.",
			restrictions: ["time", "enum", "timing-function", "identifier", "number"],
		},
		{
			name: "-moz-animation-delay",
			browsers: ["FF9"],
			relevance: 50,
			description: "Defines when the animation will start.",
			restrictions: ["time"],
		},
		{
			name: "-moz-animation-direction",
			browsers: ["FF9"],
			values: [
				{
					name: "alternate",
					description:
						"The animation cycle iterations that are odd counts are played in the normal direction, and the animation cycle iterations that are even counts are played in a reverse direction.",
				},
				{
					name: "alternate-reverse",
					description:
						"The animation cycle iterations that are odd counts are played in the reverse direction, and the animation cycle iterations that are even counts are played in a normal direction.",
				},
				{
					name: "normal",
					description: "Normal playback.",
				},
				{
					name: "reverse",
					description:
						"All iterations of the animation are played in the reverse direction from the way they were specified.",
				},
			],
			relevance: 50,
			description: "Defines whether or not the animation should play in reverse on alternate cycles.",
			restrictions: ["enum"],
		},
		{
			name: "-moz-animation-duration",
			browsers: ["FF9"],
			relevance: 50,
			description: "Defines the length of time that an animation takes to complete one cycle.",
			restrictions: ["time"],
		},
		{
			name: "-moz-animation-iteration-count",
			browsers: ["FF9"],
			values: [
				{
					name: "infinite",
					description: "Causes the animation to repeat forever.",
				},
			],
			relevance: 50,
			description:
				"Defines the number of times an animation cycle is played. The default value is one, meaning the animation will play from beginning to end once.",
			restrictions: ["number", "enum"],
		},
		{
			name: "-moz-animation-name",
			browsers: ["FF9"],
			values: [
				{
					name: "none",
					description: "No animation is performed",
				},
			],
			relevance: 50,
			description:
				"Defines a list of animations that apply. Each name is used to select the keyframe at-rule that provides the property values for the animation.",
			restrictions: ["identifier", "enum"],
		},
		{
			name: "-moz-animation-play-state",
			browsers: ["FF9"],
			values: [
				{
					name: "paused",
					description: "A running animation will be paused.",
				},
				{
					name: "running",
					description: "Resume playback of a paused animation.",
				},
			],
			relevance: 50,
			description: "Defines whether the animation is running or paused.",
			restrictions: ["enum"],
		},
		{
			name: "-moz-animation-timing-function",
			browsers: ["FF9"],
			relevance: 50,
			description:
				"Describes how the animation will progress over one cycle of its duration. See the 'transition-timing-function'.",
			restrictions: ["timing-function"],
		},
		{
			name: "-moz-appearance",
			browsers: ["FF1"],
			values: [
				{
					name: "button",
				},
				{
					name: "button-arrow-down",
				},
				{
					name: "button-arrow-next",
				},
				{
					name: "button-arrow-previous",
				},
				{
					name: "button-arrow-up",
				},
				{
					name: "button-bevel",
				},
				{
					name: "checkbox",
				},
				{
					name: "checkbox-container",
				},
				{
					name: "checkbox-label",
				},
				{
					name: "dialog",
				},
				{
					name: "groupbox",
				},
				{
					name: "listbox",
				},
				{
					name: "menuarrow",
				},
				{
					name: "menuimage",
				},
				{
					name: "menuitem",
				},
				{
					name: "menuitemtext",
				},
				{
					name: "menulist",
				},
				{
					name: "menulist-button",
				},
				{
					name: "menulist-text",
				},
				{
					name: "menulist-textfield",
				},
				{
					name: "menupopup",
				},
				{
					name: "menuradio",
				},
				{
					name: "menuseparator",
				},
				{
					name: "-moz-mac-unified-toolbar",
				},
				{
					name: "-moz-win-borderless-glass",
				},
				{
					name: "-moz-win-browsertabbar-toolbox",
				},
				{
					name: "-moz-win-communications-toolbox",
				},
				{
					name: "-moz-win-glass",
				},
				{
					name: "-moz-win-media-toolbox",
				},
				{
					name: "none",
				},
				{
					name: "progressbar",
				},
				{
					name: "progresschunk",
				},
				{
					name: "radio",
				},
				{
					name: "radio-container",
				},
				{
					name: "radio-label",
				},
				{
					name: "radiomenuitem",
				},
				{
					name: "resizer",
				},
				{
					name: "resizerpanel",
				},
				{
					name: "scrollbarbutton-down",
				},
				{
					name: "scrollbarbutton-left",
				},
				{
					name: "scrollbarbutton-right",
				},
				{
					name: "scrollbarbutton-up",
				},
				{
					name: "scrollbar-small",
				},
				{
					name: "scrollbartrack-horizontal",
				},
				{
					name: "scrollbartrack-vertical",
				},
				{
					name: "separator",
				},
				{
					name: "spinner",
				},
				{
					name: "spinner-downbutton",
				},
				{
					name: "spinner-textfield",
				},
				{
					name: "spinner-upbutton",
				},
				{
					name: "statusbar",
				},
				{
					name: "statusbarpanel",
				},
				{
					name: "tab",
				},
				{
					name: "tabpanels",
				},
				{
					name: "tab-scroll-arrow-back",
				},
				{
					name: "tab-scroll-arrow-forward",
				},
				{
					name: "textfield",
				},
				{
					name: "textfield-multiline",
				},
				{
					name: "toolbar",
				},
				{
					name: "toolbox",
				},
				{
					name: "tooltip",
				},
				{
					name: "treeheadercell",
				},
				{
					name: "treeheadersortarrow",
				},
				{
					name: "treeitem",
				},
				{
					name: "treetwistyopen",
				},
				{
					name: "treeview",
				},
				{
					name: "treewisty",
				},
				{
					name: "window",
				},
			],
			status: "nonstandard",
			syntax:
				"none | button | button-arrow-down | button-arrow-next | button-arrow-previous | button-arrow-up | button-bevel | button-focus | caret | checkbox | checkbox-container | checkbox-label | checkmenuitem | dualbutton | groupbox | listbox | listitem | menuarrow | menubar | menucheckbox | menuimage | menuitem | menuitemtext | menulist | menulist-button | menulist-text | menulist-textfield | menupopup | menuradio | menuseparator | meterbar | meterchunk | progressbar | progressbar-vertical | progresschunk | progresschunk-vertical | radio | radio-container | radio-label | radiomenuitem | range | range-thumb | resizer | resizerpanel | scale-horizontal | scalethumbend | scalethumb-horizontal | scalethumbstart | scalethumbtick | scalethumb-vertical | scale-vertical | scrollbarbutton-down | scrollbarbutton-left | scrollbarbutton-right | scrollbarbutton-up | scrollbarthumb-horizontal | scrollbarthumb-vertical | scrollbartrack-horizontal | scrollbartrack-vertical | searchfield | separator | sheet | spinner | spinner-downbutton | spinner-textfield | spinner-upbutton | splitter | statusbar | statusbarpanel | tab | tabpanel | tabpanels | tab-scroll-arrow-back | tab-scroll-arrow-forward | textfield | textfield-multiline | toolbar | toolbarbutton | toolbarbutton-dropdown | toolbargripper | toolbox | tooltip | treeheader | treeheadercell | treeheadersortarrow | treeitem | treeline | treetwisty | treetwistyopen | treeview | -moz-mac-unified-toolbar | -moz-win-borderless-glass | -moz-win-browsertabbar-toolbox | -moz-win-communicationstext | -moz-win-communications-toolbox | -moz-win-exclude-glass | -moz-win-glass | -moz-win-mediatext | -moz-win-media-toolbox | -moz-window-button-box | -moz-window-button-box-maximized | -moz-window-button-close | -moz-window-button-maximize | -moz-window-button-minimize | -moz-window-button-restore | -moz-window-frame-bottom | -moz-window-frame-left | -moz-window-frame-right | -moz-window-titlebar | -moz-window-titlebar-maximized",
			relevance: 0,
			description:
				"Used in Gecko (Firefox) to display an element using a platform-native styling based on the operating system's theme.",
			restrictions: ["enum"],
		},
		{
			name: "-moz-backface-visibility",
			browsers: ["FF10"],
			values: [
				{
					name: "hidden",
				},
				{
					name: "visible",
				},
			],
			relevance: 50,
			description:
				"Determines whether or not the 'back' side of a transformed element is visible when facing the viewer. With an identity transform, the front side of an element faces the viewer.",
			restrictions: ["enum"],
		},
		{
			name: "-moz-background-clip",
			browsers: ["FF1-3.6"],
			values: [
				{
					name: "padding",
				},
			],
			relevance: 50,
			description: "Determines the background painting area.",
			restrictions: ["box", "enum"],
		},
		{
			name: "-moz-background-inline-policy",
			browsers: ["FF1"],
			values: [
				{
					name: "bounding-box",
				},
				{
					name: "continuous",
				},
				{
					name: "each-box",
				},
			],
			relevance: 50,
			description:
				"In Gecko-based applications like Firefox, the -moz-background-inline-policy CSS property specifies how the background image of an inline element is determined when the content of the inline element wraps onto multiple lines. The choice of position has significant effects on repetition.",
			restrictions: ["enum"],
		},
		{
			name: "-moz-background-origin",
			browsers: ["FF1"],
			relevance: 50,
			description:
				"For elements rendered as a single box, specifies the background positioning area. For elements rendered as multiple boxes (e.g., inline boxes on several lines, boxes on several pages) specifies which boxes 'box-decoration-break' operates on to determine the background positioning area(s).",
			restrictions: ["box"],
		},
		{
			name: "-moz-border-bottom-colors",
			browsers: ["FF1"],
			status: "nonstandard",
			syntax: "<color>+ | none",
			relevance: 0,
			description: "Sets a list of colors for the bottom border.",
			restrictions: ["color"],
		},
		{
			name: "-moz-border-image",
			browsers: ["FF3.6"],
			values: [
				{
					name: "auto",
					description:
						"If 'auto' is specified then the border image width is the intrinsic width or height (whichever is applicable) of the corresponding image slice. If the image does not have the required intrinsic dimension then the corresponding border-width is used instead.",
				},
				{
					name: "fill",
					description: "Causes the middle part of the border-image to be preserved.",
				},
				{
					name: "none",
				},
				{
					name: "repeat",
					description: "The image is tiled (repeated) to fill the area.",
				},
				{
					name: "round",
					description:
						"The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the image is rescaled so that it does.",
				},
				{
					name: "space",
					description:
						"The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the extra space is distributed around the tiles.",
				},
				{
					name: "stretch",
					description: "The image is stretched to fill the area.",
				},
				{
					name: "url()",
				},
			],
			relevance: 50,
			description:
				"Shorthand property for setting 'border-image-source', 'border-image-slice', 'border-image-width', 'border-image-outset' and 'border-image-repeat'. Omitted values are set to their initial values.",
			restrictions: ["length", "percentage", "number", "url", "enum"],
		},
		{
			name: "-moz-border-left-colors",
			browsers: ["FF1"],
			status: "nonstandard",
			syntax: "<color>+ | none",
			relevance: 0,
			description: "Sets a list of colors for the bottom border.",
			restrictions: ["color"],
		},
		{
			name: "-moz-border-right-colors",
			browsers: ["FF1"],
			status: "nonstandard",
			syntax: "<color>+ | none",
			relevance: 0,
			description: "Sets a list of colors for the bottom border.",
			restrictions: ["color"],
		},
		{
			name: "-moz-border-top-colors",
			browsers: ["FF1"],
			status: "nonstandard",
			syntax: "<color>+ | none",
			relevance: 0,
			description: "Ske Firefox, -moz-border-bottom-colors sets a list of colors for the bottom border.",
			restrictions: ["color"],
		},
		{
			name: "-moz-box-align",
			browsers: ["FF1"],
			values: [
				{
					name: "baseline",
					description:
						"If this box orientation is inline-axis or horizontal, all children are placed with their baselines aligned, and extra space placed before or after as necessary. For block flows, the baseline of the first non-empty line box located within the element is used. For tables, the baseline of the first cell is used.",
				},
				{
					name: "center",
					description:
						"Any extra space is divided evenly, with half placed above the child and the other half placed after the child.",
				},
				{
					name: "end",
					description:
						"For normal direction boxes, the bottom edge of each child is placed along the bottom of the box. Extra space is placed above the element. For reverse direction boxes, the top edge of each child is placed along the top of the box. Extra space is placed below the element.",
				},
				{
					name: "start",
					description:
						"For normal direction boxes, the top edge of each child is placed along the top of the box. Extra space is placed below the element. For reverse direction boxes, the bottom edge of each child is placed along the bottom of the box. Extra space is placed above the element.",
				},
				{
					name: "stretch",
					description: "The height of each child is adjusted to that of the containing block.",
				},
			],
			relevance: 50,
			description:
				"Specifies how a XUL box aligns its contents across (perpendicular to) the direction of its layout. The effect of this is only visible if there is extra space in the box.",
			restrictions: ["enum"],
		},
		{
			name: "-moz-box-direction",
			browsers: ["FF1"],
			values: [
				{
					name: "normal",
					description:
						"A box with a computed value of horizontal for box-orient displays its children from left to right. A box with a computed value of vertical displays its children from top to bottom.",
				},
				{
					name: "reverse",
					description:
						"A box with a computed value of horizontal for box-orient displays its children from right to left. A box with a computed value of vertical displays its children from bottom to top.",
				},
			],
			relevance: 50,
			description:
				"Specifies whether a box lays out its contents normally (from the top or left edge), or in reverse (from the bottom or right edge).",
			restrictions: ["enum"],
		},
		{
			name: "-moz-box-flex",
			browsers: ["FF1"],
			relevance: 50,
			description:
				"Specifies how a box grows to fill the box that contains it, in the direction of the containing box's layout.",
			restrictions: ["number"],
		},
		{
			name: "-moz-box-flexgroup",
			browsers: ["FF1"],
			relevance: 50,
			description: "Flexible elements can be assigned to flex groups using the 'box-flex-group' property.",
			restrictions: ["integer"],
		},
		{
			name: "-moz-box-ordinal-group",
			browsers: ["FF1"],
			relevance: 50,
			description:
				"Indicates the ordinal group the element belongs to. Elements with a lower ordinal group are displayed before those with a higher ordinal group.",
			restrictions: ["integer"],
		},
		{
			name: "-moz-box-orient",
			browsers: ["FF1"],
			values: [
				{
					name: "block-axis",
					description: "Elements are oriented along the box's axis.",
				},
				{
					name: "horizontal",
					description: "The box displays its children from left to right in a horizontal line.",
				},
				{
					name: "inline-axis",
					description: "Elements are oriented vertically.",
				},
				{
					name: "vertical",
					description: "The box displays its children from stacked from top to bottom vertically.",
				},
			],
			relevance: 50,
			description:
				"In Mozilla applications, -moz-box-orient specifies whether a box lays out its contents horizontally or vertically.",
			restrictions: ["enum"],
		},
		{
			name: "-moz-box-pack",
			browsers: ["FF1"],
			values: [
				{
					name: "center",
					description:
						"The extra space is divided evenly, with half placed before the first child and the other half placed after the last child.",
				},
				{
					name: "end",
					description:
						"For normal direction boxes, the right edge of the last child is placed at the right side, with all extra space placed before the first child. For reverse direction boxes, the left edge of the first child is placed at the left side, with all extra space placed after the last child.",
				},
				{
					name: "justify",
					description:
						"The space is divided evenly in-between each child, with none of the extra space placed before the first child or after the last child. If there is only one child, treat the pack value as if it were start.",
				},
				{
					name: "start",
					description:
						"For normal direction boxes, the left edge of the first child is placed at the left side, with all extra space placed after the last child. For reverse direction boxes, the right edge of the last child is placed at the right side, with all extra space placed before the first child.",
				},
			],
			relevance: 50,
			description:
				"Specifies how a box packs its contents in the direction of its layout. The effect of this is only visible if there is extra space in the box.",
			restrictions: ["enum"],
		},
		{
			name: "-moz-box-sizing",
			browsers: ["FF1"],
			values: [
				{
					name: "border-box",
					description:
						"The specified width and height (and respective min/max properties) on this element determine the border box of the element.",
				},
				{
					name: "content-box",
					description:
						"Behavior of width and height as specified by CSS2.1. The specified width and height (and respective min/max properties) apply to the width and height respectively of the content box of the element.",
				},
				{
					name: "padding-box",
					description:
						"The specified width and height (and respective min/max properties) on this element determine the padding box of the element.",
				},
			],
			relevance: 50,
			description: "Box Model addition in CSS3.",
			restrictions: ["enum"],
		},
		{
			name: "-moz-column-count",
			browsers: ["FF3.5"],
			values: [
				{
					name: "auto",
					description: "Determines the number of columns by the 'column-width' property and the element width.",
				},
			],
			relevance: 50,
			description: "Describes the optimal number of columns into which the content of the element will be flowed.",
			restrictions: ["integer"],
		},
		{
			name: "-moz-column-gap",
			browsers: ["FF3.5"],
			values: [
				{
					name: "normal",
					description: "User agent specific and typically equivalent to 1em.",
				},
			],
			relevance: 50,
			description:
				"Sets the gap between columns. If there is a column rule between columns, it will appear in the middle of the gap.",
			restrictions: ["length"],
		},
		{
			name: "-moz-column-rule",
			browsers: ["FF3.5"],
			relevance: 50,
			description:
				"Shorthand for setting 'column-rule-width', 'column-rule-style', and 'column-rule-color' at the same place in the style sheet. Omitted values are set to their initial values.",
			restrictions: ["length", "line-width", "line-style", "color"],
		},
		{
			name: "-moz-column-rule-color",
			browsers: ["FF3.5"],
			relevance: 50,
			description: "Sets the color of the column rule",
			restrictions: ["color"],
		},
		{
			name: "-moz-column-rule-style",
			browsers: ["FF3.5"],
			relevance: 50,
			description: "Sets the style of the rule between columns of an element.",
			restrictions: ["line-style"],
		},
		{
			name: "-moz-column-rule-width",
			browsers: ["FF3.5"],
			relevance: 50,
			description: "Sets the width of the rule between columns. Negative values are not allowed.",
			restrictions: ["length", "line-width"],
		},
		{
			name: "-moz-columns",
			browsers: ["FF9"],
			values: [
				{
					name: "auto",
					description: "The width depends on the values of other properties.",
				},
			],
			relevance: 50,
			description: "A shorthand property which sets both 'column-width' and 'column-count'.",
			restrictions: ["length", "integer"],
		},
		{
			name: "-moz-column-width",
			browsers: ["FF3.5"],
			values: [
				{
					name: "auto",
					description: "The width depends on the values of other properties.",
				},
			],
			relevance: 50,
			description: "This property describes the width of columns in multicol elements.",
			restrictions: ["length"],
		},
		{
			name: "-moz-font-feature-settings",
			browsers: ["FF4"],
			values: [
				{
					name: '"c2cs"',
				},
				{
					name: '"dlig"',
				},
				{
					name: '"kern"',
				},
				{
					name: '"liga"',
				},
				{
					name: '"lnum"',
				},
				{
					name: '"onum"',
				},
				{
					name: '"smcp"',
				},
				{
					name: '"swsh"',
				},
				{
					name: '"tnum"',
				},
				{
					name: "normal",
					description: "No change in glyph substitution or positioning occurs.",
				},
				{
					name: "off",
					browsers: ["FF4"],
				},
				{
					name: "on",
					browsers: ["FF4"],
				},
			],
			relevance: 50,
			description:
				"Provides low-level control over OpenType font features. It is intended as a way of providing access to font features that are not widely used but are needed for a particular use case.",
			restrictions: ["string", "integer"],
		},
		{
			name: "-moz-hyphens",
			browsers: ["FF9"],
			values: [
				{
					name: "auto",
					description:
						"Conditional hyphenation characters inside a word, if present, take priority over automatic resources when determining hyphenation points within the word.",
				},
				{
					name: "manual",
					description:
						"Words are only broken at line breaks where there are characters inside the word that suggest line break opportunities",
				},
				{
					name: "none",
					description:
						"Words are not broken at line breaks, even if characters inside the word suggest line break points.",
				},
			],
			relevance: 50,
			description: "Controls whether hyphenation is allowed to create more break opportunities within a line of text.",
			restrictions: ["enum"],
		},
		{
			name: "-moz-perspective",
			browsers: ["FF10"],
			values: [
				{
					name: "none",
					description: "No perspective transform is applied.",
				},
			],
			relevance: 50,
			description:
				"Applies the same transform as the perspective(<number>) transform function, except that it applies only to the positioned or transformed children of the element, not to the transform on the element itself.",
			restrictions: ["length"],
		},
		{
			name: "-moz-perspective-origin",
			browsers: ["FF10"],
			relevance: 50,
			description:
				"Establishes the origin for the perspective property. It effectively sets the X and Y position at which the viewer appears to be looking at the children of the element.",
			restrictions: ["position", "percentage", "length"],
		},
		{
			name: "-moz-text-align-last",
			browsers: ["FF12"],
			values: [
				{
					name: "auto",
				},
				{
					name: "center",
					description: "The inline contents are centered within the line box.",
				},
				{
					name: "justify",
					description: "The text is justified according to the method specified by the 'text-justify' property.",
				},
				{
					name: "left",
					description:
						"The inline contents are aligned to the left edge of the line box. In vertical text, 'left' aligns to the edge of the line box that would be the start edge for left-to-right text.",
				},
				{
					name: "right",
					description:
						"The inline contents are aligned to the right edge of the line box. In vertical text, 'right' aligns to the edge of the line box that would be the end edge for left-to-right text.",
				},
			],
			relevance: 50,
			description:
				"Describes how the last line of a block or a line right before a forced line break is aligned when 'text-align' is set to 'justify'.",
			restrictions: ["enum"],
		},
		{
			name: "-moz-text-decoration-color",
			browsers: ["FF6"],
			relevance: 50,
			description:
				"Specifies the color of text decoration (underlines overlines, and line-throughs) set on the element with text-decoration-line.",
			restrictions: ["color"],
		},
		{
			name: "-moz-text-decoration-line",
			browsers: ["FF6"],
			values: [
				{
					name: "line-through",
					description: "Each line of text has a line through the middle.",
				},
				{
					name: "none",
					description: "Neither produces nor inhibits text decoration.",
				},
				{
					name: "overline",
					description: "Each line of text has a line above it.",
				},
				{
					name: "underline",
					description: "Each line of text is underlined.",
				},
			],
			relevance: 50,
			description: "Specifies what line decorations, if any, are added to the element.",
			restrictions: ["enum"],
		},
		{
			name: "-moz-text-decoration-style",
			browsers: ["FF6"],
			values: [
				{
					name: "dashed",
					description: "Produces a dashed line style.",
				},
				{
					name: "dotted",
					description: "Produces a dotted line.",
				},
				{
					name: "double",
					description: "Produces a double line.",
				},
				{
					name: "none",
					description: "Produces no line.",
				},
				{
					name: "solid",
					description: "Produces a solid line.",
				},
				{
					name: "wavy",
					description: "Produces a wavy line.",
				},
			],
			relevance: 50,
			description: "Specifies the line style for underline, line-through and overline text decoration.",
			restrictions: ["enum"],
		},
		{
			name: "-moz-text-size-adjust",
			browsers: ["FF"],
			values: [
				{
					name: "auto",
					description: "Renderers must use the default size adjustment when displaying on a small device.",
				},
				{
					name: "none",
					description: "Renderers must not do size adjustment when displaying on a small device.",
				},
			],
			relevance: 50,
			description: "Specifies a size adjustment for displaying text content in mobile browsers.",
			restrictions: ["enum", "percentage"],
		},
		{
			name: "-moz-transform",
			browsers: ["FF3.5"],
			values: [
				{
					name: "matrix()",
					description:
						"Specifies a 2D transformation in the form of a transformation matrix of six values. matrix(a,b,c,d,e,f) is equivalent to applying the transformation matrix [a b c d e f]",
				},
				{
					name: "matrix3d()",
					description: "Specifies a 3D transformation as a 4x4 homogeneous matrix of 16 values in column-major order.",
				},
				{
					name: "none",
				},
				{
					name: "perspective",
					description: "Specifies a perspective projection matrix.",
				},
				{
					name: "rotate()",
					description:
						"Specifies a 2D rotation by the angle specified in the parameter about the origin of the element, as defined by the transform-origin property.",
				},
				{
					name: "rotate3d()",
					description:
						"Specifies a clockwise 3D rotation by the angle specified in last parameter about the [x,y,z] direction vector described by the first 3 parameters.",
				},
				{
					name: "rotateX('angle')",
					description: "Specifies a clockwise rotation by the given angle about the X axis.",
				},
				{
					name: "rotateY('angle')",
					description: "Specifies a clockwise rotation by the given angle about the Y axis.",
				},
				{
					name: "rotateZ('angle')",
					description: "Specifies a clockwise rotation by the given angle about the Z axis.",
				},
				{
					name: "scale()",
					description:
						"Specifies a 2D scale operation by the [sx,sy] scaling vector described by the 2 parameters. If the second parameter is not provided, it is takes a value equal to the first.",
				},
				{
					name: "scale3d()",
					description: "Specifies a 3D scale operation by the [sx,sy,sz] scaling vector described by the 3 parameters.",
				},
				{
					name: "scaleX()",
					description:
						"Specifies a scale operation using the [sx,1] scaling vector, where sx is given as the parameter.",
				},
				{
					name: "scaleY()",
					description:
						"Specifies a scale operation using the [sy,1] scaling vector, where sy is given as the parameter.",
				},
				{
					name: "scaleZ()",
					description:
						"Specifies a scale operation using the [1,1,sz] scaling vector, where sz is given as the parameter.",
				},
				{
					name: "skew()",
					description:
						"Specifies a skew transformation along the X and Y axes. The first angle parameter specifies the skew on the X axis. The second angle parameter specifies the skew on the Y axis. If the second parameter is not given then a value of 0 is used for the Y angle (ie: no skew on the Y axis).",
				},
				{
					name: "skewX()",
					description: "Specifies a skew transformation along the X axis by the given angle.",
				},
				{
					name: "skewY()",
					description: "Specifies a skew transformation along the Y axis by the given angle.",
				},
				{
					name: "translate()",
					description:
						"Specifies a 2D translation by the vector [tx, ty], where tx is the first translation-value parameter and ty is the optional second translation-value parameter.",
				},
				{
					name: "translate3d()",
					description:
						"Specifies a 3D translation by the vector [tx,ty,tz], with tx, ty and tz being the first, second and third translation-value parameters respectively.",
				},
				{
					name: "translateX()",
					description: "Specifies a translation by the given amount in the X direction.",
				},
				{
					name: "translateY()",
					description: "Specifies a translation by the given amount in the Y direction.",
				},
				{
					name: "translateZ()",
					description:
						"Specifies a translation by the given amount in the Z direction. Note that percentage values are not allowed in the translateZ translation-value, and if present are evaluated as 0.",
				},
			],
			relevance: 50,
			description:
				"A two-dimensional transformation is applied to an element through the 'transform' property. This property contains a list of transform functions similar to those allowed by SVG.",
			restrictions: ["enum"],
		},
		{
			name: "-moz-transform-origin",
			browsers: ["FF3.5"],
			relevance: 50,
			description: "Establishes the origin of transformation for an element.",
			restrictions: ["position", "length", "percentage"],
		},
		{
			name: "-moz-transition",
			browsers: ["FF4"],
			values: [
				{
					name: "all",
					description: "Every property that is able to undergo a transition will do so.",
				},
				{
					name: "none",
					description: "No property will transition.",
				},
			],
			relevance: 50,
			description: "Shorthand property combines four of the transition properties into a single property.",
			restrictions: ["time", "property", "timing-function", "enum"],
		},
		{
			name: "-moz-transition-delay",
			browsers: ["FF4"],
			relevance: 50,
			description:
				"Defines when the transition will start. It allows a transition to begin execution some period of time from when it is applied.",
			restrictions: ["time"],
		},
		{
			name: "-moz-transition-duration",
			browsers: ["FF4"],
			relevance: 50,
			description: "Specifies how long the transition from the old value to the new value should take.",
			restrictions: ["time"],
		},
		{
			name: "-moz-transition-property",
			browsers: ["FF4"],
			values: [
				{
					name: "all",
					description: "Every property that is able to undergo a transition will do so.",
				},
				{
					name: "none",
					description: "No property will transition.",
				},
			],
			relevance: 50,
			description: "Specifies the name of the CSS property to which the transition is applied.",
			restrictions: ["property"],
		},
		{
			name: "-moz-transition-timing-function",
			browsers: ["FF4"],
			relevance: 50,
			description: "Describes how the intermediate values used during a transition will be calculated.",
			restrictions: ["timing-function"],
		},
		{
			name: "-moz-user-focus",
			values: [
				{
					name: "ignore",
				},
				{
					name: "normal",
				},
			],
			status: "obsolete",
			syntax: "ignore | normal | select-after | select-before | select-menu | select-same | select-all | none",
			relevance: 0,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/-moz-user-focus",
				},
			],
			baseline: {
				status: "false",
			},
			description: "Used to indicate whether the element can have focus.",
		},
		{
			name: "-moz-user-select",
			browsers: ["FF1.5"],
			values: [
				{
					name: "all",
				},
				{
					name: "element",
				},
				{
					name: "elements",
				},
				{
					name: "-moz-all",
				},
				{
					name: "-moz-none",
				},
				{
					name: "none",
				},
				{
					name: "text",
				},
				{
					name: "toggle",
				},
			],
			relevance: 50,
			description: "Controls the appearance of selection.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-accelerator",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "false",
					description: "The element does not contain an accelerator key sequence.",
				},
				{
					name: "true",
					description: "The element contains an accelerator key sequence.",
				},
			],
			status: "nonstandard",
			syntax: "false | true",
			relevance: 0,
			description:
				"IE only. Has the ability to turn off its system underlines for accelerator keys until the ALT key is pressed",
			restrictions: ["enum"],
		},
		{
			name: "-ms-behavior",
			browsers: ["IE8"],
			relevance: 50,
			description: "IE only. Used to extend behaviors of the browser",
			restrictions: ["url"],
		},
		{
			name: "-ms-block-progression",
			browsers: ["IE8"],
			values: [
				{
					name: "bt",
					description: "Bottom-to-top block flow. Layout is horizontal.",
				},
				{
					name: "lr",
					description: "Left-to-right direction. The flow orientation is vertical.",
				},
				{
					name: "rl",
					description: "Right-to-left direction. The flow orientation is vertical.",
				},
				{
					name: "tb",
					description: "Top-to-bottom direction. The flow orientation is horizontal.",
				},
			],
			status: "nonstandard",
			syntax: "tb | rl | bt | lr",
			relevance: 0,
			description: "Sets the block-progression value and the flow orientation",
			restrictions: ["enum"],
		},
		{
			name: "-ms-content-zoom-chaining",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "chained",
					description:
						"The nearest zoomable parent element begins zooming when the user hits a zoom limit during a manipulation. No bounce effect is shown.",
				},
				{
					name: "none",
					description: "A bounce effect is shown when the user hits a zoom limit during a manipulation.",
				},
			],
			status: "nonstandard",
			syntax: "none | chained",
			relevance: 0,
			description: "Specifies the zoom behavior that occurs when a user hits the zoom limit during a manipulation.",
		},
		{
			name: "-ms-content-zooming",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "none",
					description: "The element is not zoomable.",
				},
				{
					name: "zoom",
					description: "The element is zoomable.",
				},
			],
			status: "nonstandard",
			syntax: "none | zoom",
			relevance: 0,
			description: "Specifies whether zooming is enabled.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-content-zoom-limit",
			browsers: ["E", "IE10"],
			status: "nonstandard",
			syntax: "<'-ms-content-zoom-limit-min'> <'-ms-content-zoom-limit-max'>",
			relevance: 0,
			description: "Shorthand property for the -ms-content-zoom-limit-min and -ms-content-zoom-limit-max properties.",
			restrictions: ["percentage"],
		},
		{
			name: "-ms-content-zoom-limit-max",
			browsers: ["E", "IE10"],
			status: "nonstandard",
			syntax: "<percentage>",
			relevance: 0,
			description: "Specifies the maximum zoom factor.",
			restrictions: ["percentage"],
		},
		{
			name: "-ms-content-zoom-limit-min",
			browsers: ["E", "IE10"],
			status: "nonstandard",
			syntax: "<percentage>",
			relevance: 0,
			description: "Specifies the minimum zoom factor.",
			restrictions: ["percentage"],
		},
		{
			name: "-ms-content-zoom-snap",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "mandatory",
					description:
						"Indicates that the motion of the content after the contact is picked up is always adjusted so that it lands on a snap-point.",
				},
				{
					name: "none",
					description: "Indicates that zooming is unaffected by any defined snap-points.",
				},
				{
					name: "proximity",
					description:
						'Indicates that the motion of the content after the contact is picked up may be adjusted if the content would normally stop "close enough" to a snap-point.',
				},
				{
					name: "snapInterval(100%, 100%)",
					description: "Specifies where the snap-points will be placed.",
				},
				{
					name: "snapList()",
					description: "Specifies the position of individual snap-points as a comma-separated list of zoom factors.",
				},
			],
			status: "nonstandard",
			syntax: "<'-ms-content-zoom-snap-type'> || <'-ms-content-zoom-snap-points'>",
			relevance: 0,
			description: "Shorthand property for the -ms-content-zoom-snap-type and -ms-content-zoom-snap-points properties.",
		},
		{
			name: "-ms-content-zoom-snap-points",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "snapInterval(100%, 100%)",
					description: "Specifies where the snap-points will be placed.",
				},
				{
					name: "snapList()",
					description: "Specifies the position of individual snap-points as a comma-separated list of zoom factors.",
				},
			],
			status: "nonstandard",
			syntax: "snapInterval( <percentage>, <percentage> ) | snapList( <percentage># )",
			relevance: 0,
			description: "Defines where zoom snap-points are located.",
		},
		{
			name: "-ms-content-zoom-snap-type",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "mandatory",
					description:
						"Indicates that the motion of the content after the contact is picked up is always adjusted so that it lands on a snap-point.",
				},
				{
					name: "none",
					description: "Indicates that zooming is unaffected by any defined snap-points.",
				},
				{
					name: "proximity",
					description:
						'Indicates that the motion of the content after the contact is picked up may be adjusted if the content would normally stop "close enough" to a snap-point.',
				},
			],
			status: "nonstandard",
			syntax: "none | proximity | mandatory",
			relevance: 0,
			description: "Specifies how zooming is affected by defined snap-points.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-filter",
			browsers: ["IE8-9"],
			status: "nonstandard",
			syntax: "<string>",
			relevance: 0,
			description: "IE only. Used to produce visual effects.",
			restrictions: ["string"],
		},
		{
			name: "-ms-flex",
			browsers: ["IE10"],
			values: [
				{
					name: "auto",
					description: "Retrieves the value of the main size property as the used 'flex-basis'.",
				},
				{
					name: "none",
					description: "Expands to '0 0 auto'.",
				},
			],
			relevance: 50,
			description:
				"specifies the parameters of a flexible length: the positive and negative flexibility, and the preferred size.",
			restrictions: ["length", "number", "percentage"],
		},
		{
			name: "-ms-flex-align",
			browsers: ["IE10"],
			values: [
				{
					name: "baseline",
					description:
						"If the flex item's inline axis is the same as the cross axis, this value is identical to 'flex-start'. Otherwise, it participates in baseline alignment.",
				},
				{
					name: "center",
					description: "The flex item's margin box is centered in the cross axis within the line.",
				},
				{
					name: "end",
					description:
						"The cross-end margin edge of the flex item is placed flush with the cross-end edge of the line.",
				},
				{
					name: "start",
					description:
						"The cross-start margin edge of the flexbox item is placed flush with the cross-start edge of the line.",
				},
				{
					name: "stretch",
					description:
						"If the cross size property of the flexbox item is anything other than 'auto', this value is identical to 'start'.",
				},
			],
			relevance: 50,
			description: "Aligns flex items along the cross axis of the current line of the flex container.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-flex-direction",
			browsers: ["IE10"],
			values: [
				{
					name: "column",
					description:
						"The flex container's main axis has the same orientation as the block axis of the current writing mode.",
				},
				{
					name: "column-reverse",
					description: "Same as 'column', except the main-start and main-end directions are swapped.",
				},
				{
					name: "row",
					description:
						"The flex container's main axis has the same orientation as the inline axis of the current writing mode.",
				},
				{
					name: "row-reverse",
					description: "Same as 'row', except the main-start and main-end directions are swapped.",
				},
			],
			relevance: 50,
			description:
				"Specifies how flex items are placed in the flex container, by setting the direction of the flex container's main axis.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-flex-flow",
			browsers: ["IE10"],
			values: [
				{
					name: "column",
					description:
						"The flex container's main axis has the same orientation as the block axis of the current writing mode.",
				},
				{
					name: "column-reverse",
					description: "Same as 'column', except the main-start and main-end directions are swapped.",
				},
				{
					name: "nowrap",
					description: "The flex container is single-line.",
				},
				{
					name: "row",
					description:
						"The flex container's main axis has the same orientation as the inline axis of the current writing mode.",
				},
				{
					name: "wrap",
					description: "The flexbox is multi-line.",
				},
				{
					name: "wrap-reverse",
					description: "Same as 'wrap', except the cross-start and cross-end directions are swapped.",
				},
			],
			relevance: 50,
			description: "Specifies how flexbox items are placed in the flexbox.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-flex-item-align",
			browsers: ["IE10"],
			values: [
				{
					name: "auto",
					description:
						"Computes to the value of 'align-items' on the element's parent, or 'stretch' if the element has no parent. On absolutely positioned elements, it computes to itself.",
				},
				{
					name: "baseline",
					description:
						"If the flex item's inline axis is the same as the cross axis, this value is identical to 'flex-start'. Otherwise, it participates in baseline alignment.",
				},
				{
					name: "center",
					description: "The flex item's margin box is centered in the cross axis within the line.",
				},
				{
					name: "end",
					description:
						"The cross-end margin edge of the flex item is placed flush with the cross-end edge of the line.",
				},
				{
					name: "start",
					description:
						"The cross-start margin edge of the flex item is placed flush with the cross-start edge of the line.",
				},
				{
					name: "stretch",
					description:
						"If the cross size property of the flex item computes to auto, and neither of the cross-axis margins are auto, the flex item is stretched.",
				},
			],
			relevance: 50,
			description: "Allows the default alignment along the cross axis to be overridden for individual flex items.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-flex-line-pack",
			browsers: ["IE10"],
			values: [
				{
					name: "center",
					description: "Lines are packed toward the center of the flex container.",
				},
				{
					name: "distribute",
					description: "Lines are evenly distributed in the flex container, with half-size spaces on either end.",
				},
				{
					name: "end",
					description: "Lines are packed toward the end of the flex container.",
				},
				{
					name: "justify",
					description: "Lines are evenly distributed in the flex container.",
				},
				{
					name: "start",
					description: "Lines are packed toward the start of the flex container.",
				},
				{
					name: "stretch",
					description: "Lines stretch to take up the remaining space.",
				},
			],
			relevance: 50,
			description:
				"Aligns a flex container's lines within the flex container when there is extra space in the cross-axis, similar to how 'justify-content' aligns individual items within the main-axis.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-flex-order",
			browsers: ["IE10"],
			relevance: 50,
			description:
				"Controls the order in which children of a flex container appear within the flex container, by assigning them to ordinal groups.",
			restrictions: ["integer"],
		},
		{
			name: "-ms-flex-pack",
			browsers: ["IE10"],
			values: [
				{
					name: "center",
					description: "Flex items are packed toward the center of the line.",
				},
				{
					name: "distribute",
					description: "Flex items are evenly distributed in the line, with half-size spaces on either end.",
				},
				{
					name: "end",
					description: "Flex items are packed toward the end of the line.",
				},
				{
					name: "justify",
					description: "Flex items are evenly distributed in the line.",
				},
				{
					name: "start",
					description: "Flex items are packed toward the start of the line.",
				},
			],
			relevance: 50,
			description: "Aligns flex items along the main axis of the current line of the flex container.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-flex-wrap",
			browsers: ["IE10"],
			values: [
				{
					name: "nowrap",
					description: "The flex container is single-line.",
				},
				{
					name: "wrap",
					description: "The flexbox is multi-line.",
				},
				{
					name: "wrap-reverse",
					description: "Same as 'wrap', except the cross-start and cross-end directions are swapped.",
				},
			],
			relevance: 50,
			description:
				"Controls whether the flex container is single-line or multi-line, and the direction of the cross-axis, which determines the direction new lines are stacked in.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-flow-from",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "none",
					description: "The block container is not a CSS Region.",
				},
			],
			status: "nonstandard",
			syntax: "[ none | <custom-ident> ]#",
			relevance: 0,
			description: "Makes a block container a region and associates it with a named flow.",
			restrictions: ["identifier"],
		},
		{
			name: "-ms-flow-into",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "none",
					description: "The element is not moved to a named flow and normal CSS processing takes place.",
				},
			],
			status: "nonstandard",
			syntax: "[ none | <custom-ident> ]#",
			relevance: 0,
			description: "Places an element or its contents into a named flow.",
			restrictions: ["identifier"],
		},
		{
			name: "-ms-grid-column",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "auto",
				},
				{
					name: "end",
				},
				{
					name: "start",
				},
			],
			relevance: 50,
			description: "Used to place grid items and explicitly defined grid cells in the Grid.",
			restrictions: ["integer", "string", "enum"],
		},
		{
			name: "-ms-grid-column-align",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "center",
					description: "Places the center of the Grid Item's margin box at the center of the Grid Item's column.",
				},
				{
					name: "end",
					description: "Aligns the end edge of the Grid Item's margin box to the end edge of the Grid Item's column.",
				},
				{
					name: "start",
					description:
						"Aligns the starting edge of the Grid Item's margin box to the starting edge of the Grid Item's column.",
				},
				{
					name: "stretch",
					description: "Ensures that the Grid Item's margin box is equal to the size of the Grid Item's column.",
				},
			],
			relevance: 50,
			description: "Aligns the columns in a grid.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-grid-columns",
			browsers: ["E", "IE10"],
			status: "nonstandard",
			syntax: "none | <track-list> | <auto-track-list>",
			relevance: 0,
			description: "Lays out the columns of the grid.",
		},
		{
			name: "-ms-grid-column-span",
			browsers: ["E", "IE10"],
			relevance: 50,
			description: "Specifies the number of columns to span.",
			restrictions: ["integer"],
		},
		{
			name: "-ms-grid-layer",
			browsers: ["E", "IE10"],
			relevance: 50,
			description:
				"Grid-layer is similar in concept to z-index, but avoids overloading the meaning of the z-index property, which is applicable only to positioned elements.",
			restrictions: ["integer"],
		},
		{
			name: "-ms-grid-row",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "auto",
				},
				{
					name: "end",
				},
				{
					name: "start",
				},
			],
			relevance: 50,
			description: "grid-row is used to place grid items and explicitly defined grid cells in the Grid.",
			restrictions: ["integer", "string", "enum"],
		},
		{
			name: "-ms-grid-row-align",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "center",
					description: "Places the center of the Grid Item's margin box at the center of the Grid Item's row.",
				},
				{
					name: "end",
					description: "Aligns the end edge of the Grid Item's margin box to the end edge of the Grid Item's row.",
				},
				{
					name: "start",
					description:
						"Aligns the starting edge of the Grid Item's margin box to the starting edge of the Grid Item's row.",
				},
				{
					name: "stretch",
					description: "Ensures that the Grid Item's margin box is equal to the size of the Grid Item's row.",
				},
			],
			relevance: 50,
			description: "Aligns the rows in a grid.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-grid-rows",
			browsers: ["E", "IE10"],
			status: "nonstandard",
			syntax: "none | <track-list> | <auto-track-list>",
			relevance: 0,
			description: "Lays out the columns of the grid.",
		},
		{
			name: "-ms-grid-row-span",
			browsers: ["E", "IE10"],
			relevance: 50,
			description: "Specifies the number of rows to span.",
			restrictions: ["integer"],
		},
		{
			name: "-ms-high-contrast-adjust",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "auto",
					description: "Properties will be adjusted as applicable.",
				},
				{
					name: "none",
					description: "No adjustments will be applied.",
				},
			],
			status: "nonstandard",
			syntax: "auto | none",
			relevance: 0,
			description: "Specifies if properties should be adjusted in high contrast mode.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-hyphenate-limit-chars",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "auto",
					description: "The user agent chooses a value that adapts to the current layout.",
				},
			],
			status: "nonstandard",
			syntax: "auto | <integer>{1,3}",
			relevance: 0,
			description: "Specifies the minimum number of characters in a hyphenated word.",
			restrictions: ["integer"],
		},
		{
			name: "-ms-hyphenate-limit-lines",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "no-limit",
					description: "There is no limit.",
				},
			],
			status: "nonstandard",
			syntax: "no-limit | <integer>",
			relevance: 0,
			description: "Indicates the maximum number of successive hyphenated lines in an element.",
			restrictions: ["integer"],
		},
		{
			name: "-ms-hyphenate-limit-zone",
			browsers: ["E", "IE10"],
			status: "nonstandard",
			syntax: "<percentage> | <length>",
			relevance: 0,
			description:
				"Specifies the maximum amount of unfilled space (before justification) that may be left in the line box before hyphenation is triggered to pull part of a word from the next line back up into the current line.",
			restrictions: ["percentage", "length"],
		},
		{
			name: "-ms-hyphens",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "auto",
					description:
						"Conditional hyphenation characters inside a word, if present, take priority over automatic resources when determining hyphenation points within the word.",
				},
				{
					name: "manual",
					description:
						"Words are only broken at line breaks where there are characters inside the word that suggest line break opportunities",
				},
				{
					name: "none",
					description:
						"Words are not broken at line breaks, even if characters inside the word suggest line break points.",
				},
			],
			relevance: 50,
			description: "Controls whether hyphenation is allowed to create more break opportunities within a line of text.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-ime-mode",
			browsers: ["IE10"],
			values: [
				{
					name: "active",
					description:
						"The input method editor is initially active; text entry is performed using it unless the user specifically dismisses it.",
				},
				{
					name: "auto",
					description: "No change is made to the current input method editor state. This is the default.",
				},
				{
					name: "disabled",
					description: "The input method editor is disabled and may not be activated by the user.",
				},
				{
					name: "inactive",
					description: "The input method editor is initially inactive, but the user may activate it if they wish.",
				},
				{
					name: "normal",
					description:
						"The IME state should be normal; this value can be used in a user style sheet to override the page setting.",
				},
			],
			relevance: 50,
			description: "Controls the state of the input method editor for text fields.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-interpolation-mode",
			browsers: ["IE7"],
			values: [
				{
					name: "bicubic",
				},
				{
					name: "nearest-neighbor",
				},
			],
			relevance: 50,
			description: "Gets or sets the interpolation (resampling) method used to stretch images.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-layout-grid",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "char",
					description: "Any of the range of character values available to the -ms-layout-grid-char property.",
				},
				{
					name: "line",
					description: "Any of the range of line values available to the -ms-layout-grid-line property.",
				},
				{
					name: "mode",
					description: "Any of the range of mode values available to the -ms-layout-grid-mode property.",
				},
				{
					name: "type",
					description: "Any of the range of type values available to the -ms-layout-grid-type property.",
				},
			],
			relevance: 50,
			description:
				"Sets or retrieves the composite document grid properties that specify the layout of text characters.",
		},
		{
			name: "-ms-layout-grid-char",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "auto",
					description: "Largest character in the font of the element is used to set the character grid.",
				},
				{
					name: "none",
					description: "Default. No character grid is set.",
				},
			],
			relevance: 50,
			description:
				"Sets or retrieves the size of the character grid used for rendering the text content of an element.",
			restrictions: ["enum", "length", "percentage"],
		},
		{
			name: "-ms-layout-grid-line",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "auto",
					description: "Largest character in the font of the element is used to set the character grid.",
				},
				{
					name: "none",
					description: "Default. No grid line is set.",
				},
			],
			relevance: 50,
			description: "Sets or retrieves the gridline value used for rendering the text content of an element.",
			restrictions: ["length"],
		},
		{
			name: "-ms-layout-grid-mode",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "both",
					description:
						"Default. Both the char and line grid modes are enabled. This setting is necessary to fully enable the layout grid on an element.",
				},
				{
					name: "char",
					description:
						"Only a character grid is used. This is recommended for use with block-level elements, such as a blockquote, where the line grid is intended to be disabled.",
				},
				{
					name: "line",
					description:
						"Only a line grid is used. This is recommended for use with inline elements, such as a span, to disable the horizontal grid on runs of text that act as a single entity in the grid layout.",
				},
				{
					name: "none",
					description: "No grid is used.",
				},
			],
			relevance: 50,
			description: "Gets or sets whether the text layout grid uses two dimensions.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-layout-grid-type",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "fixed",
					description:
						"Grid used for monospaced layout. All noncursive characters are treated as equal; every character is centered within a single grid space by default.",
				},
				{
					name: "loose",
					description: "Default. Grid used for Japanese and Korean characters.",
				},
				{
					name: "strict",
					description:
						"Grid used for Chinese, as well as Japanese (Genko) and Korean characters. Only the ideographs, kanas, and wide characters are snapped to the grid.",
				},
			],
			relevance: 50,
			description: "Sets or retrieves the type of grid used for rendering the text content of an element.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-line-break",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "auto",
					description:
						"The UA determines the set of line-breaking restrictions to use for CJK scripts, and it may vary the restrictions based on the length of the line; e.g., use a less restrictive set of line-break rules for short lines.",
				},
				{
					name: "keep-all",
					description:
						"Sequences of CJK characters can no longer break on implied break points. This option should only be used where the presence of word separator characters still creates line-breaking opportunities, as in Korean.",
				},
				{
					name: "newspaper",
					description:
						"Breaks CJK scripts using the least restrictive set of line-breaking rules. Typically used for short lines, such as in newspapers.",
				},
				{
					name: "normal",
					description: "Breaks CJK scripts using a normal set of line-breaking rules.",
				},
				{
					name: "strict",
					description: "Breaks CJK scripts using a more restrictive set of line-breaking rules than 'normal'.",
				},
			],
			relevance: 50,
			description: "Specifies what set of line breaking restrictions are in effect within the element.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-overflow-style",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "auto",
					description: "No preference, UA should use the first scrolling method in the list that it supports.",
				},
				{
					name: "-ms-autohiding-scrollbar",
					description:
						"Indicates the element displays auto-hiding scrollbars during mouse interactions and panning indicators during touch and keyboard interactions.",
				},
				{
					name: "none",
					description:
						"Indicates the element does not display scrollbars or panning indicators, even when its content overflows.",
				},
				{
					name: "scrollbar",
					description:
						'Scrollbars are typically narrow strips inserted on one or two edges of an element and which often have arrows to click on and a "thumb" to drag up and down (or left and right) to move the contents of the element.',
				},
			],
			status: "nonstandard",
			syntax: "auto | none | scrollbar | -ms-autohiding-scrollbar",
			relevance: 0,
			description: "Specify whether content is clipped when it overflows the element's content area.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-perspective",
			browsers: ["IE10"],
			values: [
				{
					name: "none",
					description: "No perspective transform is applied.",
				},
			],
			relevance: 50,
			description:
				"Applies the same transform as the perspective(<number>) transform function, except that it applies only to the positioned or transformed children of the element, not to the transform on the element itself.",
			restrictions: ["length"],
		},
		{
			name: "-ms-perspective-origin",
			browsers: ["IE10"],
			relevance: 50,
			description:
				"Establishes the origin for the perspective property. It effectively sets the X and Y position at which the viewer appears to be looking at the children of the element.",
			restrictions: ["position", "percentage", "length"],
		},
		{
			name: "-ms-perspective-origin-x",
			browsers: ["IE10"],
			relevance: 50,
			description:
				"Establishes the origin for the perspective property. It effectively sets the X  position at which the viewer appears to be looking at the children of the element.",
			restrictions: ["position", "percentage", "length"],
		},
		{
			name: "-ms-perspective-origin-y",
			browsers: ["IE10"],
			relevance: 50,
			description:
				"Establishes the origin for the perspective property. It effectively sets the Y position at which the viewer appears to be looking at the children of the element.",
			restrictions: ["position", "percentage", "length"],
		},
		{
			name: "-ms-progress-appearance",
			browsers: ["IE10"],
			values: [
				{
					name: "bar",
				},
				{
					name: "ring",
				},
			],
			relevance: 50,
			description: "Gets or sets a value that specifies whether a progress control displays as a bar or a ring.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-scrollbar-3dlight-color",
			browsers: ["IE8"],
			status: "nonstandard",
			syntax: "<color>",
			relevance: 0,
			description:
				"Determines the color of the top and left edges of the scroll box and scroll arrows of a scroll bar.",
			restrictions: ["color"],
		},
		{
			name: "-ms-scrollbar-arrow-color",
			browsers: ["IE8"],
			status: "nonstandard",
			syntax: "<color>",
			relevance: 0,
			description: "Determines the color of the arrow elements of a scroll arrow.",
			restrictions: ["color"],
		},
		{
			name: "-ms-scrollbar-base-color",
			browsers: ["IE8"],
			status: "nonstandard",
			syntax: "<color>",
			relevance: 0,
			description:
				"Determines the color of the main elements of a scroll bar, which include the scroll box, track, and scroll arrows.",
			restrictions: ["color"],
		},
		{
			name: "-ms-scrollbar-darkshadow-color",
			browsers: ["IE8"],
			status: "nonstandard",
			syntax: "<color>",
			relevance: 0,
			description: "Determines the color of the gutter of a scroll bar.",
			restrictions: ["color"],
		},
		{
			name: "-ms-scrollbar-face-color",
			browsers: ["IE8"],
			status: "nonstandard",
			syntax: "<color>",
			relevance: 0,
			description: "Determines the color of the scroll box and scroll arrows of a scroll bar.",
			restrictions: ["color"],
		},
		{
			name: "-ms-scrollbar-highlight-color",
			browsers: ["IE8"],
			status: "nonstandard",
			syntax: "<color>",
			relevance: 0,
			description:
				"Determines the color of the top and left edges of the scroll box and scroll arrows of a scroll bar.",
			restrictions: ["color"],
		},
		{
			name: "-ms-scrollbar-shadow-color",
			browsers: ["IE8"],
			status: "nonstandard",
			syntax: "<color>",
			relevance: 0,
			description:
				"Determines the color of the bottom and right edges of the scroll box and scroll arrows of a scroll bar.",
			restrictions: ["color"],
		},
		{
			name: "-ms-scrollbar-track-color",
			browsers: ["IE8"],
			status: "nonstandard",
			syntax: "<color>",
			relevance: 0,
			description: "Determines the color of the track element of a scroll bar.",
			restrictions: ["color"],
		},
		{
			name: "-ms-scroll-chaining",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "chained",
				},
				{
					name: "none",
				},
			],
			status: "nonstandard",
			syntax: "chained | none",
			relevance: 0,
			description:
				"Gets or sets a value that indicates the scrolling behavior that occurs when a user hits the content boundary during a manipulation.",
			restrictions: ["enum", "length"],
		},
		{
			name: "-ms-scroll-limit",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "auto",
				},
			],
			status: "nonstandard",
			syntax:
				"<'-ms-scroll-limit-x-min'> <'-ms-scroll-limit-y-min'> <'-ms-scroll-limit-x-max'> <'-ms-scroll-limit-y-max'>",
			relevance: 0,
			description:
				"Gets or sets a shorthand value that sets values for the -ms-scroll-limit-x-min, -ms-scroll-limit-y-min, -ms-scroll-limit-x-max, and -ms-scroll-limit-y-max properties.",
			restrictions: ["length"],
		},
		{
			name: "-ms-scroll-limit-x-max",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "auto",
				},
			],
			status: "nonstandard",
			syntax: "auto | <length>",
			relevance: 0,
			description: "Gets or sets a value that specifies the maximum value for the scrollLeft property.",
			restrictions: ["length"],
		},
		{
			name: "-ms-scroll-limit-x-min",
			browsers: ["E", "IE10"],
			status: "nonstandard",
			syntax: "<length>",
			relevance: 0,
			description: "Gets or sets a value that specifies the minimum value for the scrollLeft property.",
			restrictions: ["length"],
		},
		{
			name: "-ms-scroll-limit-y-max",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "auto",
				},
			],
			status: "nonstandard",
			syntax: "auto | <length>",
			relevance: 0,
			description: "Gets or sets a value that specifies the maximum value for the scrollTop property.",
			restrictions: ["length"],
		},
		{
			name: "-ms-scroll-limit-y-min",
			browsers: ["E", "IE10"],
			status: "nonstandard",
			syntax: "<length>",
			relevance: 0,
			description: "Gets or sets a value that specifies the minimum value for the scrollTop property.",
			restrictions: ["length"],
		},
		{
			name: "-ms-scroll-rails",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "none",
				},
				{
					name: "railed",
				},
			],
			status: "nonstandard",
			syntax: "none | railed",
			relevance: 0,
			description:
				"Gets or sets a value that indicates whether or not small motions perpendicular to the primary axis of motion will result in either changes to both the scrollTop and scrollLeft properties or a change to the primary axis (for instance, either the scrollTop or scrollLeft properties will change, but not both).",
			restrictions: ["enum", "length"],
		},
		{
			name: "-ms-scroll-snap-points-x",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "snapInterval(100%, 100%)",
				},
				{
					name: "snapList()",
				},
			],
			status: "nonstandard",
			syntax: "snapInterval( <length-percentage>, <length-percentage> ) | snapList( <length-percentage># )",
			relevance: 0,
			description: "Gets or sets a value that defines where snap-points will be located along the x-axis.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-scroll-snap-points-y",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "snapInterval(100%, 100%)",
				},
				{
					name: "snapList()",
				},
			],
			status: "nonstandard",
			syntax: "snapInterval( <length-percentage>, <length-percentage> ) | snapList( <length-percentage># )",
			relevance: 0,
			description: "Gets or sets a value that defines where snap-points will be located along the y-axis.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-scroll-snap-type",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "none",
					description: "The visual viewport of this scroll container must ignore snap points, if any, when scrolled.",
				},
				{
					name: "mandatory",
					description:
						"The visual viewport of this scroll container is guaranteed to rest on a snap point when there are no active scrolling operations.",
				},
				{
					name: "proximity",
					description:
						"The visual viewport of this scroll container may come to rest on a snap point at the termination of a scroll at the discretion of the UA given the parameters of the scroll.",
				},
			],
			status: "nonstandard",
			syntax: "none | proximity | mandatory",
			relevance: 0,
			description:
				"Gets or sets a value that defines what type of snap-point should be used for the current element. There are two type of snap-points, with the primary difference being whether or not the user is guaranteed to always stop on a snap-point.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-scroll-snap-x",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "mandatory",
				},
				{
					name: "none",
				},
				{
					name: "proximity",
				},
				{
					name: "snapInterval(100%, 100%)",
				},
				{
					name: "snapList()",
				},
			],
			status: "nonstandard",
			syntax: "<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-x'>",
			relevance: 0,
			description:
				"Gets or sets a shorthand value that sets values for the -ms-scroll-snap-type and -ms-scroll-snap-points-x properties.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-scroll-snap-y",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "mandatory",
				},
				{
					name: "none",
				},
				{
					name: "proximity",
				},
				{
					name: "snapInterval(100%, 100%)",
				},
				{
					name: "snapList()",
				},
			],
			status: "nonstandard",
			syntax: "<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-y'>",
			relevance: 0,
			description:
				"Gets or sets a shorthand value that sets values for the -ms-scroll-snap-type and -ms-scroll-snap-points-y properties.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-scroll-translation",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "none",
				},
				{
					name: "vertical-to-horizontal",
				},
			],
			status: "nonstandard",
			syntax: "none | vertical-to-horizontal",
			relevance: 0,
			description:
				"Gets or sets a value that specifies whether vertical-to-horizontal scroll wheel translation occurs on the specified element.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-text-align-last",
			browsers: ["E", "IE8"],
			values: [
				{
					name: "auto",
				},
				{
					name: "center",
					description: "The inline contents are centered within the line box.",
				},
				{
					name: "justify",
					description: "The text is justified according to the method specified by the 'text-justify' property.",
				},
				{
					name: "left",
					description:
						"The inline contents are aligned to the left edge of the line box. In vertical text, 'left' aligns to the edge of the line box that would be the start edge for left-to-right text.",
				},
				{
					name: "right",
					description:
						"The inline contents are aligned to the right edge of the line box. In vertical text, 'right' aligns to the edge of the line box that would be the end edge for left-to-right text.",
				},
			],
			relevance: 50,
			description:
				"Describes how the last line of a block or a line right before a forced line break is aligned when 'text-align' is set to 'justify'.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-text-autospace",
			browsers: ["E", "IE8"],
			values: [
				{
					name: "ideograph-alpha",
					description:
						"Creates 1/4em extra spacing between runs of ideographic letters and non-ideographic letters, such as Latin-based, Cyrillic, Greek, Arabic or Hebrew.",
				},
				{
					name: "ideograph-numeric",
					description: "Creates 1/4em extra spacing between runs of ideographic letters and numeric glyphs.",
				},
				{
					name: "ideograph-parenthesis",
					description: "Creates extra spacing between normal (non wide) parenthesis and ideographs.",
				},
				{
					name: "ideograph-space",
					description: "Extends the width of the space character while surrounded by ideographs.",
				},
				{
					name: "none",
					description: "No extra space is created.",
				},
				{
					name: "punctuation",
					description:
						"Creates extra non-breaking spacing around punctuation as required by language-specific typographic conventions.",
				},
			],
			status: "nonstandard",
			syntax: "none | ideograph-alpha | ideograph-numeric | ideograph-parenthesis | ideograph-space",
			relevance: 0,
			description:
				"Determines whether or not a full-width punctuation mark character should be trimmed if it appears at the beginning of a line, so that its 'ink' lines up with the first glyph in the line above and below.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-text-combine-horizontal",
			browsers: ["E", "IE11"],
			values: [
				{
					name: "all",
					description:
						"Attempt to typeset horizontally all consecutive characters within the box such that they take up the space of a single character within the vertical line box.",
				},
				{
					name: "digits",
					description:
						"Attempt to typeset horizontally each maximal sequence of consecutive ASCII digits (U+0030-U+0039) that has as many or fewer characters than the specified integer such that it takes up the space of a single character within the vertical line box.",
				},
				{
					name: "none",
					description: "No special processing.",
				},
			],
			relevance: 50,
			description:
				"This property specifies the combination of multiple characters into the space of a single character.",
			restrictions: ["enum", "integer"],
		},
		{
			name: "-ms-text-justify",
			browsers: ["E", "IE8"],
			values: [
				{
					name: "auto",
					description:
						"The UA determines the justification algorithm to follow, based on a balance between performance and adequate presentation quality.",
				},
				{
					name: "distribute",
					description:
						"Justification primarily changes spacing both at word separators and at grapheme cluster boundaries in all scripts except those in the connected and cursive groups. This value is sometimes used in e.g. Japanese, often with the 'text-align-last' property.",
				},
				{
					name: "inter-cluster",
					description:
						"Justification primarily changes spacing at word separators and at grapheme cluster boundaries in clustered scripts. This value is typically used for Southeast Asian scripts such as Thai.",
				},
				{
					name: "inter-ideograph",
					description:
						"Justification primarily changes spacing at word separators and at inter-graphemic boundaries in scripts that use no word spaces. This value is typically used for CJK languages.",
				},
				{
					name: "inter-word",
					description:
						"Justification primarily changes spacing at word separators. This value is typically used for languages that separate words using spaces, like English or (sometimes) Korean.",
				},
				{
					name: "kashida",
					description:
						"Justification primarily stretches Arabic and related scripts through the use of kashida or other calligraphic elongation.",
				},
			],
			relevance: 50,
			description:
				"Selects the justification algorithm used when 'text-align' is set to 'justify'. The property applies to block containers, but the UA may (but is not required to) also support it on inline elements.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-text-kashida-space",
			browsers: ["E", "IE10"],
			relevance: 50,
			description:
				"Sets or retrieves the ratio of kashida expansion to white space expansion when justifying lines of text in the object.",
			restrictions: ["percentage"],
		},
		{
			name: "-ms-text-overflow",
			browsers: ["IE10"],
			values: [
				{
					name: "clip",
					description: "Clip inline content that overflows. Characters may be only partially rendered.",
				},
				{
					name: "ellipsis",
					description: "Render an ellipsis character (U+2026) to represent clipped inline content.",
				},
			],
			relevance: 50,
			description: "Text can overflow for example when it is prevented from wrapping",
			restrictions: ["enum"],
		},
		{
			name: "-ms-text-size-adjust",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "auto",
					description: "Renderers must use the default size adjustment when displaying on a small device.",
				},
				{
					name: "none",
					description: "Renderers must not do size adjustment when displaying on a small device.",
				},
			],
			relevance: 50,
			description: "Specifies a size adjustment for displaying text content in mobile browsers.",
			restrictions: ["enum", "percentage"],
		},
		{
			name: "-ms-text-underline-position",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "alphabetic",
					description:
						"The underline is aligned with the alphabetic baseline. In this case the underline is likely to cross some descenders.",
				},
				{
					name: "auto",
					description:
						"The user agent may use any algorithm to determine the underline's position. In horizontal line layout, the underline should be aligned as for alphabetic. In vertical line layout, if the language is set to Japanese or Korean, the underline should be aligned as for over.",
				},
				{
					name: "over",
					description:
						"The underline is aligned with the 'top' (right in vertical writing) edge of the element's em-box. In this mode, an overline also switches sides.",
				},
				{
					name: "under",
					description:
						"The underline is aligned with the 'bottom' (left in vertical writing) edge of the element's em-box. In this case the underline usually does not cross the descenders. This is sometimes called 'accounting' underline.",
				},
			],
			relevance: 50,
			description:
				"Sets the position of an underline specified on the same element: it does not affect underlines specified by ancestor elements.This property is typically used in vertical writing contexts such as in Japanese documents where it often desired to have the underline appear 'over' (to the right of) the affected run of text",
			restrictions: ["enum"],
		},
		{
			name: "-ms-touch-action",
			browsers: ["IE10"],
			values: [
				{
					name: "auto",
					description: "The element is a passive element, with several exceptions.",
				},
				{
					name: "double-tap-zoom",
					description: "The element will zoom on double-tap.",
				},
				{
					name: "manipulation",
					description: "The element is a manipulation-causing element.",
				},
				{
					name: "none",
					description: "The element is a manipulation-blocking element.",
				},
				{
					name: "pan-x",
					description:
						"The element permits touch-driven panning on the horizontal axis. The touch pan is performed on the nearest ancestor with horizontally scrollable content.",
				},
				{
					name: "pan-y",
					description:
						"The element permits touch-driven panning on the vertical axis. The touch pan is performed on the nearest ancestor with vertically scrollable content.",
				},
				{
					name: "pinch-zoom",
					description:
						"The element permits pinch-zooming. The pinch-zoom is performed on the nearest ancestor with zoomable content.",
				},
			],
			relevance: 50,
			description: "Gets or sets a value that indicates whether and how a given region can be manipulated by the user.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-touch-select",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "grippers",
					description: "Grippers are always on.",
				},
				{
					name: "none",
					description: "Grippers are always off.",
				},
			],
			status: "nonstandard",
			syntax: "grippers | none",
			relevance: 0,
			description: "Gets or sets a value that toggles the 'gripper' visual elements that enable touch text selection.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-transform",
			browsers: ["IE9-9"],
			values: [
				{
					name: "matrix()",
					description:
						"Specifies a 2D transformation in the form of a transformation matrix of six values. matrix(a,b,c,d,e,f) is equivalent to applying the transformation matrix [a b c d e f]",
				},
				{
					name: "matrix3d()",
					description: "Specifies a 3D transformation as a 4x4 homogeneous matrix of 16 values in column-major order.",
				},
				{
					name: "none",
				},
				{
					name: "rotate()",
					description:
						"Specifies a 2D rotation by the angle specified in the parameter about the origin of the element, as defined by the transform-origin property.",
				},
				{
					name: "rotate3d()",
					description:
						"Specifies a clockwise 3D rotation by the angle specified in last parameter about the [x,y,z] direction vector described by the first 3 parameters.",
				},
				{
					name: "rotateX('angle')",
					description: "Specifies a clockwise rotation by the given angle about the X axis.",
				},
				{
					name: "rotateY('angle')",
					description: "Specifies a clockwise rotation by the given angle about the Y axis.",
				},
				{
					name: "rotateZ('angle')",
					description: "Specifies a clockwise rotation by the given angle about the Z axis.",
				},
				{
					name: "scale()",
					description:
						"Specifies a 2D scale operation by the [sx,sy] scaling vector described by the 2 parameters. If the second parameter is not provided, it is takes a value equal to the first.",
				},
				{
					name: "scale3d()",
					description: "Specifies a 3D scale operation by the [sx,sy,sz] scaling vector described by the 3 parameters.",
				},
				{
					name: "scaleX()",
					description:
						"Specifies a scale operation using the [sx,1] scaling vector, where sx is given as the parameter.",
				},
				{
					name: "scaleY()",
					description:
						"Specifies a scale operation using the [sy,1] scaling vector, where sy is given as the parameter.",
				},
				{
					name: "scaleZ()",
					description:
						"Specifies a scale operation using the [1,1,sz] scaling vector, where sz is given as the parameter.",
				},
				{
					name: "skew()",
					description:
						"Specifies a skew transformation along the X and Y axes. The first angle parameter specifies the skew on the X axis. The second angle parameter specifies the skew on the Y axis. If the second parameter is not given then a value of 0 is used for the Y angle (ie: no skew on the Y axis).",
				},
				{
					name: "skewX()",
					description: "Specifies a skew transformation along the X axis by the given angle.",
				},
				{
					name: "skewY()",
					description: "Specifies a skew transformation along the Y axis by the given angle.",
				},
				{
					name: "translate()",
					description:
						"Specifies a 2D translation by the vector [tx, ty], where tx is the first translation-value parameter and ty is the optional second translation-value parameter.",
				},
				{
					name: "translate3d()",
					description:
						"Specifies a 3D translation by the vector [tx,ty,tz], with tx, ty and tz being the first, second and third translation-value parameters respectively.",
				},
				{
					name: "translateX()",
					description: "Specifies a translation by the given amount in the X direction.",
				},
				{
					name: "translateY()",
					description: "Specifies a translation by the given amount in the Y direction.",
				},
				{
					name: "translateZ()",
					description:
						"Specifies a translation by the given amount in the Z direction. Note that percentage values are not allowed in the translateZ translation-value, and if present are evaluated as 0.",
				},
			],
			relevance: 50,
			description:
				"A two-dimensional transformation is applied to an element through the 'transform' property. This property contains a list of transform functions similar to those allowed by SVG.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-transform-origin",
			browsers: ["IE9-9"],
			relevance: 50,
			description: "Establishes the origin of transformation for an element.",
			restrictions: ["position", "length", "percentage"],
		},
		{
			name: "-ms-transform-origin-x",
			browsers: ["IE10"],
			relevance: 50,
			description:
				"The x coordinate of the origin for transforms applied to an element with respect to its border box.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "-ms-transform-origin-y",
			browsers: ["IE10"],
			relevance: 50,
			description:
				"The y coordinate of the origin for transforms applied to an element with respect to its border box.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "-ms-transform-origin-z",
			browsers: ["IE10"],
			relevance: 50,
			description:
				"The z coordinate of the origin for transforms applied to an element with respect to its border box.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "-ms-user-select",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "element",
				},
				{
					name: "none",
				},
				{
					name: "text",
				},
			],
			status: "nonstandard",
			syntax: "none | element | text",
			relevance: 0,
			description: "Controls the appearance of selection.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-word-break",
			browsers: ["IE8"],
			values: [
				{
					name: "break-all",
					description: "Lines may break between any two grapheme clusters for non-CJK scripts.",
				},
				{
					name: "keep-all",
					description: "Block characters can no longer create implied break points.",
				},
				{
					name: "normal",
					description: "Breaks non-CJK scripts according to their own rules.",
				},
			],
			relevance: 50,
			description: "Specifies line break opportunities for non-CJK scripts.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-word-wrap",
			browsers: ["IE8"],
			values: [
				{
					name: "break-word",
					description:
						"An unbreakable 'word' may be broken at an arbitrary point if there are no otherwise-acceptable break points in the line.",
				},
				{
					name: "normal",
					description: "Lines may break only at allowed break points.",
				},
			],
			relevance: 50,
			description:
				"Specifies whether the UA may break within a word to prevent overflow when an otherwise-unbreakable string is too long to fit.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-wrap-flow",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "auto",
					description: "For floats an exclusion is created, for all other elements an exclusion is not created.",
				},
				{
					name: "both",
					description: "Inline flow content can flow on all sides of the exclusion.",
				},
				{
					name: "clear",
					description:
						"Inline flow content can only wrap on top and bottom of the exclusion and must leave the areas to the start and end edges of the exclusion box empty.",
				},
				{
					name: "end",
					description:
						"Inline flow content can wrap on the end side of the exclusion area but must leave the area to the start edge of the exclusion area empty.",
				},
				{
					name: "maximum",
					description:
						"Inline flow content can wrap on the side of the exclusion with the largest available space for the given line, and must leave the other side of the exclusion empty.",
				},
				{
					name: "minimum",
					description:
						"Inline flow content can flow around the edge of the exclusion with the smallest available space within the flow content's containing block, and must leave the other edge of the exclusion empty.",
				},
				{
					name: "start",
					description:
						"Inline flow content can wrap on the start edge of the exclusion area but must leave the area to end edge of the exclusion area empty.",
				},
			],
			status: "nonstandard",
			syntax: "auto | both | start | end | maximum | clear",
			relevance: 0,
			description:
				"An element becomes an exclusion when its 'wrap-flow' property has a computed value other than 'auto'.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-wrap-margin",
			browsers: ["E", "IE10"],
			status: "nonstandard",
			syntax: "<length>",
			relevance: 0,
			description: "Gets or sets a value that is used to offset the inner wrap shape from other shapes.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "-ms-wrap-through",
			browsers: ["E", "IE10"],
			values: [
				{
					name: "none",
					description:
						"The exclusion element does not inherit its parent node's wrapping context. Its descendants are only subject to exclusion shapes defined inside the element.",
				},
				{
					name: "wrap",
					description:
						"The exclusion element inherits its parent node's wrapping context. Its descendant inline content wraps around exclusions defined outside the element.",
				},
			],
			status: "nonstandard",
			syntax: "wrap | none",
			relevance: 0,
			description:
				"Specifies if an element inherits its parent wrapping context. In other words if it is subject to the exclusions defined outside the element.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-writing-mode",
			browsers: ["IE8"],
			values: [
				{
					name: "bt-lr",
				},
				{
					name: "bt-rl",
				},
				{
					name: "lr-bt",
				},
				{
					name: "lr-tb",
				},
				{
					name: "rl-bt",
				},
				{
					name: "rl-tb",
				},
				{
					name: "tb-lr",
				},
				{
					name: "tb-rl",
				},
			],
			relevance: 50,
			description: "Shorthand property for both 'direction' and 'block-progression'.",
			restrictions: ["enum"],
		},
		{
			name: "-ms-zoom",
			browsers: ["IE8"],
			values: [
				{
					name: "normal",
				},
			],
			relevance: 50,
			description: "Sets or retrieves the magnification scale of the object.",
			restrictions: ["enum", "integer", "number", "percentage"],
		},
		{
			name: "-ms-zoom-animation",
			browsers: ["IE10"],
			values: [
				{
					name: "default",
				},
				{
					name: "none",
				},
			],
			relevance: 50,
			description: "Gets or sets a value that indicates whether an animation is used when zooming.",
			restrictions: ["enum"],
		},
		{
			name: "nav-down",
			browsers: ["O9.5"],
			values: [
				{
					name: "auto",
					description:
						"The user agent automatically determines which element to navigate the focus to in response to directional navigational input.",
				},
				{
					name: "current",
					description: "Indicates that the user agent should target the frame that the element is in.",
				},
				{
					name: "root",
					description: "Indicates that the user agent should target the full window.",
				},
			],
			relevance: 50,
			description: "Provides an way to control directional focus navigation.",
			restrictions: ["enum", "identifier", "string"],
		},
		{
			name: "nav-index",
			browsers: ["O9.5"],
			values: [
				{
					name: "auto",
					description: "The element's sequential navigation order is assigned automatically by the user agent.",
				},
			],
			relevance: 50,
			description:
				"Provides an input-method-neutral way of specifying the sequential navigation order (also known as 'tabbing order').",
			restrictions: ["number"],
		},
		{
			name: "nav-left",
			browsers: ["O9.5"],
			values: [
				{
					name: "auto",
					description:
						"The user agent automatically determines which element to navigate the focus to in response to directional navigational input.",
				},
				{
					name: "current",
					description: "Indicates that the user agent should target the frame that the element is in.",
				},
				{
					name: "root",
					description: "Indicates that the user agent should target the full window.",
				},
			],
			relevance: 50,
			description: "Provides an way to control directional focus navigation.",
			restrictions: ["enum", "identifier", "string"],
		},
		{
			name: "nav-right",
			browsers: ["O9.5"],
			values: [
				{
					name: "auto",
					description:
						"The user agent automatically determines which element to navigate the focus to in response to directional navigational input.",
				},
				{
					name: "current",
					description: "Indicates that the user agent should target the frame that the element is in.",
				},
				{
					name: "root",
					description: "Indicates that the user agent should target the full window.",
				},
			],
			relevance: 50,
			description: "Provides an way to control directional focus navigation.",
			restrictions: ["enum", "identifier", "string"],
		},
		{
			name: "nav-up",
			browsers: ["O9.5"],
			values: [
				{
					name: "auto",
					description:
						"The user agent automatically determines which element to navigate the focus to in response to directional navigational input.",
				},
				{
					name: "current",
					description: "Indicates that the user agent should target the frame that the element is in.",
				},
				{
					name: "root",
					description: "Indicates that the user agent should target the full window.",
				},
			],
			relevance: 50,
			description: "Provides an way to control directional focus navigation.",
			restrictions: ["enum", "identifier", "string"],
		},
		{
			name: "negative",
			browsers: ["FF33"],
			atRule: "@counter-style",
			syntax: "<symbol> <symbol>?",
			relevance: 50,
			description:
				"@counter-style descriptor. Defines how to alter the representation when the counter value is negative.",
			restrictions: ["image", "identifier", "string"],
		},
		{
			name: "-o-animation",
			browsers: ["O12"],
			values: [
				{
					name: "alternate",
					description:
						"The animation cycle iterations that are odd counts are played in the normal direction, and the animation cycle iterations that are even counts are played in a reverse direction.",
				},
				{
					name: "alternate-reverse",
					description:
						"The animation cycle iterations that are odd counts are played in the reverse direction, and the animation cycle iterations that are even counts are played in a normal direction.",
				},
				{
					name: "backwards",
					description:
						"The beginning property value (as defined in the first @keyframes at-rule) is applied before the animation is displayed, during the period defined by 'animation-delay'.",
				},
				{
					name: "both",
					description: "Both forwards and backwards fill modes are applied.",
				},
				{
					name: "forwards",
					description:
						"The final property value (as defined in the last @keyframes at-rule) is maintained after the animation completes.",
				},
				{
					name: "infinite",
					description: "Causes the animation to repeat forever.",
				},
				{
					name: "none",
					description: "No animation is performed",
				},
				{
					name: "normal",
					description: "Normal playback.",
				},
				{
					name: "reverse",
					description:
						"All iterations of the animation are played in the reverse direction from the way they were specified.",
				},
			],
			relevance: 50,
			description: "Shorthand property combines six of the animation properties into a single property.",
			restrictions: ["time", "enum", "timing-function", "identifier", "number"],
		},
		{
			name: "-o-animation-delay",
			browsers: ["O12"],
			relevance: 50,
			description: "Defines when the animation will start.",
			restrictions: ["time"],
		},
		{
			name: "-o-animation-direction",
			browsers: ["O12"],
			values: [
				{
					name: "alternate",
					description:
						"The animation cycle iterations that are odd counts are played in the normal direction, and the animation cycle iterations that are even counts are played in a reverse direction.",
				},
				{
					name: "alternate-reverse",
					description:
						"The animation cycle iterations that are odd counts are played in the reverse direction, and the animation cycle iterations that are even counts are played in a normal direction.",
				},
				{
					name: "normal",
					description: "Normal playback.",
				},
				{
					name: "reverse",
					description:
						"All iterations of the animation are played in the reverse direction from the way they were specified.",
				},
			],
			relevance: 50,
			description: "Defines whether or not the animation should play in reverse on alternate cycles.",
			restrictions: ["enum"],
		},
		{
			name: "-o-animation-duration",
			browsers: ["O12"],
			relevance: 50,
			description: "Defines the length of time that an animation takes to complete one cycle.",
			restrictions: ["time"],
		},
		{
			name: "-o-animation-fill-mode",
			browsers: ["O12"],
			values: [
				{
					name: "backwards",
					description:
						"The beginning property value (as defined in the first @keyframes at-rule) is applied before the animation is displayed, during the period defined by 'animation-delay'.",
				},
				{
					name: "both",
					description: "Both forwards and backwards fill modes are applied.",
				},
				{
					name: "forwards",
					description:
						"The final property value (as defined in the last @keyframes at-rule) is maintained after the animation completes.",
				},
				{
					name: "none",
					description:
						"There is no change to the property value between the time the animation is applied and the time the animation begins playing or after the animation completes.",
				},
			],
			relevance: 50,
			description: "Defines what values are applied by the animation outside the time it is executing.",
			restrictions: ["enum"],
		},
		{
			name: "-o-animation-iteration-count",
			browsers: ["O12"],
			values: [
				{
					name: "infinite",
					description: "Causes the animation to repeat forever.",
				},
			],
			relevance: 50,
			description:
				"Defines the number of times an animation cycle is played. The default value is one, meaning the animation will play from beginning to end once.",
			restrictions: ["number", "enum"],
		},
		{
			name: "-o-animation-name",
			browsers: ["O12"],
			values: [
				{
					name: "none",
					description: "No animation is performed",
				},
			],
			relevance: 50,
			description:
				"Defines a list of animations that apply. Each name is used to select the keyframe at-rule that provides the property values for the animation.",
			restrictions: ["identifier", "enum"],
		},
		{
			name: "-o-animation-play-state",
			browsers: ["O12"],
			values: [
				{
					name: "paused",
					description: "A running animation will be paused.",
				},
				{
					name: "running",
					description: "Resume playback of a paused animation.",
				},
			],
			relevance: 50,
			description: "Defines whether the animation is running or paused.",
			restrictions: ["enum"],
		},
		{
			name: "-o-animation-timing-function",
			browsers: ["O12"],
			relevance: 50,
			description:
				"Describes how the animation will progress over one cycle of its duration. See the 'transition-timing-function'.",
			restrictions: ["timing-function"],
		},
		{
			name: "object-fit",
			browsers: ["E79", "FF36", "FFA36", "S10", "SM10", "C32", "CA32", "O19"],
			values: [
				{
					name: "contain",
					description:
						"The replaced content is sized to maintain its aspect ratio while fitting within the element's content box: its concrete object size is resolved as a contain constraint against the element's used width and height.",
				},
				{
					name: "cover",
					description:
						"The replaced content is sized to maintain its aspect ratio while filling the element's entire content box: its concrete object size is resolved as a cover constraint against the element's used width and height.",
				},
				{
					name: "fill",
					description:
						"The replaced content is sized to fill the element's content box: the object's concrete object size is the element's used width and height.",
				},
				{
					name: "none",
					description: "The replaced content is not resized to fit inside the element's content box",
				},
				{
					name: "scale-down",
					description:
						"Size the content as if 'none' or 'contain' were specified, whichever would result in a smaller concrete object size.",
				},
			],
			syntax: "fill | contain | cover | none | scale-down",
			relevance: 75,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/object-fit",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Specifies how the contents of a replaced element should be scaled relative to the box established by its used height and width.",
			restrictions: ["enum"],
		},
		{
			name: "object-position",
			browsers: ["E79", "FF36", "FFA36", "S10", "SM10", "C32", "CA32", "O19"],
			syntax: "<position>",
			relevance: 58,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/object-position",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description: "Determines the alignment of the replaced element inside its box.",
			restrictions: ["position", "length", "percentage"],
		},
		{
			name: "-o-border-image",
			browsers: ["O11.6"],
			values: [
				{
					name: "auto",
					description:
						"If 'auto' is specified then the border image width is the intrinsic width or height (whichever is applicable) of the corresponding image slice. If the image does not have the required intrinsic dimension then the corresponding border-width is used instead.",
				},
				{
					name: "fill",
					description: "Causes the middle part of the border-image to be preserved.",
				},
				{
					name: "none",
				},
				{
					name: "repeat",
					description: "The image is tiled (repeated) to fill the area.",
				},
				{
					name: "round",
					description:
						"The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the image is rescaled so that it does.",
				},
				{
					name: "space",
					description:
						"The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the extra space is distributed around the tiles.",
				},
				{
					name: "stretch",
					description: "The image is stretched to fill the area.",
				},
			],
			relevance: 50,
			description:
				"Shorthand property for setting 'border-image-source', 'border-image-slice', 'border-image-width', 'border-image-outset' and 'border-image-repeat'. Omitted values are set to their initial values.",
			restrictions: ["length", "percentage", "number", "image", "enum"],
		},
		{
			name: "-o-object-fit",
			browsers: ["O10.6"],
			values: [
				{
					name: "contain",
					description:
						"The replaced content is sized to maintain its aspect ratio while fitting within the element's content box: its concrete object size is resolved as a contain constraint against the element's used width and height.",
				},
				{
					name: "cover",
					description:
						"The replaced content is sized to maintain its aspect ratio while filling the element's entire content box: its concrete object size is resolved as a cover constraint against the element's used width and height.",
				},
				{
					name: "fill",
					description:
						"The replaced content is sized to fill the element's content box: the object's concrete object size is the element's used width and height.",
				},
				{
					name: "none",
					description: "The replaced content is not resized to fit inside the element's content box",
				},
				{
					name: "scale-down",
					description:
						"Size the content as if 'none' or 'contain' were specified, whichever would result in a smaller concrete object size.",
				},
			],
			relevance: 50,
			description:
				"Specifies how the contents of a replaced element should be scaled relative to the box established by its used height and width.",
			restrictions: ["enum"],
		},
		{
			name: "-o-object-position",
			browsers: ["O10.6"],
			relevance: 50,
			description: "Determines the alignment of the replaced element inside its box.",
			restrictions: ["position", "length", "percentage"],
		},
		{
			name: "opacity",
			browsers: ["E12", "FF1", "FFA4", "S2", "SM1", "C1", "CA18", "IE9", "O9"],
			syntax: "<opacity-value>",
			relevance: 93,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/opacity",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Opacity of an element's text, where 1 is opaque and 0 is entirely transparent.",
			restrictions: ["number(0-1)"],
		},
		{
			name: "order",
			browsers: ["E12", "FF20", "FFA20", "S9", "SM9", "C29", "CA29", "IE11", "O12.1"],
			syntax: "<integer>",
			relevance: 69,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/order",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description:
				"Controls the order in which children of a flex container appear within the flex container, by assigning them to ordinal groups.",
			restrictions: ["integer"],
		},
		{
			name: "orphans",
			browsers: ["E12", "S1.3", "SM1", "C25", "CA25", "IE8", "O9.2"],
			syntax: "<integer>",
			relevance: 51,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/orphans",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"Specifies the minimum number of line boxes in a block container that must be left in a fragment before a fragmentation break.",
			restrictions: ["integer"],
		},
		{
			name: "-o-table-baseline",
			browsers: ["O9.6"],
			relevance: 50,
			description: "Determines which row of a inline-table should be used as baseline of inline-table.",
			restrictions: ["integer"],
		},
		{
			name: "-o-tab-size",
			browsers: ["O10.6"],
			relevance: 50,
			description:
				"This property determines the width of the tab character (U+0009), in space characters (U+0020), when rendered.",
			restrictions: ["integer", "length"],
		},
		{
			name: "-o-text-overflow",
			browsers: ["O10"],
			values: [
				{
					name: "clip",
					description: "Clip inline content that overflows. Characters may be only partially rendered.",
				},
				{
					name: "ellipsis",
					description: "Render an ellipsis character (U+2026) to represent clipped inline content.",
				},
			],
			relevance: 50,
			description: "Text can overflow for example when it is prevented from wrapping",
			restrictions: ["enum"],
		},
		{
			name: "-o-transform",
			browsers: ["O10.5"],
			values: [
				{
					name: "matrix()",
					description:
						"Specifies a 2D transformation in the form of a transformation matrix of six values. matrix(a,b,c,d,e,f) is equivalent to applying the transformation matrix [a b c d e f]",
				},
				{
					name: "matrix3d()",
					description: "Specifies a 3D transformation as a 4x4 homogeneous matrix of 16 values in column-major order.",
				},
				{
					name: "none",
				},
				{
					name: "rotate()",
					description:
						"Specifies a 2D rotation by the angle specified in the parameter about the origin of the element, as defined by the transform-origin property.",
				},
				{
					name: "rotate3d()",
					description:
						"Specifies a clockwise 3D rotation by the angle specified in last parameter about the [x,y,z] direction vector described by the first 3 parameters.",
				},
				{
					name: "rotateX('angle')",
					description: "Specifies a clockwise rotation by the given angle about the X axis.",
				},
				{
					name: "rotateY('angle')",
					description: "Specifies a clockwise rotation by the given angle about the Y axis.",
				},
				{
					name: "rotateZ('angle')",
					description: "Specifies a clockwise rotation by the given angle about the Z axis.",
				},
				{
					name: "scale()",
					description:
						"Specifies a 2D scale operation by the [sx,sy] scaling vector described by the 2 parameters. If the second parameter is not provided, it is takes a value equal to the first.",
				},
				{
					name: "scale3d()",
					description: "Specifies a 3D scale operation by the [sx,sy,sz] scaling vector described by the 3 parameters.",
				},
				{
					name: "scaleX()",
					description:
						"Specifies a scale operation using the [sx,1] scaling vector, where sx is given as the parameter.",
				},
				{
					name: "scaleY()",
					description:
						"Specifies a scale operation using the [sy,1] scaling vector, where sy is given as the parameter.",
				},
				{
					name: "scaleZ()",
					description:
						"Specifies a scale operation using the [1,1,sz] scaling vector, where sz is given as the parameter.",
				},
				{
					name: "skew()",
					description:
						"Specifies a skew transformation along the X and Y axes. The first angle parameter specifies the skew on the X axis. The second angle parameter specifies the skew on the Y axis. If the second parameter is not given then a value of 0 is used for the Y angle (ie: no skew on the Y axis).",
				},
				{
					name: "skewX()",
					description: "Specifies a skew transformation along the X axis by the given angle.",
				},
				{
					name: "skewY()",
					description: "Specifies a skew transformation along the Y axis by the given angle.",
				},
				{
					name: "translate()",
					description:
						"Specifies a 2D translation by the vector [tx, ty], where tx is the first translation-value parameter and ty is the optional second translation-value parameter.",
				},
				{
					name: "translate3d()",
					description:
						"Specifies a 3D translation by the vector [tx,ty,tz], with tx, ty and tz being the first, second and third translation-value parameters respectively.",
				},
				{
					name: "translateX()",
					description: "Specifies a translation by the given amount in the X direction.",
				},
				{
					name: "translateY()",
					description: "Specifies a translation by the given amount in the Y direction.",
				},
				{
					name: "translateZ()",
					description:
						"Specifies a translation by the given amount in the Z direction. Note that percentage values are not allowed in the translateZ translation-value, and if present are evaluated as 0.",
				},
			],
			relevance: 50,
			description:
				"A two-dimensional transformation is applied to an element through the 'transform' property. This property contains a list of transform functions similar to those allowed by SVG.",
			restrictions: ["enum"],
		},
		{
			name: "-o-transform-origin",
			browsers: ["O10.5"],
			relevance: 50,
			description: "Establishes the origin of transformation for an element.",
			restrictions: ["positon", "length", "percentage"],
		},
		{
			name: "-o-transition",
			browsers: ["O11.5"],
			values: [
				{
					name: "all",
					description: "Every property that is able to undergo a transition will do so.",
				},
				{
					name: "none",
					description: "No property will transition.",
				},
			],
			relevance: 50,
			description: "Shorthand property combines four of the transition properties into a single property.",
			restrictions: ["time", "property", "timing-function", "enum"],
		},
		{
			name: "-o-transition-delay",
			browsers: ["O11.5"],
			relevance: 50,
			description:
				"Defines when the transition will start. It allows a transition to begin execution some period of time from when it is applied.",
			restrictions: ["time"],
		},
		{
			name: "-o-transition-duration",
			browsers: ["O11.5"],
			relevance: 50,
			description: "Specifies how long the transition from the old value to the new value should take.",
			restrictions: ["time"],
		},
		{
			name: "-o-transition-property",
			browsers: ["O11.5"],
			values: [
				{
					name: "all",
					description: "Every property that is able to undergo a transition will do so.",
				},
				{
					name: "none",
					description: "No property will transition.",
				},
			],
			relevance: 50,
			description: "Specifies the name of the CSS property to which the transition is applied.",
			restrictions: ["property"],
		},
		{
			name: "-o-transition-timing-function",
			browsers: ["O11.5"],
			relevance: 50,
			description: "Describes how the intermediate values used during a transition will be calculated.",
			restrictions: ["timing-function"],
		},
		{
			name: "offset-block-end",
			browsers: ["FF41"],
			values: [
				{
					name: "auto",
					description:
						"For non-replaced elements, the effect of this value depends on which of related properties have the value 'auto' as well.",
				},
			],
			relevance: 50,
			description:
				"Logical 'bottom'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "offset-block-start",
			browsers: ["FF41"],
			values: [
				{
					name: "auto",
					description:
						"For non-replaced elements, the effect of this value depends on which of related properties have the value 'auto' as well.",
				},
			],
			relevance: 50,
			description:
				"Logical 'top'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "offset-inline-end",
			browsers: ["FF41"],
			values: [
				{
					name: "auto",
					description:
						"For non-replaced elements, the effect of this value depends on which of related properties have the value 'auto' as well.",
				},
			],
			relevance: 50,
			description:
				"Logical 'right'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "offset-inline-start",
			browsers: ["FF41"],
			values: [
				{
					name: "auto",
					description:
						"For non-replaced elements, the effect of this value depends on which of related properties have the value 'auto' as well.",
				},
			],
			relevance: 50,
			description:
				"Logical 'left'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "outline",
			browsers: ["E94", "FF88", "FFA88", "S16.4", "SM16.4", "C94", "CA94", "IE8", "O80"],
			values: [
				{
					name: "auto",
					description: "Permits the user agent to render a custom outline style, typically the default platform style.",
				},
				{
					name: "invert",
					browsers: ["E94", "FF88", "FFA88", "S16.4", "SM16.4", "C94", "CA94", "IE8", "O80"],
					description: "Performs a color inversion on the pixels on the screen.",
				},
			],
			syntax: "<'outline-width'> || <'outline-style'> || <'outline-color'>",
			relevance: 88,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/outline",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-03-27",
			},
			description: "Shorthand property for 'outline-style', 'outline-width', and 'outline-color'.",
			restrictions: ["length", "line-width", "line-style", "color", "enum"],
		},
		{
			name: "outline-color",
			browsers: ["E12", "FF1.5", "FFA4", "S1.2", "SM1", "C1", "CA18", "IE8", "O7"],
			values: [
				{
					name: "invert",
					browsers: ["E12", "FF1.5", "FFA4", "S1.2", "SM1", "C1", "CA18", "IE8", "O7"],
					description: "Performs a color inversion on the pixels on the screen.",
				},
			],
			syntax: "auto | <color>",
			relevance: 62,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/outline-color",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "The color of the outline.",
			restrictions: ["enum", "color"],
		},
		{
			name: "outline-offset",
			browsers: ["E15", "FF1.5", "FFA4", "S1.2", "SM1", "C1", "CA18", "O9.5"],
			syntax: "<length>",
			relevance: 70,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/outline-offset",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-04-05",
				baseline_high_date: "2019-10-05",
			},
			description: "Offset the outline and draw it beyond the border edge.",
			restrictions: ["length"],
		},
		{
			name: "outline-style",
			browsers: ["E12", "FF1.5", "FFA4", "S1.2", "SM1", "C1", "CA18", "IE8", "O7"],
			values: [
				{
					name: "auto",
					description: "Permits the user agent to render a custom outline style, typically the default platform style.",
				},
			],
			syntax: "auto | <outline-line-style>",
			relevance: 60,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/outline-style",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Style of the outline.",
			restrictions: ["line-style", "enum"],
		},
		{
			name: "outline-width",
			browsers: ["E12", "FF1.5", "FFA4", "S1.2", "SM1", "C1", "CA18", "IE8", "O7"],
			syntax: "<line-width>",
			relevance: 63,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/outline-width",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Width of the outline.",
			restrictions: ["length", "line-width"],
		},
		{
			name: "overflow",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
			values: [
				{
					name: "auto",
					description:
						"The behavior of the 'auto' value is UA-dependent, but should cause a scrolling mechanism to be provided for overflowing boxes.",
				},
				{
					name: "hidden",
					description:
						"Content is clipped and no scrolling mechanism should be provided to view the content outside the clipping region.",
				},
				{
					name: "-moz-hidden-unscrollable",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
					description: "Same as the standardized 'clip', except doesn't establish a block formatting context.",
				},
				{
					name: "scroll",
					description:
						"Content is clipped and if the user agent uses a scrolling mechanism that is visible on the screen (such as a scroll bar or a panner), that mechanism should be displayed for a box whether or not any of its content is clipped.",
				},
				{
					name: "visible",
					description: "Content is not clipped, i.e., it may be rendered outside the content box.",
				},
			],
			syntax: "[ visible | hidden | clip | scroll | auto ]{1,2}",
			relevance: 93,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/overflow",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Shorthand for setting 'overflow-x' and 'overflow-y'.",
			restrictions: ["enum"],
		},
		{
			name: "overflow-wrap",
			browsers: ["E18", "FF49", "FFA49", "S7", "SM7", "C23", "CA25", "IE5.5", "O12.1"],
			values: [
				{
					name: "break-word",
					description:
						"An otherwise unbreakable sequence of characters may be broken at an arbitrary point if there are no otherwise-acceptable break points in the line.",
				},
				{
					name: "normal",
					description: "Lines may break only at allowed break points.",
				},
				{
					name: "anywhere",
					description:
						"There is a soft wrap opportunity around every typographic character unit, including around any punctuation character or preserved white spaces, or in the middle of words, disregarding any prohibition against line breaks, even those introduced by characters with the GL, WJ, or ZWJ line breaking classes or mandated by the word-break property.",
				},
			],
			syntax: "normal | break-word | anywhere",
			relevance: 66,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/overflow-wrap",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2018-10-02",
				baseline_high_date: "2021-04-02",
			},
			description:
				"Specifies whether the UA may break within a word to prevent overflow when an otherwise-unbreakable string is too long to fit within the line box.",
			restrictions: ["enum"],
		},
		{
			name: "overflow-x",
			browsers: ["E12", "FF3.5", "FFA4", "S3", "SM1", "C1", "CA18", "IE5", "O9.5"],
			values: [
				{
					name: "auto",
					description:
						"The behavior of the 'auto' value is UA-dependent, but should cause a scrolling mechanism to be provided for overflowing boxes.",
				},
				{
					name: "hidden",
					description:
						"Content is clipped and no scrolling mechanism should be provided to view the content outside the clipping region.",
				},
				{
					name: "scroll",
					description:
						"Content is clipped and if the user agent uses a scrolling mechanism that is visible on the screen (such as a scroll bar or a panner), that mechanism should be displayed for a box whether or not any of its content is clipped.",
				},
				{
					name: "visible",
					description: "Content is not clipped, i.e., it may be rendered outside the content box.",
				},
			],
			syntax: "visible | hidden | clip | scroll | auto",
			relevance: 81,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/overflow-x",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Specifies the handling of overflow in the horizontal direction.",
			restrictions: ["enum"],
		},
		{
			name: "overflow-y",
			browsers: ["E12", "FF3.5", "FFA4", "S3", "SM1", "C1", "CA18", "IE5", "O9.5"],
			values: [
				{
					name: "auto",
					description:
						"The behavior of the 'auto' value is UA-dependent, but should cause a scrolling mechanism to be provided for overflowing boxes.",
				},
				{
					name: "hidden",
					description:
						"Content is clipped and no scrolling mechanism should be provided to view the content outside the clipping region.",
				},
				{
					name: "scroll",
					description:
						"Content is clipped and if the user agent uses a scrolling mechanism that is visible on the screen (such as a scroll bar or a panner), that mechanism should be displayed for a box whether or not any of its content is clipped.",
				},
				{
					name: "visible",
					description: "Content is not clipped, i.e., it may be rendered outside the content box.",
				},
			],
			syntax: "visible | hidden | clip | scroll | auto",
			relevance: 83,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/overflow-y",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Specifies the handling of overflow in the vertical direction.",
			restrictions: ["enum"],
		},
		{
			name: "pad",
			browsers: ["FF33"],
			atRule: "@counter-style",
			syntax: "<integer> && <symbol>",
			relevance: 50,
			description:
				'@counter-style descriptor. Specifies a "fixed-width" counter style, where representations shorter than the pad value are padded with a particular <symbol>',
			restrictions: ["integer", "image", "string", "identifier"],
		},
		{
			name: "padding",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			values: [],
			syntax: "<'padding-top'>{1,4}",
			relevance: 95,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/padding",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Shorthand property to set values for the thickness of the padding area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. The value may not be negative.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "padding-bottom",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			syntax: "<length-percentage [0,∞]>",
			relevance: 89,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/padding-bottom",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Shorthand property to set values for the thickness of the padding area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. The value may not be negative.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "padding-block-end",
			browsers: ["E79", "FF41", "FFA41", "S12.1", "SM12.2", "C69", "CA69", "O56"],
			syntax: "<'padding-top'>",
			relevance: 54,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/padding-block-end",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Logical 'padding-bottom'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "padding-block-start",
			browsers: ["E79", "FF41", "FFA41", "S12.1", "SM12.2", "C69", "CA69", "O56"],
			syntax: "<'padding-top'>",
			relevance: 54,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/padding-block-start",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Logical 'padding-top'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "padding-inline-end",
			browsers: ["E79", "FF41", "FFA41", "S12.1", "SM12.2", "C69", "CA69", "O56"],
			syntax: "<'padding-top'>",
			relevance: 56,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/padding-inline-end",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Logical 'padding-right'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "padding-inline-start",
			browsers: ["E79", "FF41", "FFA41", "S12.1", "SM12.2", "C69", "CA69", "O56"],
			syntax: "<'padding-top'>",
			relevance: 58,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/padding-inline-start",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Logical 'padding-left'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "padding-left",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			syntax: "<length-percentage [0,∞]>",
			relevance: 90,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/padding-left",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Shorthand property to set values for the thickness of the padding area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. The value may not be negative.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "padding-right",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			syntax: "<length-percentage [0,∞]>",
			relevance: 89,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/padding-right",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Shorthand property to set values for the thickness of the padding area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. The value may not be negative.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "padding-top",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			syntax: "<length-percentage [0,∞]>",
			relevance: 89,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/padding-top",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Shorthand property to set values for the thickness of the padding area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. The value may not be negative.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "page-break-after",
			browsers: ["E12", "FF1", "FFA4", "S1.2", "SM1", "C1", "CA18", "IE4", "O7"],
			values: [
				{
					name: "always",
					description: "Always force a page break after the generated box.",
				},
				{
					name: "auto",
					description: "Neither force nor forbid a page break after generated box.",
				},
				{
					name: "avoid",
					description: "Avoid a page break after the generated box.",
				},
				{
					name: "left",
					description:
						"Force one or two page breaks after the generated box so that the next page is formatted as a left page.",
				},
				{
					name: "right",
					description:
						"Force one or two page breaks after the generated box so that the next page is formatted as a right page.",
				},
			],
			status: "obsolete",
			syntax: "auto | always | avoid | left | right | recto | verso",
			relevance: 1,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/page-break-after",
				},
			],
			baseline: {
				status: "false",
			},
			description: "Defines rules for page breaks after an element.",
			restrictions: ["enum"],
		},
		{
			name: "page-break-before",
			browsers: ["E12", "FF1", "FFA4", "S1.2", "SM1", "C1", "CA18", "IE4", "O7"],
			values: [
				{
					name: "always",
					description: "Always force a page break before the generated box.",
				},
				{
					name: "auto",
					description: "Neither force nor forbid a page break before the generated box.",
				},
				{
					name: "avoid",
					description: "Avoid a page break before the generated box.",
				},
				{
					name: "left",
					description:
						"Force one or two page breaks before the generated box so that the next page is formatted as a left page.",
				},
				{
					name: "right",
					description:
						"Force one or two page breaks before the generated box so that the next page is formatted as a right page.",
				},
			],
			status: "obsolete",
			syntax: "auto | always | avoid | left | right | recto | verso",
			relevance: 0,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/page-break-before",
				},
			],
			baseline: {
				status: "false",
			},
			description: "Defines rules for page breaks before an element.",
			restrictions: ["enum"],
		},
		{
			name: "page-break-inside",
			browsers: ["E12", "FF19", "FFA19", "S1.3", "SM1", "C1", "CA18", "IE8", "O7"],
			values: [
				{
					name: "auto",
					description: "Neither force nor forbid a page break inside the generated box.",
				},
				{
					name: "avoid",
					description: "Avoid a page break inside the generated box.",
				},
			],
			status: "obsolete",
			syntax: "auto | avoid",
			relevance: 2,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/page-break-inside",
				},
			],
			baseline: {
				status: "false",
			},
			description: "Defines rules for page breaks inside an element.",
			restrictions: ["enum"],
		},
		{
			name: "paint-order",
			browsers: ["E123", "FF60", "FFA60", "S11", "SM11", "C123", "CA123", "O109"],
			values: [
				{
					name: "fill",
				},
				{
					name: "markers",
				},
				{
					name: "normal",
					description:
						"The element is painted with the standard order of painting operations: the 'fill' is painted first, then its 'stroke' and finally its markers.",
				},
				{
					name: "stroke",
				},
			],
			syntax: "normal | [ fill || stroke || markers ]",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/paint-order",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2024-03-22",
			},
			description:
				"Controls the order that the three paint operations that shapes and text are rendered with: their fill, their stroke and any markers they might have.",
			restrictions: ["enum"],
		},
		{
			name: "perspective",
			browsers: ["E12", "FF16", "FFA16", "S9", "SM9", "C36", "CA36", "IE10", "O23"],
			values: [
				{
					name: "none",
					description: "No perspective transform is applied.",
				},
			],
			syntax: "none | <length>",
			relevance: 54,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/perspective",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description:
				"Applies the same transform as the perspective(<number>) transform function, except that it applies only to the positioned or transformed children of the element, not to the transform on the element itself.",
			restrictions: ["length", "enum"],
		},
		{
			name: "perspective-origin",
			browsers: ["E12", "FF16", "FFA16", "S9", "SM9", "C36", "CA36", "IE10", "O23"],
			syntax: "<position>",
			relevance: 51,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/perspective-origin",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description:
				"Establishes the origin for the perspective property. It effectively sets the X and Y position at which the viewer appears to be looking at the children of the element.",
			restrictions: ["position", "percentage", "length"],
		},
		{
			name: "pointer-events",
			browsers: ["E12", "FF1.5", "FFA4", "S4", "SM3.2", "C1", "CA18", "IE11", "O9"],
			values: [
				{
					name: "all",
					description:
						"The given element can be the target element for pointer events whenever the pointer is over either the interior or the perimeter of the element.",
				},
				{
					name: "fill",
					description:
						"The given element can be the target element for pointer events whenever the pointer is over the interior of the element.",
				},
				{
					name: "none",
					description: "The given element does not receive pointer events.",
				},
				{
					name: "painted",
					description:
						'The given element can be the target element for pointer events when the pointer is over a "painted" area. ',
				},
				{
					name: "stroke",
					description:
						"The given element can be the target element for pointer events whenever the pointer is over the perimeter of the element.",
				},
				{
					name: "visible",
					description:
						"The given element can be the target element for pointer events when the 'visibility' property is set to visible and the pointer is over either the interior or the perimeter of the element.",
				},
				{
					name: "visibleFill",
					description:
						"The given element can be the target element for pointer events when the 'visibility' property is set to visible and when the pointer is over the interior of the element.",
				},
				{
					name: "visiblePainted",
					description:
						"The given element can be the target element for pointer events when the 'visibility' property is set to visible and when the pointer is over a 'painted' area.",
				},
				{
					name: "visibleStroke",
					description:
						"The given element can be the target element for pointer events when the 'visibility' property is set to visible and when the pointer is over the perimeter of the element.",
				},
			],
			syntax:
				"auto | none | visiblePainted | visibleFill | visibleStroke | visible | painted | fill | stroke | all | inherit",
			relevance: 83,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/pointer-events",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Specifies under what circumstances a given element can be the target element for a pointer event.",
			restrictions: ["enum"],
		},
		{
			name: "position",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O4"],
			values: [
				{
					name: "absolute",
					description:
						"The box's position (and possibly size) is specified with the 'top', 'right', 'bottom', and 'left' properties. These properties specify offsets with respect to the box's 'containing block'.",
				},
				{
					name: "fixed",
					description:
						"The box's position is calculated according to the 'absolute' model, but in addition, the box is fixed with respect to some reference. As with the 'absolute' model, the box's margins do not collapse with any other margins.",
				},
				{
					name: "-ms-page",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O4"],
					description: "The box's position is calculated according to the 'absolute' model.",
				},
				{
					name: "relative",
					description:
						"The box's position is calculated according to the normal flow (this is called the position in normal flow). Then the box is offset relative to its normal position.",
				},
				{
					name: "static",
					description:
						"The box is a normal box, laid out according to the normal flow. The 'top', 'right', 'bottom', and 'left' properties do not apply.",
				},
				{
					name: "sticky",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O4"],
					description:
						"The box's position is calculated according to the normal flow. Then the box is offset relative to its flow root and containing block and in all cases, including table elements, does not affect the position of any following boxes.",
				},
				{
					name: "-webkit-sticky",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O4"],
					description:
						"The box's position is calculated according to the normal flow. Then the box is offset relative to its flow root and containing block and in all cases, including table elements, does not affect the position of any following boxes.",
				},
			],
			syntax: "static | relative | absolute | sticky | fixed",
			relevance: 95,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/position",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"The position CSS property sets how an element is positioned in a document. The top, right, bottom, and left properties determine the final location of positioned elements.",
			restrictions: ["enum"],
		},
		{
			name: "prefix",
			browsers: ["FF33"],
			atRule: "@counter-style",
			syntax: "<symbol>",
			relevance: 50,
			description: "@counter-style descriptor. Specifies a <symbol> that is prepended to the marker representation.",
			restrictions: ["image", "string", "identifier"],
		},
		{
			name: "quotes",
			browsers: ["E12", "FF1.5", "FFA4", "S9", "SM9", "C11", "CA18", "IE8", "O4"],
			values: [
				{
					name: "none",
					description:
						"The 'open-quote' and 'close-quote' values of the 'content' property produce no quotations marks, as if they were 'no-open-quote' and 'no-close-quote' respectively.",
				},
			],
			syntax: "none | auto | [ <string> <string> ]+",
			relevance: 54,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/quotes",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description: "Specifies quotation marks for any number of embedded quotations.",
			restrictions: ["string"],
		},
		{
			name: "range",
			browsers: ["FF33"],
			values: [
				{
					name: "auto",
					description: "The range depends on the counter system.",
				},
				{
					name: "infinite",
					description:
						"If used as the first value in a range, it represents negative infinity; if used as the second value, it represents positive infinity.",
				},
			],
			atRule: "@counter-style",
			syntax: "[ [ <integer> | infinite ]{2} ]# | auto",
			relevance: 50,
			description: "@counter-style descriptor. Defines the ranges over which the counter style is defined.",
			restrictions: ["integer", "enum"],
		},
		{
			name: "resize",
			browsers: ["E79", "FF4", "FFA4", "S3", "C1", "CA18", "O12.1"],
			values: [
				{
					name: "both",
					description:
						"The UA presents a bidirectional resizing mechanism to allow the user to adjust both the height and the width of the element.",
				},
				{
					name: "horizontal",
					description:
						"The UA presents a unidirectional horizontal resizing mechanism to allow the user to adjust only the width of the element.",
				},
				{
					name: "none",
					description:
						"The UA does not present a resizing mechanism on the element, and the user is given no direct manipulation mechanism to resize the element.",
				},
				{
					name: "vertical",
					description:
						"The UA presents a unidirectional vertical resizing mechanism to allow the user to adjust only the height of the element.",
				},
			],
			syntax: "none | both | horizontal | vertical | block | inline",
			relevance: 65,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/resize",
				},
			],
			baseline: {
				status: "false",
			},
			description: "Specifies whether or not an element is resizable by the user, and if so, along which axis/axes.",
			restrictions: ["enum"],
		},
		{
			name: "right",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE5.5", "O5"],
			values: [
				{
					name: "auto",
					description:
						"For non-replaced elements, the effect of this value depends on which of related properties have the value 'auto' as well",
				},
			],
			syntax: "<length> | <percentage> | auto",
			relevance: 91,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/right",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Specifies how far an absolutely positioned box's right margin edge is offset to the left of the right edge of the box's 'containing block'.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "ruby-align",
			browsers: ["E128", "FF38", "FFA38", "S18.2", "SM18.2", "C128", "CA128", "O114"],
			values: [
				{
					name: "auto",
					browsers: ["E128", "FF38", "FFA38", "S18.2", "SM18.2", "C128", "CA128", "O114"],
					description: "The user agent determines how the ruby contents are aligned. This is the initial value.",
				},
				{
					name: "center",
					description: "The ruby content is centered within its box.",
				},
				{
					name: "distribute-letter",
					browsers: ["E128", "FF38", "FFA38", "S18.2", "SM18.2", "C128", "CA128", "O114"],
					description:
						"If the width of the ruby text is smaller than that of the base, then the ruby text contents are evenly distributed across the width of the base, with the first and last ruby text glyphs lining up with the corresponding first and last base glyphs. If the width of the ruby text is at least the width of the base, then the letters of the base are evenly distributed across the width of the ruby text.",
				},
				{
					name: "distribute-space",
					browsers: ["E128", "FF38", "FFA38", "S18.2", "SM18.2", "C128", "CA128", "O114"],
					description:
						"If the width of the ruby text is smaller than that of the base, then the ruby text contents are evenly distributed across the width of the base, with a certain amount of white space preceding the first and following the last character in the ruby text. That amount of white space is normally equal to half the amount of inter-character space of the ruby text.",
				},
				{
					name: "left",
					description: "The ruby text content is aligned with the start edge of the base.",
				},
				{
					name: "line-edge",
					browsers: ["E128", "FF38", "FFA38", "S18.2", "SM18.2", "C128", "CA128", "O114"],
					description:
						"If the ruby text is not adjacent to a line edge, it is aligned as in 'auto'. If it is adjacent to a line edge, then it is still aligned as in auto, but the side of the ruby text that touches the end of the line is lined up with the corresponding edge of the base.",
				},
				{
					name: "right",
					browsers: ["E128", "FF38", "FFA38", "S18.2", "SM18.2", "C128", "CA128", "O114"],
					description: "The ruby text content is aligned with the end edge of the base.",
				},
				{
					name: "start",
					browsers: ["E128", "FF38", "FFA38", "S18.2", "SM18.2", "C128", "CA128", "O114"],
					description: "The ruby text content is aligned with the start edge of the base.",
				},
				{
					name: "space-between",
					browsers: ["E128", "FF38", "FFA38", "S18.2", "SM18.2", "C128", "CA128", "O114"],
					description:
						"The ruby content expands as defined for normal text justification (as defined by 'text-justify'),",
				},
				{
					name: "space-around",
					browsers: ["E128", "FF38", "FFA38", "S18.2", "SM18.2", "C128", "CA128", "O114"],
					description:
						"As for 'space-between' except that there exists an extra justification opportunities whose space is distributed half before and half after the ruby content.",
				},
			],
			syntax: "start | center | space-between | space-around",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/ruby-align",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2024-12-11",
			},
			description:
				"Specifies how text is distributed within the various ruby boxes when their contents do not exactly fill their respective boxes.",
			restrictions: ["enum"],
		},
		{
			name: "ruby-overhang",
			browsers: ["S18.2", "SM18.2"],
			values: [
				{
					name: "auto",
					description:
						"The ruby text can overhang text adjacent to the base on either side. This is the initial value.",
				},
				{
					name: "end",
					description: "The ruby text can overhang the text that follows it.",
				},
				{
					name: "none",
					description: "The ruby text cannot overhang any text adjacent to its base, only its own base.",
				},
				{
					name: "start",
					description: "The ruby text can overhang the text that precedes it.",
				},
			],
			relevance: 50,
			baseline: {
				status: "false",
			},
			description:
				"Determines whether, and on which side, ruby text is allowed to partially overhang any adjacent text in addition to its own base, when the ruby text is wider than the ruby base.",
			restrictions: ["enum"],
		},
		{
			name: "ruby-position",
			browsers: ["E84", "FF38", "FFA38", "S18.2", "SM18.2", "C84", "CA84", "O70"],
			values: [
				{
					name: "after",
					description:
						"The ruby text appears after the base. This is a relatively rare setting used in ideographic East Asian writing systems, most easily found in educational text.",
				},
				{
					name: "before",
					description:
						"The ruby text appears before the base. This is the most common setting used in ideographic East Asian writing systems.",
				},
				{
					name: "inline",
				},
				{
					name: "right",
					description:
						"The ruby text appears on the right of the base. Unlike 'before' and 'after', this value is not relative to the text flow direction.",
				},
			],
			syntax: "[ alternate || [ over | under ] ] | inter-character",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/ruby-position",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2024-12-11",
			},
			description:
				"Used by the parent of elements with display: ruby-text to control the position of the ruby text with respect to its base.",
			restrictions: ["enum"],
		},
		{
			name: "ruby-span",
			browsers: ["FF10"],
			values: [
				{
					name: "attr(x)",
					description:
						"The value of attribute 'x' is a string value. The string value is evaluated as a <number> to determine the number of ruby base elements to be spanned by the annotation element.",
				},
				{
					name: "none",
					description: "No spanning. The computed value is '1'.",
				},
			],
			relevance: 50,
			description:
				"Determines whether, and on which side, ruby text is allowed to partially overhang any adjacent text in addition to its own base, when the ruby text is wider than the ruby base.",
			restrictions: ["enum"],
		},
		{
			name: "scrollbar-3dlight-color",
			browsers: ["IE6"],
			relevance: 50,
			description:
				"Determines the color of the top and left edges of the scroll box and scroll arrows of a scroll bar.",
			restrictions: ["color"],
		},
		{
			name: "scrollbar-arrow-color",
			browsers: ["IE6"],
			relevance: 50,
			description: "Determines the color of the arrow elements of a scroll arrow.",
			restrictions: ["color"],
		},
		{
			name: "scrollbar-base-color",
			browsers: ["IE6"],
			relevance: 50,
			description:
				"Determines the color of the main elements of a scroll bar, which include the scroll box, track, and scroll arrows.",
			restrictions: ["color"],
		},
		{
			name: "scrollbar-darkshadow-color",
			browsers: ["IE6"],
			relevance: 50,
			description: "Determines the color of the gutter of a scroll bar.",
			restrictions: ["color"],
		},
		{
			name: "scrollbar-face-color",
			browsers: ["IE6"],
			relevance: 50,
			description: "Determines the color of the scroll box and scroll arrows of a scroll bar.",
			restrictions: ["color"],
		},
		{
			name: "scrollbar-highlight-color",
			browsers: ["IE6"],
			relevance: 50,
			description:
				"Determines the color of the top and left edges of the scroll box and scroll arrows of a scroll bar.",
			restrictions: ["color"],
		},
		{
			name: "scrollbar-shadow-color",
			browsers: ["IE6"],
			relevance: 50,
			description:
				"Determines the color of the bottom and right edges of the scroll box and scroll arrows of a scroll bar.",
			restrictions: ["color"],
		},
		{
			name: "scrollbar-track-color",
			browsers: ["IE6"],
			relevance: 50,
			description: "Determines the color of the track element of a scroll bar.",
			restrictions: ["color"],
		},
		{
			name: "scroll-behavior",
			browsers: ["E79", "FF36", "FFA36", "S15.4", "SM15.4", "C61", "CA61", "O48"],
			values: [
				{
					name: "auto",
					description: "Scrolls in an instant fashion.",
				},
				{
					name: "smooth",
					description: "Scrolls in a smooth fashion using a user-agent-defined timing function and time period.",
				},
			],
			syntax: "auto | smooth",
			relevance: 58,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scroll-behavior",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-03-14",
				baseline_high_date: "2024-09-14",
			},
			description:
				"Specifies the scrolling behavior for a scrolling box, when scrolling happens due to navigation or CSSOM scrolling APIs.",
			restrictions: ["enum"],
		},
		{
			name: "scroll-snap-coordinate",
			browsers: ["FF39"],
			values: [
				{
					name: "none",
					description: "Specifies that this element does not contribute a snap point.",
				},
			],
			status: "obsolete",
			syntax: "none | <position>#",
			relevance: 0,
			description:
				"Defines the x and y coordinate within the element which will align with the nearest ancestor scroll container's snap-destination for the respective axis.",
			restrictions: ["position", "length", "percentage", "enum"],
		},
		{
			name: "scroll-snap-destination",
			browsers: ["FF39"],
			status: "obsolete",
			syntax: "<position>",
			relevance: 0,
			description:
				"Define the x and y coordinate within the scroll container's visual viewport which element snap points will align with.",
			restrictions: ["position", "length", "percentage"],
		},
		{
			name: "scroll-snap-points-x",
			browsers: ["FF39"],
			values: [
				{
					name: "none",
					description: "No snap points are defined by this scroll container.",
				},
				{
					name: "repeat()",
					description:
						"Defines an interval at which snap points are defined, starting from the container's relevant start edge.",
				},
			],
			status: "obsolete",
			syntax: "none | repeat( <length-percentage> )",
			relevance: 0,
			description: "Defines the positioning of snap points along the x axis of the scroll container it is applied to.",
			restrictions: ["enum"],
		},
		{
			name: "scroll-snap-points-y",
			browsers: ["FF39"],
			values: [
				{
					name: "none",
					description: "No snap points are defined by this scroll container.",
				},
				{
					name: "repeat()",
					description:
						"Defines an interval at which snap points are defined, starting from the container's relevant start edge.",
				},
			],
			status: "obsolete",
			syntax: "none | repeat( <length-percentage> )",
			relevance: 0,
			description: "Defines the positioning of snap points along the y axis of the scroll container it is applied to.",
			restrictions: ["enum"],
		},
		{
			name: "scroll-snap-type",
			browsers: ["E79", "FF99", "FFA68", "S11", "SM11", "C69", "CA69", "IE10", "O56"],
			values: [
				{
					name: "none",
					description: "The visual viewport of this scroll container must ignore snap points, if any, when scrolled.",
				},
				{
					name: "mandatory",
					description:
						"The visual viewport of this scroll container is guaranteed to rest on a snap point when there are no active scrolling operations.",
				},
				{
					name: "proximity",
					description:
						"The visual viewport of this scroll container may come to rest on a snap point at the termination of a scroll at the discretion of the UA given the parameters of the scroll.",
				},
			],
			syntax: "none | [ x | y | block | inline | both ] [ mandatory | proximity ]?",
			relevance: 57,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scroll-snap-type",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-04-05",
				baseline_high_date: "2024-10-05",
			},
			description: "Defines how strictly snap points are enforced on the scroll container.",
			restrictions: ["enum"],
		},
		{
			name: "shape-image-threshold",
			browsers: ["E79", "FF62", "FFA62", "S10.1", "SM10.3", "C37", "CA37", "O24"],
			syntax: "<opacity-value>",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/shape-image-threshold",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Defines the alpha channel threshold used to extract the shape using an image. A value of 0.5 means that the shape will enclose all the pixels that are more than 50% opaque.",
			restrictions: ["number"],
		},
		{
			name: "shape-margin",
			browsers: ["E79", "FF62", "FFA62", "S10.1", "SM10.3", "C37", "CA37", "O24"],
			syntax: "<length-percentage>",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/shape-margin",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Adds a margin to a 'shape-outside'. This defines a new shape that is the smallest contour that includes all the points that are the 'shape-margin' distance outward in the perpendicular direction from a point on the underlying shape.",
			restrictions: ["url", "length", "percentage"],
		},
		{
			name: "shape-outside",
			browsers: ["E79", "FF62", "FFA62", "S10.1", "SM10.3", "C37", "CA37", "O24"],
			values: [
				{
					name: "margin-box",
					description: "The background is painted within (clipped to) the margin box.",
				},
				{
					name: "none",
					description: "The float area is unaffected.",
				},
			],
			syntax: "none | [ <shape-box> || <basic-shape> ] | <image>",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/shape-outside",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description: "Specifies an orthogonal rotation to be applied to an image before it is laid out.",
			restrictions: ["image", "box", "shape", "enum"],
		},
		{
			name: "shape-rendering",
			browsers: ["E79", "FF3", "FFA4", "S4", "SM3.2", "C1", "CA18", "O15"],
			values: [
				{
					name: "auto",
					description: "Suppresses aural rendering.",
				},
				{
					name: "crispEdges",
					description:
						"Emphasize the contrast between clean edges of artwork over rendering speed and geometric precision.",
				},
				{
					name: "geometricPrecision",
					description: "Emphasize geometric precision over speed and crisp edges.",
				},
				{
					name: "optimizeSpeed",
					description: "Emphasize rendering speed over geometric precision and crisp edges.",
				},
			],
			syntax: "auto | optimizeSpeed | crispEdges | geometricPrecision",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/shape-rendering",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Provides hints about what tradeoffs to make as it renders vector graphics elements such as <path> elements and basic shapes such as circles and rectangles.",
			restrictions: ["enum"],
		},
		{
			name: "size",
			browsers: ["C", "O8"],
			atRule: "@page",
			syntax: "<length [0,∞]>{1,2} | auto | [ <page-size> || [ portrait | landscape ] ]",
			relevance: 53,
			description:
				"The size CSS at-rule descriptor, used with the @page at-rule, defines the size and orientation of the box which is used to represent a page. Most of the time, this size corresponds to the target size of the printed page if applicable.",
			restrictions: ["length"],
		},
		{
			name: "src",
			values: [
				{
					name: "url()",
					description: "Reference font by URL",
				},
				{
					name: "format()",
					description: "Optional hint describing the format of the font resource.",
				},
				{
					name: "local()",
					description: "Format-specific string that identifies a locally available copy of a given font.",
				},
			],
			atRule: "@font-face",
			syntax: "[ <url> [ format( <string># ) ]? | local( <family-name> ) ]#",
			relevance: 85,
			description:
				"@font-face descriptor. Specifies the resource containing font data. It is required, whether the font is downloadable or locally installed.",
			restrictions: ["enum", "url", "identifier"],
		},
		{
			name: "stop-color",
			browsers: ["E15", "FF3", "FFA4", "S4", "SM3.2", "C1", "CA18", "O15"],
			syntax: "<'color'>",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/stop-color",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-04-05",
				baseline_high_date: "2019-10-05",
			},
			description: "Indicates what color to use at that gradient stop.",
			restrictions: ["color"],
		},
		{
			name: "stop-opacity",
			browsers: ["E15", "FF3", "FFA4", "S4", "SM3.2", "C1", "CA18", "O15"],
			syntax: "<'opacity'>",
			relevance: 52,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/stop-opacity",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-04-05",
				baseline_high_date: "2019-10-05",
			},
			description: "Defines the opacity of a given gradient stop.",
			restrictions: ["number(0-1)"],
		},
		{
			name: "stroke",
			browsers: ["E15", "FF1.5", "FFA4", "S4", "SM3.2", "C1", "CA18", "O15"],
			values: [
				{
					name: "url()",
					description:
						"A URL reference to a paint server element, which is an element that defines a paint server: 'hatch', 'linearGradient', 'mesh', 'pattern', 'radialGradient' and 'solidcolor'.",
				},
				{
					name: "none",
					description: "No paint is applied in this layer.",
				},
			],
			syntax: "<paint>",
			relevance: 68,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/stroke",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-04-05",
				baseline_high_date: "2019-10-05",
			},
			description: "Paints along the outline of the given graphical element.",
			restrictions: ["color", "enum", "url"],
		},
		{
			name: "stroke-dasharray",
			browsers: ["E15", "FF1.5", "FFA4", "S4", "SM3.2", "C1", "CA18", "O15"],
			values: [
				{
					name: "none",
					description: "Indicates that no dashing is used.",
				},
			],
			syntax: "none | <dasharray>",
			relevance: 61,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/stroke-dasharray",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-04-05",
				baseline_high_date: "2019-10-05",
			},
			description: "Controls the pattern of dashes and gaps used to stroke paths.",
			restrictions: ["length", "percentage", "number", "enum"],
		},
		{
			name: "stroke-dashoffset",
			browsers: ["E15", "FF1.5", "FFA4", "S4", "SM3.2", "C1", "CA18", "O15"],
			syntax: "<length-percentage> | <number>",
			relevance: 63,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/stroke-dashoffset",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-04-05",
				baseline_high_date: "2019-10-05",
			},
			description: "Specifies the distance into the dash pattern to start the dash.",
			restrictions: ["percentage", "length"],
		},
		{
			name: "stroke-linecap",
			browsers: ["E15", "FF1.5", "FFA4", "S4", "SM3.2", "C1", "CA18", "O15"],
			values: [
				{
					name: "butt",
					description: "Indicates that the stroke for each subpath does not extend beyond its two endpoints.",
				},
				{
					name: "round",
					description:
						"Indicates that at each end of each subpath, the shape representing the stroke will be extended by a half circle with a radius equal to the stroke width.",
				},
				{
					name: "square",
					description:
						"Indicates that at the end of each subpath, the shape representing the stroke will be extended by a rectangle with the same width as the stroke width and whose length is half of the stroke width.",
				},
			],
			syntax: "butt | round | square",
			relevance: 54,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/stroke-linecap",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-04-05",
				baseline_high_date: "2019-10-05",
			},
			description: "Specifies the shape to be used at the end of open subpaths when they are stroked.",
			restrictions: ["enum"],
		},
		{
			name: "stroke-linejoin",
			browsers: ["E15", "FF1.5", "FFA4", "S4", "SM3.2", "C1", "CA18", "O15"],
			values: [
				{
					name: "bevel",
					description: "Indicates that a bevelled corner is to be used to join path segments.",
				},
				{
					name: "miter",
					description: "Indicates that a sharp corner is to be used to join path segments.",
				},
				{
					name: "round",
					description: "Indicates that a round corner is to be used to join path segments.",
				},
			],
			syntax: "miter | miter-clip | round | bevel | arcs",
			relevance: 51,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/stroke-linejoin",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-04-05",
				baseline_high_date: "2019-10-05",
			},
			description: "Specifies the shape to be used at the corners of paths or basic shapes when they are stroked.",
			restrictions: ["enum"],
		},
		{
			name: "stroke-miterlimit",
			browsers: ["E15", "FF1.5", "FFA4", "S4", "SM3.2", "C1", "CA18", "O15"],
			syntax: "<number>",
			relevance: 53,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/stroke-miterlimit",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-04-05",
				baseline_high_date: "2019-10-05",
			},
			description:
				"When two line segments meet at a sharp angle and miter joins have been specified for 'stroke-linejoin', it is possible for the miter to extend far beyond the thickness of the line stroking the path.",
			restrictions: ["number"],
		},
		{
			name: "stroke-opacity",
			browsers: ["E15", "FF1.5", "FFA4", "S4", "SM3.2", "C1", "CA18", "O15"],
			syntax: "<'opacity'>",
			relevance: 53,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/stroke-opacity",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-04-05",
				baseline_high_date: "2019-10-05",
			},
			description: "Specifies the opacity of the painting operation used to stroke the current object.",
			restrictions: ["number(0-1)"],
		},
		{
			name: "stroke-width",
			browsers: ["E15", "FF1.5", "FFA4", "S4", "SM3.2", "C1", "CA18", "O15"],
			syntax: "<length-percentage> | <number>",
			relevance: 69,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/stroke-width",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-04-05",
				baseline_high_date: "2019-10-05",
			},
			description: "Specifies the width of the stroke on the current object.",
			restrictions: ["percentage", "length"],
		},
		{
			name: "suffix",
			browsers: ["FF33"],
			atRule: "@counter-style",
			syntax: "<symbol>",
			relevance: 50,
			description: "@counter-style descriptor. Specifies a <symbol> that is appended to the marker representation.",
			restrictions: ["image", "string", "identifier"],
		},
		{
			name: "system",
			browsers: ["FF33"],
			values: [
				{
					name: "additive",
					description:
						'Represents "sign-value" numbering systems, which, rather than using reusing digits in different positions to change their value, define additional digits with much larger values, so that the value of the number can be obtained by adding all the digits together.',
				},
				{
					name: "alphabetic",
					description:
						'Interprets the list of counter symbols as digits to an alphabetic numbering system, similar to the default lower-alpha counter style, which wraps from "a", "b", "c", to "aa", "ab", "ac".',
				},
				{
					name: "cyclic",
					description:
						"Cycles repeatedly through its provided symbols, looping back to the beginning when it reaches the end of the list.",
				},
				{
					name: "extends",
					description: "Use the algorithm of another counter style, but alter other aspects.",
				},
				{
					name: "fixed",
					description: "Runs through its list of counter symbols once, then falls back.",
				},
				{
					name: "numeric",
					description:
						"interprets the list of counter symbols as digits to a \"place-value\" numbering system, similar to the default 'decimal' counter style.",
				},
				{
					name: "symbolic",
					description:
						"Cycles repeatedly through its provided symbols, doubling, tripling, etc. the symbols on each successive pass through the list.",
				},
			],
			atRule: "@counter-style",
			syntax:
				"cyclic | numeric | alphabetic | symbolic | additive | [ fixed <integer>? ] | [ extends <counter-style-name> ]",
			relevance: 50,
			description:
				"@counter-style descriptor. Specifies which algorithm will be used to construct the counter's representation based on the counter value.",
			restrictions: ["enum", "integer"],
		},
		{
			name: "symbols",
			browsers: ["FF33"],
			atRule: "@counter-style",
			syntax: "<symbol>+",
			relevance: 50,
			description:
				"@counter-style descriptor. Specifies the symbols used by the marker-construction algorithm specified by the system descriptor.",
			restrictions: ["image", "string", "identifier"],
		},
		{
			name: "table-layout",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM3", "C14", "CA18", "IE5", "O7"],
			values: [
				{
					name: "auto",
					description: "Use any automatic table layout algorithm.",
				},
				{
					name: "fixed",
					description: "Use the fixed table layout algorithm.",
				},
			],
			syntax: "auto | fixed",
			relevance: 58,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/table-layout",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Controls the algorithm used to lay out the table cells, rows, and columns.",
			restrictions: ["enum"],
		},
		{
			name: "tab-size",
			browsers: ["E79", "FF91", "FFA91", "S7", "SM7", "C21", "CA25", "O15"],
			syntax: "<integer> | <length>",
			relevance: 54,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/tab-size",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-08-10",
				baseline_high_date: "2024-02-10",
			},
			description: "Determines the width of the tab character (U+0009), in space characters (U+0020), when rendered.",
			restrictions: ["integer", "length"],
		},
		{
			name: "text-align",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE3", "O3.5"],
			values: [
				{
					name: "center",
					description: "The inline contents are centered within the line box.",
				},
				{
					name: "end",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE3", "O3.5"],
					description: "The inline contents are aligned to the end edge of the line box.",
				},
				{
					name: "justify",
					description: "The text is justified according to the method specified by the 'text-justify' property.",
				},
				{
					name: "left",
					description:
						"The inline contents are aligned to the left edge of the line box. In vertical text, 'left' aligns to the edge of the line box that would be the start edge for left-to-right text.",
				},
				{
					name: "right",
					description:
						"The inline contents are aligned to the right edge of the line box. In vertical text, 'right' aligns to the edge of the line box that would be the end edge for left-to-right text.",
				},
				{
					name: "start",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE3", "O3.5"],
					description: "The inline contents are aligned to the start edge of the line box.",
				},
			],
			syntax: "start | end | left | right | center | justify | match-parent",
			relevance: 93,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-align",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Describes how inline contents of a block are horizontally aligned if the contents do not completely fill the line box.",
			restrictions: ["string"],
		},
		{
			name: "text-align-last",
			browsers: ["E12", "FF49", "FFA49", "S16", "SM16", "C47", "CA47", "IE5.5", "O34"],
			values: [
				{
					name: "auto",
					description:
						"Content on the affected line is aligned per 'text-align' unless 'text-align' is set to 'justify', in which case it is 'start-aligned'.",
				},
				{
					name: "center",
					description: "The inline contents are centered within the line box.",
				},
				{
					name: "justify",
					description: "The text is justified according to the method specified by the 'text-justify' property.",
				},
				{
					name: "left",
					description:
						"The inline contents are aligned to the left edge of the line box. In vertical text, 'left' aligns to the edge of the line box that would be the start edge for left-to-right text.",
				},
				{
					name: "right",
					description:
						"The inline contents are aligned to the right edge of the line box. In vertical text, 'right' aligns to the edge of the line box that would be the end edge for left-to-right text.",
				},
			],
			syntax: "auto | start | end | left | right | center | justify",
			relevance: 51,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-align-last",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-09-12",
				baseline_high_date: "2025-03-12",
			},
			description:
				"Describes how the last line of a block or a line right before a forced line break is aligned when 'text-align' is set to 'justify'.",
			restrictions: ["enum"],
		},
		{
			name: "text-anchor",
			browsers: ["E14", "FF3", "FFA4", "S4", "SM3.2", "C1", "CA18", "O15"],
			values: [
				{
					name: "end",
					description:
						"The rendered characters are aligned such that the end of the resulting rendered text is at the initial current text position.",
				},
				{
					name: "middle",
					description:
						"The rendered characters are aligned such that the geometric middle of the resulting rendered text is at the initial current text position.",
				},
				{
					name: "start",
					description:
						"The rendered characters are aligned such that the start of the resulting rendered text is at the initial current text position.",
				},
			],
			syntax: "start | middle | end",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-anchor",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2016-08-02",
				baseline_high_date: "2019-02-02",
			},
			description: "Used to align (start-, middle- or end-alignment) a string of text relative to a given point.",
			restrictions: ["enum"],
		},
		{
			name: "text-decoration",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE3", "O3.5"],
			values: [
				{
					name: "dashed",
					description: "Produces a dashed line style.",
				},
				{
					name: "dotted",
					description: "Produces a dotted line.",
				},
				{
					name: "double",
					description: "Produces a double line.",
				},
				{
					name: "line-through",
					description: "Each line of text has a line through the middle.",
				},
				{
					name: "none",
					description: "Produces no line.",
				},
				{
					name: "overline",
					description: "Each line of text has a line above it.",
				},
				{
					name: "solid",
					description: "Produces a solid line.",
				},
				{
					name: "underline",
					description: "Each line of text is underlined.",
				},
				{
					name: "wavy",
					description: "Produces a wavy line.",
				},
			],
			syntax:
				"<'text-decoration-line'> || <'text-decoration-style'> || <'text-decoration-color'> || <'text-decoration-thickness'>",
			relevance: 91,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-decoration",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Decorations applied to font used for an element's text.",
			restrictions: ["enum", "color"],
		},
		{
			name: "text-decoration-color",
			browsers: ["E79", "FF36", "FFA36", "S12.1", "SM12.2", "C57", "CA57", "O44"],
			syntax: "<color>",
			relevance: 58,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-decoration-color",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Specifies the color of text decoration (underlines overlines, and line-throughs) set on the element with text-decoration-line.",
			restrictions: ["color"],
		},
		{
			name: "text-decoration-line",
			browsers: ["E79", "FF36", "FFA36", "S12.1", "SM12.2", "C57", "CA57", "O44"],
			values: [
				{
					name: "line-through",
					description: "Each line of text has a line through the middle.",
				},
				{
					name: "none",
					description: "Neither produces nor inhibits text decoration.",
				},
				{
					name: "overline",
					description: "Each line of text has a line above it.",
				},
				{
					name: "underline",
					description: "Each line of text is underlined.",
				},
			],
			syntax: "none | [ underline || overline || line-through || blink ] | spelling-error | grammar-error",
			relevance: 60,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-decoration-line",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description: "Specifies what line decorations, if any, are added to the element.",
			restrictions: ["enum"],
		},
		{
			name: "text-decoration-style",
			browsers: ["E79", "FF36", "FFA36", "S12.1", "SM12.2", "C57", "CA57", "O44"],
			values: [
				{
					name: "dashed",
					description: "Produces a dashed line style.",
				},
				{
					name: "dotted",
					description: "Produces a dotted line.",
				},
				{
					name: "double",
					description: "Produces a double line.",
				},
				{
					name: "none",
					description: "Produces no line.",
				},
				{
					name: "solid",
					description: "Produces a solid line.",
				},
				{
					name: "wavy",
					description: "Produces a wavy line.",
				},
			],
			syntax: "solid | double | dotted | dashed | wavy",
			relevance: 54,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-decoration-style",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description: "Specifies the line style for underline, line-through and overline text decoration.",
			restrictions: ["enum"],
		},
		{
			name: "text-indent",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE3", "O3.5"],
			values: [],
			syntax: "<length-percentage> && hanging? && each-line?",
			relevance: 67,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-indent",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Specifies the indentation applied to lines of inline content in a block. The indentation only affects the first line of inline content in the block unless the 'hanging' keyword is specified, in which case it affects all lines except the first.",
			restrictions: ["percentage", "length"],
		},
		{
			name: "text-justify",
			browsers: ["FF55", "FFA55", "IE11", "O19"],
			values: [
				{
					name: "auto",
					description:
						"The UA determines the justification algorithm to follow, based on a balance between performance and adequate presentation quality.",
				},
				{
					name: "distribute",
					description:
						"Justification primarily changes spacing both at word separators and at grapheme cluster boundaries in all scripts except those in the connected and cursive groups. This value is sometimes used in e.g. Japanese, often with the 'text-align-last' property.",
				},
				{
					name: "distribute-all-lines",
				},
				{
					name: "inter-cluster",
					description:
						"Justification primarily changes spacing at word separators and at grapheme cluster boundaries in clustered scripts. This value is typically used for Southeast Asian scripts such as Thai.",
				},
				{
					name: "inter-ideograph",
					description:
						"Justification primarily changes spacing at word separators and at inter-graphemic boundaries in scripts that use no word spaces. This value is typically used for CJK languages.",
				},
				{
					name: "inter-word",
					description:
						"Justification primarily changes spacing at word separators. This value is typically used for languages that separate words using spaces, like English or (sometimes) Korean.",
				},
				{
					name: "kashida",
					description:
						"Justification primarily stretches Arabic and related scripts through the use of kashida or other calligraphic elongation.",
				},
				{
					name: "newspaper",
				},
			],
			syntax: "auto | inter-character | inter-word | none",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-justify",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"Selects the justification algorithm used when 'text-align' is set to 'justify'. The property applies to block containers, but the UA may (but is not required to) also support it on inline elements.",
			restrictions: ["enum"],
		},
		{
			name: "text-orientation",
			browsers: ["E79", "FF41", "FFA41", "S14", "SM14", "C48", "CA48", "O35"],
			values: [
				{
					name: "sideways",
					browsers: ["E79", "FF41", "FFA41", "S14", "SM14", "C48", "CA48", "O35"],
					description:
						"This value is equivalent to 'sideways-right' in 'vertical-rl' writing mode and equivalent to 'sideways-left' in 'vertical-lr' writing mode.",
				},
				{
					name: "sideways-right",
					browsers: ["E79", "FF41", "FFA41", "S14", "SM14", "C48", "CA48", "O35"],
					description:
						"In vertical writing modes, this causes text to be set as if in a horizontal layout, but rotated 90° clockwise.",
				},
				{
					name: "upright",
					description:
						"In vertical writing modes, characters from horizontal-only scripts are rendered upright, i.e. in their standard horizontal orientation.",
				},
			],
			syntax: "mixed | upright | sideways",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-orientation",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-09-16",
				baseline_high_date: "2023-03-16",
			},
			description: "Specifies the orientation of text within a line.",
			restrictions: ["enum"],
		},
		{
			name: "text-overflow",
			browsers: ["E12", "FF7", "FFA7", "S1.3", "SM1", "C1", "CA18", "IE6", "O11"],
			values: [
				{
					name: "clip",
					description: "Clip inline content that overflows. Characters may be only partially rendered.",
				},
				{
					name: "ellipsis",
					description: "Render an ellipsis character (U+2026) to represent clipped inline content.",
				},
			],
			syntax: "[ clip | ellipsis | <string> ]{1,2}",
			relevance: 82,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-overflow",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Text can overflow for example when it is prevented from wrapping.",
			restrictions: ["enum", "string"],
		},
		{
			name: "text-rendering",
			browsers: ["E79", "FF1", "FFA46", "S5", "SM4.2", "C4", "CA18", "O15"],
			values: [
				{
					name: "auto",
				},
				{
					name: "geometricPrecision",
					description:
						"Indicates that the user agent shall emphasize geometric precision over legibility and rendering speed.",
				},
				{
					name: "optimizeLegibility",
					description:
						"Indicates that the user agent shall emphasize legibility over rendering speed and geometric precision.",
				},
				{
					name: "optimizeSpeed",
					description:
						"Indicates that the user agent shall emphasize rendering speed over legibility and geometric precision.",
				},
			],
			syntax: "auto | optimizeSpeed | optimizeLegibility | geometricPrecision",
			relevance: 66,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-rendering",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"The creator of SVG content might want to provide a hint to the implementation about what tradeoffs to make as it renders text. The 'text-rendering' property provides these hints.",
			restrictions: ["enum"],
		},
		{
			name: "text-shadow",
			browsers: ["E12", "FF3.5", "FFA4", "S1.1", "SM1", "C2", "CA18", "IE10", "O9.5"],
			values: [
				{
					name: "none",
					description: "No shadow.",
				},
			],
			syntax: "none | <shadow-t>#",
			relevance: 72,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-shadow",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Enables shadow effects to be applied to the text of the element.",
			restrictions: ["length", "color"],
		},
		{
			name: "text-transform",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O7"],
			values: [
				{
					name: "capitalize",
					description: "Puts the first typographic letter unit of each word in titlecase.",
				},
				{
					name: "lowercase",
					description: "Puts all letters in lowercase.",
				},
				{
					name: "none",
					description: "No effects.",
				},
				{
					name: "uppercase",
					description: "Puts all letters in uppercase.",
				},
			],
			syntax: "none | [ capitalize | uppercase | lowercase ] || full-width || full-size-kana | math-auto",
			relevance: 86,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-transform",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Controls capitalization effects of an element's text.",
			restrictions: ["enum"],
		},
		{
			name: "text-underline-position",
			browsers: ["E12", "FF74", "FFA79", "S12.1", "SM12.2", "C33", "CA33", "IE6", "O20"],
			values: [
				{
					name: "above",
				},
				{
					name: "auto",
					description:
						"The user agent may use any algorithm to determine the underline's position. In horizontal line layout, the underline should be aligned as for alphabetic. In vertical line layout, if the language is set to Japanese or Korean, the underline should be aligned as for over.",
				},
				{
					name: "below",
					description: "The underline is aligned with the under edge of the element's content box.",
				},
			],
			syntax: "auto | from-font | [ under || [ left | right ] ]",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-underline-position",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-07-28",
				baseline_high_date: "2023-01-28",
			},
			description:
				"Sets the position of an underline specified on the same element: it does not affect underlines specified by ancestor elements. This property is typically used in vertical writing contexts such as in Japanese documents where it often desired to have the underline appear 'over' (to the right of) the affected run of text",
			restrictions: ["enum"],
		},
		{
			name: "top",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE5", "O6"],
			values: [
				{
					name: "auto",
					description:
						"For non-replaced elements, the effect of this value depends on which of related properties have the value 'auto' as well",
				},
			],
			syntax: "<length> | <percentage> | auto",
			relevance: 94,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/top",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Specifies how far an absolutely positioned box's top margin edge is offset below the top edge of the box's 'containing block'.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "touch-action",
			browsers: ["E12", "FF52", "FFA52", "S13", "SM9.3", "C36", "CA36", "IE11", "O23"],
			values: [
				{
					name: "auto",
					description:
						"The user agent may determine any permitted touch behaviors for touches that begin on the element.",
				},
				{
					name: "cross-slide-x",
					browsers: ["E12", "FF52", "FFA52", "S13", "SM9.3", "C36", "CA36", "IE11", "O23"],
				},
				{
					name: "cross-slide-y",
					browsers: ["E12", "FF52", "FFA52", "S13", "SM9.3", "C36", "CA36", "IE11", "O23"],
				},
				{
					name: "double-tap-zoom",
					browsers: ["E12", "FF52", "FFA52", "S13", "SM9.3", "C36", "CA36", "IE11", "O23"],
				},
				{
					name: "manipulation",
					description:
						"The user agent may consider touches that begin on the element only for the purposes of scrolling and continuous zooming.",
				},
				{
					name: "none",
					description: "Touches that begin on the element must not trigger default touch behaviors.",
				},
				{
					name: "pan-x",
					description:
						"The user agent may consider touches that begin on the element only for the purposes of horizontally scrolling the element's nearest ancestor with horizontally scrollable content.",
				},
				{
					name: "pan-y",
					description:
						"The user agent may consider touches that begin on the element only for the purposes of vertically scrolling the element's nearest ancestor with vertically scrollable content.",
				},
				{
					name: "pinch-zoom",
					browsers: ["E12", "FF52", "FFA52", "S13", "SM9.3", "C36", "CA36", "IE11", "O23"],
				},
			],
			syntax:
				"auto | none | [ [ pan-x | pan-left | pan-right ] || [ pan-y | pan-up | pan-down ] || pinch-zoom ] | manipulation",
			relevance: 70,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/touch-action",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2019-09-19",
				baseline_high_date: "2022-03-19",
			},
			description: "Determines whether touch input may trigger default behavior supplied by user agent.",
			restrictions: ["enum"],
		},
		{
			name: "transform",
			browsers: ["E12", "FF16", "FFA16", "S9", "SM9", "C36", "CA36", "IE10", "O23"],
			values: [
				{
					name: "matrix()",
					description:
						"Specifies a 2D transformation in the form of a transformation matrix of six values. matrix(a,b,c,d,e,f) is equivalent to applying the transformation matrix [a b c d e f]",
				},
				{
					name: "matrix3d()",
					description: "Specifies a 3D transformation as a 4x4 homogeneous matrix of 16 values in column-major order.",
				},
				{
					name: "none",
				},
				{
					name: "perspective()",
					description: "Specifies a perspective projection matrix.",
				},
				{
					name: "rotate()",
					description:
						"Specifies a 2D rotation by the angle specified in the parameter about the origin of the element, as defined by the transform-origin property.",
				},
				{
					name: "rotate3d()",
					description:
						"Specifies a clockwise 3D rotation by the angle specified in last parameter about the [x,y,z] direction vector described by the first 3 parameters.",
				},
				{
					name: "rotateX('angle')",
					description: "Specifies a clockwise rotation by the given angle about the X axis.",
				},
				{
					name: "rotateY('angle')",
					description: "Specifies a clockwise rotation by the given angle about the Y axis.",
				},
				{
					name: "rotateZ('angle')",
					description: "Specifies a clockwise rotation by the given angle about the Z axis.",
				},
				{
					name: "scale()",
					description:
						"Specifies a 2D scale operation by the [sx,sy] scaling vector described by the 2 parameters. If the second parameter is not provided, it is takes a value equal to the first.",
				},
				{
					name: "scale3d()",
					description: "Specifies a 3D scale operation by the [sx,sy,sz] scaling vector described by the 3 parameters.",
				},
				{
					name: "scaleX()",
					description:
						"Specifies a scale operation using the [sx,1] scaling vector, where sx is given as the parameter.",
				},
				{
					name: "scaleY()",
					description:
						"Specifies a scale operation using the [sy,1] scaling vector, where sy is given as the parameter.",
				},
				{
					name: "scaleZ()",
					description:
						"Specifies a scale operation using the [1,1,sz] scaling vector, where sz is given as the parameter.",
				},
				{
					name: "skew()",
					description:
						"Specifies a skew transformation along the X and Y axes. The first angle parameter specifies the skew on the X axis. The second angle parameter specifies the skew on the Y axis. If the second parameter is not given then a value of 0 is used for the Y angle (ie: no skew on the Y axis).",
				},
				{
					name: "skewX()",
					description: "Specifies a skew transformation along the X axis by the given angle.",
				},
				{
					name: "skewY()",
					description: "Specifies a skew transformation along the Y axis by the given angle.",
				},
				{
					name: "translate()",
					description:
						"Specifies a 2D translation by the vector [tx, ty], where tx is the first translation-value parameter and ty is the optional second translation-value parameter.",
				},
				{
					name: "translate3d()",
					description:
						"Specifies a 3D translation by the vector [tx,ty,tz], with tx, ty and tz being the first, second and third translation-value parameters respectively.",
				},
				{
					name: "translateX()",
					description: "Specifies a translation by the given amount in the X direction.",
				},
				{
					name: "translateY()",
					description: "Specifies a translation by the given amount in the Y direction.",
				},
				{
					name: "translateZ()",
					description:
						"Specifies a translation by the given amount in the Z direction. Note that percentage values are not allowed in the translateZ translation-value, and if present are evaluated as 0.",
				},
			],
			syntax: "none | <transform-list>",
			relevance: 91,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/transform",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description:
				"A two-dimensional transformation is applied to an element through the 'transform' property. This property contains a list of transform functions similar to those allowed by SVG.",
			restrictions: ["enum"],
		},
		{
			name: "transform-origin",
			browsers: ["E12", "FF16", "FFA16", "S9", "SM9", "C36", "CA36", "IE10", "O23"],
			syntax:
				"[ <length-percentage> | left | center | right | top | bottom ] | [ [ <length-percentage> | left | center | right ] && [ <length-percentage> | top | center | bottom ] ] <length>?",
			relevance: 75,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/transform-origin",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description: "Establishes the origin of transformation for an element.",
			restrictions: ["position", "length", "percentage"],
		},
		{
			name: "transform-style",
			browsers: ["E12", "FF16", "FFA16", "S9", "SM9", "C36", "CA36", "O23"],
			values: [
				{
					name: "flat",
					description: "All children of this element are rendered flattened into the 2D plane of the element.",
				},
				{
					name: "preserve-3d",
					browsers: ["E12", "FF16", "FFA16", "S9", "SM9", "C36", "CA36", "O23"],
					description: "Flattening is not performed, so children maintain their position in 3D space.",
				},
			],
			syntax: "flat | preserve-3d",
			relevance: 56,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/transform-style",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description: "Defines how nested elements are rendered in 3D space.",
			restrictions: ["enum"],
		},
		{
			name: "transition",
			browsers: ["E12", "FF16", "FFA16", "S9", "SM9", "C26", "CA26", "IE10", "O12.1"],
			values: [
				{
					name: "all",
					description: "Every property that is able to undergo a transition will do so.",
				},
				{
					name: "none",
					description: "No property will transition.",
				},
			],
			syntax: "<single-transition>#",
			relevance: 89,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/transition",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description: "Shorthand property combines four of the transition properties into a single property.",
			restrictions: ["time", "property", "timing-function", "enum"],
		},
		{
			name: "transition-delay",
			browsers: ["E12", "FF16", "FFA16", "S9", "SM9", "C26", "CA26", "IE10", "O12.1"],
			syntax: "<time>#",
			relevance: 64,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/transition-delay",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description:
				"Defines when the transition will start. It allows a transition to begin execution some period of time from when it is applied.",
			restrictions: ["time"],
		},
		{
			name: "transition-duration",
			browsers: ["E12", "FF16", "FFA16", "S9", "SM9", "C26", "CA26", "IE10", "O12.1"],
			syntax: "<time>#",
			relevance: 69,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/transition-duration",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description: "Specifies how long the transition from the old value to the new value should take.",
			restrictions: ["time"],
		},
		{
			name: "transition-property",
			browsers: ["E12", "FF16", "FFA16", "S9", "SM9", "C26", "CA26", "IE10", "O12.1"],
			values: [
				{
					name: "all",
					description: "Every property that is able to undergo a transition will do so.",
				},
				{
					name: "none",
					description: "No property will transition.",
				},
			],
			syntax: "none | <single-transition-property>#",
			relevance: 69,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/transition-property",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description: "Specifies the name of the CSS property to which the transition is applied.",
			restrictions: ["property"],
		},
		{
			name: "transition-timing-function",
			browsers: ["E12", "FF16", "FFA16", "S9", "SM9", "C26", "CA26", "IE10", "O12.1"],
			syntax: "<easing-function>#",
			relevance: 68,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/transition-timing-function",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description: "Describes how the intermediate values used during a transition will be calculated.",
			restrictions: ["timing-function"],
		},
		{
			name: "unicode-bidi",
			browsers: ["E12", "FF1", "FFA4", "S1.3", "SM1", "C2", "CA18", "IE5.5", "O9.2"],
			values: [
				{
					name: "bidi-override",
					description:
						"Inside the element, reordering is strictly in sequence according to the 'direction' property; the implicit part of the bidirectional algorithm is ignored.",
				},
				{
					name: "embed",
					description:
						"If the element is inline-level, this value opens an additional level of embedding with respect to the bidirectional algorithm. The direction of this embedding level is given by the 'direction' property.",
				},
				{
					name: "isolate",
					browsers: ["E12", "FF1", "FFA4", "S1.3", "SM1", "C2", "CA18", "IE5.5", "O9.2"],
					description: "The contents of the element are considered to be inside a separate, independent paragraph.",
				},
				{
					name: "isolate-override",
					browsers: ["E12", "FF1", "FFA4", "S1.3", "SM1", "C2", "CA18", "IE5.5", "O9.2"],
					description:
						"This combines the isolation behavior of 'isolate' with the directional override behavior of 'bidi-override'",
				},
				{
					name: "normal",
					description:
						"The element does not open an additional level of embedding with respect to the bidirectional algorithm. For inline-level elements, implicit reordering works across element boundaries.",
				},
				{
					name: "plaintext",
					browsers: ["E12", "FF1", "FFA4", "S1.3", "SM1", "C2", "CA18", "IE5.5", "O9.2"],
					description:
						"For the purposes of the Unicode bidirectional algorithm, the base directionality of each bidi paragraph for which the element forms the containing block is determined not by the element's computed 'direction'.",
				},
			],
			syntax: "normal | embed | isolate | bidi-override | isolate-override | plaintext",
			relevance: 56,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/unicode-bidi",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "The level of embedding with respect to the bidirectional algorithm.",
			restrictions: ["enum"],
		},
		{
			name: "unicode-range",
			values: [
				{
					name: "U+26",
					description: "Ampersand.",
				},
				{
					name: "U+20-24F, U+2B0-2FF, U+370-4FF, U+1E00-1EFF, U+2000-20CF, U+2100-23FF, U+2500-26FF, U+E000-F8FF, U+FB00-FB4F",
					description: "WGL4 character set (Pan-European).",
				},
				{
					name: "U+20-17F, U+2B0-2FF, U+2000-206F, U+20A0-20CF, U+2100-21FF, U+2600-26FF",
					description: "The Multilingual European Subset No. 1. Latin. Covers ~44 languages.",
				},
				{
					name: "U+20-2FF, U+370-4FF, U+1E00-20CF, U+2100-23FF, U+2500-26FF, U+FB00-FB4F, U+FFF0-FFFD",
					description: "The Multilingual European Subset No. 2. Latin, Greek, and Cyrillic. Covers ~128 language.",
				},
				{
					name: "U+20-4FF, U+530-58F, U+10D0-10FF, U+1E00-23FF, U+2440-245F, U+2500-26FF, U+FB00-FB4F, U+FE20-FE2F, U+FFF0-FFFD",
					description: "The Multilingual European Subset No. 3. Covers all characters belonging to European scripts.",
				},
				{
					name: "U+00-7F",
					description: "Basic Latin (ASCII).",
				},
				{
					name: "U+80-FF",
					description:
						"Latin-1 Supplement. Accented characters for Western European languages, common punctuation characters, multiplication and division signs.",
				},
				{
					name: "U+100-17F",
					description: "Latin Extended-A. Accented characters for for Czech, Dutch, Polish, and Turkish.",
				},
				{
					name: "U+180-24F",
					description:
						"Latin Extended-B. Croatian, Slovenian, Romanian, Non-European and historic latin, Khoisan, Pinyin, Livonian, Sinology.",
				},
				{
					name: "U+1E00-1EFF",
					description: "Latin Extended Additional. Vietnamese, German captial sharp s, Medievalist, Latin general use.",
				},
				{
					name: "U+250-2AF",
					description: "International Phonetic Alphabet Extensions.",
				},
				{
					name: "U+370-3FF",
					description: "Greek and Coptic.",
				},
				{
					name: "U+1F00-1FFF",
					description: "Greek Extended. Accented characters for polytonic Greek.",
				},
				{
					name: "U+400-4FF",
					description: "Cyrillic.",
				},
				{
					name: "U+500-52F",
					description:
						"Cyrillic Supplement. Extra letters for Komi, Khanty, Chukchi, Mordvin, Kurdish, Aleut, Chuvash, Abkhaz, Azerbaijani, and Orok.",
				},
				{
					name: "U+00-52F, U+1E00-1FFF, U+2200-22FF",
					description: "Latin, Greek, Cyrillic, some punctuation and symbols.",
				},
				{
					name: "U+530-58F",
					description: "Armenian.",
				},
				{
					name: "U+590-5FF",
					description: "Hebrew.",
				},
				{
					name: "U+600-6FF",
					description: "Arabic.",
				},
				{
					name: "U+750-77F",
					description:
						"Arabic Supplement. Additional letters for African languages, Khowar, Torwali, Burushaski, and early Persian.",
				},
				{
					name: "U+8A0-8FF",
					description:
						"Arabic Extended-A. Additional letters for African languages, European and Central Asian languages, Rohingya, Tamazight, Arwi, and Koranic annotation signs.",
				},
				{
					name: "U+700-74F",
					description: "Syriac.",
				},
				{
					name: "U+900-97F",
					description: "Devanagari.",
				},
				{
					name: "U+980-9FF",
					description: "Bengali.",
				},
				{
					name: "U+A00-A7F",
					description: "Gurmukhi.",
				},
				{
					name: "U+A80-AFF",
					description: "Gujarati.",
				},
				{
					name: "U+B00-B7F",
					description: "Oriya.",
				},
				{
					name: "U+B80-BFF",
					description: "Tamil.",
				},
				{
					name: "U+C00-C7F",
					description: "Telugu.",
				},
				{
					name: "U+C80-CFF",
					description: "Kannada.",
				},
				{
					name: "U+D00-D7F",
					description: "Malayalam.",
				},
				{
					name: "U+D80-DFF",
					description: "Sinhala.",
				},
				{
					name: "U+118A0-118FF",
					description: "Warang Citi.",
				},
				{
					name: "U+E00-E7F",
					description: "Thai.",
				},
				{
					name: "U+1A20-1AAF",
					description: "Tai Tham.",
				},
				{
					name: "U+AA80-AADF",
					description: "Tai Viet.",
				},
				{
					name: "U+E80-EFF",
					description: "Lao.",
				},
				{
					name: "U+F00-FFF",
					description: "Tibetan.",
				},
				{
					name: "U+1000-109F",
					description: "Myanmar (Burmese).",
				},
				{
					name: "U+10A0-10FF",
					description: "Georgian.",
				},
				{
					name: "U+1200-137F",
					description: "Ethiopic.",
				},
				{
					name: "U+1380-139F",
					description: "Ethiopic Supplement. Extra Syllables for Sebatbeit, and Tonal marks",
				},
				{
					name: "U+2D80-2DDF",
					description: "Ethiopic Extended. Extra Syllables for Me'en, Blin, and Sebatbeit.",
				},
				{
					name: "U+AB00-AB2F",
					description: "Ethiopic Extended-A. Extra characters for Gamo-Gofa-Dawro, Basketo, and Gumuz.",
				},
				{
					name: "U+1780-17FF",
					description: "Khmer.",
				},
				{
					name: "U+1800-18AF",
					description: "Mongolian.",
				},
				{
					name: "U+1B80-1BBF",
					description: "Sundanese.",
				},
				{
					name: "U+1CC0-1CCF",
					description: "Sundanese Supplement. Punctuation.",
				},
				{
					name: "U+4E00-9FD5",
					description:
						"CJK (Chinese, Japanese, Korean) Unified Ideographs. Most common ideographs for modern Chinese and Japanese.",
				},
				{
					name: "U+3400-4DB5",
					description: "CJK Unified Ideographs Extension A. Rare ideographs.",
				},
				{
					name: "U+2F00-2FDF",
					description: "Kangxi Radicals.",
				},
				{
					name: "U+2E80-2EFF",
					description: "CJK Radicals Supplement. Alternative forms of Kangxi Radicals.",
				},
				{
					name: "U+1100-11FF",
					description: "Hangul Jamo.",
				},
				{
					name: "U+AC00-D7AF",
					description: "Hangul Syllables.",
				},
				{
					name: "U+3040-309F",
					description: "Hiragana.",
				},
				{
					name: "U+30A0-30FF",
					description: "Katakana.",
				},
				{
					name: "U+A5, U+4E00-9FFF, U+30??, U+FF00-FF9F",
					description: "Japanese Kanji, Hiragana and Katakana characters plus Yen/Yuan symbol.",
				},
				{
					name: "U+A4D0-A4FF",
					description: "Lisu.",
				},
				{
					name: "U+A000-A48F",
					description: "Yi Syllables.",
				},
				{
					name: "U+A490-A4CF",
					description: "Yi Radicals.",
				},
				{
					name: "U+2000-206F",
					description: "General Punctuation.",
				},
				{
					name: "U+3000-303F",
					description: "CJK Symbols and Punctuation.",
				},
				{
					name: "U+2070-209F",
					description: "Superscripts and Subscripts.",
				},
				{
					name: "U+20A0-20CF",
					description: "Currency Symbols.",
				},
				{
					name: "U+2100-214F",
					description: "Letterlike Symbols.",
				},
				{
					name: "U+2150-218F",
					description: "Number Forms.",
				},
				{
					name: "U+2190-21FF",
					description: "Arrows.",
				},
				{
					name: "U+2200-22FF",
					description: "Mathematical Operators.",
				},
				{
					name: "U+2300-23FF",
					description: "Miscellaneous Technical.",
				},
				{
					name: "U+E000-F8FF",
					description: "Private Use Area.",
				},
				{
					name: "U+FB00-FB4F",
					description: "Alphabetic Presentation Forms. Ligatures for latin, Armenian, and Hebrew.",
				},
				{
					name: "U+FB50-FDFF",
					description:
						"Arabic Presentation Forms-A. Contextual forms / ligatures for Persian, Urdu, Sindhi, Central Asian languages, etc, Arabic pedagogical symbols, word ligatures.",
				},
				{
					name: "U+1F600-1F64F",
					description: "Emoji: Emoticons.",
				},
				{
					name: "U+2600-26FF",
					description: "Emoji: Miscellaneous Symbols.",
				},
				{
					name: "U+1F300-1F5FF",
					description: "Emoji: Miscellaneous Symbols and Pictographs.",
				},
				{
					name: "U+1F900-1F9FF",
					description: "Emoji: Supplemental Symbols and Pictographs.",
				},
				{
					name: "U+1F680-1F6FF",
					description: "Emoji: Transport and Map Symbols.",
				},
			],
			atRule: "@font-face",
			syntax: "<unicode-range-token>#",
			relevance: 72,
			description:
				"@font-face descriptor. Defines the set of Unicode codepoints that may be supported by the font face for which it is declared.",
			restrictions: ["unicode-range"],
		},
		{
			name: "user-select",
			browsers: ["E79", "FF69", "FFA79", "C54", "CA54", "IE10", "O41"],
			values: [
				{
					name: "all",
					description: "The content of the element must be selected atomically",
				},
				{
					name: "auto",
				},
				{
					name: "contain",
					description:
						"UAs must not allow a selection which is started in this element to be extended outside of this element.",
				},
				{
					name: "none",
					description: "The UA must not allow selections to be started in this element.",
				},
				{
					name: "text",
					description: "The element imposes no constraint on the selection.",
				},
			],
			syntax: "auto | text | none | all",
			relevance: 82,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/user-select",
				},
			],
			baseline: {
				status: "false",
			},
			description: "Controls the appearance of selection.",
			restrictions: ["enum"],
		},
		{
			name: "vertical-align",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O4"],
			values: [
				{
					name: "auto",
					description:
						"Align the dominant baseline of the parent box with the equivalent, or heuristically reconstructed, baseline of the element inline box.",
				},
				{
					name: "baseline",
					description:
						"Align the 'alphabetic' baseline of the element with the 'alphabetic' baseline of the parent element.",
				},
				{
					name: "bottom",
					description: "Align the after edge of the extended inline box with the after-edge of the line box.",
				},
				{
					name: "middle",
					description: "Align the 'middle' baseline of the inline element with the middle baseline of the parent.",
				},
				{
					name: "sub",
					description:
						"Lower the baseline of the box to the proper position for subscripts of the parent's box. (This value has no effect on the font size of the element's text.)",
				},
				{
					name: "super",
					description:
						"Raise the baseline of the box to the proper position for superscripts of the parent's box. (This value has no effect on the font size of the element's text.)",
				},
				{
					name: "text-bottom",
					description: "Align the bottom of the box with the after-edge of the parent element's font.",
				},
				{
					name: "text-top",
					description: "Align the top of the box with the before-edge of the parent element's font.",
				},
				{
					name: "top",
					description: "Align the before edge of the extended inline box with the before-edge of the line box.",
				},
				{
					name: "-webkit-baseline-middle",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O4"],
				},
			],
			syntax: "baseline | sub | super | text-top | text-bottom | middle | top | bottom | <percentage> | <length>",
			relevance: 90,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/vertical-align",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Affects the vertical positioning of the inline boxes generated by an inline-level element inside a line box.",
			restrictions: ["percentage", "length"],
		},
		{
			name: "visibility",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O4"],
			values: [
				{
					name: "collapse",
					description:
						"Table-specific. If used on elements other than rows, row groups, columns, or column groups, 'collapse' has the same meaning as 'hidden'.",
				},
				{
					name: "hidden",
					description:
						"The generated box is invisible (fully transparent, nothing is drawn), but still affects layout.",
				},
				{
					name: "visible",
					description: "The generated box is visible.",
				},
			],
			syntax: "visible | hidden | collapse",
			relevance: 87,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/visibility",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Specifies whether the boxes generated by an element are rendered. Invisible boxes still affect layout (set the 'display' property to 'none' to suppress box generation altogether).",
			restrictions: ["enum"],
		},
		{
			name: "-webkit-animation",
			browsers: ["C", "S5"],
			values: [
				{
					name: "alternate",
					description:
						"The animation cycle iterations that are odd counts are played in the normal direction, and the animation cycle iterations that are even counts are played in a reverse direction.",
				},
				{
					name: "alternate-reverse",
					description:
						"The animation cycle iterations that are odd counts are played in the reverse direction, and the animation cycle iterations that are even counts are played in a normal direction.",
				},
				{
					name: "backwards",
					description:
						"The beginning property value (as defined in the first @keyframes at-rule) is applied before the animation is displayed, during the period defined by 'animation-delay'.",
				},
				{
					name: "both",
					description: "Both forwards and backwards fill modes are applied.",
				},
				{
					name: "forwards",
					description:
						"The final property value (as defined in the last @keyframes at-rule) is maintained after the animation completes.",
				},
				{
					name: "infinite",
					description: "Causes the animation to repeat forever.",
				},
				{
					name: "none",
					description: "No animation is performed",
				},
				{
					name: "normal",
					description: "Normal playback.",
				},
				{
					name: "reverse",
					description:
						"All iterations of the animation are played in the reverse direction from the way they were specified.",
				},
			],
			relevance: 50,
			description: "Shorthand property combines six of the animation properties into a single property.",
			restrictions: ["time", "enum", "timing-function", "identifier", "number"],
		},
		{
			name: "-webkit-animation-delay",
			browsers: ["C", "S5"],
			relevance: 50,
			description: "Defines when the animation will start.",
			restrictions: ["time"],
		},
		{
			name: "-webkit-animation-direction",
			browsers: ["C", "S5"],
			values: [
				{
					name: "alternate",
					description:
						"The animation cycle iterations that are odd counts are played in the normal direction, and the animation cycle iterations that are even counts are played in a reverse direction.",
				},
				{
					name: "alternate-reverse",
					description:
						"The animation cycle iterations that are odd counts are played in the reverse direction, and the animation cycle iterations that are even counts are played in a normal direction.",
				},
				{
					name: "normal",
					description: "Normal playback.",
				},
				{
					name: "reverse",
					description:
						"All iterations of the animation are played in the reverse direction from the way they were specified.",
				},
			],
			relevance: 50,
			description: "Defines whether or not the animation should play in reverse on alternate cycles.",
			restrictions: ["enum"],
		},
		{
			name: "-webkit-animation-duration",
			browsers: ["C", "S5"],
			relevance: 50,
			description: "Defines the length of time that an animation takes to complete one cycle.",
			restrictions: ["time"],
		},
		{
			name: "-webkit-animation-fill-mode",
			browsers: ["C", "S5"],
			values: [
				{
					name: "backwards",
					description:
						"The beginning property value (as defined in the first @keyframes at-rule) is applied before the animation is displayed, during the period defined by 'animation-delay'.",
				},
				{
					name: "both",
					description: "Both forwards and backwards fill modes are applied.",
				},
				{
					name: "forwards",
					description:
						"The final property value (as defined in the last @keyframes at-rule) is maintained after the animation completes.",
				},
				{
					name: "none",
					description:
						"There is no change to the property value between the time the animation is applied and the time the animation begins playing or after the animation completes.",
				},
			],
			relevance: 50,
			description: "Defines what values are applied by the animation outside the time it is executing.",
			restrictions: ["enum"],
		},
		{
			name: "-webkit-animation-iteration-count",
			browsers: ["C", "S5"],
			values: [
				{
					name: "infinite",
					description: "Causes the animation to repeat forever.",
				},
			],
			relevance: 50,
			description:
				"Defines the number of times an animation cycle is played. The default value is one, meaning the animation will play from beginning to end once.",
			restrictions: ["number", "enum"],
		},
		{
			name: "-webkit-animation-name",
			browsers: ["C", "S5"],
			values: [
				{
					name: "none",
					description: "No animation is performed",
				},
			],
			relevance: 50,
			description:
				"Defines a list of animations that apply. Each name is used to select the keyframe at-rule that provides the property values for the animation.",
			restrictions: ["identifier", "enum"],
		},
		{
			name: "-webkit-animation-play-state",
			browsers: ["C", "S5"],
			values: [
				{
					name: "paused",
					description: "A running animation will be paused.",
				},
				{
					name: "running",
					description: "Resume playback of a paused animation.",
				},
			],
			relevance: 50,
			description: "Defines whether the animation is running or paused.",
			restrictions: ["enum"],
		},
		{
			name: "-webkit-animation-timing-function",
			browsers: ["C", "S5"],
			relevance: 50,
			description:
				"Describes how the animation will progress over one cycle of its duration. See the 'transition-timing-function'.",
			restrictions: ["timing-function"],
		},
		{
			name: "-webkit-appearance",
			browsers: ["C", "S3"],
			values: [
				{
					name: "button",
				},
				{
					name: "button-bevel",
				},
				{
					name: "caps-lock-indicator",
				},
				{
					name: "caret",
				},
				{
					name: "checkbox",
				},
				{
					name: "default-button",
				},
				{
					name: "listbox",
				},
				{
					name: "listitem",
				},
				{
					name: "media-fullscreen-button",
				},
				{
					name: "media-mute-button",
				},
				{
					name: "media-play-button",
				},
				{
					name: "media-seek-back-button",
				},
				{
					name: "media-seek-forward-button",
				},
				{
					name: "media-slider",
				},
				{
					name: "media-sliderthumb",
				},
				{
					name: "menulist",
				},
				{
					name: "menulist-button",
				},
				{
					name: "menulist-text",
				},
				{
					name: "menulist-textfield",
				},
				{
					name: "none",
				},
				{
					name: "push-button",
				},
				{
					name: "radio",
				},
				{
					name: "scrollbarbutton-down",
				},
				{
					name: "scrollbarbutton-left",
				},
				{
					name: "scrollbarbutton-right",
				},
				{
					name: "scrollbarbutton-up",
				},
				{
					name: "scrollbargripper-horizontal",
				},
				{
					name: "scrollbargripper-vertical",
				},
				{
					name: "scrollbarthumb-horizontal",
				},
				{
					name: "scrollbarthumb-vertical",
				},
				{
					name: "scrollbartrack-horizontal",
				},
				{
					name: "scrollbartrack-vertical",
				},
				{
					name: "searchfield",
				},
				{
					name: "searchfield-cancel-button",
				},
				{
					name: "searchfield-decoration",
				},
				{
					name: "searchfield-results-button",
				},
				{
					name: "searchfield-results-decoration",
				},
				{
					name: "slider-horizontal",
				},
				{
					name: "sliderthumb-horizontal",
				},
				{
					name: "sliderthumb-vertical",
				},
				{
					name: "slider-vertical",
				},
				{
					name: "square-button",
				},
				{
					name: "textarea",
				},
				{
					name: "textfield",
				},
			],
			status: "nonstandard",
			syntax:
				"none | button | button-bevel | caret | checkbox | default-button | inner-spin-button | listbox | listitem | media-controls-background | media-controls-fullscreen-background | media-current-time-display | media-enter-fullscreen-button | media-exit-fullscreen-button | media-fullscreen-button | media-mute-button | media-overlay-play-button | media-play-button | media-seek-back-button | media-seek-forward-button | media-slider | media-sliderthumb | media-time-remaining-display | media-toggle-closed-captions-button | media-volume-slider | media-volume-slider-container | media-volume-sliderthumb | menulist | menulist-button | menulist-text | menulist-textfield | meter | progress-bar | progress-bar-value | push-button | radio | searchfield | searchfield-cancel-button | searchfield-decoration | searchfield-results-button | searchfield-results-decoration | slider-horizontal | slider-vertical | sliderthumb-horizontal | sliderthumb-vertical | square-button | textarea | textfield | -apple-pay-button",
			relevance: 0,
			description: "Changes the appearance of buttons and other controls to resemble native controls.",
			restrictions: ["enum"],
		},
		{
			name: "-webkit-backdrop-filter",
			browsers: ["S9"],
			values: [
				{
					name: "none",
					description: "No filter effects are applied.",
				},
				{
					name: "blur()",
					description: "Applies a Gaussian blur to the input image.",
				},
				{
					name: "brightness()",
					description: "Applies a linear multiplier to input image, making it appear more or less bright.",
				},
				{
					name: "contrast()",
					description: "Adjusts the contrast of the input.",
				},
				{
					name: "drop-shadow()",
					description: "Applies a drop shadow effect to the input image.",
				},
				{
					name: "grayscale()",
					description: "Converts the input image to grayscale.",
				},
				{
					name: "hue-rotate()",
					description: "Applies a hue rotation on the input image. ",
				},
				{
					name: "invert()",
					description: "Inverts the samples in the input image.",
				},
				{
					name: "opacity()",
					description: "Applies transparency to the samples in the input image.",
				},
				{
					name: "saturate()",
					description: "Saturates the input image.",
				},
				{
					name: "sepia()",
					description: "Converts the input image to sepia.",
				},
				{
					name: "url()",
					description: "A filter reference to a <filter> element.",
				},
			],
			relevance: 50,
			description:
				"Applies a filter effect where the first filter in the list takes the element's background image as the input image.",
			restrictions: ["enum", "url"],
		},
		{
			name: "-webkit-backface-visibility",
			browsers: ["C", "S5"],
			values: [
				{
					name: "hidden",
				},
				{
					name: "visible",
				},
			],
			relevance: 50,
			description:
				"Determines whether or not the 'back' side of a transformed element is visible when facing the viewer. With an identity transform, the front side of an element faces the viewer.",
			restrictions: ["enum"],
		},
		{
			name: "-webkit-background-clip",
			browsers: ["C", "S3"],
			relevance: 50,
			description: "Determines the background painting area.",
			restrictions: ["box"],
		},
		{
			name: "-webkit-background-composite",
			browsers: ["C", "S3"],
			values: [
				{
					name: "border",
				},
				{
					name: "padding",
				},
			],
			relevance: 50,
			restrictions: ["enum"],
		},
		{
			name: "-webkit-background-origin",
			browsers: ["C", "S3"],
			relevance: 50,
			description:
				"For elements rendered as a single box, specifies the background positioning area. For elements rendered as multiple boxes (e.g., inline boxes on several lines, boxes on several pages) specifies which boxes 'box-decoration-break' operates on to determine the background positioning area(s).",
			restrictions: ["box"],
		},
		{
			name: "-webkit-border-image",
			browsers: ["C", "S5"],
			values: [
				{
					name: "auto",
					description:
						"If 'auto' is specified then the border image width is the intrinsic width or height (whichever is applicable) of the corresponding image slice. If the image does not have the required intrinsic dimension then the corresponding border-width is used instead.",
				},
				{
					name: "fill",
					description: "Causes the middle part of the border-image to be preserved.",
				},
				{
					name: "none",
				},
				{
					name: "repeat",
					description: "The image is tiled (repeated) to fill the area.",
				},
				{
					name: "round",
					description:
						"The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the image is rescaled so that it does.",
				},
				{
					name: "space",
					description:
						"The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the extra space is distributed around the tiles.",
				},
				{
					name: "stretch",
					description: "The image is stretched to fill the area.",
				},
				{
					name: "url()",
				},
			],
			relevance: 50,
			description:
				"Shorthand property for setting 'border-image-source', 'border-image-slice', 'border-image-width', 'border-image-outset' and 'border-image-repeat'. Omitted values are set to their initial values.",
			restrictions: ["length", "percentage", "number", "url", "enum"],
		},
		{
			name: "-webkit-box-align",
			browsers: ["C", "S3"],
			values: [
				{
					name: "baseline",
					description:
						"If this box orientation is inline-axis or horizontal, all children are placed with their baselines aligned, and extra space placed before or after as necessary. For block flows, the baseline of the first non-empty line box located within the element is used. For tables, the baseline of the first cell is used.",
				},
				{
					name: "center",
					description:
						"Any extra space is divided evenly, with half placed above the child and the other half placed after the child.",
				},
				{
					name: "end",
					description:
						"For normal direction boxes, the bottom edge of each child is placed along the bottom of the box. Extra space is placed above the element. For reverse direction boxes, the top edge of each child is placed along the top of the box. Extra space is placed below the element.",
				},
				{
					name: "start",
					description:
						"For normal direction boxes, the top edge of each child is placed along the top of the box. Extra space is placed below the element. For reverse direction boxes, the bottom edge of each child is placed along the bottom of the box. Extra space is placed above the element.",
				},
				{
					name: "stretch",
					description: "The height of each child is adjusted to that of the containing block.",
				},
			],
			relevance: 50,
			description: "Specifies the alignment of nested elements within an outer flexible box element.",
			restrictions: ["enum"],
		},
		{
			name: "-webkit-box-direction",
			browsers: ["C", "S3"],
			values: [
				{
					name: "normal",
					description:
						"A box with a computed value of horizontal for box-orient displays its children from left to right. A box with a computed value of vertical displays its children from top to bottom.",
				},
				{
					name: "reverse",
					description:
						"A box with a computed value of horizontal for box-orient displays its children from right to left. A box with a computed value of vertical displays its children from bottom to top.",
				},
			],
			relevance: 50,
			description:
				"In webkit applications, -webkit-box-direction specifies whether a box lays out its contents normally (from the top or left edge), or in reverse (from the bottom or right edge).",
			restrictions: ["enum"],
		},
		{
			name: "-webkit-box-flex",
			browsers: ["C", "S3"],
			relevance: 50,
			description: "Specifies an element's flexibility.",
			restrictions: ["number"],
		},
		{
			name: "-webkit-box-flex-group",
			browsers: ["C", "S3"],
			relevance: 50,
			description: "Flexible elements can be assigned to flex groups using the 'box-flex-group' property.",
			restrictions: ["integer"],
		},
		{
			name: "-webkit-box-ordinal-group",
			browsers: ["C", "S3"],
			relevance: 50,
			description:
				"Indicates the ordinal group the element belongs to. Elements with a lower ordinal group are displayed before those with a higher ordinal group.",
			restrictions: ["integer"],
		},
		{
			name: "-webkit-box-orient",
			browsers: ["C", "S3"],
			values: [
				{
					name: "block-axis",
					description: "Elements are oriented along the box's axis.",
				},
				{
					name: "horizontal",
					description: "The box displays its children from left to right in a horizontal line.",
				},
				{
					name: "inline-axis",
					description: "Elements are oriented vertically.",
				},
				{
					name: "vertical",
					description: "The box displays its children from stacked from top to bottom vertically.",
				},
			],
			relevance: 50,
			description:
				"In webkit applications, -webkit-box-orient specifies whether a box lays out its contents horizontally or vertically.",
			restrictions: ["enum"],
		},
		{
			name: "-webkit-box-pack",
			browsers: ["C", "S3"],
			values: [
				{
					name: "center",
					description:
						"The extra space is divided evenly, with half placed before the first child and the other half placed after the last child.",
				},
				{
					name: "end",
					description:
						"For normal direction boxes, the right edge of the last child is placed at the right side, with all extra space placed before the first child. For reverse direction boxes, the left edge of the first child is placed at the left side, with all extra space placed after the last child.",
				},
				{
					name: "justify",
					description:
						"The space is divided evenly in-between each child, with none of the extra space placed before the first child or after the last child. If there is only one child, treat the pack value as if it were start.",
				},
				{
					name: "start",
					description:
						"For normal direction boxes, the left edge of the first child is placed at the left side, with all extra space placed after the last child. For reverse direction boxes, the right edge of the last child is placed at the right side, with all extra space placed before the first child.",
				},
			],
			relevance: 50,
			description: "Specifies alignment of child elements within the current element in the direction of orientation.",
			restrictions: ["enum"],
		},
		{
			name: "-webkit-box-reflect",
			browsers: ["E79", "S4", "SM3.2", "C4", "CA18", "O15"],
			values: [
				{
					name: "above",
					description: "The reflection appears above the border box.",
				},
				{
					name: "below",
					description: "The reflection appears below the border box.",
				},
				{
					name: "left",
					description: "The reflection appears to the left of the border box.",
				},
				{
					name: "right",
					description: "The reflection appears to the right of the border box.",
				},
			],
			status: "nonstandard",
			syntax: "[ above | below | right | left ]? <length>? <image>?",
			relevance: 0,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/-webkit-box-reflect",
				},
			],
			baseline: {
				status: "false",
			},
			description: "Defines a reflection of a border box.",
		},
		{
			name: "-webkit-box-sizing",
			browsers: ["C", "S3"],
			values: [
				{
					name: "border-box",
					description:
						"The specified width and height (and respective min/max properties) on this element determine the border box of the element.",
				},
				{
					name: "content-box",
					description:
						"Behavior of width and height as specified by CSS2.1. The specified width and height (and respective min/max properties) apply to the width and height respectively of the content box of the element.",
				},
			],
			relevance: 50,
			description: "Box Model addition in CSS3.",
			restrictions: ["enum"],
		},
		{
			name: "-webkit-break-after",
			browsers: ["S7"],
			values: [
				{
					name: "always",
					description: "Always force a page break before/after the generated box.",
				},
				{
					name: "auto",
					description: "Neither force nor forbid a page/column break before/after the generated box.",
				},
				{
					name: "avoid",
					description: "Avoid a page/column break before/after the generated box.",
				},
				{
					name: "avoid-column",
					description: "Avoid a column break before/after the generated box.",
				},
				{
					name: "avoid-page",
					description: "Avoid a page break before/after the generated box.",
				},
				{
					name: "avoid-region",
				},
				{
					name: "column",
					description: "Always force a column break before/after the generated box.",
				},
				{
					name: "left",
					description:
						"Force one or two page breaks before/after the generated box so that the next page is formatted as a left page.",
				},
				{
					name: "page",
					description: "Always force a page break before/after the generated box.",
				},
				{
					name: "region",
				},
				{
					name: "right",
					description:
						"Force one or two page breaks before/after the generated box so that the next page is formatted as a right page.",
				},
			],
			relevance: 50,
			description: "Describes the page/column break behavior before the generated box.",
			restrictions: ["enum"],
		},
		{
			name: "-webkit-break-before",
			browsers: ["S7"],
			values: [
				{
					name: "always",
					description: "Always force a page break before/after the generated box.",
				},
				{
					name: "auto",
					description: "Neither force nor forbid a page/column break before/after the generated box.",
				},
				{
					name: "avoid",
					description: "Avoid a page/column break before/after the generated box.",
				},
				{
					name: "avoid-column",
					description: "Avoid a column break before/after the generated box.",
				},
				{
					name: "avoid-page",
					description: "Avoid a page break before/after the generated box.",
				},
				{
					name: "avoid-region",
				},
				{
					name: "column",
					description: "Always force a column break before/after the generated box.",
				},
				{
					name: "left",
					description:
						"Force one or two page breaks before/after the generated box so that the next page is formatted as a left page.",
				},
				{
					name: "page",
					description: "Always force a page break before/after the generated box.",
				},
				{
					name: "region",
				},
				{
					name: "right",
					description:
						"Force one or two page breaks before/after the generated box so that the next page is formatted as a right page.",
				},
			],
			relevance: 50,
			description: "Describes the page/column break behavior before the generated box.",
			restrictions: ["enum"],
		},
		{
			name: "-webkit-break-inside",
			browsers: ["S7"],
			values: [
				{
					name: "auto",
					description: "Neither force nor forbid a page/column break inside the generated box.",
				},
				{
					name: "avoid",
					description: "Avoid a page/column break inside the generated box.",
				},
				{
					name: "avoid-column",
					description: "Avoid a column break inside the generated box.",
				},
				{
					name: "avoid-page",
					description: "Avoid a page break inside the generated box.",
				},
				{
					name: "avoid-region",
				},
			],
			relevance: 50,
			description: "Describes the page/column break behavior inside the generated box.",
			restrictions: ["enum"],
		},
		{
			name: "-webkit-column-break-after",
			browsers: ["E79", "S4", "SM3.2", "C1", "CA18", "O15"],
			values: [
				{
					name: "always",
					description: "Always force a page break before/after the generated box.",
				},
				{
					name: "auto",
					description: "Neither force nor forbid a page/column break before/after the generated box.",
				},
				{
					name: "avoid",
					description: "Avoid a page/column break before/after the generated box.",
				},
				{
					name: "avoid-column",
					description: "Avoid a column break before/after the generated box.",
				},
				{
					name: "avoid-page",
					description: "Avoid a page break before/after the generated box.",
				},
				{
					name: "avoid-region",
				},
				{
					name: "column",
					description: "Always force a column break before/after the generated box.",
				},
				{
					name: "left",
					description:
						"Force one or two page breaks before/after the generated box so that the next page is formatted as a left page.",
				},
				{
					name: "page",
					description: "Always force a page break before/after the generated box.",
				},
				{
					name: "region",
				},
				{
					name: "right",
					description:
						"Force one or two page breaks before/after the generated box so that the next page is formatted as a right page.",
				},
			],
			relevance: 50,
			baseline: {
				status: "false",
			},
			description: "Describes the page/column break behavior before the generated box.",
			restrictions: ["enum"],
		},
		{
			name: "-webkit-column-break-before",
			browsers: ["E79", "S4", "SM3.2", "C1", "CA18", "O15"],
			values: [
				{
					name: "always",
					description: "Always force a page break before/after the generated box.",
				},
				{
					name: "auto",
					description: "Neither force nor forbid a page/column break before/after the generated box.",
				},
				{
					name: "avoid",
					description: "Avoid a page/column break before/after the generated box.",
				},
				{
					name: "avoid-column",
					description: "Avoid a column break before/after the generated box.",
				},
				{
					name: "avoid-page",
					description: "Avoid a page break before/after the generated box.",
				},
				{
					name: "avoid-region",
				},
				{
					name: "column",
					description: "Always force a column break before/after the generated box.",
				},
				{
					name: "left",
					description:
						"Force one or two page breaks before/after the generated box so that the next page is formatted as a left page.",
				},
				{
					name: "page",
					description: "Always force a page break before/after the generated box.",
				},
				{
					name: "region",
				},
				{
					name: "right",
					description:
						"Force one or two page breaks before/after the generated box so that the next page is formatted as a right page.",
				},
			],
			relevance: 50,
			baseline: {
				status: "false",
			},
			description: "Describes the page/column break behavior before the generated box.",
			restrictions: ["enum"],
		},
		{
			name: "-webkit-column-break-inside",
			browsers: ["E79", "S4", "SM3.2", "C1", "CA18", "O15"],
			values: [
				{
					name: "auto",
					description: "Neither force nor forbid a page/column break inside the generated box.",
				},
				{
					name: "avoid",
					description: "Avoid a page/column break inside the generated box.",
				},
				{
					name: "avoid-column",
					description: "Avoid a column break inside the generated box.",
				},
				{
					name: "avoid-page",
					description: "Avoid a page break inside the generated box.",
				},
				{
					name: "avoid-region",
				},
			],
			relevance: 50,
			baseline: {
				status: "false",
			},
			description: "Describes the page/column break behavior inside the generated box.",
			restrictions: ["enum"],
		},
		{
			name: "-webkit-column-count",
			browsers: ["C", "S3"],
			values: [
				{
					name: "auto",
					description: "Determines the number of columns by the 'column-width' property and the element width.",
				},
			],
			relevance: 50,
			description: "Describes the optimal number of columns into which the content of the element will be flowed.",
			restrictions: ["integer"],
		},
		{
			name: "-webkit-column-gap",
			browsers: ["C", "S3"],
			values: [
				{
					name: "normal",
					description: "User agent specific and typically equivalent to 1em.",
				},
			],
			relevance: 50,
			description:
				"Sets the gap between columns. If there is a column rule between columns, it will appear in the middle of the gap.",
			restrictions: ["length"],
		},
		{
			name: "-webkit-column-rule",
			browsers: ["C", "S3"],
			relevance: 50,
			description:
				"This property is a shorthand for setting 'column-rule-width', 'column-rule-style', and 'column-rule-color' at the same place in the style sheet. Omitted values are set to their initial values.",
			restrictions: ["length", "line-width", "line-style", "color"],
		},
		{
			name: "-webkit-column-rule-color",
			browsers: ["C", "S3"],
			relevance: 50,
			description: "Sets the color of the column rule",
			restrictions: ["color"],
		},
		{
			name: "-webkit-column-rule-style",
			browsers: ["C", "S3"],
			relevance: 50,
			description: "Sets the style of the rule between columns of an element.",
			restrictions: ["line-style"],
		},
		{
			name: "-webkit-column-rule-width",
			browsers: ["C", "S3"],
			relevance: 50,
			description: "Sets the width of the rule between columns. Negative values are not allowed.",
			restrictions: ["length", "line-width"],
		},
		{
			name: "-webkit-columns",
			browsers: ["C", "S3"],
			values: [
				{
					name: "auto",
					description: "The width depends on the values of other properties.",
				},
			],
			relevance: 50,
			description: "A shorthand property which sets both 'column-width' and 'column-count'.",
			restrictions: ["length", "integer"],
		},
		{
			name: "-webkit-column-span",
			browsers: ["C", "S3"],
			values: [
				{
					name: "all",
					description:
						"The element spans across all columns. Content in the normal flow that appears before the element is automatically balanced across all columns before the element appear.",
				},
				{
					name: "none",
					description: "The element does not span multiple columns.",
				},
			],
			relevance: 50,
			description: "Describes the page/column break behavior after the generated box.",
			restrictions: ["enum"],
		},
		{
			name: "-webkit-column-width",
			browsers: ["C", "S3"],
			values: [
				{
					name: "auto",
					description: "The width depends on the values of other properties.",
				},
			],
			relevance: 50,
			description: "This property describes the width of columns in multicol elements.",
			restrictions: ["length"],
		},
		{
			name: "-webkit-filter",
			browsers: ["C18", "O15", "S6"],
			values: [
				{
					name: "none",
					description: "No filter effects are applied.",
				},
				{
					name: "blur()",
					description: "Applies a Gaussian blur to the input image.",
				},
				{
					name: "brightness()",
					description: "Applies a linear multiplier to input image, making it appear more or less bright.",
				},
				{
					name: "contrast()",
					description: "Adjusts the contrast of the input.",
				},
				{
					name: "drop-shadow()",
					description: "Applies a drop shadow effect to the input image.",
				},
				{
					name: "grayscale()",
					description: "Converts the input image to grayscale.",
				},
				{
					name: "hue-rotate()",
					description: "Applies a hue rotation on the input image. ",
				},
				{
					name: "invert()",
					description: "Inverts the samples in the input image.",
				},
				{
					name: "opacity()",
					description: "Applies transparency to the samples in the input image.",
				},
				{
					name: "saturate()",
					description: "Saturates the input image.",
				},
				{
					name: "sepia()",
					description: "Converts the input image to sepia.",
				},
				{
					name: "url()",
					description: "A filter reference to a <filter> element.",
				},
			],
			relevance: 50,
			description:
				"Processes an element's rendering before it is displayed in the document, by applying one or more filter effects.",
			restrictions: ["enum", "url"],
		},
		{
			name: "-webkit-flow-from",
			browsers: ["S6.1"],
			values: [
				{
					name: "none",
					description: "The block container is not a CSS Region.",
				},
			],
			relevance: 50,
			description: "Makes a block container a region and associates it with a named flow.",
			restrictions: ["identifier"],
		},
		{
			name: "-webkit-flow-into",
			browsers: ["S6.1"],
			values: [
				{
					name: "none",
					description: "The element is not moved to a named flow and normal CSS processing takes place.",
				},
			],
			relevance: 50,
			description: "Places an element or its contents into a named flow.",
			restrictions: ["identifier"],
		},
		{
			name: "-webkit-font-feature-settings",
			browsers: ["C16"],
			values: [
				{
					name: '"c2cs"',
				},
				{
					name: '"dlig"',
				},
				{
					name: '"kern"',
				},
				{
					name: '"liga"',
				},
				{
					name: '"lnum"',
				},
				{
					name: '"onum"',
				},
				{
					name: '"smcp"',
				},
				{
					name: '"swsh"',
				},
				{
					name: '"tnum"',
				},
				{
					name: "normal",
					description: "No change in glyph substitution or positioning occurs.",
				},
				{
					name: "off",
				},
				{
					name: "on",
				},
			],
			relevance: 50,
			description:
				"This property provides low-level control over OpenType font features. It is intended as a way of providing access to font features that are not widely used but are needed for a particular use case.",
			restrictions: ["string", "integer"],
		},
		{
			name: "-webkit-hyphens",
			browsers: ["S5.1"],
			values: [
				{
					name: "auto",
					description:
						"Conditional hyphenation characters inside a word, if present, take priority over automatic resources when determining hyphenation points within the word.",
				},
				{
					name: "manual",
					description:
						"Words are only broken at line breaks where there are characters inside the word that suggest line break opportunities",
				},
				{
					name: "none",
					description:
						"Words are not broken at line breaks, even if characters inside the word suggest line break points.",
				},
			],
			relevance: 50,
			description: "Controls whether hyphenation is allowed to create more break opportunities within a line of text.",
			restrictions: ["enum"],
		},
		{
			name: "-webkit-line-break",
			browsers: ["C", "S3"],
			values: [
				{
					name: "after-white-space",
				},
				{
					name: "normal",
				},
			],
			relevance: 50,
			description: "Specifies line-breaking rules for CJK (Chinese, Japanese, and Korean) text.",
		},
		{
			name: "-webkit-margin-bottom-collapse",
			browsers: ["C", "S3"],
			values: [
				{
					name: "collapse",
				},
				{
					name: "discard",
				},
				{
					name: "separate",
				},
			],
			relevance: 50,
			restrictions: ["enum"],
		},
		{
			name: "-webkit-margin-collapse",
			browsers: ["C", "S3"],
			values: [
				{
					name: "collapse",
				},
				{
					name: "discard",
				},
				{
					name: "separate",
				},
			],
			relevance: 50,
			restrictions: ["enum"],
		},
		{
			name: "-webkit-margin-start",
			browsers: ["C", "S3"],
			values: [
				{
					name: "auto",
				},
			],
			relevance: 50,
			restrictions: ["percentage", "length"],
		},
		{
			name: "-webkit-margin-top-collapse",
			browsers: ["C", "S3"],
			values: [
				{
					name: "collapse",
				},
				{
					name: "discard",
				},
				{
					name: "separate",
				},
			],
			relevance: 50,
			restrictions: ["enum"],
		},
		{
			name: "-webkit-mask-clip",
			browsers: ["C", "O15", "S4"],
			status: "nonstandard",
			syntax: "[ <coord-box> | no-clip | border | padding | content | text ]#",
			relevance: 0,
			description: "Determines the mask painting area, which determines the area that is affected by the mask.",
			restrictions: ["box"],
		},
		{
			name: "-webkit-mask-image",
			browsers: ["C", "O15", "S4"],
			values: [
				{
					name: "none",
					description: "Counts as a transparent black image layer.",
				},
				{
					name: "url()",
					description: "Reference to a <mask element or to a CSS image.",
				},
			],
			status: "nonstandard",
			syntax: "<mask-reference>#",
			relevance: 0,
			description: "Sets the mask layer image of an element.",
			restrictions: ["url", "image", "enum"],
		},
		{
			name: "-webkit-mask-origin",
			browsers: ["C", "O15", "S4"],
			status: "nonstandard",
			syntax: "[ <coord-box> | border | padding | content ]#",
			relevance: 0,
			description: "Specifies the mask positioning area.",
			restrictions: ["box"],
		},
		{
			name: "-webkit-mask-repeat",
			browsers: ["C", "O15", "S4"],
			status: "nonstandard",
			syntax: "<repeat-style>#",
			relevance: 0,
			description: "Specifies how mask layer images are tiled after they have been sized and positioned.",
			restrictions: ["repeat"],
		},
		{
			name: "-webkit-mask-size",
			browsers: ["C", "O15", "S4"],
			values: [
				{
					name: "auto",
					description:
						"Resolved by using the image's intrinsic ratio and the size of the other dimension, or failing that, using the image's intrinsic size, or failing that, treating it as 100%.",
				},
				{
					name: "contain",
					description:
						"Scale the image, while preserving its intrinsic aspect ratio (if any), to the largest size such that both its width and its height can fit inside the background positioning area.",
				},
				{
					name: "cover",
					description:
						"Scale the image, while preserving its intrinsic aspect ratio (if any), to the smallest size such that both its width and its height can completely cover the background positioning area.",
				},
			],
			status: "nonstandard",
			syntax: "<bg-size>#",
			relevance: 0,
			description: "Specifies the size of the mask layer images.",
			restrictions: ["length", "percentage", "enum"],
		},
		{
			name: "-webkit-nbsp-mode",
			browsers: ["S4", "SM3.2"],
			values: [
				{
					name: "normal",
				},
				{
					name: "space",
				},
			],
			relevance: 50,
			baseline: {
				status: "false",
			},
			description: "Defines the behavior of nonbreaking spaces within text.",
		},
		{
			name: "-webkit-overflow-scrolling",
			browsers: ["C", "S5"],
			values: [
				{
					name: "auto",
				},
				{
					name: "touch",
				},
			],
			status: "nonstandard",
			syntax: "auto | touch",
			relevance: 0,
			description: "Specifies whether to use native-style scrolling in an overflow:scroll element.",
		},
		{
			name: "-webkit-padding-start",
			browsers: ["C", "S3"],
			relevance: 50,
			restrictions: ["percentage", "length"],
		},
		{
			name: "-webkit-perspective",
			browsers: ["C", "S4"],
			values: [
				{
					name: "none",
					description: "No perspective transform is applied.",
				},
			],
			relevance: 50,
			description:
				"Applies the same transform as the perspective(<number>) transform function, except that it applies only to the positioned or transformed children of the element, not to the transform on the element itself.",
			restrictions: ["length"],
		},
		{
			name: "-webkit-perspective-origin",
			browsers: ["C", "S4"],
			relevance: 50,
			description:
				"Establishes the origin for the perspective property. It effectively sets the X and Y position at which the viewer appears to be looking at the children of the element.",
			restrictions: ["position", "percentage", "length"],
		},
		{
			name: "-webkit-region-fragment",
			browsers: ["S7"],
			values: [
				{
					name: "auto",
					description: "Content flows as it would in a regular content box.",
				},
				{
					name: "break",
					description: "If the content fits within the CSS Region, then this property has no effect.",
				},
			],
			relevance: 50,
			description:
				"The 'region-fragment' property controls the behavior of the last region associated with a named flow.",
			restrictions: ["enum"],
		},
		{
			name: "-webkit-tap-highlight-color",
			browsers: ["E12", "SM4", "C16", "CA18", "O15"],
			status: "nonstandard",
			syntax: "<color>",
			relevance: 0,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/-webkit-tap-highlight-color",
				},
			],
			baseline: {
				status: "false",
			},
			restrictions: ["color"],
		},
		{
			name: "-webkit-text-fill-color",
			browsers: ["E12", "FF49", "FFA49", "S3", "SM2", "C1", "CA18", "O15"],
			syntax: "<color>",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/-webkit-text-fill-color",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2016-09-20",
				baseline_high_date: "2019-03-20",
			},
			restrictions: ["color"],
		},
		{
			name: "-webkit-text-size-adjust",
			browsers: ["E", "C", "S3"],
			values: [
				{
					name: "auto",
					description: "Renderers must use the default size adjustment when displaying on a small device.",
				},
				{
					name: "none",
					description: "Renderers must not do size adjustment when displaying on a small device.",
				},
			],
			relevance: 50,
			description: "Specifies a size adjustment for displaying text content in mobile browsers.",
			restrictions: ["percentage"],
		},
		{
			name: "-webkit-text-stroke",
			browsers: ["E15", "FF49", "FFA49", "S3", "SM2", "C4", "CA18", "O15"],
			syntax: "<length> || <color>",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/-webkit-text-stroke",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-04-05",
				baseline_high_date: "2019-10-05",
			},
			restrictions: ["length", "line-width", "color", "percentage"],
		},
		{
			name: "-webkit-text-stroke-color",
			browsers: ["E15", "FF49", "FFA49", "S3", "SM2", "C1", "CA18", "O15"],
			syntax: "<color>",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/-webkit-text-stroke-color",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-04-05",
				baseline_high_date: "2019-10-05",
			},
			restrictions: ["color"],
		},
		{
			name: "-webkit-text-stroke-width",
			browsers: ["E15", "FF49", "FFA49", "S3", "SM2", "C1", "CA18", "O15"],
			syntax: "<length>",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/-webkit-text-stroke-width",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-04-05",
				baseline_high_date: "2019-10-05",
			},
			restrictions: ["length", "line-width", "percentage"],
		},
		{
			name: "-webkit-touch-callout",
			browsers: ["SM2"],
			values: [
				{
					name: "none",
				},
			],
			status: "nonstandard",
			syntax: "default | none",
			relevance: 0,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/-webkit-touch-callout",
				},
			],
			baseline: {
				status: "false",
			},
			restrictions: ["enum"],
		},
		{
			name: "-webkit-transform",
			browsers: ["C", "O12", "S3.1"],
			values: [
				{
					name: "matrix()",
					description:
						"Specifies a 2D transformation in the form of a transformation matrix of six values. matrix(a,b,c,d,e,f) is equivalent to applying the transformation matrix [a b c d e f]",
				},
				{
					name: "matrix3d()",
					description: "Specifies a 3D transformation as a 4x4 homogeneous matrix of 16 values in column-major order.",
				},
				{
					name: "none",
				},
				{
					name: "perspective()",
					description: "Specifies a perspective projection matrix.",
				},
				{
					name: "rotate()",
					description:
						"Specifies a 2D rotation by the angle specified in the parameter about the origin of the element, as defined by the transform-origin property.",
				},
				{
					name: "rotate3d()",
					description:
						"Specifies a clockwise 3D rotation by the angle specified in last parameter about the [x,y,z] direction vector described by the first 3 parameters.",
				},
				{
					name: "rotateX('angle')",
					description: "Specifies a clockwise rotation by the given angle about the X axis.",
				},
				{
					name: "rotateY('angle')",
					description: "Specifies a clockwise rotation by the given angle about the Y axis.",
				},
				{
					name: "rotateZ('angle')",
					description: "Specifies a clockwise rotation by the given angle about the Z axis.",
				},
				{
					name: "scale()",
					description:
						"Specifies a 2D scale operation by the [sx,sy] scaling vector described by the 2 parameters. If the second parameter is not provided, it is takes a value equal to the first.",
				},
				{
					name: "scale3d()",
					description: "Specifies a 3D scale operation by the [sx,sy,sz] scaling vector described by the 3 parameters.",
				},
				{
					name: "scaleX()",
					description:
						"Specifies a scale operation using the [sx,1] scaling vector, where sx is given as the parameter.",
				},
				{
					name: "scaleY()",
					description:
						"Specifies a scale operation using the [sy,1] scaling vector, where sy is given as the parameter.",
				},
				{
					name: "scaleZ()",
					description:
						"Specifies a scale operation using the [1,1,sz] scaling vector, where sz is given as the parameter.",
				},
				{
					name: "skew()",
					description:
						"Specifies a skew transformation along the X and Y axes. The first angle parameter specifies the skew on the X axis. The second angle parameter specifies the skew on the Y axis. If the second parameter is not given then a value of 0 is used for the Y angle (ie: no skew on the Y axis).",
				},
				{
					name: "skewX()",
					description: "Specifies a skew transformation along the X axis by the given angle.",
				},
				{
					name: "skewY()",
					description: "Specifies a skew transformation along the Y axis by the given angle.",
				},
				{
					name: "translate()",
					description:
						"Specifies a 2D translation by the vector [tx, ty], where tx is the first translation-value parameter and ty is the optional second translation-value parameter.",
				},
				{
					name: "translate3d()",
					description:
						"Specifies a 3D translation by the vector [tx,ty,tz], with tx, ty and tz being the first, second and third translation-value parameters respectively.",
				},
				{
					name: "translateX()",
					description: "Specifies a translation by the given amount in the X direction.",
				},
				{
					name: "translateY()",
					description: "Specifies a translation by the given amount in the Y direction.",
				},
				{
					name: "translateZ()",
					description:
						"Specifies a translation by the given amount in the Z direction. Note that percentage values are not allowed in the translateZ translation-value, and if present are evaluated as 0.",
				},
			],
			relevance: 50,
			description:
				"A two-dimensional transformation is applied to an element through the 'transform' property. This property contains a list of transform functions similar to those allowed by SVG.",
			restrictions: ["enum"],
		},
		{
			name: "-webkit-transform-origin",
			browsers: ["C", "O15", "S3.1"],
			relevance: 50,
			description: "Establishes the origin of transformation for an element.",
			restrictions: ["position", "length", "percentage"],
		},
		{
			name: "-webkit-transform-origin-x",
			browsers: ["E79", "S4", "SM3.2", "C1", "CA18", "O15"],
			relevance: 50,
			baseline: {
				status: "false",
			},
			description:
				"The x coordinate of the origin for transforms applied to an element with respect to its border box.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "-webkit-transform-origin-y",
			browsers: ["E79", "S4", "SM3.2", "C1", "CA18", "O15"],
			relevance: 50,
			baseline: {
				status: "false",
			},
			description:
				"The y coordinate of the origin for transforms applied to an element with respect to its border box.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "-webkit-transform-origin-z",
			browsers: ["E79", "S4", "SM3.2", "C2", "CA18", "O15"],
			relevance: 50,
			baseline: {
				status: "false",
			},
			description:
				"The z coordinate of the origin for transforms applied to an element with respect to its border box.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "-webkit-transform-style",
			browsers: ["C", "S4"],
			values: [
				{
					name: "flat",
					description: "All children of this element are rendered flattened into the 2D plane of the element.",
				},
			],
			relevance: 50,
			description: "Defines how nested elements are rendered in 3D space.",
			restrictions: ["enum"],
		},
		{
			name: "-webkit-transition",
			browsers: ["C", "O12", "S5"],
			values: [
				{
					name: "all",
					description: "Every property that is able to undergo a transition will do so.",
				},
				{
					name: "none",
					description: "No property will transition.",
				},
			],
			relevance: 50,
			description: "Shorthand property combines four of the transition properties into a single property.",
			restrictions: ["time", "property", "timing-function", "enum"],
		},
		{
			name: "-webkit-transition-delay",
			browsers: ["C", "O12", "S5"],
			relevance: 50,
			description:
				"Defines when the transition will start. It allows a transition to begin execution some period of time from when it is applied.",
			restrictions: ["time"],
		},
		{
			name: "-webkit-transition-duration",
			browsers: ["C", "O12", "S5"],
			relevance: 50,
			description: "Specifies how long the transition from the old value to the new value should take.",
			restrictions: ["time"],
		},
		{
			name: "-webkit-transition-property",
			browsers: ["C", "O12", "S5"],
			values: [
				{
					name: "all",
					description: "Every property that is able to undergo a transition will do so.",
				},
				{
					name: "none",
					description: "No property will transition.",
				},
			],
			relevance: 50,
			description: "Specifies the name of the CSS property to which the transition is applied.",
			restrictions: ["property"],
		},
		{
			name: "-webkit-transition-timing-function",
			browsers: ["C", "O12", "S5"],
			relevance: 50,
			description: "Describes how the intermediate values used during a transition will be calculated.",
			restrictions: ["timing-function"],
		},
		{
			name: "-webkit-user-drag",
			browsers: ["E79", "S4", "SM3.2", "C1", "CA18", "O15"],
			values: [
				{
					name: "auto",
				},
				{
					name: "element",
				},
				{
					name: "none",
				},
			],
			relevance: 50,
			baseline: {
				status: "false",
			},
			restrictions: ["enum"],
		},
		{
			name: "-webkit-user-modify",
			browsers: ["C", "S3"],
			values: [
				{
					name: "read-only",
				},
				{
					name: "read-write",
				},
				{
					name: "read-write-plaintext-only",
				},
			],
			status: "nonstandard",
			syntax: "read-only | read-write | read-write-plaintext-only",
			relevance: 0,
			description: "Determines whether a user can edit the content of an element.",
			restrictions: ["enum"],
		},
		{
			name: "-webkit-user-select",
			browsers: ["C", "S3"],
			values: [
				{
					name: "auto",
				},
				{
					name: "none",
				},
				{
					name: "text",
				},
			],
			status: "nonstandard",
			syntax: "auto | text | none | all",
			relevance: 0,
			description: "Controls the appearance of selection.",
			restrictions: ["enum"],
		},
		{
			name: "widows",
			browsers: ["E12", "S1.3", "SM1", "C25", "CA25", "IE8", "O9.2"],
			syntax: "<integer>",
			relevance: 51,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/widows",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"Specifies the minimum number of line boxes of a block container that must be left in a fragment after a break.",
			restrictions: ["integer"],
		},
		{
			name: "width",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			values: [
				{
					name: "auto",
					description: "The width depends on the values of other properties.",
				},
				{
					name: "fit-content",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
					description: "Use the fit-content inline size or fit-content block size, as appropriate to the writing mode.",
				},
				{
					name: "max-content",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
					description: "Use the max-content inline size or max-content block size, as appropriate to the writing mode.",
				},
				{
					name: "min-content",
					browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
					description: "Use the min-content inline size or min-content block size, as appropriate to the writing mode.",
				},
			],
			syntax:
				"auto | <length-percentage [0,∞]> | min-content | max-content | fit-content | fit-content(<length-percentage [0,∞]>) | <calc-size()> | <anchor-size()>",
			relevance: 96,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/width",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Specifies the width of the content area, padding area or border area (depending on 'box-sizing') of certain boxes.",
			restrictions: ["length", "percentage"],
		},
		{
			name: "will-change",
			browsers: ["E79", "FF36", "FFA36", "S9.1", "SM9.3", "C36", "CA36", "O23"],
			values: [
				{
					name: "auto",
					description: "Expresses no particular intent.",
				},
				{
					name: "contents",
					description:
						"Indicates that the author expects to animate or change something about the element's contents in the near future.",
				},
				{
					name: "scroll-position",
					description:
						"Indicates that the author expects to animate or change the scroll position of the element in the near future.",
				},
			],
			syntax: "auto | <animateable-feature>#",
			relevance: 67,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/will-change",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Provides a rendering hint to the user agent, stating what kinds of changes the author expects to perform on the element.",
			restrictions: ["enum", "identifier"],
		},
		{
			name: "word-break",
			browsers: ["E12", "FF15", "FFA15", "S3", "SM2", "C1", "CA18", "IE5.5", "O15"],
			values: [
				{
					name: "break-all",
					description: "Lines may break between any two grapheme clusters for non-CJK scripts.",
				},
				{
					name: "keep-all",
					description: "Block characters can no longer create implied break points.",
				},
				{
					name: "normal",
					description: "Breaks non-CJK scripts according to their own rules.",
				},
			],
			syntax: "normal | break-all | keep-all | break-word | auto-phrase",
			relevance: 77,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/word-break",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Specifies line break opportunities for non-CJK scripts.",
			restrictions: ["enum"],
		},
		{
			name: "word-spacing",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE6", "O3.5"],
			values: [
				{
					name: "normal",
					description: "No additional spacing is applied. Computes to zero.",
				},
			],
			syntax: "normal | <length>",
			relevance: 56,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/word-spacing",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: 'Specifies additional spacing between "words".',
			restrictions: ["length", "percentage"],
		},
		{
			name: "word-wrap",
			values: [
				{
					name: "break-word",
					description:
						"An otherwise unbreakable sequence of characters may be broken at an arbitrary point if there are no otherwise-acceptable break points in the line.",
				},
				{
					name: "normal",
					description: "Lines may break only at allowed break points.",
				},
			],
			syntax: "normal | break-word",
			relevance: 77,
			description:
				"Specifies whether the UA may break within a word to prevent overflow when an otherwise-unbreakable string is too long to fit.",
			restrictions: ["enum"],
		},
		{
			name: "writing-mode",
			browsers: ["E12", "FF41", "FFA41", "S10.1", "SM10.3", "C48", "CA48", "IE9", "O35"],
			values: [
				{
					name: "horizontal-tb",
					description: "Top-to-bottom block flow direction. The writing mode is horizontal.",
				},
				{
					name: "sideways-lr",
					browsers: ["E12", "FF41", "FFA41", "S10.1", "SM10.3", "C48", "CA48", "IE9", "O35"],
					description:
						"Left-to-right block flow direction. The writing mode is vertical, while the typographic mode is horizontal.",
				},
				{
					name: "sideways-rl",
					browsers: ["E12", "FF41", "FFA41", "S10.1", "SM10.3", "C48", "CA48", "IE9", "O35"],
					description:
						"Right-to-left block flow direction. The writing mode is vertical, while the typographic mode is horizontal.",
				},
				{
					name: "vertical-lr",
					description: "Left-to-right block flow direction. The writing mode is vertical.",
				},
				{
					name: "vertical-rl",
					description: "Right-to-left block flow direction. The writing mode is vertical.",
				},
			],
			syntax: "horizontal-tb | vertical-rl | vertical-lr | sideways-rl | sideways-lr",
			relevance: 53,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/writing-mode",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-03-27",
				baseline_high_date: "2019-09-27",
			},
			description: "This is a shorthand property for both 'direction' and 'block-progression'.",
			restrictions: ["enum"],
		},
		{
			name: "z-index",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O4"],
			values: [
				{
					name: "auto",
					description:
						"The stack level of the generated box in the current stacking context is 0. The box does not establish a new stacking context unless it is the root element.",
				},
			],
			syntax: "auto | <integer>",
			relevance: 92,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/z-index",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"For a positioned box, the 'z-index' property specifies the stack level of the box in the current stacking context and whether the box establishes a local stacking context.",
			restrictions: ["integer"],
		},
		{
			name: "zoom",
			browsers: ["E12", "FF126", "FFA126", "S3.1", "SM3", "C1", "CA18", "IE5.5", "O15"],
			values: [
				{
					name: "normal",
				},
			],
			syntax: "normal | reset | <number [0,∞]> || <percentage [0,∞]>",
			relevance: 65,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/zoom",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2024-05-14",
			},
			description:
				"Non-standard. Specifies the magnification scale of the object. See 'transform: scale()' for a standards-based alternative.",
			restrictions: ["enum", "integer", "number", "percentage"],
		},
		{
			name: "-ms-ime-align",
			status: "nonstandard",
			syntax: "auto | after",
			values: [
				{
					name: "auto",
				},
				{
					name: "after",
				},
			],
			relevance: 0,
			description:
				"Aligns the Input Method Editor (IME) candidate window box relative to the element on which the IME composition is active.",
		},
		{
			name: "-moz-binding",
			status: "nonstandard",
			syntax: "<url> | none",
			relevance: 0,
			description:
				"The -moz-binding CSS property is used by Mozilla-based applications to attach an XBL binding to a DOM element.",
		},
		{
			name: "-moz-context-properties",
			status: "nonstandard",
			syntax: "none | [ fill | fill-opacity | stroke | stroke-opacity ]#",
			relevance: 0,
			description:
				"If you reference an SVG image in a webpage (such as with the <img> element or as a background image), the SVG image can coordinate with the embedding element (its context) to have the image adopt property values set on the embedding element. To do this the embedding element needs to list the properties that are to be made available to the image by listing them as values of the -moz-context-properties property, and the image needs to opt in to using those properties by using values such as the context-fill value.\n\nThis feature is available since Firefox 55, but is only currently supported with SVG images loaded via chrome:// or resource:// URLs. To experiment with the feature in SVG on the Web it is necessary to set the svg.context-properties.content.enabled pref to true.",
		},
		{
			name: "-moz-float-edge",
			status: "obsolete",
			syntax: "border-box | content-box | margin-box | padding-box",
			values: [
				{
					name: "border-box",
				},
				{
					name: "content-box",
				},
				{
					name: "margin-box",
				},
				{
					name: "padding-box",
				},
			],
			relevance: 0,
			browsers: ["FF1", "FFA4"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/-moz-float-edge",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The non-standard -moz-float-edge CSS property specifies whether the height and width properties of the element include the margin, border, or padding thickness.",
		},
		{
			name: "-moz-force-broken-image-icon",
			status: "obsolete",
			syntax: "0 | 1",
			values: [
				{
					name: "0",
				},
				{
					name: "1",
				},
			],
			relevance: 0,
			browsers: ["FF1", "FFA4"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/-moz-force-broken-image-icon",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The -moz-force-broken-image-icon extended CSS property can be used to force the broken image icon to be shown even when a broken image has an alt attribute.",
		},
		{
			name: "-moz-image-region",
			status: "nonstandard",
			syntax: "<shape> | auto",
			relevance: 0,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/-moz-image-region",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"For certain XUL elements and pseudo-elements that use an image from the list-style-image property, this property specifies a region of the image that is used in place of the whole image. This allows elements to use different pieces of the same image to improve performance.",
		},
		{
			name: "-moz-orient",
			status: "nonstandard",
			syntax: "inline | block | horizontal | vertical",
			values: [
				{
					name: "inline",
				},
				{
					name: "block",
				},
				{
					name: "horizontal",
				},
				{
					name: "vertical",
				},
			],
			relevance: 0,
			browsers: ["FF6", "FFA6"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/-moz-orient",
				},
			],
			baseline: {
				status: "false",
			},
			description: "The -moz-orient CSS property specifies the orientation of the element to which it's applied.",
		},
		{
			name: "-moz-outline-radius",
			status: "nonstandard",
			syntax: "<outline-radius>{1,4} [ / <outline-radius>{1,4} ]?",
			relevance: 0,
			description:
				"In Mozilla applications like Firefox, the -moz-outline-radius CSS property can be used to give an element's outline rounded corners.",
		},
		{
			name: "-moz-outline-radius-bottomleft",
			status: "nonstandard",
			syntax: "<outline-radius>",
			relevance: 0,
			description:
				"In Mozilla applications, the -moz-outline-radius-bottomleft CSS property can be used to round the bottom-left corner of an element's outline.",
		},
		{
			name: "-moz-outline-radius-bottomright",
			status: "nonstandard",
			syntax: "<outline-radius>",
			relevance: 0,
			description:
				"In Mozilla applications, the -moz-outline-radius-bottomright CSS property can be used to round the bottom-right corner of an element's outline.",
		},
		{
			name: "-moz-outline-radius-topleft",
			status: "nonstandard",
			syntax: "<outline-radius>",
			relevance: 0,
			description:
				"In Mozilla applications, the -moz-outline-radius-topleft CSS property can be used to round the top-left corner of an element's outline.",
		},
		{
			name: "-moz-outline-radius-topright",
			status: "nonstandard",
			syntax: "<outline-radius>",
			relevance: 0,
			description:
				"In Mozilla applications, the -moz-outline-radius-topright CSS property can be used to round the top-right corner of an element's outline.",
		},
		{
			name: "-moz-stack-sizing",
			status: "nonstandard",
			syntax: "ignore | stretch-to-fit",
			values: [
				{
					name: "ignore",
				},
				{
					name: "stretch-to-fit",
				},
			],
			relevance: 0,
			description:
				"-moz-stack-sizing is an extended CSS property. Normally, a stack will change its size so that all of its child elements are completely visible. For example, moving a child of the stack far to the right will widen the stack so the child remains visible.",
		},
		{
			name: "-moz-text-blink",
			status: "nonstandard",
			syntax: "none | blink",
			values: [
				{
					name: "none",
				},
				{
					name: "blink",
				},
			],
			relevance: 0,
			description: "The -moz-text-blink non-standard Mozilla CSS extension specifies the blink mode.",
		},
		{
			name: "-moz-user-input",
			status: "obsolete",
			syntax: "auto | none | enabled | disabled",
			values: [
				{
					name: "auto",
				},
				{
					name: "none",
				},
				{
					name: "enabled",
				},
				{
					name: "disabled",
				},
			],
			relevance: 0,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/-moz-user-input",
				},
			],
			baseline: {
				status: "false",
			},
			description: "In Mozilla applications, -moz-user-input determines if an element will accept user input.",
		},
		{
			name: "-moz-user-modify",
			status: "nonstandard",
			syntax: "read-only | read-write | write-only",
			values: [
				{
					name: "read-only",
				},
				{
					name: "read-write",
				},
				{
					name: "write-only",
				},
			],
			relevance: 0,
			description:
				"The -moz-user-modify property has no effect. It was originally planned to determine whether or not the content of an element can be edited by a user.",
		},
		{
			name: "-moz-window-dragging",
			status: "nonstandard",
			syntax: "drag | no-drag",
			values: [
				{
					name: "drag",
				},
				{
					name: "no-drag",
				},
			],
			relevance: 0,
			description:
				"The -moz-window-dragging CSS property specifies whether a window is draggable or not. It only works in Chrome code, and only on Mac OS X.",
		},
		{
			name: "-moz-window-shadow",
			status: "nonstandard",
			syntax: "default | menu | tooltip | sheet | none",
			values: [
				{
					name: "default",
				},
				{
					name: "menu",
				},
				{
					name: "tooltip",
				},
				{
					name: "sheet",
				},
				{
					name: "none",
				},
			],
			relevance: 0,
			description:
				"The -moz-window-shadow CSS property specifies whether a window will have a shadow. It only works on Mac OS X.",
		},
		{
			name: "-webkit-border-before",
			status: "nonstandard",
			syntax: "<'border-width'> || <'border-style'> || <color>",
			relevance: 0,
			browsers: ["E79", "S5.1", "SM5", "C8", "CA18", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/-webkit-border-before",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The -webkit-border-before CSS property is a shorthand property for setting the individual logical block start border property values in a single place in the style sheet.",
		},
		{
			name: "-webkit-border-before-color",
			status: "nonstandard",
			syntax: "<color>",
			relevance: 0,
			description:
				"The -webkit-border-before-color CSS property sets the color of the individual logical block start border in a single place in the style sheet.",
		},
		{
			name: "-webkit-border-before-style",
			status: "nonstandard",
			syntax: "<'border-style'>",
			relevance: 0,
			description:
				"The -webkit-border-before-style CSS property sets the style of the individual logical block start border in a single place in the style sheet.",
		},
		{
			name: "-webkit-border-before-width",
			status: "nonstandard",
			syntax: "<'border-width'>",
			relevance: 0,
			description:
				"The -webkit-border-before-width CSS property sets the width of the individual logical block start border in a single place in the style sheet.",
		},
		{
			name: "-webkit-line-clamp",
			syntax: "none | <integer>",
			relevance: 50,
			description:
				"The -webkit-line-clamp CSS property allows limiting of the contents of a block container to the specified number of lines.",
		},
		{
			name: "-webkit-mask",
			status: "nonstandard",
			syntax:
				"[ <mask-reference> || <position> [ / <bg-size> ]? || <repeat-style> || [ <visual-box> | border | padding | content | text ] || [ <visual-box> | border | padding | content ] ]#",
			relevance: 0,
			description:
				"The mask CSS property alters the visibility of an element by either partially or fully hiding it. This is accomplished by either masking or clipping the image at specific points.",
		},
		{
			name: "-webkit-mask-attachment",
			status: "nonstandard",
			syntax: "<attachment>#",
			relevance: 0,
			description:
				"If a -webkit-mask-image is specified, -webkit-mask-attachment determines whether the mask image's position is fixed within the viewport, or scrolls along with its containing block.",
		},
		{
			name: "-webkit-mask-composite",
			status: "nonstandard",
			syntax: "<composite-style>#",
			relevance: 0,
			browsers: ["E18", "S3.1", "SM2", "C1", "CA18", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/-webkit-mask-composite",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The -webkit-mask-composite property specifies the manner in which multiple mask images applied to the same element are composited with one another. Mask images are composited in the opposite order that they are declared with the -webkit-mask-image property.",
		},
		{
			name: "-webkit-mask-position",
			status: "nonstandard",
			syntax: "<position>#",
			relevance: 0,
			description:
				"The mask-position CSS property sets the initial position, relative to the mask position layer defined by mask-origin, for each defined mask image.",
		},
		{
			name: "-webkit-mask-position-x",
			status: "nonstandard",
			syntax: "[ <length-percentage> | left | center | right ]#",
			relevance: 0,
			browsers: ["E18", "FF49", "FFA49", "S3.1", "SM2", "C1", "CA18", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/-webkit-mask-position-x",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2018-10-02",
				baseline_high_date: "2021-04-02",
			},
			description: "The -webkit-mask-position-x CSS property sets the initial horizontal position of a mask image.",
		},
		{
			name: "-webkit-mask-position-y",
			status: "nonstandard",
			syntax: "[ <length-percentage> | top | center | bottom ]#",
			relevance: 0,
			browsers: ["E18", "FF49", "FFA49", "S3.1", "SM2", "C1", "CA18", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/-webkit-mask-position-y",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2018-10-02",
				baseline_high_date: "2021-04-02",
			},
			description: "The -webkit-mask-position-y CSS property sets the initial vertical position of a mask image.",
		},
		{
			name: "-webkit-mask-repeat-x",
			status: "nonstandard",
			syntax: "repeat | no-repeat | space | round",
			values: [
				{
					name: "repeat",
				},
				{
					name: "no-repeat",
				},
				{
					name: "space",
				},
				{
					name: "round",
				},
			],
			relevance: 0,
			browsers: ["O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/-webkit-mask-repeat-x",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The -webkit-mask-repeat-x property specifies whether and how a mask image is repeated (tiled) horizontally.",
		},
		{
			name: "-webkit-mask-repeat-y",
			status: "nonstandard",
			syntax: "repeat | no-repeat | space | round",
			values: [
				{
					name: "repeat",
				},
				{
					name: "no-repeat",
				},
				{
					name: "space",
				},
				{
					name: "round",
				},
			],
			relevance: 0,
			browsers: ["O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/-webkit-mask-repeat-y",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The -webkit-mask-repeat-y property specifies whether and how a mask image is repeated (tiled) vertically.",
		},
		{
			name: "accent-color",
			syntax: "auto | <color>",
			relevance: 50,
			browsers: ["E93", "FF92", "FFA92", "C93", "O79"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/accent-color",
				},
			],
			baseline: {
				status: "false",
			},
			description: "Sets the color of the elements accent",
		},
		{
			name: "align-tracks",
			status: "nonstandard",
			syntax: "[ normal | <baseline-position> | <content-distribution> | <overflow-position>? <content-position> ]#",
			relevance: 0,
			description:
				"The align-tracks CSS property sets the alignment in the masonry axis for grid containers that have masonry in their block axis.",
		},
		{
			name: "alignment-baseline",
			syntax:
				"baseline | alphabetic | ideographic | middle | central | mathematical | text-before-edge | text-after-edge",
			values: [
				{
					name: "baseline",
				},
				{
					name: "alphabetic",
				},
				{
					name: "ideographic",
				},
				{
					name: "middle",
				},
				{
					name: "central",
				},
				{
					name: "mathematical",
				},
				{
					name: "text-before-edge",
				},
				{
					name: "text-after-edge",
				},
			],
			relevance: 50,
			browsers: ["E79", "S5.1", "SM5", "C1", "CA18", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/alignment-baseline",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The alignment-baseline CSS property specifies the specific baseline used to align the box's text and inline-level contents. Baseline alignment is the relationship among the baselines of multiple alignment subjects within an alignment context. When performing baseline alignment, the alignment-baseline property value specifies which baseline of the box is aligned to the corresponding baseline of its alignment context.",
		},
		{
			name: "anchor-name",
			status: "experimental",
			syntax: "none | <dashed-ident>#",
			relevance: 50,
			browsers: ["E125", "C125", "CA125", "O111"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/anchor-name",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The anchor-name property declares that an element is an anchor element, and gives it a list of anchor names to be targeted by.",
		},
		{
			name: "anchor-scope",
			status: "experimental",
			syntax: "none | all | <dashed-ident>#",
			relevance: 50,
			browsers: ["E131", "C131", "CA131", "O116"],
			baseline: {
				status: "false",
			},
			description:
				"This property scopes the specified anchor names, and lookups for these anchor names, to this element’s subtree",
		},
		{
			name: "animation-composition",
			syntax: "<single-animation-composition>#",
			relevance: 50,
			browsers: ["E112", "FF115", "FFA115", "S16", "SM16", "C112", "CA112", "O98"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/animation-composition",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-07-04",
			},
			description: "The composite operation to use when multiple animations affect the same property.",
		},
		{
			name: "animation-range",
			status: "experimental",
			syntax: "[ <'animation-range-start'> <'animation-range-end'>? ]#",
			relevance: 50,
			browsers: ["E115", "C115", "CA115", "O101"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/animation-range",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The animation-range CSS shorthand property is used to set the start and end of an animation's attachment range along its timeline, i.e. where along the timeline an animation will start and end.",
		},
		{
			name: "animation-range-end",
			status: "experimental",
			syntax: "[ normal | <length-percentage> | <timeline-range-name> <length-percentage>? ]#",
			relevance: 50,
			browsers: ["E115", "C115", "CA115", "O101"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/animation-range-end",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The animation-range-end CSS property is used to set the end of an animation's attachment range along its timeline, i.e. where along the timeline an animation will end.",
		},
		{
			name: "animation-range-start",
			status: "experimental",
			syntax: "[ normal | <length-percentage> | <timeline-range-name> <length-percentage>? ]#",
			relevance: 50,
			browsers: ["E115", "C115", "CA115", "O101"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/animation-range-start",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The animation-range-start CSS property is used to set the start of an animation's attachment range along its timeline, i.e. where along the timeline an animation will start.",
		},
		{
			name: "animation-timeline",
			status: "experimental",
			syntax: "<single-animation-timeline>#",
			relevance: 50,
			browsers: ["E115", "C115", "CA115", "O101"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/animation-timeline",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"Specifies the names of one or more @scroll-timeline at-rules to describe the element's scroll animations.",
		},
		{
			name: "appearance",
			syntax: "none | auto | textfield | menulist-button | <compat-auto>",
			relevance: 72,
			browsers: ["E84", "FF80", "FFA80", "S15.4", "SM15.4", "C84", "CA84", "O70"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/appearance",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-03-14",
				baseline_high_date: "2024-09-14",
			},
			description: "Changes the appearance of buttons and other controls to resemble native controls.",
		},
		{
			name: "aspect-ratio",
			syntax: "auto || <ratio>",
			relevance: 64,
			browsers: ["E88", "FF89", "FFA89", "S15", "SM15", "C88", "CA88", "O74"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/aspect-ratio",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-09-20",
				baseline_high_date: "2024-03-20",
			},
			description:
				"The aspect-ratio   CSS property sets a preferred aspect ratio for the box, which will be used in the calculation of auto sizes and some other layout functions.",
		},
		{
			name: "backdrop-filter",
			syntax: "none | <filter-value-list>",
			relevance: 63,
			browsers: ["E79", "FF103", "FFA103", "S18", "SM18", "C76", "CA76", "O63"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/backdrop-filter",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2024-09-16",
			},
			description:
				"The backdrop-filter CSS property lets you apply graphical effects such as blurring or color shifting to the area behind an element. Because it applies to everything behind the element, to see the effect you must make the element or its background at least partially transparent.",
		},
		{
			name: "baseline-shift",
			syntax: "<length-percentage> | sub | super | baseline",
			relevance: 50,
			browsers: ["E79", "S4", "SM3.2", "C1", "CA18", "O15"],
			baseline: {
				status: "false",
			},
			description: "",
		},
		{
			name: "border-block",
			syntax: "<'border-block-start'>",
			relevance: 50,
			browsers: ["E87", "FF66", "FFA66", "S14.1", "SM14.5", "C87", "CA87", "O73"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-block",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-04-26",
				baseline_high_date: "2023-10-26",
			},
			description:
				"The border-block CSS property is a shorthand property for setting the individual logical block border property values in a single place in the style sheet.",
		},
		{
			name: "border-block-color",
			syntax: "<'border-top-color'>{1,2}",
			relevance: 50,
			browsers: ["E87", "FF66", "FFA66", "S14.1", "SM14.5", "C87", "CA87", "O73"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-block-color",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-04-26",
				baseline_high_date: "2023-10-26",
			},
			description:
				"The border-block-color CSS property defines the color of the logical block borders of an element, which maps to a physical border color depending on the element's writing mode, directionality, and text orientation. It corresponds to the border-top-color and border-bottom-color, or border-right-color and border-left-color property depending on the values defined for writing-mode, direction, and text-orientation.",
		},
		{
			name: "border-block-style",
			syntax: "<'border-top-style'>{1,2}",
			relevance: 50,
			browsers: ["E87", "FF66", "FFA66", "S14.1", "SM14.5", "C87", "CA87", "O73"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-block-style",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-04-26",
				baseline_high_date: "2023-10-26",
			},
			description:
				"The border-block-style CSS property defines the style of the logical block borders of an element, which maps to a physical border style depending on the element's writing mode, directionality, and text orientation. It corresponds to the border-top-style and border-bottom-style, or border-left-style and border-right-style properties depending on the values defined for writing-mode, direction, and text-orientation.",
		},
		{
			name: "border-block-width",
			syntax: "<'border-top-width'>{1,2}",
			relevance: 50,
			browsers: ["E87", "FF66", "FFA66", "S14.1", "SM14.5", "C87", "CA87", "O73"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-block-width",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-04-26",
				baseline_high_date: "2023-10-26",
			},
			description:
				"The border-block-width CSS property defines the width of the logical block borders of an element, which maps to a physical border width depending on the element's writing mode, directionality, and text orientation. It corresponds to the border-top-width and border-bottom-width, or border-left-width, and border-right-width property depending on the values defined for writing-mode, direction, and text-orientation.",
		},
		{
			name: "border-end-end-radius",
			syntax: "<'border-top-left-radius'>",
			relevance: 54,
			browsers: ["E89", "FF66", "FFA66", "S15", "SM15", "C89", "CA89", "O75"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-end-end-radius",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-09-20",
				baseline_high_date: "2024-03-20",
			},
			description:
				"The border-end-end-radius CSS property defines a logical border radius on an element, which maps to a physical border radius that depends on on the element's writing-mode, direction, and text-orientation.",
		},
		{
			name: "border-end-start-radius",
			syntax: "<'border-top-left-radius'>",
			relevance: 54,
			browsers: ["E89", "FF66", "FFA66", "S15", "SM15", "C89", "CA89", "O75"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-end-start-radius",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-09-20",
				baseline_high_date: "2024-03-20",
			},
			description:
				"The border-end-start-radius CSS property defines a logical border radius on an element, which maps to a physical border radius depending on the element's writing-mode, direction, and text-orientation.",
		},
		{
			name: "border-inline",
			syntax: "<'border-block-start'>",
			relevance: 50,
			browsers: ["E87", "FF66", "FFA66", "S14.1", "SM14.5", "C87", "CA87", "O73"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-inline",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-04-26",
				baseline_high_date: "2023-10-26",
			},
			description:
				"The border-inline CSS property is a shorthand property for setting the individual logical inline border property values in a single place in the style sheet.",
		},
		{
			name: "border-inline-color",
			syntax: "<'border-top-color'>{1,2}",
			relevance: 50,
			browsers: ["E87", "FF66", "FFA66", "S14.1", "SM14.5", "C87", "CA87", "O73"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-inline-color",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-04-26",
				baseline_high_date: "2023-10-26",
			},
			description:
				"The border-inline-color CSS property defines the color of the logical inline borders of an element, which maps to a physical border color depending on the element's writing mode, directionality, and text orientation. It corresponds to the border-top-color and border-bottom-color, or border-right-color and border-left-color property depending on the values defined for writing-mode, direction, and text-orientation.",
		},
		{
			name: "border-inline-style",
			syntax: "<'border-top-style'>{1,2}",
			relevance: 50,
			browsers: ["E87", "FF66", "FFA66", "S14.1", "SM14.5", "C87", "CA87", "O73"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-inline-style",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-04-26",
				baseline_high_date: "2023-10-26",
			},
			description:
				"The border-inline-style CSS property defines the style of the logical inline borders of an element, which maps to a physical border style depending on the element's writing mode, directionality, and text orientation. It corresponds to the border-top-style and border-bottom-style, or border-left-style and border-right-style properties depending on the values defined for writing-mode, direction, and text-orientation.",
		},
		{
			name: "border-inline-width",
			syntax: "<'border-top-width'>{1,2}",
			relevance: 50,
			browsers: ["E87", "FF66", "FFA66", "S14.1", "SM14.5", "C87", "CA87", "O73"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-inline-width",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-04-26",
				baseline_high_date: "2023-10-26",
			},
			description:
				"The border-inline-width CSS property defines the width of the logical inline borders of an element, which maps to a physical border width depending on the element's writing mode, directionality, and text orientation. It corresponds to the border-top-width and border-bottom-width, or border-left-width, and border-right-width property depending on the values defined for writing-mode, direction, and text-orientation.",
		},
		{
			name: "border-start-end-radius",
			syntax: "<'border-top-left-radius'>",
			relevance: 54,
			browsers: ["E89", "FF66", "FFA66", "S15", "SM15", "C89", "CA89", "O75"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-start-end-radius",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-09-20",
				baseline_high_date: "2024-03-20",
			},
			description:
				"The border-start-end-radius CSS property defines a logical border radius on an element, which maps to a physical border radius depending on the element's writing-mode, direction, and text-orientation.",
		},
		{
			name: "border-start-start-radius",
			syntax: "<'border-top-left-radius'>",
			relevance: 54,
			browsers: ["E89", "FF66", "FFA66", "S15", "SM15", "C89", "CA89", "O75"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/border-start-start-radius",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-09-20",
				baseline_high_date: "2024-03-20",
			},
			description:
				"The border-start-start-radius CSS property defines a logical border radius on an element, which maps to a physical border radius that depends on the element's writing-mode, direction, and text-orientation.",
		},
		{
			name: "box-align",
			status: "obsolete",
			syntax: "start | center | end | baseline | stretch",
			values: [
				{
					name: "start",
				},
				{
					name: "center",
				},
				{
					name: "end",
				},
				{
					name: "baseline",
				},
				{
					name: "stretch",
				},
			],
			relevance: 0,
			browsers: ["O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/box-align",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The box-align CSS property specifies how an element aligns its contents across its layout in a perpendicular direction. The effect of the property is only visible if there is extra space in the box.",
		},
		{
			name: "box-direction",
			status: "obsolete",
			syntax: "normal | reverse | inherit",
			values: [
				{
					name: "normal",
				},
				{
					name: "reverse",
				},
				{
					name: "inherit",
				},
			],
			relevance: 0,
			browsers: ["O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/box-direction",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The box-direction CSS property specifies whether a box lays out its contents normally (from the top or left edge), or in reverse (from the bottom or right edge).",
		},
		{
			name: "box-flex",
			status: "obsolete",
			syntax: "<number>",
			relevance: 0,
			browsers: ["O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/box-flex",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The -moz-box-flex and -webkit-box-flex CSS properties specify how a -moz-box or -webkit-box grows to fill the box that contains it, in the direction of the containing box's layout.",
		},
		{
			name: "box-flex-group",
			status: "obsolete",
			syntax: "<integer>",
			relevance: 0,
			browsers: ["O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/box-flex-group",
				},
			],
			baseline: {
				status: "false",
			},
			description: "The box-flex-group CSS property assigns the flexbox's child elements to a flex group.",
		},
		{
			name: "box-lines",
			status: "obsolete",
			syntax: "single | multiple",
			values: [
				{
					name: "single",
				},
				{
					name: "multiple",
				},
			],
			relevance: 0,
			browsers: ["O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/box-lines",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The box-lines CSS property determines whether the box may have a single or multiple lines (rows for horizontally oriented boxes, columns for vertically oriented boxes).",
		},
		{
			name: "box-ordinal-group",
			status: "obsolete",
			syntax: "<integer>",
			relevance: 0,
			browsers: ["O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/box-ordinal-group",
				},
			],
			baseline: {
				status: "false",
			},
			description: "The box-ordinal-group CSS property assigns the flexbox's child elements to an ordinal group.",
		},
		{
			name: "box-orient",
			status: "obsolete",
			syntax: "horizontal | vertical | inline-axis | block-axis | inherit",
			values: [
				{
					name: "horizontal",
				},
				{
					name: "vertical",
				},
				{
					name: "inline-axis",
				},
				{
					name: "block-axis",
				},
				{
					name: "inherit",
				},
			],
			relevance: 0,
			browsers: ["O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/box-orient",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The box-orient CSS property specifies whether an element lays out its contents horizontally or vertically.",
		},
		{
			name: "box-pack",
			status: "obsolete",
			syntax: "start | center | end | justify",
			values: [
				{
					name: "start",
				},
				{
					name: "center",
				},
				{
					name: "end",
				},
				{
					name: "justify",
				},
			],
			relevance: 0,
			browsers: ["O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/box-pack",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The -moz-box-pack and -webkit-box-pack CSS properties specify how a -moz-box or -webkit-box packs its contents in the direction of its layout. The effect of this is only visible if there is extra space in the box.",
		},
		{
			name: "caret",
			syntax: "<'caret-color'> || <'caret-shape'>",
			relevance: 50,
			description: "Shorthand for setting caret-color and caret-shape.",
		},
		{
			name: "caret-shape",
			syntax: "auto | bar | block | underscore",
			values: [
				{
					name: "auto",
				},
				{
					name: "bar",
				},
				{
					name: "block",
				},
				{
					name: "underscore",
				},
			],
			relevance: 50,
			description: "Specifies the desired shape of the text insertion caret.",
		},
		{
			name: "color-scheme",
			syntax: "normal | [ light | dark | <custom-ident> ]+ && only?",
			relevance: 58,
			browsers: ["E81", "FF96", "FFA96", "S13", "SM13", "C81", "CA81", "O68"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/color-scheme",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-01-11",
				baseline_high_date: "2024-07-11",
			},
			description:
				"The color-scheme CSS property allows an element to indicate which color schemes it can comfortably be rendered in.",
		},
		{
			name: "contain-intrinsic-block-size",
			syntax: "auto? [ none | <length> ]",
			relevance: 50,
			browsers: ["E95", "FF107", "FFA107", "S17", "SM17", "C95", "CA95", "O81"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/contain-intrinsic-block-size",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-09-18",
			},
			description: "Block size of an element when the element is subject to size containment.",
		},
		{
			name: "contain-intrinsic-height",
			syntax: "auto? [ none | <length> ]",
			relevance: 50,
			browsers: ["E95", "FF107", "FFA107", "S17", "SM17", "C95", "CA95", "O81"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/contain-intrinsic-height",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-09-18",
			},
			description: "Height of an element when the element is subject to size containment.",
		},
		{
			name: "contain-intrinsic-inline-size",
			syntax: "auto? [ none | <length> ]",
			relevance: 50,
			browsers: ["E95", "FF107", "FFA107", "S17", "SM17", "C95", "CA95", "O81"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/contain-intrinsic-inline-size",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-09-18",
			},
			description: "Inline size of an element when the element is subject to size containment.",
		},
		{
			name: "contain-intrinsic-size",
			syntax: "[ auto? [ none | <length> ] ]{1,2}",
			relevance: 50,
			browsers: ["E83", "FF107", "FFA107", "S17", "SM17", "C83", "CA83", "O69"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/contain-intrinsic-size",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-09-18",
			},
			description: "Size of an element when the element is subject to size containment.",
		},
		{
			name: "contain-intrinsic-width",
			syntax: "auto? [ none | <length> ]",
			relevance: 50,
			browsers: ["E95", "FF107", "FFA107", "S17", "SM17", "C95", "CA95", "O81"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/contain-intrinsic-width",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-09-18",
			},
			description: "Width of an element when the element is subject to size containment.",
		},
		{
			name: "container",
			syntax: "<'container-name'> [ / <'container-type'> ]?",
			relevance: 53,
			browsers: ["E105", "FF110", "FFA110", "S16", "SM16", "C105", "CA105", "O91"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/container",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-02-14",
			},
			description:
				"The container shorthand CSS property establishes the element as a query container and specifies the name or name for the containment context used in a container query.",
		},
		{
			name: "container-name",
			syntax: "none | <custom-ident>+",
			relevance: 50,
			browsers: ["E105", "FF110", "FFA110", "S16", "SM16", "C105", "CA105", "O91"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/container-name",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-02-14",
			},
			description:
				"The container-name CSS property specifies a list of query container names used by the @container at-rule in a container query.",
		},
		{
			name: "container-type",
			syntax: "normal | [ [ size | inline-size ] || scroll-state ]",
			relevance: 52,
			browsers: ["E105", "FF110", "FFA110", "S16", "SM16", "C105", "CA105", "O91"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/container-type",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-02-14",
			},
			description:
				"The container-type CSS property is used to define the type of containment used in a container query.",
		},
		{
			name: "content-visibility",
			syntax: "visible | auto | hidden",
			values: [
				{
					name: "visible",
				},
				{
					name: "auto",
				},
				{
					name: "hidden",
				},
			],
			relevance: 52,
			browsers: ["E85", "FF125", "FFA125", "S18", "SM18", "C85", "CA85", "O71"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/content-visibility",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2024-09-16",
			},
			description:
				"Controls whether or not an element renders its contents at all, along with forcing a strong set of containments, allowing user agents to potentially omit large swathes of layout and rendering work until it becomes needed.",
		},
		{
			name: "counter-set",
			syntax: "[ <counter-name> <integer>? ]+ | none",
			relevance: 50,
			browsers: ["E85", "FF68", "FFA68", "S17.2", "SM17.2", "C85", "CA85", "O71"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/counter-set",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-12-11",
			},
			description:
				"The counter-set CSS property sets a CSS counter to a given value. It manipulates the value of existing counters, and will only create new counters if there isn't already a counter of the given name on the element.",
		},
		{
			name: "cx",
			syntax: "<length> | <percentage>",
			relevance: 51,
			browsers: ["E79", "FF69", "FFA79", "S9", "SM9", "C43", "CA43", "O30"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/cx",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-07-28",
				baseline_high_date: "2023-01-28",
			},
			description:
				"The cx CSS property defines the x-axis center point of an SVG circle or ellipse element. If present, it overrides the element's cx attribute.",
		},
		{
			name: "cy",
			syntax: "<length> | <percentage>",
			relevance: 51,
			browsers: ["E79", "FF69", "FFA79", "S9", "SM9", "C43", "CA43", "O30"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/cy",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-07-28",
				baseline_high_date: "2023-01-28",
			},
			description:
				"The cy CSS property defines the y-axis center point of an SVG circle or ellipse elements. If present, it overrides the element's cy attribute.",
		},
		{
			name: "d",
			syntax: "none | path(<string>)",
			relevance: 50,
			browsers: ["E79", "FF97", "FFA97", "C52", "CA52", "O39"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/d",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The d CSS property defines a path to be drawn by the SVG path element. If present, it overrides the element's d attribute.",
		},
		{
			name: "dominant-baseline",
			syntax: "auto | text-bottom | alphabetic | ideographic | middle | central | mathematical | hanging | text-top",
			values: [
				{
					name: "auto",
				},
				{
					name: "text-bottom",
				},
				{
					name: "alphabetic",
				},
				{
					name: "ideographic",
				},
				{
					name: "middle",
				},
				{
					name: "central",
				},
				{
					name: "mathematical",
				},
				{
					name: "hanging",
				},
				{
					name: "text-top",
				},
			],
			relevance: 50,
			browsers: ["E79", "FF1", "FFA4", "S4", "SM3.2", "C1", "CA18", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/dominant-baseline",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"The dominant-baseline CSS property specifies the specific baseline used to align the box's text and inline-level contents. It also indicates the default alignment baseline of any boxes participating in baseline alignment in the box's alignment context. If present, it overrides the shape's dominant-baseline attribute.",
		},
		{
			name: "field-sizing",
			status: "experimental",
			syntax: "content | fixed",
			values: [
				{
					name: "content",
				},
				{
					name: "fixed",
				},
			],
			relevance: 50,
			browsers: ["E123", "C123", "CA123", "O109"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/field-sizing",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The field-sizing CSS property enables you to control the sizing behavior of elements that are given a default preferred size, such as form control elements. This property enables you to override the default sizing behavior, allowing form controls to adjust in size to fit their contents.",
		},
		{
			name: "font-optical-sizing",
			syntax: "auto | none",
			values: [
				{
					name: "auto",
				},
				{
					name: "none",
				},
			],
			relevance: 50,
			browsers: ["E17", "FF62", "FFA62", "S13.1", "SM13.4", "C79", "CA79", "O66"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/font-optical-sizing",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-03-24",
				baseline_high_date: "2022-09-24",
			},
			description:
				"The font-optical-sizing CSS property allows developers to control whether browsers render text with slightly differing visual representations to optimize viewing at different sizes, or not. This only works for fonts that have an optical size variation axis.",
		},
		{
			name: "font-palette",
			syntax: "normal | light | dark | <palette-identifier> | <palette-mix()>",
			relevance: 50,
			browsers: ["E101", "FF107", "FFA107", "S15.4", "SM15.4", "C101", "CA101", "O87"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/font-palette",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-11-15",
				baseline_high_date: "2025-05-15",
			},
			description:
				"The font-palette CSS property allows specifying one of the many palettes contained in a font that a user agent should use for the font. Users can also override the values in a palette or create a new palette by using the @font-palette-values at-rule.",
		},
		{
			name: "font-smooth",
			status: "nonstandard",
			syntax: "auto | never | always | <absolute-size> | <length>",
			relevance: 0,
			browsers: ["O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/font-smooth",
				},
			],
			baseline: {
				status: "false",
			},
			description: "The font-smooth CSS property controls the application of anti-aliasing when fonts are rendered.",
		},
		{
			name: "font-synthesis-position",
			status: "experimental",
			syntax: "auto | none",
			values: [
				{
					name: "auto",
				},
				{
					name: "none",
				},
			],
			relevance: 50,
			browsers: ["FF118", "FFA118"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/font-synthesis-position",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				'The font-synthesis-position CSS property lets you specify whether or not a browser may synthesize the subscript and superscript "position" typefaces when they are missing in a font family, while using font-variant-position to set the positions.',
		},
		{
			name: "font-synthesis-small-caps",
			syntax: "auto | none",
			values: [
				{
					name: "auto",
				},
				{
					name: "none",
				},
			],
			relevance: 50,
			browsers: ["E97", "FF111", "FFA111", "S16.4", "SM16.4", "C97", "CA97", "O83"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/font-synthesis-small-caps",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-03-27",
			},
			description:
				"The font-synthesis-small-caps CSS property lets you specify whether or not the browser may synthesize small-caps typeface when it is missing in a font family. Small-caps glyphs typically use the form of uppercase letters but are reduced to the size of lowercase letters.",
		},
		{
			name: "font-synthesis-style",
			syntax: "auto | none",
			values: [
				{
					name: "auto",
				},
				{
					name: "none",
				},
			],
			relevance: 50,
			browsers: ["E97", "FF111", "FFA111", "S16.4", "SM16.4", "C97", "CA97", "O83"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/font-synthesis-style",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-03-27",
			},
			description:
				"The font-synthesis-style CSS property lets you specify whether or not the browser may synthesize the oblique typeface when it is missing in a font family.",
		},
		{
			name: "font-synthesis-weight",
			syntax: "auto | none",
			values: [
				{
					name: "auto",
				},
				{
					name: "none",
				},
			],
			relevance: 50,
			browsers: ["E97", "FF111", "FFA111", "S16.4", "SM16.4", "C97", "CA97", "O83"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/font-synthesis-weight",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-03-27",
			},
			description:
				"The font-synthesis-weight CSS property lets you specify whether or not the browser may synthesize the bold typeface when it is missing in a font family.",
		},
		{
			name: "font-variant-emoji",
			syntax: "normal | text | emoji | unicode",
			values: [
				{
					name: "normal",
				},
				{
					name: "text",
				},
				{
					name: "emoji",
				},
				{
					name: "unicode",
				},
			],
			relevance: 50,
			browsers: ["E131", "C131", "CA131", "O116"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/font-variant-emoji",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The font-variant-emoji CSS property specifies the default presentation style for displaying emojis.",
		},
		{
			name: "font-variation-settings",
			atRule: "@font-face",
			syntax: "normal | [ <string> <number> ]#",
			relevance: 57,
			browsers: ["E17", "FF62", "FFA62", "S11", "SM11", "C62", "CA62", "O49"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/font-variation-settings",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2018-09-05",
				baseline_high_date: "2021-03-05",
			},
			description:
				"The font-variation-settings CSS property provides low-level control over OpenType or TrueType font variations, by specifying the four letter axis names of the features you want to vary, along with their variation values.",
		},
		{
			name: "forced-color-adjust",
			syntax: "auto | none | preserve-parent-color",
			values: [
				{
					name: "auto",
				},
				{
					name: "none",
				},
				{
					name: "preserve-parent-color",
				},
			],
			relevance: 58,
			browsers: ["E79", "FF113", "FFA113", "C89", "CA89", "IE10", "O75"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/forced-color-adjust",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"Allows authors to opt certain elements out of forced colors mode. This then restores the control of those values to CSS",
		},
		{
			name: "gap",
			syntax: "<'row-gap'> <'column-gap'>?",
			relevance: 76,
			browsers: ["E16", "FF52", "FFA52", "S10.1", "SM10.3", "C57", "CA57", "O44"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/gap",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-10-17",
				baseline_high_date: "2020-04-17",
			},
			description:
				"The gap CSS property is a shorthand property for row-gap and column-gap specifying the gutters between grid rows and columns.",
		},
		{
			name: "hanging-punctuation",
			syntax: "none | [ first || [ force-end | allow-end ] || last ]",
			relevance: 50,
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/hanging-punctuation",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The hanging-punctuation CSS property specifies whether a punctuation mark should hang at the start or end of a line of text. Hanging punctuation may be placed outside the line box.",
		},
		{
			name: "hyphenate-character",
			syntax: "auto | <string>",
			relevance: 50,
			browsers: ["E106", "FF98", "FFA98", "S17", "SM17", "C106", "CA106", "O92"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/hyphenate-character",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-09-18",
			},
			description: "A hyphenate character used at the end of a line.",
		},
		{
			name: "hyphenate-limit-chars",
			syntax: "[ auto | <integer> ]{1,3}",
			relevance: 50,
			browsers: ["E109", "FF137", "FFA137", "C109", "CA109", "O95"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/hyphenate-limit-chars",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The hyphenate-limit-chars CSS property specifies the minimum word length to allow hyphenation of words as well as the minimum number of characters before and after the hyphen.",
		},
		{
			name: "image-resolution",
			status: "experimental",
			syntax: "[ from-image || <resolution> ] && snap?",
			relevance: 50,
			description:
				"The image-resolution property specifies the intrinsic resolution of all raster images used in or on the element. It affects both content images (e.g. replaced elements and generated content) and decorative images (such as background-image). The intrinsic resolution of an image is used to determine the image’s intrinsic dimensions.",
		},
		{
			name: "initial-letter",
			syntax: "normal | [ <number> <integer>? ]",
			relevance: 50,
			browsers: ["E110", "C110", "CA110", "O96"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/initial-letter",
				},
			],
			baseline: {
				status: "false",
			},
			description: "The initial-letter CSS property specifies styling for dropped, raised, and sunken initial letters.",
		},
		{
			name: "initial-letter-align",
			status: "experimental",
			syntax: "[ auto | alphabetic | hanging | ideographic ]",
			relevance: 50,
			description:
				"The initial-letter-align CSS property specifies the alignment of initial letters within a paragraph.",
		},
		{
			name: "inset",
			syntax: "<'top'>{1,4}",
			relevance: 64,
			browsers: ["E87", "FF66", "FFA66", "S14.1", "SM14.5", "C87", "CA87", "O73"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/inset",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-04-26",
				baseline_high_date: "2023-10-26",
			},
			description:
				"The inset CSS property defines the logical block and inline start and end offsets of an element, which map to physical offsets depending on the element's writing mode, directionality, and text orientation. It corresponds to the top and bottom, or right and left properties depending on the values defined for writing-mode, direction, and text-orientation.",
		},
		{
			name: "inset-block",
			syntax: "<'top'>{1,2}",
			relevance: 53,
			browsers: ["E87", "FF63", "FFA63", "S14.1", "SM14.5", "C87", "CA87", "O73"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/inset-block",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-04-26",
				baseline_high_date: "2023-10-26",
			},
			description:
				"The inset-block CSS property defines the logical block start and end offsets of an element, which maps to physical offsets depending on the element's writing mode, directionality, and text orientation. It corresponds to the top and bottom, or right and left properties depending on the values defined for writing-mode, direction, and text-orientation.",
		},
		{
			name: "inset-block-end",
			syntax: "<'top'>",
			relevance: 53,
			browsers: ["E87", "FF63", "FFA63", "S14.1", "SM14.5", "C87", "CA87", "O73"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/inset-block-end",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-04-26",
				baseline_high_date: "2023-10-26",
			},
			description:
				"The inset-block-end CSS property defines the logical block end offset of an element, which maps to a physical offset depending on the element's writing mode, directionality, and text orientation. It corresponds to the top, right, bottom, or left property depending on the values defined for writing-mode, direction, and text-orientation.",
		},
		{
			name: "inset-block-start",
			syntax: "<'top'>",
			relevance: 54,
			browsers: ["E87", "FF63", "FFA63", "S14.1", "SM14.5", "C87", "CA87", "O73"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/inset-block-start",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-04-26",
				baseline_high_date: "2023-10-26",
			},
			description:
				"The inset-block-start CSS property defines the logical block start offset of an element, which maps to a physical offset depending on the element's writing mode, directionality, and text orientation. It corresponds to the top, right, bottom, or left property depending on the values defined for writing-mode, direction, and text-orientation.",
		},
		{
			name: "inset-inline",
			syntax: "<'top'>{1,2}",
			relevance: 53,
			browsers: ["E87", "FF63", "FFA63", "S14.1", "SM14.5", "C87", "CA87", "O73"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/inset-inline",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-04-26",
				baseline_high_date: "2023-10-26",
			},
			description:
				"The inset-inline CSS property defines the logical block start and end offsets of an element, which maps to physical offsets depending on the element's writing mode, directionality, and text orientation. It corresponds to the top and bottom, or right and left properties depending on the values defined for writing-mode, direction, and text-orientation.",
		},
		{
			name: "inset-inline-end",
			syntax: "<'top'>",
			relevance: 54,
			browsers: ["E87", "FF63", "FFA63", "S14.1", "SM14.5", "C87", "CA87", "O73"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/inset-inline-end",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-04-26",
				baseline_high_date: "2023-10-26",
			},
			description:
				"The inset-inline-end CSS property defines the logical inline end inset of an element, which maps to a physical inset depending on the element's writing mode, directionality, and text orientation. It corresponds to the top, right, bottom, or left property depending on the values defined for writing-mode, direction, and text-orientation.",
		},
		{
			name: "inset-inline-start",
			syntax: "<'top'>",
			relevance: 55,
			browsers: ["E87", "FF63", "FFA63", "S14.1", "SM14.5", "C87", "CA87", "O73"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/inset-inline-start",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-04-26",
				baseline_high_date: "2023-10-26",
			},
			description:
				"The inset-inline-start CSS property defines the logical inline start inset of an element, which maps to a physical offset depending on the element's writing mode, directionality, and text orientation. It corresponds to the top, right, bottom, or left property depending on the values defined for writing-mode, direction, and text-orientation.",
		},
		{
			name: "interpolate-size",
			status: "experimental",
			syntax: "numeric-only | allow-keywords",
			values: [
				{
					name: "numeric-only",
				},
				{
					name: "allow-keywords",
				},
			],
			relevance: 50,
			browsers: ["E129", "C129", "CA129", "O115"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/interpolate-size",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The interpolate-size CSS property allows you to enable animations and transitions between a <length-percentage> value and an intrinsic size value such as auto, fit-content, or max-content.",
		},
		{
			name: "justify-tracks",
			status: "nonstandard",
			syntax: "[ normal | <content-distribution> | <overflow-position>? [ <content-position> | left | right ] ]#",
			relevance: 0,
			description:
				"The justify-tracks CSS property sets the alignment in the masonry axis for grid containers that have masonry in their inline axis",
		},
		{
			name: "line-clamp",
			syntax: "none | <integer>",
			relevance: 50,
			browsers: ["S18.2", "SM18.2", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/line-clamp",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The line-clamp property allows limiting the contents of a block container to the specified number of lines; remaining content is fragmented away and neither rendered nor measured. Optionally, it also allows inserting content into the last line box to indicate the continuity of truncated/interrupted content.",
		},
		{
			name: "line-height-step",
			status: "experimental",
			syntax: "<length>",
			relevance: 50,
			description:
				"The line-height-step CSS property defines the step units for line box heights. When the step unit is positive, line box heights are rounded up to the closest multiple of the unit. Negative values are invalid.",
		},
		{
			name: "margin-block",
			syntax: "<'margin-top'>{1,2}",
			relevance: 55,
			browsers: ["E87", "FF66", "FFA66", "S14.1", "SM14.5", "C87", "CA87", "O73"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/margin-block",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-04-26",
				baseline_high_date: "2023-10-26",
			},
			description:
				"The margin-block CSS property defines the logical block start and end margins of an element, which maps to physical margins depending on the element's writing mode, directionality, and text orientation.",
		},
		{
			name: "margin-inline",
			syntax: "<'margin-top'>{1,2}",
			relevance: 55,
			browsers: ["E87", "FF66", "FFA66", "S14.1", "SM14.5", "C87", "CA87", "O73"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/margin-inline",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-04-26",
				baseline_high_date: "2023-10-26",
			},
			description:
				"The margin-inline CSS property defines the logical inline start and end margins of an element, which maps to physical margins depending on the element's writing mode, directionality, and text orientation.",
		},
		{
			name: "margin-trim",
			status: "experimental",
			syntax: "none | in-flow | all",
			values: [
				{
					name: "none",
				},
				{
					name: "in-flow",
				},
				{
					name: "all",
				},
			],
			relevance: 50,
			browsers: ["S16.4", "SM16.4"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/margin-trim",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The margin-trim property allows the container to trim the margins of its children where they adjoin the container’s edges.",
		},
		{
			name: "mask",
			syntax: "<mask-layer>#",
			relevance: 58,
			browsers: ["E120", "FF53", "FFA53", "S15.4", "SM15.4", "C120", "CA120", "O106"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/mask",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-12-07",
			},
			description:
				"The mask CSS property alters the visibility of an element by either partially or fully hiding it. This is accomplished by either masking or clipping the image at specific points.",
		},
		{
			name: "mask-border",
			syntax:
				"<'mask-border-source'> || <'mask-border-slice'> [ / <'mask-border-width'>? [ / <'mask-border-outset'> ]? ]? || <'mask-border-repeat'> || <'mask-border-mode'>",
			relevance: 50,
			browsers: ["S17.2", "SM17.2", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/mask-border",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The mask-border CSS property lets you create a mask along the edge of an element's border.\n\nThis property is a shorthand for mask-border-source, mask-border-slice, mask-border-width, mask-border-outset, mask-border-repeat, and mask-border-mode. As with all shorthand properties, any omitted sub-values will be set to their initial value.",
		},
		{
			name: "mask-border-mode",
			syntax: "luminance | alpha",
			values: [
				{
					name: "luminance",
				},
				{
					name: "alpha",
				},
			],
			relevance: 50,
			description: "The mask-border-mode CSS property specifies the blending mode used in a mask border.",
		},
		{
			name: "mask-border-outset",
			syntax: "[ <length> | <number> ]{1,4}",
			relevance: 50,
			browsers: ["S17.2", "SM17.2", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/mask-border-outset",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The mask-border-outset CSS property specifies the distance by which an element's mask border is set out from its border box.",
		},
		{
			name: "mask-border-repeat",
			syntax: "[ stretch | repeat | round | space ]{1,2}",
			relevance: 50,
			browsers: ["S17.2", "SM17.2", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/mask-border-repeat",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The mask-border-repeat CSS property defines how the edge regions of a source image are adjusted to fit the dimensions of an element's mask border.",
		},
		{
			name: "mask-border-slice",
			syntax: "<number-percentage>{1,4} fill?",
			relevance: 50,
			browsers: ["S17.2", "SM17.2", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/mask-border-slice",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The mask-border-slice CSS property divides the image specified by mask-border-source into regions. These regions are used to form the components of an element's mask border.",
		},
		{
			name: "mask-border-source",
			syntax: "none | <image>",
			relevance: 50,
			browsers: ["S17.2", "SM17.2", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/mask-border-source",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The mask-border-source CSS property specifies the source image used to create an element's mask border.\n\nThe mask-border-slice property is used to divide the source image into regions, which are then dynamically applied to the final mask border.",
		},
		{
			name: "mask-border-width",
			syntax: "[ <length-percentage> | <number> | auto ]{1,4}",
			relevance: 50,
			browsers: ["S17.2", "SM17.2", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/mask-border-width",
				},
			],
			baseline: {
				status: "false",
			},
			description: "The mask-border-width CSS property specifies the width of an element's mask border.",
		},
		{
			name: "mask-clip",
			syntax: "[ <coord-box> | no-clip ]#",
			relevance: 50,
			browsers: ["E120", "FF53", "FFA53", "S15.4", "SM15.4", "C120", "CA120", "O106"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/mask-clip",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-12-07",
			},
			description:
				"The mask-clip CSS property determines the area, which is affected by a mask. The painted content of an element must be restricted to this area.",
		},
		{
			name: "mask-composite",
			syntax: "<compositing-operator>#",
			relevance: 54,
			browsers: ["E120", "FF53", "FFA53", "S15.4", "SM15.4", "C120", "CA120", "O106"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/mask-composite",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-12-07",
			},
			description:
				"The mask-composite CSS property represents a compositing operation used on the current mask layer with the mask layers below it.",
		},
		{
			name: "masonry-auto-flow",
			status: "nonstandard",
			syntax: "[ pack | next ] || [ definite-first | ordered ]",
			relevance: 0,
			description:
				"The masonry-auto-flow CSS property modifies how items are placed when using masonry in CSS Grid Layout.",
		},
		{
			name: "math-depth",
			syntax: "auto-add | add(<integer>) | <integer>",
			relevance: 50,
			browsers: ["E109", "FF117", "FFA117", "C109", "CA109", "O95"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/math-depth",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				'Describe a notion of "depth" for each element of a mathematical formula, with respect to the top-level container of that formula.',
		},
		{
			name: "math-shift",
			status: "experimental",
			syntax: "normal | compact",
			values: [
				{
					name: "normal",
				},
				{
					name: "compact",
				},
			],
			relevance: 50,
			browsers: ["E109", "C109", "CA109", "O95"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/math-shift",
				},
			],
			baseline: {
				status: "false",
			},
			description: "Used for positioning superscript during the layout of MathML scripted elements.",
		},
		{
			name: "math-style",
			syntax: "normal | compact",
			values: [
				{
					name: "normal",
				},
				{
					name: "compact",
				},
			],
			relevance: 50,
			browsers: ["E109", "FF117", "FFA117", "S14.1", "SM14.5", "C109", "CA109", "O95"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/math-style",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-08-29",
			},
			description:
				"The math-style property indicates whether MathML equations should render with normal or compact height.",
		},
		{
			name: "max-lines",
			status: "experimental",
			syntax: "none | <integer>",
			relevance: 50,
			description: "The max-lines property forces a break after a set number of lines",
		},
		{
			name: "object-view-box",
			status: "experimental",
			syntax: "none | <basic-shape-rect>",
			relevance: 50,
			browsers: ["E104", "C104", "CA104", "O90"],
			baseline: {
				status: "false",
			},
			description: "",
		},
		{
			name: "offset",
			syntax:
				"[ <'offset-position'>? [ <'offset-path'> [ <'offset-distance'> || <'offset-rotate'> ]? ]? ]! [ / <'offset-anchor'> ]?",
			relevance: 50,
			browsers: ["E79", "FF72", "FFA79", "S16", "SM16", "C55", "CA55", "O42"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/offset",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-09-12",
				baseline_high_date: "2025-03-12",
			},
			description: "The offset CSS property is a shorthand property for animating an element along a defined path.",
		},
		{
			name: "offset-anchor",
			syntax: "auto | <position>",
			relevance: 50,
			browsers: ["E116", "FF72", "FFA79", "S16", "SM16", "C116", "CA116", "O102"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/offset-anchor",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-08-21",
			},
			description:
				"Defines an anchor point of the box positioned along the path. The anchor point specifies the point of the box which is to be considered as the point that is moved along the path.",
		},
		{
			name: "offset-distance",
			syntax: "<length-percentage>",
			relevance: 50,
			browsers: ["E79", "FF72", "FFA79", "S16", "SM16", "C55", "CA55", "O42"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/offset-distance",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-09-12",
				baseline_high_date: "2025-03-12",
			},
			description: "The offset-distance CSS property specifies a position along an offset-path.",
		},
		{
			name: "offset-path",
			syntax: "none | <offset-path> || <coord-box>",
			relevance: 50,
			browsers: ["E79", "FF72", "FFA79", "S15.4", "SM15.4", "C55", "CA55", "O45"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/offset-path",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-03-14",
				baseline_high_date: "2024-09-14",
			},
			description:
				'The offset-path CSS property specifies the offset path where the element gets positioned. The exact element’s position on the offset path is determined by the offset-distance property. An offset path is either a specified path with one or multiple sub-paths or the geometry of a not-styled basic shape. Each shape or path must define an initial position for the computed value of "0" for offset-distance and an initial direction which specifies the rotation of the object to the initial position.\n\nIn this specification, a direction (or rotation) of 0 degrees is equivalent to the direction of the positive x-axis in the object’s local coordinate system. In other words, a rotation of 0 degree points to the right side of the UA if the object and its ancestors have no transformation applied.',
		},
		{
			name: "offset-position",
			syntax: "normal | auto | <position>",
			relevance: 50,
			browsers: ["E116", "FF122", "FFA122", "S16", "SM16", "C116", "CA116", "O102"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/offset-position",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2024-01-23",
			},
			description:
				"Specifies the initial position of the offset path. If position is specified with static, offset-position would be ignored.",
		},
		{
			name: "offset-rotate",
			syntax: "[ auto | reverse ] || <angle>",
			relevance: 50,
			browsers: ["E79", "FF72", "FFA79", "S16", "SM16", "C56", "CA56", "O43"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/offset-rotate",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-09-12",
				baseline_high_date: "2025-03-12",
			},
			description:
				"The offset-rotate CSS property defines the direction of the element while positioning along the offset path.",
		},
		{
			name: "overflow-anchor",
			syntax: "auto | none",
			values: [
				{
					name: "auto",
				},
				{
					name: "none",
				},
			],
			relevance: 52,
			browsers: ["E79", "FF66", "FFA66", "Spreview", "C56", "CA56", "O43"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/overflow-anchor",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The overflow-anchor CSS property provides a way to opt out browser scroll anchoring behavior which adjusts scroll position to minimize content shifts.",
		},
		{
			name: "overflow-block",
			syntax: "visible | hidden | clip | scroll | auto",
			values: [
				{
					name: "visible",
				},
				{
					name: "hidden",
				},
				{
					name: "clip",
				},
				{
					name: "scroll",
				},
				{
					name: "auto",
				},
			],
			relevance: 50,
			browsers: ["E135", "FF69", "FFA79", "C135", "CA135", "O120"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/overflow-block",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The overflow-block CSS media feature can be used to test how the output device handles content that overflows the initial containing block along the block axis.",
		},
		{
			name: "overflow-clip-box",
			status: "nonstandard",
			syntax: "padding-box | content-box",
			values: [
				{
					name: "padding-box",
				},
				{
					name: "content-box",
				},
			],
			relevance: 0,
			description:
				"The overflow-clip-box CSS property specifies relative to which box the clipping happens when there is an overflow. It is short hand for the overflow-clip-box-inline and overflow-clip-box-block properties.",
		},
		{
			name: "overflow-clip-margin",
			syntax: "<visual-box> || <length [0,∞]>",
			relevance: 50,
			browsers: ["O76"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/overflow-clip-margin",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The overflow-clip-margin CSS property determines how far outside its bounds an element with overflow: clip may be painted before being clipped.",
		},
		{
			name: "overflow-inline",
			syntax: "visible | hidden | clip | scroll | auto",
			values: [
				{
					name: "visible",
				},
				{
					name: "hidden",
				},
				{
					name: "clip",
				},
				{
					name: "scroll",
				},
				{
					name: "auto",
				},
			],
			relevance: 50,
			browsers: ["E135", "FF69", "FFA79", "C135", "CA135", "O120"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/overflow-inline",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The overflow-inline CSS media feature can be used to test how the output device handles content that overflows the initial containing block along the inline axis.",
		},
		{
			name: "overlay",
			status: "experimental",
			syntax: "none | auto",
			values: [
				{
					name: "none",
				},
				{
					name: "auto",
				},
			],
			relevance: 50,
			browsers: ["E117", "C117", "CA117", "O103"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/overlay",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				'The overlay CSS property specifies whether an element appearing in the top layer (for example, a shown popover or modal {{htmlelement("dialog")}} element) is actually rendered in the top layer. This property is only relevant within a list of transition-property values, and only if allow-discrete is set as the transition-behavior.',
		},
		{
			name: "overscroll-behavior",
			syntax: "[ contain | none | auto ]{1,2}",
			relevance: 50,
			browsers: ["E18", "FF59", "FFA59", "S16", "SM16", "C63", "CA63", "O50"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/overscroll-behavior",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-09-12",
				baseline_high_date: "2025-03-12",
			},
			description:
				"The overscroll-behavior CSS property is shorthand for the overscroll-behavior-x and overscroll-behavior-y properties, which allow you to control the browser's scroll overflow behavior — what happens when the boundary of a scrolling area is reached.",
		},
		{
			name: "overscroll-behavior-block",
			syntax: "contain | none | auto",
			values: [
				{
					name: "contain",
				},
				{
					name: "none",
				},
				{
					name: "auto",
				},
			],
			relevance: 50,
			browsers: ["E79", "FF73", "FFA79", "S16", "SM16", "C77", "CA77", "O64"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/overscroll-behavior-block",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-09-12",
				baseline_high_date: "2025-03-12",
			},
			description:
				"The overscroll-behavior-block CSS property sets the browser's behavior when the block direction boundary of a scrolling area is reached.",
		},
		{
			name: "overscroll-behavior-inline",
			syntax: "contain | none | auto",
			values: [
				{
					name: "contain",
				},
				{
					name: "none",
				},
				{
					name: "auto",
				},
			],
			relevance: 51,
			browsers: ["E79", "FF73", "FFA79", "S16", "SM16", "C77", "CA77", "O64"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/overscroll-behavior-inline",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-09-12",
				baseline_high_date: "2025-03-12",
			},
			description:
				"The overscroll-behavior-inline CSS property sets the browser's behavior when the inline direction boundary of a scrolling area is reached.",
		},
		{
			name: "overscroll-behavior-x",
			syntax: "contain | none | auto",
			values: [
				{
					name: "contain",
				},
				{
					name: "none",
				},
				{
					name: "auto",
				},
			],
			relevance: 50,
			browsers: ["E18", "FF59", "FFA59", "S16", "SM16", "C63", "CA63", "O50"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/overscroll-behavior-x",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-09-12",
				baseline_high_date: "2025-03-12",
			},
			description:
				"The overscroll-behavior-x CSS property is allows you to control the browser's scroll overflow behavior — what happens when the boundary of a scrolling area is reached — in the x axis direction.",
		},
		{
			name: "overscroll-behavior-y",
			syntax: "contain | none | auto",
			values: [
				{
					name: "contain",
				},
				{
					name: "none",
				},
				{
					name: "auto",
				},
			],
			relevance: 50,
			browsers: ["E18", "FF59", "FFA59", "S16", "SM16", "C63", "CA63", "O50"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/overscroll-behavior-y",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-09-12",
				baseline_high_date: "2025-03-12",
			},
			description:
				"The overscroll-behavior-y CSS property is allows you to control the browser's scroll overflow behavior — what happens when the boundary of a scrolling area is reached — in the y axis direction.",
		},
		{
			name: "padding-block",
			syntax: "<'padding-top'>{1,2}",
			relevance: 57,
			browsers: ["E87", "FF66", "FFA66", "S14.1", "SM14.5", "C87", "CA87", "O73"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/padding-block",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-04-26",
				baseline_high_date: "2023-10-26",
			},
			description:
				"The padding-block CSS property defines the logical block start and end padding of an element, which maps to physical padding properties depending on the element's writing mode, directionality, and text orientation.",
		},
		{
			name: "padding-inline",
			syntax: "<'padding-top'>{1,2}",
			relevance: 57,
			browsers: ["E87", "FF66", "FFA66", "S14.1", "SM14.5", "C87", "CA87", "O73"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/padding-inline",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-04-26",
				baseline_high_date: "2023-10-26",
			},
			description:
				"The padding-inline CSS property defines the logical inline start and end padding of an element, which maps to physical padding properties depending on the element's writing mode, directionality, and text orientation.",
		},
		{
			name: "page",
			syntax: "auto | <custom-ident>",
			relevance: 50,
			browsers: ["E85", "FF110", "FFA110", "S1", "SM1", "C85", "CA85", "O71"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/page",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-02-14",
			},
			description:
				"The page CSS property is used to specify the named page, a specific type of page defined by the @page at-rule.",
		},
		{
			name: "place-content",
			syntax: "<'align-content'> <'justify-content'>?",
			relevance: 56,
			browsers: ["E79", "FF45", "FFA45", "S9", "SM9", "C59", "CA59", "O46"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/place-content",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"The place-content CSS shorthand property sets both the align-content and justify-content properties.",
		},
		{
			name: "place-items",
			syntax: "<'align-items'> <'justify-items'>?",
			relevance: 56,
			browsers: ["E79", "FF45", "FFA45", "S11", "SM11", "C59", "CA59", "O46"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/place-items",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"The CSS place-items shorthand property sets both the align-items and justify-items properties. The first value is the align-items property value, the second the justify-items one. If the second value is not present, the first value is also used for it.",
		},
		{
			name: "place-self",
			syntax: "<'align-self'> <'justify-self'>?",
			relevance: 51,
			browsers: ["E79", "FF45", "FFA45", "S11", "SM11", "C59", "CA59", "O46"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/place-self",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"The place-self CSS property is a shorthand property sets both the align-self and justify-self properties. The first value is the align-self property value, the second the justify-self one. If the second value is not present, the first value is also used for it.",
		},
		{
			name: "position-anchor",
			status: "experimental",
			syntax: "auto | <anchor-name>",
			relevance: 50,
			browsers: ["E125", "C125", "CA125", "O111"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/position-anchor",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The position-anchor property defines the default anchor specifier for all anchor functions on the element, allowing multiple elements to use the same set of anchor functions (and position options lists!) while changing which anchor element each is referring to.",
		},
		{
			name: "position-area",
			status: "experimental",
			syntax: "none | <position-area>",
			relevance: 50,
			browsers: ["E129", "C129", "CA129", "O115"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/position-area",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The position-area CSS property enables an anchor-positioned element to be positioned relative to the edges of its associated anchor element by placing the positioned element on one or more tiles of an implicit 3x3 grid, where the anchoring element is the center cell.",
		},
		{
			name: "position-try",
			status: "experimental",
			syntax: "<'position-try-order'>? <'position-try-fallbacks'>",
			relevance: 50,
			browsers: ["E125", "C125", "CA125", "O111"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/position-try",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"This shorthand sets both position-try-options and position-try-order. If <'position-try-order'> is omitted, it’s set to the property’s initial value.",
		},
		{
			name: "position-try-fallbacks",
			status: "experimental",
			syntax: "none | [ [<dashed-ident> || <try-tactic>] | <'position-area'> ]#",
			relevance: 50,
			browsers: ["E128", "C128", "CA128", "O114"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/position-try-fallbacks",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The position-try-fallbacks CSS property enables you to specify a list of one or more alternative position try fallback options for anchor-positioned elements to be placed relative to their associated anchor elements. When the element would otherwise overflow its inset-modified containing block, the browser will try placing the positioned element in these different fallback positions, in the order provided, until it finds a value that stops it from overflowing its container or the viewport.",
		},
		{
			name: "position-try-order",
			status: "experimental",
			syntax: "normal | <try-size>",
			relevance: 50,
			browsers: ["E125", "C125", "CA125", "O111"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/position-try-order",
				},
			],
			baseline: {
				status: "false",
			},
			description: "This property specifies the order in which the position options list will be tried.",
		},
		{
			name: "position-visibility",
			status: "experimental",
			syntax: "always | [ anchors-valid || anchors-visible || no-overflow ]",
			relevance: 50,
			browsers: ["E125", "C125", "CA125", "O111"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/position-visibility",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"There are times when an element’s anchors are not appropriate for positioning the element with, and it would be better to simply not display the element at all. position-visibility provides several conditions where this could be the case.",
		},
		{
			name: "print-color-adjust",
			syntax: "economy | exact",
			values: [
				{
					name: "economy",
				},
				{
					name: "exact",
				},
			],
			relevance: 51,
			browsers: ["FF97", "FFA97", "S15.4", "SM15.4", "C136", "CA136", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/print-color-adjust",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"Defines what optimization the user agent is allowed to do when adjusting the appearance for an output device.",
		},
		{
			name: "r",
			syntax: "<length> | <percentage>",
			relevance: 52,
			browsers: ["E79", "FF69", "FFA79", "S9", "SM9", "C43", "CA43", "O30"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/r",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-07-28",
				baseline_high_date: "2023-01-28",
			},
			description:
				"The r CSS property defines the radius of a circle. It can only be used with the SVG circle element. If present, it overrides the circle's r attribute.",
		},
		{
			name: "rotate",
			syntax: "none | <angle> | [ x | y | z | <number>{3} ] && <angle>",
			relevance: 52,
			browsers: ["E104", "FF72", "FFA79", "S14.1", "SM14.5", "C104", "CA104", "O90"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/rotate",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-08-05",
				baseline_high_date: "2025-02-05",
			},
			description:
				"The rotate CSS property allows you to specify rotation transforms individually and independently of the transform property. This maps better to typical user interface usage, and saves having to remember the exact order of transform functions to specify in the transform value.",
		},
		{
			name: "row-gap",
			syntax: "normal | <length-percentage>",
			relevance: 60,
			browsers: ["E16", "FF52", "FFA52", "S10.1", "SM10.3", "C47", "CA47", "O34"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/row-gap",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2017-10-17",
				baseline_high_date: "2020-04-17",
			},
			description: "The row-gap CSS property specifies the gutter between grid rows.",
		},
		{
			name: "ruby-merge",
			status: "experimental",
			syntax: "separate | collapse | auto",
			values: [
				{
					name: "separate",
				},
				{
					name: "collapse",
				},
				{
					name: "auto",
				},
			],
			relevance: 50,
			description:
				"This property controls how ruby annotation boxes should be rendered when there are more than one in a ruby container box: whether each pair should be kept separate, the annotations should be collapsed and rendered as a group, or the separation should be determined based on the space available.",
		},
		{
			name: "rx",
			syntax: "<length> | <percentage>",
			relevance: 50,
			browsers: ["E79", "FF69", "FFA79", "C43", "CA43", "O30"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/rx",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The rx CSS property defines the x-axis, or horizontal, radius of an SVG ellipse and the horizontal curve of the corners of an SVG rect rectangle. If present, it overrides the shape's rx attribute.",
		},
		{
			name: "ry",
			syntax: "<length> | <percentage>",
			relevance: 50,
			browsers: ["E79", "FF69", "FFA79", "C43", "CA43", "O30"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/ry",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The ry CSS property defines the y-axis, or vertical, radius of an SVG ellipse and the vertical curve of the corners of an SVG rect rectangle. If present, it overrides the shape's ry attribute.",
		},
		{
			name: "scale",
			syntax: "none | [ <number> | <percentage> ]{1,3}",
			relevance: 52,
			browsers: ["E104", "FF72", "FFA79", "S14.1", "SM14.5", "C104", "CA104", "O90"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scale",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-08-05",
				baseline_high_date: "2025-02-05",
			},
			description:
				"The scale CSS property allows you to specify scale transforms individually and independently of the transform property. This maps better to typical user interface usage, and saves having to remember the exact order of transform functions to specify in the transform value.",
		},
		{
			name: "scroll-initial-target",
			status: "experimental",
			syntax: "none | nearest",
			values: [
				{
					name: "none",
				},
				{
					name: "nearest",
				},
			],
			relevance: 50,
			browsers: ["E133", "C133", "CA133", "O118"],
			baseline: {
				status: "false",
			},
			description: "",
		},
		{
			name: "scroll-margin",
			syntax: "<length>{1,4}",
			relevance: 50,
			browsers: ["E79", "FF90", "FFA90", "S14.1", "SM14.5", "C69", "CA69", "O56"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scroll-margin",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-07-13",
				baseline_high_date: "2024-01-13",
			},
			description:
				"The scroll-margin property is a shorthand property which sets all of the scroll-margin longhands, assigning values much like the margin property does for the margin-* longhands.",
		},
		{
			name: "scroll-margin-block",
			syntax: "<length>{1,2}",
			relevance: 50,
			browsers: ["E79", "FF68", "FFA68", "S15", "SM15", "C69", "CA69", "O56"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-block",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-09-20",
				baseline_high_date: "2024-03-20",
			},
			description:
				"The scroll-margin-block property is a shorthand property which sets the scroll-margin longhands in the block dimension.",
		},
		{
			name: "scroll-margin-block-end",
			syntax: "<length>",
			relevance: 50,
			browsers: ["E79", "FF68", "FFA68", "S15", "SM15", "C69", "CA69", "O56"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-block-end",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-09-20",
				baseline_high_date: "2024-03-20",
			},
			description:
				"The scroll-margin-block-end property defines the margin of the scroll snap area at the end of the block dimension that is used for snapping this box to the snapport. The scroll snap area is determined by taking the transformed border box, finding its rectangular bounding box (axis-aligned in the scroll container’s coordinate space), then adding the specified outsets.",
		},
		{
			name: "scroll-margin-block-start",
			syntax: "<length>",
			relevance: 50,
			browsers: ["E79", "FF68", "FFA68", "S15", "SM15", "C69", "CA69", "O56"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-block-start",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-09-20",
				baseline_high_date: "2024-03-20",
			},
			description:
				"The scroll-margin-block-start property defines the margin of the scroll snap area at the start of the block dimension that is used for snapping this box to the snapport. The scroll snap area is determined by taking the transformed border box, finding its rectangular bounding box (axis-aligned in the scroll container’s coordinate space), then adding the specified outsets.",
		},
		{
			name: "scroll-margin-bottom",
			syntax: "<length>",
			relevance: 50,
			browsers: ["E79", "FF68", "FFA68", "S14.1", "SM14.5", "C69", "CA69", "O56"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-bottom",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-04-26",
				baseline_high_date: "2023-10-26",
			},
			description:
				"The scroll-margin-bottom property defines the bottom margin of the scroll snap area that is used for snapping this box to the snapport. The scroll snap area is determined by taking the transformed border box, finding its rectangular bounding box (axis-aligned in the scroll container’s coordinate space), then adding the specified outsets.",
		},
		{
			name: "scroll-margin-inline",
			syntax: "<length>{1,2}",
			relevance: 50,
			browsers: ["E79", "FF68", "FFA68", "S15", "SM15", "C69", "CA69", "O56"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-inline",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-09-20",
				baseline_high_date: "2024-03-20",
			},
			description:
				"The scroll-margin-inline property is a shorthand property which sets the scroll-margin longhands in the inline dimension.",
		},
		{
			name: "scroll-margin-inline-end",
			syntax: "<length>",
			relevance: 50,
			browsers: ["E79", "FF68", "FFA68", "S15", "SM15", "C69", "CA69", "O56"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-inline-end",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-09-20",
				baseline_high_date: "2024-03-20",
			},
			description:
				"The scroll-margin-inline-end property defines the margin of the scroll snap area at the end of the inline dimension that is used for snapping this box to the snapport. The scroll snap area is determined by taking the transformed border box, finding its rectangular bounding box (axis-aligned in the scroll container’s coordinate space), then adding the specified outsets.",
		},
		{
			name: "scroll-margin-inline-start",
			syntax: "<length>",
			relevance: 50,
			browsers: ["E79", "FF68", "FFA68", "S15", "SM15", "C69", "CA69", "O56"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-inline-start",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-09-20",
				baseline_high_date: "2024-03-20",
			},
			description:
				"The scroll-margin-inline-start property defines the margin of the scroll snap area at the start of the inline dimension that is used for snapping this box to the snapport. The scroll snap area is determined by taking the transformed border box, finding its rectangular bounding box (axis-aligned in the scroll container’s coordinate space), then adding the specified outsets.",
		},
		{
			name: "scroll-margin-left",
			syntax: "<length>",
			relevance: 50,
			browsers: ["E79", "FF68", "FFA68", "S14.1", "SM14.5", "C69", "CA69", "O56"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-left",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-04-26",
				baseline_high_date: "2023-10-26",
			},
			description:
				"The scroll-margin-left property defines the left margin of the scroll snap area that is used for snapping this box to the snapport. The scroll snap area is determined by taking the transformed border box, finding its rectangular bounding box (axis-aligned in the scroll container’s coordinate space), then adding the specified outsets.",
		},
		{
			name: "scroll-margin-right",
			syntax: "<length>",
			relevance: 50,
			browsers: ["E79", "FF68", "FFA68", "S14.1", "SM14.5", "C69", "CA69", "O56"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-right",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-04-26",
				baseline_high_date: "2023-10-26",
			},
			description:
				"The scroll-margin-right property defines the right margin of the scroll snap area that is used for snapping this box to the snapport. The scroll snap area is determined by taking the transformed border box, finding its rectangular bounding box (axis-aligned in the scroll container’s coordinate space), then adding the specified outsets.",
		},
		{
			name: "scroll-margin-top",
			syntax: "<length>",
			relevance: 50,
			browsers: ["E79", "FF68", "FFA68", "S14.1", "SM14.5", "C69", "CA69", "O56"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-top",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-04-26",
				baseline_high_date: "2023-10-26",
			},
			description:
				"The scroll-margin-top property defines the top margin of the scroll snap area that is used for snapping this box to the snapport. The scroll snap area is determined by taking the transformed border box, finding its rectangular bounding box (axis-aligned in the scroll container’s coordinate space), then adding the specified outsets.",
		},
		{
			name: "scroll-padding",
			syntax: "[ auto | <length-percentage> ]{1,4}",
			relevance: 53,
			browsers: ["E79", "FF68", "FFA68", "S14.1", "SM14.5", "C69", "CA69", "O56"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scroll-padding",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-04-26",
				baseline_high_date: "2023-10-26",
			},
			description:
				"The scroll-padding property is a shorthand property which sets all of the scroll-padding longhands, assigning values much like the padding property does for the padding-* longhands.",
		},
		{
			name: "scroll-padding-block",
			syntax: "[ auto | <length-percentage> ]{1,2}",
			relevance: 50,
			browsers: ["E79", "FF68", "FFA68", "S15", "SM15", "C69", "CA69", "O56"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scroll-padding-block",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-09-20",
				baseline_high_date: "2024-03-20",
			},
			description:
				"The scroll-padding-block property is a shorthand property which sets the scroll-padding longhands for the block dimension.",
		},
		{
			name: "scroll-padding-block-end",
			syntax: "auto | <length-percentage>",
			relevance: 50,
			browsers: ["E79", "FF68", "FFA68", "S15", "SM15", "C69", "CA69", "O56"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scroll-padding-block-end",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-09-20",
				baseline_high_date: "2024-03-20",
			},
			description:
				"The scroll-padding-block-end property defines offsets for the end edge in the block dimension of the optimal viewing region of the scrollport: the region used as the target region for placing things in view of the user. This allows the author to exclude regions of the scrollport that are obscured by other content (such as fixed-positioned toolbars or sidebars) or simply to put more breathing room between a targeted element and the edges of the scrollport.",
		},
		{
			name: "scroll-padding-block-start",
			syntax: "auto | <length-percentage>",
			relevance: 50,
			browsers: ["E79", "FF68", "FFA68", "S15", "SM15", "C69", "CA69", "O56"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scroll-padding-block-start",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-09-20",
				baseline_high_date: "2024-03-20",
			},
			description:
				"The scroll-padding-block-start property defines offsets for the start edge in the block dimension of the optimal viewing region of the scrollport: the region used as the target region for placing things in view of the user. This allows the author to exclude regions of the scrollport that are obscured by other content (such as fixed-positioned toolbars or sidebars) or simply to put more breathing room between a targeted element and the edges of the scrollport.",
		},
		{
			name: "scroll-padding-bottom",
			syntax: "auto | <length-percentage>",
			relevance: 50,
			browsers: ["E79", "FF68", "FFA68", "S14.1", "SM14.5", "C69", "CA69", "O56"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scroll-padding-bottom",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-04-26",
				baseline_high_date: "2023-10-26",
			},
			description:
				"The scroll-padding-bottom property defines offsets for the bottom of the optimal viewing region of the scrollport: the region used as the target region for placing things in view of the user. This allows the author to exclude regions of the scrollport that are obscured by other content (such as fixed-positioned toolbars or sidebars) or simply to put more breathing room between a targeted element and the edges of the scrollport.",
		},
		{
			name: "scroll-padding-inline",
			syntax: "[ auto | <length-percentage> ]{1,2}",
			relevance: 50,
			browsers: ["E79", "FF68", "FFA68", "S15", "SM15", "C69", "CA69", "O56"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scroll-padding-inline",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-09-20",
				baseline_high_date: "2024-03-20",
			},
			description:
				"The scroll-padding-inline property is a shorthand property which sets the scroll-padding longhands for the inline dimension.",
		},
		{
			name: "scroll-padding-inline-end",
			syntax: "auto | <length-percentage>",
			relevance: 50,
			browsers: ["E79", "FF68", "FFA68", "S15", "SM15", "C69", "CA69", "O56"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scroll-padding-inline-end",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-09-20",
				baseline_high_date: "2024-03-20",
			},
			description:
				"The scroll-padding-inline-end property defines offsets for the end edge in the inline dimension of the optimal viewing region of the scrollport: the region used as the target region for placing things in view of the user. This allows the author to exclude regions of the scrollport that are obscured by other content (such as fixed-positioned toolbars or sidebars) or simply to put more breathing room between a targeted element and the edges of the scrollport.",
		},
		{
			name: "scroll-padding-inline-start",
			syntax: "auto | <length-percentage>",
			relevance: 50,
			browsers: ["E79", "FF68", "FFA68", "S15", "SM15", "C69", "CA69", "O56"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scroll-padding-inline-start",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-09-20",
				baseline_high_date: "2024-03-20",
			},
			description:
				"The scroll-padding-inline-start property defines offsets for the start edge in the inline dimension of the optimal viewing region of the scrollport: the region used as the target region for placing things in view of the user. This allows the author to exclude regions of the scrollport that are obscured by other content (such as fixed-positioned toolbars or sidebars) or simply to put more breathing room between a targeted element and the edges of the scrollport.",
		},
		{
			name: "scroll-padding-left",
			syntax: "auto | <length-percentage>",
			relevance: 50,
			browsers: ["E79", "FF68", "FFA68", "S14.1", "SM14.5", "C69", "CA69", "O56"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scroll-padding-left",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-04-26",
				baseline_high_date: "2023-10-26",
			},
			description:
				"The scroll-padding-left property defines offsets for the left of the optimal viewing region of the scrollport: the region used as the target region for placing things in view of the user. This allows the author to exclude regions of the scrollport that are obscured by other content (such as fixed-positioned toolbars or sidebars) or simply to put more breathing room between a targeted element and the edges of the scrollport.",
		},
		{
			name: "scroll-padding-right",
			syntax: "auto | <length-percentage>",
			relevance: 50,
			browsers: ["E79", "FF68", "FFA68", "S14.1", "SM14.5", "C69", "CA69", "O56"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scroll-padding-right",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-04-26",
				baseline_high_date: "2023-10-26",
			},
			description:
				"The scroll-padding-right property defines offsets for the right of the optimal viewing region of the scrollport: the region used as the target region for placing things in view of the user. This allows the author to exclude regions of the scrollport that are obscured by other content (such as fixed-positioned toolbars or sidebars) or simply to put more breathing room between a targeted element and the edges of the scrollport.",
		},
		{
			name: "scroll-padding-top",
			syntax: "auto | <length-percentage>",
			relevance: 51,
			browsers: ["E79", "FF68", "FFA68", "S14.1", "SM14.5", "C69", "CA69", "O56"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scroll-padding-top",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-04-26",
				baseline_high_date: "2023-10-26",
			},
			description:
				"The scroll-padding-top property defines offsets for the top of the optimal viewing region of the scrollport: the region used as the target region for placing things in view of the user. This allows the author to exclude regions of the scrollport that are obscured by other content (such as fixed-positioned toolbars or sidebars) or simply to put more breathing room between a targeted element and the edges of the scrollport.",
		},
		{
			name: "scroll-snap-align",
			syntax: "[ none | start | end | center ]{1,2}",
			relevance: 54,
			browsers: ["E79", "FF68", "FFA68", "S11", "SM11", "C69", "CA69", "O56"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scroll-snap-align",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"The scroll-snap-align property specifies the box’s snap position as an alignment of its snap area (as the alignment subject) within its snap container’s snapport (as the alignment container). The two values specify the snapping alignment in the block axis and inline axis, respectively. If only one value is specified, the second value defaults to the same value.",
		},
		{
			name: "scroll-snap-stop",
			syntax: "normal | always",
			values: [
				{
					name: "normal",
				},
				{
					name: "always",
				},
			],
			relevance: 52,
			browsers: ["E79", "FF103", "FFA103", "S15", "SM15", "C75", "CA75", "O62"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scroll-snap-stop",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-07-26",
				baseline_high_date: "2025-01-26",
			},
			description:
				'The scroll-snap-stop CSS property defines whether the scroll container is allowed to "pass over" possible snap positions.',
		},
		{
			name: "scroll-snap-type-x",
			status: "obsolete",
			syntax: "none | mandatory | proximity",
			values: [
				{
					name: "none",
				},
				{
					name: "mandatory",
				},
				{
					name: "proximity",
				},
			],
			relevance: 0,
			description:
				"The scroll-snap-type-x CSS property defines how strictly snap points are enforced on the horizontal axis of the scroll container in case there is one.\n\nSpecifying any precise animations or physics used to enforce those snap points is not covered by this property but instead left up to the user agent.",
		},
		{
			name: "scroll-snap-type-y",
			status: "obsolete",
			syntax: "none | mandatory | proximity",
			values: [
				{
					name: "none",
				},
				{
					name: "mandatory",
				},
				{
					name: "proximity",
				},
			],
			relevance: 0,
			description:
				"The scroll-snap-type-y CSS property defines how strictly snap points are enforced on the vertical axis of the scroll container in case there is one.\n\nSpecifying any precise animations or physics used to enforce those snap points is not covered by this property but instead left up to the user agent.",
		},
		{
			name: "scroll-timeline",
			status: "experimental",
			syntax: "[ <'scroll-timeline-name'> <'scroll-timeline-axis'>? ]#",
			relevance: 50,
			browsers: ["E115", "C115", "CA115", "O101"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scroll-timeline",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"Defines a name that can be used to identify the source element of a scroll timeline, along with the scrollbar axis that should provide the timeline.",
		},
		{
			name: "scroll-timeline-axis",
			status: "experimental",
			syntax: "[ block | inline | x | y ]#",
			relevance: 50,
			browsers: ["E115", "C115", "CA115", "O101"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scroll-timeline-axis",
				},
			],
			baseline: {
				status: "false",
			},
			description: "Specifies the scrollbar that will be used to provide the timeline for a scroll-timeline animation",
		},
		{
			name: "scroll-timeline-name",
			status: "experimental",
			syntax: "[ none | <dashed-ident> ]#",
			relevance: 50,
			browsers: ["E115", "C115", "CA115", "O101"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scroll-timeline-name",
				},
			],
			baseline: {
				status: "false",
			},
			description: "Defines a name that can be used to identify an element as the source of a scroll-timeline.",
		},
		{
			name: "scrollbar-color",
			syntax: "auto | <color>{2}",
			relevance: 55,
			browsers: ["E121", "FF64", "FFA64", "C121", "CA121", "O107"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scrollbar-color",
				},
			],
			baseline: {
				status: "false",
			},
			description: "The scrollbar-color CSS property sets the color of the scrollbar track and thumb.",
		},
		{
			name: "scrollbar-gutter",
			syntax: "auto | stable && both-edges?",
			relevance: 54,
			browsers: ["E94", "FF97", "FFA97", "S18.2", "SM18.2", "C94", "CA94", "O80"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scrollbar-gutter",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2024-12-11",
			},
			description:
				"The scrollbar-gutter CSS property allows authors to reserve space for the scrollbar, preventing unwanted layout changes as the content grows while also avoiding unnecessary visuals when scrolling isn't needed.",
		},
		{
			name: "scrollbar-width",
			syntax: "auto | thin | none",
			values: [
				{
					name: "auto",
				},
				{
					name: "thin",
				},
				{
					name: "none",
				},
			],
			relevance: 68,
			browsers: ["E121", "FF64", "FFA64", "S18.2", "SM18.2", "C121", "CA121", "O107"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/scrollbar-width",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2024-12-11",
			},
			description:
				"The scrollbar-width property allows the author to set the maximum thickness of an element’s scrollbars when they are shown. ",
		},
		{
			name: "speak-as",
			atRule: "@counter-style",
			syntax: "auto | bullets | numbers | words | spell-out | <counter-style-name>",
			relevance: 50,
			browsers: ["S11.1", "SM11.3"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/speak-as",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The speak-as descriptor specifies how a counter symbol constructed with a given @counter-style will be represented in the spoken form. For example, an author can specify a counter symbol to be either spoken as its numerical value or just represented with an audio cue.",
		},
		{
			name: "text-box",
			syntax: "normal | <'text-box-trim'> || <'text-box-edge'>",
			relevance: 50,
			browsers: ["E133", "S18.2", "SM18.2", "C133", "CA133", "O118"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-box",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The text-box CSS property is a shorthand that corresponds to the text-box-trim and text-box-edge properties, which together specify the amount of space to trim from the block-start edge and block-end edge of a text element's block container.",
		},
		{
			name: "text-box-edge",
			syntax: "auto | <text-edge>",
			relevance: 50,
			browsers: ["E133", "S18.2", "SM18.2", "C133", "CA133", "O118"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-box-edge",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The text-box-edge CSS property specifies an amount of space to trim from a text element's block container.",
		},
		{
			name: "text-box-trim",
			syntax: "none | trim-start | trim-end | trim-both",
			values: [
				{
					name: "none",
				},
				{
					name: "trim-start",
				},
				{
					name: "trim-end",
				},
				{
					name: "trim-both",
				},
			],
			relevance: 50,
			browsers: ["E133", "S18.2", "SM18.2", "C133", "CA133", "O118"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-box-trim",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The text-box-trim CSS property specifies which of the over and under edges of text content to trim from a text element's block container.",
		},
		{
			name: "text-combine-upright",
			syntax: "none | all | [ digits <integer>? ]",
			relevance: 50,
			browsers: ["E79", "FF48", "FFA48", "S15.4", "SM15.4", "C48", "CA48", "IE11", "O35"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-combine-upright",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-03-14",
				baseline_high_date: "2024-09-14",
			},
			description:
				"The text-combine-upright CSS property specifies the combination of multiple characters into the space of a single character. If the combined text is wider than 1em, the user agent must fit the contents within 1em. The resulting composition is treated as a single upright glyph for layout and decoration. This property only has an effect in vertical writing modes.\n\nThis is used to produce an effect that is known as tate-chū-yoko (縦中横) in Japanese, or as 直書橫向 in Chinese.",
		},
		{
			name: "text-decoration-skip",
			status: "experimental",
			syntax: "none | [ objects || [ spaces | [ leading-spaces || trailing-spaces ] ] || edges || box-decoration ]",
			relevance: 50,
			browsers: ["S12.1", "SM12.2", "O44"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-decoration-skip",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The text-decoration-skip CSS property specifies what parts of the element’s content any text decoration affecting the element must skip over. It controls all text decoration lines drawn by the element and also any text decoration lines drawn by its ancestors.",
		},
		{
			name: "text-decoration-skip-ink",
			syntax: "auto | all | none",
			values: [
				{
					name: "auto",
				},
				{
					name: "all",
				},
				{
					name: "none",
				},
			],
			relevance: 51,
			browsers: ["E79", "FF70", "FFA79", "S15.4", "SM15.4", "C64", "CA64", "O50"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-decoration-skip-ink",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-03-14",
				baseline_high_date: "2024-09-14",
			},
			description:
				"The text-decoration-skip-ink CSS property specifies how overlines and underlines are drawn when they pass over glyph ascenders and descenders.",
		},
		{
			name: "text-decoration-thickness",
			syntax: "auto | from-font | <length> | <percentage> ",
			relevance: 55,
			browsers: ["E89", "FF70", "FFA79", "S12.1", "SM12.2", "C89", "CA89", "O75"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-decoration-thickness",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-03-04",
				baseline_high_date: "2023-09-04",
			},
			description:
				"The text-decoration-thickness CSS property sets the thickness, or width, of the decoration line that is used on text in an element, such as a line-through, underline, or overline.",
		},
		{
			name: "text-emphasis",
			syntax: "<'text-emphasis-style'> || <'text-emphasis-color'>",
			relevance: 50,
			browsers: ["E99", "FF46", "FFA46", "S7", "SM7", "C99", "CA99", "O85"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-emphasis",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-03-03",
				baseline_high_date: "2024-09-03",
			},
			description:
				"The text-emphasis CSS property is a shorthand property for setting text-emphasis-style and text-emphasis-color in one declaration. This property will apply the specified emphasis mark to each character of the element's text, except separator characters, like spaces,  and control characters.",
		},
		{
			name: "text-emphasis-color",
			syntax: "<color>",
			relevance: 50,
			browsers: ["E99", "FF46", "FFA46", "S7", "SM7", "C99", "CA99", "O85"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-emphasis-color",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-03-03",
				baseline_high_date: "2024-09-03",
			},
			description:
				"The text-emphasis-color CSS property defines the color used to draw emphasis marks on text being rendered in the HTML document. This value can also be set and reset using the text-emphasis shorthand.",
		},
		{
			name: "text-emphasis-position",
			syntax: "auto | [ over | under ] && [ right | left ]?",
			relevance: 50,
			browsers: ["E99", "FF46", "FFA46", "S7", "SM7", "C99", "CA99", "O85"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-emphasis-position",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-03-03",
				baseline_high_date: "2024-09-03",
			},
			description:
				"The text-emphasis-position CSS property describes where emphasis marks are drawn at. The effect of emphasis marks on the line height is the same as for ruby text: if there isn't enough place, the line height is increased.",
		},
		{
			name: "text-emphasis-style",
			syntax: "none | [ [ filled | open ] || [ dot | circle | double-circle | triangle | sesame ] ] | <string>",
			relevance: 50,
			browsers: ["E99", "FF46", "FFA46", "S7", "SM7", "C99", "CA99", "O85"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-emphasis-style",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-03-03",
				baseline_high_date: "2024-09-03",
			},
			description:
				"The text-emphasis-style CSS property defines the type of emphasis used. It can also be set, and reset, using the text-emphasis shorthand.",
		},
		{
			name: "text-size-adjust",
			status: "experimental",
			syntax: "none | auto | <percentage>",
			relevance: 61,
			browsers: ["E79", "C54", "CA54", "O41"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-size-adjust",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The text-size-adjust CSS property controls the text inflation algorithm used on some smartphones and tablets. Other browsers will ignore this property.",
		},
		{
			name: "text-spacing-trim",
			status: "experimental",
			syntax: "space-all | normal | space-first | trim-start",
			values: [
				{
					name: "space-all",
				},
				{
					name: "normal",
				},
				{
					name: "space-first",
				},
				{
					name: "trim-start",
				},
			],
			relevance: 50,
			browsers: ["E123", "C123", "CA123", "O109"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-spacing-trim",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The text-spacing-trim CSS property controls the internal spacing set on Chinese/Japanese/Korean (CJK) punctuation characters between adjacent characters (kerning) and at the start or end of text lines.",
		},
		{
			name: "text-underline-offset",
			syntax: "auto | <length> | <percentage> ",
			relevance: 55,
			browsers: ["E87", "FF70", "FFA79", "S12.1", "SM12.2", "C87", "CA87", "O73"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-underline-offset",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-11-19",
				baseline_high_date: "2023-05-19",
			},
			description:
				"The text-underline-offset CSS property sets the offset distance of an underline text decoration line (applied using text-decoration) from its original position.",
		},
		{
			name: "text-wrap",
			syntax: "<'text-wrap-mode'> || <'text-wrap-style'>",
			relevance: 58,
			browsers: ["E114", "FF121", "FFA121", "S17.4", "SM17.4", "C114", "CA114", "O100"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-wrap",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2024-03-05",
			},
			description: "The text-wrap CSS property controls how text inside an element is wrapped.",
		},
		{
			name: "text-wrap-mode",
			syntax: "wrap | nowrap",
			values: [
				{
					name: "wrap",
				},
				{
					name: "nowrap",
				},
			],
			relevance: 51,
			browsers: ["E130", "FF124", "FFA124", "S17.4", "SM17.4", "C130", "CA130", "O115"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-wrap-mode",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2024-10-17",
			},
			description:
				'The text-wrap-mode CSS property controls whether the text inside an element is wrapped. The different values provide alternate ways of wrapping the content of a block element. It can also be set, and reset, using the {{CSSXRef("text-wrap")}} shorthand.',
		},
		{
			name: "text-wrap-style",
			syntax: "auto | balance | stable | pretty",
			values: [
				{
					name: "auto",
				},
				{
					name: "balance",
				},
				{
					name: "stable",
				},
				{
					name: "pretty",
				},
			],
			relevance: 50,
			browsers: ["E130", "FF124", "FFA124", "S17.5", "SM17.5", "C130", "CA130", "O115"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/text-wrap-style",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2024-10-17",
			},
			description:
				'The text-wrap-style CSS property controls how text inside an element is wrapped. The different values provide alternate ways of wrapping the content of a block element. It can also be set, and reset, using the {{CSSXRef("text-wrap")}} shorthand.',
		},
		{
			name: "timeline-scope",
			status: "experimental",
			syntax: "none | <dashed-ident>#",
			relevance: 50,
			browsers: ["E116", "C116", "CA116", "O102"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/timeline-scope",
				},
			],
			baseline: {
				status: "false",
			},
			description: "The timeline-scope CSS property modifies the scope of a named animation timeline.",
		},
		{
			name: "transform-box",
			syntax: "content-box | border-box | fill-box | stroke-box | view-box",
			values: [
				{
					name: "content-box",
				},
				{
					name: "border-box",
				},
				{
					name: "fill-box",
				},
				{
					name: "stroke-box",
				},
				{
					name: "view-box",
				},
			],
			relevance: 51,
			browsers: ["E79", "FF55", "FFA55", "S11", "SM11", "C64", "CA64", "O51"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/transform-box",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"The transform-box CSS property defines the layout box to which the transform and transform-origin properties relate.",
		},
		{
			name: "transition-behavior",
			syntax: "<transition-behavior-value>#",
			relevance: 50,
			browsers: ["E117", "FF129", "FFA129", "S17.4", "SM17.4", "C117", "CA117", "O103"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/transition-behavior",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2024-08-06",
			},
			description:
				"The transition-behavior CSS property specifies whether transitions will be started for properties whose animation behavior is discrete.",
		},
		{
			name: "translate",
			syntax: "none | <length-percentage> [ <length-percentage> <length>? ]?",
			relevance: 52,
			browsers: ["E104", "FF72", "FFA79", "S14.1", "SM14.5", "C104", "CA104", "O90"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/translate",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-08-05",
				baseline_high_date: "2025-02-05",
			},
			description:
				"The translate CSS property allows you to specify translation transforms individually and independently of the transform property. This maps better to typical user interface usage, and saves having to remember the exact order of transform functions to specify in the transform value.",
		},
		{
			name: "vector-effect",
			syntax: "none | non-scaling-stroke | non-scaling-size | non-rotation | fixed-position",
			values: [
				{
					name: "none",
				},
				{
					name: "non-scaling-stroke",
				},
				{
					name: "non-scaling-size",
				},
				{
					name: "non-rotation",
				},
				{
					name: "fixed-position",
				},
			],
			relevance: 50,
			browsers: ["E79", "FF15", "FFA15", "S5.1", "SM5", "C6", "CA18", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/vector-effect",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"The vector-effect CSS property suppresses specific transformation effects in SVG, thus permitting effects like a road on a map staying the same width no matter how the map is zoomed, or allowing a diagram key to retain its position and size regardless of other transforms. It can only be used with SVG elements that accept the vector-effect attribute. When used, the CSS value overrides any values of the element's vector-effect attribute.",
		},
		{
			name: "view-timeline",
			status: "experimental",
			syntax: "[ <'view-timeline-name'> [ <'view-timeline-axis'> || <'view-timeline-inset'> ]? ]#",
			relevance: 50,
			browsers: ["E115", "C115", "CA115", "O101"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/view-timeline",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The view-timeline CSS shorthand property is used to define a named view progress timeline, which is progressed through based on the change in visibility of an element (known as the subject) inside a scrollable element (scroller). view-timeline is set on the subject.",
		},
		{
			name: "view-timeline-axis",
			status: "experimental",
			syntax: "[ block | inline | x | y ]#",
			relevance: 50,
			browsers: ["E115", "C115", "CA115", "O101"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/view-timeline-axis",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The view-timeline-axis CSS property is used to specify the scrollbar direction that will be used to provide the timeline for a named view progress timeline animation, which is progressed through based on the change in visibility of an element (known as the subject) inside a scrollable element (scroller). view-timeline-axis is set on the subject. See CSS scroll-driven animations for more details.",
		},
		{
			name: "view-timeline-inset",
			status: "experimental",
			syntax: "[ [ auto | <length-percentage> ]{1,2} ]#",
			relevance: 50,
			browsers: ["E115", "C115", "CA115", "O101"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/view-timeline-inset",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The view-timeline-inset CSS property is used to specify one or two values representing an adjustment to the position of the scrollport (see Scroll container for more details) in which the subject element of a named view progress timeline animation is deemed to be visible. Put another way, this allows you to specify start and/or end inset (or outset) values that offset the position of the timeline.",
		},
		{
			name: "view-timeline-name",
			status: "experimental",
			syntax: "[ none | <dashed-ident> ]#",
			relevance: 50,
			browsers: ["E115", "C115", "CA115", "O101"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/view-timeline-name",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The view-timeline-name CSS property is used to define the name of a named view progress timeline, which is progressed through based on the change in visibility of an element (known as the subject) inside a scrollable element (scroller). view-timeline is set on the subject.",
		},
		{
			name: "view-transition-class",
			syntax: "none | <custom-ident>+",
			relevance: 50,
			browsers: ["E125", "FFpreview", "S18.2", "SM18.2", "C125", "CA125", "O111"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/view-transition-class",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The view-transition-class CSS property provides the selected elements with an identifying class (a custom-ident), providing an additional method of styling the view transitions for those elements.",
		},
		{
			name: "view-transition-name",
			syntax: "none | <custom-ident>",
			relevance: 50,
			browsers: ["E111", "FFpreview", "S18", "SM18", "C111", "CA111", "O97"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/view-transition-name",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The view-transition-name CSS property provides the selected element with a distinct identifying name (a custom-ident) and causes it to participate in a separate view transition from the root view transition — or no view transition if the none value is specified.",
		},
		{
			name: "white-space",
			syntax: "normal | pre | pre-wrap | pre-line | <'white-space-collapse'> || <'text-wrap-mode'>",
			relevance: 90,
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE5.5", "O4"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/white-space",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Specifies how whitespace is handled in an element.",
		},
		{
			name: "white-space-collapse",
			syntax: "collapse | preserve | preserve-breaks | preserve-spaces | break-spaces",
			values: [
				{
					name: "collapse",
				},
				{
					name: "preserve",
				},
				{
					name: "preserve-breaks",
				},
				{
					name: "preserve-spaces",
				},
				{
					name: "break-spaces",
				},
			],
			relevance: 50,
			browsers: ["E114", "FF124", "FFA124", "S17.4", "SM17.4", "C114", "CA114", "O100"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/white-space-collapse",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2024-03-19",
			},
			description: "The white-space-collapse CSS property controls how white space inside an element is collapsed.",
		},
		{
			name: "x",
			syntax: "<length> | <percentage>",
			relevance: 51,
			browsers: ["E79", "FF69", "FFA79", "S9", "SM9", "C42", "CA42", "O29"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/x",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-07-28",
				baseline_high_date: "2023-01-28",
			},
			description:
				"The x CSS property defines the x-axis coordinate of the top left corner of the SVG rect shape, image image, foreignObject viewport or nested svg viewport relative to the nearest <svg> ancestor's user coordinate system. If present, it overrides the element's x attribute.",
		},
		{
			name: "y",
			syntax: "<length> | <percentage>",
			relevance: 51,
			browsers: ["E79", "FF69", "FFA79", "S9", "SM9", "C42", "CA42", "O29"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/y",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-07-28",
				baseline_high_date: "2023-01-28",
			},
			description:
				"The y CSS property defines the y-axis coordinate of the top left corner of the SVG rect shape, image image, foreignObject viewport and nested svg viewport relative to the nearest <svg> ancestor's user coordinate system. If present, it overrides the element's y attribute.",
		},
		{
			name: "ascent-override",
			atRule: "@font-face",
			syntax: "normal | <percentage>",
			relevance: 50,
			description: "Describes the ascent metric of a font.",
		},
		{
			name: "descent-override",
			atRule: "@font-face",
			syntax: "normal | <percentage>",
			relevance: 50,
			description: "Describes the descent metric of a font.",
		},
		{
			name: "font-display",
			atRule: "@font-face",
			syntax: "auto | block | swap | fallback | optional",
			values: [
				{
					name: "auto",
				},
				{
					name: "block",
				},
				{
					name: "swap",
				},
				{
					name: "fallback",
				},
				{
					name: "optional",
				},
			],
			relevance: 75,
			description:
				"The font-display descriptor determines how a font face is displayed based on whether and when it is downloaded and ready to use.",
		},
		{
			name: "line-gap-override",
			atRule: "@font-face",
			syntax: "normal | <percentage>",
			relevance: 50,
			description: "Describes the line-gap metric of a font.",
		},
		{
			name: "size-adjust",
			atRule: "@font-face",
			syntax: "<percentage>",
			relevance: 50,
			description: "A multiplier for glyph outlines and metrics of a font.",
		},
		{
			name: "base-palette",
			atRule: "@font-palette-values",
			syntax: "light | dark | <integer [0,∞]>",
			relevance: 50,
			description:
				"The base-palette CSS descriptor is used to specify the name or index of a pre-defined palette to be used for creating a new palette. If the specified base-palette does not exist, then the palette defined at index 0 will be used.",
		},
		{
			name: "override-colors",
			atRule: "@font-palette-values",
			syntax: "[ <integer [0,∞]> <color> ]#",
			relevance: 50,
			description:
				"The override-colors CSS descriptor is used to override colors in the chosen base-palette for a color font.",
		},
		{
			name: "bleed",
			atRule: "@page",
			syntax: "auto | <length>",
			relevance: 50,
			description:
				"The bleed CSS at-rule descriptor, used with the @page at-rule, specifies the extent of the page bleed area outside the page box. This property only has effect if crop marks are enabled using the marks property.",
		},
		{
			name: "marks",
			atRule: "@page",
			syntax: "none | [ crop || cross ]",
			relevance: 50,
			description:
				"The marks CSS at-rule descriptor, used with the @page at-rule, adds crop and/or cross marks to the presentation of the document. Crop marks indicate where the page should be cut. Cross marks are used to align sheets.",
		},
		{
			name: "page-orientation",
			atRule: "@page",
			syntax: "upright | rotate-left | rotate-right ",
			relevance: 50,
			description:
				"The page-orientation CSS descriptor for the @page at-rule controls the rotation of a printed page. It handles the flow of content across pages when the orientation of a page is changed. This behavior differs from the size descriptor in that a user can define the direction in which to rotate the page.",
		},
		{
			name: "inherits",
			atRule: "@property",
			syntax: "true | false",
			values: [
				{
					name: "true",
				},
				{
					name: "false",
				},
			],
			relevance: 50,
			description:
				"Specifies the inherit flag of the custom property registration represented by the @property rule, controlling whether or not the property inherits by default.",
		},
		{
			name: "initial-value",
			atRule: "@property",
			syntax: "<declaration-value>?",
			relevance: 50,
			description:
				"Specifies the initial value of the custom property registration represented by the @property rule, controlling the property’s initial value.",
		},
		{
			name: "syntax",
			atRule: "@property",
			syntax: "<string>",
			relevance: 51,
			description:
				"Specifies the syntax of the custom property registration represented by the @property rule, controlling how the property’s value is parsed at computed value time.",
		},
		{
			name: "navigation",
			atRule: "@view-transition",
			syntax: "auto | none",
			values: [
				{
					name: "auto",
				},
				{
					name: "none",
				},
			],
			relevance: 50,
			description: "",
		},
		{
			name: "types",
			atRule: "@view-transition",
			syntax: "none | <custom-ident>+",
			relevance: 50,
			description: "",
		},
	],
	atDirectives: [
		{
			name: "@charset",
			browsers: ["E12", "FF1.5", "FFA4", "S4", "SM4", "C2", "CA18", "IE5.5", "O9"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/@charset",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Defines character set of the document.",
		},
		{
			name: "@counter-style",
			browsers: ["E91", "FF33", "FFA33", "S17", "SM17", "C91", "CA91", "O77"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/@counter-style",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-09-18",
			},
			description: "Defines a custom counter style.",
		},
		{
			name: "@font-face",
			browsers: ["E12", "FF3.5", "FFA4", "S3.1", "SM2", "C1", "CA18", "IE4", "O10"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/@font-face",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Allows for linking to fonts that are automatically activated when needed. This permits authors to work around the limitation of 'web-safe' fonts, allowing for consistent rendering independent of the fonts available in a given user's environment.",
		},
		{
			name: "@font-feature-values",
			browsers: ["E111", "FF34", "FFA34", "S9.1", "SM9.3", "C111", "CA111", "O97"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/@font-feature-values",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-03-13",
			},
			description: "Defines named values for the indices used to select alternate glyphs for a given font family.",
		},
		{
			name: "@import",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE5.5", "O3.5"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/@import",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Includes content of another file.",
		},
		{
			name: "@keyframes",
			browsers: ["E12", "FF16", "FFA16", "S9", "SM9", "C43", "CA43", "IE10", "O30"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/@keyframes",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description: "Defines set of animation key frames.",
		},
		{
			name: "@layer",
			browsers: ["E99", "FF97", "FFA97", "S15.4", "SM15.4", "C99", "CA99", "O85"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/@layer",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-03-14",
				baseline_high_date: "2024-09-14",
			},
			description: "Declare a cascade layer and the order of precedence in case of multiple cascade layers.",
		},
		{
			name: "@media",
			browsers: ["E12", "FF1", "FFA4", "S3", "SM1", "C1", "CA18", "IE6", "O9.2"],
			descriptors: [
				{
					name: "width",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-width",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/width",
						},
					],
					type: "range",
					syntax: "<length>",
					description:
						"The width CSS media feature can be used to test the width of the viewport (or the page box, for paged media).",
					browsers: ["E12", "FF2", "FFA4", "S3", "SM1", "C1", "CA18", "IE9", "O10"],
					baseline: {
						status: "high",
						baseline_low_date: "2015-07-29",
						baseline_high_date: "2018-01-29",
					},
				},
				{
					name: "height",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-height",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/height",
						},
					],
					type: "range",
					syntax: "<length>",
					description:
						"The height CSS media feature can be used to apply styles based on the height of the viewport (or the page box, for paged media).",
					browsers: ["E12", "FF2", "FFA4", "S3", "SM1", "C1", "CA18", "IE9", "O10"],
					baseline: {
						status: "high",
						baseline_low_date: "2015-07-29",
						baseline_high_date: "2018-01-29",
					},
				},
				{
					name: "aspect-ratio",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-aspect-ratio",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/aspect-ratio",
						},
					],
					type: "range",
					syntax: "<ratio>",
					description: "The aspect-ratio CSS media feature can be used to test the aspect ratio of the viewport.",
					browsers: ["E12", "FF3.5", "FFA4", "S5", "SM4.2", "C3", "CA18", "IE9", "O10"],
					baseline: {
						status: "high",
						baseline_low_date: "2015-07-29",
						baseline_high_date: "2018-01-29",
					},
				},
				{
					name: "orientation",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-orientation",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/orientation",
						},
					],
					type: "discrete",
					syntax: "portrait | landscape",
					values: [
						{
							name: "portrait",
							description:
								"The orientation media feature is portrait when the value of the height media feature is greater than or equal to the value of the width media feature.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-orientation-portrait",
								},
							],
						},
						{
							name: "landscape",
							description: "Otherwise orientation is landscape.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-orientation-landscape",
								},
							],
						},
					],
					description:
						"The orientation CSS media feature can be used to test the orientation of the viewport (or the page box, for paged media).",
					browsers: ["E12", "FF2", "FFA4", "S5", "SM4.2", "C3", "CA18", "IE9", "O10.6"],
					baseline: {
						status: "high",
						baseline_low_date: "2015-07-29",
						baseline_high_date: "2018-01-29",
					},
				},
				{
					name: "overflow-block",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-overflow-block",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/overflow-block",
						},
					],
					type: "discrete",
					syntax: "none | scroll | paged",
					values: [
						{
							name: "none",
							description:
								"There is no affordance for overflow in the block axis; any overflowing content is simply not displayed. Examples: billboards",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-overflow-block-none",
								},
							],
						},
						{
							name: "scroll",
							description:
								"Overflowing content in the block axis is exposed by allowing users to scroll to it. Examples: computer screens",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-overflow-block-scroll",
								},
							],
						},
						{
							name: "paged",
							description:
								"Content is broken up into discrete pages; content that overflows one page in the block axis is displayed on the following page. Examples: printers, ebook readers",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-overflow-block-paged",
								},
							],
						},
					],
					description:
						"The overflow-block CSS media feature can be used to test how the output device handles content that overflows the initial containing block along the block axis.",
					browsers: ["E113", "FF66", "FFA66", "S17", "SM17", "C113", "CA113", "O99"],
					baseline: {
						status: "low",
						baseline_low_date: "2023-09-18",
					},
				},
				{
					name: "overflow-inline",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-overflow-inline",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/overflow-inline",
						},
					],
					type: "discrete",
					syntax: "none | scroll",
					values: [
						{
							name: "none",
							description:
								"There is no affordance for overflow in the inline axis; any overflowing content is simply not displayed.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-overflow-inline-none",
								},
							],
						},
						{
							name: "scroll",
							description: "Overflowing content in the inline axis is exposed by allowing users to scroll to it.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-overflow-inline-scroll",
								},
							],
						},
					],
					description:
						"The overflow-inline CSS media feature can be used to test how the output device handles content that overflows the initial containing block along the inline axis.",
					browsers: ["E113", "FF66", "FFA66", "S17", "SM17", "C113", "CA113", "O99"],
					baseline: {
						status: "low",
						baseline_low_date: "2023-09-18",
					},
				},
				{
					name: "horizontal-viewport-segments",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-horizontal-viewport-segments",
						},
					],
					type: "range",
					syntax: "<integer>",
					description: "",
				},
				{
					name: "vertical-viewport-segments",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-vertical-viewport-segments",
						},
					],
					type: "range",
					syntax: "<integer>",
					description: "",
				},
				{
					name: "display-mode",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-display-mode",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/display-mode",
						},
					],
					type: "discrete",
					syntax: "fullscreen | standalone | minimal-ui | browser | picture-in-picture",
					values: [
						{
							name: "fullscreen",
							description:
								"The browsing context is displayed with browser UI elements hidden and takes up the entirety of the available display area. The fullscreen context may have been caused by the fullscreen display mode in the application manifest, by the requestFullscreen() method of the Fullscreen API, or through some other means (such as the user manually activating fullscreen mode using the user agent’s built-in controls). Corresponds to the fullscreen display mode.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-display-mode-fullscreen",
								},
							],
						},
						{
							name: "standalone",
							description: "The standalone display mode is in use. Only applicable in an application context.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-display-mode-standalone",
								},
							],
						},
						{
							name: "minimal-ui",
							description: "The minimal-ui display mode is in use. Only applicable in an application context.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-display-mode-minimal-ui",
								},
							],
						},
						{
							name: "browser",
							description:
								"The browsing context is displayed using the platform-specific convention for opening hyperlinks in the user agent (e.g., in a browser tab or web browser window with controls such as an address bar). This should be used for non-application contexts where no other display mode is appropriate. Corresponds to the browser display mode.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-display-mode-browser",
								},
							],
						},
						{
							name: "picture-in-picture",
							description:
								'This mode allows users to continue consuming media while they interact with other sites or applications on their device. The browsing context is displayed in a floating and always-on-top window. A user agent may include other platform specific UI elements, such as "back-to-tab" and "site information" buttons or whatever is customary on the platform and user agent.',
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-display-mode-picture-in-picture",
								},
							],
						},
					],
					description:
						"The display-mode CSS media feature can be used to test whether a web app is being displayed in a normal browser tab or in some alternative way, such as a standalone app or fullscreen mode.",
					browsers: ["E79", "FF47", "S13", "SM12.2", "C42", "CA42", "O29"],
					baseline: {
						status: "false",
					},
				},
				{
					name: "resolution",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-resolution",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/resolution",
						},
					],
					type: "range",
					syntax: "<resolution> | infinite",
					values: [
						{
							name: "infinite",
							description:
								"For output mediums that have no physical constraints on resolution (such as outputting to vector graphics), this feature must match the infinite value. For the purpose of evaluating this media feature in the range context, infinite must be treated as larger than any possible <resolution>. (That is, a query like (resolution > 1000dpi) will be true for an infinite media.)",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-resolution-infinite",
								},
							],
						},
					],
					description: "The resolution CSS media feature can be used to test the pixel density of the output device.",
					browsers: ["E12", "FF8", "FFA8", "S16", "SM16", "C29", "CA29", "IE9", "O16"],
					baseline: {
						status: "high",
						baseline_low_date: "2022-09-12",
						baseline_high_date: "2025-03-12",
					},
				},
				{
					name: "scan",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-scan",
						},
					],
					type: "discrete",
					syntax: "interlace | progressive",
					values: [
						{
							name: "interlace",
							description:
								"CRT and some types of plasma TV screens used “interlaced” rendering, where video frames alternated between specifying only the “even” lines on the screen and only the “odd” lines, exploiting various automatic mental image-correction abilities to produce smooth motion. This allowed them to simulate a higher FPS broadcast at half the bandwidth cost. When displaying on interlaced screens, authors should avoid very fast movement across the screen to avoid “combing”, and should ensure that details on the screen are wider than 1px to avoid “twitter”.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-scan-interlace",
								},
							],
						},
						{
							name: "progressive",
							description:
								"A screen using “progressive” rendering displays each screen fully, and needs no special treatment. Most modern screens, and all computer screens, use progressive rendering.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-scan-progressive",
								},
							],
						},
					],
					description:
						"The scan CSS media feature is used to apply CSS styles based on the scanning process of the output device.",
				},
				{
					name: "grid",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-grid",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/grid",
						},
					],
					type: "discrete",
					syntax: "<mq-boolean>",
					description:
						"The grid CSS media feature can be used to test whether the output device uses a grid-based screen.",
					browsers: ["E12", "FF2", "FFA4", "S3", "SM1", "C1", "CA18", "IE10", "O10"],
					baseline: {
						status: "high",
						baseline_low_date: "2015-07-29",
						baseline_high_date: "2018-01-29",
					},
				},
				{
					name: "update",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-update",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/update",
						},
					],
					type: "discrete",
					syntax: "none | slow | fast",
					values: [
						{
							name: "none",
							description:
								"Once it has been rendered, the layout can no longer be updated. Example: documents printed on paper.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-update-none",
								},
							],
						},
						{
							name: "slow",
							description:
								"The layout may change dynamically according to the usual rules of CSS, but the output device is not able to render or display changes quickly enough for them to be perceived as a smooth animation. Example: E-ink screens or severely under-powered devices.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-update-slow",
								},
							],
						},
						{
							name: "fast",
							description:
								"The layout may change dynamically according to the usual rules of CSS, and the output device is not unusually constrained in speed, so regularly-updating things like CSS Animations can be used. Example: computer screens.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-update-fast",
								},
							],
						},
					],
					description:
						"The update CSS media feature can be used to test how frequently (if at all) the output device is able to modify the appearance of content once rendered.",
					browsers: ["E113", "FF102", "FFA102", "S17", "SM17", "C113", "CA113", "O99"],
					baseline: {
						status: "low",
						baseline_low_date: "2023-09-18",
					},
				},
				{
					name: "environment-blending",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-environment-blending",
						},
					],
					type: "discrete",
					syntax: "opaque | additive | subtractive",
					values: [
						{
							name: "opaque",
							description:
								"The document is rendered on an opaque medium, such as a traditional monitor or paper. Black is dark and white is 100% light.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-environment-blending-opaque",
								},
							],
						},
						{
							name: "additive",
							description:
								"The display blends the colors of the canvas with the real world using additive mixing. Black is fully transparent and white is 100% light. For example: a head-up display in a car.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-environment-blending-additive",
								},
							],
						},
						{
							name: "subtractive",
							description:
								"The display blends the colors of the canvas with the real world using subtractive mixing. White is fully transparent and dark colors have the most contrast. For example: an LCD display embedded in a bathroom mirror.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-environment-blending-subtractive",
								},
							],
						},
					],
					description: "",
				},
				{
					name: "color",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-color",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/color",
						},
					],
					type: "range",
					syntax: "<integer>",
					description:
						"The color CSS media feature can be used to test the number of bits per color component (red, green, blue) of the output device.",
					browsers: ["E12", "FF2", "FFA4", "S3", "SM1", "C1", "CA18", "IE9", "O10"],
					baseline: {
						status: "high",
						baseline_low_date: "2015-07-29",
						baseline_high_date: "2018-01-29",
					},
				},
				{
					name: "color-index",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-color-index",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/color-index",
						},
					],
					type: "range",
					syntax: "<integer>",
					description:
						"The color-index CSS media feature can be used to test the number of entries in the output device's color lookup table.",
					browsers: ["E79", "S8", "SM8", "C29", "CA29", "O16"],
					baseline: {
						status: "false",
					},
				},
				{
					name: "monochrome",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-monochrome",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/monochrome",
						},
					],
					type: "range",
					syntax: "<integer>",
					description:
						"The monochrome CSS media feature can be used to test the number of bits per pixel in the monochrome frame buffer of the output device.",
					browsers: ["E79", "FF2", "FFA4", "S3", "SM1", "C1", "CA18", "O10"],
					baseline: {
						status: "high",
						baseline_low_date: "2020-01-15",
						baseline_high_date: "2022-07-15",
					},
				},
				{
					name: "color-gamut",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-color-gamut",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/color-gamut",
						},
					],
					type: "discrete",
					syntax: "srgb | p3 | rec2020",
					values: [
						{
							name: "srgb",
							description: "The UA and output device can support approximately the sRGB gamut or more.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-color-gamut-srgb",
								},
							],
						},
						{
							name: "p3",
							description:
								"The UA and output device can support approximately the gamut specified by the Display P3 [Display-P3] Color Space or more.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-color-gamut-p3",
								},
							],
						},
						{
							name: "rec2020",
							description:
								"The UA and output device can support approximately the gamut specified by the ITU-R Recommendation BT.2020 Color Space or more.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-color-gamut-rec2020",
								},
							],
						},
					],
					description:
						"The color-gamut CSS media feature is used to apply CSS styles based on the approximate range of color gamut supported by the user agent and the output device.",
					browsers: ["E79", "FF110", "FFA110", "S10", "SM10", "C58", "CA58", "O45"],
					baseline: {
						status: "low",
						baseline_low_date: "2023-02-14",
					},
				},
				{
					name: "dynamic-range",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-dynamic-range",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/dynamic-range",
						},
					],
					type: "discrete",
					syntax: "standard | high",
					values: [
						{
							name: "high",
							description:
								"The user agent and the output device fulfill all of the following criteria: they support a high peak brightness they support a high contrast ratio the color depth is greater than 24 bit or 8 bit per color component of RGB",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-dynamic-range-high",
								},
							],
						},
						{
							name: "standard",
							description: "This value matches on any visual device, and not on devices lacking visual capabilities.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-dynamic-range-standard",
								},
							],
						},
					],
					description:
						"The dynamic-range CSS media feature can be used to test the combination of brightness, contrast ratio, and color depth that are supported by the user agent and the output device.",
					browsers: ["E98", "FF100", "FFA100", "S13.1", "SM13.4", "C98", "CA98", "O84"],
					baseline: {
						status: "high",
						baseline_low_date: "2022-05-03",
						baseline_high_date: "2024-11-03",
					},
				},
				{
					name: "inverted-colors",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-inverted-colors",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/inverted-colors",
						},
					],
					type: "discrete",
					syntax: "none | inverted",
					values: [
						{
							name: "none",
							description: "Colors are displayed normally.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-inverted-colors-none",
								},
							],
						},
						{
							name: "inverted",
							description:
								"All pixels within the displayed area have been inverted. This value must not match if the user agent has done some kind of content aware inversion such as one that preserves the images.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-inverted-colors-inverted",
								},
							],
						},
					],
					description:
						"The inverted-colors CSS media feature is used to test if the user agent or the underlying operating system has inverted all colors.",
					browsers: ["S9.1", "SM10"],
					baseline: {
						status: "false",
					},
				},
				{
					name: "pointer",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-pointer",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/pointer",
						},
					],
					type: "discrete",
					syntax: "none | coarse | fine",
					values: [
						{
							name: "none",
							description: "The primary input mechanism of the device does not include a pointing device.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-pointer-none",
								},
							],
						},
						{
							name: "coarse",
							description:
								"The primary input mechanism of the device includes a pointing device of limited accuracy. Examples include touchscreens and motion-detection sensors (like the Kinect peripheral for the Xbox.)",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-pointer-coarse",
								},
							],
						},
						{
							name: "fine",
							description:
								"The primary input mechanism of the device includes an accurate pointing device. Examples include mice, touchpads, and drawing styluses.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-pointer-fine",
								},
							],
						},
					],
					description:
						"The pointer CSS media feature tests whether the user has a pointing device (such as a mouse), and if so, how accurate the primary pointing device is.",
					browsers: ["E12", "FF64", "FFA64", "S9", "SM9", "C41", "CA50", "O28"],
					baseline: {
						status: "high",
						baseline_low_date: "2018-12-11",
						baseline_high_date: "2021-06-11",
					},
				},
				{
					name: "hover",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-hover",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/hover",
						},
					],
					type: "discrete",
					syntax: "none | hover",
					values: [
						{
							name: "none",
							description:
								"Indicates that the primary pointing device can’t hover, or that there is no pointing device. Examples include touchscreens and screens that use a basic drawing stylus. Pointing devices that can hover, but for which doing so is inconvenient and not part of the normal way they are used, also match this value. For example, a touchscreen where a long press is treated as hovering would match hover: none.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-hover-none",
								},
							],
						},
						{
							name: "hover",
							description:
								"Indicates that the primary pointing device can easily hover over parts of the page. Examples include mice and devices that physically point at the screen, like the Nintendo Wii controller.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-hover-hover",
								},
							],
						},
					],
					description:
						"The hover CSS media feature can be used to test whether the user's primary input mechanism can hover over elements.",
					browsers: ["E12", "FF64", "FFA64", "S9", "SM9", "C38", "CA50", "O25"],
					baseline: {
						status: "high",
						baseline_low_date: "2018-12-11",
						baseline_high_date: "2021-06-11",
					},
				},
				{
					name: "any-pointer",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-any-pointer",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/any-pointer",
						},
					],
					type: "discrete",
					syntax: "none | coarse | fine",
					description:
						"The any-pointer CSS media feature tests whether the user has any pointing device (such as a mouse), and if so, how accurate it is.",
					browsers: ["E12", "FF64", "FFA64", "S9", "SM9", "C41", "CA41", "O28"],
					baseline: {
						status: "high",
						baseline_low_date: "2018-12-11",
						baseline_high_date: "2021-06-11",
					},
				},
				{
					name: "any-hover",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-any-hover",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/any-hover",
						},
					],
					type: "discrete",
					syntax: "none | hover",
					description:
						"The any-hover CSS media feature can be used to test whether any available input mechanism can hover over elements.",
					browsers: ["E16", "FF64", "FFA64", "S9", "SM9", "C41", "CA41", "O28"],
					baseline: {
						status: "high",
						baseline_low_date: "2018-12-11",
						baseline_high_date: "2021-06-11",
					},
				},
				{
					name: "nav-controls",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-nav-controls",
						},
					],
					type: "discrete",
					syntax: "none | back",
					values: [
						{
							name: "none",
							description:
								"The user agent does not have any obviously discoverable navigation controls, and in particular none that cause the user agent to move back one page in the joint session history.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-nav-controls-none",
								},
							],
						},
						{
							name: "back",
							description:
								"The user agent provides navigation controls, including at least an obviously discoverable control causing the user agent to move back one page in the joint session history (typically, a “back” button).",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-nav-controls-back",
								},
							],
						},
					],
					description: "",
				},
				{
					name: "video-color-gamut",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-video-color-gamut",
						},
					],
					type: "discrete",
					syntax: "srgb | p3 | rec2020",
					description: "",
				},
				{
					name: "video-dynamic-range",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-video-dynamic-range",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/video-dynamic-range",
						},
					],
					type: "discrete",
					syntax: "standard | high",
					description:
						"The video-dynamic-range CSS media feature can be used to test the combination of brightness, contrast ratio, and color depth that are supported by the video plane of the user agent and the output device.",
					browsers: ["FF100", "FFA100", "O84"],
					baseline: {
						status: "false",
					},
				},
				{
					name: "scripting",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-scripting",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/scripting",
						},
					],
					type: "discrete",
					syntax: "none | initial-only | enabled",
					values: [
						{
							name: "enabled",
							description:
								"Indicates that the user agent supports scripting of the page, and that scripting in the current document is enabled for the lifetime of the document.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-scripting-enabled",
								},
							],
						},
						{
							name: "initial-only",
							description:
								"Indicates that the user agent supports scripting of the page, and that scripting in the current document is enabled during the initial page load, but is not supported afterwards. Examples are printed pages, or pre-rendering network proxies that render a page on a server and send a nearly-static version of the page to the user. Should there be an explicit minimum threshold to meet before a UA is allowed to claim initial-only? Having one would mean authors would know what they can depend on, and could tailor their scripts accordingly. On the other hand, pinpointing that threshold is difficult: if it is set too low, the scripting facilities that authors can depend on may be to constrained to be practical, even though actual UAs may potentially all support significantly more. But trying to set it higher may cause us to exclude UAs that do support scripting at loading time, but restrict it in some cases based on complex heuristics. For instance, conservative definitions likely include at least running all inline scripts and firing the DOMContentLoaded event. But it does not seem useful for authors to constrain themselves to this if most (or maybe all) initial-only UAs also load external scripts (including async and defer) and fire the load event. On the other hand, requiring external scripts to be loaded and the load event to be fired could exclude UAs like Opera mini, which typically do run them, but may decide not to based on timeouts and other heuristics. [Issue #503]",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-scripting-initial-only",
								},
							],
						},
						{
							name: "none",
							description:
								"Indicates that the user agent will not run scripts for this document; either it doesn’t support a scripting language, or the support isn’t active for the current document.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-scripting-none",
								},
							],
						},
					],
					description:
						"The scripting CSS media feature can be used to test whether scripting (such as JavaScript) is available.",
					browsers: ["E120", "FF113", "FFA113", "S17", "SM17", "C120", "CA120", "O106"],
					baseline: {
						status: "low",
						baseline_low_date: "2023-12-07",
					},
				},
				{
					name: "prefers-reduced-motion",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-prefers-reduced-motion",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-motion",
						},
					],
					type: "discrete",
					syntax: "no-preference | reduce",
					values: [
						{
							name: "no-preference",
							description:
								"Indicates that the user has made no preference known to the system. This keyword value evaluates as false in the boolean context.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-prefers-reduced-motion-no-preference",
								},
							],
						},
						{
							name: "reduce",
							description:
								"Indicates that user has notified the system that they prefer an interface that removes or replaces the types of motion-based animation that either trigger discomfort for those with vestibular motion sensitivity, or distraction for those with attention deficits.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-prefers-reduced-motion-reduce",
								},
							],
						},
					],
					description:
						"The prefers-reduced-motion CSS media feature is used to detect if a user has enabled a setting on their device to minimize the amount of non-essential motion. The setting is used to convey to the browser on the device that the user prefers an interface that removes, reduces, or replaces motion-based animations.",
					browsers: ["E79", "FF63", "FFA64", "S10.1", "SM10.3", "C74", "CA74", "O62"],
					baseline: {
						status: "high",
						baseline_low_date: "2020-01-15",
						baseline_high_date: "2022-07-15",
					},
				},
				{
					name: "prefers-reduced-transparency",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-prefers-reduced-transparency",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-transparency",
						},
					],
					type: "discrete",
					syntax: "no-preference | reduce",
					values: [
						{
							name: "no-preference",
							description:
								"Indicates that the user has made no preference known to the system. This keyword value evaluates as false in the boolean context.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-prefers-reduced-transparency-no-preference",
								},
							],
						},
						{
							name: "reduce",
							description:
								"Indicates that user has notified the system that they prefer an interface that minimizes the amount of transparent or translucent layer effects.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-prefers-reduced-transparency-reduce",
								},
							],
						},
					],
					description:
						"The prefers-reduced-transparency CSS media feature is used to detect if a user has enabled a setting on their device to reduce the transparent or translucent layer effects used on the device. Switching on such a setting can help improve contrast and readability for some users.",
					status: "experimental",
					browsers: ["E118", "C118", "CA118", "O104"],
					baseline: {
						status: "false",
					},
				},
				{
					name: "prefers-contrast",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-prefers-contrast",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/prefers-contrast",
						},
					],
					type: "discrete",
					syntax: "no-preference | less | more | custom",
					values: [
						{
							name: "no-preference",
							description:
								"Indicates that the user has made no preference known to the system. This keyword value evaluates as false in the boolean context.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-prefers-contrast-no-preference",
								},
							],
						},
						{
							name: "less",
							description:
								"Indicates that user has notified the system that they prefer an interface that has a lower level of contrast.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-prefers-contrast-less",
								},
							],
						},
						{
							name: "more",
							description:
								"Indicates that user has notified the system that they prefer an interface that has a higher level of contrast.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-prefers-contrast-more",
								},
							],
						},
						{
							name: "custom",
							description:
								"Indicates that the user has indicated wanting a specific set of colors to be used, but the contrast implied by these particular colors is such that neither more nor less match. A user calling for cyan text over a rust background is not—​at least in terms of luminosity—​expressing a need for particularly high or low contrast, but this is not a lack of a preference either.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-prefers-contrast-custom",
								},
							],
						},
					],
					description:
						"The prefers-contrast CSS media feature is used to detect whether the user has requested the web content to be presented with a lower or higher contrast.",
					browsers: ["E96", "FF101", "FFA101", "S14.1", "SM14.5", "C96", "CA96", "O82"],
					baseline: {
						status: "high",
						baseline_low_date: "2022-05-31",
						baseline_high_date: "2024-11-30",
					},
				},
				{
					name: "forced-colors",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-forced-colors",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/forced-colors",
						},
					],
					type: "discrete",
					syntax: "none | active",
					values: [
						{
							name: "active",
							description:
								"Indicates that forced colors mode is active: the user agent enforces a user-chosen limited color palette on the page, The UA will provide the color palette to authors through the CSS system color keywords. See CSS Color Adjustment 1 § 3 Forced Color Palettes for details. This does not necessarily indicate a preference for more contrast. The colors have been forcibly adjusted to match the preference of the user, but that preference can be for less or more contrast, or some other arrangement that is neither particularly low or high contrast. In addition to forced-colors: active, the user agent must also match one of prefers-contrast: more or prefers-contrast: less if it can determine that the forced color palette chosen by the user has a particularly high or low contrast, and must make prefers-contrast: custom match otherwise. Similarly, if the forced color palette chosen by the user fits within one of the color schemes described by prefers-color-scheme, the corresponding value must also match.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-forced-colors-active",
								},
							],
						},
						{
							name: "none",
							description: "Forced colors mode is not active.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-forced-colors-none",
								},
							],
						},
					],
					description:
						"The forced-colors CSS media feature is used to detect if the user agent has enabled a forced colors mode where it enforces a user-chosen limited color palette on the page. An example of a forced colors mode is Windows High Contrast mode.",
					browsers: ["E79", "FF89", "FFA89", "S16", "SM16", "C89", "CA89", "O75"],
					baseline: {
						status: "high",
						baseline_low_date: "2022-09-12",
						baseline_high_date: "2025-03-12",
					},
				},
				{
					name: "prefers-color-scheme",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-prefers-color-scheme",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/prefers-color-scheme",
						},
					],
					type: "discrete",
					syntax: "light | dark",
					values: [
						{
							name: "light",
							description:
								'Indicates that user has expressed the preference for a page that has a light theme (dark text on light background), or has not expressed an active preference (and thus should receive the "web default" of a light theme).',
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-prefers-color-scheme-light",
								},
							],
						},
						{
							name: "dark",
							description:
								"Indicates that user has expressed the preference for a page that has a dark theme (light text on dark background).",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-prefers-color-scheme-dark",
								},
							],
						},
					],
					description:
						"The prefers-color-scheme CSS media feature is used to detect if a user has requested light or dark color themes.",
					browsers: ["E79", "FF67", "FFA67", "S12.1", "SM13", "C76", "CA76", "O62"],
					baseline: {
						status: "high",
						baseline_low_date: "2020-01-15",
						baseline_high_date: "2022-07-15",
					},
				},
				{
					name: "prefers-reduced-data",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-prefers-reduced-data",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-data",
						},
					],
					type: "discrete",
					syntax: "no-preference | reduce",
					values: [
						{
							name: "no-preference",
							description:
								"Indicates that the user has made no preference known to the system. This keyword value evaluates as false in the boolean context.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-prefers-reduced-data-no-preference",
								},
							],
						},
						{
							name: "reduce",
							description: "Indicates that user has expressed the preference for lightweight alternate content.",
							references: [
								{
									name: "W3C Reference",
									url: "https://drafts.csswg.org/mediaqueries-5/#valdef-media-prefers-reduced-data-reduce",
								},
							],
						},
					],
					description:
						"The prefers-reduced-data CSS media feature is used to detect if the user has requested the web content that consumes less internet traffic.",
					status: "experimental",
					browsers: ["O71"],
					baseline: {
						status: "false",
					},
				},
				{
					name: "device-width",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-device-width",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/device-width",
						},
					],
					type: "range",
					syntax: "<length>",
					description:
						"The device-width CSS media feature can be used to test the width of an output device's rendering surface.",
					status: "obsolete",
					browsers: ["E12", "FF2", "FFA4", "S3", "SM1", "C1", "CA18", "IE9", "O10"],
					baseline: {
						status: "false",
					},
				},
				{
					name: "device-height",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-device-height",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/device-height",
						},
					],
					type: "range",
					syntax: "<length>",
					description:
						"The device-height CSS media feature can be used to test the height of an output device's rendering surface.",
					status: "obsolete",
					browsers: ["E12", "FF2", "FFA4", "S3", "SM1", "C1", "CA18", "IE9", "O10"],
					baseline: {
						status: "false",
					},
				},
				{
					name: "device-aspect-ratio",
					references: [
						{
							name: "W3C Reference",
							url: "https://drafts.csswg.org/mediaqueries-5/#descdef-media-device-aspect-ratio",
						},
						{
							name: "MDN Reference",
							url: "https://developer.mozilla.org/docs/Web/CSS/@media/device-aspect-ratio",
						},
					],
					type: "range",
					syntax: "<ratio>",
					description:
						"The device-aspect-ratio CSS media feature can be used to test the width-to-height aspect ratio of an output device.",
					status: "obsolete",
					browsers: ["E12", "FF2", "FFA4", "S3", "SM1", "C1", "CA18", "IE9", "O10"],
					baseline: {
						status: "false",
					},
				},
			],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/@media",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Defines a stylesheet for a particular media type.",
		},
		{
			name: "@-moz-document",
			browsers: ["FF1.8"],
			description:
				"Gecko-specific at-rule that restricts the style rules contained within it based on the URL of the document.",
		},
		{
			name: "@-moz-keyframes",
			browsers: ["FF5"],
			description: "Defines set of animation key frames.",
		},
		{
			name: "@-ms-viewport",
			browsers: ["E", "IE10"],
			description: "Specifies the size, zoom factor, and orientation of the viewport.",
		},
		{
			name: "@namespace",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE9", "O8"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/@namespace",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Declares a prefix and associates it with a namespace name.",
		},
		{
			name: "@-o-keyframes",
			browsers: ["O12"],
			description: "Defines set of animation key frames.",
		},
		{
			name: "@-o-viewport",
			browsers: ["O11"],
			description: "Specifies the size, zoom factor, and orientation of the viewport.",
		},
		{
			name: "@page",
			browsers: ["E12", "FF19", "FFA19", "S18.2", "SM18.2", "C2", "CA18", "IE8", "O6"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/@page",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2024-12-11",
			},
			description: "Directive defines various page parameters.",
		},
		{
			name: "@property",
			browsers: ["E85", "FF128", "FFA128", "S16.4", "SM16.4", "C85", "CA85", "O71"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/@property",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2024-07-09",
			},
			description: "Describes the aspect of custom properties and variables.",
		},
		{
			name: "@supports",
			browsers: ["E12", "FF22", "FFA22", "S9", "SM9", "C28", "CA28", "O12.1"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/@supports",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-09-30",
				baseline_high_date: "2018-03-30",
			},
			description:
				"A conditional group rule whose condition tests whether the user agent supports CSS property:value pairs.",
		},
		{
			name: "@-webkit-keyframes",
			browsers: ["C", "S4"],
			description: "Defines set of animation key frames.",
		},
		{
			name: "@container",
			description:
				"The @container CSS at-rule is a conditional group rule that applies styles to a containment context.",
			browsers: ["E105", "FF110", "FFA110", "S16", "SM16", "C105", "CA105", "O91"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/@container",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-02-14",
			},
		},
		{
			name: "@document",
			description:
				"The @document CSS at-rule restricts the style rules contained within it based on the URL of the document. It is designed primarily for user-defined style sheets (see userchrome.org for more information), though it can be used on author-defined style sheets, too.",
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/@document",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "@font-palette-values",
			description:
				"The @font-palette-values CSS at-rule allows you to customize the default values of font-palette created by the font-maker.",
			browsers: ["E101", "FF107", "FFA107", "S15.4", "SM15.4", "C101", "CA101", "O87"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/@font-palette-values",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-11-15",
				baseline_high_date: "2025-05-15",
			},
		},
		{
			name: "@position-try",
			description:
				"The @position-try CSS at-rule is used to define a custom position try fallback option, which can be used to define positioning and alignment for anchor-positioned elements. One or more sets of position try fallback options can be applied to the anchored element via the position-try-fallbacks property or position-try shorthand. When the positioned element is moved to a position where it starts to overflow its containing block or the viewport, the browser will select the first position try fallback option it finds that places the positioned element fully back on-screen.",
			browsers: ["E125", "C125", "CA125", "O111"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/@position-try",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "@scope",
			description:
				"The @scope CSS at-rule enables you to select elements in specific DOM subtrees, targeting elements precisely without writing overly-specific selectors that are hard to override, and without coupling your selectors too tightly to the DOM structure.",
			browsers: ["E118", "S17.4", "SM17.4", "C118", "CA118", "O104"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/@scope",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "@starting-style",
			description:
				"The @starting-style CSS at-rule is used to define starting values for properties set on an element that you want to transition from when the element receives its first style update, i.e., when an element is first displayed on a previously loaded page.",
			browsers: ["E117", "FF129", "FFA129", "S17.5", "SM17.5", "C117", "CA117", "O103"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/@starting-style",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2024-08-06",
			},
		},
		{
			name: "@view-transition",
			description:
				"The @view-transition CSS at-rule is used to opt in the current and destination documents to undergo a view transition, in the case of a cross-document navigation.",
			browsers: ["E126", "S18.2", "SM18.2", "C126", "CA126", "O112"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/@view-transition",
				},
			],
			baseline: {
				status: "false",
			},
		},
	],
	pseudoClasses: [
		{
			name: ":active",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O5"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:active",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Applies while an element is being activated by the user. For example, between the times the user presses the mouse button and releases it.",
		},
		{
			name: ":any-link",
			browsers: ["E79", "FF50", "FFA50", "S9", "SM9", "C65", "CA65", "O52"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:any-link",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Represents an element that acts as the source anchor of a hyperlink. Applies to both visited and unvisited links.",
		},
		{
			name: ":checked",
			browsers: ["E12", "FF1", "FFA4", "S3.1", "SM2", "C1", "CA18", "IE9", "O9"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:checked",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Radio and checkbox elements can be toggled by the user. Some menu items are 'checked' when the user selects them. When such elements are toggled 'on' the :checked pseudo-class applies.",
		},
		{
			name: ":corner-present",
			browsers: ["C", "S5"],
			description: "Non-standard. Indicates whether or not a scrollbar corner is present.",
		},
		{
			name: ":decrement",
			browsers: ["C", "S5"],
			description:
				"Non-standard. Applies to buttons and track pieces. Indicates whether or not the button or track piece will decrement the view's position when used.",
		},
		{
			name: ":default",
			browsers: ["E79", "FF4", "FFA4", "S5", "SM5", "C10", "CA18", "O10"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:default",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"Applies to the one or more UI elements that are the default among a set of similar elements. Typically applies to context menu items, buttons, and select lists/menus.",
		},
		{
			name: ":disabled",
			browsers: ["E12", "FF1", "FFA4", "S3.1", "SM2", "C1", "CA18", "IE9", "O9"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:disabled",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Represents user interface elements that are in a disabled state; such elements have a corresponding enabled state.",
		},
		{
			name: ":double-button",
			browsers: ["C", "S5"],
			description:
				"Non-standard. Applies to buttons and track pieces. Applies when both buttons are displayed together at the same end of the scrollbar.",
		},
		{
			name: ":empty",
			browsers: ["E12", "FF1", "FFA4", "S3.1", "SM2", "C1", "CA18", "IE9", "O9.5"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:empty",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Represents an element that has no children at all.",
		},
		{
			name: ":enabled",
			browsers: ["E12", "FF1", "FFA4", "S3.1", "SM2", "C1", "CA18", "IE9", "O9"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:enabled",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Represents user interface elements that are in an enabled state; such elements have a corresponding disabled state.",
		},
		{
			name: ":end",
			browsers: ["C", "S5"],
			description:
				"Non-standard. Applies to buttons and track pieces. Indicates whether the object is placed after the thumb.",
		},
		{
			name: ":first",
			browsers: ["E12", "FF116", "FFA116", "S6", "SM6", "C18", "CA18", "IE8", "O9.2"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:first",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-08-01",
			},
			description:
				"When printing double-sided documents, the page boxes on left and right pages may be different. This can be expressed through CSS pseudo-classes defined in the  page context.",
		},
		{
			name: ":first-child",
			browsers: ["E12", "FF3", "FFA4", "S3.1", "SM4", "C4", "CA18", "IE7", "O9.5"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:first-child",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Same as :nth-child(1). Represents an element that is the first child of some other element.",
		},
		{
			name: ":first-of-type",
			browsers: ["E12", "FF3.5", "FFA4", "S3.1", "SM2", "C1", "CA18", "IE9", "O9.5"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:first-of-type",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Same as :nth-of-type(1). Represents an element that is the first sibling of its type in the list of children of its parent element.",
		},
		{
			name: ":focus",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE8", "O7"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:focus",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Applies while an element has the focus (accepts keyboard or mouse events, or other forms of input).",
		},
		{
			name: ":fullscreen",
			browsers: ["E12", "FF64", "FFA64", "S16.4", "C71", "CA71", "IE11", "O58"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:fullscreen",
				},
			],
			baseline: {
				status: "false",
			},
			description: "Matches any element that has its fullscreen flag set.",
		},
		{
			name: ":future",
			browsers: ["E79", "S7", "SM7", "C23", "CA25", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:future",
				},
			],
			baseline: {
				status: "false",
			},
			description: "Represents any element that is defined to occur entirely after a :current element.",
		},
		{
			name: ":horizontal",
			browsers: ["C", "S5"],
			description: "Non-standard. Applies to any scrollbar pieces that have a horizontal orientation.",
		},
		{
			name: ":host",
			browsers: ["E79", "FF63", "FFA63", "S10", "SM10", "C54", "CA54", "O41"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:host",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description: "When evaluated in the context of a shadow tree, matches the shadow tree's host element.",
		},
		{
			name: ":host",
			browsers: ["E79", "FF63", "FFA63", "S10", "SM10", "C54", "CA54", "O41"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:host",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description:
				"When evaluated in the context of a shadow tree, it matches the shadow tree's host element if the host element, in its normal context, matches the selector argument.",
		},
		{
			name: ":host-context",
			browsers: ["E79", "C54", "CA54", "O41"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:host-context",
				},
			],
			baseline: {
				status: "false",
			},
			description: "Tests whether there is an ancestor, outside the shadow tree, which matches a particular selector.",
		},
		{
			name: ":hover",
			browsers: ["E12", "FF1", "FFA4", "S2", "SM1", "C1", "CA18", "IE4", "O4"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:hover",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Applies while the user designates an element with a pointing device, but does not necessarily activate it. For example, a visual user agent could apply this pseudo-class when the cursor (mouse pointer) hovers over a box generated by the element.",
		},
		{
			name: ":increment",
			browsers: ["C", "S5"],
			description:
				"Non-standard. Applies to buttons and track pieces. Indicates whether or not the button or track piece will increment the view's position when used.",
		},
		{
			name: ":indeterminate",
			browsers: ["E12", "FF2", "FFA4", "S3", "SM1", "C1", "CA18", "IE10", "O9"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:indeterminate",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Applies to UI elements whose value is in an indeterminate state.",
		},
		{
			name: ":in-range",
			browsers: ["E13", "FF29", "FFA16", "S5.1", "SM5", "C10", "CA18", "O11"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:in-range",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-11-12",
				baseline_high_date: "2018-05-12",
			},
			description:
				"Used in conjunction with the min and max attributes, whether on a range input, a number field, or any other types that accept those attributes.",
		},
		{
			name: ":invalid",
			browsers: ["E12", "FF4", "FFA4", "S5", "SM5", "C10", "CA18", "IE10", "O10"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:invalid",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"An element is :valid or :invalid when it is, respectively, valid or invalid with respect to data validity semantics defined by a different specification.",
		},
		{
			name: ":lang",
			browsers: ["E12", "FF1", "FFA4", "S3.1", "SM2", "C1", "CA18", "IE8", "O8"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:lang",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Represents an element that is in language specified.",
		},
		{
			name: ":last-child",
			browsers: ["E12", "FF1", "FFA4", "S3.1", "SM2", "C1", "CA18", "IE9", "O9.5"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:last-child",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Same as :nth-last-child(1). Represents an element that is the last child of some other element.",
		},
		{
			name: ":last-of-type",
			browsers: ["E12", "FF3.5", "FFA4", "S3.1", "SM2", "C1", "CA18", "IE9", "O9.5"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:last-of-type",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Same as :nth-last-of-type(1). Represents an element that is the last sibling of its type in the list of children of its parent element.",
		},
		{
			name: ":left",
			browsers: ["E12", "S5", "SM4.2", "C6", "CA18", "IE8", "O9.2"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:left",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"When printing double-sided documents, the page boxes on left and right pages may be different. This can be expressed through CSS pseudo-classes defined in the  page context.",
		},
		{
			name: ":link",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM3.2", "C1", "CA18", "IE3", "O3.5"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:link",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Applies to links that have not yet been visited.",
		},
		{
			name: ":matches",
			browsers: ["S9"],
			description:
				"Takes a selector list as its argument. It represents an element that is represented by its argument.",
		},
		{
			name: ":-moz-any",
			browsers: ["FF4"],
			description:
				"Represents an element that is represented by the selector list passed as its argument. Standardized as :matches().",
		},
		{
			name: ":-moz-any-link",
			browsers: ["FF1"],
			description:
				"Represents an element that acts as the source anchor of a hyperlink. Applies to both visited and unvisited links.",
		},
		{
			name: ":-moz-broken",
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:-moz-broken",
				},
			],
			baseline: {
				status: "false",
			},
			description: "Non-standard. Matches elements representing broken images.",
		},
		{
			name: ":-moz-drag-over",
			browsers: ["FF1"],
			description: "Non-standard. Matches elements when a drag-over event applies to it.",
		},
		{
			name: ":-moz-first-node",
			browsers: ["FF72", "FFA79"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:-moz-first-node",
				},
			],
			baseline: {
				status: "false",
			},
			description: "Non-standard. Represents an element that is the first child node of some other element.",
		},
		{
			name: ":-moz-focusring",
			browsers: ["FF4"],
			description: "Non-standard. Matches an element that has focus and focus ring drawing is enabled in the browser.",
		},
		{
			name: ":-moz-full-screen",
			browsers: ["FF9"],
			description: "Matches any element that has its fullscreen flag set. Standardized as :fullscreen.",
		},
		{
			name: ":-moz-last-node",
			browsers: ["FF72", "FFA79"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:-moz-last-node",
				},
			],
			baseline: {
				status: "false",
			},
			description: "Non-standard. Represents an element that is the last child node of some other element.",
		},
		{
			name: ":-moz-loading",
			browsers: ["FF3"],
			description: "Non-standard. Matches elements, such as images, that haven't started loading yet.",
		},
		{
			name: ":-moz-only-whitespace",
			browsers: ["FF1", "FFA4"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:-moz-only-whitespace",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"The same as :empty, except that it additionally matches elements that only contain code points affected by whitespace processing. Standardized as :blank.",
		},
		{
			name: ":-moz-placeholder",
			browsers: ["FF4"],
			description: "Deprecated. Represents placeholder text in an input field. Use ::-moz-placeholder for Firefox 19+.",
		},
		{
			name: ":-moz-submit-invalid",
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:-moz-submit-invalid",
				},
			],
			baseline: {
				status: "false",
			},
			description: "Non-standard. Represents any submit button when the contents of the associated form are not valid.",
		},
		{
			name: ":-moz-suppressed",
			browsers: ["FF3"],
			description: "Non-standard. Matches elements representing images that have been blocked from loading.",
		},
		{
			name: ":-moz-ui-invalid",
			browsers: ["FF4"],
			description: "Non-standard. Represents any validated form element whose value isn't valid ",
		},
		{
			name: ":-moz-ui-valid",
			browsers: ["FF4"],
			description: "Non-standard. Represents any validated form element whose value is valid ",
		},
		{
			name: ":-moz-user-disabled",
			browsers: ["FF3"],
			description:
				"Non-standard. Matches elements representing images that have been disabled due to the user's preferences.",
		},
		{
			name: ":-moz-window-inactive",
			browsers: ["FF4"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:-moz-window-inactive",
				},
			],
			baseline: {
				status: "false",
			},
			description: "Non-standard. Matches elements in an inactive window.",
		},
		{
			name: ":-ms-fullscreen",
			browsers: ["IE11"],
			description: "Matches any element that has its fullscreen flag set.",
		},
		{
			name: ":-ms-input-placeholder",
			browsers: ["IE10"],
			description:
				"Represents placeholder text in an input field. Note: for Edge use the pseudo-element ::-ms-input-placeholder. Standardized as ::placeholder.",
		},
		{
			name: ":-ms-keyboard-active",
			browsers: ["IE10"],
			description:
				"Windows Store apps only. Applies one or more styles to an element when it has focus and the user presses the space bar.",
		},
		{
			name: ":-ms-lang",
			browsers: ["E", "IE10"],
			description:
				"Represents an element that is in the language specified. Accepts a comma separated list of language tokens.",
		},
		{
			name: ":no-button",
			browsers: ["C", "S5"],
			description: "Non-standard. Applies to track pieces. Applies when there is no button at that end of the track.",
		},
		{
			name: ":not",
			browsers: ["E12", "FF1", "FFA4", "S3.1", "SM2", "C1", "CA18", "IE9", "O9.5"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:not",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"The negation pseudo-class, :not(X), is a functional notation taking a simple selector (excluding the negation pseudo-class itself) as an argument. It represents an element that is not represented by its argument.",
		},
		{
			name: ":nth-child",
			browsers: ["E12", "FF3.5", "FFA4", "S3.1", "SM2", "C1", "CA18", "IE9", "O9.5"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:nth-child",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Represents an element that has an+b-1 siblings before it in the document tree, for any positive integer or zero value of n, and has a parent element.",
		},
		{
			name: ":nth-last-child",
			browsers: ["E12", "FF3.5", "FFA4", "S3.1", "SM2", "C4", "CA18", "IE9", "O9"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:nth-last-child",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Represents an element that has an+b-1 siblings after it in the document tree, for any positive integer or zero value of n, and has a parent element.",
		},
		{
			name: ":nth-last-of-type",
			browsers: ["E12", "FF3.5", "FFA4", "S3.1", "SM2", "C4", "CA18", "IE9", "O9.5"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:nth-last-of-type",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Represents an element that has an+b-1 siblings with the same expanded element name after it in the document tree, for any zero or positive integer value of n, and has a parent element.",
		},
		{
			name: ":nth-of-type",
			browsers: ["E12", "FF3.5", "FFA4", "S3.1", "SM2", "C1", "CA18", "IE9", "O9.5"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:nth-of-type",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Represents an element that has an+b-1 siblings with the same expanded element name before it in the document tree, for any zero or positive integer value of n, and has a parent element.",
		},
		{
			name: ":only-child",
			browsers: ["E12", "FF1.5", "FFA4", "S3.1", "SM2", "C2", "CA18", "IE9", "O9.5"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:only-child",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Represents an element that has a parent element and whose parent element has no other element children. Same as :first-child:last-child or :nth-child(1):nth-last-child(1), but with a lower specificity.",
		},
		{
			name: ":only-of-type",
			browsers: ["E12", "FF3.5", "FFA4", "S3.1", "SM2", "C1", "CA18", "IE9", "O9.5"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:only-of-type",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Matches every element that is the only child of its type, of its parent. Same as :first-of-type:last-of-type or :nth-of-type(1):nth-last-of-type(1), but with a lower specificity.",
		},
		{
			name: ":optional",
			browsers: ["E12", "FF4", "FFA4", "S5", "SM5", "C10", "CA18", "IE10", "O10"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:optional",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"A form element is :required or :optional if a value for it is, respectively, required or optional before the form it belongs to is submitted. Elements that are not form elements are neither required nor optional.",
		},
		{
			name: ":out-of-range",
			browsers: ["E13", "FF29", "FFA16", "S5.1", "SM5", "C10", "CA18", "O11"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:out-of-range",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-11-12",
				baseline_high_date: "2018-05-12",
			},
			description:
				"Used in conjunction with the min and max attributes, whether on a range input, a number field, or any other types that accept those attributes.",
		},
		{
			name: ":past",
			browsers: ["E79", "S7", "SM7", "C23", "CA25", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:past",
				},
			],
			baseline: {
				status: "false",
			},
			description: "Represents any element that is defined to occur entirely prior to a :current element.",
		},
		{
			name: ":read-only",
			browsers: ["E13", "FF78", "FFA79", "S4", "SM3.2", "C1", "CA18", "O9"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:read-only",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-07-28",
				baseline_high_date: "2023-01-28",
			},
			description:
				"An element whose contents are not user-alterable is :read-only. However, elements whose contents are user-alterable (such as text input fields) are considered to be in a :read-write state. In typical documents, most elements are :read-only.",
		},
		{
			name: ":read-write",
			browsers: ["E13", "FF78", "FFA79", "S4", "SM3.2", "C1", "CA18", "O9"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:read-write",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-07-28",
				baseline_high_date: "2023-01-28",
			},
			description:
				"An element whose contents are not user-alterable is :read-only. However, elements whose contents are user-alterable (such as text input fields) are considered to be in a :read-write state. In typical documents, most elements are :read-only.",
		},
		{
			name: ":required",
			browsers: ["E12", "FF4", "FFA4", "S5", "SM5", "C10", "CA18", "IE10", "O10"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:required",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"A form element is :required or :optional if a value for it is, respectively, required or optional before the form it belongs to is submitted. Elements that are not form elements are neither required nor optional.",
		},
		{
			name: ":right",
			browsers: ["E12", "S5", "SM4.2", "C6", "CA18", "IE8", "O9.2"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:right",
				},
			],
			baseline: {
				status: "false",
			},
			description:
				"When printing double-sided documents, the page boxes on left and right pages may be different. This can be expressed through CSS pseudo-classes defined in the  page context.",
		},
		{
			name: ":root",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE9", "O9.5"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:root",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Represents an element that is the root of the document. In HTML 4, this is always the HTML element.",
		},
		{
			name: ":scope",
			browsers: ["E79", "FF32", "FFA32", "S7", "SM7", "C27", "CA27", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:scope",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
			description: "Represents any element that is in the contextual reference element set.",
		},
		{
			name: ":single-button",
			browsers: ["C", "S5"],
			description:
				"Non-standard. Applies to buttons and track pieces. Applies when both buttons are displayed separately at either end of the scrollbar.",
		},
		{
			name: ":start",
			browsers: ["C", "S5"],
			description:
				"Non-standard. Applies to buttons and track pieces. Indicates whether the object is placed before the thumb.",
		},
		{
			name: ":target",
			browsers: ["E12", "FF1", "FFA4", "S1.3", "SM2", "C1", "CA18", "IE9", "O9.5"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:target",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Some URIs refer to a location within a resource. This kind of URI ends with a 'number sign' (#) followed by an anchor identifier (called the fragment identifier).",
		},
		{
			name: ":valid",
			browsers: ["E12", "FF4", "FFA4", "S5", "SM5", "C10", "CA18", "IE10", "O10"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:valid",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"An element is :valid or :invalid when it is, respectively, valid or invalid with respect to data validity semantics defined by a different specification.",
		},
		{
			name: ":vertical",
			browsers: ["C", "S5"],
			description: "Non-standard. Applies to any scrollbar pieces that have a vertical orientation.",
		},
		{
			name: ":visited",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE4", "O3.5"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:visited",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Applies once the link has been visited by the user.",
		},
		{
			name: ":-webkit-any",
			browsers: ["C", "S5"],
			description:
				"Represents an element that is represented by the selector list passed as its argument. Standardized as :matches().",
		},
		{
			name: ":-webkit-full-screen",
			browsers: ["C", "S6"],
			description: "Matches any element that has its fullscreen flag set. Standardized as :fullscreen.",
		},
		{
			name: ":window-inactive",
			browsers: ["C", "S3"],
			description:
				"Non-standard. Applies to all scrollbar pieces. Indicates whether or not the window containing the scrollbar is currently active.",
		},
		{
			name: ":active-view-transition",
			description: "",
			browsers: ["E125", "S18", "SM18", "C125", "CA125", "O111"],
			baseline: {
				status: "false",
			},
		},
		{
			name: ":active-view-transition-type",
			description: "",
			browsers: ["E125", "S18.2", "SM18.2", "C125", "CA125", "O111"],
			baseline: {
				status: "false",
			},
		},
		{
			name: ":autofill",
			description:
				"The :autofill CSS pseudo-class matches when an input element has its value autofilled by the browser. The class stops matching if the user edits the field.",
			browsers: ["E110", "FF86", "FFA86", "S15", "SM15", "C110", "CA110", "O96"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:autofill",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-02-09",
			},
		},
		{
			name: ":blank",
			description: "The :blank CSS pseudo-class selects empty user input elements (eg. <input> or <textarea>).",
			status: "experimental",
		},
		{
			name: ":buffering",
			description:
				"The :buffering CSS pseudo-class selector represents an element that is playable, such as audio or video, when the playable element is buffering a media resource.",
			browsers: ["S15.4", "SM15.4"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:buffering",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: ":current",
			description:
				"The :current CSS pseudo-class selector is a time-dimensional pseudo-class that represents the element, or an ancestor of the element, that is currently being displayed",
			status: "experimental",
		},
		{
			name: ":defined",
			description:
				"The :defined CSS pseudo-class represents any element that has been defined. This includes any standard element built in to the browser, and custom elements that have been successfully defined (i.e. with the CustomElementRegistry.define() method).",
			browsers: ["E79", "FF63", "FFA63", "S10", "SM10", "C54", "CA54", "O41"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:defined",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
		},
		{
			name: ":dir",
			description:
				"The :dir() CSS pseudo-class matches elements based on the directionality of the text contained in them.",
			browsers: ["E120", "FF49", "FFA49", "S16.4", "SM16.4", "C120", "CA120", "O106"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:dir",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-12-07",
			},
		},
		{
			name: ":focus-visible",
			description:
				"The :focus-visible pseudo-class applies while an element matches the :focus pseudo-class and the UA determines via heuristics that the focus should be made evident on the element.",
			browsers: ["E86", "FF85", "FFA85", "S15.4", "SM15.4", "C86", "CA86", "O72"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:focus-visible",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-03-14",
				baseline_high_date: "2024-09-14",
			},
		},
		{
			name: ":focus-within",
			description:
				"The :focus-within pseudo-class applies to any element for which the :focus pseudo class applies as well as to an element whose descendant in the flat tree (including non-element nodes, such as text nodes) matches the conditions for matching :focus.",
			browsers: ["E79", "FF52", "FFA52", "S10.1", "SM10.3", "C60", "CA60", "O47"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:focus-within",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
		},
		{
			name: ":has",
			description:
				"The functional :has() CSS pseudo-class represents an element if any of the relative selectors that are passed as an argument match at least one element when anchored against this element. ",
			browsers: ["E105", "FF121", "FFA121", "S15.4", "SM15.4", "C105", "CA105", "O91"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:has",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-12-19",
			},
		},
		{
			name: ":has-slotted",
			description:
				"The :has-slotted CSS pseudo-class matches when the content of a slot element is not empty or not using the default value (see Using templates and slots for more information).",
			browsers: ["E134", "FF136", "FFA136", "C134", "CA134", "O119"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:has-slotted",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: ":is",
			description:
				"The :is() CSS pseudo-class function takes a selector list as its argument, and selects any element that can be selected by one of the selectors in that list. This is useful for writing large selectors in a more compact form.",
			browsers: ["E88", "FF78", "FFA79", "S14", "SM14", "C88", "CA88", "O74"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:is",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-01-21",
				baseline_high_date: "2023-07-21",
			},
		},
		{
			name: ":local-link",
			description: "The :local-link CSS pseudo-class represents an link to the same document",
			status: "experimental",
		},
		{
			name: ":modal",
			description:
				"The :modal CSS pseudo-class matches an element that is in a state in which it excludes all interaction with elements outside it until the interaction has been dismissed. Multiple elements can be selected by the :modal pseudo-class at the same time, but only one of them will be active and able to receive input.",
			browsers: ["E105", "FF103", "FFA103", "S15.6", "SM15.6", "C105", "CA105", "O91"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:modal",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-09-02",
				baseline_high_date: "2025-03-02",
			},
		},
		{
			name: ":muted",
			description:
				"The :muted CSS pseudo-class selector represents an element that is capable of making sound, such as audio or video, but is muted (forced silent).",
			browsers: ["S15.4", "SM15.4"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:muted",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: ":open",
			description:
				"The :open CSS pseudo-class represents an element that has open and closed states, only when it is currently in the open state.",
			browsers: ["E133", "FF136", "FFA136", "C133", "CA133", "O118"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:open",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: ":paused",
			description:
				"The :paused CSS pseudo-class selector is a resource state pseudo-class that will match an audio, video, or similar resource that is capable of being “played” or “paused”, when that element is “paused”.",
			browsers: ["S15.4", "SM15.4"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:paused",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: ":picture-in-picture",
			description:
				"The :picture-in-picture CSS pseudo-class matches the element which is currently in picture-in-picture mode.",
			browsers: ["E110", "S13.1", "SM13.4", "C110", "CA110", "O96"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:picture-in-picture",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: ":placeholder-shown",
			description:
				"The :placeholder-shown CSS pseudo-class represents any <input> or <textarea> element that is currently displaying placeholder text.",
			browsers: ["E79", "FF51", "FFA51", "S9", "SM9", "C47", "CA47", "IE10", "O34"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:placeholder-shown",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
		},
		{
			name: ":playing",
			description:
				"The :playing CSS pseudo-class selector is a resource state pseudo-class that will match an audio, video, or similar resource that is capable of being “played” or “paused”, when that element is “playing”. ",
			browsers: ["S15.4", "SM15.4"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:playing",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: ":popover-open",
			description:
				'The :popover-open CSS pseudo-class represents a {{domxref("Popover API", "popover", "", "nocode")}} element (i.e. one with a popover attribute) that is in the showing state. You can use this to apply style to popover elements only when they are shown.',
			browsers: ["E114", "FF125", "FFA125", "S17", "SM17", "C114", "CA114", "O100"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:popover-open",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2024-04-16",
			},
		},
		{
			name: ":seeking",
			description:
				"The :seeking CSS pseudo-class selector represents an element that is playable, such as audio or video, when the playable element is seeking a playback position in the media resource.",
			browsers: ["S15.4", "SM15.4"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:seeking",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: ":stalled",
			description:
				"The :stalled CSS pseudo-class selector represents an element that is playable, such as audio or video, when playback is stalled.",
			browsers: ["S15.4", "SM15.4"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:stalled",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: ":state",
			description: "The :state() CSS pseudo-class matches custom elements that have the specified custom state.",
			browsers: ["E125", "FF126", "FFA126", "S17.4", "SM17.4", "C125", "CA125", "O111"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:state",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2024-05-17",
			},
		},
		{
			name: ":target-current",
			description:
				"The :target-current CSS pseudo-class selects the active scroll marker — the ::scroll-marker pseudo-element of a scroll-marker-group that is currently scrolled to. This selector can be used to style the active navigation position within a scroll marker group.",
			status: "experimental",
			browsers: ["E135", "C135", "O120"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:target-current",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: ":target-within",
			description:
				"The :target-within CSS pseudo-class represents an element that is a target element or contains an element that is a target. A target element is a unique element with an id matching the URL's fragment.",
			status: "experimental",
		},
		{
			name: ":user-invalid",
			description:
				"The :user-invalid CSS pseudo-class represents any validated form element whose value isn't valid based on their validation constraints, after the user has interacted with it.",
			browsers: ["E119", "FF88", "FFA88", "S16.5", "SM16.5", "C119", "CA119", "O105"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:user-invalid",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-11-02",
			},
		},
		{
			name: ":user-valid",
			description:
				"The :user-valid CSS pseudo-class represents any validated form element whose value validates correctly based on its validation constraints. However, unlike :valid it only matches once the user has interacted with it.",
			browsers: ["E119", "FF88", "FFA88", "S16.5", "SM16.5", "C119", "CA119", "O105"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:user-valid",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2023-11-02",
			},
		},
		{
			name: ":volume-locked",
			description:
				'The :volume-locked CSS pseudo-class selector represents an element that is capable of making sound, such as audio or video, but the audio volume of the media element is currently "locked" by the user.',
			browsers: ["S15.4", "SM15.4"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:volume-locked",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: ":where",
			description:
				"The :where() CSS pseudo-class function takes a selector list as its argument, and selects any element that can be selected by one of the selectors in that list.",
			browsers: ["E88", "FF78", "FFA79", "S14", "SM14", "C88", "CA88", "O74"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/:where",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-01-21",
				baseline_high_date: "2023-07-21",
			},
		},
		{
			name: ":xr-overlay",
			description: "",
			status: "experimental",
			browsers: ["E83", "C83", "CA83", "O69"],
			baseline: {
				status: "false",
			},
		},
	],
	pseudoElements: [
		{
			name: "::after",
			browsers: ["E12", "FF1.5", "FFA4", "S4", "SM3.2", "C1", "CA18", "IE9", "O7"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::after",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Represents a styleable child pseudo-element immediately after the originating element's actual content.",
		},
		{
			name: "::backdrop",
			browsers: ["E79", "FF47", "FFA47", "S15.4", "SM15.4", "C37", "CA37", "IE11", "O24"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::backdrop",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2022-03-14",
				baseline_high_date: "2024-09-14",
			},
			description:
				"Used to create a backdrop that hides the underlying document for an element in a top layer (such as an element that is displayed fullscreen).",
		},
		{
			name: "::before",
			browsers: ["E12", "FF1.5", "FFA4", "S4", "SM3", "C1", "CA18", "IE9", "O7"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::before",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Represents a styleable child pseudo-element immediately before the originating element's actual content.",
		},
		{
			name: "::content",
			browsers: ["C35", "O22"],
			description:
				"Deprecated. Matches the distribution list itself, on elements that have one. Use ::slotted for forward compatibility.",
		},
		{
			name: "::cue",
			browsers: ["E79", "FF55", "FFA55", "S7", "SM7", "C26", "CA26", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::cue",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
		},
		{
			name: "::cue",
			browsers: ["E79", "FF55", "FFA55", "S7", "SM7", "C26", "CA26", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::cue",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
		},
		{
			name: "::cue-region",
			browsers: ["C", "O16", "S6"],
		},
		{
			name: "::cue-region",
			browsers: ["C", "O16", "S6"],
		},
		{
			name: "::first-letter",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE9", "O7"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::first-letter",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description:
				"Represents the first letter of an element, if it is not preceded by any other content (such as images or inline tables) on its line.",
		},
		{
			name: "::first-line",
			browsers: ["E12", "FF1", "FFA4", "S1", "SM1", "C1", "CA18", "IE9", "O7"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::first-line",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2015-07-29",
				baseline_high_date: "2018-01-29",
			},
			description: "Describes the contents of the first formatted line of its originating element.",
		},
		{
			name: "::-moz-focus-inner",
			browsers: ["FF72", "FFA79"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::-moz-focus-inner",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::-moz-focus-outer",
			browsers: ["FF4"],
		},
		{
			name: "::-moz-list-bullet",
			browsers: ["FF72", "FFA79"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::-moz-list-bullet",
				},
			],
			baseline: {
				status: "false",
			},
			description: "Used to style the bullet of a list element. Similar to the standardized ::marker.",
		},
		{
			name: "::-moz-list-number",
			browsers: ["FF72", "FFA79"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::-moz-list-number",
				},
			],
			baseline: {
				status: "false",
			},
			description: "Used to style the numbers of a list element. Similar to the standardized ::marker.",
		},
		{
			name: "::-moz-placeholder",
			browsers: ["FF19"],
			description: "Represents placeholder text in an input field",
		},
		{
			name: "::-moz-progress-bar",
			browsers: ["FF72", "FFA79"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::-moz-progress-bar",
				},
			],
			baseline: {
				status: "false",
			},
			description: "Represents the bar portion of a progress bar.",
		},
		{
			name: "::-moz-selection",
			browsers: ["FF1"],
			description: "Represents the portion of a document that has been highlighted by the user.",
		},
		{
			name: "::-ms-backdrop",
			browsers: ["IE11"],
			description:
				"Used to create a backdrop that hides the underlying document for an element in a top layer (such as an element that is displayed fullscreen).",
		},
		{
			name: "::-ms-browse",
			browsers: ["E", "IE10"],
			description: "Represents the browse button of an input type=file control.",
		},
		{
			name: "::-ms-check",
			browsers: ["E", "IE10"],
			description: "Represents the check of a checkbox or radio button input control.",
		},
		{
			name: "::-ms-clear",
			browsers: ["E", "IE10"],
			description: "Represents the clear button of a text input control",
		},
		{
			name: "::-ms-expand",
			browsers: ["E", "IE10"],
			description: "Represents the drop-down button of a select control.",
		},
		{
			name: "::-ms-fill",
			browsers: ["E", "IE10"],
			description: "Represents the bar portion of a progress bar.",
		},
		{
			name: "::-ms-fill-lower",
			browsers: ["E", "IE10"],
			description:
				"Represents the portion of the slider track from its smallest value up to the value currently selected by the thumb. In a left-to-right layout, this is the portion of the slider track to the left of the thumb.",
		},
		{
			name: "::-ms-fill-upper",
			browsers: ["E", "IE10"],
			description:
				"Represents the portion of the slider track from the value currently selected by the thumb up to the slider's largest value. In a left-to-right layout, this is the portion of the slider track to the right of the thumb.",
		},
		{
			name: "::-ms-reveal",
			browsers: ["E", "IE10"],
			description: "Represents the password reveal button of an input type=password control.",
		},
		{
			name: "::-ms-thumb",
			browsers: ["E", "IE10"],
			description:
				"Represents the portion of range input control (also known as a slider control) that the user drags.",
		},
		{
			name: "::-ms-ticks-after",
			browsers: ["E", "IE10"],
			description:
				"Represents the tick marks of a slider that begin just after the thumb and continue up to the slider's largest value. In a left-to-right layout, these are the ticks to the right of the thumb.",
		},
		{
			name: "::-ms-ticks-before",
			browsers: ["E", "IE10"],
			description:
				"Represents the tick marks of a slider that represent its smallest values up to the value currently selected by the thumb. In a left-to-right layout, these are the ticks to the left of the thumb.",
		},
		{
			name: "::-ms-tooltip",
			browsers: ["E", "IE10"],
			description: "Represents the tooltip of a slider (input type=range).",
		},
		{
			name: "::-ms-track",
			browsers: ["E", "IE10"],
			description: "Represents the track of a slider.",
		},
		{
			name: "::-ms-value",
			browsers: ["E", "IE10"],
			description: "Represents the content of a text or password input control, or a select control.",
		},
		{
			name: "::selection",
			browsers: ["E12", "FF62", "FFA62", "S1.1", "C1", "CA18", "IE9", "O9.5"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::selection",
				},
			],
			baseline: {
				status: "false",
			},
			description: "Represents the portion of a document that has been highlighted by the user.",
		},
		{
			name: "::shadow",
			browsers: ["C35", "O22"],
			description: "Matches the shadow root if an element has a shadow tree.",
		},
		{
			name: "::-webkit-file-upload-button",
			browsers: ["C", "O", "S6"],
		},
		{
			name: "::-webkit-inner-spin-button",
			browsers: ["E79", "S5", "SM4.2", "C6", "CA18", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::-webkit-inner-spin-button",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::-webkit-input-placeholder",
			browsers: ["C", "S4"],
		},
		{
			name: "::-webkit-keygen-select",
			browsers: ["C", "O", "S6"],
		},
		{
			name: "::-webkit-meter-bar",
			browsers: ["E79", "S5.1", "SM5", "C12", "CA18", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::-webkit-meter-bar",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::-webkit-meter-even-less-good-value",
			browsers: ["E79", "S5.1", "SM5", "C12", "CA18", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::-webkit-meter-even-less-good-value",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::-webkit-meter-optimum-value",
			browsers: ["E79", "S5.1", "SM5", "C12", "CA18", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::-webkit-meter-optimum-value",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::-webkit-meter-suboptimum-value",
			browsers: ["E79", "S5.1", "SM5", "C12", "CA18", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::-webkit-meter-suboptimum-value",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::-webkit-outer-spin-button",
			browsers: ["C", "O", "S6"],
		},
		{
			name: "::-webkit-progress-bar",
			browsers: ["E79", "S7", "SM7", "C25", "CA25", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::-webkit-progress-bar",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::-webkit-progress-inner-element",
			browsers: ["E79", "S7", "SM7", "C23", "CA25", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::-webkit-progress-inner-element",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::-webkit-progress-value",
			browsers: ["E79", "S7", "SM7", "C25", "CA25", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::-webkit-progress-value",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::-webkit-resizer",
			browsers: ["E79", "S4", "SM3.2", "C2", "CA18", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::-webkit-scrollbar",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::-webkit-scrollbar",
			browsers: ["E79", "S4", "SM3", "C2", "CA18", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::-webkit-scrollbar",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::-webkit-scrollbar-button",
			browsers: ["E79", "S4", "C2", "CA18", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::-webkit-scrollbar",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::-webkit-scrollbar-corner",
			browsers: ["E79", "S4", "C2", "CA18", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::-webkit-scrollbar",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::-webkit-scrollbar-thumb",
			browsers: ["E79", "S4", "C2", "CA18", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::-webkit-scrollbar",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::-webkit-scrollbar-track",
			browsers: ["E79", "S4", "C2", "CA18", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::-webkit-scrollbar",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::-webkit-scrollbar-track-piece",
			browsers: ["E79", "S4", "C2", "CA18", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::-webkit-scrollbar",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::-webkit-search-cancel-button",
			browsers: ["E79", "S3", "SM1", "C1", "CA18", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::-webkit-search-cancel-button",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::-webkit-search-decoration",
			browsers: ["C", "S4"],
		},
		{
			name: "::-webkit-search-results-button",
			browsers: ["E79", "S3", "SM1", "C1", "CA18", "O15"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::-webkit-search-results-button",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::-webkit-search-results-decoration",
			browsers: ["C", "S4"],
		},
		{
			name: "::-webkit-slider-runnable-track",
			browsers: ["E83", "S18", "SM18", "C83", "CA83", "O69"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::-webkit-slider-runnable-track",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::-webkit-slider-thumb",
			browsers: ["E83", "S18", "SM18", "C83", "CA83", "O69"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::-webkit-slider-thumb",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::-webkit-textfield-decoration-container",
			browsers: ["C", "O", "S6"],
		},
		{
			name: "::-webkit-validation-bubble",
			browsers: ["C", "O", "S6"],
		},
		{
			name: "::-webkit-validation-bubble-arrow",
			browsers: ["C", "O", "S6"],
		},
		{
			name: "::-webkit-validation-bubble-arrow-clipper",
			browsers: ["C", "O", "S6"],
		},
		{
			name: "::-webkit-validation-bubble-heading",
			browsers: ["C", "O", "S6"],
		},
		{
			name: "::-webkit-validation-bubble-message",
			browsers: ["C", "O", "S6"],
		},
		{
			name: "::-webkit-validation-bubble-text-block",
			browsers: ["C", "O", "S6"],
		},
		{
			name: "::-moz-range-progress",
			description:
				'The ::-moz-range-progress CSS pseudo-element is a Mozilla extension that represents the lower portion of the track (i.e., groove) in which the indicator slides in an <input> of type="range". This portion corresponds to values lower than the value currently selected by the thumb (i.e., virtual knob).',
			status: "nonstandard",
			browsers: ["FF22", "FFA22"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::-moz-range-progress",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::-moz-range-thumb",
			description:
				'The ::-moz-range-thumb CSS pseudo-element is a Mozilla extension that represents the thumb (i.e., virtual knob) of an <input> of type="range". The user can move the thumb along the input\'s track to alter its numerical value.',
			status: "nonstandard",
			browsers: ["FF21", "FFA21"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::-moz-range-thumb",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::-moz-range-track",
			description:
				'The ::-moz-range-track CSS pseudo-element is a Mozilla extension that represents the track (i.e., groove) in which the indicator slides in an <input> of type="range".',
			status: "nonstandard",
			browsers: ["FF21", "FFA21"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::-moz-range-track",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::-webkit-progress-inner-value",
			description:
				"The ::-webkit-progress-value CSS pseudo-element represents the filled-in portion of the bar of a <progress> element. It is a child of the ::-webkit-progress-bar pseudo-element.\n\nIn order to let ::-webkit-progress-value take effect, -webkit-appearance needs to be set to none on the <progress> element.",
			status: "nonstandard",
		},
		{
			name: "::checkmark",
			description:
				"The ::checkmark CSS pseudo-element targets the checkmark placed inside the currently-selected option element of a customizable select element. It can be used to provide a visual indication of which option is selected.",
			browsers: ["E133", "C133", "CA133", "O118"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::checkmark",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::details-content",
			description:
				"The ::details-content CSS pseudo-element represents the expandable/collapsible contents of a details element.",
			browsers: ["E131", "S18.4", "SM18.4", "C131", "CA131", "O116"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::details-content",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::file-selector-button",
			description: 'The ::file-selector-button CSS pseudo-element represents the button of an input of type="file".',
			browsers: ["E89", "FF82", "FFA82", "S14.1", "SM14.5", "C89", "CA89", "IE10", "O75"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::file-selector-button",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2021-04-26",
				baseline_high_date: "2023-10-26",
			},
		},
		{
			name: "::grammar-error",
			description:
				"The ::grammar-error CSS pseudo-element represents a text segment which the user agent has flagged as grammatically incorrect.",
			browsers: ["E121", "S17.4", "SM17.4", "C121", "CA121", "O107"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::grammar-error",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::highlight",
			description: "The ::highlight() CSS pseudo-element applies styles to a custom highlight.",
			browsers: ["E105", "S17.2", "SM17.2", "C105", "CA105", "O91"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::highlight",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::marker",
			description:
				"The ::marker CSS pseudo-element selects the marker box of a list item, which typically contains a bullet or number. It works on any element or pseudo-element set to display: list-item, such as the <li> and <summary> elements.",
			browsers: ["E86", "FF68", "FFA68", "C86", "CA86", "O72"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::marker",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::part",
			description:
				"The ::part CSS pseudo-element represents any element within a shadow tree that has a matching part attribute.",
			browsers: ["E79", "FF72", "FFA79", "S13.1", "SM13.4", "C73", "CA73", "O60"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::part",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-07-28",
				baseline_high_date: "2023-01-28",
			},
		},
		{
			name: "::picker-icon",
			description:
				"The ::picker-icon CSS pseudo-element targets the picker icon inside form controls that have an icon associated with them. In the case of a customizable select element, it selects the arrow icon shown on the <select> element that points down when it is closed.",
			browsers: ["E133", "C133", "CA133", "O118"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::picker-icon",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::picker",
			description:
				"The ::picker() CSS pseudo-element targets the picker part of an element, for example the drop-down picker of a customizable select element.",
			browsers: ["E134", "C134", "CA134", "O119"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::picker",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::placeholder",
			description: "The ::placeholder CSS pseudo-element represents the placeholder text of a form element.",
			browsers: ["E79", "FF51", "FFA51", "S10.1", "SM10.3", "C57", "CA57", "O44"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::placeholder",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
		},
		{
			name: "::scroll-marker",
			description:
				"The ::scroll-marker CSS pseudo-element can be generated inside any element and represents its scroll marker. All elements can have a ::scroll-marker pseudo-element, which is placed into the ::scroll-marker-group of the nearest scroll container ancestor. A scroll marker behaves like an anchor (a element) whose scroll target is the marker's originating element — and scrolls the scroll container to that element when activated.",
			status: "experimental",
			browsers: ["E135", "C135", "O120"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::scroll-marker",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::scroll-marker-group",
			description:
				"The ::scroll-marker-group CSS pseudo-element is generated inside a scroll container and contains any ::scroll-marker pseudo-elements generated on descendants of the scroll container.",
			status: "experimental",
			browsers: ["E135", "C135", "O120"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::scroll-marker-group",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::slotted",
			description:
				"The ::slotted() CSS pseudo-element represents any element that has been placed into a slot inside an HTML template (see Using templates and slots for more information).",
			browsers: ["E79", "FF63", "FFA63", "S10", "SM10", "C50", "CA50", "O37"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::slotted",
				},
			],
			baseline: {
				status: "high",
				baseline_low_date: "2020-01-15",
				baseline_high_date: "2022-07-15",
			},
		},
		{
			name: "::spelling-error",
			description:
				"The ::spelling-error CSS pseudo-element represents a text segment which the user agent has flagged as incorrectly spelled.",
			browsers: ["E121", "S17.4", "SM17.4", "C121", "CA121", "O107"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::spelling-error",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::target-text",
			description:
				"The ::target-text CSS pseudo-element represents the text that has been scrolled to if the browser supports scroll-to-text fragments. It allows authors to choose how to highlight that section of text.",
			browsers: ["E89", "FF131", "FFA131", "S18.2", "SM18.2", "C89", "CA89", "O75"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::target-text",
				},
			],
			baseline: {
				status: "low",
				baseline_low_date: "2024-12-11",
			},
		},
		{
			name: "::view-transition",
			description:
				"The ::view-transition CSS pseudo-element represents the root of the view transitions overlay, which contains all view transitions and sits over the top of all other page content.",
			browsers: ["E109", "FFpreview", "S18", "SM18", "C109", "CA109", "O95"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::view-transition",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::view-transition-group",
			description: "The ::view-transition-group CSS pseudo-element represents a single view transition snapshot group.",
			browsers: ["E109", "FFpreview", "S18", "SM18", "C109", "CA109", "O95"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::view-transition-group",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::view-transition-image-pair",
			description:
				'The ::view-transition-image-pair CSS pseudo-element represents a container for a view transition\'s "old" and "new" view states — before and after the transition.',
			browsers: ["E109", "FFpreview", "S18", "SM18", "C109", "CA109", "O95"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::view-transition-image-pair",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::view-transition-new",
			description:
				'The ::view-transition-new CSS pseudo-element represents the "new" view state of a view transition — a snapshot live representation of the state after the transition.',
			browsers: ["E109", "FFpreview", "S18", "SM18", "C109", "CA109", "O95"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::view-transition-new",
				},
			],
			baseline: {
				status: "false",
			},
		},
		{
			name: "::view-transition-old",
			description:
				'The ::view-transition-old CSS pseudo-element represents the "old" view state of a view transition — a static snapshot of the old view, before the transition.',
			browsers: ["E109", "FFpreview", "S18", "SM18", "C109", "CA109", "O95"],
			references: [
				{
					name: "MDN Reference",
					url: "https://developer.mozilla.org/docs/Web/CSS/::view-transition-old",
				},
			],
			baseline: {
				status: "false",
			},
		},
	],
};
