import React from "react";
import {SettingsPage} from "spotlight/admin-common/components/SettingsPage/SettingsPage";
import {SettingsCacheGroup} from "spotlight/admin-common/components/settings/tools/SettingsCacheGroup";

export function SettingsToolsTab() {
    return (
        <SettingsPage>
            <SettingsCacheGroup />
        </SettingsPage>
    );
}
