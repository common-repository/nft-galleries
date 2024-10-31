import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {SettingsField} from "spotlight/admin-common/components/SettingsField/SettingsField";
import AdminCommon from "spotlight/admin-common/AdminCommon";
import {Select, SelectOption} from "spotlight/admin-common/components/fields/Select";
import {selectSetting} from "spotlight/admin-common/stores/settings/selectors";
import {updateSettings} from "spotlight/admin-common/stores/settings";

export type Props = {}

export function OptimizeIntervalField({}: Props) {
    const dispatch = useDispatch();
    const value = useSelector(selectSetting("cleanerInterval"));
    const update = (option: SelectOption) => dispatch(updateSettings({cleanerInterval: option.value}));

    return (
        <SettingsField id="cleanerInterval" label="Run optimization">
            <Select id="cleanerInterval"
                    width={250}
                    value={value}
                    options={AdminCommon.config.cronScheduleOptions}
                    onChange={update}
            />
        </SettingsField>
    );
}
