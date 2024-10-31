import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Dictionary} from "spotlight/utils/dictionary";
import {Toast} from "spotlight/admin-common/stores/toasts/types";

export type ToastsState = {
    toasts: Dictionary<Toast>
};

export const ToastsSlice = createSlice({
    name: "toasts",
    initialState: {} as Dictionary<Toast>,
    reducers: {
        showToast(state, action: PayloadAction<Toast>) {
            Dictionary.set(state, action.payload.key, action.payload);
        },
        removeToast(state, action: PayloadAction<string>) {
            Dictionary.remove(state, action.payload);
        },
    },
});

export const showToast = ToastsSlice.actions.showToast;
export const removeToast = ToastsSlice.actions.removeToast;
export * from "spotlight/admin-common/stores/toasts/types";
