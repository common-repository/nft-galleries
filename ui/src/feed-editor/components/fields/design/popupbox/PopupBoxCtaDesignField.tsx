import React from "react";
import {ButtonDesignFields} from "spotlight/admin-common/components/fields/ButtonDesignFields/ButtonDesignFields";
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField";

type Props = {
    disabled?: boolean;
}

const optionsToShow: ButtonDesignFields.Props["show"] = {
    states: true,
    textColor: true,
    bgColor: true,
    border: {radius: true},
};

export function PopupBoxCtaDesignField({disabled}: Props) {
    return (
        <FeedEditorField option="lightboxCtaDesign" disabled={disabled} proOnly wide noContainer>
            {props => <ButtonDesignFields {...props} show={optionsToShow} />}
        </FeedEditorField>
    );
}
