export function uniqueValues<E = any>(arr: E[]) {
    return arr.filter((val, idx) => arr.indexOf(val) === idx);
}
