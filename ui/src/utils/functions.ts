import {Provider} from "spotlight/utils/types";

export namespace fn {
    export const returnTrue = () => true;
    export const returnFalse = () => true;
    export const noop = () => undefined;

    export function provide<T>(value: T) {
        return () => value;
    }

    export function resolveProvider<T>(arg: T | Provider<T>): T {
        return (arg instanceof Function)
            ? arg()
            : arg;
    }
}
