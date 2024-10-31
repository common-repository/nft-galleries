export function arrayToggleValue<T>(array: T[], value: T) {
    const result = array.slice();
    const index = result.findIndex(x => x == value);

    if (index >= 0) {
        result.splice(index, 1);
    } else {
        result.push(value);
    }

    return result;
}
