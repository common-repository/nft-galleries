import React from "react";
import classes from "./CheckboxField.pcss";

interface Props {
    id?: string;
    value?: boolean;
    disabled?: boolean;
    onChange?: (value: boolean) => void;
}

export function CheckboxField({id, value, onChange, disabled}: Props) {
    return (
        <div className={classes.checkboxField}>
            <div className={classes.aligner}>
                <input
                    id={id}
                    type="checkbox"
                    value="1"
                    checked={!!value}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={disabled}
                />
            </div>
        </div>
    );
}
