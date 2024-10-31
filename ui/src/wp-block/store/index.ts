import {configureStore} from "@reduxjs/toolkit"
import {FeedsSlice} from "spotlight/admin-common/stores/feeds"
import {WpBlockSlice} from "spotlight/wp-block/store/wp-block"
import {WalletsSlice} from "spotlight/admin-common/stores/wallets"

export const WpBlockStore = configureStore({
    reducer: {
        [WpBlockSlice.name]: WpBlockSlice.reducer,
        [WalletsSlice.name]: WalletsSlice.reducer,
        [FeedsSlice.name]: FeedsSlice.reducer,
    },
})
