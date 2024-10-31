import {useState} from "react";

export function useForceUpdate() {
    const [, set] = useState();

    return React.useCallback(() => set({}), []);
}
