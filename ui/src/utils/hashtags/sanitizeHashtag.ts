import {unprefix} from "spotlight/utils/strings/unprefix";

export function sanitizeHashtag(h: string) {
    const parts = unprefix(h, "#").split(/\s/);

    const camelCase = parts.map((p, idx) => {
        return idx > 0
            ? p.charAt(0).toUpperCase() + p.substr(1)
            : p;
    });

    return camelCase.join("");
}
