import {areEqual} from "spotlight/utils/generic/areEqual";

export function objectsEqual(a: any, b: any) {
    if (!a || !b || typeof a !== "object" || typeof b !== "object") {
        return areEqual(a, b);
    }

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) {
        return false;
    }

    const keys = new Set(keysA.concat(keysB));

    for (const key of keys) {
        if (!areEqual(a[key], b[key])) {
            return false;
        }
    }

    return true;
}
