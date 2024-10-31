import {useEffect} from "react";

/**
 * Hook for using a timeout.
 *
 * @param duration The duration of the timeout.
 * @param fn The function to run.
 * @param deps Optional dependencies for the effect.
 */
export function useTimeout(duration: number, fn: () => void, deps: Array<any> = []) {
    useEffect(() => {
        const timeout = setTimeout(fn, duration);

        return () => clearTimeout(timeout);
    }, deps);
}
