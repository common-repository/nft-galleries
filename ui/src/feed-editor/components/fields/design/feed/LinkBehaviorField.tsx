import React from "react"
import {Select, SelectOption} from "spotlight/admin-common/components/fields/Select"
import {LinkBehavior} from "spotlight/feed"
import {pickOptionValue} from "spotlight/utils/jsx/pickOptionValue"
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField"

const options: SelectOption[] = [
  {value: LinkBehavior.NOTHING, label: "- Do not open -"},
  {value: LinkBehavior.SELF, label: "Same tab"},
  {value: LinkBehavior.NEW_TAB, label: "New tab"},
  {value: LinkBehavior.LIGHTBOX, label: "Popup box"},
]

export function LinkBehaviorField() {
  return (
    <>
      <FeedEditorField option="linkBehavior" label="Open NFTs in" decorator={pickOptionValue} isResponsive>
        {props => <Select{...props} options={options} />}
      </FeedEditorField>
    </>
  )
}
