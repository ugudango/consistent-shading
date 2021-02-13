# consistent-shading

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/ugudango/consistent-shading/build?style=for-the-badge)
![NPM](https://img.shields.io/npm/l/consistent-shading?style=for-the-badge)
![npm](https://img.shields.io/npm/v/consistent-shading?style=for-the-badge)
![npm bundle size](https://img.badgesize.io/https:/unpkg.com/consistent-shading/dist/index.min.js?label=Minified%20size&style=for-the-badge&color=blue)

Shade consitency for various hues, based on luminance. **Supports both solid and transparent shades.**

![](README/consistent-shading.png)

## Installation

For the npm package, use\:

```bash
npm install --save consistent-shading
```

For the ECMAScript module in browsers, use\:

```html
<script src="https://cdn.jsdelivr.net/npm/consistent-shading@latest/dist/esm/index.js"></script>
```

For the minfied module _(only ~750 bytes!)_ in browsers, use\:

```html
<script src="https://cdn.jsdelivr.net/npm/consistent-shading@latest/dist/index.min.js"></script>
```

## Problem

The colour spectrum differs in luminance, at maximum saturation. As such, applying the same shadows throughout your design will create uneven colouring, due to the difference in _contrast_.

Finding aesthetically pleasing combinations of shadows and highlights is difficult enough for one colour, but getting consistent shading with a varied pallete can be really time consuming.

## Solution

The easiest solution lies in the new HCL (or LCH) colour format, which manages to separate luminance into an independent parameter.

To use this library you have to provide an _ideal base colour_, along with an array of _ideal shades_, that you have found through experimentation and determined to be fitting for your design.

After providing these in your format of choice\* pick a new base colour and feed it into the generator. This will cause it to return an array of relevant, _contrast consistent_ shades, that _look pleasing_, just like the shaded base colour.

## Usage

> Try to pick base colours that are not on either extremes of the luminance spectrum, since the generator caps at the maximum and minimum levels. (You can't obtain a color darker than black)

```typescript
import { Color, ConsistentShading } from "consistent-shading";

const IdealBaseColor = new Color("hex", ["#3454D1"]);

const IdealShades = [
  new Color("rgb", [122, 143, 225]),
  new Color("lab", [31, 28, -58]),
  new Color("cmyk", [27, 22, 0, 7]),
];

const Generator = new ConsistentShading(IdealBaseColor, IdealShades);

const AnyColor = new Color("hsl", [345, 63, 51]);

Generator.generate(AnyColor);
/* => Array of Color objects, representing shades of AnyColor. */

Generator.generateAlpha(AnyColor, /* optional */ 1.5);
/* => Array of Color objects, rgba format, representing 
semi-transparent black or white shades of AnyColor. */
```

## API Description

### Color formats\*

The color formats are taken directly from the [color-convert](https://www.npmjs.com/package/color-convert) package. These are as follows:

```typescript
"rgb" | "hsl" | "hsv" | "hwb" | "cmyk" | "xyz" | "lab"  | "lch" | "hex" | "keyword" | "ansi16" | "ansi256" | "hcg" | "apple" | "gray";
```

### Color class

Color is provided with two fields, one of which is the `value`, that is mostly a tuple of varying sizes (check [this](../blob/master/src/colors.ts) for more details), and the other is the `format`, which enables the library to correctly interpret your colours and convert them accordingly.

```typescript
const myColor = new Color("rgb", [255, 0, 255]);
```

### Generator class

The `ConsistentShading` class, which is in basic terms the shade generator and main functionality of this library (thus taking it's name), contains an important construrctor, which takes as a first paramenter the base `Color` and an array of shades, that are represented through an array `Color[]`.

***

#### `generate(baseColor: Color)`
After it has calculated the relative luminances of the provided shades, the `generate` method can be used to obtain **solid shades**. This method has a first mandatory parameter, which is the new base color, and an optional second parameter, which specifies a preferred format for the resulting shades.

***

#### `generateAlpha(baseColor: Color, threshold?: number)`
To obtain **alpha shadows**, a binary search method was used.

The solid shades are calculated first, and then it is decided based on luminance if the base color of the `rgba` value should be black or white.

After the decision is made, the opacity is guessed via binary search, with a configurable threshold. If the guessed opacity of the mask is, within the threshold values, equal in luminance to the generated solid shade, it is accepted.

_Higher threshold will make the generation faster, but the results will be less accurate. It is defaulted to 1, which translates to 1% opacity threshold._

**Setting the threshold to a value close to 0 may result in an infinite loop.**

***

> These methods can be called as many times as it's needed, since they do not mutate any internal state of the generator object.