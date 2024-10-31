import React, {useCallback, useState} from "react"
import {SidebarLayout} from "spotlight/admin-common/components/SidebarLayout/SidebarLayout"
import {FeedPreviewViewport} from "spotlight/feed-editor/components/viewports/FeedPreviewViewport/FeedPreviewViewport"
import {useEditorSelector} from "spotlight/feed-editor/store/hooks"
import {FeedEditorSidebar} from "spotlight/feed-editor/components/core/FeedEditorSidebar/FeedEditorSidebar"
import {useFeedEditorContext} from "spotlight/feed-editor/context"

export function FeedEditorContent() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const openPreview = useCallback(() => setIsPreviewOpen(true), [setIsPreviewOpen])
  const closePreview = useCallback(() => setIsPreviewOpen(false), [setIsPreviewOpen])

  const {config} = useFeedEditorContext()
  const tabId = useEditorSelector(state => state.currentTab)
  const tab = config.tabs.find(tab => tab.id === tabId) ?? config.tabs[0]

  if (tab.component) {
    return <tab.component />
  }

  return (
    <SidebarLayout
      primary="content"
      current={isPreviewOpen ? "content" : "sidebar"}
      sidebar={
        <FeedEditorSidebar onOpenPreview={openPreview}>
          <tab.sidebar />
        </FeedEditorSidebar>
      }
      content={
        tab.viewport
          ? <tab.viewport />
          : <FeedPreviewViewport onClose={closePreview} />
      }
    />
  )
}
