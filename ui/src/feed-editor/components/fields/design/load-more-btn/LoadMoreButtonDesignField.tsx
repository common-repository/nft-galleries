import React from "react";
import {ButtonDesignFields} from "spotlight/admin-common/components/fields/ButtonDesignFields/ButtonDesignFields";
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField";

export type Props = {
    disabled: boolean;
}

const optionsToShow = {
    states: true,
    textColor: true,
    bgColor: true,
    border: {radius: true},
};

export function LoadMoreButtonDesignField({disabled}: Props) {
    return (
        <FeedEditorField option="loadMoreBtnDesign" disabled={disabled} wide noContainer>
            {props => <ButtonDesignFields{...props} show={optionsToShow} />}
        </FeedEditorField>
    );
}
