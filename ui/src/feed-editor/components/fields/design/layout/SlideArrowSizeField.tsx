import React from "react";
import {NumberField} from "spotlight/admin-common/components/fields/NumberField";
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField";

export function SliderArrowSizeField() {
    return (
        <FeedEditorField option="sliderArrowSize" label="Arrow size" isResponsive proOnly>
            {props => (
                <NumberField
                    {...props}
                    min={10}
                    unit="px"
                />
            )}
        </FeedEditorField>
    );
}

