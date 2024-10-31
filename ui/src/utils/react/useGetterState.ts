import React from "react";

/**
 * Hook similar to React.useState but provides a getter method in addition to a setter method.
 *
 * The getter method can be used to late-resolve the value of the state, which is particularly useful in callback and
 * event listener functions where capturing the state's value may result in a stale state value.
 *
 * Note: The setter function currently does not support function arguments.
 *
 * @param initial The initial state value.
 * @return An array with 3 elements: the state value, the getter function and the setter function.
 */
export function useGetterState<T>(initial?: T): [T, () => T, (arg: T) => void] {
    const [value, setter] = React.useState<T>(initial);
    const stateRef = React.useRef<T>(value);

    return [
        value,
        () => stateRef.current,
        (arg: T) => setter(stateRef.current = arg),
    ];
}
