import React, {ReactNode} from "react";
import classes from "./BigToggleButton.pcss";
import {useKeyboardActivate} from "spotlight/utils/react/useKeyboardActivate";

interface Props {
    active?: boolean;
    onClick?: () => void;
    children?: ReactNode;
}

export function BigToggleButton({active, onClick, children}: Props) {
    const onKeyPress = useKeyboardActivate(onClick);

    return (
        <button className={active ? classes.active : classes.inactive} onClick={onClick} onKeyPress={onKeyPress}>
            {children}
        </button>
    );
}
