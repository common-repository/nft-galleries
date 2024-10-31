import {createAsyncThunk} from "@reduxjs/toolkit"
import {loadFeeds} from "spotlight/admin-common/stores/feeds/thunks"
import {loadSettings} from "spotlight/admin-common/stores/settings/thunks"
import {loadWallets} from "spotlight/admin-common/stores/wallets/thunks"

export const loadElementorApp = createAsyncThunk("elementor-app/load", async (arg, ThunkAPI) => {
    await Promise.all([
        ThunkAPI.dispatch(loadWallets()),
        ThunkAPI.dispatch(loadFeeds()),
        ThunkAPI.dispatch(loadSettings()),
    ]);
});
