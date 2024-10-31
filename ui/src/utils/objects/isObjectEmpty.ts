export function isObjectEmpty(a: object | null | undefined) {
    return Object.keys(a ?? {}).length === 0;
}
