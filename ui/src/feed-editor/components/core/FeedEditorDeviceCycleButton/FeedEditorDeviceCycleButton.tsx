import React from "react";
import classes from "./FeedEditorDeviceCycleButton.pcss";
import {Button, ButtonSize, ButtonType} from "spotlight/admin-common/components/Button";
import {Dashicon} from "spotlight/common/components/Dashicon";
import {useEditorSelector} from "spotlight/feed-editor/store/hooks";
import {useDispatch} from "react-redux";
import {FeedEditorActions} from "spotlight/feed-editor/store";
import {getDeviceIcon} from "spotlight/feed-editor/device-icons";

export type Props = {}

export function FeedEditorDeviceCycleButton({}: Props) {
    const dispatch = useDispatch();
    const device = useEditorSelector(state => state.previewDevice);
    const cycleDevice = React.useCallback(() => dispatch(FeedEditorActions.cyclePreviewDevice()), [dispatch]);

    return (
        <div className={classes.deviceBtn}>
            <Button type={ButtonType.PILL}
                    size={ButtonSize.NORMAL}
                    onClick={cycleDevice}>
                <Dashicon icon={getDeviceIcon(device)} />
            </Button>
        </div>
    );
}
