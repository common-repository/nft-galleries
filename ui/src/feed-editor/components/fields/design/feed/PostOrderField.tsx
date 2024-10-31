import React from "react";
import {Select, SelectOption} from "spotlight/admin-common/components/fields/Select";
import {PostOrder} from "spotlight/feed";
import {pickOptionValue} from "spotlight/utils/jsx/pickOptionValue";
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField";

const options: SelectOption[] = [
    {value: PostOrder.DATE_DESC, label: "Most recent first"},
    {value: PostOrder.DATE_ASC, label: "Oldest first"},
    {value: PostOrder.POPULARITY_DESC, label: "Most popular first"},
    {value: PostOrder.POPULARITY_ASC, label: "Least popular first"},
    {value: PostOrder.RANDOM, label: "Random"},
];

export function PostOrderField() {
    return (
        <FeedEditorField option="postOrder" label="Post order" decorator={pickOptionValue}>
            {props => <Select {...props} options={options} />}
        </FeedEditorField>
    );
}
