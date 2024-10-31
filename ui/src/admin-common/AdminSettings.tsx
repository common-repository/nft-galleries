import React from "react"
import WalletsPage from "spotlight/admin-common/components/WalletsPage/WalletsPage"
import {SettingsConfigTab} from "spotlight/admin-common/components/settings/SettingsConfigTab"
import {SettingsPage} from "spotlight/admin-common/stores/settings"
import {SettingsToolsTab} from "spotlight/admin-common/components/settings/SettingsToolsTab"

export const AdminSettings: SettingsPage[] = [
  {
    id: "wallets",
    title: "Wallets",
    component: WalletsPage,
  },
  {
    id: "config",
    title: "Configuration",
    component: SettingsConfigTab,
  },
  {
    id: "tools",
    title: "Tools",
    component: SettingsToolsTab,
  },
]
