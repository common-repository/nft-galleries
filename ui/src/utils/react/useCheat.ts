import React from "react";
import {useEventListener} from "spotlight/utils/react/useEventListener";

/**
 * Custom hook for detecting when unconsumed text input results in a particular string.
 *
 * @param cheat The string to detect.
 * @param callback The callback to invoke when the cheat text has been fully typed.
 */
export function useCheat(cheat: string, callback: () => void) {
    const text = React.useRef("");

    useEventListener(document, "keydown", (e: KeyboardEvent) => {
        if (e.target === document.body && /^[a-z ]$/i.test(e.key)) {
            text.current += e.key.toLowerCase();

            if (cheat.indexOf(text.current) !== 0) {
                text.current = "";
            } else if (text.current === cheat) {
                callback();
            }
        }
    });
}
