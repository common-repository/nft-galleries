import React from "react"
import {SettingsPage} from "spotlight/admin-common/components/SettingsPage/SettingsPage"
import {SettingsImportingGroup} from "spotlight/admin-common/components/settings/config/SettingsImportingGroup"
import {SettingsOptimizationGroup} from "spotlight/admin-common/components/settings/config/SettingsOptimizationGroup"
import {SettingsTweaksGroup} from "spotlight/admin-common/components/settings/config/SettingsTweaksGroup"

export function SettingsConfigTab() {
  return (
    <SettingsPage>
      <SettingsImportingGroup />
      {/*<SettingsOptimizationGroup />*/}
      {/*<SettingsTweaksGroup />*/}
    </SettingsPage>
  )
}
