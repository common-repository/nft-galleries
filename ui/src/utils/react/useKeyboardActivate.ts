import React from "react";

/**
 * Creates a keyboard listener that listens to ENTER and SPACE keys and forwards the call to another function.
 *
 * This is useful in cases where you want an element to behave like a button and allow ENTER and SPACE to trigger the
 * same handler that is used for onClick events.
 *
 * @param fn The function to call.
 */
export function useKeyboardActivate(fn?: (a?: any) => void) {
    return (e: React.KeyboardEvent) => {
        if (e.key === " " || e.key === "Enter") {
            fn && fn(e);
            e.preventDefault();
            e.stopPropagation();
        }
    };
}
