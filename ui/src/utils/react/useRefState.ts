import React, {Dispatch, MutableRefObject, SetStateAction} from "react";

export function useRefState<T>(initial: T): [MutableRefObject<T>, Dispatch<SetStateAction<T>>] {
    const [state, setState] = React.useState<T>(initial);
    const ref = React.useRef(state);
    ref.current = state;

    return [ref, setState];
}
