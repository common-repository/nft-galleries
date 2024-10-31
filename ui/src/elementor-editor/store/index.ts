import {configureStore} from "@reduxjs/toolkit"
import {ElementorAppSlice} from "spotlight/elementor-editor/store/elementor-app"
import {FeedsSlice} from "spotlight/admin-common/stores/feeds"
import {FeedEditorReducer, FeedEditorSlice} from "spotlight/feed-editor/store"
import {SettingsSlice} from "spotlight/admin-common/stores/settings"
import {RouterSlice} from "spotlight/admin-common/stores/router"

export const ElementorAppStore = configureStore({
    reducer: {
        [ElementorAppSlice.name]: ElementorAppSlice.reducer,
        [RouterSlice.name]: RouterSlice.reducer,
        [FeedsSlice.name]: FeedsSlice.reducer,
        [FeedEditorSlice.name]: FeedEditorReducer,
        [SettingsSlice.name]: SettingsSlice.reducer,
    },
});
