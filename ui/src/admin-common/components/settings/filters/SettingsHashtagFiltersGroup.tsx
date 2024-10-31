import React from "react";
import {SettingsGroup} from "spotlight/admin-common/components/SettingsGroup/SettingsGroup";
import {HashtagWhitelistField} from "spotlight/admin-common/components/settings/filters/hashtags/HashtagWhitelistField";
import {HashtagBlacklistField} from "spotlight/admin-common/components/settings/filters/hashtags/HashtagBlacklistField";

export function SettingsHashtagFiltersGroup() {
    return (
        <SettingsGroup title="Hashtag filtering">
            <HashtagWhitelistField />
            <HashtagBlacklistField />
        </SettingsGroup>
    );
}
