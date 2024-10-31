import React, {ReactNode} from "react";
import classes from "./Sidebar.pcss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    padded?: boolean;
    disabled?: boolean;
}

export function Sidebar({children, padded, disabled, ...props}: Props) {
    return (
        <div className={disabled ? classes.disabled : classes.sidebar} {...props}>
            <div className={padded ? classes.paddedContent : classes.content}>
                {children ?? null}
            </div>
        </div>
    );
}

export namespace Sidebar {
    export const padded = classes.padded;
}
