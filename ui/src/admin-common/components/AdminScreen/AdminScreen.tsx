import React, {ComponentType, ReactNode} from "react"
import classes from "./AdminScreen.pcss"
import {classList} from "spotlight/utils/jsx/classes"

interface Props {
    className?: string;
    navbar?: ComponentType;
    fillPage?: boolean;
    children?: ReactNode;
}

export function AdminScreen({navbar, className, fillPage, children}: Props) {
    const baseClassName = fillPage ? classes.fillPage : classes.adminScreen
    const fullClassName = classList(baseClassName, className)

    return (
        <div className={fullClassName}>
            {navbar && (
                <div className={classes.navbar}>
                    {React.createElement(navbar)}
                </div>
            )}
            <div className={classes.content}>
                {children}
            </div>
        </div>
    )
}
