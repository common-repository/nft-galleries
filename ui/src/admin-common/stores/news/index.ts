import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {NewsMessage} from "spotlight/admin-common/stores/news/types";
import {fetchNews} from "spotlight/admin-common/stores/news/thunks";

export type NewsState = {
    news: NewsSliceState;
};

export type NewsSliceState = {
    messages: NewsMessage[];
    isOpen: boolean;
    isHidden: boolean;
}

export const NewsSlice = createSlice({
    name: "news",
    initialState: {
        messages: [],
        isOpen: false,
        isHidden: false,
    } as NewsSliceState,
    reducers: {
        addNewsMessage(state, action: PayloadAction<NewsMessage>) {
            state.messages.push(action.payload);
        },
        removeNewsMessage(state, action: PayloadAction<string>) {
            state.messages = state.messages.filter(m => m.id !== action.payload);
        },
        openNews(state) {
            state.isOpen = true;
        },
        closeNews(state) {
            state.isOpen = false;
        },
        hideNews(state) {
            state.isHidden = true;
        },
    },
    extraReducers: builder => builder
        .addCase(fetchNews.fulfilled, (state, action: PayloadAction<NewsMessage[]>) => {
            state.messages = action.payload;
        }),
});

export * from "./types";
export const addNewsMessage = NewsSlice.actions.addNewsMessage;
export const removeNewsMessage = NewsSlice.actions.removeNewsMessage;
export const openNews = NewsSlice.actions.openNews;
export const closeNews = NewsSlice.actions.closeNews;
export const hideNews = NewsSlice.actions.hideNews;
