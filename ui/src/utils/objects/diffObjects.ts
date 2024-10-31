import {areEqual} from "spotlight/utils/generic/areEqual";

export function diffObjects(a: object, b: object) {
    const diff = {};

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    const keys = new Set(keysA.concat(keysB));

    for (const key of keys) {
        if (!a.hasOwnProperty(key)) {
            diff[key] = b[key];
            continue;
        }

        if (!b.hasOwnProperty(key)) {
            diff[key] = a[key];
            continue;
        }

        if (!areEqual(a[key], b[key])) {
            diff[key] = b[key];
        }
    }

    return diff;
}
