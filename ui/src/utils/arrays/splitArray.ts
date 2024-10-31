/**
 * Splits an array into sub-arrays.
 *
 * @param subject The array to split.
 * @param num The number of sub-arrays to create.
 */
export function splitArray<T>(subject: Array<T>, num: number) {
    const result: T[][] = [];

    subject.forEach((item, itemIdx) => {
        const listIdx = itemIdx % num;

        if (!Array.isArray(result[listIdx])) {
            result[listIdx] = [item];
        } else {
            result[listIdx].push(item);
        }
    });

    return result;
}
