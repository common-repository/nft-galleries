import React from "react"
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField"
import {CheckboxField} from "spotlight/admin-common/components/fields/CheckboxField/CheckboxField"

export function ShowCollectionsField() {
  return (
    <FeedEditorField option="showCollections" label="Show collections">
      {props => (
        <CheckboxField {...props} />
      )}
    </FeedEditorField>
  )
}
