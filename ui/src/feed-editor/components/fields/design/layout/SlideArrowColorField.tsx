import React from "react";
import {ColorPicker} from "spotlight/admin-common/components/fields/ColorPicker/ColorPicker";
import {pickRgbColor} from "spotlight/utils/jsx/pickRgbColor";
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField";

export function SliderArrowColorField() {
    return (
        <FeedEditorField option="sliderArrowColor" label="Arrow color" decorator={pickRgbColor} proOnly>
            {props => <ColorPicker {...props} />}
        </FeedEditorField>
    );
}

