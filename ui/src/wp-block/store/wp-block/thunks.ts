import {createAsyncThunk} from "@reduxjs/toolkit"
import {loadFeeds} from "spotlight/admin-common/stores/feeds/thunks"
import {loadWallets} from "spotlight/admin-common/stores/wallets/thunks"

export const loadWpBlock = createAsyncThunk("wpBlock/load", async (arg, thunkAPI) => {
    try {
        await Promise.all([
            thunkAPI.dispatch(loadWallets()),
            thunkAPI.dispatch(loadFeeds()),
        ]);
    } catch (e) {
        console.error(e);
    }
});
