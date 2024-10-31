import {cloneObj} from "spotlight/utils/objects/cloneObj";
import {objectsEqual} from "spotlight/utils/objects/objectsEqual";

/**
 * A dictionary is a plain Javascript object whose properties all map to values of the same type.
 *
 * This is very similar to TypeScript's {@link Record} type, but with one key difference. The dictionary type does
 * not contain any information about the object's keys. For this reason, the intended use of a dictionary is more
 * similar to that of a {@link Map}.
 *
 * Dictionaries can be used instead of maps in cases where a plain data structure is preferred, such as if the data is
 * expected to be transmitted over the network to a server. While maps can be converted into plain objects, the process
 * can be rather inefficient and in many cases would require a reverse conversion back into a map.
 *
 * In Javascript, objects contain information about their properties to allow them to be used as maps. This API
 * provides a set of functions that closely mimic the API of a Map, together with some additional iteration features
 * to allow a dictionary to be also treated as a list.
 */
export type Dictionary<T = any> = {
    [k: string]: T;
}

export namespace Dictionary {
    /**
     * Checks if a dictionary contains a key.
     *
     * @param dict The dictionary to check.
     * @param key The check to look for in the dictionary.
     *
     * @return True if the key is found in the dictionary, false if not.
     */
    export function has<T>(dict: Dictionary<T>, key: string | number) {
        return (dict ?? {}).hasOwnProperty(key.toString());
    }

    /**
     * Retrieves an entry from a dictionary by key.
     *
     * @param dict The dictionary to read from.
     * @param key The key of the entry to retrieve.
     *
     * @return The value that corresponds to the given key, or undefined if the key does not exist in the dictionary.
     */
    export function get<T>(dict: Dictionary<T>, key: string | number) {
        if (!key || !dict) {
            return undefined;
        }

        return dict[key.toString()];
    }

    /**
     * Sets the value of an entry in the dictionary.
     *
     * @param dict The dictionary to write to.
     * @param key The key of the entry to be written to.
     * @param value The value to write to the given key.
     *
     * @return The dictionary given as argument.
     */
    export function set<T>(dict: Dictionary<T>, key: string | number, value: T) {
        dict = dict ?? {};
        dict[key.toString()] = value;

        return dict;
    }

    /**
     * Calls {@link set} on a dictionary, but only if the key does not exist in the dictionary.
     *
     * @param dict The dictionary to write to.
     * @param key The key of the entry to be written to, if it does not exist.
     * @param value The value to write to the given key, if that key does not exist.
     *
     * @return The value that corresponds to the given key, which may be equal to the `value` argument if the key did
     *         not previously exist.
     */
    export function ensure<T>(dict: Dictionary<T>, key: string | number, value: T) {
        if (!has(dict, key)) {
            set(dict, key, value);
        }

        return Dictionary.get(dict, key);
    }

    /**
     * Creates a copy of the dictionary with a different entry.
     *
     * @param dict The dictionary from which to derive the new dictionary from.
     * @param key The key of the entry to modify in the derived dictionary.
     * @param value The value to set to the given key of the copied dictionary.
     *
     * @return The derived dictionary.
     */
    export function withEntry<T>(dict: Dictionary<T>, key: string | number, value: T) {
        return Dictionary.set(cloneObj(dict ?? {}), key, value);
    }

    /**
     * Removes an entry from a dictionary.
     *
     * @param dict The dictionary from which to remove the entry.
     * @param key The key of the entry to remove.
     *
     * @return The dictionary given as argument.
     */
    export function remove<T>(dict: Dictionary<T>, key: string | number) {
        dict = dict ?? {};
        delete dict[key.toString()];

        return dict;
    }

    /**
     * Removes all entries from a dictionary.
     *
     * @param dict The dictionary whose entries will be removed.
     *
     * @return The dictionary given as argument.
     */
    export function clear<T>(dict: Dictionary<T>) {
        dict = dict ?? {};

        Dictionary.keys(dict).forEach(key => Dictionary.remove(dict, key));

        return dict;
    }

    /**
     * Creates a copy of the dictionary without a specific entry.
     *
     * @param dict The dictionary from which to derive the new dictionary from.
     * @param key The key of the entry to omit from the derived dictionary.
     *
     * @return The derived dictionary.
     */
    export function without<T>(dict: Dictionary<T>, key: string | number) {
        return Dictionary.remove(cloneObj(dict ?? {}), key);
    }

