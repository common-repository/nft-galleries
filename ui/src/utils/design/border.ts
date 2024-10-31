import {Color} from "./color";

export interface BorderDesign {
    width?: number;
    style?: BorderDesign.Style;
    color?: Color;
    radius?: number;
}

export namespace BorderDesign {
    export enum Style {
        SOLID = "solid",
        DOTTED = "dotted",
        DASHED = "dashed",
        DOUBLE = "double",
        GROOVE = "groove",
    }

    export const DEFAULT: BorderDesign = {
        width: 0,
        style: Style.SOLID,
        color: Color.TRANSPARENT,
        radius: 0,
    };

    export function toCss(design?: Partial<BorderDesign>) {
        design = design ?? {};

        return {
            borderWidth: (design.width ?? 0) + "px",
            borderColor: Color.toCss(design.color ?? Color.TRANSPARENT),
            borderStyle: design.style ?? Style.SOLID,
            borderRadius: design.radius + "px",
        };
    }
}
