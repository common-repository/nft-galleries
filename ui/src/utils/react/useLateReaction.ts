import React, {useEffect} from "react";

export function useLateReaction<T extends HTMLElement>(dep: any, delay: number = 100) {
    const [state, setState] = React.useState(dep);

    useEffect(() => {
        const timeout = setTimeout(() => setState(dep), delay);

        return () => clearTimeout(timeout);
    }, [dep]);

    return [state, setState];
}
