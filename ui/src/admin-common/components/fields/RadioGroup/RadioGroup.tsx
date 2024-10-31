import React, {ChangeEvent} from "react";
import classes from "./RadioGroup.pcss";

export interface RadioOption {
    value: string | number,
    label: string
}

interface Props {
    name: string;
    className?: string;
    value: string | number;
    onChange?: (value) => void;
    options: Array<RadioOption>;
    disabled?: boolean;
}

export function RadioGroup({name, className, disabled, value, onChange, options}: Props) {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        (!disabled && e.target.checked && onChange) && onChange(e.target.value);
    };

    className = (disabled ? classes.disabled : classes.radioGroup) + " " + (className ?? "");

    return (
        <div className={className}>
            {
                options.map((option, idx) => (
                    <label className={classes.option} key={idx}>
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={value === option.value}
                            onChange={handleChange}
                        />
                        <span>{option.label}</span>
                    </label>
                ))
            }
        </div>
    );
}
