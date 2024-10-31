import {isPlainObject} from "spotlight/utils/objects/isPlainObject";
import {RecursivePartial} from "spotlight/utils/types";

export function applyPartial<T>(target: T, changes: Partial<T>, recursive: boolean = false) {
    Object.keys(changes).forEach((key) => {
        if (recursive && isPlainObject(changes[key]) && isPlainObject(target[key])) {
            applyPartial(target[key], changes[key]);
        } else {
            target[key] = changes[key];
        }
    });

    return target;
}

export function applyRecursivePartial<T>(target: T, changes: RecursivePartial<T>) {
    // @ts-ignore
    return applyPartial(target, changes, true);
}
