import React from "react";
import {FeedEditorGroup} from "spotlight/feed-editor/components/core/FeedEditorGroup/FeedEditorGroup";
import {HashtagWhitelistField} from "spotlight/feed-editor/components/fields/filter/HashtagWhitelistField";
import {HashtagBlacklistField} from "spotlight/feed-editor/components/fields/filter/HashtagBlacklistField";
import {FieldSet} from "spotlight/admin-common/components/fields/FieldSet/FieldSet";

export function HashtagFiltersGroup() {
    return (
        <FeedEditorGroup id="hashtag-filters" label="Hashtag filtering" proOnly>
            <FieldSet>
                <HashtagWhitelistField />
            </FieldSet>

            <FieldSet>
                <HashtagBlacklistField />
            </FieldSet>
        </FeedEditorGroup>
    );
}
