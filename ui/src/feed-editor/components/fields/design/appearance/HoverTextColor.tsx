import React from "react";
import {ColorPicker} from "spotlight/admin-common/components/fields/ColorPicker/ColorPicker";
import {pickRgbColor} from "spotlight/utils/jsx/pickRgbColor";
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField";

export function HoverTextColor() {
    return (
        <FeedEditorField option="textColorHover" label="Hover text color" decorator={pickRgbColor} proOnly>
            {props => <ColorPicker {...props} />}
        </FeedEditorField>
    );
}
