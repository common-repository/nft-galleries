import styles from "./SettingsNavbar.pcss";
import React from "react";
import AdminNavbar from "spotlight/admin-common/components/AdminNavbar/AdminNavbar";
import {Button, ButtonSize, ButtonType} from "spotlight/admin-common/components/Button";
import {Navbar} from "spotlight/admin-common/components/Navbar/Navbar";
import {SaveButton} from "spotlight/admin-common/components/SaveButton/SaveButton";
import {AdminSettings} from "spotlight/admin-common/AdminSettings";
import {useDispatch, useSelector} from "react-redux";
import {selectSettingsAreDirty, selectSettingsAreSaving} from "spotlight/admin-common/stores/settings/selectors";
import {restoreSettings} from "spotlight/admin-common/stores/settings";
import {saveSettings} from "spotlight/admin-common/stores/settings/thunks";
import {Common} from "spotlight/common";
import {selectQueryParam} from "spotlight/admin-common/stores/router/selectors";

export function SettingsNavbar() {
    const currTabId = useSelector(selectQueryParam("tab"));
    const tabs = Common.isPro
        ? AdminSettings
        : AdminSettings.filter(page => !page.isPro);

    return (
        <AdminNavbar chevron={true} right={SettingsButtons}>
            {tabs.map((page, idx) => (
                <Navbar.Link key={page.id}
                             linkTo={{tab: page.id}}
                             isCurrent={currTabId === page.id || (!currTabId && idx === 0)}>
                    {page.title}
                </Navbar.Link>
            ))}
        </AdminNavbar>
    );
}

function SettingsButtons({}) {
    const dispatch = useDispatch();
    const isDirty = useSelector(selectSettingsAreDirty);
    const isSaving = useSelector(selectSettingsAreSaving);

    const save = () => dispatch(saveSettings());
    const restore = () => dispatch(restoreSettings());

    return (
        <div className={styles.buttons}>
            <Button className={styles.cancelBtn}
                    type={ButtonType.DANGER_PILL}
                    size={ButtonSize.LARGE}
                    onClick={restore}
                    disabled={!isDirty}>
                Cancel
            </Button>

            <SaveButton className={styles.saveBtn}
                        onClick={save}
                        isSaving={isSaving}
                        tooltip="Save the settings (Ctrl+S)"
                        disabled={!isDirty} />
        </div>
    );
}
