export interface Color {
    r: number;
    g: number;
    b: number;
    a?: number;
}

export namespace Color {
    export const WHITE: Color = rgba(255, 255, 255);
    export const BLACK: Color = rgba(0, 0, 0);
    export const TRANSPARENT: Color = rgba(0, 0, 0, 0);

    export function rgba(r: number = 0, b: number = 0, g: number = 0, a: number = 1) {
        return {r, g, b, a};
    }

    export function toCss(color?: Partial<Color>) {
        color = color ?? {};

        return `rgba(${color.r ?? 0},${color.g ?? 0},${color.b ?? 0},${color.a ?? 1})`;
    }
}
