import React from "react";
import {Select, SelectOption} from "spotlight/admin-common/components/fields/Select";
import {SliderArrowPosition} from "spotlight/feed";
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField";
import {pickOptionValue} from "spotlight/utils/jsx/pickOptionValue";

const options: SelectOption[] = [
    {value: SliderArrowPosition.INSIDE, label: "Inside the slider"},
    {value: SliderArrowPosition.OUTSIDE, label: "Outside the slider"},
];

export function SliderArrowPosField() {
    return (
        <FeedEditorField
            option="sliderArrowPos"
            label="Arrow positions"
            decorator={pickOptionValue}
            isResponsive
            proOnly>
            {props => <Select {...props} options={options} />}
        </FeedEditorField>
    );
}

