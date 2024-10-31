import {StateWithAdminApp} from "spotlight/admin/store/app/index";

export const selectIsAdminAppLoaded = (state: StateWithAdminApp) => state.app.isLoaded;
export const selectIsAdminAppLoading = (state: StateWithAdminApp) => state.app.isLoading;
export const selectIsAdminEditingNewFeed = (state: StateWithAdminApp) => state.app.isEditingNewFeed;
