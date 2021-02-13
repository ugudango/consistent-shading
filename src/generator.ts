import Util from './util';
import { Color, ColorFormatLabel, lch, rgb, rgba } from './colors';
import convert from 'color-convert';

export class ConsistentShading {
    private _base: lch;

    private _shades!: lch[];

    private _deltas!: number[];

    public constructor(base: Color, shades: Color[]) {
        this._base = convert[base.format]['lch'].raw(base.value);
        this._shades = new Array<lch>();
        this._deltas = new Array<number>();
        shades.forEach((shade, index) => {
            const converted = shade.format === 'lch' ? [...shade.value] : convert[shade.format]['lch'].raw(shade.value);
            this._shades.push(converted);
            this._deltas.push(converted[0] - this._base[0]);
        });
    }

    public generate(base: Color, exportFormat: ColorFormatLabel = base.format): Color[] {
        let exportedColors: Color[] = [];
        const lchBase: lch = base.format === 'lch' ? [...base.value] : convert[base.format]['lch'].raw(base.value);
        this._deltas.forEach((delta: number) => {
            let lchGenerated: lch = [...lchBase];
            lchGenerated[0] += delta;
            lchGenerated[0] = Math.min(100, Math.max(0, lchGenerated[0]));
            let convertedLchGenerated = exportFormat === 'lch' ? [...lchGenerated] : convert['lch'][exportFormat](lchGenerated);
            const clgRounded = convertedLchGenerated.map?.((component: number) => Math.round(component));
            if (typeof clgRounded !== 'undefined') {
                convertedLchGenerated = clgRounded;
            }
            const generatedColor = new Color(exportFormat, convertedLchGenerated);
            exportedColors.push(generatedColor);
        });
        return exportedColors;
    }

    public generateAlpha(base: Color, threshold: number = 1): Color[] {
        const lchBase: lch = base.format === 'lch' ? [...base.value] : convert[base.format]['lch'].raw(base.value);

        const rgbBase: rgb = base.format === 'rgb' ? [...base.value] : convert[base.format]['rgb'].raw(base.value);

        const lchResults: lch[] = this.generate(base, 'lch').map((color) => color.value as lch);

        const rgbResults: rgb[] = lchResults.map((color) => convert['lch']['rgb'].raw(color) as rgb);

        const exportedColors: Color[] = [];

        rgbResults.forEach((result: rgb, index) => {
            const desiredLuminance = lchResults[index][0];

            let currentColor: rgb;

            let bottom = 0;
            let top = 1;

            let currentOverlay: rgba = [255, 255, 255, 0];
            let overlayIsBlack = 0;

            if (lchResults[index][0] < lchBase[0]) {
                currentOverlay = [0, 0, 0, 0];
                overlayIsBlack = 1;
            }

            do {
                let middle = (bottom + top) / 2;
                currentOverlay[3] = middle;
                currentColor = Util.applyAlpha(rgbBase, currentOverlay);
                let currentLuminance = convert.rgb.lch.raw(currentColor)[0];

                if (currentLuminance > desiredLuminance ? !overlayIsBlack : overlayIsBlack)
                    top = middle - 0.01;
                else
                    bottom = middle + 0.01;

            } while(!Util.checkLuminance(currentColor, desiredLuminance, threshold));

            currentOverlay[3] = Math.round(currentOverlay[3] * 100) / 100;

            exportedColors.push(new Color('rgba', [...currentOverlay]));
        });

        return exportedColors;
    }
}