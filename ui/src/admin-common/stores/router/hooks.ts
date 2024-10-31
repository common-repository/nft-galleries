import {addRouteInterceptor, RouteInterceptor} from "spotlight/admin-common/stores/router/index";
import {useStore} from "react-redux";
import {useCallback, useEffect, useState} from "react";
import {ParsedQuery} from "query-string";
import {objectsEqual} from "spotlight/utils/objects/objectsEqual";

/**
 * React hook for using a route interceptor.
 *
 * @param interceptor The interceptor to use.
 * @param deps Dependencies for the effect.
 */
export function useRouteInterceptor(interceptor: RouteInterceptor, deps: any[]) {
    useEffect(() => addRouteInterceptor(interceptor), deps);
}

/**
 * @param message The confirmation message.
 * @param when A function that returns true if the confirmation should be shown.
 * @param deps Optional dependencies. Typically, these should be the dependencies of the `when` function.
 */
export function useUnload(message: string, when: RouteInterceptor, deps: any[] = []) {
    const store = useStore();
    const [initialRoute] = useState(() => store.getState().router.query);

    const decoratedInterceptor = useCallback((route: ParsedQuery, path: string) => {
        if (!objectsEqual(route, initialRoute) && when(route, path)) {
            return confirm(message);
        }
    }, [when, initialRoute, message]);

    useRouteInterceptor(decoratedInterceptor, deps);

    useEffect(() => {
        const handleUnload = (e) => {
            if (when({}, "")) {
                (e || window.event).returnValue = message; // Gecko + IE
                return message; // Gecko + Webkit, Safari, Chrome etc.
            }
        };

        window.addEventListener("beforeunload", handleUnload);

        return () => window.removeEventListener("beforeunload", handleUnload);
    }, deps);
}
