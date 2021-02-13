import { Color, ColorFormatLabel, lch, rgb, rgba } from './colors';
import convert from 'color-convert';

export default {
    applyAlpha(base: rgb, overlay: rgba): rgb {
        const result: rgb = [...base];
        result.forEach((channel, index) => {
            result[index] = overlay[index] * overlay[3] + channel * (1 - overlay[3]);
        });
        return result;
    },
    checkLuminance(color: rgb, desiredLuminance: number, threshold: number = 1): boolean {
        const lchColor: lch = convert.rgb.lch.raw(color);
        const upperBound = desiredLuminance + threshold;
        const lowerBound = desiredLuminance - threshold;
        return lowerBound < lchColor[0] && lchColor[0] < upperBound;
    }
}