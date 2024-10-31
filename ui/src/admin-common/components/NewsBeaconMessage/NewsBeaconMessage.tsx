import React, {useEffect} from "react";
import styles from "./NewsBeaconMessage.pcss";
import fromUnixTime from "date-fns/fromUnixTime";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import {parse as parseQuery} from "query-string";
import {NewsMessage} from "spotlight/admin-common/stores/news";
import {useDispatch, useSelector} from "react-redux";
import {selectRoute} from "spotlight/admin-common/stores/router/selectors";
import {gotoRoute} from "spotlight/admin-common/stores/router";

interface Props {
    message: NewsMessage;
}

export function NewsBeaconMessage({message}: Props) {
    const dispatch = useDispatch();
    const route = useSelector(selectRoute);
    const main = React.useRef<HTMLDivElement>();

    useEffect(() => {
        if (!main.current) return;

        // Get all links in the main section of the notification and iterate them
        const links = main.current.getElementsByTagName("a");
        for (let i = 0; i < links.length; ++i) {
            const link = links.item(i);

            // Do not continue if we already processed this link
            if (link.getAttribute("data-snft-link") === "true") {
                continue;
            }

            // Check if the element links to a URL that starts with "app://"
            const href = link.getAttribute("href");
            if (!(typeof href === "string") || !href.startsWith("app://")) {
                continue;
            }

            // Generate the path and the full URL to the corresponding app page
            const query = parseQuery(href.substr("app://".length));
            const path = route.setQuery(query);
            const fullUrl = route.getAbsUrl(query);

            // Change the link's href URL and mark it with a custom attribute so we don't process it again later
            link.setAttribute("href", fullUrl);
            link.setAttribute("data-snft-link", "true");

            // Attach an click listener to route to the app page without a browser refresh
            link.addEventListener("click", (e) => {
                dispatch(gotoRoute(query));

                e.preventDefault();
                e.stopPropagation();
            });
        }
    }, [main.current]);

    return (
        <article className={styles.root}>
            {message.title && message.title.length && (
                <header className={styles.title}>
                    {message.title}
                </header>
            )}

            <main ref={main} className={styles.content} dangerouslySetInnerHTML={{__html: message.content}} />

            {message.date && (
                <footer className={styles.date}>
                    {formatDistanceToNow(fromUnixTime(message.date), {addSuffix: true})}
                </footer>
            )}
        </article>
    );
};
