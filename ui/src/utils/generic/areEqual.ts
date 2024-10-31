import {arraysEqual} from "spotlight/utils/arrays/arraysEqual";
import {objectsEqual} from "spotlight/utils/objects/objectsEqual";

export function areEqual<T>(a: T, b: T) {
    if (Array.isArray(a) && Array.isArray(b)) {
        return arraysEqual(a, b);
    }

    if (a instanceof Map && b instanceof Map) {
        return arraysEqual(Array.from(a.entries()), Array.from(b.entries()));
    }

    if (typeof a === "object" && typeof b === "object" && a !== null && b !== null) {
        return objectsEqual(a, b);
    }

    return a === b;
}
