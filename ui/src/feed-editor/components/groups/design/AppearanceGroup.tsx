import React from "react"
import {FeedEditorGroup} from "spotlight/feed-editor/components/core/FeedEditorGroup/FeedEditorGroup"
import {FeedWidthField} from "spotlight/feed-editor/components/fields/design/appearance/FeedWidthField"
import {FeedHeightField} from "spotlight/feed-editor/components/fields/design/appearance/FeedHeightField"
import {FeedPaddingField} from "spotlight/feed-editor/components/fields/design/appearance/FeedPaddingField"
import {ImagePaddingField} from "spotlight/feed-editor/components/fields/design/appearance/ImagePaddingField"
import {TextSizeField} from "spotlight/feed-editor/components/fields/design/appearance/TextSizeField"
import {BgColorField} from "spotlight/feed-editor/components/fields/design/appearance/BgColorField"
import {HoverBgColor} from "spotlight/feed-editor/components/fields/design/appearance/HoverBgColor"

export function AppearanceGroup() {
  return (
    <FeedEditorGroup id="appearance" label="Appearance">
      <FeedWidthField />
      <FeedHeightField />
      <FeedPaddingField />
      <ImagePaddingField />
      <TextSizeField />
      <BgColorField />
      <HoverBgColor />
    </FeedEditorGroup>
  )
}
