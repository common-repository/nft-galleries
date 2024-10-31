import React from "react";
import classes from "spotlight/feed-editor/components/viewports/FeedPreviewViewport/FeedPreviewViewport.pcss";
import {Button} from "spotlight/admin-common/components/Button";
import {Dashicon} from "spotlight/common/components/Dashicon";
import {Onboarding} from "spotlight/admin-common/components/Containers/Onboarding";

export type Props = {
    showCloseBtn?: boolean;
    onClose?: () => void;
};

export function FeedPreviewSelectSource({showCloseBtn, onClose}: Props) {
    return (
        <Onboarding className={classes.onboarding}>
            {showCloseBtn && (
                <Button onClick={onClose}>
                    <Dashicon icon="hidden" />
                    <span>Close Preview</span>
                </Button>
            )}

            <div>
                <h1>
                    Select a wallet to get{" "}<span className={classes.noBreak}>started{" "} →</span>
                </h1>
                <p>
                    Your NFTs will be displayed instantly so you can easily design your feed using the{" "}
                    live interactive preview.
                </p>
            </div>
        </Onboarding>
    );
}
