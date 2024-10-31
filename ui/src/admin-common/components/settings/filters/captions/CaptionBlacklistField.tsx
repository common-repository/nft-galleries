import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {SettingsField} from "spotlight/admin-common/components/SettingsField/SettingsField";
import {LimitedMultiTextInput} from "spotlight/admin-common/components/fields/LimitedMultiTextInput";
import {selectSetting} from "spotlight/admin-common/stores/settings/selectors";
import {updateSettings} from "spotlight/admin-common/stores/settings";

export function CaptionBlacklistField() {
    const dispatch = useDispatch();
    const value = useSelector(selectSetting("captionBlacklist"));
    const exclude = useSelector(selectSetting("captionWhitelist"));
    const update = (captionBlacklist) => dispatch(updateSettings({captionBlacklist}));

    return (
        <SettingsField id="captionBlacklist" label="Hide NFTs with these words or phrases" fullWidth>
            <LimitedMultiTextInput
                id="captionBlacklist"
                value={value}
                onChange={update}
                exclude={exclude}
                excludeMsg="%s is already being used in the above option"
            />
        </SettingsField>
    );
}
