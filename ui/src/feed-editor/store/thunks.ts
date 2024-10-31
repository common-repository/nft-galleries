import {FeedEditorActions, FeedEditorState} from "spotlight/feed-editor/store/index"
import {FeedOptions} from "spotlight/feed"
import {createAsyncThunk} from "@reduxjs/toolkit"

type SaveFn = (name: string, options: FeedOptions) => Promise<any>

export const saveFeed = createAsyncThunk("editor/save_feed", async (saveFn: SaveFn, ThunkApi) => {
  if (!saveFn) {
    return
  }

  const {editor} = ThunkApi.getState() as FeedEditorState

  if (!editor.isPromptingName && editor.feedName.trim().length === 0) {
    ThunkApi.dispatch(FeedEditorActions.showNamePrompt())
  } else {
    ThunkApi.dispatch(FeedEditorActions.hideNamePrompt())
    await saveFn(editor.feedName, editor.feedOptions)
  }
})
