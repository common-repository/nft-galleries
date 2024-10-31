import React from "react";
import {Modal} from "spotlight/admin-common/components/Modal/Modal";
import {SaveButton} from "spotlight/admin-common/components/SaveButton/SaveButton";
import {useDispatch, useSelector} from "react-redux";
import {selectSettingsAreDirty, selectSettingsAreSaving} from "spotlight/admin-common/stores/settings/selectors";
import {saveSettings} from "spotlight/admin-common/stores/settings/thunks";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {SettingsFiltersTab} from "spotlight/admin-common/components/settings/SettingsFiltersTab";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave?: () => void;
}

export function GlobalFiltersModal({isOpen, onClose, onSave}: Props) {
    const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();
    const isDirty = useSelector(selectSettingsAreDirty);
    const isSaving = useSelector(selectSettingsAreSaving);

    const handleClose = () => {
        if (isDirty && !confirm("You have unsaved changes. If you close the window now, your settings will not be saved. Click OK to close anyway.")) {
            return;
        }

        onClose();
    };

    const handleSave = () => {
        dispatch(saveSettings()).then(() => {
            onSave && onSave();
        });
    };

    return (
        <Modal title="Global filters" isOpen={isOpen} onClose={handleClose}>
            <Modal.Content>
                <SettingsFiltersTab />
            </Modal.Content>

            <Modal.Footer>
                <SaveButton disabled={!isDirty}
                            isSaving={isSaving}
                            onClick={handleSave}
                />
            </Modal.Footer>
        </Modal>
    );
}
