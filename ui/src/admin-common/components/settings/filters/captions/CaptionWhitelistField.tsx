import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {SettingsField} from "spotlight/admin-common/components/SettingsField/SettingsField";
import {LimitedMultiTextInput} from "spotlight/admin-common/components/fields/LimitedMultiTextInput";
import {selectSetting} from "spotlight/admin-common/stores/settings/selectors";
import {updateSettings} from "spotlight/admin-common/stores/settings";

export function CaptionWhitelistField() {
    const dispatch = useDispatch();
    const value = useSelector(selectSetting("captionWhitelist"));
    const exclude = useSelector(selectSetting("captionBlacklist"));
    const update = (captionWhitelist) => dispatch(updateSettings({captionWhitelist}));

    return (
        <SettingsField id="captionWhitelist" label="Only show NFTs with these words or phrases" fullWidth>
            <LimitedMultiTextInput
                id="captionWhitelist"
                value={value}
                onChange={update}
                exclude={exclude}
                excludeMsg="%s is already being used in the below option"
            />
        </SettingsField>
    );
}
