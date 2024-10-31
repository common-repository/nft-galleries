import {FeedEditorState} from "spotlight/feed-editor/store/index"
import {FeedOptions} from "spotlight/feed"
import {NonResponsive, Responsive} from "spotlight/utils/responsive"

export const selectIsDirty = (state: FeedEditorState) => state.editor.isDirty

export const selectFeedOptions = (state: FeedEditorState) => state.editor.feedOptions

export const selectPreviewDevice = (state: FeedEditorState) => state.editor.previewDevice

export function selectFeedOption<K extends keyof FeedOptions>(option: K) {
  return (state: FeedEditorState) => state.editor.feedOptions[option]
}

export function selectResponsiveFeedOption<K extends keyof FeedOptions>(option: K, fallback: boolean = true) {
  return (state: FeedEditorState): NonResponsive<FeedOptions[K]> => {
    const value = state.editor.feedOptions[option]
    // @ts-ignore
    return Responsive.get(value, state.editor.previewDevice, fallback)
  }
}

export function selectFeedName(state: FeedEditorState) {
  const name = state.editor.feedName.trim()

  return name.length > 0 ? name : "(no name)"
}
