import React, {ReactNode} from "react";
import classes from "./SpoilerProLabel.pcss";
import {ProPill} from "spotlight/admin-common/components/ProPill/ProPill";

interface Props {
    children: ReactNode;
}

export function SpoilerProLabel({children}: Props) {
    return (
        <div>
            <div className={classes.proPill}>
                <ProPill />
            </div>
            <span>{children}</span>
        </div>
    );
}
