import React, {ReactNode} from "react";
import styles from "./SettingsField.pcss";
import HelpTooltip from "spotlight/admin-common/components/HelpTooltip/HelpTooltip";

interface Props {
    id: string;
    label?: string;
    tooltip?: string;
    fullWidth?: boolean;
    children: ReactNode;
}

export function SettingsField({id, label, tooltip, fullWidth, children}: Props) {
    fullWidth = fullWidth || !label;

    return (
        <div className={styles.root}>
            {label && (
                <div className={styles.label}>
                    <label htmlFor={id}>{label}</label>
                </div>
            )}

            <div className={styles.container}>
                <div className={fullWidth ? styles.controlFullWidth : styles.controlPartialWidth}>
                    {children}
                </div>

                {tooltip && (
                    <div className={styles.tooltip}>
                        <HelpTooltip>{tooltip}</HelpTooltip>
                    </div>
                )}
            </div>
        </div>
    );
}
