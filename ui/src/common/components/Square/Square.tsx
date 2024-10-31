import React, {HTMLAttributes} from "react";
import classes from "./Square.pcss";
import {classList} from "spotlight/utils/jsx/classes";

export type Props = HTMLAttributes<HTMLDivElement> & {};

export function Square({className, children}: Props) {
    return (
        <div className={classList(classes.filler, className)}>
            <div className={classes.positioner}>
                {children}
            </div>
        </div>
    );
}
