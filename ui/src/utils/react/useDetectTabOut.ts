import {MutableRefObject, useEffect} from "react";

export function useDetectTabOut<T extends HTMLElement>(refs: Array<MutableRefObject<T>>, callback: () => void) {
    useEffect(() => {
        const listener = () => {
            const focused = refs.filter(ref => !ref.current
                || document.activeElement === ref.current
                || ref.current.contains(document.activeElement),
            );

            if (focused.length === 0) {
                callback();
            }
        };

        document.addEventListener("keyup", listener);

        return () => document.removeEventListener("keyup", listener);
    }, refs);
}
