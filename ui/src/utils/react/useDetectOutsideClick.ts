import {MouseEvent, MutableRefObject, RefObject, useEffect} from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useDetectOutsideClick<T extends HTMLElement>(ref: MutableRefObject<T>, callback: (e: MouseEvent) => void, ignore: RefObject<Element>[] = [], deps: any[] = []) {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
        if (ref.current &&
            !ref.current.contains(event.target) &&
            !ignore.some(ref => ref?.current?.contains(event.target))
        ) {
            callback(event);
        }
    }

    useEffect(() => {
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchend", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchend", handleClickOutside);
        };
    }, deps);
}
