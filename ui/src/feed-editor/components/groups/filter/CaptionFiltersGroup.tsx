import React from "react";
import {FeedEditorGroup} from "spotlight/feed-editor/components/core/FeedEditorGroup/FeedEditorGroup";
import {CaptionWhitelistField} from "spotlight/feed-editor/components/fields/filter/CaptionWhitelistField";
import {CaptionBlacklistField} from "spotlight/feed-editor/components/fields/filter/CaptionBlacklistField";
import {FieldSet} from "spotlight/admin-common/components/fields/FieldSet/FieldSet";

export function CaptionFiltersGroup() {
    return (
        <FeedEditorGroup id="caption-filters" label="Caption filtering" proOnly>
            <FieldSet>
                <CaptionWhitelistField />
            </FieldSet>

            <FieldSet>
                <CaptionBlacklistField />
            </FieldSet>
        </FeedEditorGroup>
    );
}
