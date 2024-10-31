import React from "react";
import {Select, SelectOption} from "spotlight/admin-common/components/fields/Select";
import {PopupBoxCtaStyle} from "spotlight/feed";
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField";
import {useSelector} from "react-redux";
import {selectFeedOption} from "spotlight/feed-editor/store/selectors";
import {pickOptionValue} from "spotlight/utils/jsx/pickOptionValue";

type Props = {
    disabled?: boolean;
}

const options: SelectOption[] = [
    {value: PopupBoxCtaStyle.LINK, label: "Text link"},
    {value: PopupBoxCtaStyle.BUTTON, label: "Button link"},
];

export function PopupBoxLinkStyleField({disabled}: Props) {
    const showSidebar = useSelector(selectFeedOption("lightboxShowSidebar"));

    return showSidebar && (
        <FeedEditorField
            option="lightboxCtaStyle"
            label="Link style"
            decorator={pickOptionValue}
            disabled={disabled}
            proOnly>
            {props => <Select {...props} options={options} />}
        </FeedEditorField>
    );
}
