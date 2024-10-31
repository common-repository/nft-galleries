import React from "react";
import {CheckboxField} from "spotlight/admin-common/components/fields/CheckboxField/CheckboxField";
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField";

const tooltip = (
    <span>
        When this is enabled, the feed will load more posts when the slider reaches the end.
    </span>
);

export function SliderInfiniteLoadField() {
    return (
        <FeedEditorField option="sliderInfinite" label="Infinite loading" tooltip={tooltip} isResponsive proOnly>
            {props => <CheckboxField {...props} />}
        </FeedEditorField>
    );
}
