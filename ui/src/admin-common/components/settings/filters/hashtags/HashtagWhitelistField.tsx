import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {SettingsField} from "spotlight/admin-common/components/SettingsField/SettingsField";
import {selectSetting} from "spotlight/admin-common/stores/settings/selectors";
import {updateSettings} from "spotlight/admin-common/stores/settings";
import {MultiHashtagInput} from "spotlight/admin-common/components/fields/MultiHashtagInput";

export function HashtagWhitelistField() {
    const dispatch = useDispatch();
    const value = useSelector(selectSetting("hashtagWhitelist"));
    const exclude = useSelector(selectSetting("hashtagBlacklist"));
    const update = (hashtagWhitelist) => dispatch(updateSettings({hashtagWhitelist}));

    return (
        <SettingsField id="hashtagWhitelist" label="Only show NFTs with these words or phrases" fullWidth>
            <MultiHashtagInput
                id="hashtagWhitelist"
                value={value}
                onChange={update}
                exclude={exclude}
                excludeMsg="The %s hashtag is already being used in the below option"
            />
        </SettingsField>
    );
}
