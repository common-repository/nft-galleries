import React, {ReactNode} from "react";
import styles from "./ProUpgradeBtn.pcss";
import {AdminResources} from "spotlight/admin-common/modules/admin-resources";
import {isBlackFriday2021} from "spotlight/utils/dates/blackFriday2021"

interface Props {
    url?: string;
    children?: ReactNode;
}

export function ProUpgradeBtn({url, children}: Props) {
    const isBf = isBlackFriday2021();
    return (
        <a className={isBf ? styles.red : styles.root} href={url ?? AdminResources.pricingUrl} target="_blank">
            {children ?? (
                isBf
                    ? "Get 30% off PRO today"
                    : "Free 14-day PRO trial"
            )}
        </a>
    );
}
