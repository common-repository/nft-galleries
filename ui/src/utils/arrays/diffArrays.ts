export function diffArrays<T>(a: Array<T>, b: Array<T>, c?: (a: T, b: T) => boolean) {
    c = c ?? ((x, y) => x === y);

    return a.filter(ax => !b.some(bx => c(ax, bx)));
}
