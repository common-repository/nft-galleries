import {useEffect} from "react";

export type EventListener<E extends Event> = (e: E) => void;

/**
 * Hook for using an event listener on a node.
 *
 * @param subject The node to which to attach the event listener.
 * @param type The event type.
 * @param listener The listener function.
 * @param when Optional flags that control whe the listener is registered.
 * @param deps Options list of effect dependencies.
 */
export function useEventListener<E extends Event>(
    subject: EventTarget, type: string, listener: EventListener<E>, when: Array<boolean> = [], deps: Array<boolean> = [],
) {
    useEffect(() => {
        if (when.reduce((p, c) => p && c, true)) {
            subject.addEventListener(type, listener);
        }

        return () => subject.removeEventListener(type, listener);
    }, [...deps, listener]);
}

/**
 * Hook for using an event listener on the document.
 *
 * @param type The event type.
 * @param listener The listener function.
 * @param when Optional flags that control whe the listener is registered.
 * @param deps Options list of effect dependencies.
 */
export function useDocumentEventListener<E extends Event>(
    type: keyof DocumentEventMap | string, listener: EventListener<E>, when: Array<boolean> = [], deps: Array<any> = [],
) {
    useEventListener(document, type, listener, when, deps);
}

/**
 * Hook for using an event listener on the window.
 *
 * @param type The event type.
 * @param listener The listener function.
 * @param when Optional flags that control whe the listener is registered.
 * @param deps Options list of effect dependencies.
 */
export function useWindowEventListener<E extends Event>(
    type: keyof WindowEventMap, listener: EventListener<E>, when: Array<boolean> = [], deps: Array<any> = [],
) {
    useEventListener(window, type, listener, when, deps);
}
