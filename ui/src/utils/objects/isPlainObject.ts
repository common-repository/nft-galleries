/**
 * Checks if a value is a non-null and non-array object.
 *
 * @param value
 */
export function isPlainObject<T extends {}>(value): value is T {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}
