import React from "react"
import {AnyAction} from "redux"
import {useDispatch} from "react-redux"
import {ThunkDispatch} from "redux-thunk"
import {Common} from "spotlight/common"
import {SCREENS} from "spotlight/admin-common/stores/ScreensStore"
import {CommonEditor} from "spotlight/admin-common/components/CommonEditor/CommonEditor"
import {Feed, saveFeed} from "spotlight/admin-common/stores/feeds"
import {gotoRoute, gotoScreen} from "spotlight/admin-common/stores/router"
import {FeedEditorDefaultConfig} from "spotlight/feed-editor/config"
import {EmbedSidebar} from "spotlight/admin-common/components/EmbedSidebar/EmbedSidebar"

interface Props {
  feed: Feed;
  keepState?: boolean;
}

const tabs = FeedEditorDefaultConfig.tabs.slice()
tabs.push({
  id: "embed",
  label: "Embed",
  requireSources: true,
  sidebar: EmbedSidebar,
})

export function AdminEditor({feed, keepState}: Props) {
  const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>()
  const isNewFeed = feed.id === null

  const handleSave = React.useCallback(async feed => {
    const action = await dispatch(saveFeed(feed))

    if (isNewFeed && action.payload.id) {
      // Give the editor enough time to finish its pending "isSaving" state transition
      setTimeout(() => {
        dispatch(gotoRoute({screen: SCREENS.EDIT_FEED, id: action.payload.id}))
      }, 10)
    }
  }, [isNewFeed])

  const handleCancel = React.useCallback(() => {
    dispatch(gotoScreen(SCREENS.GALLERY_LIST))
  }, [])

  return (
    <CommonEditor
      feed={feed}
      isPro={Common.isPro}
      onSave={handleSave}
      onCancel={handleCancel}
      keepState={keepState}
      tabs={tabs}
      useCtrlS
      confirmOnCancel
    />
  )
}
