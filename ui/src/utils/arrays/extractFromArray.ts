/**
 * Retrieves either the first value from the argument array, or the argument as-is if it's not an array.
 *
 * @param arg The value or array of values.
 *
 * @return If the argument is an array, returns the first argument. Otherwise returns the argument.
 */
export function extractFromArray<T>(arg: T | T[]) {
    return Array.isArray(arg) ? arg[0] : arg;
}
