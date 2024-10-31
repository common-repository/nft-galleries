/**
 * Creates a copy of a given array with a changed entry.
 *
 * @param array The array to derive from.
 * @param idx The index of the entry whose value should be different in the new array.
 * @param value The value for the changed entry in the new array.
 *
 * @return A copy of the original array with the changed entry.
 */
export function arrayWith<T>(array: T[], idx: number, value: T) {
    const newArray = array.slice();
    newArray[idx] = value;

    return newArray;
}
