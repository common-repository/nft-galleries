import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {parse as parseQuery, ParsedQuery} from "query-string";
import {createBrowserHistory} from "history";
import {createPath} from "spotlight/admin-common/stores/router/functions";
import {withPartial} from "spotlight/utils/objects/withPartial";
import {Dictionary} from "spotlight/utils/dictionary";
import {uniqueNum} from "spotlight/utils/numbers/uniqueNum";

export type RouterState = {
    /**
     * The path of the current page.
     * This is not expected to change, and should typically be "/wp-admin/admin.php".
     * The protocol, host and port are NOT part of this string.
     */
    baseUrl: string;
    /**
     * The path of the current page.
     * This is not expected to change, and should typically be "/wp-admin/admin.php".
     * The protocol, host and port are NOT part of this string.
     */
    pathName: string;
    /**
     * The parsed query.
     * This is basically a simple JS object that maps query param names to their corresponding values.
     * This object will change when the app navigates to different pages
     */
    query: ParsedQuery;
};

// The type for a store's state that includes the router slice's state
export type StateWithRouter = {
    router: RouterState;
}

export type RouteInterceptor = (route: ParsedQuery, path: string) => boolean | void;

// The browser history instance
export const RouterHistory = createBrowserHistory();

// List of functions that intercept routing
const interceptors: Dictionary<RouteInterceptor> = {};

/**
 * Adds a route interceptor.
 *
 * @param interceptor A function that receives the new route query and path string, and can return false to reject the
 *                    routing, stopping navigation.
 */
export function addRouteInterceptor(interceptor: RouteInterceptor): () => void {
    const key = "ri" + uniqueNum();
    Dictionary.set(interceptors, key, interceptor);

    return () => Dictionary.remove(interceptors, key);
}

/**
 * Used by the reducers to update the route in the state.
 *
 * Can be either given a query, a path, or both. If either of them are null or undefined, they will be calculated from
 * the other. For this reason, at least one of the params MUST be provided.
 */
function updateRoute(state: RouterState, query?: ParsedQuery, path?: string) {
    if (!path && !query) {
        throw "updateRoute() must be given either a query or a path!";
    }

    path = path ?? createPath(state, query);
    query = query ?? parseQuery(path);

    // If some interceptor returns false, do nothing
    const interceptorList = Dictionary.values(interceptors);
    if (interceptorList.some(i => i(query, path) === false)) {
        return;
    }

    state.query = query;
    doBrowserNavigation(path);
}

/**
 * Performs browser navigation to a specific path.
 *
 * The navigation MUST be run asynchronously, since the navigation can result in newly mounted components trying to
 * access the store's state (via store.getState(), useSelector, etc..), and accessing the state before a reducer has
 * finished running is not allowed by redux.
 */
function doBrowserNavigation(path: string) {
    setTimeout(() => RouterHistory.push(path, {}));
}

/**
 * Generates a router state from a location (or the current location if the param is omitted)
 */
function generateState(location?: Location): RouterState {
    location = location ?? window.location;

    return {
        baseUrl: location.protocol + "//" + location.host,
        pathName: location.pathname,
        query: {...parseQuery(location.search)},
    };
}

// The slice for the router
export const RouterSlice = createSlice({
    name: "router",
    initialState: generateState(),
    reducers: {
        gotoUrl(state, action: PayloadAction<string>) {
            updateRoute(state, null, action.payload);
        },
        gotoRoute(state, action: PayloadAction<ParsedQuery>) {
            const query = withPartial({page: state.query.page}, action.payload);
            updateRoute(state, query);
        },
        gotoScreen(state, action: PayloadAction<string>) {
            updateRoute(state, {
                page: state.query.page,
                screen: action.payload,
            });
        },
        modifyRoute(state, action: PayloadAction<ParsedQuery>) {
            const page = state.query.page;
            const query = withPartial(state.query, action.payload);
            query.page = page;

            updateRoute(state, query);
        },
    },
});

export const gotoUrl = RouterSlice.actions.gotoUrl;
export const gotoRoute = RouterSlice.actions.gotoRoute;
export const gotoScreen = RouterSlice.actions.gotoScreen;
export const modifyRoute = RouterSlice.actions.modifyRoute;
export * from "./hooks";
