import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {SettingsField} from "spotlight/admin-common/components/SettingsField/SettingsField";
import UnitField from "spotlight/admin-common/components/UnitField/UnitField";
import {selectSetting} from "spotlight/admin-common/stores/settings/selectors";
import {updateSettings} from "spotlight/admin-common/stores/settings";

export type Props = {}

export function OptimizeAgeLimitField({}: Props) {
    const dispatch = useDispatch();

    const value: string = useSelector(selectSetting("cleanerAgeLimit")) ?? "";
    const parts = value.split(" ");
    const number = parseInt(parts[0]) ?? 0;
    const unit = parts[1] ?? "days";

    const update = (num, unit) => dispatch(updateSettings({cleanerAgeLimit: `${num} ${unit}`}));

    return (
        <SettingsField id="cleanerAgeLimit" label="Delete unseen NFTs from the cache after">
            <UnitField
                id="cleanerAgeLimit"
                type="number"
                value={number}
                unit={unit}
                onChange={update}
                min={1}
                units={{
                    days: ["day", "days"],
                    hours: ["hour", "hours"],
                    minutes: ["minute", "minutes"],
                }}
            />
        </SettingsField>
    );
}
