import React, {HTMLAttributes} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectRoute} from "spotlight/admin-common/stores/router/selectors";
import {ParsedQuery} from "query-string";
import {gotoRoute, modifyRoute} from "spotlight/admin-common/stores/router";

export type Props = HTMLAttributes<HTMLLinkElement> & {
    to?: ParsedQuery;
    newTab?: boolean;
    absolute?: boolean;
};

export function Link({to, onClick, newTab, absolute, ...props}: Props) {
    const dispatch = useDispatch();
    const route = useSelector(selectRoute);
    const href = absolute
        ? route.setQuery(to)
        : route.withQuery(to);

    const handleClick = (e: React.MouseEvent) => {
        if (newTab || e.button === 2) {
            window.open(href, "_blank");
        } else {
            const action = absolute
                ? gotoRoute(to)
                : modifyRoute(to);

            dispatch(action);
        }

        e.preventDefault();
        e.stopPropagation();
    };

    // @ts-ignore
    return <a href={href} onClick={handleClick} {...props} />;
}
