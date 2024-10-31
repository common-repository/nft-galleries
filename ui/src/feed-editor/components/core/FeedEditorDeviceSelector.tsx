import React, {useCallback} from "react";
import {useDispatch} from "react-redux";
import {Button, ButtonType} from "spotlight/admin-common/components/Button";
import {Dashicon} from "spotlight/common/components/Dashicon";
import {useEditorSelector} from "spotlight/feed-editor/store/hooks";
import {FeedEditorActions} from "spotlight/feed-editor/store";
import {Device} from "spotlight/utils/responsive";

export function FeedEditorDeviceSelector() {
    const dispatch = useDispatch();
    const currDevice = useEditorSelector(state => state.previewDevice);
    const switchToDesktop = useCallback(() => dispatch(FeedEditorActions.changePreviewDevice(Device.DESKTOP)), [dispatch]);
    const switchToTablet = useCallback(() => dispatch(FeedEditorActions.changePreviewDevice(Device.TABLET)), [dispatch]);
    const switchToPhone = useCallback(() => dispatch(FeedEditorActions.changePreviewDevice(Device.PHONE)), [dispatch]);

    return (
        <>
            <Button
                type={currDevice === Device.DESKTOP ? ButtonType.PRIMARY : ButtonType.PILL}
                onClick={switchToDesktop}
                tooltip="Desktop"
                aria-label="Desktop"
                style={{marginRight: 5}}>
                <Dashicon icon="desktop" />
            </Button>

            <Button
                type={currDevice === Device.TABLET ? ButtonType.PRIMARY : ButtonType.PILL}
                onClick={switchToTablet}
                tooltip="Tablet"
                aria-label="Tablet"
                style={{marginRight: 5}}>
                <Dashicon icon="tablet" />
            </Button>

            <Button
                type={currDevice === Device.PHONE ? ButtonType.PRIMARY : ButtonType.PILL}
                onClick={switchToPhone}
                tooltip="Phone"
                aria-label="Phone">
                <Dashicon icon="smartphone" />
            </Button>
        </>
    );
}
