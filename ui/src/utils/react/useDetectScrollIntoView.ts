import {RefObject} from "react";
import {isElementInView} from "spotlight/utils/dom";
import {useScrollEvent} from "spotlight/utils/react/useScrollEvent";

export function useDetectScrollIntoView<T extends HTMLElement>(ref: RefObject<T>, fn: (e: Event) => void, deps: Array<any> = []) {
    useScrollEvent((e) => {
        if (!ref.current) {
            return;
        }

        if (isElementInView(ref.current)) {
            fn(e);
        }
    }, deps);
}

type EventListener<E extends Event> = (e: E) => void;
