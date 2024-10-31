export function isElementInView(element) {
    const rect = element.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Strips HTML text from a given string.
 *
 * @param html The string to strip HTML tags from.
 *
 * @return The string without any HTML tags.
 */
export function stripHtml(html: string) {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;

    return tmp.textContent || tmp.innerText || "";
}

/**
 * Retrieves a rectangle object containing the absolute position of an element on the page.
 *
 * @param elem
 */
export function getAbsoluteRect(elem: Element) {
    const rect = elem.getBoundingClientRect();

    return {
        top: rect.top + window.scrollY,
        bottom: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        right: rect.right + window.scrollX,
        width: rect.width,
        height: rect.height,
    };
}

/**
 * Runs a function when the DOM is ready.
 *
 * This also caters for scenarios where the DOM was already ready before this function was called. The callback will
 * still be called.
 *
 * @param runFn The callback to run when/if the DOM is ready.
 */
export function runWhenDomReady(runFn: () => void) {
    let didRun = false;

    // This tries to run the function, but only if the document is ready
    const tryRun = () => {
        if (!didRun && (document.readyState === "interactive" || document.readyState === "complete")) {
            runFn();
            didRun = true;
        }
    };

    // Try to run the function immediately
    tryRun();

    // If the function did not run, try to run it later when the document is ready
    if (!didRun) {
        document.addEventListener("readystatechange", tryRun);
    }
}

export function isInIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

export function isScrollable(elem: HTMLElement): boolean {
    if (elem.scrollHeight > elem.clientHeight) {
        return true;
    }

    const style = window.getComputedStyle(elem);

    return (
        style.overflowX === "scroll" || style.overflowX === "auto" ||
        style.overflowY === "scroll" || style.overflowY === "auto"
    );
}

export function getScrollParent(elem: HTMLElement): [HTMLElement, number] {
    if (elem === null) {
        return [null, 0];
    }

    if (isScrollable(elem)) {
        return [elem, elem.offsetTop];
    } else {
        const [parent, parentTop] = getScrollParent(elem.parentElement);

        return [parent, elem.offsetTop + parentTop];
    }
}

export function scrollIntoView(elem: HTMLElement, options?: Partial<ScrollToOptions>) {
    const [parent, offset] = getScrollParent(elem);

    options = {
        ...options,
        top: offset + (options.top ?? 0),
    };

    setTimeout(() => parent?.scroll(options), 1);
}
