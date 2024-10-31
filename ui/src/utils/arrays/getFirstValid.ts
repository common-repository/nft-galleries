/**
 * Given a list of functions, returns the first value that passes validation.
 *
 * @param validate The validation function. Receives a function return value as argument as should return true if the
 *                 value is to be returned. If false is returned, the algorithm will continue invoking the remaining
 *                 source functions.
 * @param sources The list of source functions.
 *
 * @return The first return value from the source functions that passes validation, or undefined if no return value
 *         passed validation.
 */
export function getFirstValid<T>(validate: (value: T) => boolean, sources: Array<(() => T)>): T | undefined {
    for (const source of sources) {
        const result = source();
        const isValid = validate(result);

        if (isValid) {
            return result;
        }
    }

    return undefined;
}
