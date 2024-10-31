export interface TblrDesign {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
}

export namespace TblrDesign {
    export function all(amount: number): TblrDesign {
        return {
            top: amount,
            bottom: amount,
            left: amount,
            right: amount,
        };
    }

    export function hv(horizontal: number, vertical: number): TblrDesign {
        return {
            top: vertical,
            bottom: vertical,
            left: horizontal,
            right: horizontal,
        };
    }

    export function toCss(type: string, design?: Partial<TblrDesign>) {
        design = design ?? {};

        return {
            [type + "Top"]: design.top + "px",
            [type + "Bottom"]: design.bottom + "px",
            [type + "Left"]: design.left + "px",
            [type + "Right"]: design.right + "px",
        };
    }
}
