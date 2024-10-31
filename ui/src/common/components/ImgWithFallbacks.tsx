import React, {forwardRef, HTMLProps, RefObject, useRef, useState} from "react";
import {mergeRefs} from "spotlight/utils/jsx/mergeRefs";
import {uniqueValues} from "spotlight/utils/arrays/uniqueValues";

export type Props = Omit<HTMLProps<HTMLImageElement>, "src" | "srcSet"> & {
    sources: (string | null)[];
}

export const ImgWithFallbacks = forwardRef(
    function ImgWithFallbacks({sources, onError, ...props}: Props, pRef: RefObject<HTMLImageElement>) {
        sources = sources.filter(s => typeof s === "string" && s.length > 0);
        sources = uniqueValues(sources);

        const [currSrc, setCurrSrc] = useState(0);
        const ref = useRef<HTMLImageElement>();

        function handleError(e) {
            if (currSrc >= sources.length) {
                onError && onError(e);
            } else {
                setCurrSrc(s => ++s);
            }
        }

        // @ts-ignore
        return <img ref={mergeRefs(pRef, ref)} {...props} src={sources[currSrc]} onError={handleError} />;
    },
);
