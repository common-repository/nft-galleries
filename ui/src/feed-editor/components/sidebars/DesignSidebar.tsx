import React from "react"
import {LayoutGroup} from "spotlight/feed-editor/components/groups/design/LayoutGroup"
import {AppearanceGroup} from "spotlight/feed-editor/components/groups/design/AppearanceGroup"

export function DesignSidebar() {
  return (
    <div>
      <LayoutGroup />
      <AppearanceGroup />
    </div>
  )
}
