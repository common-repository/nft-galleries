import React from "react";
import {ColorPicker} from "spotlight/admin-common/components/fields/ColorPicker/ColorPicker";
import {pickRgbColor} from "spotlight/utils/jsx/pickRgbColor";
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField";

export function HoverBgColor() {
    return (
        <FeedEditorField option="bgColorHover" label="Hover background color" decorator={pickRgbColor} proOnly>
            {props => <ColorPicker {...props} />}
        </FeedEditorField>
    );
}
