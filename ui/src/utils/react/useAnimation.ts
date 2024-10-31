import React, {useEffect} from "react";

/**
 * Creates an delayed mirror of a flag, that can be used to create animations for elements that are conditionally
 * rendered into the DOM.
 *
 * The function returns two booleans:
 * 1. The first boolean should be used for animation logic; HTML classes, styles, icons, etc.
 * 2. The second boolean should be used to determine whether the target element should be rendered or not.
 *
 * Example usage:
 *
 * ```
 * const [isOpen, shouldRender] = useAnimation(store.isOpen, (v) => store.isOpen = v);
 * const className = isOpen ? "element element--open" : "element";
 * return !shouldRender ? null : <div className={className}/>
 * ```
 *
 * @param flag The original flag.
 * @param setter A setter function for the flag.
 * @param renderWhen The boolean value of the flag for which the element is rendered. Default is true.
 * @param delay The delay to use. Typically this is equal to the length of the animation.
 */
export function useAnimation(flag: boolean, setter: (value) => void, renderWhen: boolean = true, delay: number = 100) {
    const [state, setState] = React.useState(!!flag);
    const [shouldRender, setShouldRender] = React.useState(flag === renderWhen);

    useEffect(() => {
        let timeout = null;

        if (flag === renderWhen) {
            // The element should be rendered and animated
            setShouldRender(true);
            timeout = setTimeout(() => setState(flag), 20);
        } else {
            // The element should be animated and de-rendered later
            setState(flag);
            timeout = setTimeout(() => setShouldRender(false), delay);
        }

        return () => {
            if (timeout !== null) clearTimeout(timeout);
        };
    }, [flag]);

    return [state, shouldRender];
}
