import React from "react";
import {SVG_GAP, SVG_ROUNDNESS, SVG_SIZE} from "spotlight/feed-editor/components/icons/GridLayoutIcon";

export function MasonryLayoutIcon() {
    // The width of each square and height of short squares
    const wh = (300 - (SVG_GAP * 2)) / 3;
    // The height of long squares
    const hl = (wh * 2) + SVG_GAP;
    // The x/y positions of each square
    const p1 = 0;
    const p2 = wh + SVG_GAP;
    const p3 = p2 * 2;

    return (
        <svg viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}>
            <rect x={p1} y={p1} width={wh} height={hl} rx={SVG_ROUNDNESS} ry={SVG_ROUNDNESS} />
            <rect x={p2} y={p1} width={wh} height={wh} rx={SVG_ROUNDNESS} ry={SVG_ROUNDNESS} />
            <rect x={p3} y={p1} width={wh} height={hl} rx={SVG_ROUNDNESS} ry={SVG_ROUNDNESS} />

            <rect x={p1} y={p3} width={wh} height={wh} rx={SVG_ROUNDNESS} ry={SVG_ROUNDNESS} />
            <rect x={p2} y={p2} width={wh} height={hl} rx={SVG_ROUNDNESS} ry={SVG_ROUNDNESS} />
            <rect x={p3} y={p3} width={wh} height={wh} rx={SVG_ROUNDNESS} ry={SVG_ROUNDNESS} />
        </svg>
    );
}
