import {useEffect} from "react";

export function useScrollEvent<T extends HTMLElement>(fn: (e: Event) => void, deps: Array<any> = []) {
    let scrollTick = false;

    const listener = (e: Event) => {
        if (!scrollTick) {
            window.requestAnimationFrame(function () {
                fn(e);
                scrollTick = false;
            });

            scrollTick = true;
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", listener, true);

        return () => {
            window.removeEventListener("scroll", listener, true);
        };
    }, deps);
}
