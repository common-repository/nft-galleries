/**
 * Useful in `onChange` props for `ColorPicker` components to grab the RGB value from the provided object.
 */
export function pickRgbColor(onChange: (arg: any) => void) {
    return (color) => onChange(color.rgb);
}
