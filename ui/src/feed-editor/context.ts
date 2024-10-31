import React from "react"
import {FeedEditorConfig, FeedEditorDefaultConfig} from "spotlight/feed-editor/config"
import {fn} from "spotlight/utils/functions"

export type FeedEditorContextTy = {
  config: FeedEditorConfig;
  reload: () => void;
}

export const FeedEditorContext = React.createContext<FeedEditorContextTy>({
  config: FeedEditorDefaultConfig,
  reload: fn.noop,
})

export function useFeedEditorContext() {
  return React.useContext(FeedEditorContext)
}

export const FeedEditorReloadEvent = "feed-editor/reload"
