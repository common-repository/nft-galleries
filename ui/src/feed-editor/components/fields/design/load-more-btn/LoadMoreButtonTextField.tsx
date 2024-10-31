import React from "react";
import {TextField} from "spotlight/admin-common/components/fields/TextField";
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField";

export type Props = {
    disabled: boolean;
}

export function LoadMoreButtonTextField({disabled}: Props) {
    return (
        <FeedEditorField option="loadMoreBtnText" label="'Load more' text" disabled={disabled}>
            {props => <TextField {...props} />}
        </FeedEditorField>
    );
}
