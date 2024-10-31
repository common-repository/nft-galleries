import React from "react"
import {NumberField} from "spotlight/admin-common/components/fields/NumberField"
import {Device, Responsive} from "spotlight/utils/responsive"
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField"
import {useSelector} from "react-redux"
import {selectFeedOption, selectPreviewDevice} from "spotlight/feed-editor/store/selectors"

export function NumPostsField() {
  const fullVal = useSelector(selectFeedOption("numPosts"))
  const desktopVal = Responsive.get(fullVal, Device.DESKTOP)
  const device = useSelector(selectPreviewDevice)
  const isDesktop = device === Device.DESKTOP

  return (
    <FeedEditorField option="numPosts" label="Number of NFTs" isResponsive>
      {props => (
        <NumberField
          {...props}
          min={0}
          unit={["NFT", "NFTs"]}
          placeholder={isDesktop ? "All" : desktopVal}
          emptyMin
        />
      )}
    </FeedEditorField>
  )
}
