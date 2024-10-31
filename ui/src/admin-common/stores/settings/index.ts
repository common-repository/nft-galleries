import {createSlice, isFulfilled, PayloadAction} from "@reduxjs/toolkit"
import {SettingsState, SettingsValues} from "spotlight/admin-common/stores/settings/types"
import {cloneObj} from "spotlight/utils/objects/cloneObj"
import {objectsEqual} from "spotlight/utils/objects/objectsEqual"
import {withPartial} from "spotlight/utils/objects/withPartial"
import {loadSettings, saveSettings} from "spotlight/admin-common/stores/settings/thunks"

export const SettingsSlice = createSlice({
    name: "settings",
    initialState: {
        values: {},
        original: {},
        isDirty: false,
        isSaving: false,
    } as SettingsState,
    reducers: {
        update(state, action: PayloadAction<Partial<SettingsValues>>) {
            state.values = withPartial(state.values, action.payload);
            state.isDirty = !objectsEqual(state.values, state.original);
        },
        restore(state) {
            state.values = cloneObj(state.original);
            state.isDirty = false;
        },
    },
    extraReducers: builder => builder
        .addCase(saveSettings.pending, state => {
            state.isSaving = true;
        })
        .addCase(saveSettings.rejected, state => {
            state.isSaving = false;
        })
        .addMatcher(isFulfilled(saveSettings, loadSettings), (state, action: PayloadAction<SettingsValues>) => {
            state.original = action.payload;
            state.values = cloneObj(state.original);
            state.isSaving = false;
            state.isDirty = false;
        }),
});

export * from "./types";
export const updateSettings = SettingsSlice.actions.update;
export const restoreSettings = SettingsSlice.actions.restore;
