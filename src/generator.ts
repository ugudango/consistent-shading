import { Color, ColorFormatLabel, lch } from './colors';
import convert from 'color-convert';

export class ConsistentShading {
    private _base: lch;

    private _shades!: lch[];

    private _deltas!: number[];

    set base(color: Color) {
        this._base = convert[color.format]['lch'](color.value);
    }

    public constructor(base: Color, shades: Color[]) {
        this._base = convert[base.format]['lch'](base.value);
        this._shades = new Array<lch>();
        this._deltas = new Array<number>();
        shades.forEach((shade, index) => {
            const converted = convert[shade.format]['lch'](shade.value);
            this._shades.push(converted);
            this._deltas.push(converted[0] - this._base[0]);
        })
    }

    public generate(base: Color, exportFormat?: ColorFormatLabel) {
        let exportFormatInUse: ColorFormatLabel;
        if (typeof exportFormat === 'undefined')
            exportFormatInUse = base.format;
        else
            exportFormatInUse = exportFormat;

        let exportedColors: Color[] = [];
        const lchBase: lch = convert[base.format]['lch'](base.value);
        this._deltas.forEach((delta: number) => {
            let lchGenerated: lch = lchBase;
            lchGenerated[0] += delta;
            lchGenerated[0] = Math.min(100, Math.max(0, lchGenerated[0]));
            const generatedColor = new Color(exportFormatInUse, convert['lch'][exportFormatInUse](lchGenerated));
            exportedColors.push(generatedColor);
        })
        return exportedColors;
    }
}