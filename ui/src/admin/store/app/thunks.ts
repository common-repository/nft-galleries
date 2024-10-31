import {createAsyncThunk} from "@reduxjs/toolkit"
import {loadFeeds} from "spotlight/admin-common/stores/feeds/thunks"
import {loadSettings} from "spotlight/admin-common/stores/settings/thunks"
import {triggerError} from "spotlight/common/modules/errors/handlers"
import {loadWallets} from "spotlight/admin-common/stores/wallets/thunks"

export const loadAdminApp = createAsyncThunk("admin-app/load", async (arg, ThunkApi) => {
    try {
        await Promise.all([
            ThunkApi.dispatch(loadWallets()),
            ThunkApi.dispatch(loadFeeds()),
            ThunkApi.dispatch(loadSettings()),
            throttleLoading(),
        ]);
    } catch (error) {
        triggerError({type: "load/error", message: error.toString()});
    }
});

function throttleLoading() {
    return new Promise(resolve => setTimeout(resolve, 800));
}
