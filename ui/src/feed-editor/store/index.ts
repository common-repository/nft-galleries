import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {DefaultFeedOptions, FeedOptions} from "spotlight/feed"
import {Device} from "spotlight/utils/responsive"
import {withPartial} from "spotlight/utils/objects/withPartial"
import {getLocalFeedEditorConfig, updateLocalFeedEditorConfig} from "spotlight/feed-editor/local-storage"
import {saveFeed} from "spotlight/feed-editor/store/thunks"

export type FeedEditorState = {
  editor: {
    currentTab: string;
    feedName: string;
    feedOptions: FeedOptions;
    previewDevice: Device;
    openGroups: string[];
    showProOptions: boolean;
    isSaving: boolean;
    isDirty: boolean;
    isPromptingName: boolean;
  }
};

const initialState: FeedEditorState["editor"] = {
  currentTab: "",
  feedName: "",
  feedOptions: DefaultFeedOptions,
  previewDevice: Device.DESKTOP,
  openGroups: [
    "wallets",
    "template",
    "layouts",
    "feed",
    "appearance",
  ],
  showProOptions: true,
  isSaving: false,
  isDirty: false,
  isPromptingName: false,
}

export const FeedEditorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    editFeed(state, action: PayloadAction<{ feedName: string, feedOptions: FeedOptions, reset?: boolean }>) {
      state.feedName = action.payload.feedName
      state.feedOptions = action.payload.feedOptions
      state.isDirty = false
      state.isSaving = false

      if (action.payload.reset) {
        state.currentTab = ""
        state.previewDevice = Device.DESKTOP
        state.openGroups = initialState.openGroups
        state.showProOptions = getLocalFeedEditorConfig().showProOptions
      }
    },
    renameFeed(state, action: PayloadAction<string>) {
      state.feedName = action.payload
      state.isDirty = true
    },
    changeFeedOptions(state, action: PayloadAction<Partial<FeedOptions>>) {
      state.feedOptions = withPartial(state.feedOptions, action.payload)
      state.isDirty = true
    },
    mutateFeedOptions(state, action: PayloadAction<(options: FeedOptions) => void>) {
      action.payload(state.feedOptions)
      state.isDirty = true
    },
    selectWallet(state, action: PayloadAction<string>) {
      state.feedOptions.wallets.push(action.payload)
      state.isDirty = true
    },
    changeTab(state, action: PayloadAction<string>) {
      state.currentTab = action.payload
    },
    toggleProOptions(state, action: PayloadAction<boolean | undefined>) {
      state.showProOptions = action.payload ?? !state.showProOptions
      updateLocalFeedEditorConfig({showProOptions: state.showProOptions})
    },
    changePreviewDevice(state, action: PayloadAction<Device>) {
      state.previewDevice = action.payload
    },
    cyclePreviewDevice(state) {
      state.previewDevice = (state.previewDevice === Device.DESKTOP)
        ? Device.TABLET
        : (state.previewDevice === Device.TABLET)
          ? Device.PHONE
          : Device.DESKTOP
    },
    toggleGroup(state, action: PayloadAction<string>) {
      const idx = state.openGroups.indexOf(action.payload)
      if (idx < 0) {
        state.openGroups.push(action.payload)
      } else {
        state.openGroups.splice(idx, 1)
      }
    },
    showNamePrompt(state) {
      state.isPromptingName = true
    },
    hideNamePrompt(state) {
      state.isPromptingName = false
    },
  },
  extraReducers: builder => builder
    .addCase(saveFeed.pending, state => {
      state.isSaving = true
    })
    .addCase(saveFeed.fulfilled, state => {
      state.isSaving = false
      state.isDirty = false
    })
    .addCase(saveFeed.rejected, state => {
      state.isSaving = false
    }),
})

export const FeedEditorReducer = FeedEditorSlice.reducer
export const FeedEditorActions = {
  ...FeedEditorSlice.actions,
  saveFeed,
}
