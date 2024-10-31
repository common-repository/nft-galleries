import React from "react"
import {SettingsField} from "spotlight/admin-common/components/SettingsField/SettingsField"
import AdminCommon from "spotlight/admin-common/AdminCommon"
import {Select, SelectOption} from "spotlight/admin-common/components/fields/Select"
import {useDispatch, useSelector} from "react-redux"
import {selectSetting} from "spotlight/admin-common/stores/settings/selectors"
import {updateSettings} from "spotlight/admin-common/stores/settings"

export function ImportIntervalField() {
  const dispatch = useDispatch()
  const value = useSelector(selectSetting("updateInterval"))
  const update = (option: SelectOption) => dispatch(updateSettings({updateInterval: option.value}))

  return (
    <SettingsField id="settings-import-interval" label="Check for new NFTs">
      <Select
        id="settings-import-interval"
        width={250}
        value={value}
        onChange={update}
        options={AdminCommon.config.cronScheduleOptions}
      />
    </SettingsField>
  )
}
