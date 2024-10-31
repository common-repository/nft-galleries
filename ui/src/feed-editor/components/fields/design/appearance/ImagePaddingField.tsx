import React from "react";
import {NumberField} from "spotlight/admin-common/components/fields/NumberField";
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField";

export function ImagePaddingField() {
    return (
        <FeedEditorField option="imgPadding" label="Image padding" isResponsive>
            {(props) => (
                <NumberField
                    {...props}
                    unit="px"
                    min={0}
                    emptyMin
                    placeholder="No padding"
                />
            )}
        </FeedEditorField>
    );
}
