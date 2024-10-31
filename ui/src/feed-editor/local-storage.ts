import {applyPartial} from "spotlight/utils/objects/applyPartial"

/**
 * The key of the locally stored config.
 */
export const LOCAL_STORAGE_KEY = "snft_editor"

/**
 * Interface for editor local storage data.
 */
export type FeedEditorLocalConfig = {
  showProOptions: boolean;
};

/**
 * The default value for locally stored config.
 */
export const DEFAULT_LOCAL_config: FeedEditorLocalConfig = {
  showProOptions: true,
}

/**
 * Retrieves the locally stored editor config.
 */
export function getLocalFeedEditorConfig(): FeedEditorLocalConfig {
  try {
    const storedStr = localStorage.getItem(LOCAL_STORAGE_KEY) ?? "{}"
    const stored = JSON.parse(storedStr)

    return {...DEFAULT_LOCAL_config, ...stored}
  } catch (error) {
    return DEFAULT_LOCAL_config
  }
}

/**
 * Sets the locally stored editor config.
 *
 * @param config The config to save.
 */
export function setLocalFeedEditorConfig(config: FeedEditorLocalConfig) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config))
}


/**
 * Updates the locally stored editor config.
 *
 * @param changes The changes to update with.
 */
export function updateLocalFeedEditorConfig(changes: Partial<FeedEditorLocalConfig>) {
  setLocalFeedEditorConfig(applyPartial(getLocalFeedEditorConfig(), changes))
}
