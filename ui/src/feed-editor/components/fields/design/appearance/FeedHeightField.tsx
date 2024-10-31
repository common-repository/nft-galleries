import React from "react";
import {NumberField} from "spotlight/admin-common/components/fields/NumberField";
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField";

export function FeedHeightField() {
    return (
        <FeedEditorField id="feed-height" option="feedHeight" label="Feed height" isResponsive>
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
