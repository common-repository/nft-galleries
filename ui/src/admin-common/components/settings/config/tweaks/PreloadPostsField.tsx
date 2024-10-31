import React, {ChangeEvent} from "react";
import {SettingsField} from "spotlight/admin-common/components/SettingsField/SettingsField";
import {useDispatch, useSelector} from "react-redux";
import {selectSetting} from "spotlight/admin-common/stores/settings/selectors";
import {updateSettings} from "spotlight/admin-common/stores/settings";

export function PreloadPostsField() {
    const dispatch = useDispatch();
    const value = useSelector(selectSetting("preloadMedia"));
    const update = (e: ChangeEvent<HTMLInputElement>) => dispatch(updateSettings({preloadMedia: e.target.checked}));

    return (
        <SettingsField id="preloadMedia">
            <label htmlFor="preloadMedia">
                <span style={{marginRight: 10}}>
                    Pre-load the first page of tokens
                </span>
                <input
                    id="preloadMedia"
                    type="checkbox"
                    checked={value}
                    onChange={update}
                />
            </label>
        </SettingsField>
    );
}
