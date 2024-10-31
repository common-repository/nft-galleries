import {CSSProperties} from "react";
import {MarginDesign} from "./margin";
import {PaddingDesign} from "./padding";
import {BorderDesign} from "./border";
import {TextDesign} from "./text";
import {Color} from "./color";
import {withPartial} from "spotlight/utils/objects/withPartial";
import {applyPartial} from "spotlight/utils/objects/applyPartial";
import {cloneObj} from "spotlight/utils/objects/cloneObj";
import {isPlainObject} from "spotlight/utils/objects/isPlainObject";
import Align = TextDesign.Align;

export interface ButtonDesign extends ButtonDesign.State {
    onHover?: ButtonDesign.State;
}

export namespace ButtonDesign {
    export interface State {
        text?: TextDesign;
        border?: BorderDesign;
        bgColor?: Color;
        padding?: PaddingDesign;
        margin?: MarginDesign;
    }

    export const DEFAULT: ButtonDesign = {
        text: {
            color: {r: 255, g: 255, b: 255, a: 1},
            align: Align.CENTER,
        },
        border: {},
        bgColor: {r: 0, g: 149, b: 246, a: 1},
        margin: MarginDesign.all(0),
        padding: PaddingDesign.all(12),
        onHover: {
            text: {
                color: {r: 255, g: 255, b: 255, a: 1},
            },
            bgColor: {r: 0, g: 129, b: 203, a: 1},
        }
    };

    export function getState(design: ButtonDesign, isHovered: boolean): State {
        return (isHovered)
            ? isPlainObject(design.onHover) ? design.onHover : {}
            : design;
    }

    export function updateState(design: ButtonDesign, isHovered: boolean, fn: (state: State) => State) {
        const state = (isHovered)
            ? design.onHover = isPlainObject(design.onHover) ? design.onHover : {}
            : design;

        const arg = cloneObj(state);
        const ret = fn(arg);

        applyPartial(state, ret, true);
    }

    export function withState(design: ButtonDesign, isHovered: boolean, fn: (state: State) => State): ButtonDesign {
        const newDesign = cloneObj(design);
        updateState(newDesign, isHovered, fn);

        return newDesign;
    }

    export function getFullState(design: ButtonDesign, isHovered: boolean): State {
        return withPartial(design, getState(design, isHovered), true);
    }

    export function toCss(design?: ButtonDesign, isHovered: boolean = false): CSSProperties {
        const base = design ?? {};
        const state = getFullState(base, isHovered);

        const textStyles = TextDesign.toCss(state.text);
        const borderStyles = BorderDesign.toCss(base.border);
        const marginStyles = base.margin ? MarginDesign.toCss("margin", base.margin) : {};
        const paddingStyles = base.padding ? PaddingDesign.toCss("padding", base.padding) : {};

        return {
            background: Color.toCss(state.bgColor),
            ...textStyles,
            ...borderStyles,
            ...marginStyles,
            ...paddingStyles,
        };
    }
}
