import React from "react";
import {CheckboxField} from "spotlight/admin-common/components/fields/CheckboxField/CheckboxField";
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField";

export type Props = {
    disabled: boolean;
}

export function LoadMoreButtonScrollField({disabled}: Props) {
    return (
        <FeedEditorField option="loadMoreBtnScroll" label="Auto-scroll down" disabled={disabled}>
            {props => <CheckboxField {...props} />}
        </FeedEditorField>
    );
}
