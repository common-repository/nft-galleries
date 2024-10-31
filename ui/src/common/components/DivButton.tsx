import React, {HTMLAttributes} from "react";
import {useKeyboardActivate} from "spotlight/utils/react/useKeyboardActivate";

export type Props = HTMLAttributes<HTMLDivElement>;

export const DivButton = React.forwardRef<HTMLDivElement, Props>(({onClick, ...props}, ref) => {
    const onKeyDown = useKeyboardActivate(onClick);

    return <div ref={ref} role="button" tabIndex={0} onKeyDown={onKeyDown} onClick={onClick} {...props} />;
});
