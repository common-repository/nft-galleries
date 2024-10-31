import React from "react";
import {NumberField} from "spotlight/admin-common/components/fields/NumberField";
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField";

export function HighlightFreqField() {
    return (
        <FeedEditorField option="highlightFreq" label="Highlight every" isResponsive proOnly>
            {props => (
                <NumberField
                    {...props}
                    emptyMin
                    min={1}
                    unit={["NFT", "NFTs"]}
                    placeholder="1"
                />
            )}
        </FeedEditorField>
    );
}
