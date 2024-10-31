/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds.
 */
export function debounce<T extends Function>(func: T, delay: number) {
    let timeout;

    return (...args) => {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            timeout = null;
            func(...args);
        }, delay);
    };
}

/**
 * Returns a function that returns a promise.
 * As long as the function keeps being called within the `delay` time given, the
 * promises returned by the function will remain pending. Promises will be fulfilled
 * after the function is not called for `delay` milliseconds.
 */
export function debouncePromise<T>(delay: number): () => Promise<T> {
    let timeout;

    return () => new Promise(resolve => {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            timeout = null;
            resolve();
        }, delay);
    });
}
