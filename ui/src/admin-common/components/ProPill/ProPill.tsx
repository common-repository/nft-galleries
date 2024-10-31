import React, {ReactNode} from "react";
import styles from "./ProPill.pcss";
import {classList} from "spotlight/utils/jsx/classes";
import {AdminResources} from "spotlight/admin-common/modules/admin-resources";

interface Props {
    className?: string;
    children?: ReactNode;
}

export const ProPill = ({className, children}: Props) => {
    const handleClick = React.useCallback(() => {
        window.open(AdminResources.pricingUrl, "_blank");
    }, []);

    return (
        <span className={classList(styles.pill, className)} onClick={handleClick} tabIndex={-1}>
            PRO
            {children}
        </span>
    );
};
