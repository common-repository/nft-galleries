import React from "react";
import classes from "./Toaster.pcss";
import {useSelector} from "react-redux";
import {selectToasts} from "spotlight/admin-common/stores/toasts/selectors";
import {Toast} from "spotlight/admin-common/components/Toast/Toast";

export function Toaster() {
    const toasts = useSelector(selectToasts);

    return (
        <div className={classes.root}>
            <div className={classes.container}>
                {toasts.map(toast => <Toast key={toast.key} toast={toast} />)}
            </div>
        </div>
    );
}
