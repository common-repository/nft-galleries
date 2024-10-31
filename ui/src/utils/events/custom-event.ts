export function createCustomEvent<T>(type: string, details?: T): CustomEvent<T> {
    return new CustomEvent<T>(type, {
        detail: details,
    });
}
