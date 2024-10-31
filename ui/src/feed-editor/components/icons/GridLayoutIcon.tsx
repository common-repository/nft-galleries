import React from "react";

export const SVG_GAP = 9;
export const SVG_SIZE = 300;
export const SVG_ROUNDNESS = 2;

export function GridLayoutIcon() {
    // The width/height of each square
    const wh = (SVG_SIZE - (SVG_GAP * 2)) / 3;
    // The x/y positions of each square
    const p1 = 0;
    const p2 = wh + SVG_GAP;
    const p3 = p2 * 2;

    return (
        <svg viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}>
            <rect x={p1} y={p1} width={wh} height={wh} rx={SVG_ROUNDNESS} ry={SVG_ROUNDNESS} />
            <rect x={p2} y={p1} width={wh} height={wh} rx={SVG_ROUNDNESS} ry={SVG_ROUNDNESS} />
            <rect x={p3} y={p1} width={wh} height={wh} rx={SVG_ROUNDNESS} ry={SVG_ROUNDNESS} />

            <rect x={p1} y={p2} width={wh} height={wh} rx={SVG_ROUNDNESS} ry={SVG_ROUNDNESS} />
            <rect x={p2} y={p2} width={wh} height={wh} rx={SVG_ROUNDNESS} ry={SVG_ROUNDNESS} />
            <rect x={p3} y={p2} width={wh} height={wh} rx={SVG_ROUNDNESS} ry={SVG_ROUNDNESS} />

            <rect x={p1} y={p3} width={wh} height={wh} rx={SVG_ROUNDNESS} ry={SVG_ROUNDNESS} />
            <rect x={p2} y={p3} width={wh} height={wh} rx={SVG_ROUNDNESS} ry={SVG_ROUNDNESS} />
            <rect x={p3} y={p3} width={wh} height={wh} rx={SVG_ROUNDNESS} ry={SVG_ROUNDNESS} />
        </svg>
    );
}
