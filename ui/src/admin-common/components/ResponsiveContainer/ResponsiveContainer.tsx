import React, {ReactElement, ReactNode, useEffect} from "react";
import {getWindowSize} from "spotlight/utils/windows";
import {useWindowSize} from "spotlight/utils/react/useWindowSize";

interface Props {
    breakpoints: Array<number>;
    render?: (breakpoint) => ReactElement;
    children?: ReactNode;
}

export const ResponsiveContext = React.createContext(0);

export function ResponsiveContainer({breakpoints, render, children}: Props) {
    const [currBreakPoint, setCurrBreakPoint] = React.useState<number>(null);

    // Re-calculates the current breakpoint for the current window size
    const handleResize = React.useCallback((size) => {
        setCurrBreakPoint(() => {
            // Iterates the breakpoints list to find the smallest breakpoint that is smaller or equal to
            // the current window width
            return breakpoints.reduce((smallest, breakpoint) => {
                return (size.width <= breakpoint && breakpoint < smallest)
                    ? breakpoint
                    : smallest;
            }, Infinity);
        });
    }, [breakpoints]);

    useWindowSize(handleResize, [setCurrBreakPoint], true);

    const content = render
        ? render(currBreakPoint)
        : children;

    return (
        <ResponsiveContext.Provider value={currBreakPoint}>
            {currBreakPoint !== null ? content : null}
        </ResponsiveContext.Provider>
    );
}
