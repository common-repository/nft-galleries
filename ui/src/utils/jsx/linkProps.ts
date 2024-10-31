import {targetNewTab} from "spotlight/utils/jsx/targetNewTab";

export function linkProps(link: { url: string, newTab?: boolean }) {
    return {
        href: link.url,
        target: targetNewTab(link.newTab),
    };
}
