import {createSlice} from "@reduxjs/toolkit";
import {loadWpBlock} from "spotlight/wp-block/store/wp-block/thunks";

export type WpBlockState = {
    isLoaded: boolean;
};

export type StateWithWpBlock = {
    wpBlock: WpBlockState;
}

export const WpBlockSlice = createSlice({
    name: "wpBlock",
    initialState: {isLoaded: false} as WpBlockState,
    reducers: {},
    extraReducers: builder => builder
        .addCase(loadWpBlock.pending, state => {
            state.isLoaded = false;
        })
        .addCase(loadWpBlock.fulfilled, state => {
            state.isLoaded = true;
        }),
});
