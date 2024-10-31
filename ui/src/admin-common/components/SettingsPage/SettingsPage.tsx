import React, {ReactNode} from "react";
import styles from "./SettingsPage.pcss";
import {useDispatch} from "react-redux";
import {useDocumentEventListener} from "spotlight/utils/react/useEventListener";
import {saveSettings} from "spotlight/admin-common/stores/settings/thunks";

interface Props {
    before?: ReactNode;
    after?: ReactNode;
    children?: ReactNode;
}

export function SettingsPage({before, after, children}: Props) {
    const dispatch = useDispatch();

    useDocumentEventListener<KeyboardEvent>("keydown", (e: KeyboardEvent) => {
        if (e.key && e.key.toLowerCase() === "s" && e.ctrlKey) {
            dispatch(saveSettings());
            e.preventDefault();
            e.stopPropagation();
        }
    }, [], [dispatch]);

    return (
        <article className={styles.root}>
            {before && (
                <div className={styles.beforeGroups}>
                    {before}
                </div>
            )}

            {children && (
                <div className={styles.groupList}>
                    {children}
                </div>
            )}

            {after && (
                <div className={styles.afterGroups}>
                    {after}
                </div>
            )}
        </article>
    );
}
