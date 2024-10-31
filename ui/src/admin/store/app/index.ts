import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {loadAdminApp} from "spotlight/admin/store/app/thunks";
import {FeedTemplate} from "spotlight/feed";

export type AdminAppState = {
    isLoaded: boolean;
    isLoading: boolean;
    isEditingNewFeed: boolean;
    isDoingOnboarding: boolean;
    newFeedTemplate: FeedTemplate | null;
};

export type StateWithAdminApp = {
    app: AdminAppState;
}

export const AdminAppSlice = createSlice({
    name: "app",
    initialState: {
        isLoaded: false,
        isLoading: false,
        isEditingNewFeed: false,
        isDoingOnboarding: false,
        newFeedTemplate: null,
    } as AdminAppState,
    reducers: {
        setIsDoingOnBoarding(state, action: PayloadAction<boolean>) {
            state.isDoingOnboarding = action.payload;
        },
        setIsEditingNewFeed(state, action: PayloadAction<boolean>) {
            state.isEditingNewFeed = action.payload;
        },
        useFeedTemplate(state, action: PayloadAction<FeedTemplate | null>) {
            state.newFeedTemplate = action.payload;
        },
    },
    extraReducers: builder => builder
        .addCase(loadAdminApp.pending, state => {
            state.isLoading = true;
        })
        .addCase(loadAdminApp.fulfilled, state => {
            state.isLoading = false;
            state.isLoaded = true;
        }),
});

export const setIsEditingNewFeed = AdminAppSlice.actions.setIsEditingNewFeed;
export const useFeedTemplate = AdminAppSlice.actions.useFeedTemplate;
