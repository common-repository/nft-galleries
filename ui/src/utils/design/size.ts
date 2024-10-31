export interface Size {
    amount: number;
    unit?: Size.Unit;
}

export namespace Size {
    export enum Unit {
        NONE = "",
        PX = "px",
        EM = "em",
        REM = "rem",
        VW = "vw",
        PERCENT = "%",
    }

    export function toCss(size?: Partial<Size>) {
        size = size ?? {};

        return (typeof size.amount === "number")
            ? (size.amount ?? "0") + (size.unit ?? Unit.PX)
            : undefined;
    }
}
