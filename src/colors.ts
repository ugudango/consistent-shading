export type rgb = [number, number, number];
export type rgba = [number, number, number, number];
type hsl = [number, number, number];
type hsv = [number, number, number];
type hwb = [number, number, number];
type cmyk = [number, number, number, number];
type xyz = [number, number, number];
type lab = [number, number, number];
export type lch = [number, number, number];
type hex = [string];
type keyword = [string];
type ansi16 = [string];
type ansi256 = [string];
type hcg = [number, number, number];
type apple = [number, number, number];
type gray = [number];

export type ColorFormat =
    rgb
    | rgba
    | hsl
    | hsv
    | hwb
    | cmyk
    | xyz
    | lab
    | lch
    | hex
    | keyword
    | ansi16
    | ansi256
    | hcg
    | apple
    | gray;

export type ColorFormatLabel =
    'rgb'
    | 'rgba'
    | 'hsl'
    | 'hsv'
    | 'hwb'
    | 'cmyk'
    | 'xyz'
    | 'lab'
    | 'lch'
    | 'hex'
    | 'keyword'
    | 'ansi16'
    | 'ansi256'
    | 'hcg'
    | 'apple'
    | 'gray';

export class Color {
    public value: ColorFormat;

    public format: ColorFormatLabel;

    public constructor(format: ColorFormatLabel, value: ColorFormat) {
        this.value = value;
        this.format = format;
    }
}