export function arraysEqualUnsorted<T>(a: Array<T>, b: Array<T>, c?: (a: T, b: T) => boolean) {
    c = c ?? ((x, y) => x === y);

    return a.every(x => b.some(y => c(x, y)))
        && b.every(x => a.some(y => c(x, y)));
}
