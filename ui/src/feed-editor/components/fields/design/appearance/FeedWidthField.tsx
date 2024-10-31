import React from "react";
import {NumberField} from "spotlight/admin-common/components/fields/NumberField";
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField";

export function FeedWidthField() {
    return (
        <FeedEditorField id="feed-width" option="feedWidth" label="Feed width" isResponsive>
            {props => (
                <NumberField
                    {...props}
                    min={0}
                    unit="px"
                    placeholder="Auto"
                    emptyMin
                />
            )}
        </FeedEditorField>
    );
}
