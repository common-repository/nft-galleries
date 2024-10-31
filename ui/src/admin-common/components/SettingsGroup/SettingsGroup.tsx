import React, {ReactNode} from "react";
import styles from "./SettingsGroup.pcss";

interface Props {
    title?: string;
    before?: ReactNode;
    after?: ReactNode;
    children?: ReactNode;
}

export function SettingsGroup({title, before, after, children}: Props) {
    return (
        <div className={styles.root}>
            {title && title.length > 0 && (
                <h1 className={styles.title}>{title}</h1>
            )}

            {before && (
                <div className={styles.beforeFields}>
                    {before}
                </div>
            )}

            {children && (
                <div className={styles.fieldList}>
                    {children}
                </div>
            )}

            {after && (
                <div className={styles.afterFields}>
                    {after}
                </div>
            )}
        </div>
    );
}
