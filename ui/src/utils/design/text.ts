import {CSSProperties} from "react";
import {Color} from "./color";
import {Size} from "./size";

export interface TextDesign {
    font?: string;
    bold?: boolean;
    italics?: boolean;
    underline?: boolean;
    size?: Size;
    align?: TextDesign.Align,
    color?: Color;
}

export namespace TextDesign {
    export enum Align {
        LEFT = "left",
        RIGHT = "right",
        CENTER = "center",
    }
    export function toCss(design?: Partial<TextDesign>): CSSProperties {
        design = design ?? {};

        return {
            font: design.font,
            fontWeight: design.bold ? "bold" : "normal",
            fontStyle: design.italics ? "italic" : "normal",
            textDecoration: design.underline ? "underline" : "none",
            fontSize: Size.toCss(design.size ?? {}),
            textAlign: design.align ?? TextDesign.Align.LEFT,
            color: Color.toCss(design.color ?? {}),
        };
    }
}
