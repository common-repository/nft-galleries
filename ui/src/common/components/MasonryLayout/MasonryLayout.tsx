import React, {CSSProperties, ReactNodeArray} from "react";
import classes from "./MasonryLayout.pcss";
import {splitArray} from "spotlight/utils/arrays/splitArray";

export type Props = {
    columns: number;
    gap?: string | number;
    children: ReactNodeArray;
}

export function MasonryLayout({columns, gap, children}: Props) {
    gap = gap ?? 0;

    const style: CSSProperties = {
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        columnGap: gap,
    };

    const cellCss: CSSProperties = {
        marginBottom: gap,
    };

    return (
        <div className={classes.root} style={style}>
            {splitArray(children, columns).map((column, colIdx) => (
                <div key={colIdx} className={classes.column}>
                    {column.map((child, rowIdx) => (
                        <div key={`${colIdx}-${rowIdx}`} className={classes.cell} style={cellCss}>
                            {child}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
