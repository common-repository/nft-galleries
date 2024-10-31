import React from "react";
import {SVG_GAP, SVG_ROUNDNESS, SVG_SIZE} from "spotlight/feed-editor/components/icons/GridLayoutIcon";

export function HighlightLayoutIcon() {
    // The width/height of the small square
    const wh = (300 - (SVG_GAP * 2)) / 3;
    // The width/height of the big square
    const wh2 = (wh * 2) + SVG_GAP;
    // The x/y positions of each square
    const p1 = 0;
    const p2 = wh + SVG_GAP;
    const p3 = p2 * 2;

    return (
        <svg viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}>
            <rect x={p1} y={p1} width={wh2} height={wh2} rx={SVG_ROUNDNESS} ry={SVG_ROUNDNESS} />

            <rect x={p3} y={p1} width={wh} height={wh} rx={SVG_ROUNDNESS} ry={SVG_ROUNDNESS} />
            <rect x={p3} y={p2} width={wh} height={wh} rx={SVG_ROUNDNESS} ry={SVG_ROUNDNESS} />

            <rect x={p1} y={p3} width={wh} height={wh} rx={SVG_ROUNDNESS} ry={SVG_ROUNDNESS} />
            <rect x={p2} y={p3} width={wh} height={wh} rx={SVG_ROUNDNESS} ry={SVG_ROUNDNESS} />
            <rect x={p3} y={p3} width={wh} height={wh} rx={SVG_ROUNDNESS} ry={SVG_ROUNDNESS} />
        </svg>
    );
}
