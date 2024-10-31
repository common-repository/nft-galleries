import React from "react";
import {SettingsPage} from "spotlight/admin-common/components/SettingsPage/SettingsPage";
import {SettingsCaptionFiltersGroup} from "spotlight/admin-common/components/settings/filters/SettingsCaptionFiltersGroup";
import {SettingsHashtagFiltersGroup} from "spotlight/admin-common/components/settings/filters/SettingsHashtagFiltersGroup";

export function SettingsFiltersTab() {
    return (
        <SettingsPage>
            <SettingsCaptionFiltersGroup />
            <SettingsHashtagFiltersGroup />
        </SettingsPage>
    );
}
