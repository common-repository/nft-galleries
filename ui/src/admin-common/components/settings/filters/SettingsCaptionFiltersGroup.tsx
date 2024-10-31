import React from "react";
import {SettingsGroup} from "spotlight/admin-common/components/SettingsGroup/SettingsGroup";
import {CaptionWhitelistField} from "spotlight/admin-common/components/settings/filters/captions/CaptionWhitelistField";
import {CaptionBlacklistField} from "spotlight/admin-common/components/settings/filters/captions/CaptionBlacklistField";

export function SettingsCaptionFiltersGroup() {
    return (
        <SettingsGroup title="Caption filtering">
            <CaptionWhitelistField />
            <CaptionBlacklistField />
        </SettingsGroup>
    );
}
