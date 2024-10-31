import React, {useEffect} from "react";

export function useDelay<T extends HTMLElement>(dep: any, setter: (value) => void, delay: number = 100) {
    const [state, setState] = React.useState(dep);

    useEffect(() => {
        let timeout = setTimeout(() => setState(dep), delay);

        return () => {
            if (timeout !== null) clearTimeout(timeout);
        };
    }, [dep]);

    const actualSetter = (value) => {
        setState(value);
        setTimeout(setter);
    };

    return [state, actualSetter];
}
