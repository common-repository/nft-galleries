import React, {useEffect} from "react";

export function useDelayedFlag<T extends HTMLElement>(dep: any, value: boolean, delay: number = 100) {
    const [state, setState] = React.useState(dep);

    useEffect(() => {
        let timeout = null;

        if (dep === value) {
            timeout = setTimeout(() => setState(value), delay);
        } else {
            setState(!value);
        }

        return () => {
            if (timeout !== null) clearTimeout(timeout);
        };
    }, [dep]);

    return [state, setState];
}
