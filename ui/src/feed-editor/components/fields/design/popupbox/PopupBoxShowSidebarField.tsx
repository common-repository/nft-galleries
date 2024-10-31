import React from "react";
import {CheckboxField} from "spotlight/admin-common/components/fields/CheckboxField/CheckboxField";
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField";

type Props = {
    disabled?: boolean;
}

export function PopupBoxShowSidebarField({disabled}: Props) {
    return (
        <FeedEditorField option="lightboxShowSidebar" label="Show sidebar" disabled={disabled} proOnly>
            {props => <CheckboxField {...props} />}
        </FeedEditorField>
    );
}
