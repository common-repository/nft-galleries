import {useState} from "react"

type ValueSetter<T> = T | ((prev: T) => T);

function reduceValue<T>(setter: ValueSetter<T>, prev?: T): T {
    // @ts-ignore
    return (typeof setter === "function") ? setter(prev) : setter
}

export function useSavedState<T>(key: string, initialVal?: ValueSetter<T>): [T, (s: ValueSetter<T>) => void] {
    const [value, setValue] = useState<T>(() => {
        const json = localStorage.getItem(key);

        return (json === null)
            ? reduceValue(initialVal)
            : JSON.parse(json);
    })

    const setter = (setter: ValueSetter<T>) => {
        setValue(prev => {
            const newValue = reduceValue(setter, prev)
            localStorage.setItem(key, JSON.stringify(newValue))
            return newValue
        })
    }

    return [value, setter]
}
