import {configureStore} from "@reduxjs/toolkit"
import {FeedEditorSlice} from "spotlight/feed-editor/store"
import {AdminAppSlice} from "spotlight/admin/store/app"
import {FeedsSlice} from "spotlight/admin-common/stores/feeds"
import {ToastsSlice} from "spotlight/admin-common/stores/toasts"
import {NewsSlice} from "spotlight/admin-common/stores/news"
import {SettingsSlice} from "spotlight/admin-common/stores/settings"
import {RouterSlice} from "spotlight/admin-common/stores/router"
import {WalletsSlice} from "spotlight/admin-common/stores/wallets"

export const AdminAppStore = configureStore({
    reducer: {
        [AdminAppSlice.name]: AdminAppSlice.reducer,
        [RouterSlice.name]: RouterSlice.reducer,
        [WalletsSlice.name]: WalletsSlice.reducer,
        [FeedsSlice.name]: FeedsSlice.reducer,
        [SettingsSlice.name]: SettingsSlice.reducer,
        [FeedEditorSlice.name]: FeedEditorSlice.reducer,
        [ToastsSlice.name]: ToastsSlice.reducer,
        [NewsSlice.name]: NewsSlice.reducer,
    },
});
