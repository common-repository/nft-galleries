import React from "react";
import classes from "./UnitInput.pcss";

interface Props extends React.HTMLProps<HTMLInputElement> {
    unit: string;
}

export function UnitInput({className, unit, ...props}: Props) {
    return (
        <div className={classes.root}>
            <input {...props} className={`${classes.field} ${className ?? ""}`} />

            <div className={classes.unit}>
                <span>{unit}</span>
            </div>
        </div>
    );
}
