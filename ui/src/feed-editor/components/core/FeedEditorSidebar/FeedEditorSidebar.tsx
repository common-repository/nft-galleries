import React, {ReactNode, useContext} from "react"
import classes from "spotlight/feed-editor/components/core/FeedEditorSidebar/FeedEditorSidebar.pcss"
import {SidebarLayout} from "spotlight/admin-common/components/SidebarLayout/SidebarLayout"
import {Sidebar} from "spotlight/admin-common/components/Sidebar/Sidebar"
import {useFeedEditorContext} from "spotlight/feed-editor/context"
import {FeedEditorUpsell} from "spotlight/feed-editor/components/core/FeedEditorUpsell/FeedEditorUpsell"

export type Props = {
  onOpenPreview: () => void;
  children: ReactNode;
};

export function FeedEditorSidebar({onOpenPreview, children}: Props) {
  const isPro = useFeedEditorContext().config.isPro
  const isCollapsed = useContext(SidebarLayout.Context)

  return (
    <>
      {!isPro && <FeedEditorUpsell />}

      {isCollapsed && (
        <SidebarLayout.Navigation align="right" text="Preview" icon="visibility" onClick={onOpenPreview} />
      )}

      <Sidebar className={classes.root}>
        {children}
      </Sidebar>
    </>
  )
}
