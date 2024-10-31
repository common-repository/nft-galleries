import {useState} from "react";
import {useForceUpdate} from "spotlight/utils/react/useForceUpdate";
import {applyPartial} from "spotlight/utils/objects/applyPartial";

type Action<T extends object> = Partial<T> | ((val: T) => Partial<T>);
type SetterFn<T extends object> = (action: Action<T>) => void;

export function useObjectState<T extends object>(initialState: T | (() => T) = undefined): [T, SetterFn<T>] {
    const [obj] = useState<T>(initialState);
    const forceUpdate = useForceUpdate();

    const setter = React.useCallback((action: Action<T>) => {
        applyPartial(obj, action instanceof Function ? action(obj) : action);
        forceUpdate();
    }, [obj]);

    return [obj, setter];
}
