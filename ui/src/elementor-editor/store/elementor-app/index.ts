import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {loadElementorApp} from "spotlight/elementor-editor/store/elementor-app/thunks";
import {Feed} from "spotlight/admin-common/stores/feeds";

export type ElementorAppState = {
    isLoaded: boolean,
    isLoading: boolean,
};

export type StateWithElementorApp = {
    elementorApp: ElementorAppState;
}

export const ElementorAppSlice = createSlice({
    name: "elementorApp",
    initialState: {
        isLoaded: false,
        isLoading: false,
    } as ElementorAppState,
    reducers: {},
    extraReducers: builder => builder
        .addCase(loadElementorApp.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(loadElementorApp.fulfilled, (state) => {
            state.isLoaded = true;
        }),
});
