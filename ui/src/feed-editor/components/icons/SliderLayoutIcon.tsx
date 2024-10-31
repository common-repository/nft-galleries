import React from "react";
import {SVG_GAP, SVG_ROUNDNESS, SVG_SIZE} from "spotlight/feed-editor/components/icons/GridLayoutIcon";

export function SliderLayoutIcon() {
    // The gap between the chevrons and the big square
    const gap = SVG_GAP * 3;
    // The size of the chevrons
    const cs = 16;
    // The positions of the chevrons
    const cy = (SVG_SIZE - cs) / 2;
    const lcx = cs + SVG_GAP;
    const rcx = SVG_SIZE - SVG_GAP - cs;

    // The width of big square
    const w = SVG_SIZE - (2 * gap) - (2 * cs);
    // The position of the big square
    const pos = (SVG_SIZE - w) / 2;

    return (
        <svg viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}>
            <rect x={pos} y={pos} width={w} height={w} rx={SVG_ROUNDNESS} ry={SVG_ROUNDNESS} />

            <path d={`M ${lcx},${cy} l ${-cs},${cs} l ${cs},${cs}`} />
            <path d={`M ${rcx},${cy} l ${cs},${cs} l ${-cs},${cs}`} />
        </svg>
    );
}
