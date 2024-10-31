import React from "react";
import {CheckboxField} from "spotlight/admin-common/components/fields/CheckboxField/CheckboxField";
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField";

export function ShowLoadMoreButtonField() {
    return (
        <FeedEditorField option="showLoadMoreBtn" label="Show button" isResponsive>
            {props => <CheckboxField {...props} />}
        </FeedEditorField>
    );
}
