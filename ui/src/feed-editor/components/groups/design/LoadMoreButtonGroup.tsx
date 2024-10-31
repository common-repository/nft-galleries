import React from "react"
import {useSelector} from "react-redux"
import {FeedEditorGroup} from "spotlight/feed-editor/components/core/FeedEditorGroup/FeedEditorGroup"
import {
  ShowLoadMoreButtonField,
} from "spotlight/feed-editor/components/fields/design/load-more-btn/ShowLoadMoreButtonField"
import {
  LoadMoreButtonTextField,
} from "spotlight/feed-editor/components/fields/design/load-more-btn/LoadMoreButtonTextField"
import {
  LoadMoreButtonDesignField,
} from "spotlight/feed-editor/components/fields/design/load-more-btn/LoadMoreButtonDesignField"
import {
  LoadMoreButtonScrollField,
} from "spotlight/feed-editor/components/fields/design/load-more-btn/LoadMoreButtonScrollField"
import {selectResponsiveFeedOption} from "spotlight/feed-editor/store/selectors"
import {FieldSet} from "spotlight/admin-common/components/fields/FieldSet/FieldSet"

export function LoadMoreButtonGroup() {
  const showLoadMoreBtn = useSelector(selectResponsiveFeedOption("showLoadMoreBtn"))
  const disabled = !showLoadMoreBtn

  return (
    <FeedEditorGroup id="load-more-btn" label="Load more button">
      <ShowLoadMoreButtonField />
      <LoadMoreButtonScrollField disabled={disabled} />
      <LoadMoreButtonTextField disabled={disabled} />

      <FieldSet>
        <LoadMoreButtonDesignField disabled={disabled} />
      </FieldSet>
    </FeedEditorGroup>
  )
}
