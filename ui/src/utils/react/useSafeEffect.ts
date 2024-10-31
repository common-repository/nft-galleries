import {useEffect, useLayoutEffect} from "react";

type SafeEffectPromise = () => Promise<void>;
type SafeEffectCallback = (ifSafe: SafeEffectPromise) => VoidFunction | void;
type EffectFn = (fn: VoidFunction, deps?: Array<any>) => void;

/**
 * A version of {@link useEffect()} that is registered using {@link createSafeEffect}.
 *
 * @param callback The effect callback.
 * @param deps The effect's dependencies.
 */
export function useSafeEffect(callback: SafeEffectCallback, deps?: Array<any>) {
    createSafeEffect(useEffect, callback, deps);
}

/**
 * A version of {@link useLayoutEffect()} that is registered using {@link createSafeEffect}.
 *
 * @param callback The effect callback.
 * @param deps The effect's dependencies.
 */
export function useSafeLayoutEffect(callback: SafeEffectCallback, deps?: Array<any>) {
    createSafeEffect(useLayoutEffect, callback, deps);
}


/**
 * Creates an effect that passes a promise to the callback that can be used to check if the effect was disposed (which
 * typically happens when a component has been unmounted).
 *
 * @param effectFn The original effect function to use to register the effect.
 * @param callback The effect callback.
 * @param deps The effect's dependencies.
 */
function createSafeEffect(effectFn: EffectFn, callback: SafeEffectCallback, deps?: Array<any>) {
    const safe = React.useRef(true);

    effectFn(() => {
        safe.current = true;

        const ifSafe = () => {
            return new Promise<void>(resolve => {
                if (safe.current) {
                    resolve();
                }
            });
        };

        const disposeFn = callback(ifSafe);

        return () => {
            safe.current = false;
            disposeFn && disposeFn();
        };
    }, deps);
}
