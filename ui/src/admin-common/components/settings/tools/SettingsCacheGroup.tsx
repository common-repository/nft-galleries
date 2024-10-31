import React from "react";
import {SettingsField} from "spotlight/admin-common/components/SettingsField/SettingsField";
import ClearCacheButton from "spotlight/admin-common/components/ClearCacheButton/ClearCacheButton";
import {SettingsGroup} from "spotlight/admin-common/components/SettingsGroup/SettingsGroup";

export function SettingsCacheGroup() {
    return (
        <SettingsGroup title="Cache">
            <SettingsField
                id="clearCache"
                label="If you are experiencing issues, clearing the plugin's cache may help."
            >
                <ClearCacheButton />
            </SettingsField>
        </SettingsGroup>
    );
}
