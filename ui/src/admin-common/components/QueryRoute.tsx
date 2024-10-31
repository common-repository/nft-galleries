import React, {ReactElement} from "react";
import {useUrlParams} from "spotlight/utils/react/useUrlParams";

interface Props {
    when: string;
    is: string;
    isRoot?: boolean;
    render: () => ReactElement;
}

/**
 * A route that uses a query param as its "condition".
 *
 * @param when The name of the param.
 * @param is The value the param should be equal to.
 * @param isRoot Whether or not the route should also match when the query param is omitted.
 * @param render The render function.
 */
export function QueryRoute({when, is, isRoot, render}: Props) {
    const query = useUrlParams().get(when);

    return (query === is || (!is && !query) || (isRoot && !query))
        ? render()
        : null;
}
