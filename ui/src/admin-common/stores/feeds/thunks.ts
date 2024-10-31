import {createAsyncThunk} from "@reduxjs/toolkit"
import {RestApi} from "spotlight/common/modules/rest-api"
import {AdminRestApi} from "spotlight/admin-common/modules/rest-api"
import {removeToast, showToast, ToastType} from "spotlight/admin-common/stores/toasts"
import {Feed} from "spotlight/admin-common/stores/feeds/index"
import {cloneObj} from "spotlight/utils/objects/cloneObj"
import {getErrorResponseMessage} from "spotlight/common/modules/rest-api/client"

/**
 * Loads the feeds from the server.
 */
export const loadFeeds = createAsyncThunk("feeds/load", async () => {
    try {
        const response = await RestApi.feeds.get();

        if (typeof response === "object" && Array.isArray(response.data)) {
            return response.data;
        }
    } catch (error) {
        const reason = getErrorResponseMessage(error);
        console.error(reason);
        throw reason;
    }

    throw "A problem was encountered while trying to load your galleries. Kindly contact customer support for assistance.";
});

/**
 * Submits a feed to be saved on the server.
 */
export const saveFeed = createAsyncThunk("feeds/save", async (feed: Feed, thunkAPI) => {
    thunkAPI.dispatch(showToast({
        key: "feeds/saving",
        message: "Saving feed. Please wait ...",
        type: ToastType.STICKY,
    }));

    const response = await AdminRestApi.feeds.save(feed);

    thunkAPI.dispatch(removeToast("feeds/saving"));
    thunkAPI.dispatch(showToast({
        key: "feeds/saved",
        message: "Gallery saved!",
    }));

    return response.data.feed;
});

/**
 * Duplicates a feed and sends it to the server.
 */
export const duplicateFeed = createAsyncThunk("feeds/duplicate", async (feed: Feed, thunkAPI) => {
    thunkAPI.dispatch(showToast({
        key: "admin/feeds/duplicate/wait",
        message: "Duplicating gallery. Please wait ...",
        type: ToastType.STICKY,
    }));

    const clone: Feed = {
        id: null,
        name: `Copy of ${feed.name}`,
        usages: [],
        options: cloneObj(feed.options),
    };

    try {
        const response = await AdminRestApi.feeds.save(clone);

        return response.data.feed;
    } finally {
        thunkAPI.dispatch(removeToast("admin/feeds/duplicate/wait"));
    }
});

/**
 * Deletes a feed from the server.
 */
export const deleteFeed = createAsyncThunk("feeds/delete", async (feed: Feed, thunkAPI) => {
    try {
        await AdminRestApi.feeds.delete(feed.id);

        return feed.id;
    } catch (error) {
        thunkAPI.dispatch(showToast({
            key: "feeds/delete/error",
            message: error.toString(),
            type: ToastType.ERROR,
        }));
    }
});
