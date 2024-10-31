import {cloneObj} from "./cloneObj";
import {applyPartial} from "./applyPartial";
import {RecursivePartial} from "spotlight/utils/types";

export function withPartial<T extends object>(target: T, changes: Partial<T>, recursive: boolean = false): T {
    if (target === changes) {
        return target;
    }

    return applyPartial(cloneObj(target), changes, recursive);
}

export function withRecursivePartial<T extends {}>(target: T, changes: RecursivePartial<T>) {
    // @ts-ignore
    return withPartial(target, changes, true);
}
