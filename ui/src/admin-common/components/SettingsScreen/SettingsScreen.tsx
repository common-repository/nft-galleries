import React, {useEffect} from "react";
import styles from "./SettingsScreen.pcss";
import {useDispatch, useSelector} from "react-redux";
import {parse as parseQuery} from "query-string";
import {AdminScreen} from "spotlight/admin-common/components/AdminScreen/AdminScreen";
import {SCREENS} from "spotlight/admin-common/stores/ScreensStore";
import {SettingsNavbar} from "spotlight/admin-common/components/SettingsNavbar/SettingsNavbar";
import {AdminSettings} from "spotlight/admin-common/AdminSettings";
import {selectSettingsAreDirty} from "spotlight/admin-common/stores/settings/selectors";
import {restoreSettings} from "spotlight/admin-common/stores/settings";
import {Common} from "spotlight/common";
import {selectQueryParam} from "spotlight/admin-common/stores/router/selectors";
import {useUnload} from "spotlight/admin-common/stores/router";

// The message to show in the prompt when the user has unsaved settings changes and is navigating away
export const LEAVE_MESSAGE = "You have unsaved changes. If you leave now, your changes will be lost.";

export function SettingsScreen() {
    const dispatch = useDispatch();
    const isDirty = useSelector(selectSettingsAreDirty);
    const currTabId = useSelector(selectQueryParam("tab"));

    const currTab = currTabId
        ? AdminSettings.find(page => currTabId === page.id)
        : AdminSettings[0];

    // Discard changes when the screen unmounts
    useEffect(() => () => isDirty && dispatch(restoreSettings()), [isDirty, dispatch]);

    // If there are unsaved changes, confirm with the user before they navigate away
    useUnload(LEAVE_MESSAGE, () => isDirty, [isDirty]);

    return (
        <>
            <AdminScreen navbar={SettingsNavbar} className={styles.root}>
                {currTab && (Common.isPro || !currTab.isPro) && <currTab.component />}
            </AdminScreen>
        </>
    );
}

/**
 * The function to pass to the component's Prompt as a message.
 *
 * It makes sure to only show the prompt when the navigation results in a change of screen. Navigating between the
 * different tabs in the settings page should not show the prompt.
 *
 * @param location The new location.
 */
function promptMsgFn(location: Location): string | true {
    const query = parseQuery(location.search);

    return (query.screen !== SCREENS.SETTINGS)
        ? LEAVE_MESSAGE
        : true;
}
