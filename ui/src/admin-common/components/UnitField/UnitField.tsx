import React, {ChangeEvent, HTMLAttributes} from "react";
import styles from "./UnitField.pcss";
import {Menu, MenuItem} from "spotlight/admin-common/components/Containers/Menu";
import {Dashicon} from "spotlight/common/components/Dashicon";
import {Dictionary} from "spotlight/utils/dictionary";

type UnitLabels = [string, string];

interface Props extends HTMLAttributes<HTMLInputElement> {
    type?: string;
    unit: string;
    units?: Dictionary<UnitLabels>;
    value?: any;
    min?: number;
    onChange?: (value, unit?: string) => void;
}

export default function UnitField({type, unit, units, value, min, onChange, ...rest}: Props) {
    const [isUnitListOpen, setUnitListOpen] = React.useState(false);

    const hasUnitList = (typeof units === "object") && !Dictionary.isEmpty(units);

    const toggleUnitList = () => setUnitListOpen(v => !v);
    const handleUnitKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
        switch (e.key) {
            case " ":
            case "Enter":
                toggleUnitList();
                break;
            default:
                return;
        }

        e.preventDefault();
        e.stopPropagation();
    };

    const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
        return onChange && onChange(e.currentTarget.value, unit);
    };

    const handleChangeUnit = (newUnit) => {
        onChange && onChange(value, newUnit);
        setUnitListOpen(false);
    };

    if (value === undefined || value === null || isNaN(value)) {
        value = "";
    }

    return (
        <div className={styles.root}>
            <input {...rest}
                   className={styles.input}
                   type={type ?? "text"}
                   value={value}
                   min={min}
                   onChange={handleChangeValue}
            />

            <div className={styles.unitContainer}>
                {hasUnitList && (
                    <Menu isOpen={isUnitListOpen} onBlur={() => setUnitListOpen(false)}>
                        {
                            ({ref}) => (
                                <div ref={ref}
                                     className={styles.unitSelector}
                                     role="button"
                                     onClick={toggleUnitList}
                                     onKeyDown={handleUnitKey}
                                     tabIndex={0}>
                                    <span className={styles.currentUnit}>
                                        {getUnitLabelFor(value, Dictionary.get(units, unit))}
                                    </span>
                                    <Dashicon icon="arrow-down-alt2"
                                              className={isUnitListOpen ? styles.menuChevronOpen : styles.menuChevron} />
                                </div>
                            )
                        }
                        {
                            Dictionary.keys(units).map(key => {
                                const labels = Dictionary.get(units, key);
                                const unitLabel = getUnitLabelFor(value, labels);

                                return (
                                    <MenuItem key={unitLabel} onClick={() => handleChangeUnit(key)}>
                                        {unitLabel}
                                    </MenuItem>
                                );
                            })
                        }
                    </Menu>
                )}

                {!hasUnitList && (
                    <div className={styles.unitStatic}>
                        <span>{unit}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

function getUnitLabelFor(value: any, unit: UnitLabels): string {
    return parseInt(value.toString()) === 1 ? unit[0] : unit[1];
}
