import React, {ReactNode} from "react";
import classes from "./ErrorToast.pcss";
import {AdminResources} from "spotlight/admin-common/modules/admin-resources";

interface Props {
    message: string;
    children?: ReactNode;
}

export default function ErrorToast({message, children}: Props) {
    return (
        <div>
            <p className={classes.heading}>Spotlight has encountered an error:</p>
            <p className={classes.message}>{message}</p>

            {children && <pre className={classes.details}>{children}</pre>}

            <p className={classes.footer}>
                If this error persists, kindly{" "}
                <a href={AdminResources.supportUrl} target="_blank">contact customer support</a>.
            </p>
        </div>
    );
};
