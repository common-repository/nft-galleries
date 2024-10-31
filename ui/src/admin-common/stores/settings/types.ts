import {ComponentType} from "react"

export type StateWithSettings = {
  settings: SettingsState;
};

export type SettingsState = {
  values: SettingsValues;
  original: SettingsValues;
  isDirty: boolean;
  isSaving: boolean;
};

/**
 * Interface for the expected structure of settings values.
 */
export interface SettingsValues {
  updateInterval?: string;

  [k: string]: any;
}

export interface ThumbnailGenConfig {
  width: number;
  quality: number;
}

/**
 * Interface for a settings page, which aggregates a list of settings groups.
 */
export interface SettingsPage {
  id: string;
  title: string;
  isPro?: boolean;
  component?: ComponentType;
}