    /**
     * Retrieves a value from the dictionary that corresponds to the key at the given position.
     *
     * @param dict The dictionary to read from.
     * @param pos The position of the key whose corresponding value should be returned.
     *
     * @return The value that corresponds to the Nth key, where N is the given `pos` argument.
     */
    export function at<T>(dict: Dictionary<T>, pos: number) {
        return get(dict, Dictionary.keys(dict)[pos]);
    }

    /**
     * Retrieves the list of keys for a dictionary.
     *
     * @param dict The dictionary whose keys to retrieve.
     *
     * @return An array containing the dictionary's keys, as strings.
     */
    export function keys<T>(dict: Dictionary<T>) {
        return Object.keys(dict ?? {});
    }

    /**
     * Retrieves the list of values for a dictionary.
     *
     * @param dict The dictionary whose values to retrieve.
     *
     * @return An array containing the dictionary's values.
     */
    export function values<T>(dict: Dictionary<T>): T[] {
        return Object.values(dict ?? {});
    }

    /**
     * Retrieves the list of entries for a dictionary.
     *
     * @param dict The dictionary whose entries to retrieve.
     *
     * @return An array containing the dictionary's entries, each as a tuple containing the key and value in that order.
     */
    export function entries<T>(dict: Dictionary<T>): [string, T][] {
        return Dictionary.keys(dict).map(key => [key, dict[key]]);
    }

    /**
     * Creates a new dictionary that contains the results of calling a function on each value in a given dictionary.
     *
     * @param dict The dictionary from which to derive the new dictionary.
     * @param fn The mapping function to call for each entry. Receives the value and key as arguments in that order.
     *
     * @return The new dictionary, containing the same keys as the original but each value is the return value of
     *         the given function when called with the value of the original dictionary.
     */
    export function map<T, U>(dict: Dictionary<T>, fn: (value: T, key: string) => U) {
        const newDict = {};

        Dictionary.forEach(dict, (k, v) => newDict[k] = fn(v, k));

        return newDict;
    }

    /**
     * Retrieves the size of a dictionary.
     *
     * @param dict The dictionary whose size to retrieve.
     *
     * @return The number of entries in the given dictionary.
     */
    export function size<T>(dict: Dictionary<T>) {
        return Dictionary.keys(dict ?? {}).length;
    }

    /**
     * Checks if a dictionary is empty.
     *
     * @param dict The dictionary to check.
     *
     * @return True if the dictionary is empty, false if not.
     */
    export function isEmpty<T>(dict: Dictionary<T>) {
        return Dictionary.size(dict ?? {}) === 0;
    }

    /**
     * Checks whether or not two dictionaries have equal contents.
     *
     * @param a The first dictionary.
     * @param b The second dictionary.
     *
     * @return true If the dictionaries have equal contents, false if not.
     */
    export function equals<T, U>(a: Dictionary<T>, b: Dictionary<U>) {
        return objectsEqual(a, b);
    }

    /**
     * Calls a function for each entry in a dictionary.
     *
     * @param dict The dictionary.
     * @param fn The function to call for each entry in the dictionary. Receives the key and value as arguments, in
     *           that order.
     */
    export function forEach<T>(dict: Dictionary<T>, fn: (key: string, value: T) => void) {
        Dictionary.keys(dict).forEach(key => fn(key, dict[key]));
    }

    /**
     * Creates a new dictionary from an array of entries.
     *
     * @param array The array from which to create the dictionary. Each element should be a tuple of the key and value.
     *
     * @return The created dictionary.
     */
    export function fromArray<T>(array: [string | number, T][]) {
        const dict = {};

        array.forEach(([key, value]) => Dictionary.set(dict, key, value));

        return dict;
    }

    /**
     * Creates a new dictionary from a {@link Map} instance.
     *
     * @param map The map from which to create the dictionary.
     *
     * @return The created dictionary.
     */
    export function fromMap<T>(map: Map<string | number, T>) {
        const dict = {};

        map.forEach((value, key) => Dictionary.set(dict, key, value));

        return dict;
    }
}
