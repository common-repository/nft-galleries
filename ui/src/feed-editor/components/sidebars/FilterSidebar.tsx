import React from "react";
import {CaptionFiltersGroup} from "spotlight/feed-editor/components/groups/filter/CaptionFiltersGroup";
import {HashtagFiltersGroup} from "spotlight/feed-editor/components/groups/filter/HashtagFiltersGroup";

export function FilterSidebar() {
    return (
        <div>
            <CaptionFiltersGroup />
            <HashtagFiltersGroup />
        </div>
    );
}
