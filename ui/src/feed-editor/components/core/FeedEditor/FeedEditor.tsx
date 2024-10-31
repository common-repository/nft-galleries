import React from "react"
import classes from "./FeedEditor.pcss"
import {FeedEditorNavbar} from "spotlight/feed-editor/components/core/FeedEditorNavbar/FeedEditorNavbar"
import {FeedEditorContent} from "spotlight/feed-editor/components/core/FeedEditorContent"
import {FeedEditorConfig, FeedEditorDefaultConfig} from "spotlight/feed-editor/config"
import {FeedEditorContext, FeedEditorContextTy, FeedEditorReloadEvent} from "spotlight/feed-editor/context"
import {withPartial} from "spotlight/utils/objects/withPartial"

type Props = Partial<FeedEditorConfig>;

export function FeedEditor(props: Props) {
  const config = withPartial(FeedEditorDefaultConfig, props ?? {})
  const context: FeedEditorContextTy = {
    config,
    reload,
  }

  return (
    <FeedEditorContext.Provider value={context}>
      <div className={classes.root}>
        <div className={classes.navbar}>
          <FeedEditorNavbar />
        </div>
        <div className={classes.content}>
          <FeedEditorContent />
        </div>
      </div>
    </FeedEditorContext.Provider>
  )
}

function reload() {
  document.dispatchEvent(new CustomEvent(FeedEditorReloadEvent))
}
