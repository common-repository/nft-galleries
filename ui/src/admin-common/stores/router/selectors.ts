import {RouterState, StateWithRouter} from "spotlight/admin-common/stores/router/index";
import {ParsedQuery} from "query-string";
import {extractFromArray} from "spotlight/utils/arrays/extractFromArray";
import {
    getRouteAbsUrl,
    getRouteParam,
    getRoutePath,
    getRouteRelUrl,
    routeSetQuery,
    routeWithoutParam,
    routeWithQuery,
} from "spotlight/admin-common/stores/router/functions";

export const selectScreen = (state: StateWithRouter) => extractFromArray(state.router.query.screen) ?? "";
export const selectRoute = (state: StateWithRouter) => new RouteHelper(state.router);
export const selectQueryParam = (param: string) => (state: StateWithRouter) => getRouteParam(state.router, param);

class RouteHelper {
    protected state: RouterState;

    constructor(state: RouterState) {
        this.state = state;
    }

    get path() {
        return getRoutePath(this.state);
    }

    getParam(param: string) {
        return getRouteParam(this.state, param);
    }

    withQuery(q: ParsedQuery) {
        return routeWithQuery(this.state, q);
    }

    setQuery(q: ParsedQuery) {
        return routeSetQuery(this.state, q);
    }

    withoutParam(param: string) {
        return routeWithoutParam(this.state, param);
    }

    getRelUrl(q: ParsedQuery) {
        return getRouteRelUrl(this.state, q);
    }

    getAbsUrl(q: ParsedQuery) {
        return getRouteAbsUrl(this.state, q);
    }
}
