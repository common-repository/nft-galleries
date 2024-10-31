/**
 * The event triggered in the DOM when the settings are saved.
 */
export const SETTINGS_SAVE_SUCCESS = "snft/settings/save/success";

/**
 * The event triggered in the DOM when the settings failed to be saved.
 */
export const SETTINGS_SAVE_FAILED = "snft/settings/save/error";

export type SettingsSavedEvent = {
    error?: string
};
