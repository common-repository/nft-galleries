import {areEqual} from "spotlight/utils/generic/areEqual";

export function isObjectSubsetOf(child: any, parent: any) {
    if (!child || !parent || typeof child !== "object" || typeof parent !== "object") {
        return areEqual(child, parent);
    }

    for (const key of Object.keys(child)) {
        if (!areEqual(child[key], parent[key])) {
            return false;
        }
    }

    return true;
}

// @ts-ignore
window.subset = isObjectSubsetOf;
