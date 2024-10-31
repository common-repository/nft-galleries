import React from "react";
import {ColorPicker} from "spotlight/admin-common/components/fields/ColorPicker/ColorPicker";
import {pickRgbColor} from "spotlight/utils/jsx/pickRgbColor";
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField";

export function BgColorField() {
    return (
        <FeedEditorField option="bgColor" label="Background color" decorator={pickRgbColor}>
            {props => <ColorPicker {...props} />}
        </FeedEditorField>
    );
}
