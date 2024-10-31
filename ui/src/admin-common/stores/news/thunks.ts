import {createAsyncThunk} from "@reduxjs/toolkit";
import {getErrorResponseMessage} from "spotlight/common/modules/rest-api/client";
import {AdminRestApi} from "spotlight/admin-common/modules/rest-api";

export const fetchNews = createAsyncThunk("news/fetch", async () => {
    try {
        const response = await AdminRestApi.notifications.get();

        if (typeof response === "object" && Array.isArray(response.data)) {
            return response.data;
        } else {
            console.error("News response from Spotlight server is malformed");
        }
    } catch (error) {
        console.error("Failed to get news from the Spotlight server:", getErrorResponseMessage(error));
    }
});
