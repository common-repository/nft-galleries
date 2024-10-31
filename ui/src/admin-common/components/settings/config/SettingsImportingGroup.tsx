import React from "react"
import {SettingsGroup} from "spotlight/admin-common/components/SettingsGroup/SettingsGroup"
import {ImportIntervalField} from "spotlight/admin-common/components/settings/config/importing/ImportIntervalField"

export function SettingsImportingGroup() {
  return (
    <SettingsGroup title="Import options">
      <ImportIntervalField />
    </SettingsGroup>
  )
}
