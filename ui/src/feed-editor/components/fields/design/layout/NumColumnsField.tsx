import React from "react";
import {NumberField} from "spotlight/admin-common/components/fields/NumberField";
import {Device, Responsive} from "spotlight/utils/responsive";
import {useSelector} from "react-redux";
import {selectFeedOption, selectPreviewDevice} from "spotlight/feed-editor/store/selectors";
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField";

export function NumColumnsField() {
    const fullVal = useSelector(selectFeedOption("numColumns"));
    const desktopVal = Responsive.get(fullVal, Device.DESKTOP);
    const device = useSelector(selectPreviewDevice);
    const isDesktop = device === Device.DESKTOP;

    return (
        <FeedEditorField option="numColumns" label="Number of columns" isResponsive>
            {props => (
                <NumberField
                    {...props}
                    min={isDesktop ? 1 : 0}
                    unit={["column", "columns"]}
                    placeholder={isDesktop ? "1" : desktopVal}
                    emptyMin={!isDesktop}
                />
            )}
        </FeedEditorField>
    );
}
