import React from "react"
import {useSelector} from "react-redux"
import {FeedEditorGroup} from "spotlight/feed-editor/components/core/FeedEditorGroup/FeedEditorGroup"
import {NumPostsField} from "spotlight/feed-editor/components/fields/design/layout/NumPostsField"
import {NumColumnsField} from "spotlight/feed-editor/components/fields/design/layout/NumColumnsField"
import {HighlightFreqField} from "spotlight/feed-editor/components/fields/design/layout/HighlightFreqField"
import {SliderInfiniteLoadField} from "spotlight/feed-editor/components/fields/design/layout/SliderInfiniteLoadField"
import {SliderArrowPosField} from "spotlight/feed-editor/components/fields/design/layout/SlideArrowPosField"
import {SliderArrowSizeField} from "spotlight/feed-editor/components/fields/design/layout/SlideArrowSizeField"
import {SliderArrowColorField} from "spotlight/feed-editor/components/fields/design/layout/SlideArrowColorField"
import {SliderArrowBgColorField} from "spotlight/feed-editor/components/fields/design/layout/SlideArrowBgColorField"
import {selectFeedOption} from "spotlight/feed-editor/store/selectors"
import {FieldSet} from "spotlight/admin-common/components/fields/FieldSet/FieldSet"
import {LinkBehaviorField} from "spotlight/feed-editor/components/fields/design/feed/LinkBehaviorField"
import {ShowNameField} from "spotlight/feed-editor/components/fields/design/appearance/ShowNameField"

export function LayoutGroup() {
  const layout = useSelector(selectFeedOption("layout"))

  return (
    <FeedEditorGroup id="layouts" label="Layout">
      <NumPostsField />
      <NumColumnsField />
      <LinkBehaviorField />
      <ShowNameField />

      {layout === "highlight" && (
        <HighlightFreqField />
      )}

      {layout === "slider" && (
        <>
          <SliderInfiniteLoadField />

          <FieldSet>
            <SliderArrowPosField />
            <SliderArrowSizeField />
            <SliderArrowColorField />
            <SliderArrowBgColorField />
          </FieldSet>
        </>
      )}
    </FeedEditorGroup>
  )
}
