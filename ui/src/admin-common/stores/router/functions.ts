import {RouterState} from "spotlight/admin-common/stores/router/index";
import {ParsedQuery, stringify} from "query-string";
import {cloneObj} from "spotlight/utils/objects/cloneObj";
import {withPartial} from "spotlight/utils/objects/withPartial";
import {extractFromArray} from "spotlight/utils/arrays/extractFromArray";

export function getRoutePath(state: RouterState) {
    return createPath(state, state.query);
}

export function getRouteParam(state: RouterState, param: string) {
    return extractFromArray(state.query[param]);
}

export function routeSetQuery(state: RouterState, query: ParsedQuery) {
    return createPath(state, withPartial(query, {page: state.query.page}));
}

export function routeWithQuery(state: RouterState, query: ParsedQuery) {
    return createPath(state, withPartial(state.query, query));
}

export function routeWithoutParam(state: RouterState, param: string) {
    const obj = cloneObj(state.query);
    delete obj[param];

    return createPath(state, obj);
}

/**
 * Creates a path with the given query values.
 *
 * Any existing query params will be stripped from the resulting path. Only query params given in the argument
 * will be present, with the exception of WordPress "page" param.
 *
 * @param state
 * @param query
 */
export function getRouteRelUrl(state: RouterState, query: ParsedQuery) {
    return createPath(state, withPartial({page: state.query["page"]}, query));
}

/**
 * Similar to {@link getRouteRelUrl} but returns an absolute URL.
 *
 * @param state
 * @param query
 */
export function getRouteAbsUrl(state: RouterState, query: ParsedQuery) {
    return state.baseUrl + getRouteRelUrl(state, query);
}

// Creates a path from a query
export function createPath(state: RouterState, query: ParsedQuery) {
    return state.pathName + "?" + stringify(sanitizeQuery(query));
}

// Prepares a query by removing empty query params
function sanitizeQuery(query: ParsedQuery) {
    const obj = cloneObj(query);

    Object.getOwnPropertyNames(query).forEach(param => {
        if (query[param] && query[param].length === 0) {
            delete obj[param];
        }
    });

    return obj;
}
