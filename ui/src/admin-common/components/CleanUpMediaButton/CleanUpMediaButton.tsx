import React from "react"
import {Button, ButtonSize, ButtonType} from "spotlight/admin-common/components/Button"
import {useDispatch, useSelector} from "react-redux"
import {removeToast, showToast, ToastType} from "spotlight/admin-common/stores/toasts"
import {selectSetting} from "spotlight/admin-common/stores/settings/selectors"
import {fn} from "spotlight/utils/functions"

export function CleanUpMediaButton() {
    const dispatch = useDispatch();
    const ageLimit = useSelector(selectSetting("cleanerAgeLimit"));

    const handleClick = async () => {
        dispatch(showToast({
            key: "admin/clean_up_media/wait",
            message: "Optimizing, please wait ...",
            type: ToastType.STICKY,
        }));

        try {
            // Send the current age limit, as entered by the user in the settings UI,
            // so that the cleanup uses this limit even if the user didn't save the settings yet.
            const response = await new Promise<any>(fn.noop);
            const count = response?.data?.numCleaned ?? 0;

            dispatch(showToast({
                key: "admin/clean_up_media/done",
                message: `Done! ${count} old NFTs have been removed.`,
            }));
        } finally {
            dispatch(removeToast("admin/clean_up_media/wait"));
        }
    };

    return (
        <Button type={ButtonType.SECONDARY} size={ButtonSize.NORMAL} onClick={handleClick}>
            Optimize now
        </Button>
    );
}
