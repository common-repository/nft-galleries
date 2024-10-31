import React from "react";
import {NumberField} from "spotlight/admin-common/components/fields/NumberField";
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField";

const tooltip = (
    <span>
        If left empty, the text size will be controlled by your theme.{" "}
        This option will be ignored for the header if the "Text size" option in the "Header" section is not empty.
    </span>
);

export function TextSizeField() {
    return (
        <FeedEditorField option="textSize" label="Text size" tooltip={tooltip} isResponsive noFallback>
            {(props) => (
                <NumberField
                    {...props}
                    unit="px"
                    min={0}
                    emptyMin
                    placeholder="Default"
                />
            )}
        </FeedEditorField>
    );
}
