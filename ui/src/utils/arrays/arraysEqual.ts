import {areEqual} from "../generic/areEqual";

export function arraysEqual<T1, T2>(a: Array<T1 | T2>, b: Array<T1 | T2>, compare?: (a: T1 | T2, b: T1 | T2) => boolean) {
    if (a === b) {
        return true;
    }

    if (a.length !== b.length) {
        return false;
    }

    for (let i = 0; i < a.length; ++i) {
        if (compare) {
            if (!compare(a[i], b[i])) return false;
        } else {
            if (!areEqual(a[i], b[i])) return false;
        }
    }

    return true;
}
