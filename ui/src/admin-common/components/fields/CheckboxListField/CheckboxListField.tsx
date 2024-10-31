import React, {ChangeEvent, ReactNode} from "react";
import classes from "./CheckboxListField.pcss";
import {ProPill} from "spotlight/admin-common/components/ProPill/ProPill";
import HelpTooltip from "spotlight/admin-common/components/HelpTooltip/HelpTooltip";
import {Common} from "spotlight/common";

interface Props {
    id?: string;
    value: Array<any>;
    options: Array<CheckboxListOption>;
    isPro?: boolean;
    showProOptions?: boolean;
    onChange?: (value: Array<any>) => void;
}

export interface CheckboxListOption {
    value: string | number;
    label: string;
    proOnly?: boolean;
    isDisabled?: boolean;
    tooltip?: string | ReactNode;
}

export function CheckboxListField({id, value, onChange, isPro, showProOptions, options}: Props) {
    isPro = isPro ?? Common.isPro;

    const set = new Set(value.map(s => s.toString()));

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const changed = e.target.value;
        const checked = e.target.checked;
        const option = options.find(option => option.value.toString() === changed);

        if ((option.proOnly && !isPro) || option.isDisabled) {
            return;
        }

        checked ? set.add(changed) : set.delete(changed);

        onChange && onChange(Array.from(set));
    };

    return (
        <div className={classes.checkboxList}>
            {
                options.filter((opt) => !!opt).map((option, idx) => {
                    if (!isPro && option.proOnly && !showProOptions) {
                        return null;
                    }

                    const isFake = (option.proOnly && !isPro);
                    const disabled = option.isDisabled || isFake;

                    return (
                        <label key={idx} className={disabled ? classes.disabledOption : classes.option} >
                            <input
                                type="checkbox"
                                id={id}
                                value={option.value.toString() ?? ""}
                                checked={set.has(option.value.toString())}
                                onChange={handleChange}
                                disabled={disabled}
                            />

                            <span>
                                {option.label}
                                {option.tooltip && !isFake && (
                                    <>
                                        {" "}
                                        <HelpTooltip>{option.tooltip}</HelpTooltip>
                                    </>
                                )}
                            </span>

                            {isFake && (
                                <div className={classes.proPill}>
                                    <ProPill />
                                </div>
                            )}
                        </label>
                    );
                })
            }
        </div>
    );
}
