import React, {ChangeEvent} from "react";
import {UnitInput} from "spotlight/admin-common/components/fields/UnitInput/UnitInput";
import {clampNum} from "spotlight/utils/numbers/clampNum";

interface Props {
    id?: string;
    value: number | string;
    onChange?: (value: number | string) => void;
    unit?: string | [string, string];
    min?: number;
    max?: number;
    emptyMin?: boolean;
    placeholder?: string | number;
}

export function NumberField({value, onChange, min, max, emptyMin, placeholder, id, unit}: Props) {
    min = min ?? 0;
    max = max ?? Infinity;
    value = value ?? "";
    value = isNaN(parseInt(value.toString())) ? min : value;
    placeholder = placeholder ?? "";
    emptyMin = emptyMin ?? false;

    const handleChange = React.useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const isEmptyStr = e.target.value === "";
        const numericVal = isEmptyStr ? min : parseInt(e.target.value);

        if (!isNaN(numericVal)) {
            onChange && onChange(clampNum(numericVal, min, max));
        }
    }, [min, max, onChange]);

    const handleBlur = React.useCallback(() => {
        if (emptyMin && value <= min && value >= max) {
            onChange && onChange("");
        }
    }, [emptyMin, value, min, max, onChange]);

    const handleKey = React.useCallback((e: React.KeyboardEvent) => {
        if (e.key === "ArrowUp" && value === "") {
            onChange && onChange(emptyMin ? min + 1 : min);
        }
    }, [value, min, emptyMin, onChange]);

    const valueStr = (emptyMin && value <= min) ? "" : value;

    const [singular, plural] = Array.isArray(unit) ? unit : [unit, unit];
    const unitLabel = (value === 1) ? singular : plural;

    return unitLabel
        ? <UnitInput
            id={id}
            type="number"
            unit={unitLabel}
            value={valueStr}
            min={min}
            max={max}
            placeholder={placeholder + ""}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKey}
        />
        : <input
            id={id}
            type="number"
            value={valueStr}
            min={min}
            max={max}
            placeholder={placeholder + ""}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKey}
        />;
}
