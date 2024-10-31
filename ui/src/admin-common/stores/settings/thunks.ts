import {createAsyncThunk} from "@reduxjs/toolkit"
import {AxiosResponse} from "axios"
import {SettingsState, SettingsValues} from "spotlight/admin-common/stores/settings/types"
import {SETTINGS_SAVE_FAILED, SETTINGS_SAVE_SUCCESS, SettingsSavedEvent} from "spotlight/admin-common/stores/settings/events"
import {createCustomEvent} from "spotlight/utils/events/custom-event"
import {getErrorResponseMessage} from "spotlight/common/modules/rest-api/client"
import {AdminRestApi} from "spotlight/admin-common/modules/rest-api"

export const loadSettings = createAsyncThunk("settings/load", async () => {
    return await handleSettingsResponse(() => AdminRestApi.settings.get())
})

export const saveSettings = createAsyncThunk("settings/save", async (arg, thunkAPI) => {
    // @ts-ignore
    const state: SettingsState = thunkAPI.getState().settings

    try {
        const response = await handleSettingsResponse(() => AdminRestApi.settings.save(state.values))
        document.dispatchEvent(createCustomEvent(SETTINGS_SAVE_SUCCESS))

        return response
    } catch (reason) {
        document.dispatchEvent(createCustomEvent<SettingsSavedEvent>(SETTINGS_SAVE_FAILED, {
            error: reason,
        }))

        throw reason
    }
})

async function handleSettingsResponse(requestFn: () => Promise<AxiosResponse>): Promise<SettingsValues> {
    try {
        const response = await requestFn()

        if (typeof response === "object" && response.data !== undefined) {
            return normalizeValues(response.data)
        }
    } catch (error) {
        const reason = getErrorResponseMessage(error)
        console.error(reason)
        throw reason
    }

    throw "Encountered a problem while trying to load your settings. Kindly contact customer support for assistance."
}

function normalizeValues(values: SettingsValues): SettingsValues {
    return {
        updateInterval: values.updateInterval ?? "",
    }
}
