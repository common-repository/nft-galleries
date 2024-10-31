import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {SettingsField} from "spotlight/admin-common/components/SettingsField/SettingsField";
import {LimitedMultiTextInput} from "spotlight/admin-common/components/fields/LimitedMultiTextInput";
import {selectSetting} from "spotlight/admin-common/stores/settings/selectors";
import {updateSettings} from "spotlight/admin-common/stores/settings";

export function HashtagBlacklistField() {
    const dispatch = useDispatch();
    const value = useSelector(selectSetting("hashtagBlacklist"));
    const exclude = useSelector(selectSetting("hashtagWhitelist"));
    const update = (hashtagBlacklist) => dispatch(updateSettings({hashtagBlacklist}));

    return (
        <SettingsField id="hashtagBlacklist" label="Hide NFTs with these words or phrases" fullWidth>
            <LimitedMultiTextInput
                id="hashtagBlacklist"
                value={value}
                onChange={update}
                exclude={exclude}
                excludeMsg="The %s hashtag is already being used in the above option"
            />
        </SettingsField>
    );
}
