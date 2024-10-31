import React from "react"
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField"
import {CheckboxField} from "spotlight/admin-common/components/fields/CheckboxField/CheckboxField"

type Props = {
    disabled?: boolean;
}

export function PopupBoxShowTraitsField({disabled}: Props) {
    return (
        <FeedEditorField option="lightboxShowTraits" label="Show traits" disabled={disabled} proOnly>
            {props => <CheckboxField {...props} />}
        </FeedEditorField>
    );
}
