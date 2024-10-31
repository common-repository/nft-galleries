import React, {ReactNode} from "react";
import classes from "./FieldRow.pcss";
import HelpTooltip from "spotlight/admin-common/components/HelpTooltip/HelpTooltip";
import {ProPill} from "spotlight/admin-common/components/ProPill/ProPill";
import {FeedEditorDeviceCycleButton} from "spotlight/feed-editor/components/core/FeedEditorDeviceCycleButton/FeedEditorDeviceCycleButton";
import {Common} from "spotlight/common";

export type Props = {
    label?: ReactNode;
    labelId?: string;
    disabled?: boolean;
    isResponsive?: boolean;
    wide?: boolean;
    centered?: boolean;
    proOnly?: boolean;
    isPro?: boolean;
    tooltip?: ReactNode;
    children?: ReactNode;
}

export function FieldRow(
    {label, labelId, wide, centered, tooltip, disabled, isResponsive, proOnly, isPro, children}: Props,
) {
    isPro = isPro ?? Common.isPro;
    const proDisabled = proOnly && !isPro;
    disabled = disabled || proDisabled;

    const className = disabled
        ? (wide ? classes.disabledWide : classes.disabled)
        : (wide ? classes.containerWide : classes.container);

    return (
        <div className={className}>
            {label && (
                <div className={centered ? classes.labelCentered : classes.labelNormal}>
                    <div className={classes.labelAligner}>
                        <label htmlFor={labelId}>
                            {label}
                            {tooltip && (
                                <>
                                    {" "}
                                    <HelpTooltip>{tooltip}</HelpTooltip>
                                </>
                            )}
                        </label>

                    </div>
                </div>
            )}

            <div className={classes.content}>
                {isResponsive && (
                    <div className={classes.responsiveContainer}>
                        <FeedEditorDeviceCycleButton />

                        <div className={classes.responsiveField}>
                            {children}
                        </div>
                    </div>
                )}

                {!isResponsive && (
                    <div className={centered ? classes.fieldCentered : classes.fieldNormal}>
                        {children}
                    </div>
                )}
            </div>

            {proDisabled && (
                <ProPill className={classes.proPill} />
            )}
        </div>
    );
}
