import {SettingsValues, StateWithSettings} from "spotlight/admin-common/stores/settings/types";

export const selectSettingsAreDirty = (state: StateWithSettings) => state.settings?.isDirty;
export const selectSettingsAreSaving = (state: StateWithSettings) => state.settings?.isSaving;
export const selectSettingsValues = (state: StateWithSettings) => state.settings?.values ?? {};
export const selectSetting = (setting: keyof SettingsValues) => (state: StateWithSettings) => state.settings?.values[setting] ?? null;
