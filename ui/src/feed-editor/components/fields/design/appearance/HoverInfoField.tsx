import React from "react"
import {useEditorSelector} from "spotlight/feed-editor/store/hooks"
import {CheckboxListField} from "spotlight/admin-common/components/fields/CheckboxListField/CheckboxListField"
import {HoverInfo} from "spotlight/feed"
import {useFeedEditorContext} from "spotlight/feed-editor/context"
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField"

const options = [
  {
    value: HoverInfo.NAME,
    label: "NFT name",
  },
  {
    value: HoverInfo.DESCRIPTION,
    label: "NFT description",
    proOnly: true,
  },
]

export function HoverInfoField() {
  const showProOptions = useEditorSelector(state => state.showProOptions)
  const isPro = useFeedEditorContext().config.isPro

  return (
    <FeedEditorField option="hoverInfo" label="Show on hover">
      {props => (
        <CheckboxListField
          {...props}
          options={options}
          showProOptions={showProOptions}
          isPro={isPro}
        />
      )}
    </FeedEditorField>
  )
}
