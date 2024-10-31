import {useCallback, useEffect, useRef} from "react";
import {Size} from "spotlight/utils/size";
import {getWindowSize} from "spotlight/utils/windows";
import {objectsEqual} from "spotlight/utils/objects/objectsEqual";

export function useWindowSize(onResize?: (size: Size) => void, deps: any[] = [], runOnEffect = false) {
    const windowSize = useRef(getWindowSize());

    const listener = useCallback(() => {
        const newSize = getWindowSize();

        if (!objectsEqual(newSize, windowSize.current)) {
            onResize && onResize(windowSize.current = newSize);
        }
    }, [onResize]);

    useEffect(() => {
        if (runOnEffect) {
            onResize && onResize(windowSize.current);
        }

        window.addEventListener("resize", listener);

        return () => window.removeEventListener("resize", listener);
    }, deps);

    return windowSize.current;
}
